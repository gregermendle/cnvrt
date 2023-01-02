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
        <title>CNVRT</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <link
          rel="shortcut icon"
          href="/favicon.png"
          type="image/x-icon"
        ></link>
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

const defaultLayout: NextPageLayout = (page) => {
  return <Layout>{page}</Layout>;
};
