import { Socket } from "socket.io-client";
import { IoNamespace, UseSocketOptions, UseSocketReturnType } from "./types";
declare function useSocket<I extends Record<string, any>, T extends Socket = Socket>(options?: UseSocketOptions<I>): UseSocketReturnType;
declare function useSocket<I extends Record<string, any>, T extends Socket = Socket>(namespace: IoNamespace, options?: UseSocketOptions<I>): UseSocketReturnType;
export default useSocket;
