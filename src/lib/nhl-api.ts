import type {
  NHLTeam,
  RosterResponse,
  PlayerLandingResponse,
} from "@/types/nhl";

const NHL_BASE = "https://api-web.nhle.com/v1";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Fetches the NHL standings directly from the NHL API.
 * Called only from Server Components — no proxy needed server-side.
 */
export async function fetchTeams(): Promise<NHLTeam[]> {
  const res = await fetch(`${NHL_BASE}/standings/now`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch NHL standings: ${res.status}`);
  const data = await res.json();
  return (data.standings as NHLTeam[]).sort((a, b) =>
    a.teamName.default.localeCompare(b.teamName.default)
  );
}

/**
 * Client-side fetch helpers — route through Next.js proxy handlers
 * so the browser never hits the NHL API directly (avoids CORS / UA issues).
 */
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`NHL API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchRoster(teamAbbrev: string): Promise<RosterResponse> {
  return apiFetch<RosterResponse>(`/api/nhl/roster/${teamAbbrev}`);
}

export async function fetchPlayerLanding(
  playerId: number
): Promise<PlayerLandingResponse> {
  return apiFetch<PlayerLandingResponse>(`/api/nhl/player/${playerId}`);
}
