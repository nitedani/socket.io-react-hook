import * as React from "react";
import { Socket } from "socket.io-client";
import { url } from "socket.io-client/build/url";
import IoContext from "./IoContext";
import {
  IoContextInterface,
  IoNamespace,
  SocketLikeWithNamespace,
  UseSocketOptions,
  UseSocketReturnType,
} from "./types";
import SocketMock from "socket.io-mock";

function useSocket<I extends Record<string, any>, T extends Socket = Socket>(
  options?: UseSocketOptions<I>
): UseSocketReturnType;
function useSocket<I extends Record<string, any>, T extends Socket = Socket>(
  namespace: IoNamespace,
  options?: UseSocketOptions<I>
): UseSocketReturnType;
function useSocket<I extends Record<string, any>, T extends Socket = Socket>(
  namespace?: string | UseSocketOptions<I>,
  options?: UseSocketOptions<I>
): UseSocketReturnType {
  const opts = {
    namespace: typeof namespace === "string" ? namespace : "",
    options: typeof namespace === "object" ? namespace : options,
  };

  const enabled = opts.options?.enabled === undefined || opts.options.enabled;
  const { getStatus, createConnection, getConnection, getError } =
    React.useContext<IoContextInterface<SocketLikeWithNamespace<T>>>(IoContext);
  const status = getStatus(opts.namespace);
  const error = getError(opts.namespace);
  const existingConnection = getConnection(opts.namespace);
  const [socket, setSocket] = React.useState<SocketLikeWithNamespace>(
    new SocketMock()
  );
  const [connected, setConnected] = React.useState<boolean>(false);

  React.useEffect(() => {
    switch (status) {
      case "connected":
        setConnected(true);
        break;
      case "disconnected":
        setConnected(false);
        break;
      default:
        break;
    }
  }, [status]);

  React.useEffect(() => {
    if (!existingConnection && enabled) {
      const urlConfig = url(opts.namespace, opts.options?.path || "/socket.io");
      const { socket: _socket, cleanup } = createConnection(
        urlConfig,
        opts.options
      )!;
      setSocket(_socket);
      return () => {
        cleanup();
      };
    }
    return () => {};
  }, [existingConnection, enabled]);

  return {
    socket,
    connected,
    error,
  };
}

export default useSocket;
