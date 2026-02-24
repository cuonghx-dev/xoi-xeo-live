const NAV_LINKS = ["Live", "Schedule", "Results", "Highlights"] as const;

export function Navbar() {
  return (
    <header className="h-[54px] bg-surface border-b-2 border-brand flex items-center justify-between px-5 shrink-0 z-10">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 no-underline select-none">
        {/* Arsenal cannon badge */}
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 80 80" fill="none">
          {/* Shield */}
          <path d="M40 4 L72 16 L72 46 Q72 66 40 76 Q8 66 8 46 L8 16 Z" fill="#1a0000" stroke="#EF0107" strokeWidth="2"/>
          {/* Barrel */}
          <rect x="14" y="35" width="44" height="11" rx="2.5" fill="#EF0107"/>
          {/* Muzzle cap */}
          <rect x="55" y="33" width="14" height="15" rx="2" fill="#EF0107"/>
          {/* Muzzle opening */}
          <rect x="65" y="37" width="5" height="7" rx="1.5" fill="#6b0000"/>
          {/* Wheel left */}
          <circle cx="26" cy="50" r="9" stroke="#EF0107" strokeWidth="2" fill="#1a0000"/>
          <circle cx="26" cy="50" r="3.5" fill="#EF0107"/>
          <line x1="26" y1="41" x2="26" y2="59" stroke="#EF0107" strokeWidth="1"/>
          <line x1="17" y1="50" x2="35" y2="50" stroke="#EF0107" strokeWidth="1"/>
          {/* Wheel right */}
          <circle cx="46" cy="50" r="9" stroke="#EF0107" strokeWidth="2" fill="#1a0000"/>
          <circle cx="46" cy="50" r="3.5" fill="#EF0107"/>
          <line x1="46" y1="41" x2="46" y2="59" stroke="#EF0107" strokeWidth="1"/>
          <line x1="37" y1="50" x2="55" y2="50" stroke="#EF0107" strokeWidth="1"/>
          {/* AFC text */}
          <text x="40" y="30" textAnchor="middle" fill="#EF0107" fontSize="10" fontWeight="900" fontFamily="Georgia, serif" letterSpacing="1">AFC</text>
        </svg>

        <div className="flex flex-col leading-[1.15]">
          <span className="text-[15px] font-black tracking-[2.5px] text-white uppercase">
            XOI XEO <em className="text-brand not-italic">LIVE</em>
          </span>
          <span className="text-[9.5px] text-[#888] tracking-[1.5px] uppercase">The Gunners Hub</span>
        </div>
      </a>

      {/* Nav */}
      <nav className="hidden md:flex gap-1">
        {NAV_LINKS.map((item) => (
          <a
            key={item}
            href="#"
            className={[
              "text-[13px] px-[13px] py-[5px] rounded no-underline transition-all duration-150",
              item === "Live"
                ? "text-white bg-brand"
                : "text-[#888] hover:text-white hover:bg-brand/20",
            ].join(" ")}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Live badge (always visible — site branding) */}
      <div className="flex items-center gap-2.5">
        <span className="bg-brand text-white text-[10px] font-extrabold px-2 py-1 rounded-[3px] tracking-[1.5px] animate-pulse">
          ● LIVE
        </span>
      </div>
    </header>
  );
}
