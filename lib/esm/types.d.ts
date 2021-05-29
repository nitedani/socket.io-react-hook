import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
export declare type IoNamespace = string;
export declare type IoConnection = Socket;
export declare type CreateConnectionFunc<T extends Socket> = (namespace?: string, options?: Partial<ManagerOptions & SocketOptions> | undefined) => T;
export declare type GetConnectionFunc<T extends Socket> = (namespace?: IoNamespace) => T | undefined;
export declare type IoContextInterface<T extends Socket> = {
    createConnection: CreateConnectionFunc<T>;
    getConnection: GetConnectionFunc<T>;
};
export declare type UseSocket<I> = {
    namespace?: IoNamespace;
    options?: Partial<ManagerOptions & SocketOptions> & {
        enabled?: boolean;
    } & I;
};
