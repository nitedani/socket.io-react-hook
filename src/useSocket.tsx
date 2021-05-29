import * as React from "react";
import { Socket } from "socket.io-client";

import IoContext from "./IoContext";
import { IoContextInterface, UseSocket } from "./types";
import SocketMock from "socket.io-mock";

const useSocket = function <
  I extends Record<string, any>,
  T extends Socket = Socket
>(args?: UseSocket<I>) {
  const namespace = args && args.namespace;
  const options = args && args.options;
  const enabled = args?.options?.enabled === undefined || args.options.enabled;
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
useSocket();
