import { FFmpeg } from "@ffmpeg/ffmpeg";
import {
  type LogEvent,
  type ProgressEvent,
} from "@ffmpeg/ffmpeg/dist/esm/types";
import { toBlobURL } from "@ffmpeg/util";
import { useCallback, useEffect, useRef, useState } from "react";
import { Subject, catchError, fromEventPattern, mergeMap, tap } from "rxjs";

type Runner<T> = (ffmpeg: FFmpeg, file: File) => Promise<T>;

type Status<T> =
  | {
      type: "running";
      progress: number;
    }
  | {
      type: "stopped";
      output: T | null;
    }
  | {
      type: "error";
      error: string;
    };

export const useFFmpeg = <T>(_runner: Runner<T>) => {
  const $ffmpeg = useRef(new Subject<[Runner<T>, File]>());
  const [status, setStatus] = useState<Status<T>>({
    type: "stopped",
    output: null,
  });

  useEffect(() => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.5/dist/umd";
    const mtBaseURL = "https://unpkg.com/@ffmpeg/core@0.12.5/dist/umd";
    const ffmpeg = new FFmpeg();
    const progressSub = fromEventPattern<ProgressEvent>(
      (handler) => ffmpeg.on("progress", handler),
      (handler) => ffmpeg.off("progress", handler)
    )
      .pipe(tap(({ progress }) => setStatus({ type: "running", progress })))
      .subscribe();

    const logSub = fromEventPattern<LogEvent>(
      (handler) => ffmpeg.on("log", handler),
      (handler) => ffmpeg.off("log", handler)
    )
      .pipe(tap(({ message }) => console.log(message)))
      .subscribe();

    const mainSub = $ffmpeg.current
      .pipe(
        tap(() =>
          setStatus({
            type: "running",
            progress: 0,
          })
        ),
        mergeMap(async ([runner, file]) => {
          await ffmpeg.load({
            coreURL: await toBlobURL(
              `${
                typeof SharedArrayBuffer === "function" ? mtBaseURL : baseURL
              }/ffmpeg-core.js`,
              "text/javascript"
            ),
            wasmURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.wasm`,
              "application/wasm"
            ),
          });
          return runner(ffmpeg, file);
        }),
        tap((output) => {
          setStatus({ type: "stopped", output });
        }),
        catchError((err, caught) => {
          setStatus({ type: "error", error: err.message });
          return caught;
        })
      )
      .subscribe();
    return () => {
      logSub.unsubscribe();
      progressSub.unsubscribe();
      mainSub.unsubscribe();
    };
  }, []);

  const run = useCallback(
    async (file: File) => {
      $ffmpeg.current.next([_runner, file]);
    },
    [_runner]
  );

  return [run, status] as const;
};
