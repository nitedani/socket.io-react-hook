import * as React from "react";
import { Socket } from "socket.io-client";
import IoContext from "./IoContext";
import {
  IoContextInterface,
  IoNamespace,
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
    namespace: typeof namespace === "string" ? namespace : undefined,
    options: typeof namespace === "string" ? options : namespace,
  };

  const enabled = opts.options?.enabled === undefined || opts.options.enabled;
  const { getStatus, createConnection, getConnection, getError } =
    React.useContext<IoContextInterface<T>>(IoContext);
  const status = getStatus();
  const error = getError(opts.namespace as any);
  const existingConnection = getConnection(opts.namespace);
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

  if (!existingConnection && enabled) {
    const socket = createConnection(opts.namespace, opts.options);
    (socket as any).namespace = opts.namespace;
    return {
      socket,
      connected,
      error,
    };
  }

  const socket = enabled
    ? existingConnection || (new SocketMock() as Socket)
    : (new SocketMock() as Socket);
  (socket as any).namespace = opts.namespace;
  return {
    socket,
    connected,
    error,
  };
}

export default useSocket;
