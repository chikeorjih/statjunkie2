import type {
  RosterPlayer,
  PlayerLandingResponse,
  SkaterSeasonStats,
  GoalieSeasonStats,
  SkaterRow,
  GoalieRow,
  PerformanceDelta,
} from "@/types/nhl";

const PERFORMANCE_THRESHOLD = 0.1; // 10%
const TRAILING_SEASONS = 3;

function isSkaterStats(
  s: SkaterSeasonStats | GoalieSeasonStats
): s is SkaterSeasonStats {
  return "goals" in s;
}

function getTrailingNhlRegularSeasons<
  T extends { season: number; gameTypeId: number; leagueAbbrev: string },
>(seasonTotals: T[], count = TRAILING_SEASONS): T[] {
  return seasonTotals
    .filter((s) => s.gameTypeId === 2 && s.leagueAbbrev === "NHL")
    .sort((a, b) => b.season - a.season)
    .slice(0, count);
}

function calcDelta(
  current: number,
  trailing: number,
  lowerIsBetter = false
): { delta: PerformanceDelta; pct: number } {
  if (trailing === 0) return { delta: "neutral", pct: 0 };
  const rawPct = lowerIsBetter
    ? (trailing - current) / trailing // improvement when current < trailing
    : (current - trailing) / trailing;
  const delta: PerformanceDelta =
    rawPct > PERFORMANCE_THRESHOLD
      ? "over"
      : rawPct < -PERFORMANCE_THRESHOLD
        ? "under"
        : "neutral";
  return { delta, pct: Math.round(rawPct * 100) };
}

/**
 * Delta calculation for save percentage.
 * Uses an absolute threshold (±0.010 = 1 percentage point) rather than a
 * relative one, because SV% values cluster in a narrow band (.895–.930) where
 * a 10% relative change is essentially impossible.
 * The returned `pct` is the absolute difference in percentage points
 * (e.g. +1.5 means the goalie is saving 1.5 pp more than their trailing avg).
 */
const SV_PCT_THRESHOLD = 0.010; // 1 percentage point

function calcSavePctDelta(
  current: number,
  trailing: number
): { delta: PerformanceDelta; pct: number } {
  if (trailing === 0) return { delta: "neutral", pct: 0 };
  const diff = current - trailing; // positive = better
  const delta: PerformanceDelta =
    diff > SV_PCT_THRESHOLD
      ? "over"
      : diff < -SV_PCT_THRESHOLD
        ? "under"
        : "neutral";
  // Display as percentage points with one decimal (e.g. +1.5, -0.8)
  const pct = Math.round(diff * 1000) / 10;
  return { delta, pct };
}

export function buildSkaterRow(
  player: RosterPlayer,
  landing: PlayerLandingResponse
): SkaterRow {
  const currentSeason = landing.featuredStats?.regularSeason?.subSeason as
    | SkaterSeasonStats
    | undefined;

  const gp = currentSeason?.gamesPlayed ?? 0;
  const goals = currentSeason?.goals ?? 0;
  const assists = currentSeason?.assists ?? 0;
  const points = currentSeason?.points ?? 0;
  const plusMinus = currentSeason?.plusMinus ?? 0;
  const pointsPerGame = gp > 0 ? points / gp : 0;

  // Trailing average: exclude the current season (first entry) from seasonTotals
  const currentSeasonCode = currentSeason?.season;
  const priorSeasons = getTrailingNhlRegularSeasons(
    landing.seasonTotals
      .filter(isSkaterStats)
      .filter((s) => s.season !== currentSeasonCode)
  );

  const totalPoints = priorSeasons.reduce((sum, s) => sum + s.points, 0);
  const totalGames = priorSeasons.reduce((sum, s) => sum + s.gamesPlayed, 0);
  const trailingAvgPointsPerGame = totalGames > 0 ? totalPoints / totalGames : 0;

  const { delta, pct } =
    priorSeasons.length === 0
      ? { delta: "rookie" as PerformanceDelta, pct: 0 }
      : calcDelta(pointsPerGame, trailingAvgPointsPerGame);

  return {
    id: player.id,
    name: `${landing.firstName.default} ${landing.lastName.default}`,
    number: player.sweaterNumber,
    position: player.positionCode as "C" | "L" | "R" | "D",
    headshot: landing.headshot || player.headshot,
    gamesPlayed: gp,
    goals,
    assists,
    points,
    plusMinus,
    pointsPerGame,
    trailingAvgPointsPerGame,
    trailingSeasonCount: priorSeasons.length,
    performanceDelta: delta,
    performancePct: pct,
  };
}

export function buildGoalieRow(
  player: RosterPlayer,
  landing: PlayerLandingResponse
): GoalieRow {
  const currentSeason = landing.featuredStats?.regularSeason?.subSeason as
    | GoalieSeasonStats
    | undefined;

  const gp = currentSeason?.gamesPlayed ?? 0;
  const wins = currentSeason?.wins ?? 0;
  const losses = currentSeason?.losses ?? 0;
  const otLosses = currentSeason?.otLosses ?? 0;
  const gaa = currentSeason?.goalsAgainstAvg ?? 0;
  const savePct = currentSeason?.savePctg ?? 0;
  const shutouts = currentSeason?.shutouts ?? 0;

  const currentSeasonCode = currentSeason?.season;
  const priorGoalieSeasons = getTrailingNhlRegularSeasons(
    landing.seasonTotals
      .filter((s): s is GoalieSeasonStats => !isSkaterStats(s))
      .filter((s) => s.season !== currentSeasonCode)
  );

  const totalShotsAgainst = priorGoalieSeasons.reduce(
    (sum, s) => sum + (s.shotsAgainst ?? 0),
    0
  );
  const totalSaves = priorGoalieSeasons.reduce(
    (sum, s) => sum + (s.saves ?? 0),
    0
  );
  const totalGA = totalShotsAgainst - totalSaves;
  const totalGP = priorGoalieSeasons.reduce(
    (sum, s) => sum + s.gamesPlayed,
    0
  );

  const trailingAvgGaa = totalGP > 0 ? totalGA / totalGP : 0;
  const trailingAvgSavePct =
    totalShotsAgainst > 0 ? totalSaves / totalShotsAgainst : 0;

  const { delta, pct } =
    priorGoalieSeasons.length === 0
      ? { delta: "rookie" as PerformanceDelta, pct: 0 }
      : calcSavePctDelta(savePct, trailingAvgSavePct);

  return {
    id: player.id,
    name: `${landing.firstName.default} ${landing.lastName.default}`,
    number: player.sweaterNumber,
    headshot: landing.headshot || player.headshot,
    gamesPlayed: gp,
    wins,
    losses,
    otLosses,
    gaa,
    savePct,
    shutouts,
    trailingAvgGaa,
    trailingAvgSavePct,
    trailingSeasonCount: priorGoalieSeasons.length,
    performanceDelta: delta,
    performancePct: pct,
  };
}
