import { Socket } from "socket.io-client";
import { UseSocket } from "./types";
declare const useSocket: <I extends Record<string, any>, T extends Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap> = Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>>(args?: UseSocket<I> | undefined) => {
    socket: Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>;
    connected: boolean;
};
export default useSocket;
