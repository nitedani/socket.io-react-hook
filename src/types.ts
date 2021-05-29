import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";

export type IoNamespace = string;

export type IoConnection = Socket;

export type CreateConnectionFunc<T extends Socket> = (
  namespace?: string,
  options?: Partial<ManagerOptions & SocketOptions> | undefined
) => T;

export type GetConnectionFunc<T extends Socket> = (
  namespace?: IoNamespace
) => T | undefined;

export type IoContextInterface<T extends Socket> = {
  createConnection: CreateConnectionFunc<T>;
  getConnection: GetConnectionFunc<T>;
};

export type UseSocket<I> = {
  namespace?: IoNamespace;
  options?: Partial<ManagerOptions & SocketOptions> & { enabled?: boolean } & I;
};
