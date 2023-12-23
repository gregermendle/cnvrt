import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>cnvrt.run</title>
        <meta
          name="title"
          content="cnvrt - convert video files to animated gifs"
        />
        <meta
          name="description"
          content="convert video files to animated gifs"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cnvrt.run" />
        <meta
          property="og:title"
          content="cnvrt - convert video files to animated gifs"
        />
        <meta
          property="og:description"
          content="convert video files to animated gifs"
        />
        <meta property="og:image" content="https://cnvrt.run/social.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cnvrt.run" />
        <meta
          property="twitter:title"
          content="cnvrt - convert video files to animated gifs"
        />
        <meta
          property="twitter:description"
          content="convert video files to animated gifs"
        />
        <meta property="twitter:image" content="https://cnvrt.run/social.png" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
