import { useContext } from "react";
import type { Socket } from "socket.io";
import IoContext from "./IoContext";
import { CustomServer, IoContextInterface, SocketLike } from "./types";
import useSocket from "./useSocket";

let initializedDev = false;

const delimiter = "¤";
const op = (id: number) => `${delimiter}${id}${delimiter}` as const;
const JOIN_ROOM = op(1);
const LEAVE_ROOM = op(2);
const EMIT = op(3);
const BROADCAST = op(4);
const NO_ROOM = op(5);

const createEmitter =
  ({ room, socket }: { room?: string; socket: SocketLike }) =>
  (event: string, ...args: any[]) =>
    socket.emitWithAck(EMIT, event, room, ...args);

const initRpcServer = (
  server: CustomServer,
  cb?: (serverBoundSocket: Socket) => void
) => {
  // @ts-ignore
  if (server.__listener) {
    // @ts-ignore
    server.off("connection", server.__listener);
  }

  // @ts-ignore
  server.__listener = (socket: Socket) => {
    if (cb) {
      cb(socket);
    }
    socket.on(JOIN_ROOM, (room: string, ack) => {
      socket.join(room);
      ack?.();
    });
    socket.on(LEAVE_ROOM, (room: string, ack) => {
      socket.leave(room);
      ack?.();
    });
    socket.on(EMIT, (event: string, room: string, ...args) => {
      const ack = args.pop();

      if (room === NO_ROOM) {
        socket.broadcast.emit(event, ...args);
        ack?.();
        return;
      }

      if (room === BROADCAST) {
        server.emit(event, ...args);
        ack?.();
        return;
      }

      if (room.includes(BROADCAST)) {
        const [roomName] = room.split(BROADCAST);
        server.to(roomName).emit(event, ...args);
      }

      socket.to(room).emit(event, ...args);
      ack?.();
    });
  };

  // @ts-ignore
  server.on("connection", server.__listener);
};

export const useSocketServer = (cb?: (serverBoundSocket: Socket) => void) => {
  const { socket } = useSocket();
  const ioContext = useContext<IoContextInterface<SocketLike>>(IoContext);
  const server = ioContext.server;

  if (
    server &&
    ((process.env.NODE_ENV === "development" && !initializedDev) ||
      !server.initializedRpc)
  ) {
    server.initializedRpc = true;
    initializedDev = true;
    initRpcServer(server);
  }

  if (cb && server) {
    const listener = (socket: Socket) => {
      socket.once("disconnect", () => {
        socket.offAny();
      });
      cb(socket);
    };

    server.on("connection", (socket) => {
      if (socket.handshake.query["rpc-prefix"] === ioContext.rpcPrefix) {
        listener(socket);
      }
    });
  }

  const operations = {
    emit: createEmitter({ socket, room: NO_ROOM }),
    broadcast: createEmitter({ socket, room: BROADCAST }),
    to: (room: string) => {
      return {
        emit: createEmitter({ socket, room }),
        broadcast: createEmitter({ socket, room: room + BROADCAST }),
      };
    },
    join: (room: string) => {
      return socket.emitWithAck(JOIN_ROOM, room);
    },
    leave: (room: string) => {
      return socket.emitWithAck(LEAVE_ROOM, room);
    },
  };

  return { ...operations, socket, server };
};

export default useSocketServer;
