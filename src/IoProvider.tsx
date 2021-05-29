import React, { useRef } from "react";
import io from "socket.io-client";
import IoContext from "./IoContext";

import {
  CreateConnectionFunc,
  IoConnection,
  IoNamespace,
  GetConnectionFunc,
} from "./types";

const IoProvider = function ({ children }: React.PropsWithChildren<{}>) {
  const connections = useRef<Record<IoNamespace, IoConnection>>({});

  const createConnection: CreateConnectionFunc<any> = (
    namespace = "",
    options = {}
  ) => {
    const connection = io(namespace, options);

    connections.current = Object.assign({}, connections, {
      [namespace]: connection,
    });

    return connection;
  };

  const getConnection: GetConnectionFunc<any> = (namespace = "") =>
    connections.current[namespace];

  return (
    <IoContext.Provider
      value={{
        createConnection,
        getConnection,
      }}
    >
      {children}
    </IoContext.Provider>
  );
};

export default IoProvider;
