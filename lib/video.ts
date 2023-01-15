import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";

export const videoToGif = async (ffmpeg: FFmpeg, file: File) => {
  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, "-loop", "0", "output.gif");
  const data = ffmpeg.FS("readFile", "output.gif");
  return URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
};

export const stackVideos = async (ffmpeg: FFmpeg, files: [File, File]) => {
  ffmpeg.FS("writeFile", files[0].name, await fetchFile(files[0]));
  ffmpeg.FS("writeFile", files[1].name, await fetchFile(files[1]));
  await ffmpeg.run(
    "-i",
    files[0].name,
    "-i",
    files[1].name,
    "-filter_complex",
    "[0:v]pad=iw:ih*2[int];[int][1:v]overlay=H/0:2[vid]",
    "-map",
    "[vid]",
    "output.mp4"
  );
  const data = ffmpeg.FS("readFile", "output.mp4");
  return URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
};
