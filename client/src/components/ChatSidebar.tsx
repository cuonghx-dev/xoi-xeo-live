export function ChatSidebar() {
  return (
    <div className="w-[270px] shrink-0 bg-surface border-l border-wire flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-3.5 py-[13px] border-b border-wire flex items-center gap-2">
        {/* Small cannon */}
        <svg className="w-5 h-5 shrink-0 opacity-75" viewBox="0 0 80 48" fill="none">
          <rect x="4"  y="16" width="50" height="13" rx="3"   fill="#EF0107"/>
          <rect x="51" y="14" width="18" height="17" rx="2.5" fill="#EF0107"/>
          <rect x="66" y="18" width="6"  height="9"  rx="1.5" fill="#6b0000"/>
          <circle cx="18" cy="34" r="9" stroke="#EF0107" strokeWidth="2.5" fill="none"/>
          <circle cx="18" cy="34" r="3.5" fill="#EF0107"/>
          <circle cx="40" cy="34" r="9" stroke="#EF0107" strokeWidth="2.5" fill="none"/>
          <circle cx="40" cy="34" r="3.5" fill="#EF0107"/>
        </svg>
        <span className="text-[13px] font-bold tracking-[0.3px]">Gunners Chat</span>
        <div className="ml-auto flex items-center gap-1.5 text-[10.5px] text-[#444]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#444] inline-block"/>
          0 online
        </div>
      </div>

      {/* Coming-soon body */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3.5 px-5 text-center">
        {/* Arsenal crest (dim) */}
        <svg className="w-[60px] opacity-15" viewBox="0 0 200 240" fill="none">
          <path d="M100 8 L186 38 L186 138 Q186 196 100 232 Q14 196 14 138 L14 38 Z"
                stroke="#EF0107" strokeWidth="3.5" fill="rgba(239,1,7,0.04)"/>
          <text x="100" y="80" textAnchor="middle" fill="#EF0107" fontSize="26"
                fontWeight="900" fontFamily="Georgia, serif" letterSpacing="4">AFC</text>
          <line x1="46" y1="92" x2="154" y2="92" stroke="rgba(239,1,7,0.25)" strokeWidth="1"/>
          <rect x="32"  y="108" width="104" height="22" rx="5" fill="#EF0107"/>
          <rect x="130" y="104" width="32"  height="30" rx="4" fill="#EF0107"/>
          <rect x="156" y="109" width="9"   height="20" rx="2.5" fill="#6b0000"/>
          <circle cx="58"  cy="140" r="17" stroke="#EF0107" strokeWidth="3" fill="none"/>
          <circle cx="58"  cy="140" r="6"  fill="#EF0107"/>
          <circle cx="104" cy="140" r="17" stroke="#EF0107" strokeWidth="3" fill="none"/>
          <circle cx="104" cy="140" r="6"  fill="#EF0107"/>
        </svg>

        <p className="text-[14px] font-bold text-[#444]">Coming Soon</p>
        <p className="text-[12px] text-[#2e2e2e] leading-[1.7] max-w-[190px]">
          Chat with fellow Gooners coming soon. Stay tuned, Gunner!
        </p>
        <span className="text-[10px] font-extrabold tracking-widest uppercase bg-brand/10 text-brand border border-brand/20 px-3.5 py-1 rounded-full">
          🔴 Gooners Only
        </span>
      </div>

      {/* Disabled input */}
      <div className="p-2.5 border-t border-wire flex gap-1.5">
        <input
          disabled
          type="text"
          placeholder="Chat coming soon…"
          className="flex-1 bg-pitch border border-wire rounded-md text-[#2a2a2a] text-[12px] px-2.5 py-2 outline-none cursor-not-allowed font-[inherit] placeholder:text-[#2a2a2a]"
        />
        <button
          disabled
          className="bg-[#160b0b] border border-wire text-[#2d2d2d] rounded-md px-3 cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5 block" viewBox="0 0 24 24" fill="#2d2d2d">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

    </div>
  );
}
