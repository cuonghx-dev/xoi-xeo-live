import { useStandings } from "@/hooks/useStandings";
import type { StandingRow } from "@/types";

function Row({ row, isArsenal }: { row: StandingRow; isArsenal: boolean }) {
  return (
    <tr
      className={[
        "border-b border-wire transition-colors",
        isArsenal ? "bg-brand/10" : "hover:bg-surface",
      ].join(" ")}
    >
      <td className="py-2.5 pl-4 pr-2 w-8 text-center">
        <span
          className={`text-[12px] font-bold ${isArsenal ? "text-brand" : row.position <= 4 ? "text-[#4ade80]" : row.position >= 18 ? "text-[#f87171]" : "text-[#888]"}`}
        >
          {row.position}
        </span>
      </td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-2.5">
          <img src={row.team.crest} alt={row.team.shortName} className="w-5 h-5 object-contain shrink-0" />
          <span className={`text-[13px] font-semibold ${isArsenal ? "text-white" : "text-[#ccc]"}`}>
            {row.team.shortName}
          </span>
          {isArsenal && (
            <span className="text-[9px] font-extrabold tracking-widest text-brand bg-brand/10 border border-brand/25 px-1.5 py-0.5 rounded">
              AFC
            </span>
          )}
        </div>
      </td>
      <td className="py-2.5 px-2 text-center text-[12px] text-[#666]">{row.playedGames}</td>
      <td className="py-2.5 px-2 text-center text-[12px] text-[#666]">{row.won}</td>
      <td className="py-2.5 px-2 text-center text-[12px] text-[#666]">{row.draw}</td>
      <td className="py-2.5 px-2 text-center text-[12px] text-[#666]">{row.lost}</td>
      <td className="py-2.5 px-2 text-center text-[12px] text-[#666]">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
      <td className="py-2.5 pl-2 pr-4 text-center">
        <span className={`text-[13px] font-extrabold ${isArsenal ? "text-brand" : "text-[#ddd]"}`}>
          {row.points}
        </span>
      </td>
    </tr>
  );
}

export default function Rankings() {
  const { table, loading, error } = useStandings();

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2.5 mb-4">
          <h2 className="text-[13px] font-extrabold tracking-[2px] uppercase text-[#555]">
            Premier League Table
          </h2>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#444] bg-surface border border-wire px-2 py-0.5 rounded">
            2025/26
          </span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-[13px] text-brand text-center py-10">{error}</p>
        )}

        {!loading && !error && table.length > 0 && (
          <div className="bg-surface border border-wire rounded-lg overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse">
              <thead>
                <tr className="border-b border-wire">
                  <th className="py-2 pl-4 pr-2 text-[10px] font-bold tracking-widest uppercase text-[#444] text-center w-8">#</th>
                  <th className="py-2 px-2 text-[10px] font-bold tracking-widest uppercase text-[#444] text-left">Club</th>
                  <th className="py-2 px-2 text-[10px] font-bold tracking-widest uppercase text-[#444] text-center">MP</th>
                  <th className="py-2 px-2 text-[10px] font-bold tracking-widest uppercase text-[#444] text-center">W</th>
                  <th className="py-2 px-2 text-[10px] font-bold tracking-widest uppercase text-[#444] text-center">D</th>
                  <th className="py-2 px-2 text-[10px] font-bold tracking-widest uppercase text-[#444] text-center">L</th>
                  <th className="py-2 px-2 text-[10px] font-bold tracking-widest uppercase text-[#444] text-center">GD</th>
                  <th className="py-2 pl-2 pr-4 text-[10px] font-bold tracking-widest uppercase text-[#444] text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row) => (
                  <Row key={row.team.id} row={row} isArsenal={row.team.id === 57} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        {!loading && !error && (
          <div className="flex gap-4 mt-3 px-1">
            <div className="flex items-center gap-1.5 text-[10.5px] text-[#4ade80]">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] inline-block" /> Champions League
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] text-[#f87171]">
              <span className="w-2 h-2 rounded-full bg-[#f87171] inline-block" /> Relegation
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
