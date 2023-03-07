import "../styles/globals.css";
import "../styles/app.css";
import useUser from "hooks/useUser";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

type SubscribeProps = {
  name: string;
  callback: (data: object) => void;
};

type ISubscribe = (name: string, callback: (data: object) => void) => void;

type ISocketContext = {
  on: ISubscribe;
  unsubscribe: ISubscribe;
  sendMessage: (key: string, data: object) => void;
};

const socketContextDefaultValues: ISocketContext = {
  on: () => {},
  sendMessage: () => {},
  unsubscribe: () => {},
};

const SocketContext = createContext<ISocketContext>(socketContextDefaultValues);
export function useSocket() {
  return useContext(SocketContext);
}

type Props = {
  children: ReactNode;
};

let socket: ReturnType<typeof io>;

let messageQueue: Array<{ key: string; data: object }> = [];

export function SocketProvider({ children }: Props) {
  const { loggedIn, user } = useUser();

  useEffect(() => {
    const socketInitializer = async () => {
      if (!loggedIn || !user) {
        if (socket) {
          socket.close();
          // delete socket;
          // socket = undefined;
        }
        return;
      }

      if (socket?.connected) {
        return;
      }

      await fetch("/api/socket");
      socket = io({ autoConnect: false });

      socket.connect();

      socket.on("connect", () => {
        // console.log("connected");
        // console.log(messageQueue);
        // console.log(subscribeQueue);
        socket.emit("connect-ack", {
          id: user.id,
        });

        for (let { key, data } of messageQueue) {
          // @ts-ignore
          socket.emit(key, data);
        }

        messageQueue = [];
      });
    };

    socketInitializer();
  }, [loggedIn, user]);

  const on: ISubscribe = (name, callback) => {
    // while (!socket) {}

    if (socket) {
      socket.on(name, callback);
    }
  };

  const sendMessage = (key: string, data: object) => {
    // while (!socket) {}
    // console.log(data);
    if (!loggedIn) return;

    if (socket) {
      // console.log(data);
      // @ts-ignore
      socket.emit(key, data);
    } else {
      messageQueue.push({ key, data });
    }
  };

  const unsubscribe: ISubscribe = (name, callback) => {
    socket?.removeListener(name, callback);
  };

  const value = {
    on,
    sendMessage,
    unsubscribe,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
