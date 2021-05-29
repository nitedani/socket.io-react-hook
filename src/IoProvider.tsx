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
  const statuses = useRef<
    Record<IoNamespace, "disconnected" | "connecting" | "connected">
  >({});
  const lastMessages = useRef<Record<string, any>>({});
  const errors = useRef<Record<string, any>>({});
  const createConnection: CreateConnectionFunc<any> = (
    namespace = "",
    options = {}
  ) => {
    const handleConnect = () => (statuses.current[namespace] = "connected");
    const handleDisconnect = () =>
      (statuses.current[namespace] = "disconnected");
    const connection = io(namespace, options);
    connections.current = Object.assign({}, connections.current, {
      [namespace]: connection,
    });
    connection.on("connect", handleConnect);
    connection.on("disconnect", handleDisconnect);
    return connection;
  };
  const getLastMessage = (namespace = "", forEvent = "") =>
    lastMessages.current[`${namespace}${forEvent}`];
  const setLastMessage = (namespace: string, forEvent: string, message: any) =>
    (lastMessages.current[`${namespace}${forEvent}`] = message);
  const getConnection: GetConnectionFunc<any> = (namespace = "") =>
    connections.current[namespace];
  const getStatus = (namespace = "") => statuses.current[namespace];
  const getError = (namespace = "") => errors.current[namespace];
  const setError = (namespace = "", error: any) =>
    (errors.current[namespace] = error);
  const registerSharedListener = (namespace = "", forEvent = "") => {
    if (!connections.current[namespace]?.hasListeners(forEvent)) {
      connections.current[namespace].on(forEvent, (message) =>
        setLastMessage(namespace, forEvent, message)
      );
      connections.current[namespace].on("error", (error) =>
        setError(namespace, error)
      );
    }
  };

  return (
    <IoContext.Provider
      value={{
        createConnection,
        getConnection,
        getLastMessage,
        setLastMessage,
        getError,
        setError,
        getStatus,
        registerSharedListener,
      }}
    >
      {children}
    </IoContext.Provider>
  );
};

export default IoProvider;
