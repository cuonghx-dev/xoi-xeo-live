import { useMatches } from "@/hooks/useMatches";
import type { Match } from "@/types";

function formatDate(utc: string) {
  const d = new Date(utc);
  return {
    date: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

function MatchCard({ match }: { match: Match }) {
  const { date, time } = formatDate(match.utcDate);
  const isHome = match.homeTeam.id === 57;
  const opponent = isHome ? match.awayTeam : match.homeTeam;

  return (
    <div className="bg-surface border border-wire rounded-lg px-5 py-4 flex items-center gap-4 hover:border-brand/30 transition-colors">
      {/* Competition */}
      <img src={match.competition.emblem} alt={match.competition.name} className="w-7 h-7 object-contain shrink-0 opacity-80" />

      {/* Teams */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Home */}
        <div className="flex items-center gap-2 justify-end flex-1 min-w-0">
          <span className={`text-[13px] font-bold truncate ${match.homeTeam.id === 57 ? "text-white" : "text-[#aaa]"}`}>
            {match.homeTeam.shortName}
          </span>
          <img src={match.homeTeam.crest} alt={match.homeTeam.shortName} className="w-7 h-7 object-contain shrink-0" />
        </div>

        {/* vs */}
        <span className="text-[11px] text-[#444] font-bold shrink-0">VS</span>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img src={match.awayTeam.crest} alt={match.awayTeam.shortName} className="w-7 h-7 object-contain shrink-0" />
          <span className={`text-[13px] font-bold truncate ${match.awayTeam.id === 57 ? "text-white" : "text-[#aaa]"}`}>
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Date / time */}
      <div className="text-right shrink-0">
        <div className="text-[12px] font-semibold text-[#ccc]">{time}</div>
        <div className="text-[10.5px] text-[#555] mt-0.5">{date}</div>
      </div>

      {/* Matchday badge */}
      <div className="hidden sm:flex shrink-0 text-[10px] font-bold text-[#444] bg-pitch border border-wire rounded px-2 py-1 whitespace-nowrap">
        MD {match.matchday}
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
          <p className="text-[13px] text-[#555] text-center py-10">No scheduled matches.</p>
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
