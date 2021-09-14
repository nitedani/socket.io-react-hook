import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { url } from "./utils/url";
export type IoNamespace = string;

export type IoConnection = Socket;

export type SocketLikeWithNamespace<T extends Socket = Socket> = T & {
  namespaceKey: string;
};

export type CreateConnectionFuncReturnType<T extends Socket = Socket> = {
  socket: SocketLikeWithNamespace<T>;
  cleanup: () => void;
};

export type CreateConnectionFunc<T extends Socket = Socket> = (
  urlConfig: ReturnType<typeof url>,
  options?: Partial<ManagerOptions & SocketOptions> | undefined
) => CreateConnectionFuncReturnType<T> | undefined;

export type GetConnectionFunc<T extends Socket> = (
  namespace?: IoNamespace
) => T | undefined;

export type IoContextInterface<T extends Socket> = {
  createConnection: CreateConnectionFunc<T>;
  getConnection: GetConnectionFunc<T>;
  getLastMessage: (namespace: string, forEvent: string) => any;
  setLastMessage: (namespace: string, forEvent: string, message: any) => void;
  registerSharedListener: (namespace: string, forEvent: string) => void;
  getError: (namespace: string) => any;
  setError: (namespace: string, error: any) => void;
  getStatus: (namespace: string) => "connecting" | "connected" | "disconnected";
};

export type UseSocketOptions<I> = Partial<ManagerOptions & SocketOptions> & {
  enabled?: boolean;
} & I;

export type UseSocketReturnType = {
  socket: SocketLikeWithNamespace;
  connected: boolean;
  error: any;
};
