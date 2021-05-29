import { Socket } from "socket.io-client";
declare const useSocketEvent: <T extends unknown>(socket: Socket, event: string) => {
    lastMessage: T | undefined;
    error: any;
};
export default useSocketEvent;
