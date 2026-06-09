"use client";

export interface RadarAxis {
  label: string;
  value: number;      // 0–1 normalised
  display: string;    // raw value for label, e.g. "28" or "+12"
}

interface RadarChartProps {
  axes: RadarAxis[];  // must be exactly 4
  size?: number;
  color?: string;
}

function toXY(cx: number, cy: number, angle: number, r: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function polygonPath(points: { x: number; y: number }[]) {
  return (
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    " Z"
  );
}

// Horizontal text anchor based on which side of centre the label sits
function textAnchorFor(px: number, cx: number) {
  const dx = px - cx;
  return (dx < -4 ? "end" : dx > 4 ? "start" : "middle") as React.SVGAttributes<SVGTextElement>["textAnchor"];
}

// Top y-coordinate for the two-line label group (label line, then stat line below)
// Groups extend away from the chart centre so they never overlap the ring.
function labelGroupY(py: number, cy: number) {
  const dy = py - cy;
  if (dy < -4) return py - 22; // top axis  → group floats above anchor
  if (dy >  4) return py;      // bottom axis → group hangs below anchor
  return py - 11;              // left / right → group centred on anchor
}

export function RadarChart({
  axes,
  size = 260,
  color = "#FFD60A",
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.30;          // radius of outermost ring
  const labelR = maxR + size * 0.16; // radius where labels sit
  // Extra viewBox padding so axis labels (esp. "PLUS/MINUS") aren't clipped
  const vbPad = 58;

  const n = axes.length;
  // angles: start at -π/2 (top), go clockwise
  const angles = axes.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n);

  // Grid rings at 25 / 50 / 75 / 100 %
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Player polygon
  const playerPoints = axes.map((a, i) =>
    toXY(cx, cy, angles[i], Math.max(a.value, 0.03) * maxR)
  );

  return (
    <svg
      width={size + vbPad * 2}
      height={size + vbPad * 2}
      viewBox={`${-vbPad} ${-vbPad} ${size + vbPad * 2} ${size + vbPad * 2}`}
      aria-label="Player radar chart"
    >
      {/* ── Grid rings ── */}
      {gridLevels.map((lvl) => {
        const pts = angles.map((a) => toXY(cx, cy, a, lvl * maxR));
        return (
          <path
            key={lvl}
            d={polygonPath(pts)}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        );
      })}

      {/* ── Axis spokes ── */}
      {angles.map((a, i) => {
        const outer = toXY(cx, cy, a, maxR);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        );
      })}

      {/* ── Player fill ── */}
      <path
        d={polygonPath(playerPoints)}
        fill={`${color}22`}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* ── Dots at each axis vertex ── */}
      {playerPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
      ))}

      {/* ── Axis labels: label name stacked above stat value ── */}
      {axes.map((axis, i) => {
        const lp     = toXY(cx, cy, angles[i], labelR);
        const anchor = textAnchorFor(lp.x, cx);
        const topY   = labelGroupY(lp.y, cy);
        const statY  = topY + 16; // stat sits 16 px below the label baseline

        return (
          <g key={i}>
            {/* Label name — smaller, muted */}
            <text
              x={lp.x}
              y={topY}
              textAnchor={anchor}
              dominantBaseline="auto"
              fontSize={9}
              fontWeight={600}
              fill="rgba(255,255,255,0.45)"
              fontFamily="Sansation, system-ui, sans-serif"
              letterSpacing="0.05em"
            >
              {axis.label.toUpperCase()}
            </text>
            {/* Stat value — larger, white */}
            <text
              x={lp.x}
              y={statY}
              textAnchor={anchor}
              dominantBaseline="auto"
              fontSize={13}
              fontWeight={700}
              fill="white"
              fontFamily="Sansation, system-ui, sans-serif"
            >
              {axis.display}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
