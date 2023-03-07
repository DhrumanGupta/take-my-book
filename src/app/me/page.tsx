"use client";

import Loading from "components/Loading";
import useUser from "hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user, loading } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(`/profile/${user.id}`);
    }
  }, [user, router]);

  return (
    <div className="flex-grow flex items-center justify-center">
      <Loading />
    </div>
  );
}
