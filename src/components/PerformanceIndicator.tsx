"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PerformanceDelta } from "@/types/nhl";

interface PerformanceIndicatorProps {
  delta: PerformanceDelta;
  pct: number;
  trailingLabel?: string;
}

const config = {
  over: {
    icon: TrendingUp,
    className: "bg-over/15 text-over border border-over/25",
    label: (pct: number) => `+${pct}%`,
  },
  under: {
    icon: TrendingDown,
    className: "bg-under/15 text-under border border-under/25",
    label: (pct: number) => `${pct}%`,
  },
  neutral: {
    icon: Minus,
    className: "bg-white/5 text-text-secondary border border-white/10",
    label: () => "On pace",
  },
  rookie: {
    icon: Minus,
    className: "bg-nhl-accent/10 text-nhl-accent border border-nhl-accent/20",
    label: () => "Rookie",
  },
};

export function PerformanceIndicator({
  delta,
  pct,
  trailingLabel,
}: PerformanceIndicatorProps) {
  const { icon: Icon, className, label } = config[delta];

  const badge = (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label(pct)}
    </span>
  );

  if (!trailingLabel) return badge;

  return (
    <Tooltip>
      <TooltipTrigger>{badge}</TooltipTrigger>
      <TooltipContent side="left" className="text-[11px]">
        {trailingLabel}
      </TooltipContent>
    </Tooltip>
  );
}
