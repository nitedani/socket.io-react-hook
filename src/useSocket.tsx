import * as React from "react";
import { Socket } from "socket.io-client";
import IoContext from "./IoContext";
import { IoContextInterface, IoNamespace, UseSocketOptions } from "./types";
import SocketMock from "socket.io-mock";

const useSocket = function <
  I extends Record<string, any>,
  T extends Socket = Socket
>(namespace?: IoNamespace, options?: UseSocketOptions<I>) {
  const enabled = options?.enabled === undefined || options.enabled;
  const ioContext = React.useContext<IoContextInterface<T>>(IoContext);
  const existingConnection = ioContext.getConnection(namespace);
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
        ? ioContext.createConnection(namespace, options)
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
};

export default useSocket;
