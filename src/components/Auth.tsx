import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Loading from "./Loading";

interface Props {
  children: any;
}

function ProtectedPage({ children }: Props) {
  const { loading, loggedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !loggedIn) {
      router.replace("/");
    }
  }, [loggedIn, loading, router]);

  if (loading || !loggedIn) {
    return (
      <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
        <Loading />
      </div>
    );
  }

  return children;
}

function AnonymousPage({ children }: Props) {
  const { loading, loggedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && loggedIn) {
      router.replace("/");
    }
  }, [loggedIn, loading, router]);

  if (loading || loggedIn) {
    return (
      <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
        <Loading />
      </div>
    );
  }

  return children;
}

export { ProtectedPage, AnonymousPage };
