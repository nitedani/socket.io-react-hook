import { Socket } from "socket.io-client";
export declare const useSocketEvent: <T extends unknown>(socket: Socket, event: string) => {
    lastMessage: T | undefined;
    error: any;
};
