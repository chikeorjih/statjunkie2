"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { SkaterRow } from "@/types/nhl";
import { RadarChart, type RadarAxis } from "@/components/RadarChart";

interface PlayerModalProps {
  player: SkaterRow | null;
  allSkaters: SkaterRow[];   // used to compute team-high normalisers
  onClose: () => void;
}

const POSITION_COLORS: Record<string, string> = {
  C: "bg-blue-500/15 text-blue-300",
  L: "bg-emerald-500/15 text-emerald-300",
  R: "bg-orange-500/15 text-orange-300",
  D: "bg-purple-500/15 text-purple-300",
};

export function PlayerModal({ player, allSkaters, onClose }: PlayerModalProps) {
  // Escape key
  useEffect(() => {
    if (!player) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [player, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (player) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [player]);

  if (!player) return null;

  /* ── Normalise against team-season highs ── */
  const maxGoals   = Math.max(...allSkaters.map((s) => s.goals), 1);
  const maxAssists = Math.max(...allSkaters.map((s) => s.assists), 1);
  const maxPoints  = Math.max(...allSkaters.map((s) => s.points), 1);
  // +/- can be negative — map [min, max] → [0, 1]
  const allPM  = allSkaters.map((s) => s.plusMinus);
  const minPM  = Math.min(...allPM, -1);
  const maxPM  = Math.max(...allPM, 1);
  const pmRange = Math.max(maxPM - minPM, 1);

  const radarAxes: RadarAxis[] = [
    {
      label: "Goals",
      value: player.goals / maxGoals,
      display: String(player.goals),
    },
    {
      label: "Assists",
      value: player.assists / maxAssists,
      display: String(player.assists),
    },
    {
      label: "Points",
      value: player.points / maxPoints,
      display: String(player.points),
    },
    {
      label: "+/-",
      value: (player.plusMinus - minPM) / pmRange,
      display: player.plusMinus >= 0 ? `+${player.plusMinus}` : String(player.plusMinus),
    },
  ];

  const posClass = POSITION_COLORS[player.position] ?? "bg-white/10 text-text-secondary";
  const ppg = player.pointsPerGame.toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-white/10 bg-nhl-card shadow-2xl overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[15px] font-bold text-white tracking-tight">
              #{player.number} {player.name}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${posClass}`}
            >
              {player.position}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-white/8 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Left: headshot + stats */}
          <div className="flex flex-col items-center gap-4 px-6 py-5 sm:w-[220px] sm:flex-shrink-0 sm:border-r border-white/8">
            {/* Headshot */}
            <div className="relative w-[160px] h-[160px] rounded-xl overflow-hidden bg-nhl-surface flex-shrink-0">
              {player.headshot ? (
                <Image
                  src={player.headshot}
                  alt={player.name}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[40px] font-bold text-text-muted">
                  {player.number}
                </div>
              )}
            </div>

            {/* Key stats grid */}
            <div className="w-full grid grid-cols-3 gap-y-3 gap-x-2 text-center">
              {[
                { label: "GP", value: player.gamesPlayed },
                { label: "G",  value: player.goals },
                { label: "A",  value: player.assists },
                {
                  label: "PTS",
                  value: player.points,
                  highlight: true,
                },
                {
                  label: "+/−",
                  value: player.plusMinus >= 0
                    ? `+${player.plusMinus}`
                    : player.plusMinus,
                },
                { label: "P/GP", value: ppg },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span
                    className={`text-[14px] font-bold tabular-nums leading-none ${s.highlight ? "text-nhl-accent" : "text-white"}`}
                  >
                    {s.value}
                  </span>
                  <span className="text-[10px] text-text-muted leading-none">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: radar chart */}
          <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-5">
            <RadarChart axes={radarAxes} size={260} />
            <p className="text-[10px] text-text-muted text-center">
              vs. team-season high
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
