import arsenalLogo from "@/assets/arsenal-fc-logo.png";

interface ChatSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ open, onToggle }: ChatSidebarProps) {
  if (!open) return null;

  return (
    <div className="w-[270px] shrink-0 bg-surface border-l border-wire flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-3.5 py-[13px] border-b border-wire flex items-center gap-2">
        <img src={arsenalLogo} alt="Arsenal FC" className="h-5 w-auto shrink-0 opacity-75" />
        <span className="text-[13px] font-bold tracking-[0.3px]">Gunners Chat</span>
        <div className="ml-auto flex items-center gap-2 text-[10.5px] text-[#444]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#444] inline-block"/>
          0 online
          <button
            onClick={onToggle}
            title="Close chat"
            className="ml-1 text-[#444] hover:text-[#aaa] transition-colors bg-transparent border-none cursor-pointer leading-none p-0.5"
          >
            <svg className="w-3.5 h-3.5 block" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Coming-soon body */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3.5 px-5 text-center">
        <img src={arsenalLogo} alt="Arsenal FC" className="w-[90px] opacity-15" />

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
