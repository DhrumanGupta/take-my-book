import { Server as IOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import { redisPubInstance } from "lib/redis";
import authorizedRoute from "lib/middlewares/authorizedRoute";
import { User } from "types/DTOs";
import { addUserSocket } from "lib/socket";
// import messageHandler from "../../utils/sockets/messageHandler";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const SocketHandler = (
  req: NextApiRequest,
  res: NextApiResponseWithSocket,
  user: User
) => {
  if (!user) {
    res.status(401).end();
    return;
  }
  if (res.socket.server.io) {
    // It means that socket server was already initialised
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new IOServer(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket: Socket) => {
    addUserSocket({ user, socket });
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
};

// @ts-ignore
export default authorizedRoute(SocketHandler);
