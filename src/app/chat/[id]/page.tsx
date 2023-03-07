"use client";

import clsx from "clsx";
import { PrimaryButton } from "components/Button";
import InputGroup from "components/InputGroup";
import Loading from "components/Loading";
import { chatRoutes } from "data/routes";
import useUser from "hooks/useUser";
import { getChatSession } from "lib/apis/chatApi";
import { useSocket } from "lib/SocketContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { ChatMessage } from "types/DTOs";

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex px-5 lg:hidden">
      <Link href="/chat" className="text-2xl font-bold text-black no-underline">
        &lt;
      </Link>
      <p className="ml-8 text-lg font-semibold mt-1 p-0">{children}</p>
    </div>
  );
};

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const { user, loading } = useUser();

  const { data, isLoading, mutate, isValidating, error } = useSWR(
    chatRoutes.getSession(id),
    () => getChatSession(id),
    {
      keepPreviousData: true,
    }
  );

  const [message, setMessage] = useState("");

  const { on, unsubscribe } = useSocket();

  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/chat");
    }
    const callback = (x: ChatMessage) => {
      if (!isValidating) {
        // @ts-ignore
        mutate(data);
      }
    };

    // @ts-ignore
    on("message-recieve", callback);

    return () => {
      // @ts-ignore
      unsubscribe("message-recieve", callback);
    };
  }, [data, on, unsubscribe, mutate, isValidating, error]);

  useEffect(() => {
    const x = setTimeout(() => {
      ref.current?.scrollIntoView(false);
    }, 100);

    return () => {
      clearTimeout(x);
    };
  }, [data]);

  const { sendMessage: sendSocketMessage } = useSocket();

  useEffect(() => {
    console.log("Data:");
    console.log(data);

    console.log(`Loading: ${isLoading}`);
    console.log(`Validating: ${isValidating}`);
    console.log("\n");
  }, [data, isLoading, isValidating]);

  if (!data || loading) {
    return <Loading />;
  }

  const sendMessage = () => {
    if (message.trim().length <= 0) {
      return;
    }

    sendSocketMessage("message", {
      type: "message",
      message,
      receiverId: data.users[0].id,
      sessionId: data.id,
    });

    setMessage("");
  };

  return (
    <>
      {/* {JSON.stringify(data)} */}
      <Header>{data.users[0].name}</Header>

      {/* <div className="flex-grow"> */}
      <div className="max-h-full overflow-y-scroll flex-grow">
        <div className="flex flex-col-reverse h-full" ref={ref}>
          {data.messages.map((message) => (
            <span
              key={message.id}
              className={clsx(
                "block mt-2 mx-4 p-2 rounded bg-gray-light w-48 md:w-72 lg:w-96",
                message.fromId === user.id && "ml-auto"
              )}
            >
              {message.message}
            </span>
          ))}
        </div>
        {/* </div> */}
      </div>

      <form
        className="p-4 w-full grid grid-cols-5 lg:grid-cols-7"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <div className="grid grid-cols-1 col-span-4 lg:col-span-6 mb-1 mr-4">
          <InputGroup
            type="text"
            value={message}
            setValue={setMessage}
            label="Message"
            className="w-full"
          />
        </div>
        <PrimaryButton className="mt-auto mb-0">Send</PrimaryButton>
      </form>
    </>
  );
};

export default Page;
