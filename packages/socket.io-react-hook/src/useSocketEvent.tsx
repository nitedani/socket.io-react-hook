import { useContext, useEffect, useRef, useState } from "react";
import SocketMock from "socket.io-mock";
import IoContext from "./IoContext";
import {
  IoContextInterface,
  SocketLike,
  UseSocketEventOptions,
  UseSocketEventReturnType,
  UseSocketOptions,
} from "./types";
import useSocket from "./useSocket";
import type { Socket } from "socket.io-client";
import type {
  DefaultEventsMap,
  EventNames,
  EventsMap,
} from "@socket.io/component-emitter";

// TODO: spread args in IoProvider and replace this with Parameters
type Parameter<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P[0]
  : never;

// TODO: change any to unknown in major version
function useSocketEvent<T = any, EmitMessageCbReturnType = any>(
  event: string,
  options?: UseSocketEventOptions<T> & UseSocketOptions
): UseSocketEventReturnType<T, any[], EmitMessageCbReturnType>;
function useSocketEvent<
  T = never,
  ListenEvents extends EventsMap = DefaultEventsMap,
  EmitEvents extends EventsMap = ListenEvents,
  EventKey extends EventNames<ListenEvents> = EventNames<ListenEvents>,
  ListenMessageType = [T] extends [never]
    ? Parameter<ListenEvents[EventKey]>
    : T,
  EmitMessageArgs extends any[] = Parameters<
    EmitEvents[EventNames<EmitEvents>]
  >,
  //TODO: infer from last argument returntype(cb) of EmitEvents[EventKey]
  // if last argument is a function then infer return type
  // if last argument is not a function then infer void
  EmitMessageCbReturnType = any
>(
  socket: SocketLike<Socket<ListenEvents, EmitEvents>>,
  event: EventKey,
  options?: UseSocketEventOptions<ListenMessageType>
): UseSocketEventReturnType<
  ListenMessageType,
  EmitMessageArgs,
  EmitMessageCbReturnType
>;
function useSocketEvent<
  T = never,
  ListenEvents extends EventsMap = DefaultEventsMap,
  EmitEvents extends EventsMap = ListenEvents,
  EventKey extends EventNames<ListenEvents> = EventNames<ListenEvents>,
  ListenMessageType = [T] extends [never]
    ? Parameter<ListenEvents[EventKey]>
    : T,
  EmitMessageArgs extends any[] = Parameters<
    EmitEvents[EventNames<EmitEvents>]
  >,
  //TODO: infer from last argument returntype(cb) of EmitEvents[EventKey]
  // if last argument is a function then infer return type
  // if last argument is not a function then infer void
  EmitMessageCbReturnType = any
>(
  socket: EventKey | SocketLike<Socket<ListenEvents, EmitEvents>>,
  event:
    | EventKey
    | (UseSocketEventOptions<ListenMessageType> & UseSocketOptions),
  options?: UseSocketEventOptions<ListenMessageType>
): UseSocketEventReturnType<
  ListenMessageType,
  EmitMessageArgs,
  EmitMessageCbReturnType
> {
  let enabled = true;
  if (typeof socket === "string") {
    const _options = event as
      | (UseSocketEventOptions<ListenMessageType> & UseSocketOptions)
      | undefined;
    options = _options;
    enabled = _options?.enabled ?? true;
    event = socket;
    socket = useSocket(_options).socket;
  }

  let onMessage;
  let keepPrevious;
  if (options) {
    onMessage = options.onMessage;
    keepPrevious = options.keepPrevious;
  }

  const ioContext = useContext<IoContextInterface<SocketLike>>(IoContext);
  const { registerSharedListener, getConnection } = ioContext;
  const connection = enabled
    ? getConnection((socket as SocketLike).namespaceKey)
    : null;
  const [, rerender] = useState({});
  const state = useRef<{
    socket: SocketLike;
    status: "connecting" | "connected" | "disconnected";
    error: Error | null;
    lastMessage: ListenMessageType;
  }>({
    socket: connection?.socket || new SocketMock(),
    status: connection?.state.status || "disconnected",
    error: null,
    lastMessage: connection?.state.lastMessage[
      event as string
    ] as ListenMessageType,
  });

  const sendMessage = (...message: EmitMessageArgs) =>
    new Promise<EmitMessageCbReturnType>((resolve, _reject) => {
      (socket as SocketLike).emit(
        event as string,
        ...message,
        (response: EmitMessageCbReturnType) => {
          resolve(response);
        }
      );
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
