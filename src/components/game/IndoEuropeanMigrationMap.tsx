'use client';

/**
 * Renders eurasia.png with Indo-European migration overlay.
 *
 * ViewBox 1000 × 562 — calibrated for a Eurasian map covering
 *   −10 °W → 145 °E  (155 ° wide)   x = (lng + 10) / 155 * 1000
 *   72 °N  →  10 °N  (62 ° tall)    y = (72 − lat)  / 62  * 562
 *
 * Key anchors:
 *   Ukraine / Pontic steppe  35 °E, 47 °N  →  290, 227
 *   Bangladesh (east limit)  90 °E, 23 °N  →  645, 445
 */
export function IndoEuropeanMigrationMap({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl select-none ${className}`}>
      <img
        src="/maps/eurasia.png"
        alt="Eurasia physical map"
        className="block w-full"
        draggable={false}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 562"
        preserveAspectRatio="none"
      >
        <defs>
          <marker id="arr" markerWidth="9" markerHeight="7"
            refX="8" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 9 3.5, 0 7" fill="#111" />
          </marker>
        </defs>

        {/* ── Era regions ─────────────────────────────────────────────────────
            All drawn largest-first so smaller regions paint on top.
            Eastern limit for all regions: Bangladesh ~90 °E → x ≈ 645
        ─────────────────────────────────────────────────────────────────── */}

        {/* Yellow — ~1000 BC maximum extent */}
        <polygon
          points="
            13,202  32,165  65,137  142,91  206,128
            258,146  323,164  400,173  465,202  503,254
            548,336  645,445  581,490  503,454  432,454
            368,418  323,381  290,345  239,327  206,327
            161,317  116,308   77,264   52,254   19,290
          "
          fill="#e8c84a" fillOpacity={0.38}
          stroke="#c8a828" strokeWidth={1} strokeOpacity={0.55}
        />

        {/* Orange — ~2000 BC intermediate */}
        <polygon
          points="
            65,155  142,128  206,155  271,164  348,191
            419,218  490,254  529,418  452,445  387,445
            323,399  303,363  277,336  239,327  206,317
            181,290  142,272   97,236   65,202   45,165
          "
          fill="#d4883a" fillOpacity={0.42}
          stroke="#b06820" strokeWidth={1} strokeOpacity={0.55}
        />

        {/* Blue — ~4000 BC core: Pontic-Caspian steppe / Ukraine */}
        <polygon
          points="
            226,155  258,137  297,146  348,173  361,209
            335,245  303,264  258,264  219,236  206,202  219,173
          "
          fill="#5572b8" fillOpacity={0.52}
          stroke="#3a529f" strokeWidth={1.5} strokeOpacity={0.65}
        />

        {/* ── Migration arrows ─────────────────────────────────────────────────
            Origin: Ukraine / Pontic steppe  35 °E, 47 °N  →  ~(290, 227)
        ─────────────────────────────────────────────────────────────────── */}

        {/* 1 · Northwest → Scandinavia / Britain */}
        <path d="M 287,223 C 240,165 200,120 161,80"
          stroke="#111" strokeWidth={3.5} fill="none" markerEnd="url(#arr)" />

        {/* 2 · West → Central & Western Europe */}
        <path d="M 285,225 C 222,182 158,190 77,209"
          stroke="#111" strokeWidth={3.5} fill="none" markerEnd="url(#arr)" />

        {/* 3 · Southwest → Balkans / Greece */}
        <path d="M 288,230 C 264,268 238,288 206,298"
          stroke="#111" strokeWidth={3.5} fill="none" markerEnd="url(#arr)" />

        {/* 4 · South → Anatolia */}
        <path d="M 291,233 C 290,270 284,300 271,315"
          stroke="#111" strokeWidth={3.5} fill="none" markerEnd="url(#arr)" />

        {/* 5 · Southeast → Iran / Persia */}
        <path d="M 297,234 C 345,280 392,328 416,352"
          stroke="#111" strokeWidth={3.5} fill="none" markerEnd="url(#arr)" />

        {/* 6 · East → Central Asia (Bactria / Uzbekistan) */}
        <path d="M 298,225 C 362,198 432,208 480,288"
          stroke="#111" strokeWidth={3.5} fill="none" markerEnd="url(#arr)" />

        {/* 7 · Large arc → India / Bangladesh (east-northeast then sweeps south) */}
        <path d="M 295,222 C 410,145 560,185 635,350 C 645,395 644,430 644,443"
          stroke="#111" strokeWidth={3.5} fill="none" markerEnd="url(#arr)" />

        {/* 8 · Northeast → Kazakhstan steppe interior */}
        <path d="M 298,220 C 375,172 445,174 500,200"
          stroke="#111" strokeWidth={3.5} fill="none" markerEnd="url(#arr)" />

        {/* ── Legend ──────────────────────────────────────────────────────── */}
        <rect x="14" y="390" width="195" height="158" rx="5"
          fill="#080812" fillOpacity={0.74} />

        <text x="26" y="412"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize={13.5} fontWeight="bold" fill="#f0e0b0">
          Indo-European Migration
        </text>

        {([['#5572b8', '4000 BC'], ['#d4883a', '2000 BC'], ['#e8c84a', '1000 BC']] as const).map(
          ([color, label], i) => (
            <g key={label} transform={`translate(26,${430 + i * 24})`}>
              <rect width={16} height={13} rx={2} fill={color} fillOpacity={0.78} />
              <text x={22} y={12}
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize={12} fill="#e0d0a0">
                {label}
              </text>
            </g>
          )
        )}

        <line x1="26" y1="514" x2="60" y2="514"
          stroke="#111" strokeWidth={3} markerEnd="url(#arr)" />
        <text x="70" y="518"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize={12} fill="#e0d0a0">
          Migration route
        </text>
      </svg>
    </div>
  );
}
