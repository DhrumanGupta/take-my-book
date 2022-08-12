import "../styles/globals.css";
import "../styles/app.css";
import type { AppProps } from "next/app";
import Navbar from "components/Navbar";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
