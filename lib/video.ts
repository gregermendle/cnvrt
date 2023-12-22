import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export const videoToGif = async (ffmpeg: FFmpeg, file: File) => {
  await ffmpeg.writeFile(file.name, await fetchFile(file));
  await ffmpeg.exec([
    "-i",
    file.name,
    "-loop",
    "0",
    "-vf",
    `fps=50,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
    "-vsync",
    "vfr",
    "output.gif",
  ]);
  const data = await ffmpeg.readFile("output.gif");
  return URL.createObjectURL(new Blob([data], { type: "image/gif" }));
};
