export type Status = "disconnected" | "connecting" | "live" | "error";

export type Page = "Live" | "Matches" | "Rankings";

export interface MatchTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface StandingRow {
  position: number;
  team: { id: number; name: string; shortName: string; tla: string; crest: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface Match {
  id: number;
  utcDate: string;
  matchday: number;
  status: string;
  competition: { name: string; emblem: string };
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
}
