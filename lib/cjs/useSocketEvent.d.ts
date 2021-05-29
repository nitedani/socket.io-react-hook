import { Socket } from "socket.io-client";
declare const useSocketEvent: <T extends unknown>(socket: Socket, event: string) => {
    lastMessage: T;
    error: any;
};
export default useSocketEvent;
