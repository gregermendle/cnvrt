import { useEffect, useRef, useState } from "react";
import DragAndDrop from "../components/DragAndDrop";
import { videoToGif } from "../lib/video";
import { useFFmpeg } from "../hooks/ffmpeg";
import { NextPage } from "next/types";
import { cn } from "../utils";
import { fromEvent, of, switchMap, takeUntil, tap, timer } from "rxjs";
import { useRouter } from "next/router";
import { Cat } from "../components/Cat";
import Head from "next/head";
import Link from "next/link";

export const VideoToGif: NextPage = () => {
  return (
    <>
      <Head>
        <title>cnvrt.run - video to gif</title>
        <meta
          name="title"
          content="cnvrt - convert video files to animated gifs"
        />
        <meta
          name="description"
          content="convert video files to animated gifs"
        />
        <meta
          property="og:title"
          content="cnvrt - convert video files to animated gifs"
        />
        <meta
          property="og:description"
          content="convert video files to animated gifs"
        />
        <meta
          property="twitter:title"
          content="cnvrt - convert video files to animated gifs"
        />
        <meta
          property="twitter:description"
          content="convert video files to animated gifs"
        />
      </Head>
      <DragAndDrop allowedTypes={["video"]}>
        {({ dragging, files, openFileViewer }) => (
          <Converter
            onImportClick={openFileViewer}
            file={files[0]}
            dragging={dragging}
          />
        )}
      </DragAndDrop>
      <div className="text-center px-2 py-2">
        videos are converted in your browser. no data is stored or collected by
        cnvrt. cnvrt may not be compatible with some devices.
      </div>
      <div className="text-center px-2 py-2 bg-black text-white">
        made by greg{" "}
        <Link
          target="_blank"
          rel="noreferrer"
          href="https://www.x.com/_studable_"
          className="underline underline-offset-4"
        >
          (@_studable_)
        </Link>
      </div>
    </>
  );
};

export const Converter = ({
  file,
  onImportClick,
  dragging,
}: {
  file?: File;
  dragging: boolean;
  onImportClick: () => void;
}) => {
  const [convertVideo, conversionStatus] = useFFmpeg(videoToGif);
  const video = useRef<HTMLVideoElement>(null);
  const output = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const [fps, setFps] = useState("10");
  const [previewStatus, setPreviewStatus] = useState<
    "idle" | "loading" | "ready" | "unavailable"
  >("idle");

  const isFinished = conversionStatus.type === "finished";
  useEffect(() => {
    if (isFinished && typeof conversionStatus.output === "string") {
      output.current!.src = conversionStatus.output;
      const link = document.createElement("a");
      link.download = `${
        file?.name.replace(/\.[^/.]+$/, "") ?? "download"
      }.gif`;
      link.href = conversionStatus.output;
      link.click();
    }
  }, [isFinished]);

  useEffect(() => {
    if (!file) return;

    const sub = of(file)
      .pipe(
        tap(() => {
          setPreviewStatus("loading");

          const dataUrl = URL.createObjectURL(file);
          if (typeof dataUrl === "string") {
            const source = document.createElement("source");
            source.src = dataUrl;
            source.type = file.type;
            video.current!.replaceChildren(source);
            video.current!.currentTime = 1;
          }
        }),
        switchMap(() => {
          const canPlay = fromEvent(video.current!, "canplay").pipe(
            tap(() => setPreviewStatus("ready"))
          );

          return timer(6 * 1000).pipe(
            takeUntil(canPlay),
            tap(() => setPreviewStatus("unavailable"))
          );
        })
      )
      .subscribe();

    return () => sub.unsubscribe();
  }, [file]);

  return (
    <div className="h-full flex items-center">
      <div className="relative grid sm:grid-cols-2 grid-cols-1 grid-rows-[min-content,1fr,min-content] w-full max-w-2xl mx-auto gap-y-4">
        <div className="text-center flex items-center gap-2 justify-center">
          video
          {previewStatus !== "idle" && (
            <button className="underline" onClick={router.reload}>
              {"<"}start over{">"}
            </button>
          )}
        </div>
        <div className="text-center hidden sm:block">
          {conversionStatus.type !== "finished" && "gif"}
        </div>
        <div className="col-span-2 bg-black border border-black grid sm:grid-cols-2 sm:grid-rows-1 grid-rows-2 grid-cols-1 gap-6 rounded-3xl overflow-hidden">
          <div className="bg-[#ECECEC] relative rounded-r-3xl aspect-auto h-64 flex items-center justify-center overflow-hidden">
            {previewStatus === "loading" && <div>loading...</div>}
            {previewStatus === "unavailable" && <div>preview unavailable</div>}
            <div
              className={cn(
                "grid grid-cols-1 w-full grid-rows-[1fr,fit-content(16rem),1fr] h-full",
                previewStatus !== "ready" && "hidden"
              )}
            >
              <div className="bg-[#ECECEC]" />
              <video
                preload="none"
                ref={video}
                className="w-full max-h-[16rem] object-contain bg-[#ECECEC]"
                muted
                loop
                autoPlay
                playsInline
              />
              <div className="bg-[#ECECEC]" />
            </div>
            {!file && (
              <button
                autoFocus
                onClick={onImportClick}
                className="underline"
                aria-label="import video and convert to gif"
              >
                {dragging ? "< drop here >" : "import +"}
              </button>
            )}
          </div>
          <div className="bg-[#ECECEC] rounded-l-3xl aspect-auto h-64 flex items-center justify-center">
            <div className="flex flex-col gap-2 items-center">
              {file && conversionStatus.type === "stopped" && (
                <select
                  onChange={(e) => setFps(e.target.value)}
                  value={fps}
                  className="underline bg-transparent"
                >
                  <option value="10">~10 fps</option>
                  <option value="30">~30 fps</option>
                  <option value="60">~60 fps</option>
                </select>
              )}
              <Cat
                blush={conversionStatus.type === "error"}
                pawsOnly={conversionStatus.type === "finished"}
                className={cn(
                  conversionStatus.type === "finished" &&
                    "absolute sm:-top-2 sm:rotate-0 bottom-8 rotate-180"
                )}
              />
              <img
                ref={output}
                crossOrigin="anonymous"
                className={cn(
                  "w-full max-h-[16rem] object-contain",
                  conversionStatus.type === "finished" ? "block" : "hidden"
                )}
              />
              {conversionStatus.type === "error" && (
                <div>{conversionStatus.error}</div>
              )}
              {conversionStatus.type === "running" && (
                <div>
                  {conversionStatus.progress === 0
                    ? "be very patient"
                    : `${Math.round(conversionStatus.progress * 100)}%`}
                </div>
              )}
              {file && conversionStatus.type === "stopped" && (
                <button
                  className="underline"
                  onClick={() => convertVideo([file], { fps })}
                >
                  convert
                </button>
              )}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "col-span-2 text-center",
            conversionStatus.type === "finished" && "sm:pt-0 pt-10"
          )}
        >
          convert video to an animated gif
        </div>
      </div>
    </div>
  );
};

export default VideoToGif;
