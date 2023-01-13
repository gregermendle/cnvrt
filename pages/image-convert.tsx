import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Header from "../layouts/header";
import Base from "../layouts/base";
import DragAndDrop from "../components/DragAndDrop";
import Button from "../components/Button";
import { NextPageWithLayout } from "./_app";
import { Card } from "../components/Card";
import { cn } from "../utils";

export const ImageConvert: NextPageWithLayout = () => {
  return (
    <div className="h-full max-h-full px-2">
      <PageMeta />
      <DragAndDrop allowedTypes={["image"]}>
        {({ dragging, files, openFileViewer }) => (
          <>
            <Card className="w-full max-w-2xl mx-auto md:mt-16 mt-8">
              <header className="px-6 py-4">
                <div className="text-2xl font-semibold text-gray-800">
                  Convert images
                </div>
                <div className="text-md text-gray-500">
                  Convert images from any browser supported format to PNG, JPG,
                  or BMP
                </div>
              </header>
              <div className="px-6 pb-6 flex flex-col items-start justify-start gap-4">
                <button
                  onClick={openFileViewer}
                  className={cn(
                    "relative overflow-visible flex items-center justify-center gap-4 p-6 py-4 rounded-md bg-primary-100 text-primary-800 font-semibold my-2 w-full border-2 border-primary-400 hover:shine",
                    dragging && "shine"
                  )}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21ZM5 21L16 10L21 15M10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Drag and drop or click to add images
                </button>
                {files.map((file) => (
                  <Converter key={file.name} file={file} />
                ))}
              </div>
              <div className="px-6 py-4 text-sm text-gray-500 border-t border-t-gray-300">
                The conversion process happens in your browser. Images are not
                uploaded or stored on cnvrt.
              </div>
            </Card>
          </>
        )}
      </DragAndDrop>
    </div>
  );
};

export const Converter = ({ file }: { file: File }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement>(new Image());
  const [{ name, width, height, mimeType }, setInfo] = useState({
    width: 0,
    height: 0,
    mimeType: "",
    name: "",
  });

  function downloadAs(ext: string, mimeType: string) {
    const link = document.createElement("a");
    link.download = `download.${ext}`;
    link.href = canvas.current!.toDataURL(mimeType);
    link.click();
  }

  useEffect(() => {
    const ctx = canvas.current!.getContext("2d")!;
    image.current!.src = URL.createObjectURL(file);
    image.current!.onload = function () {
      ctx.clearRect(0, 0, image.current!.width, image.current!.height);
      canvas.current!.height = image.current!.height;
      canvas.current!.width = image.current!.width;
      setInfo({
        height: image.current!.height,
        width: image.current!.width,
        mimeType: file.type.split("/")?.[1],
        name: file.name,
      });
      ctx.drawImage(image.current!, 0, 0);
    };
  }, [file]);

  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex ring ring-1 ring-primary-600 rounded-md overflow-hidden flex-col">
        <div className="font-medium text-primary-800 bg-primary-100 flex justify-between px-3 py-1">
          <span>
            {width}px X {height}px
          </span>
          <span>{mimeType}</span>
        </div>
        <canvas ref={canvas} className="object-cover w-64 h-40" />
      </div>
      <div>
        <div className="text-md font-semibold text-gray-800 leading-none mb-2">
          Download {name} as
        </div>
        <div className="flex gap-2">
          <Button onClick={() => downloadAs("png", "image/png")} size="sm">
            PNG
          </Button>
          <Button onClick={() => downloadAs("jpg", "image/jpg")} size="sm">
            JPG
          </Button>
          <Button onClick={() => downloadAs("bmp", "image/bmp")} size="sm">
            BMP
          </Button>
        </div>
      </div>
    </div>
  );
};

export function PageMeta() {
  return (
    <Head>
      <title>CNVRT - Convert images to PNG, JPG, and BMP</title>
      <meta
        name="title"
        content="CNVRT - Convert images to PNG, JPG, and BMP"
      />
      <meta
        name="description"
        content="Convert most image formats to PNG or JPG"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://cnvrt.run" />
      <meta
        property="og:title"
        content="CNVRT - Convert images to PNG, JPG, and BMP"
      />
      <meta
        property="og:description"
        content="Convert most image formats to PNG or JPG"
      />
      <meta property="og:image" content="https://cnvrt.run/social.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://cnvrt.run" />
      <meta
        property="twitter:title"
        content="CNVRT - Convert images to PNG, JPG, and BMP"
      />
      <meta
        property="twitter:description"
        content="Convert most image formats to PNG or JPG"
      />
      <meta property="twitter:image" content="https://cnvrt.run/social.png" />
    </Head>
  );
}

export default ImageConvert;

ImageConvert.getLayout = (page) => {
  return (
    <Base>
      <Header>{page}</Header>
    </Base>
  );
};
