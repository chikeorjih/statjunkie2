"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { NHLTeam } from "@/types/nhl";

export interface TeamSelectorProps {
  open: boolean;
  onClose: () => void;
  teams: NHLTeam[];
  value: string;
  onChange: (abbrev: string) => void;
}

const PREFERRED_DIVISION_ORDER = ["Atlantic", "Metropolitan", "Central", "Pacific"];

function groupByDivision(teams: NHLTeam[]): Record<string, NHLTeam[]> {
  return teams.reduce(
    (acc, team) => {
      const div = team.divisionName ?? "Other";
      if (!acc[div]) acc[div] = [];
      acc[div].push(team);
      return acc;
    },
    {} as Record<string, NHLTeam[]>
  );
}

function sortedDivisions(grouped: Record<string, NHLTeam[]>): string[] {
  const keys = Object.keys(grouped).filter((k) => grouped[k].length > 0);
  const preferred = PREFERRED_DIVISION_ORDER.filter((d) => keys.includes(d));
  const rest = keys.filter((k) => !PREFERRED_DIVISION_ORDER.includes(k));
  return [...preferred, ...rest];
}

function splitName(fullName: string): { city: string; mascot: string } {
  const parts = fullName.split(" ");
  if (parts.length <= 1) return { city: fullName, mascot: "" };
  const multiWordMascots = [
    "Maple Leafs",
    "Blue Jackets",
    "Golden Knights",
    "Red Wings",
  ];
  for (const mm of multiWordMascots) {
    if (fullName.endsWith(mm)) {
      return { city: fullName.slice(0, -mm.length).trim(), mascot: mm };
    }
  }
  return {
    city: parts.slice(0, -1).join(" "),
    mascot: parts[parts.length - 1],
  };
}

export function TeamSelector({
  open,
  onClose,
  teams,
  value,
  onChange,
}: TeamSelectorProps) {
  const grouped = useMemo(() => groupByDivision(teams), [teams]);
  const divisions = useMemo(() => sortedDivisions(grouped), [grouped]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  function handleSelect(abbrev: string) {
    onChange(abbrev);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-white/10 bg-nhl-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-white">Select a Team</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-white/8 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Division grids */}
        <div
          className="overflow-y-auto p-5 space-y-6"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          {divisions.map((div) => {
            const divTeams = grouped[div]
              .slice()
              .sort((a, b) =>
                a.teamAbbrev.default.localeCompare(b.teamAbbrev.default)
              );

            return (
              <div key={div}>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  {div} Division
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {divTeams.map((team) => {
                    const abbrev = team.teamAbbrev.default;
                    const isSelected = abbrev === value;
                    const { city, mascot } = splitName(team.teamName.default);

                    return (
                      <button
                        key={abbrev}
                        type="button"
                        onClick={() => handleSelect(abbrev)}
                        className={`flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-all cursor-pointer
                          ${
                            isSelected
                              ? "bg-nhl-accent/12 ring-1 ring-nhl-accent/50"
                              : "hover:bg-white/6"
                          }`}
                      >
                        {team.teamLogo && (
                          <Image
                            src={team.teamLogo}
                            alt={team.teamName.default}
                            width={52}
                            height={52}
                            className="object-contain"
                            unoptimized
                          />
                        )}
                        <div className="leading-tight">
                          <div
                            className={`text-[11px] font-medium ${isSelected ? "text-nhl-accent" : "text-text-secondary"}`}
                          >
                            {city}
                          </div>
                          {mascot && (
                            <div
                              className={`text-[12px] font-semibold ${isSelected ? "text-nhl-accent" : "text-white"}`}
                            >
                              {mascot}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
