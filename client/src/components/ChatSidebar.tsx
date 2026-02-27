import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import arsenalLogo from "@/assets/arsenal-fc-logo.png";
import { useChat } from "@/hooks/useChat";
import { getToken, parseDisplayName, login } from "@/lib/auth";

interface ChatSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ open, onToggle }: ChatSidebarProps) {
  const [token, setToken] = useState(getToken);
  const { messages, connected, sendMessage } = useChat(token);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      await login(nickname);
      setToken(getToken());
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !connected) return;
    sendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full md:w-[270px] shrink-0 bg-surface border-t border-wire md:border-t-0 md:border-l flex flex-col overflow-hidden max-h-[45vh] md:max-h-none">
      {/* Header */}
      <div className="px-3.5 py-[13px] border-b border-wire flex items-center gap-2">
        <img
          src={arsenalLogo}
          alt="Arsenal FC"
          className="h-5 w-auto shrink-0 opacity-75"
        />
        <span className="text-[13px] font-bold tracking-[0.3px]">
          Gunners Chat
        </span>
        <div className="ml-auto flex items-center gap-2 text-[10.5px] text-[#444]">
          <span
            className={`w-1.5 h-1.5 rounded-full inline-block ${connected ? "bg-green-500" : "bg-[#444]"}`}
          />
          {connected ? "online" : "offline"}
          <button
            onClick={onToggle}
            title="Close chat"
            className="ml-1 text-[#444] hover:text-[#aaa] transition-colors bg-transparent border-none cursor-pointer leading-none p-0.5"
          >
            <X className="w-3.5 h-3.5 block" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!token ? (
        /* Nickname login form */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
          <img
            src={arsenalLogo}
            alt="Arsenal FC"
            className="w-[72px] opacity-15"
          />
          <p className="text-[13px] font-bold text-[#555]">Pick a nickname</p>
          <form
            onSubmit={handleLogin}
            className="w-full flex flex-col gap-2"
          >
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your name…"
              maxLength={30}
              autoFocus
              className="w-full bg-pitch border border-wire rounded-md text-[#ddd] text-[12px] px-2.5 py-2 outline-none font-[inherit] placeholder:text-[#333] focus:border-brand/40 transition-colors"
            />
            {loginError && (
              <p className="text-[11px] text-red-400">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn || !nickname.trim()}
              className="bg-brand/15 border border-brand/30 text-brand text-[12px] font-bold py-1.5 rounded-md hover:bg-brand hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loggingIn ? "Joining…" : "Join Chat"}
            </button>
          </form>
        </div>
      ) : (
        /* Messages list */
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-3 py-2">
          {messages.length === 0 && (
            <p className="text-[11px] text-[#333] text-center mt-6">
              No messages yet. Say something!
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.username === parseDisplayName(token);
            return (
              <div key={msg.id} className="flex flex-col gap-0.5">
                <span
                  className={`text-[10.5px] font-bold ${isMe ? "text-brand" : "text-[#888]"}`}
                >
                  {msg.username}
                </span>
                <span className="text-[12px] text-[#ccc] leading-[1.5] break-words">
                  {msg.content}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <div className="p-2.5 border-t border-wire flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!token || !connected}
          placeholder={
            !token ? "Pick a nickname first…" : connected ? "Say something…" : "Connecting…"
          }
          maxLength={500}
          className="flex-1 bg-pitch border border-wire rounded-md text-[#ddd] text-[12px] px-2.5 py-2 outline-none font-[inherit] placeholder:text-[#2a2a2a] disabled:cursor-not-allowed disabled:text-[#2a2a2a] focus:border-brand/40 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!token || !connected || !input.trim()}
          className="bg-[#160b0b] border border-wire text-[#2d2d2d] rounded-md px-3 flex items-center justify-center enabled:hover:border-brand/40 enabled:hover:text-brand transition-colors disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5 block" />
        </button>
      </div>
    </div>
  );
}
