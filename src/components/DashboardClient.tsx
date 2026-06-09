"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { fetchRoster, fetchPlayerLanding } from "@/lib/nhl-api";
import { buildSkaterRow, buildGoalieRow } from "@/lib/stats-utils";
import type { NHLTeam, SkaterRow, GoalieRow } from "@/types/nhl";
import { TeamStatsHeader } from "@/components/TeamStatsHeader";
import { PositionFilter } from "@/components/PositionFilter";
import { DataTable } from "@/components/PlayerTable/data-table";
import { skaterColumns } from "@/components/PlayerTable/columns-skaters";
import { goalieColumns } from "@/components/PlayerTable/columns-goalies";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlayerModal } from "@/components/PlayerModal";

type PositionFilterType = "all" | "forwards" | "defense" | "goalies";

interface DashboardClientProps {
  teamList: NHLTeam[];
}

export function DashboardClient({ teamList }: DashboardClientProps) {
  const defaultTeam =
    teamList.find((t) => t.teamAbbrev.default === "STL")?.teamAbbrev.default ??
    teamList[0]?.teamAbbrev.default ??
    "STL";

  const [selectedTeam, setSelectedTeam] = useState(defaultTeam);
  const [positionFilter, setPositionFilter] = useState<PositionFilterType>("all");
  const [skaterRows, setSkaterRows] = useState<SkaterRow[]>([]);
  const [goalieRows, setGoalieRows] = useState<GoalieRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkater, setSelectedSkater] = useState<SkaterRow | null>(null);

  const loadTeamData = useCallback(async (teamAbbrev: string) => {
    setLoading(true);
    setError(null);
    setSkaterRows([]);
    setGoalieRows([]);

    try {
      const roster = await fetchRoster(teamAbbrev);
      const allPlayers = [
        ...roster.forwards,
        ...roster.defensemen,
        ...roster.goalies,
      ];

      const results = await Promise.allSettled(
        allPlayers.map((p) => fetchPlayerLanding(p.id))
      );

      const newSkaters: SkaterRow[] = [];
      const newGoalies: GoalieRow[] = [];

      results.forEach((result, idx) => {
        if (result.status === "rejected") return;
        const player = allPlayers[idx];
        const landing = result.value;
        if (player.positionCode === "G") {
          newGoalies.push(buildGoalieRow(player, landing));
        } else {
          newSkaters.push(buildSkaterRow(player, landing));
        }
      });

      newSkaters.sort((a, b) => b.points - a.points);
      setSkaterRows(newSkaters);
      setGoalieRows(newGoalies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeamData(selectedTeam);
  }, [selectedTeam, loadTeamData]);

  const forwardRows = skaterRows.filter((r) =>
    ["C", "L", "R"].includes(r.position)
  );
  const defenseRows = skaterRows.filter((r) => r.position === "D");

  const visibleSkaters =
    positionFilter === "forwards"
      ? forwardRows
      : positionFilter === "defense"
        ? defenseRows
        : skaterRows;

  return (
    <TooltipProvider>
      <PlayerModal
        player={selectedSkater}
        allSkaters={skaterRows}
        onClose={() => setSelectedSkater(null)}
      />
      <div className="space-y-6">
        {/* 2-column team header */}
        <TeamStatsHeader
          teams={teamList}
          selectedTeam={selectedTeam}
          onChangeTeam={setSelectedTeam}
        />

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 text-[13px] text-under bg-under/10 border border-under/20 rounded-md p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Position filter */}
        <PositionFilter
          value={positionFilter}
          onChange={setPositionFilter}
          forwardCount={forwardRows.length}
          defenseCount={defenseRows.length}
          goalieCount={goalieRows.length}
        />

        {/* Tables */}
        {positionFilter === "goalies" ? (
          <DataTable
            columns={goalieColumns}
            data={goalieRows}
            isLoading={loading}
            skeletonCols={10}
          />
        ) : (
          <div className="space-y-5">
            <DataTable
              columns={skaterColumns}
              data={visibleSkaters}
              isLoading={loading}
              skeletonCols={9}
              onRowClick={setSelectedSkater}
            />
            {positionFilter === "all" && !loading && goalieRows.length > 0 && (
              <>
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Goalies
                  </span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>
                <DataTable
                  columns={goalieColumns}
                  data={goalieRows}
                  isLoading={false}
                  skeletonCols={10}
                />
              </>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
