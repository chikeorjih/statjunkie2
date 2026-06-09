import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import type { GoalieRow } from "@/types/nhl";
import { PerformanceIndicator } from "@/components/PerformanceIndicator";

function fmt2(n: number) {
  return n.toFixed(2);
}

function fmt3(n: number) {
  return n.toFixed(3).replace(/^0/, "");
}

export const goalieColumns: ColumnDef<GoalieRow>[] = [
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
          <span className="flex-shrink-0 text-[10px] font-semibold rounded-[4px] px-1 py-0.5 bg-yellow-500/15 text-yellow-300">
            G
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
    accessorKey: "wins",
    header: "W",
    size: 56,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-text-secondary">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "losses",
    header: "L",
    size: 56,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-text-secondary">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "otLosses",
    header: "OTL",
    size: 56,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-text-secondary">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "gaa",
    header: "GAA",
    size: 72,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-white">{fmt2(getValue() as number)}</span>
    ),
  },
  {
    accessorKey: "savePct",
    header: "SV%",
    size: 72,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums font-semibold text-white">{fmt3(getValue() as number)}</span>
    ),
  },
  {
    accessorKey: "shutouts",
    header: "SO",
    size: 56,
    meta: { numeric: true },
    cell: ({ getValue }) => (
      <span className="tabular-nums text-text-secondary">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "trailingAvgSavePct",
    header: "3yr SV%",
    size: 88,
    meta: { numeric: true },
    cell: ({ row }) => {
      const avg = row.original.trailingAvgSavePct;
      const count = row.original.trailingSeasonCount;
      return (
        <span className="tabular-nums text-text-secondary">
          {count === 0 ? "—" : `${fmt3(avg)} (${count}yr)`}
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
      const { performanceDelta, performancePct, trailingAvgSavePct, trailingSeasonCount } =
        row.original;
      const trailingLabel =
        trailingSeasonCount > 0
          ? `${fmt3(trailingAvgSavePct)} SV% avg (${trailingSeasonCount}yr) · ±1.0 pp threshold`
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
