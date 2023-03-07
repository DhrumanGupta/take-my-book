import MetaDecorator from "components/MetaDecorator";
import Link from "next/link";

const Error = () => {
  return (
    <main className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
      <MetaDecorator
        isHeadFile
        title="Not Found"
        description="The page you were looking was not found."
      />
      <h1 className="font-extrabold text-7xl md:text-8xl border-1 border-orange text-center">
        404
      </h1>
      <p className="text-center md:text-lg max-w-sm lg:max-w-lg">
        Uh oh! This is not the page you were looking for
        <br />
        <Link href="/">Go Home</Link>
      </p>
    </main>
  );
};

export default Error;
