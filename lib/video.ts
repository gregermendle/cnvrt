import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";

export const videoToGif = async (ffmpeg: FFmpeg, file: File) => {
  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, "-loop", "0", "output.gif");
  const data = ffmpeg.FS("readFile", "output.gif");
  return URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
};
