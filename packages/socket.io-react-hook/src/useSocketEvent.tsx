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

function useSocketEvent<T extends unknown = any>(
  event: string,
  options?: UseSocketEventProps<T> & UseSocketOptions
): UseSocketEventReturnType<T>;
function useSocketEvent<T extends unknown = any>(
  socket: SocketLike,
  event: string,
  options?: UseSocketEventProps<T>
): UseSocketEventReturnType<T>;
function useSocketEvent<T extends unknown = any>(
  socket: SocketLike | string,
  event?: string | (UseSocketEventProps<T> & UseSocketOptions),
  options?: UseSocketEventProps<T>
): UseSocketEventReturnType<T> {
  if (typeof socket === "string") {
    options = event as (UseSocketEventProps<T> & UseSocketOptions) | undefined;
    event = socket;
    socket = useSocket(
      options as (UseSocketEventProps<T> & UseSocketOptions) | undefined
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
  const connection = getConnection(socket.namespaceKey);
  const [, rerender] = useState({});
  const state = useRef<{
    socket: SocketLike;
    status: "connecting" | "connected" | "disconnected";
    error: Error | null;
    lastMessage: T;
  }>({
    socket: connection?.socket || new SocketMock(),
    status: connection?.state.status || "disconnected",
    error: null,
    lastMessage: connection?.state.lastMessage[event as string] as T,
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

      if (state.current.lastMessage !== newState.lastMessage[event as string]) {
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
