import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import type { SkaterRow } from "@/types/nhl";
import { PerformanceIndicator } from "@/components/PerformanceIndicator";

const positionColors: Record<string, string> = {
  C: "bg-blue-500/15 text-blue-300",
  L: "bg-purple-500/15 text-purple-300",
  R: "bg-purple-500/15 text-purple-300",
  D: "bg-orange-500/15 text-orange-300",
};

function fmt2(n: number) {
  return n.toFixed(2);
}

export const skaterColumns: ColumnDef<SkaterRow>[] = [
  {
    id: "player",
    header: "Player",
    enableSorting: false,
    size: 220,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5 min-w-[200px]">
        <div className="flex-shrink-0">
          {row.original.headshot ? (
            <Image
              src={row.original.headshot}
              alt={row.original.name}
              width={28}
              height={28}
              className="rounded-full object-cover w-7 h-7"
              unoptimized
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-text-secondary">
              {row.original.number}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13px] font-medium text-white truncate">
            #{row.original.number} {row.original.name}
          </span>
          <span
            className={`flex-shrink-0 text-[10px] font-semibold rounded-[4px] px-1 py-0.5 ${positionColors[row.original.position] ?? ""}`}
          >
            {row.original.position}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "gamesPlayed",
    header: "GP",
    size: 56,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-text-secondary">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "goals",
    header: "G",
    size: 56,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-text-secondary">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "assists",
    header: "A",
    size: 56,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-text-secondary">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "points",
    header: "PTS",
    size: 64,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums font-semibold text-white">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "plusMinus",
    header: "+/-",
    size: 64,
    meta: { numeric: true },
    cell: ({ getValue }) => {
      const v = getValue() as number;
      return (
        <span
          className={`tabular-nums font-medium ${
            v > 0 ? "text-over" : v < 0 ? "text-under" : "text-text-secondary"
          }`}
        >
          {v > 0 ? `+${v}` : v}
        </span>
      );
    },
  },
  {
    accessorKey: "pointsPerGame",
    header: "P/GP",
    size: 72,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-white">{fmt2(getValue() as number)}</span>
    ),
  },
  {
    accessorKey: "trailingAvgPointsPerGame",
    header: "3yr Avg",
    size: 88,
    meta: { numeric: true },
    cell: ({ row }) => {
      const avg = row.original.trailingAvgPointsPerGame;
      const count = row.original.trailingSeasonCount;
      return (
        <span className="tabular-nums text-text-secondary">
          {count === 0 ? "—" : `${fmt2(avg)} (${count}yr)`}
        </span>
      );
    },
  },
  {
    id: "performance",
    header: "Trend",
    enableSorting: false,
    size: 100,
    meta: { centered: true },
    cell: ({ row }) => {
      const { performanceDelta, performancePct, trailingAvgPointsPerGame, trailingSeasonCount } =
        row.original;
      const trailingLabel =
        trailingSeasonCount > 0
          ? `${fmt2(trailingAvgPointsPerGame)} P/GP (${trailingSeasonCount}yr avg)`
          : undefined;
      return (
        <PerformanceIndicator
          delta={performanceDelta}
          pct={performancePct}
          trailingLabel={trailingLabel}
        />
      );
    },
  },
];
