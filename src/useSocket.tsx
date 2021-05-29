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

  const enabled = options?.enabled === undefined || options.enabled;
  const ioContext = React.useContext<IoContextInterface<T>>(IoContext);
  const existingConnection = ioContext.getConnection(opts.namespace);
  const [connected, setConnected] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (existingConnection) {
      existingConnection.on("connect", () =>
        setConnected(existingConnection.connected)
      );
      existingConnection.on("disconnect", () =>
        setConnected(existingConnection.connected)
      );
    }
  }, [existingConnection]);

  if (!existingConnection) {
    return {
      socket: enabled
        ? ioContext.createConnection(opts.namespace, opts.options)
        : (new SocketMock() as Socket),
      connected,
    };
  }

  return {
    socket: enabled
      ? existingConnection || (new SocketMock() as Socket)
      : (new SocketMock() as Socket),
    connected,
  };
}

export default useSocket;
