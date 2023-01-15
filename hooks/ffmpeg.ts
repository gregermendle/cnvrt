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
    _ffmpeg = createFFmpeg({
      log: true,
      corePath: window.origin + "/ffmpeg/ffmpeg-core.js",
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
        if (!_ffmpeg.isLoaded()) {
          await _ffmpeg.load();
        }
        setStatus("running");
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
