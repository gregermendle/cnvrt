import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-full" data-theme="light">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preload" href="https://unpkg.com/@ffmpeg/core@0.12.5/dist/umd/ffmpeg-core.js" as="script" />
        <link rel="preload" href="https://unpkg.com/@ffmpeg/core@0.12.5/dist/umd/ffmpeg-core.wasm" as="script" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="h-full font-mono text-sm bg-[#CCC]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
