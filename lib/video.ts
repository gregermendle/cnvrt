import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";

export const videoToGif = async (ffmpeg: FFmpeg, file: File) => {
  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run(
    "-i",
    file.name,
    "-loop",
    "0",
    "-vf",
    `fps=30,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
    "output.gif"
  );
  const data = ffmpeg.FS("readFile", "output.gif");
  return URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
};

//./ffmpeg.exe -framerate 24 -i C:/tmp/%04d.png -filter_complex "[0:v] scale=w=720:h=-1,split [a][b];[a] palettegen=stats_mode=single [p];[b][p] paletteuse=new=1" output.gif
