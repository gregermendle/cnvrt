import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { useCallback, useEffect, useState } from "react";

let _ffmpeg: FFmpeg;
export const useFFmpeg = <T>(
  _runner: (ffmpeg: FFmpeg, file: File) => Promise<T>
) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"stopped" | "running">("stopped");

  if (!_ffmpeg) {
    const isSupported = typeof SharedArrayBuffer === "function";

    _ffmpeg = createFFmpeg({
      log: true,
      mainName: isSupported ? "proxy_main" : "main",
      corePath: isSupported
        ? window.origin + "/ffmpeg/ffmpeg-core.js"
        : "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
    });
  }

  useEffect(() => {
    _ffmpeg.setProgress(({ ratio }) => {
      setProgress(ratio);
    });
  }, []);

  const run = useCallback(
    async (file: File) => {
      try {
        setStatus("running");
        if (!_ffmpeg.isLoaded()) {
          await _ffmpeg.load();
        }
        const result = await _runner(_ffmpeg, file);
        setStatus("stopped");
        return result;
      } catch (e: any) {
        setError(e.message);
        setStatus("stopped");
        return null;
      }
    },
    [_runner]
  );

  return [run, status, progress, error] as const;
};
