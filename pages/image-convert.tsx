import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Header from "../layouts/header";
import Base from "../layouts/base";
import DragAndDrop from "../components/DragAndDrop";
import Button from "../components/Button";
import { NextPageWithLayout } from "./_app";
import { Card, CardFooter, CardHeader } from "../components/Card";
import UploadButton from "../components/UploadButton";

export const ImageConvert: NextPageWithLayout = () => {
  return (
    <div className="h-full max-h-full px-2">
      <PageMeta />
      <DragAndDrop allowedTypes={["image"]} multiple>
        {({ dragging, files, openFileViewer }) => (
          <>
            <Card className="w-full max-w-2xl mx-auto md:mt-16 mt-8">
              <CardHeader
                heading="Convert images"
                subHeading="Convert images from any browser supported format to PNG, JPG,
                  or BMP"
              />
              <div className="px-6 pb-6 flex flex-col items-start justify-start gap-4">
                <UploadButton onClick={openFileViewer} isDragging={dragging}>
                  Drag and drop or click to add images
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
    <div className="flex w-full items-start gap-4 sm:flex-row flex-col">
      <div className="flex ring ring-primary-600 rounded-md overflow-hidden flex-col flex-shrink-0">
        <div className="font-medium text-primary-800 bg-primary-100 flex justify-between px-3 py-1 text-md">
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
        <div className="flex gap-2 flex-wrap">
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
      <title>CNVRT.run - Convert images to PNG, JPG, and BMP</title>
      <meta
        name="title"
        content="CNVRT.run - Convert images to PNG, JPG, and BMP"
      />
      <meta
        name="description"
        content="Convert most image formats to PNG or JPG"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://cnvrt.run" />
      <meta
        property="og:title"
        content="CNVRT.run - Convert images to PNG, JPG, and BMP"
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
        content="CNVRT.run - Convert images to PNG, JPG, and BMP"
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
