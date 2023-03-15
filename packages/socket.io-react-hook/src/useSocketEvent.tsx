import { useContext, useEffect, useRef, useState } from "react";
import SocketMock from "socket.io-mock";
import IoContext from "./IoContext";
import {
  IoContextInterface,
  SocketLike,
  UseSocketEventProps,
  UseSocketEventReturnType,
  UseSocketOptions,
} from "./types";
import useSocket from "./useSocket";
import type {Socket} from "socket.io-client";

// It seems to me, that only one arg functions are supported, as IoProvider does not spread the args in its listener.
type Parameter<T extends (arg: any)=>any> = T extends (arg: infer P) => any ? P : never;

function useSocketEvent<T extends unknown = any>(
  event: string,
  options?: UseSocketEventProps<T> & UseSocketOptions
): UseSocketEventReturnType<T>;
function useSocketEvent<
    ListenEvents extends Record<string, any> = Record<string, (...args: any[]) => void>,
    EmitEvents extends Record<string, any> = Record<string, (...args: any[]) => void>,
    EventProps extends keyof ListenEvents = keyof ListenEvents
>(
    socket: SocketLike<Socket<ListenEvents, EmitEvents>>,
    event: EventProps,
    options?: UseSocketEventProps<Parameter<ListenEvents[EventProps]>>
): UseSocketEventReturnType<Parameter<ListenEvents[EventProps]>>;
function useSocketEvent<
    ListenEvents extends Record<string, any> = Record<string, (...args: any[]) => void>,
    EmitEvents extends Record<string, any> = Record<string, (...args: any[]) => void>,
    EventProps extends keyof ListenEvents = keyof ListenEvents
>(
    socket: SocketLike<Socket<ListenEvents, EmitEvents>> | string,
    event: string | (EventProps & UseSocketOptions),
    options?: UseSocketEventProps<Parameter<ListenEvents[EventProps]>>
): UseSocketEventReturnType<Parameter<ListenEvents[EventProps]>> {
  let enabled = true;
  if (typeof socket === "string") {
    const _options = event as
      | (UseSocketEventProps<Parameter<ListenEvents[EventProps]>> & UseSocketOptions)
      | undefined;
    options = _options;
    enabled = _options?.enabled ?? true;
    event = socket;
    socket = useSocket(
      options as (EventProps & UseSocketOptions) | undefined
    ).socket;
  }

  let onMessage;
  let keepPrevious;
  if (options) {
    onMessage = options.onMessage;
    keepPrevious = options.keepPrevious;
  }

  const ioContext = useContext<IoContextInterface<SocketLike>>(IoContext);
  const { registerSharedListener, getConnection } = ioContext;
  const connection = enabled ? getConnection(socket.namespaceKey) : null;
  const [, rerender] = useState({});
  const state = useRef<{
    socket: SocketLike;
    status: "connecting" | "connected" | "disconnected";
    error: Error | null;
    lastMessage: Parameter<ListenEvents[EventProps]>;
  }>({
    socket: connection?.socket || new SocketMock(),
    status: connection?.state.status || "disconnected",
    error: null,
    lastMessage: connection?.state.lastMessage[event as string] as Parameter<ListenEvents[EventProps]>,
  });

  const sendMessage = <T extends unknown>(message: any) =>
    new Promise<T>((resolve, _reject) => {
      (socket as SocketLike).emit(event as string, message, (response: T) => {
        resolve(response);
      });
    });

  useEffect(() => {
    if (!connection) return;
    const cleanup = registerSharedListener(
      (socket as SocketLike).namespaceKey,
      event as string
    );
    const unsubscribe = connection.subscribe((newState, _event) => {
      let changed = false;

      if (state.current.status !== newState.status) {
        state.current.status = newState.status;
        changed = true;
      }
      if (state.current.error !== newState.error) {
        state.current.error = newState.error;
        changed = true;
      }

      if (_event === "message") {
        const lastMessage = newState.lastMessage[event as string];
        state.current.lastMessage = lastMessage;
        if (onMessage) {
          onMessage(lastMessage);
        }
        changed = true;
      }

      if (changed) {
        rerender({});
      }
    });
    return () => {
      unsubscribe();
      if (!keepPrevious) {
        cleanup();
      }
    };
  }, [socket]);

  return { ...state.current, sendMessage };
}

export default useSocketEvent;
