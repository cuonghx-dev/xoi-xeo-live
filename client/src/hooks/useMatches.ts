import { useEffect, useState } from "react";
import type { Match } from "@/types";

const API_URL = "/api/football/v4/teams/57/matches?status=SCHEDULED";
const TOKEN = import.meta.env.VITE_FOOTBALL_API_TOKEN as string;

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL, { headers: { "X-Auth-Token": TOKEN } })
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json() as Promise<{ matches: Match[] }>;
      })
      .then((data) => setMatches(data.matches))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  return { matches, loading, error };
}
