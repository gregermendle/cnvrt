import { FFmpeg } from "@ffmpeg/ffmpeg";
import {
  type LogEvent,
  type ProgressEvent,
} from "@ffmpeg/ffmpeg/dist/esm/types";
import { toBlobURL } from "@ffmpeg/util";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Subject,
  catchError,
  filter,
  fromEventPattern,
  mergeMap,
  takeUntil,
  tap,
} from "rxjs";

type Runner<T, O> = (ffmpeg: FFmpeg, file: File[], options: O) => Promise<T>;

type Status<T> =
  | {
      type: "running";
      progress: number;
    }
  | {
      type: "finished";
      output: T;
    }
  | {
      type: "stopped";
    }
  | {
      type: "error";
      error: string;
    };

export const useFFmpeg = <T, O>(_runner: Runner<T, O>) => {
  const $ffmpeg = useRef(new Subject<[typeof _runner, File[], O]>());
  const [status, setStatus] = useState<Status<T>>({
    type: "stopped",
  });

  useEffect(() => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.5/dist/umd";
    const ffmpeg = new FFmpeg();

    const $log = fromEventPattern<LogEvent>(
      (handler) => ffmpeg.on("log", handler),
      (handler) => ffmpeg.off("log", handler)
    );

    const logSub = $log.subscribe(({ message, type }) =>
      console.log(`${type}: ${message}`)
    );

    const $error = $log.pipe(
      filter(({ message }) =>
        message.toLowerCase().includes("conversion failed")
      ),
      tap(() =>
        setStatus({ type: "error", error: "oopsie. conversion failed." })
      )
    );

    const progressSub = fromEventPattern<ProgressEvent>(
      (handler) => ffmpeg.on("progress", handler),
      (handler) => ffmpeg.off("progress", handler)
    )
      .pipe(
        takeUntil($error),
        tap(({ progress }) => setStatus({ type: "running", progress }))
      )
      .subscribe();

    const mainSub = $ffmpeg.current
      .pipe(
        tap(() =>
          setStatus({
            type: "running",
            progress: 0,
          })
        ),
        mergeMap(async ([runner, file, options]) => {
          await ffmpeg.load({
            coreURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.js`,
              "text/javascript"
            ),
            wasmURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.wasm`,
              "application/wasm"
            ),
          });
          return runner(ffmpeg, file, options);
        }),
        takeUntil($error),
        tap((output) => {
          setStatus({ type: "finished", output });
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
    async (file: File[], options: O) => {
      $ffmpeg.current.next([_runner, file, options]);
    },
    [_runner]
  );

  return [run, status] as const;
};
