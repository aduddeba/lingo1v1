'use client';

import { useMemo, useState } from 'react';
import type { PublicRatingHistoryEntry } from '@/lib/auth/users';

interface EloHistoryChartProps {
  history: PublicRatingHistoryEntry[];
}

interface ChartPoint extends PublicRatingHistoryEntry {
  x: number;
  y: number;
  label: string;
}

const WIDTH = 720;
const HEIGHT = 280;
const PADDING = { top: 24, right: 24, bottom: 40, left: 52 };

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(timestamp);
}

export function EloHistoryChart({ history }: EloHistoryChartProps) {
  const [activePoint, setActivePoint] = useState<ChartPoint | null>(null);
  const chart = useMemo(() => buildChart(history), [history]);

  if (history.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
        <p className="max-w-sm text-sm text-gray-500">
          Play a ranked match to start building your Elo history.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <svg
        className="h-72 w-full overflow-visible"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Elo rating history over ranked matches"
        onMouseLeave={() => setActivePoint(null)}
      >
        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={HEIGHT - PADDING.bottom}
          y2={HEIGHT - PADDING.bottom}
          stroke="#e5e7eb"
        />
        <line
          x1={PADDING.left}
          x2={PADDING.left}
          y1={PADDING.top}
          y2={HEIGHT - PADDING.bottom}
          stroke="#e5e7eb"
        />

        {chart.yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={tick.y}
              y2={tick.y}
              stroke="#f3f4f6"
            />
            <text x={PADDING.left - 12} y={tick.y + 4} textAnchor="end" className="fill-gray-400 text-xs">
              {tick.value}
            </text>
          </g>
        ))}

        <path
          d={`${chart.areaPath} L ${chart.points.at(-1)?.x ?? PADDING.left} ${HEIGHT - PADDING.bottom} L ${PADDING.left} ${HEIGHT - PADDING.bottom} Z`}
          fill="#e0f2fe"
          opacity="0.7"
        />
        <path d={chart.path} fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />

        {chart.points.map((point, index) => (
          <g key={point.matchId}>
            <circle
              cx={point.x}
              cy={point.y}
              r={activePoint?.matchId === point.matchId ? 6 : 4}
              className="cursor-pointer fill-white stroke-sky-600"
              strokeWidth="3"
              tabIndex={0}
              aria-label={`${point.label}: ${point.ratingAfter} Elo after match ${index + 1}`}
              onFocus={() => setActivePoint(point)}
              onMouseEnter={() => setActivePoint(point)}
            />
            {(index === 0 || index === chart.points.length - 1) && (
              <text x={point.x} y={HEIGHT - 12} textAnchor="middle" className="fill-gray-400 text-xs">
                {index === 0 ? 'First' : 'Latest'}
              </text>
            )}
          </g>
        ))}
      </svg>

      {activePoint && (
        <div
          className="pointer-events-none absolute rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${(activePoint.x / WIDTH) * 100}%`,
            top: `${Math.max(8, activePoint.y - 56)}px`,
            transform: activePoint.x > WIDTH - 180 ? 'translateX(-100%)' : 'translateX(-10%)',
          }}
        >
          <p className="font-semibold text-gray-900">{activePoint.ratingAfter} Elo</p>
          <p className={activePoint.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}>
            {activePoint.ratingChange >= 0 ? '+' : ''}
            {activePoint.ratingChange}
          </p>
          <p className="text-gray-500">{activePoint.label}</p>
          <p className="font-mono text-gray-400">{activePoint.matchId}</p>
        </div>
      )}
    </div>
  );
}

function buildChart(history: PublicRatingHistoryEntry[]) {
  const ratings = history.flatMap((entry) => [entry.ratingBefore, entry.ratingAfter]);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const padding = Math.max(24, Math.round((maxRating - minRating) * 0.15));
  const yMin = minRating - padding;
  const yMax = maxRating + padding;
  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const denominator = Math.max(1, history.length - 1);

  const points = history.map((entry, index) => {
    const x = PADDING.left + (index / denominator) * chartWidth;
    const y = PADDING.top + ((yMax - entry.ratingAfter) / Math.max(1, yMax - yMin)) * chartHeight;

    return {
      ...entry,
      x,
      y,
      label: formatDate(entry.createdAt),
    };
  });

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const yTicks = [0, 0.5, 1].map((ratio) => {
    const value = Math.round(yMax - ratio * (yMax - yMin));
    return {
      value,
      y: PADDING.top + ratio * chartHeight,
    };
  });

  return { points, path, areaPath: path, yTicks };
}
