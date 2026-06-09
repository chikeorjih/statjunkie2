"use client";

interface DonutRankChartProps {
  rank: number;        // 1-based rank (0 = unknown / no data)
  total?: number;      // total teams, default 32
  size?: number;       // outer diameter in px, default 80
  strokeWidth?: number;
  label: string;       // e.g. "Standings"
  subLabel?: string;   // e.g. "87 PTS"
}

function rankColor(rank: number, total: number): string {
  const pct = rank / total;
  if (pct <= 0.25) return "#30D158"; // top quartile — green
  if (pct <= 0.5)  return "#FFD60A"; // upper-mid   — gold
  if (pct <= 0.75) return "#FF9F0A"; // lower-mid   — orange
  return "#FF453A";                  // bottom       — red
}

export function DonutRankChart({
  rank,
  total = 32,
  size = 80,
  strokeWidth = 7,
  label,
  subLabel,
}: DonutRankChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // rank 1 → almost full; rank 32 → almost empty
  const fillPct = rank > 0 ? (total + 1 - rank) / total : 0;
  const dashOffset = circumference * (1 - fillPct);
  const color = rank > 0 ? rankColor(rank, total) : "#48484a";

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-2.5">
      {/* Donut */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
          aria-label={`${label}: ${rank > 0 ? `rank ${rank} of ${total}` : "no data"}`}
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
          />
          {/* Fill arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition:
                "stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease",
            }}
          />
        </svg>

        {/* Center text (counter-rotate to cancel parent -90deg) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[18px] font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {rank > 0 ? rank : "—"}
          </span>
          <span className="mt-0.5 text-[9px] leading-none text-text-muted">
            /{total}
          </span>
        </div>
      </div>

      {/* Labels */}
      <div className="text-center">
        <p className="text-[12px] font-semibold text-white leading-tight">
          {label}
        </p>
        {subLabel && (
          <p className="mt-0.5 text-[11px] text-text-secondary leading-tight">
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );
}
