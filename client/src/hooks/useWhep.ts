import { useEffect, useRef, useState } from "react";
import type { Status } from "@/types";

const WHEP_URL = import.meta.env.VITE_WHEP_URL as string;

export function useWhep() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [status, setStatus] = useState<Status>("disconnected");
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    return () => disconnect();
  }, []);

  return { videoRef, status, error, connect, disconnect };
}
