import type { EventsMap, DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { url } from "./utils/url";
import { unique } from "./utils/hash";
import IoContext from "./IoContext";
import {
  IoContextInterface,
  IoNamespace,
  SocketLike,
  UseSocketOptions,
  UseSocketReturnType,
} from "./types";
import SocketMock from "socket.io-mock";
import { useContext, useEffect, useRef, useState } from "react";
import stableHash from "stable-hash";

function useSocket<
  ListenEvents extends EventsMap = DefaultEventsMap,
  EmitEvents extends EventsMap = ListenEvents,
  SocketType extends Socket<ListenEvents, EmitEvents> = Socket<
    ListenEvents,
    EmitEvents
  >
>(options?: UseSocketOptions): UseSocketReturnType<SocketType>;
function useSocket<
  ListenEvents extends EventsMap = DefaultEventsMap,
  EmitEvents extends EventsMap = ListenEvents,
  SocketType extends Socket<ListenEvents, EmitEvents> = Socket<
    ListenEvents,
    EmitEvents
  >
>(
  namespace: IoNamespace,
  options?: UseSocketOptions
): UseSocketReturnType<SocketType>;
function useSocket<
  ListenEvents extends EventsMap = DefaultEventsMap,
  EmitEvents extends EventsMap = ListenEvents,
  SocketType extends Socket<ListenEvents, EmitEvents> = Socket<
    ListenEvents,
    EmitEvents
  >
>(
  namespace?: string | UseSocketOptions,
  options?: UseSocketOptions
): UseSocketReturnType<SocketType> {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return {
      socket: new SocketMock(),
      connected: false,
      error: null,
    };
  }

  const opts = {
    namespace: typeof namespace === "string" ? namespace : "",
    options: typeof namespace === "object" ? namespace : options,
  };
  const urlConfig = url(
    opts.namespace,
    opts.options?.path || "/socket.io",
    opts.options?.port
  );
  const connectionKey = urlConfig.id;
  const namespaceKey = `${connectionKey}${urlConfig.path}${unique(
    stableHash(opts.options)
  )}`;

  const enabled = opts.options?.enabled === undefined || opts.options.enabled;
  const { createConnection, getConnection } =
    useContext<IoContextInterface<SocketType>>(IoContext);

  const connection = getConnection(namespaceKey);

  const state = useRef<{
    socket: SocketLike<SocketType>;
    status: "connecting" | "connected" | "disconnected";
    error: Error | null;
  }>({
    socket: connection?.socket || new SocketMock(),
    status: connection?.state.status || "disconnected",
    error: null,
  });

  const [, rerender] = useState({});
  const connected = state.current.status === "connected";

  useEffect(() => {
    if (enabled) {
      const {
        socket: _socket,
        cleanup,
        subscribe,
      } = createConnection(namespaceKey, urlConfig, opts.options)!;
      state.current.socket = _socket;

      const unsubscribe = subscribe((newState) => {
        let changed = false;
        if (state.current.status !== newState.status) {
          state.current.status = newState.status;
          changed = true;
        }
        if (state.current.error !== newState.error) {
          state.current.error = newState.error;
          changed = true;
        }
        if (changed) {
          rerender({});
        }
      });

      rerender({});

      return () => {
        unsubscribe();
        cleanup();
      };
    }
    return () => {};
  }, [enabled, namespaceKey]);

  return {
    socket: state.current.socket,
    error: state.current.error,
    connected,
  };
}

export default useSocket;
