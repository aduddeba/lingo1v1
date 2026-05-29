'use client';

import { useMemo } from 'react';
import type { FeatureCollection, Polygon } from 'geojson';

// ─── Projection (equirectangular) ────────────────────────────────────────────

const W = 1000;
const H = 500;

type Coord = readonly [number, number];

function px([lng, lat]: Coord): [number, number] {
  return [(lng + 180) / 360 * W, (90 - lat) / 180 * H];
}

function ringToD(ring: readonly Coord[]): string {
  const parts: string[] = [];
  for (let i = 0; i < ring.length; i++) {
    const c = ring[i];
    if (!c) continue;
    const [x, y] = px(c);
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return parts.join('') + 'Z';
}

// ─── Simplified continent outlines [lng, lat] ─────────────────────────────────
// Approximate coastal waypoints; recognisable at world scale.

const LAND: readonly (readonly Coord[])[] = [
  // North America
  [[-168,72],[-95,74],[-53,47],[-67,45],[-76,35],[-80,25],[-88,15],
   [-97,19],[-110,23],[-117,32],[-124,42],[-124,49],[-168,65]],
  // South America
  [[-82,12],[-60,12],[-35,-5],[-35,-10],[-40,-23],[-52,-34],
   [-53,-55],[-68,-55],[-75,-45],[-70,-20],[-75,-5],[-82,0]],
  // Europe
  [[-9,36],[-9,44],[3,43],[8,46],[15,48],[24,45],[30,46],
   [37,41],[30,50],[25,56],[22,58],[10,63],[15,70],[28,72],
   [28,65],[26,55],[10,57],[3,52],[-5,48],[-9,43]],
  // Africa
  [[-6,36],[37,37],[43,25],[51,12],[51,-27],[35,-35],[18,-35],
   [12,-18],[9,2],[2,5],[-5,8],[-15,12],[-17,14],[-13,20],[-8,28],[-3,33]],
  // Asia (incl. Middle East & Indian subcontinent)
  [[26,72],[180,72],[180,0],[150,0],[142,-10],[120,5],[103,2],
   [100,6],[97,8],[80,8],[72,22],[65,12],[55,22],[45,25],
   [37,37],[37,41],[30,46],[30,50],[26,55],[28,65]],
  // Oceania / Australia
  [[114,-22],[118,-20],[128,-14],[142,-10],[150,-22],[154,-38],
   [144,-38],[128,-32],[114,-32]],
  // Greenland
  [[-52,72],[-20,72],[-18,65],[-28,62],[-45,62]],
] as const;

// Region labels for geographic orientation
const LABELS: readonly { text: string; pos: Coord }[] = [
  { text: 'EUROPE',            pos: [15,  52] },
  { text: 'E. ASIA',           pos: [122, 37] },
  { text: 'SE ASIA',           pos: [112, 10] },
  { text: 'S. ASIA',           pos: [78,  24] },
  { text: 'W. ASIA / N. AFR.', pos: [38,  28] },
  { text: 'SUB-SAHARAN AFR.',  pos: [22,   0] },
] as const;

// ─── Blob geometry ────────────────────────────────────────────────────────────
// Blobs from the generator are 90–200 km radius, which is < 2° — invisible at
// world scale. We project the centroid and scale the radius ×10 for visibility.

function blobCircle(poly: Polygon): { cx: number; cy: number; r: number } | null {
  const ring = poly.coordinates[0];
  if (!ring || ring.length < 3) return null;
  const n = ring.length - 1;           // last vertex = first (closed ring)
  let sumLng = 0, sumLat = 0;
  for (let i = 0; i < n; i++) {
    sumLng += ring[i]?.[0] ?? 0;
    sumLat += ring[i]?.[1] ?? 0;
  }
  const cLng = sumLng / n;
  const cLat = sumLat / n;
  let sumDist = 0;
  for (let i = 0; i < n; i++) {
    const dLng = (ring[i]?.[0] ?? 0) - cLng;
    const dLat = (ring[i]?.[1] ?? 0) - cLat;
    sumDist += Math.sqrt(dLng * dLng + dLat * dLat);
  }
  const radiusDeg = sumDist / n;
  const [cx, cy] = px([cLng, cLat]);
  const r = Math.max(14, radiusDeg * 10 * (W / 360));
  return { cx, cy, r };
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface SvgWorldMapProps {
  overlay?: FeatureCollection<Polygon> | null;
  onMapClick?: (coord: [number, number]) => void;
  pin?: [number, number] | null;
  originMarker?: [number, number] | null;
}

export function SvgWorldMap({
  overlay = null,
  onMapClick,
  pin = null,
  originMarker = null,
}: SvgWorldMapProps) {
  const landPaths = useMemo(() => LAND.map((ring) => ringToD(ring)), []);

  const blobs = useMemo(() => {
    if (!overlay) return [];
    return overlay.features
      .map((f) => blobCircle(f.geometry))
      .filter((b): b is NonNullable<typeof b> => b !== null);
  }, [overlay]);

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!onMapClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const svgY = ((e.clientY - rect.top) / rect.height) * H;
    onMapClick([(svgX / W) * 360 - 180, 90 - (svgY / H) * 180]);
  }

  const antarcticaY = px([0, -60])[1];
  const pinPt   = pin          ? px(pin)          : null;
  const originPt = originMarker ? px(originMarker) : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full h-full select-none${onMapClick ? ' cursor-crosshair' : ''}`}
      onClick={handleClick}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ocean */}
      <rect width={W} height={H} fill="#1e293b" />

      {/* Antarctica strip */}
      <rect x={0} y={antarcticaY} width={W} height={H - antarcticaY} fill="#2a3f54" />

      {/* Graticule */}
      {([-60, -30, 30, 60] as const).map((lat) => {
        const y = px([0, lat])[1];
        return <line key={lat} x1={0} y1={y} x2={W} y2={y} stroke="#fff" strokeOpacity={0.06} strokeWidth={0.5} />;
      })}
      {([-120, -60, 0, 60, 120] as const).map((lng) => {
        const x = px([lng, 0])[0];
        return <line key={lng} x1={x} y1={0} x2={x} y2={H} stroke="#fff" strokeOpacity={0.06} strokeWidth={0.5} />;
      })}
      {/* Equator — slightly more prominent */}
      <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#fff" strokeOpacity={0.14} strokeWidth={0.8} strokeDasharray="4 3" />

      {/* Land masses */}
      {landPaths.map((d, i) => (
        <path key={i} d={d} fill="#2d4060" stroke="#3d5270" strokeWidth={0.8} />
      ))}

      {/* Region orientation labels */}
      {LABELS.map(({ text, pos }) => {
        const [x, y] = px(pos);
        return (
          <text
            key={text}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="#fff"
            fillOpacity={0.28}
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.08em"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {text}
          </text>
        );
      })}

      {/* Overlay blobs — centroid circles scaled for world-map visibility */}
      {blobs.map((b, i) => (
        <circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill="#6366f1"
          fillOpacity={0.45}
          stroke="#818cf8"
          strokeWidth={1.5}
        />
      ))}

      {/* User pin — indigo dot with pulse ring */}
      {pinPt && (
        <g transform={`translate(${pinPt[0].toFixed(1)},${pinPt[1].toFixed(1)})`}>
          <circle r={6} fill="#6366f1" stroke="white" strokeWidth={2} />
          <circle r={6} fill="none" stroke="#6366f1" strokeWidth={1.5}>
            <animate attributeName="r" values="6;22;6" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* True-origin marker — emerald crosshair, revealed after lock */}
      {originPt && (
        <g transform={`translate(${originPt[0].toFixed(1)},${originPt[1].toFixed(1)})`}>
          <line x1={-14} y1={0} x2={14} y2={0} stroke="#10b981" strokeWidth={2} />
          <line x1={0} y1={-14} x2={0} y2={14} stroke="#10b981" strokeWidth={2} />
          <circle r={8} fill="#10b981" stroke="white" strokeWidth={2} />
          <circle r={3} fill="white" />
        </g>
      )}
    </svg>
  );
}
