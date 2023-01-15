import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import Base from "../layouts/base";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

export type NextPageLayout = (page: ReactElement) => ReactNode;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: NextPageLayout;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? defaultLayout;
  return (
    <>
      <Head>
        <title>CNVRT.run</title>
        <meta name="color-scheme" content="only light" />
        <meta name="title" content="CNVRT.run - HTML to Remix Links & Meta" />
        <meta
          name="description"
          content="Convert html meta and link tags to typed Remix Meta and Links functions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cnvrt.run" />
        <meta
          property="og:title"
          content="CNVRT.run - HTML to Remix Links & Meta"
        />
        <meta
          property="og:description"
          content="Convert html meta and link tags to typed Remix Meta and Links functions."
        />
        <meta property="og:image" content="https://cnvrt.run/social.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cnvrt.run" />
        <meta
          property="twitter:title"
          content="CNVRT.run - HTML to Remix Links & Meta"
        />
        <meta
          property="twitter:description"
          content="Convert html meta and link tags to typed Remix Meta and Links functions."
        />
        <meta property="twitter:image" content="https://cnvrt.run/social.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.png"></link>
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <Analytics />
    </>
  );
}

const defaultLayout: NextPageLayout = (page) => {
  return <Base>{page}</Base>;
};
