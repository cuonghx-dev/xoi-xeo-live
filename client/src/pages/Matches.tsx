import { useMatches } from "@/hooks/useMatches";
import type { Match } from "@/types";

function formatDate(utc: string) {
  const d = new Date(utc);
  return {
    date: d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

function MatchCard({ match }: { match: Match }) {
  const { date, time } = formatDate(match.utcDate);

  return (
    <div className="bg-surface border border-wire rounded-lg px-4 py-3 flex flex-col gap-2.5 hover:border-brand/30 transition-colors">
      {/* Row 1: competition + date + matchday */}
      <div className="flex items-center gap-2">
        <img
          src={match.competition.emblem}
          alt={match.competition.name}
          className="w-4 h-4 object-contain shrink-0 opacity-70"
        />
        <span className="text-[10.5px] text-[#555] font-semibold">{match.competition.name}</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#ccc]">{time}</span>
          <span className="text-[10px] text-[#444]">·</span>
          <span className="text-[10.5px] text-[#555]">{date}</span>
          <span className="hidden sm:inline text-[9px] font-bold text-[#444] bg-pitch border border-wire rounded px-1.5 py-0.5 whitespace-nowrap">
            MD {match.matchday}
          </span>
        </div>
      </div>

      {/* Row 2: teams */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className={`text-[13px] font-bold text-right ${match.homeTeam.id === 57 ? "text-white" : "text-[#aaa]"}`}>
            {match.homeTeam.shortName}
          </span>
          <img src={match.homeTeam.crest} alt={match.homeTeam.shortName} className="w-7 h-7 object-contain shrink-0" />
        </div>

        <span className="text-[11px] text-[#444] font-bold shrink-0">VS</span>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1">
          <img src={match.awayTeam.crest} alt={match.awayTeam.shortName} className="w-7 h-7 object-contain shrink-0" />
          <span className={`text-[13px] font-bold ${match.awayTeam.id === 57 ? "text-white" : "text-[#aaa]"}`}>
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Matches() {
  const { matches, loading, error } = useMatches();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-[13px] font-extrabold tracking-[2px] uppercase text-[#555] mb-4">
          Upcoming Matches
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-[13px] text-brand text-center py-10">{error}</p>
        )}

        {!loading && !error && matches.length === 0 && (
          <p className="text-[13px] text-[#555] text-center py-10">
            No scheduled matches.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
