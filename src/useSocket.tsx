import { Socket } from "socket.io-client";
import { url } from "./utils/url";
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

function useSocket<I extends Record<string, any>, T extends Socket = Socket>(
  options?: UseSocketOptions<I>
): UseSocketReturnType<T>;
function useSocket<I extends Record<string, any>, T extends Socket = Socket>(
  namespace: IoNamespace,
  options?: UseSocketOptions<I>
): UseSocketReturnType<T>;
function useSocket<I extends Record<string, any>, T extends Socket = Socket>(
  namespace?: string | UseSocketOptions<I>,
  options?: UseSocketOptions<I>
): UseSocketReturnType<T> {
  const opts = {
    namespace: typeof namespace === "string" ? namespace : "",
    options: typeof namespace === "object" ? namespace : options,
  };
  const urlConfig = url(opts.namespace, opts.options?.path || "/socket.io");
  const connectionKey = urlConfig.id;
  const namespaceKey = `${connectionKey}${urlConfig.path}`;

  const enabled = opts.options?.enabled === undefined || opts.options.enabled;
  const { createConnection, getConnection } =
    useContext<IoContextInterface<SocketLike<T>>>(IoContext);

  const connection = getConnection(namespaceKey);

  const state = useRef<{
    socket: SocketLike<T>;
    status: "connecting" | "connected" | "disconnected";
    error: Error | null;
  }>({
    socket: new SocketMock(),
    status: connection?.state.status || "disconnected",
    error: null,
  });

  const [, rerender] = useState({});
  const connected = state.current.status === "connected";

  useEffect(() => {
    if (enabled && typeof window !== "undefined") {
      const {
        socket: _socket,
        cleanup,
        subscribe,
      } = createConnection(urlConfig, opts.options)!;
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
  }, [enabled]);

  return {
    socket: state.current.socket,
    error: state.current.error,
    connected,
  };
}

export default useSocket;
