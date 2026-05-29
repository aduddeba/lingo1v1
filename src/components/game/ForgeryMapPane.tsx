'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const OVERLAY_SOURCE_ID = 'forgery-overlay';
const OVERLAY_FILL_LAYER_ID = 'forgery-overlay-fill';
const OVERLAY_LINE_LAYER_ID = 'forgery-overlay-line';

interface ForgeryMapPaneProps {
  zoom?: number;
  center?: [number, number];
  autoFit?: boolean;
  overlay?: GeoJSON.FeatureCollection | GeoJSON.Feature | null;
  fillOpacity?: number;
  onMapClick?: (coord: [number, number]) => void;
  pin?: [number, number] | null;
  originMarker?: [number, number] | null;
}

function bboxFromCollection(fc: GeoJSON.FeatureCollection): [number, number, number, number] | null {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const f of fc.features) {
    if (f.geometry.type !== 'Polygon') continue;
    for (const ring of f.geometry.coordinates) {
      for (const pt of ring) {
        const lng = pt[0] ?? 0;
        const lat = pt[1] ?? 0;
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
  return isFinite(minLng) ? [minLng, minLat, maxLng, maxLat] : null;
}

export function ForgeryMapPane({
  zoom = 2,
  center = [0, 20],
  autoFit = false,
  overlay = null,
  fillOpacity = 0.35,
  onMapClick,
  pin = null,
  originMarker = null,
}: ForgeryMapPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onMapClickRef = useRef(onMapClick);
  const pinMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => { onMapClickRef.current = onMapClick; }, [onMapClick]);

  // Mount map once
  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center,
      zoom,
      dragRotate: false,
      pitchWithRotate: false,
    });

    map.touchZoomRotate.disableRotation();

    map.on('click', (e) => {
      onMapClickRef.current?.([e.lngLat.lng, e.lngLat.lat]);
    });

    map.on('load', () => {
      const emptyCollection: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      const data = overlay ?? emptyCollection;

      map.addSource(OVERLAY_SOURCE_ID, { type: 'geojson', data });

      map.addLayer({
        id: OVERLAY_FILL_LAYER_ID,
        type: 'fill',
        source: OVERLAY_SOURCE_ID,
        paint: { 'fill-color': '#6366f1', 'fill-opacity': fillOpacity },
      });

      map.addLayer({
        id: OVERLAY_LINE_LAYER_ID,
        type: 'line',
        source: OVERLAY_SOURCE_ID,
        paint: { 'line-color': '#818cf8', 'line-width': 2 },
      });

      if (autoFit && overlay?.type === 'FeatureCollection') {
        const bbox = bboxFromCollection(overlay as GeoJSON.FeatureCollection);
        if (bbox) {
          map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
            padding: 60,
            maxZoom: 7,
            duration: 0,
          });
        }
      }
    });

    mapRef.current = map;
    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update cursor when onMapClick changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = onMapClick ? 'crosshair' : '';
  }, [onMapClick]);

  // Sync overlay data
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    const source = map.getSource(OVERLAY_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    source?.setData(overlay ?? { type: 'FeatureCollection', features: [] });
  }, [overlay]);

  // Sync fill opacity
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    map.setPaintProperty(OVERLAY_FILL_LAYER_ID, 'fill-opacity', fillOpacity);
  }, [fillOpacity]);

  // Sync user pin marker (indigo)
  useEffect(() => {
    pinMarkerRef.current?.remove();
    pinMarkerRef.current = null;
    const map = mapRef.current;
    if (map && pin) {
      pinMarkerRef.current = new mapboxgl.Marker({ color: '#6366f1' })
        .setLngLat(pin)
        .addTo(map);
    }
  }, [pin]);

  // Sync true-origin marker (emerald), shown on reveal
  useEffect(() => {
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    const map = mapRef.current;
    if (map && originMarker) {
      originMarkerRef.current = new mapboxgl.Marker({ color: '#10b981' })
        .setLngLat(originMarker)
        .addTo(map);
    }
  }, [originMarker]);

  return <div ref={containerRef} className="w-full h-full" />;
}
