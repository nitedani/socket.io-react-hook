import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
export declare type IoNamespace = string;
export declare type IoConnection = Socket;
export declare type CreateConnectionFunc<T extends Socket> = (namespace?: string, options?: Partial<ManagerOptions & SocketOptions> | undefined) => T;
export declare type GetConnectionFunc<T extends Socket> = (namespace?: IoNamespace) => T | undefined;
export declare type IoContextInterface<T extends Socket> = {
    createConnection: CreateConnectionFunc<T>;
    getConnection: GetConnectionFunc<T>;
    getLastMessage: (namespace: string, forEvent: string) => any;
    setLastMessage: (namespace: string, forEvent: string, message: any) => void;
    registerSharedListener: (namespace: string, forEvent: string) => void;
    getError: (namespace: string) => any;
    setError: (namespace: string, error: any) => void;
    getStatus: () => "connecting" | "connected" | "disconnected";
};
export declare type UseSocketOptions<I> = Partial<ManagerOptions & SocketOptions> & {
    enabled?: boolean;
} & I;
export declare type UseSocketReturnType = {
    socket: Socket;
    connected: boolean;
};
