"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import type { NHLTeam } from "@/types/nhl";
import { TeamSelector } from "@/components/TeamSelector";
import { DonutRankChart } from "@/components/DonutRankChart";

interface TeamStatsHeaderProps {
  teams: NHLTeam[];
  selectedTeam: string;
  onChangeTeam: (abbrev: string) => void;
}

function useRanking(
  teams: NHLTeam[],
  selectedTeam: string,
  sortFn: (a: NHLTeam, b: NHLTeam) => number
): number {
  return useMemo(() => {
    if (!teams.length) return 0;
    const idx = [...teams]
      .sort(sortFn)
      .findIndex((t) => t.teamAbbrev.default === selectedTeam);
    return idx === -1 ? 0 : idx + 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, selectedTeam]);
}

export function TeamStatsHeader({
  teams,
  selectedTeam,
  onChangeTeam,
}: TeamStatsHeaderProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const team = teams.find((t) => t.teamAbbrev.default === selectedTeam);

  const standingsRank = useRanking(teams, selectedTeam, (a, b) => b.points - a.points);
  const offensiveRank = useRanking(teams, selectedTeam, (a, b) => b.goalFor - a.goalFor);
  const defensiveRank = useRanking(teams, selectedTeam, (a, b) => a.goalAgainst - b.goalAgainst);

  const record = team ? `${team.wins}–${team.losses}–${team.otLosses}` : "—";

  return (
    <>
      <TeamSelector
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        teams={teams}
        value={selectedTeam}
        onChange={(abbrev) => {
          onChangeTeam(abbrev);
          setPickerOpen(false);
        }}
      />

      <div className="grid grid-cols-1 gap-4 pb-6 border-b border-white/8 lg:grid-cols-[5fr_7fr] lg:gap-5">

        {/* ── Left: team identity card ── */}
        <div className="relative flex items-center overflow-hidden rounded-xl px-6 py-5">

          {/* Watermark logo — spans the column as a background */}
          {team?.teamLogo && (
            <>
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none select-none"
                style={{
                  backgroundImage: `url(${team.teamLogo})`,
                  backgroundSize: "65%",
                  backgroundPosition: "left center",
                  backgroundRepeat: "no-repeat",
                  opacity: 0.09,
                }}
              />
              {/* Fade the logo out at the right edge */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, transparent 50%, rgba(10,10,10,0.75) 100%)",
                }}
              />
            </>
          )}

          {/* Foreground — vertically centred by parent `flex items-center` */}
          <div className="relative z-10 flex items-center gap-4">

            {/* Foreground logo */}
            {team?.teamLogo && (
              <Image
                src={team.teamLogo}
                alt={team.teamName.default}
                width={58}
                height={58}
                className="flex-shrink-0 object-contain drop-shadow-[0_0_18px_rgba(255,214,10,0.18)]"
                unoptimized
              />
            )}

            {/* Text stack — name → division/record → button */}
            <div className="flex flex-col">
              <h2 className="text-[22px] lg:text-[25px] font-bold text-white leading-tight tracking-tight">
                {team?.teamName.default ?? selectedTeam}
              </h2>

              <p className="mt-1 text-[13px] text-text-secondary leading-snug">
                {team?.divisionName
                  ? `${team.divisionName} Division`
                  : "—"}
                <span className="mx-2 text-text-muted">·</span>
                <span className="text-white/65 font-medium">{record}</span>
                {team && (
                  <>
                    <span className="mx-2 text-text-muted">·</span>
                    <span className="font-semibold text-white/80">
                      {team.points} pts
                    </span>
                  </>
                )}
              </p>

              {/* Change Team button — directly under division/record line */}
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-3 self-start flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium text-text-secondary cursor-pointer transition-all duration-200 hover:border-nhl-accent/45 hover:bg-nhl-accent/8 hover:text-nhl-accent group"
              >
                <ChevronsUpDown className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                Change Team
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: 3 donut rank cards ── */}
        <div className="flex items-center justify-around gap-4 rounded-xl px-6 py-5">
          <DonutRankChart
            rank={standingsRank}
            label="Standings"
            subLabel={team ? `${team.points} PTS` : undefined}
          />

          <div className="h-14 w-px flex-shrink-0 bg-white/8" />

          <DonutRankChart
            rank={offensiveRank}
            label="Offense"
            subLabel={team?.goalFor ? `${team.goalFor} GF` : undefined}
          />

          <div className="h-14 w-px flex-shrink-0 bg-white/8" />

          <DonutRankChart
            rank={defensiveRank}
            label="Defense"
            subLabel={team?.goalAgainst ? `${team.goalAgainst} GA` : undefined}
          />
        </div>
      </div>
    </>
  );
}
