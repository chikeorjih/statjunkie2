"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PositionFilter = "all" | "forwards" | "defense" | "goalies";

interface PositionFilterProps {
  value: PositionFilter;
  onChange: (v: PositionFilter) => void;
  forwardCount: number;
  defenseCount: number;
  goalieCount: number;
}

export function PositionFilter({
  value,
  onChange,
  forwardCount,
  defenseCount,
  goalieCount,
}: PositionFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as PositionFilter)}>
      <TabsList className="bg-nhl-card border border-white/8 h-8 p-0.5 gap-0.5">
        <TabsTrigger
          value="all"
          className="h-7 px-3 text-[12px] text-text-secondary rounded-[4px]
            data-[state=active]:bg-nhl-accent data-[state=active]:text-black data-[state=active]:font-semibold"
        >
          All ({forwardCount + defenseCount + goalieCount})
        </TabsTrigger>
        <TabsTrigger
          value="forwards"
          className="h-7 px-3 text-[12px] text-text-secondary rounded-[4px]
            data-[state=active]:bg-nhl-accent data-[state=active]:text-black data-[state=active]:font-semibold"
        >
          Forwards ({forwardCount})
        </TabsTrigger>
        <TabsTrigger
          value="defense"
          className="h-7 px-3 text-[12px] text-text-secondary rounded-[4px]
            data-[state=active]:bg-nhl-accent data-[state=active]:text-black data-[state=active]:font-semibold"
        >
          Defense ({defenseCount})
        </TabsTrigger>
        <TabsTrigger
          value="goalies"
          className="h-7 px-3 text-[12px] text-text-secondary rounded-[4px]
            data-[state=active]:bg-nhl-accent data-[state=active]:text-black data-[state=active]:font-semibold"
        >
          Goalies ({goalieCount})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
