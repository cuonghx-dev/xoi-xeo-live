import { useEffect, useState } from "react";
import type { StandingRow } from "@/types";

const API_URL = "/api/football/v4/competitions/PL/standings";
const TOKEN = import.meta.env.VITE_FOOTBALL_API_TOKEN as string;

export function useStandings() {
  const [table, setTable] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL, { headers: { "X-Auth-Token": TOKEN } })
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json() as Promise<{ standings: { type: string; table: StandingRow[] }[] }>;
      })
      .then((data) => {
        const total = data.standings.find((s) => s.type === "TOTAL");
        setTable(total?.table ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  return { table, loading, error };
}
