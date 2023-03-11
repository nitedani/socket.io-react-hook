import { useContext, useEffect, useId } from "react";
import type { Server, Socket } from "socket.io";
import IoContext from "./IoContext";
import { CustomServer, IoContextInterface, SocketLike } from "./types";
import useSocket from "./useSocket";

const delimiter = "¤";
const op = (id: number) => `${delimiter}${id}${delimiter}` as const;
const JOIN_ROOM = op(1);
const LEAVE_ROOM = op(2);
const EMIT = op(3);
const BROADCAST = op(4);
const NO_ROOM = op(5);
const CALLBACK = op(6);

const createEmitter =
  ({ room, socket }: { room?: string; socket: SocketLike }) =>
  (event: string, ...args: any[]) =>
    socket.emitWithAck(EMIT, event, room, ...args);

const initRpcServer = (server: CustomServer) => {
  server.removeAllListeners();
  server.sockets.removeAllListeners();
  server.sockets.sockets.forEach((socket) => {
    socket.removeAllListeners();
  });
  server.callbacks = new Map<string, (socket: Socket) => void>();
  server.on("connection", (socket) => {
    const rpcPrefix = socket.handshake.query["rpc-prefix"] as
      | string
      | undefined;
    if (!rpcPrefix) {
      socket.disconnect(true);
      return;
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
    socket.on(CALLBACK, (callbackId) => {
      const cb = server.callbacks.get(callbackId);
      if (cb) {
        cb(socket, server);
      }
    });
    socket.once("disconnect", () => {
      setTimeout(() => {
        const sockets = server.sockets.sockets;
        const socket = Array.from(sockets.values()).find(
          (socket) => socket.handshake.query["rpc-prefix"] === rpcPrefix
        );

        if (socket) {
          // the client reconnected before the timeout
          return;
        }
        server.callbacks.forEach((_cb, id) => {
          if (id.includes(rpcPrefix)) {
            console.log("delete", id, rpcPrefix);

            server.callbacks.delete(id);
          }
        });
      }, 1000);
    });
  });
};

let initializedDev = false;
export const useSocketServer = (
  cb?: (socket: Socket, server: Server) => void
) => {
  const { socket } = useSocket();
  const ioContext = useContext<IoContextInterface<SocketLike>>(IoContext);
  const server = ioContext.server;
  const rpcPrefix = ioContext.rpcPrefix;
  const hookId = useId();
  const callbackId = `${hookId}${delimiter}${rpcPrefix}`;

  useEffect(() => {
    if (!cb) {
      return;
    }

    console.log("useEffect", socket.connected, callbackId);
    if (socket.connected) {
      socket.emit(CALLBACK, callbackId);
      return () => {};
    } else {
      const listener = () => {
        socket.emit(CALLBACK, callbackId);
      };
      socket.on("connect", listener);
      return () => {
        socket.off("connect", listener);
      };
    }
  }, [socket]);

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
    server.callbacks.set(callbackId, cb);
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

  return { ...operations, socket };
};

export default useSocketServer;
