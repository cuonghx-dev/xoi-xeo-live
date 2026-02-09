import { useEffect, useRef, useState } from "react";

const WHEP_URL = "http://localhost:8889/live/stream/whep";

type Status = "disconnected" | "connecting" | "live" | "error";

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [status, setStatus] = useState<Status>("disconnected");
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setStatus("connecting");
      setError(null);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      pc.ontrack = (e) => {
        videoRef.current!.srcObject = e.streams[0];
        setStatus("live");
      };

      pc.oniceconnectionstatechange = () => {
        if (
          pc.iceConnectionState === "disconnected" ||
          pc.iceConnectionState === "failed"
        ) {
          setStatus("disconnected");
        }
      };

      // Receive only
      pc.addTransceiver("video", { direction: "recvonly" });
      pc.addTransceiver("audio", { direction: "recvonly" });

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering
      await new Promise<void>((resolve) => {
        if (pc.iceGatheringState === "complete") return resolve();
        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === "complete") resolve();
        };
      });

      // Send offer to MediaMTX WHEP endpoint
      const res = await fetch(WHEP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: pc.localDescription!.sdp,
      });

      if (!res.ok) throw new Error(`WHEP failed: ${res.status}`);

      const answerSdp = await res.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  };

  const disconnect = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("disconnected");
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Live Stream (WHEP)</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          backgroundColor: "#000",
          borderRadius: 8,
          aspectRatio: "16/9",
        }}
      />

      <div
        style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}
      >
        <button onClick={connect} disabled={status === "live"}>
          Connect
        </button>
        <button onClick={disconnect} disabled={status === "disconnected"}>
          Disconnect
        </button>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 12,
            fontSize: 14,
            backgroundColor:
              status === "live"
                ? "#22c55e"
                : status === "connecting"
                  ? "#eab308"
                  : status === "error"
                    ? "#ef4444"
                    : "#666",
            color: "#fff",
          }}
        >
          {status === "live" ? "LIVE" : status.toUpperCase()}
        </span>
      </div>

      {error && (
        <p style={{ color: "#ef4444", marginTop: 8 }}>Error: {error}</p>
      )}
    </div>
  );
}
