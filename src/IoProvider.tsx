import React, { useRef, useState } from "react";
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

  const [statuses, setStatuses] = useState<
    Record<IoNamespace, "disconnected" | "connecting" | "connected">
  >({});
  const [lastMessages, setLastMessages] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});

  const createConnection: CreateConnectionFunc<any> = (
    namespace = "",
    options = {}
  ) => {
    const handleConnect = () =>
      setStatuses((state) => ({ ...state, [namespace]: "connected" }));

    const handleDisconnect = () =>
      setStatuses((state) => ({ ...state, [namespace]: "disconnected" }));

    const connection = io(namespace, options);
    connections.current = Object.assign({}, connections.current, {
      [namespace]: connection,
    });
    connection.on("error", (error) => setError(namespace, error));
    connection.on("connect", handleConnect);
    connection.on("disconnect", handleDisconnect);
    return connection;
  };

  const getLastMessage = (namespace = "", forEvent = "") =>
    lastMessages[`${namespace}${forEvent}`];
  const setLastMessage = (namespace: string, forEvent: string, message: any) =>
    setLastMessages((state) => ({
      ...state,
      [`${namespace}${forEvent}`]: message,
    }));

  const getConnection: GetConnectionFunc<any> = (namespace = "") =>
    connections.current[namespace];
  const getStatus = (namespace = "") => statuses[namespace];
  const getError = (namespace = "") => errors[namespace];
  const setError = (namespace = "", error: any) =>
    setErrors((state) => ({
      ...state,
      [namespace]: error,
    }));

  const registerSharedListener = (namespace = "", forEvent = "") => {
    if (
      connections.current[namespace] &&
      !connections.current[namespace].hasListeners(forEvent)
    ) {
      connections.current[namespace].on(forEvent, (message) =>
        setLastMessage(namespace, forEvent, message)
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
