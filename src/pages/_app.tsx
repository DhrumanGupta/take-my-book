import "../styles/globals.css";
import "../styles/app.css";
import Navbar from "components/Navbar";
import { ProtectedPage, AnonymousPage } from "components/Auth";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const isProtected = Component.isProtected;
  // @ts-ignore
  const isAnonymous = Component.isAnonymous;

  if (isProtected && isAnonymous) {
    throw new Error(
      `The component ${Component.name} is anonymous and protected as the same time. Please choose either one`
    );
  }

  return (
    <>
      <Navbar />
      {isProtected && (
        <ProtectedPage>
          <Component {...pageProps} />
        </ProtectedPage>
      )}
      {isAnonymous && (
        <AnonymousPage>
          <Component {...pageProps} />
        </AnonymousPage>
      )}
      {!isAnonymous && !isProtected && <Component {...pageProps} />}
    </>
  );
}

export default MyApp;
