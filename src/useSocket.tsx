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
  const ioContext = React.useContext<IoContextInterface<T>>(IoContext);
  const existingConnection = ioContext.getConnection(namespace);

  if (!existingConnection) {
    return ioContext.createConnection(namespace, options);
  }

  return {
    socket: existingConnection || (new SocketMock() as Socket),
    connected: !!existingConnection,
  };
};

export default useSocket;
useSocket();
