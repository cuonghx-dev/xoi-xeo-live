import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type { Status } from "@/types";

const HLS_URL = import.meta.env.VITE_HLS_URL as string;

export function useHls() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<Status>("disconnected");
  const [error, setError] = useState<string | null>(null);

  const disconnect = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }
    setStatus("disconnected");
  };

  const connect = () => {
    const video = videoRef.current;
    if (!video) return;

    setStatus("connecting");
    setError(null);

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        liveSyncDurationCount: 1,
        liveMaxLatencyDurationCount: 3,
        maxBufferLength: 4,
      });
      hlsRef.current = hls;

      video.addEventListener("playing", () => setStatus("live"), { once: true });

      hls.loadSource(HLS_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError(data.details);
          setStatus("error");
          hls.destroy();
          hlsRef.current = null;
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari / iOS)
      video.src = HLS_URL;
      video.addEventListener("playing", () => setStatus("live"), { once: true });
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      }, { once: true });
      video.addEventListener("error", () => {
        setError("Stream unavailable");
        setStatus("error");
      }, { once: true });
    } else {
      setError("HLS is not supported in this browser");
      setStatus("error");
    }
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  return { videoRef, status, error, connect, disconnect };
}
