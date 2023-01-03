import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import Layout from "../components/layout";
import Head from "next/head";

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
        <title>CNVRT.Run</title>
        <meta name="title" content="CNVRT.Run - HTML to Remix Links & Meta" />
        <meta
          name="description"
          content="Convert html meta and link tags to typed Remix Meta and Links functions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cnvrt.run" />
        <meta
          property="og:title"
          content="CNVRT.Run - HTML to Remix Links & Meta"
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
          content="CNVRT.Run - HTML to Remix Links & Meta"
        />
        <meta
          property="twitter:description"
          content="Convert html meta and link tags to typed Remix Meta and Links functions."
        />
        <meta property="twitter:image" content="https://cnvrt.run/social.png" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

const defaultLayout: NextPageLayout = (page) => {
  return <Layout>{page}</Layout>;
};
