"use client";

import useSWR from "swr";
import Loading from "components/Loading";
import Link from "next/link";
import { ChatSession } from "types/DTOs";
import { chatRoutes } from "data/routes";
import { getChatSessions } from "lib/apis/chatApi";
import React from "react";
import { ProtectedPage } from "components/Auth";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const getData = async () => {};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useSWR<ChatSession[]>(
    chatRoutes.getAllSessions,
    getChatSessions
  );

  const pathname = usePathname();

  if (isLoading) {
    return <Loading />;
  }

  // for (let i = 0; i < 10; i++) {
  //   data?.push(data[0]);
  // }

  return (
    <div
      className={clsx(
        "flex-grow grid max-h-screen",
        data!.length > 0 && "lg:grid-cols-3"
      )}
    >
      {data!.length > 0 && (
        <div
          className={clsx(
            !pathname?.endsWith("chat") && "hidden lg:block",
            "border-r"
          )}
        >
          {data!
            .sort((a, b) => (a.lastMessagedAt > b.lastMessagedAt ? -1 : 1))
            .map((session) => (
              <Link
                key={session.id}
                href={`/chat/${session.users[0].id}`}
                className={clsx("no-underline text-black child:last:border-b")}
              >
                <div
                  className={clsx(
                    "p-8 border-t hover:bg-gray-light duration-75 hover:cursor-pointer"
                    // pathname?.endsWith(session.users[0].id) && "bg-gray-light"
                  )}
                >
                  <p className="font-semibold text-lg">
                    {session.users[0].name}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      )}
      <div className="lg:col-span-2 flex flex-col justify-end max-h-[93vh] lg:max-h-[87vh]">
        {children}
      </div>
    </div>
  );
};

export default function ExportedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      <Layout>{children}</Layout>
    </ProtectedPage>
  );
}
