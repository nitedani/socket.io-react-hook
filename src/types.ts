import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { url } from "./utils/url";
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
  notify: () => void;
  subscribe: (callback: (state: SocketState["state"]) => void) => () => void;
  subscribers: Set<(state: SocketState["state"]) => void>;
};

export type CreateConnectionFuncReturnType<T extends Socket = Socket> = {
  socket: SocketLike<T>;
  cleanup: () => void;
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

export type IoContextInterface<T extends Socket> = {
  createConnection: CreateConnectionFunc<T>;
  getConnection: GetConnectionFunc<T>;
  registerSharedListener: (namespace: string, forEvent: string) => void;
};

export type UseSocketOptions<I> = Partial<ManagerOptions & SocketOptions> & {
  enabled?: boolean;
} & I;

export type UseSocketReturnType<T extends Socket> = {
  socket: SocketLike<T>;
  connected: boolean;
  error: any;
};
