import type { Server } from "socket.io";
import type { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import type { url } from "./utils/url";
export type IoNamespace = string;

export type IoConnection = Socket;

export type SocketLike<T extends Socket = Socket> = T & {
  namespaceKey: string;
};

export type SocketState = {
  state: {
    status: "disconnected" | "connecting" | "connected";
    error: Error | null;
    lastMessage: Record<string, any>;
  };
  notify: (event: string) => void;
  subscribe: (
    callback: (state: SocketState["state"], event: string) => void
  ) => () => void;
  subscribers: Set<(state: SocketState["state"], event: string) => void>;
};

export type CleanupFunction = () => void;

export type CreateConnectionFuncReturnType<T extends Socket = Socket> = {
  socket: SocketLike<T>;
  cleanup: CleanupFunction;
} & SocketState;

export type CreateConnectionFunc<T extends Socket = Socket> = (
  urlConfig: ReturnType<typeof url>,
  options?: Partial<ManagerOptions & SocketOptions> | undefined
) => CreateConnectionFuncReturnType<T> | undefined;

export type GetConnectionFunc<T extends Socket> = (namespace?: IoNamespace) =>
  | ({
      socket: T;
    } & SocketState)
  | undefined;

export type CustomServer = Server & {
  initializedRpc?: boolean;
};

export type IoContextInterface<T extends Socket> = {
  createConnection: CreateConnectionFunc<T>;
  getConnection: GetConnectionFunc<T>;
  registerSharedListener: (
    namespace: string,
    forEvent: string
  ) => CleanupFunction;
  server?: CustomServer;
  rpcPrefix: string;
};

export type UseSocketOptions = Partial<ManagerOptions & SocketOptions> & {
  enabled?: boolean;
};

export type UseSocketReturnType<T extends Socket> = {
  socket: SocketLike<T>;
  connected: boolean;
  error: any;
};
export type UseSocketEventProps<T> = {
  keepPrevious?: boolean;
  onMessage?: (message: T) => void;
};
export type UseSocketEventReturnType<T extends unknown> = {
  sendMessage: (message: any) => Promise<T>;
  socket: SocketLike;
  status: "connecting" | "connected" | "disconnected";
  error: Error | null;
  lastMessage: T;
};
