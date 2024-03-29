import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export const videoToGif = async (
  ffmpeg: FFmpeg,
  file: File[],
  options: { fps: string }
) => {
  // fps is based on the 1/100 delay from https://www.w3.org/Graphics/GIF/spec-gif89a.txt
  // max fps is 100fps so with a whole number delay between frames we end up with 100/10, 100/3, 100/2
  // for our below fps
  const fps = options.fps === "10" ? 10 : options.fps === "30" ? 33.33 : 50;
  await ffmpeg.writeFile(file[0].name, await fetchFile(file[0]));
  await ffmpeg.exec([
    "-i",
    file[0].name,
    "-loop",
    "0",
    "-filter_complex",
    `fps=${fps},scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
    "-vsync",
    "vfr",
    "output.gif",
  ]);
  const data = await ffmpeg.readFile("output.gif");
  return URL.createObjectURL(new Blob([data], { type: "image/gif" }));
};

export const imagesToGif = async (
  ffmpeg: FFmpeg,
  files: File[],
  options: { fps: string }
) => {
  // fps is based on the 1/100 delay from https://www.w3.org/Graphics/GIF/spec-gif89a.txt
  // max fps is 100fps so with a whole number delay between frames we end up with 100/10, 100/3, 100/2
  // for our below fps
  const fps = options.fps === "10" ? 10 : options.fps === "30" ? 33.33 : 50;
  const globDigits = files.length.toString().length;
  let ext = "png";
  await Promise.all(
    files.map(async (file, i) => {
      ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      return ffmpeg.writeFile(
        `${createGlobName(i, files.length)}.${ext}`,
        await fetchFile(file)
      );
    })
  );
  await ffmpeg.exec([
    "-framerate",
    String(fps),
    "-i",
    `%0${globDigits}d.${ext}`,
    "-filter_complex",
    `[0:v] scale=w=720:h=-1,split [a][b];[a] palettegen=stats_mode=single [p];[b][p] paletteuse=new=1`,
    "output.gif",
  ]);
  const data = await ffmpeg.readFile("output.gif");
  return URL.createObjectURL(new Blob([data], { type: "image/gif" }));
};

const createGlobName = (i: number, totalCount: number) => {
  const totalDigits = totalCount.toString().length;
  const inputDigits = i.toString().length;
  return "0".repeat(totalDigits - inputDigits) + i;
};
