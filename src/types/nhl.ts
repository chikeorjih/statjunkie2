// NHL API response types (api-web.nhle.com/v1)

export interface NHLTeam {
  teamAbbrev: { default: string };
  teamName: { default: string };
  teamLogo: string;
  divisionName: string;
  conferenceName: string;
  wins: number;
  losses: number;
  otLosses: number;
  points: number;
  goalFor: number;
  goalAgainst: number;
}

export interface StandingsResponse {
  standings: NHLTeam[];
}

export interface RosterPlayer {
  id: number;
  headshot: string;
  firstName: { default: string };
  lastName: { default: string };
  sweaterNumber: number;
  positionCode: "C" | "L" | "R" | "D" | "G";
  shootsCatches: string;
  heightInInches: number;
  weightInPounds: number;
  birthDate: string;
  birthCountry: string;
}

export interface RosterResponse {
  forwards: RosterPlayer[];
  defensemen: RosterPlayer[];
  goalies: RosterPlayer[];
}

export interface SkaterSeasonStats {
  season: number;
  gameTypeId: number;
  leagueAbbrev: string;
  teamName?: { default: string };
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
  gameWinningGoals: number;
  shots: number;
  shootingPctg: number;
  avgToi: string;
  powerPlayGoals: number;
  powerPlayPoints: number;
  shorthandedGoals: number;
}

export interface GoalieSeasonStats {
  season: number;
  gameTypeId: number;
  leagueAbbrev: string;
  teamName?: { default: string };
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  goalsAgainstAvg: number;
  savePctg: number;
  shotsAgainst: number;
  saves: number;
  shutouts: number;
}

export interface PlayerLandingResponse {
  playerId: number;
  firstName: { default: string };
  lastName: { default: string };
  position: string;
  headshot: string;
  currentTeamAbbrev: string;
  featuredStats?: {
    regularSeason?: {
      subSeason: SkaterSeasonStats | GoalieSeasonStats;
    };
  };
  seasonTotals: Array<SkaterSeasonStats | GoalieSeasonStats>;
}

// Derived types used in the UI

export type PerformanceDelta = "over" | "under" | "neutral" | "rookie";

export interface SkaterRow {
  id: number;
  name: string;
  number: number;
  position: "C" | "L" | "R" | "D";
  headshot: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pointsPerGame: number;
  trailingAvgPointsPerGame: number;
  trailingSeasonCount: number;
  performanceDelta: PerformanceDelta;
  performancePct: number;
}

export interface GoalieRow {
  id: number;
  name: string;
  number: number;
  headshot: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  gaa: number;
  savePct: number;
  shutouts: number;
  trailingAvgGaa: number;
  trailingAvgSavePct: number;
  trailingSeasonCount: number;
  performanceDelta: PerformanceDelta;
  performancePct: number;
}
