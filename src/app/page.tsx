import Image from "next/image";
import logo from "@/assets/logo.PNG";
import { fetchTeams } from "@/lib/nhl-api";
import type { NHLTeam } from "@/types/nhl";
import { DashboardClient } from "@/components/DashboardClient";

export default async function Page() {
  let teamList: NHLTeam[] = [];
  try {
    teamList = await fetchTeams();
  } catch {
    // Teams will be empty; DashboardClient handles the empty state
  }

  return (
    <main className="min-h-screen bg-nhl-navy">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8">
        <header className="mb-6 lg:mb-8 flex items-center gap-4">
          <Image
            src={logo}
            alt="StatJunkie"
            height={48}
            className="h-10 lg:h-12 w-auto flex-shrink-0"
          />
          {/* Hairline divider */}
          <div className="h-6 w-px bg-white/15 flex-shrink-0" />
          <p className="text-[12px] lg:text-[13px] text-text-muted tracking-wide whitespace-nowrap">
            NHL player statistics · Current season · 3-year trend
          </p>
        </header>
        <DashboardClient teamList={teamList} />
      </div>
    </main>
  );
}
