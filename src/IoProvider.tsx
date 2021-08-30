import React, { useRef, useState } from "react";
import io from "socket.io-client";
import IoContext from "./IoContext";

import {
  CreateConnectionFunc,
  IoConnection,
  IoNamespace,
  GetConnectionFunc,
  SocketLikeWithNamespace,
} from "./types";

const IoProvider = function ({ children }: React.PropsWithChildren<{}>) {
  const connections = useRef<Record<string, number>>({});
  const sockets = useRef<Record<IoNamespace, IoConnection>>({});

  const [statuses, setStatuses] = useState<
    Record<IoNamespace, "disconnected" | "connecting" | "connected">
  >({});
  const [lastMessages, setLastMessages] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});

  const createConnection: CreateConnectionFunc<any> = (
    urlConfig,
    options = {}
  ) => {
    const connectionKey = urlConfig.id;

    if (!(connectionKey in connections.current)) {
      connections.current[connectionKey] = 1;
    } else {
      connections.current[connectionKey] += 1;
    }

    const cleanup = () => {
      if (--connections.current[connectionKey] === 0) {
        const socketsToClose = Object.keys(sockets.current).filter((key) =>
          key.includes(connectionKey)
        );

        for (const key of socketsToClose) {
          sockets.current[key].disconnect();
          delete sockets.current[key];
        }
      }
    };

    const namespaceKey = `${connectionKey}${urlConfig.path}`;

    // By default socket.io-client creates a new connection for the same namespace
    // The next line prevents that
    if (sockets.current[namespaceKey]) {
      sockets.current[namespaceKey].connect();
      return { socket: sockets.current[namespaceKey], cleanup };
    }
    const handleConnect = () =>
      setStatuses((state) => ({ ...state, [namespaceKey]: "connected" }));

    const handleDisconnect = () =>
      setStatuses((state) => ({ ...state, [namespaceKey]: "disconnected" }));

    const socket = io(urlConfig.source, options) as SocketLikeWithNamespace;
    socket.namespaceKey = namespaceKey;

    sockets.current = Object.assign({}, sockets.current, {
      [namespaceKey]: socket,
    });
    socket.on("error", (error) => setError(namespaceKey, error));
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    return { socket, cleanup };
  };

  const getLastMessage = (namespaceKey = "", forEvent = "") =>
    lastMessages[`${namespaceKey}${forEvent}`];
  const setLastMessage = (
    namespaceKey: string,
    forEvent: string,
    message: any
  ) =>
    setLastMessages((state) => ({
      ...state,
      [`${namespaceKey}${forEvent}`]: message,
    }));

  const getConnection: GetConnectionFunc<any> = (namespaceKey = "") =>
    sockets.current[namespaceKey];
  const getStatus = (namespaceKey = "") => statuses[namespaceKey];
  const getError = (namespaceKey = "") => errors[namespaceKey];
  const setError = (namespaceKey = "", error: any) =>
    setErrors((state) => ({
      ...state,
      [namespaceKey]: error,
    }));

  const registerSharedListener = (namespaceKey = "", forEvent = "") => {
    if (
      sockets.current[namespaceKey] &&
      !sockets.current[namespaceKey].hasListeners(forEvent)
    ) {
      sockets.current[namespaceKey].on(forEvent, (message) =>
        setLastMessage(namespaceKey, forEvent, message)
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
