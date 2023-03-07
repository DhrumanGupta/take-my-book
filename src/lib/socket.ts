import { Socket } from "socket.io";
import { redisSubInstance } from "lib/redis";
import { User } from "types/DTOs";
import { addChatMessage } from "./repos/chat";

type Props = {
  socket?: Socket;
  key: string;
  message: object;
};

type AddUserSocketProps = {
  socket: Socket;
  user: User;
};

type IUserSockets = {
  [key: string]: Socket;
};

declare global {
  var userSockets: IUserSockets;
}

const userSockets: IUserSockets = global.userSockets || {};

global.userSockets = userSockets;

const addUserSocket = ({ socket }: AddUserSocketProps) => {
  socket.on("connect-ack", (data) => {
    // console.log(
    //   `User id ${data.id} connected with new socket with id ${socket.id}`
    // );
    userSockets[data.id] = socket;

    // console.log(
    //   Object.keys(userSockets).map((userId) => ({
    //     userId,
    //     socketId: userSockets[userId].id,
    //   }))
    // );
  });

  socket.on(
    "message",
    (data: {
      type: string;
      message: string;
      receiverId: string;
      sessionId: string;
    }) => {
      const { type, message, receiverId, sessionId } = data;

      if (!type || !message || !receiverId || !sessionId) {
        return;
      }

      let userId = "";

      for (let socketKey of Object.keys(userSockets)) {
        if (socket.id == userSockets[socketKey].id) {
          userId = socketKey;
          break;
        }
      }

      if (!userId) {
        console.log(
          `Socket with id ${socket.id} sent message, but was not found in user_sockets`
        );
        return;
      }

      addChatMessage(message, sessionId, userId, receiverId).then((data) => {
        if (!data) {
          return;
        }

        socket.emit("message-recieve", data);

        if (!Object.keys(userSockets).includes(receiverId)) {
          return;
        }
        userSockets[receiverId].emit("message-recieve", data);
      });

      console.log(data);
    }
  );

  socket.on("disconnect", (reason) => {
    let key: string | null = null;

    for (let socketKey of Object.keys(userSockets)) {
      if (socket.id == userSockets[socketKey].id) {
        key = socketKey;
        break;
      }
    }

    if (!key) {
      console.log(
        `Socket with id ${socket.id} disconnected, but was not found in user_sockets`
      );
      return;
    }

    delete userSockets[key];
  });
};

const sendMessage = ({ socket, key, message }: Props) => {
  if (!socket) {
    return;
  }

  socket.emit(key, message);
};

export { sendMessage, addUserSocket };
