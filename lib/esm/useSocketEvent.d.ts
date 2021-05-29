import { Socket } from "socket.io-client";
declare const useSocketEvent: <T extends unknown>(socket: Socket, event: string) => {
    lastMessage: T;
    sendMessage: (message: any) => Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>;
    socket: Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>;
};
export default useSocketEvent;
