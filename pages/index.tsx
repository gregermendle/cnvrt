import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import DragAndDrop from "../components/DragAndDrop";
import { videoToGif } from "../lib/video";
import { useFFmpeg } from "../hooks/ffmpeg";
import { NextPage } from "next/types";
import Link from "next/link";
import { cn } from "../utils";
import {
  delayWhen,
  from,
  fromEvent,
  interval,
  map,
  mergeMap,
  of,
  repeat,
  switchMap,
  takeUntil,
  tap,
  timer,
} from "rxjs";
import { useRouter } from "next/router";

export const VideoToGif: NextPage = () => {
  return (
    <div className="h-screen min-h-screen grid grid-rows-[auto,1fr,auto] grid-cols-1">
      <Header />
      <PageMeta />
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
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex justify-between px-2 py-2">
      <svg
        aria-label="cnvrt logo"
        width="33"
        height="9"
        viewBox="0 0 33 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.63086 7.77148C5.34961 7.88477 5.05859 7.96875 4.75781 8.02344C4.45703 8.07812 4.14258 8.10547 3.81445 8.10547C3.3418 8.10547 2.91797 8.04102 2.54297 7.91211C2.16797 7.7832 1.84961 7.5918 1.58789 7.33789C1.32617 7.08398 1.125 6.76953 0.984375 6.39453C0.847656 6.01953 0.779297 5.58594 0.779297 5.09375C0.779297 4.61719 0.853516 4.18555 1.00195 3.79883C1.1543 3.41211 1.36719 3.08203 1.64062 2.80859C1.91406 2.53516 2.24219 2.32422 2.625 2.17578C3.01172 2.02734 3.44141 1.95312 3.91406 1.95312C4.30078 1.95312 4.625 1.97461 4.88672 2.01758C5.15234 2.05664 5.39062 2.10742 5.60156 2.16992V3.55859C5.35938 3.4375 5.0957 3.34375 4.81055 3.27734C4.5293 3.21094 4.26172 3.17773 4.00781 3.17773C3.74219 3.17773 3.50391 3.22266 3.29297 3.3125C3.08203 3.40234 2.9043 3.52734 2.75977 3.6875C2.61523 3.84766 2.50391 4.04297 2.42578 4.27344C2.35156 4.5 2.31445 4.75 2.31445 5.02344C2.31445 5.30859 2.35547 5.56445 2.4375 5.79102C2.51953 6.01758 2.63477 6.21094 2.7832 6.37109C2.93555 6.52734 3.11719 6.64844 3.32812 6.73438C3.53906 6.81641 3.77344 6.85742 4.03125 6.85742C4.15625 6.85742 4.28711 6.84961 4.42383 6.83398C4.56445 6.81445 4.70312 6.78906 4.83984 6.75781C4.98047 6.72266 5.11719 6.68359 5.25 6.64062C5.38672 6.59766 5.51367 6.55078 5.63086 6.5V7.77148ZM10.9629 8V4.12109C10.9629 3.46875 10.7207 3.14258 10.2363 3.14258C9.99414 3.14258 9.76172 3.24023 9.53906 3.43555C9.32031 3.63086 9.08789 3.89648 8.8418 4.23242V8H7.41211V2.04688H8.64844L8.68359 2.92578C8.80469 2.77344 8.92969 2.63477 9.05859 2.50977C9.19141 2.38477 9.33398 2.2793 9.48633 2.19336C9.63867 2.10352 9.80273 2.03516 9.97852 1.98828C10.1543 1.94141 10.3516 1.91797 10.5703 1.91797C10.875 1.91797 11.1406 1.96875 11.3672 2.07031C11.5938 2.16797 11.7832 2.30859 11.9355 2.49219C12.0879 2.67188 12.2012 2.89062 12.2754 3.14844C12.3535 3.40234 12.3926 3.6875 12.3926 4.00391V8H10.9629ZM17.3379 8H15.6914L13.3301 2.04688H14.9238L16.1602 5.42188L16.5293 6.51172L16.8926 5.46875L18.1406 2.04688H19.6758L17.3379 8ZM24.4395 4.36133C24.4473 4.13867 24.4355 3.94922 24.4043 3.79297C24.377 3.63672 24.3301 3.50781 24.2637 3.40625C24.2012 3.30469 24.123 3.23047 24.0293 3.18359C23.9355 3.13672 23.8281 3.11328 23.707 3.11328C23.4961 3.11328 23.2773 3.20117 23.0508 3.37695C22.8281 3.54883 22.582 3.83398 22.3125 4.23242V8H20.8477V2.04688H22.1426L22.1953 2.91406C22.293 2.76172 22.4023 2.625 22.5234 2.50391C22.6484 2.38281 22.7852 2.2793 22.9336 2.19336C23.0859 2.10352 23.2539 2.03516 23.4375 1.98828C23.6211 1.94141 23.8223 1.91797 24.041 1.91797C24.3418 1.91797 24.6074 1.9707 24.8379 2.07617C25.0723 2.17773 25.2676 2.33008 25.4238 2.5332C25.584 2.73633 25.7012 2.99219 25.7754 3.30078C25.8535 3.60547 25.8867 3.95898 25.875 4.36133H24.4395ZM32.1152 7.94141C31.8574 8 31.5977 8.04688 31.3359 8.08203C31.0742 8.11719 30.8262 8.13477 30.5918 8.13477C30.2012 8.13477 29.8633 8.09375 29.5781 8.01172C29.2969 7.92969 29.0625 7.80469 28.875 7.63672C28.6914 7.46875 28.5547 7.25586 28.4648 6.99805C28.3789 6.73633 28.3359 6.42578 28.3359 6.06641V3.16016H26.7363V2.04688H28.3359V0.523438L29.8008 0.142578V2.04688H32.1152V3.16016H29.8008V5.96094C29.8008 6.30078 29.8789 6.55859 30.0352 6.73438C30.1914 6.90625 30.4531 6.99219 30.8203 6.99219C31.0547 6.99219 31.2832 6.97266 31.5059 6.93359C31.7285 6.89453 31.9316 6.84961 32.1152 6.79883V7.94141Z"
          fill="black"
        />
      </svg>
      <Link href="https://github.com/gregermendle/cnvrt">github</Link>
    </div>
  );
};

const eyesOpenASCII = [
  " /\\__/\\",
  "( •⩊• )",
  " >    <",
  "( U  U )",
  " @    @",
];

const eyesClosedASCII = [
  " /\\__/\\",
  "( >⩊< )",
  " >    <",
  "( U  U )",
  " @    @",
];

const pawsOnlyASCII = "  U  U  ";

const pawsOnly = (x: Array<string>) => {
  return [...x.slice(0, 3), pawsOnlyASCII];
};

export const Cat = ({
  half,
  className,
  ...rest
}: React.HTMLAttributes<HTMLPreElement> & { half: boolean }) => {
  const [frame, setFrame] = useState(eyesOpenASCII);

  // Could probably do this with css but i dont feel like it
  useEffect(() => {
    const blink = from([[eyesClosedASCII, eyesOpenASCII]])
      .pipe(
        mergeMap((x) =>
          from(x).pipe(
            map((x) => (half ? pawsOnly(x) : x)),
            repeat(Math.round(1 + Math.random() * 1))
          )
        ),
        delayWhen((_, idx) => interval(idx * 150)),
        tap(setFrame),
        delayWhen(() => interval(4000 + Math.round(Math.random() * 4000))),
        repeat()
      )
      .subscribe();

    return () => blink.unsubscribe();
  }, [half]);

  return (
    <pre
      {...rest}
      className={cn(className, "leading-tight")}
      aria-label="kitty ascii art"
    >
      {frame.join("\n")}
    </pre>
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
  const [previewStatus, setPreviewStatus] = useState<
    "idle" | "loading" | "ready" | "unavailable"
  >("idle");

  const isFinished = conversionStatus.type === "finished";
  useEffect(() => {
    if (isFinished && typeof conversionStatus.output === "string") {
      output.current!.src = conversionStatus.output;
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
      <div className="relative grid grid-cols-2 grid-rows-[min-content,1fr,min-content] w-full max-w-2xl mx-auto gap-y-4">
        <div className="text-center flex items-center gap-2 justify-center">
          video
          {previewStatus !== "idle" && (
            <button className="underline" onClick={router.reload}>
              {"<"}start over{">"}
            </button>
          )}
        </div>
        <div className="text-center">
          {conversionStatus.type !== "finished" && "gif"}
        </div>
        <div className="col-span-2 bg-black border border-black grid grid-cols-2 grid-rows-1 gap-6 rounded-3xl overflow-hidden">
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
                className="w-full max-h-[16rem] object-fit bg-[#ECECEC]"
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
              <Cat
                half={conversionStatus.type === "finished"}
                className={cn(
                  conversionStatus.type === "finished" && "absolute -top-2"
                )}
              />
              <img
                ref={output}
                crossOrigin="anonymous"
                className={cn(
                  "w-full max-h-[16rem] object-fit",
                  conversionStatus.type === "finished" ? "block" : "hidden"
                )}
              />
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
                  onClick={() => convertVideo(file)}
                >
                  convert
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 text-center">
          convert video to an animated gif
        </div>
      </div>
    </div>
  );
};

export function PageMeta() {
  return (
    <Head>
      <title>cnvrt - convert video files to animated gifs</title>
      <meta
        name="title"
        content="cnvrt - convert video files to animated gifs"
      />
      <meta name="description" content="convert video files to animated gifs" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://cnvrt.run" />
      <meta
        property="og:title"
        content="cnvrt - convert video files to animated gifs"
      />
      <meta
        property="og:description"
        content="convert video files to animated gifs"
      />
      <meta property="og:image" content="https://cnvrt.run/social.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://cnvrt.run" />
      <meta
        property="twitter:title"
        content="cnvrt - convert video files to animated gifs"
      />
      <meta
        property="twitter:description"
        content="convert video files to animated gifs"
      />
      <meta property="twitter:image" content="https://cnvrt.run/social.png" />
    </Head>
  );
}

export default VideoToGif;
