export type Status = "disconnected" | "connecting" | "live" | "error";

export type Page = "Live" | "Matches" | "Rankings";

export interface MatchTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
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
