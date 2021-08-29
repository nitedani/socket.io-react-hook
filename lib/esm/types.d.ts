import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { url } from "socket.io-client/build/url";
export declare type IoNamespace = string;
export declare type IoConnection = Socket;
export declare type SocketLikeWithNamespace<T extends Socket = Socket> = T & {
    namespaceKey: string;
};
export declare type CreateConnectionFuncReturnType<T extends Socket = Socket> = {
    socket: SocketLikeWithNamespace<T>;
    cleanup: () => void;
};
export declare type CreateConnectionFunc<T extends Socket = Socket> = (urlConfig: ReturnType<typeof url>, options?: Partial<ManagerOptions & SocketOptions> | undefined) => CreateConnectionFuncReturnType<T> | undefined;
export declare type GetConnectionFunc<T extends Socket> = (namespace?: IoNamespace) => T | undefined;
export declare type IoContextInterface<T extends Socket> = {
    createConnection: CreateConnectionFunc<T>;
    getConnection: GetConnectionFunc<T>;
    getLastMessage: (namespace: string, forEvent: string) => any;
    setLastMessage: (namespace: string, forEvent: string, message: any) => void;
    registerSharedListener: (namespace: string, forEvent: string) => void;
    getError: (namespace: string) => any;
    setError: (namespace: string, error: any) => void;
    getStatus: (namespace: string) => "connecting" | "connected" | "disconnected";
};
export declare type UseSocketOptions<I> = Partial<ManagerOptions & SocketOptions> & {
    enabled?: boolean;
} & I;
export declare type UseSocketReturnType = {
    socket: SocketLikeWithNamespace;
    connected: boolean;
    error: any;
};
