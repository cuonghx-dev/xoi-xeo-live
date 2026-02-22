import { useEffect, useRef, useState } from "react";
import { useWhep } from "@/hooks/useWhep";
import { Navbar } from "@/components/Navbar";
import { ChatSidebar } from "@/components/ChatSidebar";

const STREAM_TABS = ["Stream 1", "Stream 2", "Stream 3"] as const;

/* ── SVG paths for icon toggling ── */
const PATH_PLAY  = "M8 5v14l11-7z";
const PATH_PAUSE = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";
const PATH_VOL   = "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z";
const PATH_MUTE  = "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z";
const PATH_FS_ENTER = "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z";
const PATH_FS_EXIT  = "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z";

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
  const playerRef      = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progRef        = useRef(0);

  const [activeStream, setActiveStream] = useState(0);
  const [muted,        setMuted]        = useState(true);
  const [volume,       setVolume]       = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isLive       = status === "live";
  const isConnecting = status === "connecting";
  const isError      = status === "error";

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
          <div className="bg-surface border border-wire rounded-lg px-4 py-[9px] flex items-center gap-3.5 shrink-0">
            <div>
              <div className="text-[15px] font-bold">
                Arsenal FC&ensp;vs&ensp;Manchester City
              </div>
              <div className="text-[11px] text-[#888] mt-0.5">
                21:00 · Emirates Stadium, London · Sat, 22 Feb 2026
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-brand/10 border border-brand/25 rounded-full px-3 py-1 text-brand text-[11.5px] font-bold whitespace-nowrap tracking-[0.3px]">
              {/* Premier League badge icon */}
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C8 3 5 6 5 9c0 2.5 1.5 4.5 3.5 5.5L8 19h8l-.5-4.5C17.5 13.5 19 11.5 19 9c0-3-3-6-7-6z"/>
              </svg>
              Premier League
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
                style={{ background: "radial-gradient(ellipse at 50% 40%, #1c0202 0%, #0a0000 55%, #000 100%)" }}
              >
                {/* Arsenal Crest */}
                <svg className="w-[108px] opacity-[0.22]" viewBox="0 0 200 240" fill="none">
                  <path d="M100 8 L186 38 L186 138 Q186 196 100 232 Q14 196 14 138 L14 38 Z"
                        stroke="#EF0107" strokeWidth="3.5" fill="rgba(239,1,7,0.06)"/>
                  <path d="M100 20 L174 46 L174 138 Q174 188 100 220 Q26 188 26 138 L26 46 Z"
                        stroke="rgba(239,1,7,0.2)" strokeWidth="1" fill="none"/>
                  <text x="100" y="80" textAnchor="middle" fill="#EF0107" fontSize="26"
                        fontWeight="900" fontFamily="Georgia, serif" letterSpacing="4">AFC</text>
                  <line x1="46" y1="92" x2="154" y2="92" stroke="rgba(239,1,7,0.35)" strokeWidth="1"/>
                  <rect x="32"  y="108" width="104" height="22" rx="5" fill="#EF0107"/>
                  <rect x="130" y="104" width="32"  height="30" rx="4" fill="#EF0107"/>
                  <rect x="156" y="109" width="9"   height="20" rx="2.5" fill="#6b0000"/>
                  <circle cx="58"  cy="140" r="17" stroke="#EF0107" strokeWidth="3" fill="rgba(239,1,7,0.08)"/>
                  <circle cx="58"  cy="140" r="6"  fill="#EF0107"/>
                  <line x1="58"  y1="123" x2="58"  y2="157" stroke="#EF0107" strokeWidth="1.5"/>
                  <line x1="41"  y1="140" x2="75"  y2="140" stroke="#EF0107" strokeWidth="1.5"/>
                  <circle cx="104" cy="140" r="17" stroke="#EF0107" strokeWidth="3" fill="rgba(239,1,7,0.08)"/>
                  <circle cx="104" cy="140" r="6"  fill="#EF0107"/>
                  <line x1="104" y1="123" x2="104" y2="157" stroke="#EF0107" strokeWidth="1.5"/>
                  <line x1="87"  y1="140" x2="121" y2="140" stroke="#EF0107" strokeWidth="1.5"/>
                  <rect x="52"  y="128" width="58"  height="8" rx="2" fill="rgba(239,1,7,0.3)"/>
                  <text x="100" y="186" textAnchor="middle" fill="#EF0107" fontSize="13"
                        fontWeight="700" fontFamily="sans-serif" letterSpacing="5">ARSENAL</text>
                  <text x="100" y="202" textAnchor="middle" fill="rgba(239,1,7,0.5)" fontSize="8.5"
                        fontFamily="sans-serif" letterSpacing="2">FOOTBALL CLUB</text>
                </svg>

                <div className="text-center">
                  {isError ? (
                    <>
                      <p className="text-[14px] text-[#555] font-semibold mb-1">Connection failed</p>
                      {error && (
                        <p className="text-[11px] text-[#333] mb-3 max-w-[240px] mx-auto">{error}</p>
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
                      <p className="text-[14px] text-[#555] font-semibold mb-1">Stream not active</p>
                      <p className="text-[11px] text-[#333]">Kick-off · Emirates Stadium · 21:00</p>
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
              className="absolute bottom-0 left-0 right-0 pt-12 px-3.5 pb-3 flex items-center gap-2 opacity-0 group-hover/player:opacity-100 transition-opacity duration-200 z-20"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.4) 60%, transparent 100%)" }}
            >
              {/* Play / Pause */}
              <CtrlBtn onClick={togglePlay} disabled={isConnecting} title="Play / Pause">
                <svg className="w-[18px] h-[18px] block" viewBox="0 0 24 24" fill="currentColor">
                  <path d={isLive ? PATH_PAUSE : PATH_PLAY}/>
                </svg>
              </CtrlBtn>

              {/* Progress bar */}
              <div className="flex-1 cursor-pointer group/pb py-1">
                <div className="h-1 group-hover/pb:h-[5px] transition-all duration-150 bg-white/20 rounded overflow-hidden">
                  <div ref={progressFillRef} className="h-full bg-brand rounded" style={{ width: "0%" }}/>
                </div>
              </div>

              {/* LIVE label */}
              <span className="text-[11.5px] text-[#bbb] whitespace-nowrap tracking-wide shrink-0">
                LIVE
              </span>

              {/* Mute */}
              <CtrlBtn onClick={toggleMute} title="Mute / Unmute">
                <svg className="w-[18px] h-[18px] block" viewBox="0 0 24 24" fill="currentColor">
                  <path d={muted ? PATH_MUTE : PATH_VOL}/>
                </svg>
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
              <CtrlBtn onClick={toggleFullscreen} title="Fullscreen" className="ml-auto">
                <svg className="w-[18px] h-[18px] block" viewBox="0 0 24 24" fill="currentColor">
                  <path d={isFullscreen ? PATH_FS_EXIT : PATH_FS_ENTER}/>
                </svg>
              </CtrlBtn>
            </div>
          </div>

          {/* Stream tabs */}
          <div className="flex gap-1.5 shrink-0">
            {STREAM_TABS.map((label, i) => (
              <button
                key={label}
                onClick={() => setActiveStream(i)}
                className={[
                  "text-[12px] font-medium px-[18px] py-1.5 rounded-[5px] cursor-pointer transition-all duration-150 border",
                  activeStream === i
                    ? "bg-brand border-brand text-white font-bold"
                    : "bg-surface border-wire text-[#888] hover:border-brand hover:text-white",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

        </div>

        {/* ── CHAT SIDEBAR ── */}
        <ChatSidebar />

      </main>
    </div>
  );
}
