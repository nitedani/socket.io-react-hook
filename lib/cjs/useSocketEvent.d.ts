import { Socket } from "socket.io-client";
import { SocketLikeWithNamespace } from "./types";
declare const useSocketEvent: <T extends unknown>(socket: SocketLikeWithNamespace, event: string) => {
    lastMessage: T;
    sendMessage: (message: any) => SocketLikeWithNamespace<Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>>;
    socket: SocketLikeWithNamespace<Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>>;
};
export default useSocketEvent;
