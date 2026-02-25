import { useEffect, useRef, useState } from "react";
import { useWhep } from "@/hooks/useWhep";
import { Navbar } from "@/components/Navbar";
import { ChatSidebar } from "@/components/ChatSidebar";
import arsenalLogo from "@/assets/arsenal-fc-logo.png";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Trophy,
  MessageCircle,
} from "lucide-react";

function CtrlBtn({
  onClick,
  disabled = false,
  title,
  className = "",
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`shrink-0 text-[#ddd] hover:text-brand disabled:opacity-40 transition-colors p-[5px] bg-transparent border-none cursor-pointer leading-none ${className}`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const { videoRef, status, error, connect, disconnect } = useWhep();
  const playerRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progRef = useRef(0);

  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(() => window.innerWidth >= 768);

  const isLive = status === "live";
  const isConnecting = status === "connecting";
  const isError = status === "error";

  /* sync muted → video element (React doesn't reliably reflect the muted prop) */
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted, videoRef]);

  /* sync volume → video element */
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume / 100;
  }, [volume, videoRef]);

  /* track fullscreen state */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* close chat on mobile resize */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 768) setChatOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* live progress bar — direct DOM mutation, no re-renders */
  useEffect(() => {
    const fill = progressFillRef.current;
    if (!fill) return;
    const id = setInterval(() => {
      progRef.current = (progRef.current + 0.012) % 100;
      fill.style.width = progRef.current + "%";
    }, 100);
    return () => clearInterval(id);
  }, []);

  /* ── handlers ── */
  const togglePlay = () => {
    if (status === "disconnected" || status === "error") void connect();
    else if (isLive) disconnect();
  };

  const toggleMute = () => {
    if (muted && volume === 0) setVolume(80);
    setMuted((m) => !m);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setMuted(val === 0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) playerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-pitch text-white">
      <Navbar />

      <main className="flex flex-1 overflow-hidden min-h-0">
        {/* ── VIDEO SECTION ── */}
        <div className="flex-1 flex flex-col overflow-hidden p-3 gap-2.5 min-w-0">
          {/* Match info bar */}
          <div className="bg-surface border border-wire rounded-lg px-4 py-[9px] flex flex-wrap items-center gap-x-3.5 gap-y-1.5 shrink-0">
            <div className="min-w-0">
              <div className="text-[15px] font-bold truncate">
                Arsenal FC&ensp;vs&ensp;Manchester City
              </div>
              <div className="text-[11px] text-[#888] mt-0.5 truncate">
                21:00 · Emirates Stadium, London · Sat, 22 Feb 2026
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-brand/10 border border-brand/25 rounded-full px-3 py-1 text-brand text-[11.5px] font-bold whitespace-nowrap tracking-[0.3px]">
                {/* Premier League badge icon */}
                <Trophy className="w-3.5 h-3.5 shrink-0" />
                Premier League
              </div>
              {/* Chat toggle */}
              <button
                onClick={() => setChatOpen((v) => !v)}
                title={chatOpen ? "Close chat" : "Open chat"}
                className={[
                  "flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1 rounded-full border transition-colors cursor-pointer",
                  chatOpen
                    ? "bg-brand/10 border-brand/25 text-brand"
                    : "bg-surface border-wire text-[#555] hover:border-brand/25 hover:text-brand",
                ].join(" ")}
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                Chat
              </button>
            </div>
          </div>

          {/* Player */}
          <div
            ref={playerRef}
            className="relative bg-black rounded-[10px] overflow-hidden flex-1 min-h-0 border border-wire group/player"
          >
            {/* Placeholder — disconnected or error */}
            {!isLive && !isConnecting && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, #1c0202 0%, #0a0000 55%, #000 100%)",
                }}
              >
                {/* Arsenal Crest */}
                <img
                  src={arsenalLogo}
                  alt="Arsenal FC"
                  className="w-[160px] opacity-[0.22]"
                />

                <div className="text-center">
                  {isError ? (
                    <>
                      <p className="text-[14px] text-[#555] font-semibold mb-1">
                        Connection failed
                      </p>
                      {error && (
                        <p className="text-[11px] text-[#333] mb-3 max-w-[240px] mx-auto">
                          {error}
                        </p>
                      )}
                      <button
                        onClick={() => void connect()}
                        className="text-[12px] bg-brand/15 border border-brand/30 text-brand px-4 py-1.5 rounded hover:bg-brand hover:text-white transition-colors cursor-pointer"
                      >
                        Retry
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-[14px] text-[#555] font-semibold mb-1">
                        Stream not active
                      </p>
                      <p className="text-[11px] text-[#333] mb-3">
                        Kick-off · Emirates Stadium · 21:00
                      </p>
                      <button
                        onClick={() => {
                          void connect();
                          setMuted(false);
                        }}
                        className="text-[12px] bg-brand/15 border border-brand/30 text-brand px-4 py-1.5 rounded hover:bg-brand hover:text-white transition-colors cursor-pointer"
                      >
                        ▶ Play
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Connecting spinner */}
            {isConnecting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 z-10">
                <div className="w-9 h-9 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                <p className="text-[13px] text-[#555]">Connecting to stream…</p>
              </div>
            )}

            {/* Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain block"
            />

            {/* Controls overlay — appears on hover */}
            <div
              className="absolute bottom-0 left-0 right-0 pt-12 px-3.5 pb-3 flex items-center gap-2 z-20"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.4) 60%, transparent 100%)",
              }}
            >
              {/* Play / Pause */}
              <CtrlBtn
                onClick={togglePlay}
                disabled={isConnecting}
                title="Play / Pause"
              >
                {isLive ? (
                  <Pause className="w-[18px] h-[18px] block" />
                ) : (
                  <Play className="w-[18px] h-[18px] block" />
                )}
              </CtrlBtn>

              {/* Progress bar */}
              <div className="flex-1 cursor-pointer group/pb py-1">
                <div className="h-1 group-hover/pb:h-[5px] transition-all duration-150 bg-white/20 rounded overflow-hidden">
                  <div
                    ref={progressFillRef}
                    className="h-full bg-brand rounded"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>

              {/* LIVE label */}
              <span className="text-[11.5px] text-[#bbb] whitespace-nowrap tracking-wide shrink-0">
                LIVE
              </span>

              {/* Mute */}
              <CtrlBtn onClick={toggleMute} title="Mute / Unmute">
                {muted ? (
                  <VolumeX className="w-[18px] h-[18px] block" />
                ) : (
                  <Volume2 className="w-[18px] h-[18px] block" />
                )}
              </CtrlBtn>

              {/* Volume slider */}
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="w-[68px] cursor-pointer shrink-0 accent-brand"
              />

              {/* HD badge */}
              <button className="text-[10px] font-extrabold tracking-[0.8px] bg-white/10 border border-white/15 text-[#ccc] px-2 py-[3px] rounded-[3px] cursor-pointer shrink-0 hover:bg-brand hover:border-brand hover:text-white transition-colors">
                HD
              </button>

              {/* Fullscreen */}
              <CtrlBtn
                onClick={toggleFullscreen}
                title="Fullscreen"
                className="ml-auto"
              >
                {isFullscreen ? (
                  <Minimize className="w-[18px] h-[18px] block" />
                ) : (
                  <Maximize className="w-[18px] h-[18px] block" />
                )}
              </CtrlBtn>
            </div>
          </div>
        </div>

        {/* ── CHAT SIDEBAR ── */}
        <ChatSidebar open={chatOpen} onToggle={() => setChatOpen((v) => !v)} />
      </main>
    </div>
  );
}
