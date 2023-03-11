import { useContext, useEffect, useId } from "react";
import type { Server, Socket } from "socket.io";
import IoContext from "./IoContext";
import { CustomServer, IoContextInterface, SocketLike } from "./types";
import useSocket from "./useSocket";
const op = (name: string) => `@sio@${name}@sio@` as const;

const JOIN_ROOM = op("join-room");
const LEAVE_ROOM = op("leave-room");
const EMIT = op("emit");
const BROADCAST = op("broadcast");
const NO_ROOM = op("no-room");
const CALLBACK = op("callback");

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
        server.callbacks.delete(callbackId);
        server.callbacks.set(callbackId + "@@" + socket.id, cb);
        cb(socket, server);
      }
    });
    socket.on("disconnect", () => {
      server.callbacks.forEach((_cb, id) => {
        const [, socketId] = id.split("@@");
        if (socketId === socket.id) {
          server.callbacks.delete(id);
        }
      });
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
  const id = useId();
  const callbackId = cb?.toString() + id;

  useEffect(() => {
    if (!cb) {
      return;
    }

    if (socket.connected) {
      socket.emit(CALLBACK, callbackId);
    } else {
      socket.once("connect", () => {
        socket.emit(CALLBACK, callbackId);
      });
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
