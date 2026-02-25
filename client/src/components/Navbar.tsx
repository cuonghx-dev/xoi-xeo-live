import arsenalLogo from "@/assets/arsenal-fc-logo.png";

const NAV_LINKS = ["Live", "Matches", "Rankings"] as const;

export function Navbar() {
  return (
    <header className="h-[54px] bg-surface border-b-2 border-brand flex items-center justify-between px-5 shrink-0 z-10">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 no-underline select-none">
        <img src={arsenalLogo} alt="Arsenal FC" className="h-8 w-auto shrink-0" />

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
