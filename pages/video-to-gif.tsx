import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Header from "../layouts/header";
import Base from "../layouts/base";
import DragAndDrop from "../components/DragAndDrop";
import Button from "../components/Button";
import { NextPageWithLayout } from "./_app";
import { Card, CardFooter, CardHeader } from "../components/Card";
import UploadButton from "../components/UploadButton";
import { videoToGif } from "../lib/video";
import { useFFmpeg } from "../hooks/ffmpeg";

export const VideoToGif: NextPageWithLayout = () => {
  return (
    <div className="h-full max-h-full px-2">
      <PageMeta />
      <DragAndDrop allowedTypes={["video"]}>
        {({ dragging, files, openFileViewer }) => (
          <>
            <Card className="w-full max-w-2xl mx-auto md:mt-16 mt-8">
              <CardHeader
                heading="Video to GIF"
                subHeading="Convert most video formats to animated gif"
              />
              <div className="px-6 pb-6 flex flex-col items-start justify-start gap-4">
                <UploadButton onClick={openFileViewer} isDragging={dragging}>
                  Drag and drop or click to add a video
                </UploadButton>
                {files.map((file) => (
                  <Converter key={file.name} file={file} />
                ))}
              </div>
              <CardFooter>
                The conversion process happens in your browser. Images are not
                uploaded or stored on cnvrt.
              </CardFooter>
            </Card>
          </>
        )}
      </DragAndDrop>
    </div>
  );
};

export const Converter = ({ file }: { file: File }) => {
  const [convertVideo, conversionStatus, conversionProgress] =
    useFFmpeg(videoToGif);
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [{ name, width, height, mimeType }, setInfo] = useState({
    width: 0,
    height: 0,
    mimeType: "",
    name: "",
  });

  async function convert() {
    const gif = await convertVideo(file);
    if (gif) {
      const link = document.createElement("a");
      link.download = `download.gif`;
      link.href = gif;
      link.click();
    }
  }

  useEffect(() => {
    const ctx = canvas.current!.getContext("2d")!;
    video.current!.src = URL.createObjectURL(file);

    const drawImage = () => {
      ctx.clearRect(
        0,
        0,
        video.current!.videoWidth,
        video.current!.videoHeight
      );
      canvas.current!.height = video.current!.videoHeight;
      canvas.current!.width = video.current!.videoWidth;
      ctx.drawImage(
        video.current!,
        0,
        0,
        canvas.current!.width,
        canvas.current!.height
      );
      setInfo({
        height: video.current!.videoHeight,
        width: video.current!.videoWidth,
        mimeType: file.type,
        name: file.name,
      });
    };

    video.current?.addEventListener("canplay", drawImage);
    return () => {
      video.current?.removeEventListener("canplay", drawImage);
    };
  }, [file]);

  return (
    <div className="grid sm:grid-cols-[min-content_1fr] gap-4 grid-cols-1 w-full">
      <div className="ring ring-primary-600 rounded-md overflow-hidden">
        <div className="font-medium text-primary-800 bg-primary-100 flex justify-between px-3 py-1 text-md">
          <span>
            {width}px X {height}px
          </span>
          <span>{mimeType}</span>
        </div>
        <video preload="auto" ref={video} className="hidden" />
        <canvas
          ref={canvas}
          className="object-cover h-72 w-full sm:w-64 sm:h-40"
        />
      </div>
      <div>
        <div className="text-md font-semibold text-gray-800 leading-none mb-2">
          {name}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => convert()}
            size="sm"
            disabled={conversionStatus === "running"}
          >
            {conversionStatus === "stopped"
              ? "Convert to gif"
              : `Converting... ${Math.ceil(conversionProgress * 100)}%`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export function PageMeta() {
  return (
    <Head>
      <title>CNVRT.run - Convert video files to animated gifs</title>
      <meta
        name="title"
        content="CNVRT.run - Convert video files to animated gifs"
      />
      <meta name="description" content="Convert video files to animated gifs" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://cnvrt.run" />
      <meta
        property="og:title"
        content="CNVRT.run - Convert video files to animated gifs"
      />
      <meta
        property="og:description"
        content="Convert video files to animated gifs"
      />
      <meta property="og:image" content="https://cnvrt.run/social.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://cnvrt.run" />
      <meta
        property="twitter:title"
        content="CNVRT.run - Convert video files to animated gifs"
      />
      <meta
        property="twitter:description"
        content="Convert video files to animated gifs"
      />
      <meta property="twitter:image" content="https://cnvrt.run/social.png" />
    </Head>
  );
}

export default VideoToGif;

VideoToGif.getLayout = (page) => {
  return (
    <Base>
      <Header>{page}</Header>
    </Base>
  );
};
