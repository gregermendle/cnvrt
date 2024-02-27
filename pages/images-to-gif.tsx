import { useEffect, useRef, useState } from "react";
import DragAndDrop from "../components/DragAndDrop";
import { imagesToGif } from "../lib/video";
import { useFFmpeg } from "../hooks/ffmpeg";
import { NextPage } from "next/types";
import { cn } from "../utils";
import { useRouter } from "next/router";
import { Cat } from "../components/Cat";
import Head from "next/head";

export const VideoToGif: NextPage = () => {
  return (
    <>
      <Head>
        <title>cnvrt.run - images to gif</title>
        <meta
          name="title"
          content="cnvrt - compile images to an animated gif"
        />
        <meta name="description" content="compile images to an animated gif" />
        <meta
          property="og:title"
          content="cnvrt - compile images to an animated gif"
        />
        <meta
          property="og:description"
          content="compile images to an animated gif"
        />
        <meta
          property="twitter:title"
          content="cnvrt - compile images to an animated gif"
        />
        <meta
          property="twitter:description"
          content="compile images to an animated gif"
        />
      </Head>
      <DragAndDrop allowedTypes={["image"]} multiple>
        {({ dragging, files, openFileViewer }) => (
          <Converter
            onImportClick={openFileViewer}
            files={files.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }

              if (a.name > b.name) {
                return 1;
              }

              return 0;
            })}
            dragging={dragging}
          />
        )}
      </DragAndDrop>
      <div className="text-center px-2 py-2">
        videos are converted in your browser. no data is stored or collected by
        cnvrt. cnvrt may not be compatible with some devices.
      </div>
    </>
  );
};

export const Converter = ({
  files,
  onImportClick,
  dragging,
}: {
  files?: File[];
  dragging: boolean;
  onImportClick: () => void;
}) => {
  const [convertVideo, conversionStatus] = useFFmpeg(imagesToGif);
  const output = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const [fps, setFps] = useState("10");

  const isFinished = conversionStatus.type === "finished";
  useEffect(() => {
    if (isFinished && typeof conversionStatus.output === "string") {
      output.current!.src = conversionStatus.output;
      const link = document.createElement("a");
      link.download = "download.gif";
      link.href = conversionStatus.output;
      link.click();
    }
  }, [isFinished]);

  return (
    <div className="h-full flex items-center">
      <div className="relative grid sm:grid-cols-2 grid-cols-1 grid-rows-[min-content,1fr,min-content] w-full max-w-2xl mx-auto gap-y-4">
        <div className="text-center flex items-center gap-2 justify-center">
          images
          {files && files.length > 0 && (
            <button className="underline" onClick={router.reload}>
              {"<"}start over{">"}
            </button>
          )}
        </div>
        <div className="text-center hidden sm:block">
          {conversionStatus.type !== "finished" && "gif"}
        </div>
        <div className="col-span-2 bg-black border border-black grid sm:grid-cols-2 sm:grid-rows-1 grid-rows-2 grid-cols-1 gap-6 rounded-3xl overflow-hidden">
          <div className="bg-[#ECECEC] relative rounded-r-3xl aspect-auto h-64 overflow-hidden">
            {files && files.length > 0 && (
              <div className="w-full h-full overflow-auto py-4">
                {files?.map((x) => {
                  const img = URL.createObjectURL(x);
                  return (
                    <div
                      key={x.name}
                      className="flex items-center gap-2 px-4 py-1"
                    >
                      <img
                        src={img}
                        className="w-8 h-8 aspect-square object-contain"
                      />
                      {x.name}
                    </div>
                  );
                })}
              </div>
            )}
            {files?.length === 0 && (
              <div className="h-full w-full flex items-center justify-center">
                <button
                  autoFocus
                  onClick={onImportClick}
                  className="underline"
                  aria-label="import video and convert to gif"
                >
                  {dragging ? "< drop here >" : "import +"}
                </button>
              </div>
            )}
          </div>
          <div className="bg-[#ECECEC] rounded-l-3xl aspect-auto h-64 flex items-center justify-center">
            <div className="flex flex-col gap-2 items-center">
              {files &&
                files.length > 0 &&
                conversionStatus.type === "stopped" && (
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
              {files &&
                files.length > 0 &&
                conversionStatus.type === "stopped" && (
                  <button
                    className="underline"
                    onClick={() => convertVideo(files, { fps })}
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
