import { Socket } from "socket.io-client";
import { UseSocketOptions } from "./types";
declare const useSocket: <I extends Record<string, any>, T extends Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap> = Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>>(namespace?: string | undefined, options?: UseSocketOptions<I> | undefined) => {
    socket: Socket<import("socket.io-client/build/typed-events").DefaultEventsMap, import("socket.io-client/build/typed-events").DefaultEventsMap>;
    connected: boolean;
};
export default useSocket;
