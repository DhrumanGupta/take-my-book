import type { NextPageContext } from "next";
import Link from "next/link";

const Error = ({ statusCode }: { statusCode: number }) => {
  return (
    <main className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
      <h1 className="font-extrabold text-7xl md:text-8xl border-1 border-orange text-center">
        {statusCode}
      </h1>
      <p className="text-center md:text-lg max-w-sm lg:max-w-lg">
        There was an unexpectted error.
        <br />
        <Link href="/">Go Home</Link>
      </p>
    </main>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
