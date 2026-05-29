import type { FeatureCollection, Feature, Polygon, Position } from 'geojson';

// ─── Public types ─────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MapGeneratorInput {
  seed: number;
  difficulty: Difficulty;
  regionId: string;
}

export interface GeneratedMapSet {
  real: FeatureCollection<Polygon>;
  forged: FeatureCollection<Polygon>;
  /** GeoJSON convention: [lng, lat] */
  trueOrigin: [number, number];
  difficulty: Difficulty;
  seed: number;
}

// ─── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
// Given the same seed, always produces the same sequence.

function createRng(seed: number) {
  let s = seed >>> 0;
  return (): number => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Geographic data ──────────────────────────────────────────────────────────

type Coord = [number, number]; // [lng, lat]

type ImpossibleKey = 'far' | 'near' | 'barrier';

interface RegionGeo {
  /** Known linguistic hub cities within the region. */
  hubs: Coord[];
  /**
   * Impossible satellite locations keyed by how obvious the forgery is:
   *   far     — different continent (easy to spot)
   *   near    — adjacent wrong region (medium)
   *   barrier — just across a geographic barrier: sea, mountain range (hard)
   */
  impossible: Record<ImpossibleKey, Coord[]>;
}

const REGION_GEO: Record<string, RegionGeo> = {
  europe: {
    hubs: [
      [13.4, 52.5],   // Berlin
      [2.35, 48.85],  // Paris
      [-3.7, 40.4],   // Madrid
      [12.5, 41.9],   // Rome
      [14.4, 50.1],   // Prague
      [18.1, 59.3],   // Stockholm
    ],
    impossible: {
      far:     [[139.7, 35.7], [72.8, 19.0], [3.4, 6.4]],         // Tokyo, Mumbai, Lagos
      near:    [[31.2, 30.1], [36.8, -1.3], [55.3, 25.3]],        // Cairo, Nairobi, Dubai
      barrier: [[10.0, 34.0], [-5.0, 36.0], [33.0, 35.2]],        // Tunisia, Morocco coast, Cyprus
    },
  },
  east_asia: {
    hubs: [
      [116.4, 39.9],  // Beijing
      [121.5, 31.2],  // Shanghai
      [126.9, 37.6],  // Seoul
      [139.7, 35.7],  // Tokyo
      [114.1, 22.4],  // Hong Kong
    ],
    impossible: {
      far:     [[2.35, 48.85], [36.8, -1.3], [-77.0, 38.9]],      // Paris, Nairobi, Washington DC
      near:    [[100.5, 13.8], [72.8, 19.0], [55.3, 25.3]],       // Bangkok, Mumbai, Dubai
      barrier: [[150.0, 35.0], [91.1, 29.6], [130.0, -10.0]],     // Pacific, Lhasa (Himalayas), N Australia
    },
  },
  southeast_asia: {
    hubs: [
      [100.5, 13.8],  // Bangkok
      [106.7, 10.8],  // Ho Chi Minh City
      [106.8, -6.2],  // Jakarta
      [120.9, 14.6],  // Manila
      [101.7, 3.1],   // Kuala Lumpur
    ],
    impossible: {
      far:     [[2.35, 48.85], [28.0, -26.2], [-43.2, -22.9]],    // Paris, Johannesburg, Rio
      near:    [[72.8, 19.0], [116.4, 39.9], [44.4, 33.3]],       // Mumbai, Beijing, Baghdad
      barrier: [[115.0, -10.0], [95.0, 25.0], [135.0, 10.0]],     // Timor Sea, Myanmar highlands, Pacific edge
    },
  },
  south_asia: {
    hubs: [
      [77.2, 28.6],   // New Delhi
      [72.8, 19.0],   // Mumbai
      [88.4, 22.6],   // Kolkata
      [80.3, 13.1],   // Chennai
      [67.0, 24.9],   // Karachi
    ],
    impossible: {
      far:     [[2.35, 48.85], [139.7, 35.7], [-43.2, -22.9]],    // Paris, Tokyo, Rio
      near:    [[44.4, 33.3], [100.5, 13.8], [36.8, -1.3]],       // Baghdad, Bangkok, Nairobi
      barrier: [[91.1, 29.6], [50.0, 25.0], [70.0, 55.0]],        // Lhasa (Himalayas), Arabia (sea), Central Asia
    },
  },
  west_asia_north_africa: {
    hubs: [
      [44.4, 33.3],   // Baghdad
      [31.2, 30.1],   // Cairo
      [36.3, 33.5],   // Damascus
      [51.4, 35.7],   // Tehran
      [-7.6, 33.6],   // Casablanca
    ],
    impossible: {
      far:     [[139.7, 35.7], [120.9, 14.6], [-77.0, 38.9]],     // Tokyo, Manila, Washington DC
      near:    [[13.4, 52.5], [72.8, 19.0], [36.8, -1.3]],        // Berlin, Mumbai, Nairobi
      barrier: [[45.0, 15.0], [25.0, 10.0], [60.0, 35.0]],        // Arabian Sea shore, Sahel, Central Asia
    },
  },
  sub_saharan_africa: {
    hubs: [
      [36.8, -1.3],   // Nairobi
      [3.4, 6.4],     // Lagos
      [28.0, -26.2],  // Johannesburg
      [32.6, 0.3],    // Kampala
      [18.6, -4.3],   // Kinshasa
    ],
    impossible: {
      far:     [[139.7, 35.7], [2.35, 48.85], [-77.0, 38.9]],     // Tokyo, Paris, Washington DC
      near:    [[31.2, 30.1], [55.3, 25.3], [72.8, 19.0]],        // Cairo, Dubai, Mumbai
      barrier: [[20.0, 20.0], [45.0, 12.0], [-20.0, 5.0]],        // Sahara (into N Africa), Horn→Arabia, Atlantic coast
    },
  },
};

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function degToRad(d: number): number {
  return (d * Math.PI) / 180;
}

/**
 * Builds an approximate circle polygon with per-vertex jitter for a natural look.
 * Uses equirectangular projection — accurate enough for regional scales.
 */
function diskPolygon(
  lng: number,
  lat: number,
  radiusKm: number,
  sides: number,
  rng: () => number,
): Polygon {
  const latPerKm = 1 / 111.32;
  const lngPerKm = 1 / (111.32 * Math.cos(degToRad(lat)));
  const ring: Position[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const r = radiusKm * (0.75 + rng() * 0.5); // ±25% jitter
    ring.push([
      lng + Math.cos(angle) * r * lngPerKm,
      lat + Math.sin(angle) * r * latPerKm,
    ]);
  }
  ring.push(ring[0]!); // close ring
  return { type: 'Polygon', coordinates: [ring] };
}

/** Returns a coordinate randomly offset from `origin` by up to `maxKm`. */
function scatterCoord([lng, lat]: Coord, maxKm: number, rng: () => number): Coord {
  const angle = rng() * Math.PI * 2;
  const dist = rng() * maxKm;
  const latPerKm = 1 / 111.32;
  const lngPerKm = 1 / (111.32 * Math.cos(degToRad(lat)));
  return [
    lng + Math.cos(angle) * dist * lngPerKm,
    lat + Math.sin(angle) * dist * latPerKm,
  ];
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function feature(polygon: Polygon, kind: string): Feature<Polygon> {
  return { type: 'Feature', geometry: polygon, properties: { kind } };
}

// ─── Difficulty config ────────────────────────────────────────────────────────

interface DiffConfig {
  /** Number of contiguous core blobs. */
  blobCount: number;
  /** Max distance (km) each blob is scattered from the hub. Controls spread. */
  spreadKm: number;
  /** Radius (km) of each core blob. */
  radiusKm: number;
  /** Radius (km) of the impossible satellite blob. */
  extraRadius: number;
  /** Which impossibility tier to use. */
  impossibleKey: ImpossibleKey;
}

const DIFF_CONFIG: Record<Difficulty, DiffConfig> = {
  //            blobs  spread  radius  extra   tier
  easy:   { blobCount: 3, spreadKm:  80, radiusKm: 150, extraRadius: 200, impossibleKey: 'far'     },
  medium: { blobCount: 4, spreadKm: 120, radiusKm: 110, extraRadius: 150, impossibleKey: 'near'    },
  hard:   { blobCount: 5, spreadKm: 150, radiusKm:  90, extraRadius:  90, impossibleKey: 'barrier' },
};

// ─── Main generator ───────────────────────────────────────────────────────────

/**
 * Deterministically generates a real and a forged language-distribution map.
 *
 * Real map  — `blobCount` contiguous blobs within the expected region.
 * Forged map — identical core blobs plus one geographically impossible satellite
 *              whose distance from the core encodes difficulty.
 *
 * Calling with the same `seed`, `difficulty`, and `regionId` always returns
 * identical GeoJSON.
 */
export function generateMapSet(input: MapGeneratorInput): GeneratedMapSet {
  const { seed, difficulty, regionId } = input;
  const geo = REGION_GEO[regionId];
  if (!geo) throw new Error(`Unknown regionId: "${regionId}"`);

  const rng = createRng(seed);
  const cfg = DIFF_CONFIG[difficulty];

  // Hub — the linguistic center of gravity for this region/seed combination.
  const hub = pick(geo.hubs, rng);
  const trueOrigin: [number, number] = [hub[0], hub[1]];

  // Core blobs shared by both maps: scattered around the hub, overlapping enough
  // to read as a contiguous regional distribution.
  const coreFeatures: Feature<Polygon>[] = [];
  for (let i = 0; i < cfg.blobCount; i++) {
    const center = scatterCoord(hub, cfg.spreadKm, rng);
    coreFeatures.push(feature(diskPolygon(center[0], center[1], cfg.radiusKm, 10, rng), 'core'));
  }

  // Impossible satellite — what makes the forged map wrong.
  const satelliteCoord = pick(geo.impossible[cfg.impossibleKey], rng);
  const satelliteFeature = feature(
    diskPolygon(satelliteCoord[0], satelliteCoord[1], cfg.extraRadius, 10, rng),
    'satellite',
  );

  return {
    real:        { type: 'FeatureCollection', features: coreFeatures },
    forged:      { type: 'FeatureCollection', features: [...coreFeatures, satelliteFeature] },
    trueOrigin,
    difficulty,
    seed,
  };
}
