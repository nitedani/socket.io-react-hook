import React, { useRef } from "react";
import type { Server } from "socket.io";
import io from "socket.io-client";
import IoContext from "./IoContext";
import {
  CreateConnectionFunc,
  IoConnection,
  IoNamespace,
  GetConnectionFunc,
  SocketLike,
  SocketState,
  CustomServer,
} from "./types";

const isServer = typeof window === "undefined";

const IoProvider = function ({
  children,
  server,
}: React.PropsWithChildren<{
  server?: Server;
}>) {
  let rpcPrefix = "";
  if (isServer) {
    // random hex, 16 chars
    rpcPrefix = Math.random().toString(16).substr(2, 16);
  } else {
    // @ts-ignore
    rpcPrefix = window.__rpcPrefix;
  }

  const connections = useRef<Record<string, number>>({});
  const eventSubscriptions = useRef<Record<string, number>>({});
  const sockets = useRef<
    Record<
      IoNamespace,
      {
        socket: IoConnection;
      } & SocketState
    >
  >({});

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
          sockets.current[key].socket.disconnect();
          sockets.current[key].subscribers.clear();
          delete sockets.current[key];
        }
      }
    };

    const namespaceKey = `${connectionKey}${urlConfig.path}`;

    // By default socket.io-client creates a new connection for the same namespace
    // The next line prevents that
    if (sockets.current[namespaceKey]) {
      sockets.current[namespaceKey].socket.connect();
      return {
        cleanup,
        ...sockets.current[namespaceKey],
      };
    }

    const handleConnect = () => {
      sockets.current[namespaceKey].state.status = "connected";
      sockets.current[namespaceKey].notify("connected");
    };

    const handleDisconnect = () => {
      sockets.current[namespaceKey].state.status = "disconnected";
      sockets.current[namespaceKey].notify("disconnected");
    };

    options.query ??= {};
    options.query["rpc-prefix"] = rpcPrefix;
    const socket = io(urlConfig.source, options) as SocketLike;
    socket.namespaceKey = namespaceKey;

    sockets.current = Object.assign({}, sockets.current, {
      [namespaceKey]: {
        socket,
        state: {
          status: "disconnected",
          lastMessage: {},
          error: null,
        },
        notify: (event: string) => {
          sockets.current[namespaceKey].subscribers.forEach((callback) =>
            callback(sockets.current[namespaceKey].state, event)
          );
        },
        subscribers: new Set(),
        subscribe: (callback) => {
          sockets.current[namespaceKey].subscribers.add(callback);
          return () =>
            sockets.current[namespaceKey]?.subscribers.delete(callback);
        },
      },
    });

    socket.on("error", (error) => {
      sockets.current[namespaceKey].state.error = error;
      sockets.current[namespaceKey].notify("error");
    });

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return {
      cleanup,
      ...sockets.current[namespaceKey],
    };
  };

  const getConnection: GetConnectionFunc<any> = (namespaceKey = "") =>
    sockets.current[namespaceKey];

  const registerSharedListener = (namespaceKey = "", forEvent = "") => {
    if (
      sockets.current[namespaceKey] &&
      !sockets.current[namespaceKey].socket.hasListeners(forEvent)
    ) {
      sockets.current[namespaceKey].socket.on(forEvent, (message) => {
        sockets.current[namespaceKey].state.lastMessage[forEvent] = message;
        sockets.current[namespaceKey].notify("message");
      });
    }
    const subscriptionKey = `${namespaceKey}${forEvent}`;
    const cleanup = () => {
      if (--eventSubscriptions.current[subscriptionKey] === 0) {
        const subscriptionsToClose = Object.keys(
          eventSubscriptions.current
        ).filter((key) => key.includes(subscriptionKey));

        for (const key of subscriptionsToClose) {
          // when all useSocketEvent hooks unmount for a specific event,
          // remove lastMessage to prevent showing stale messages on remount
          delete eventSubscriptions.current[key];
        }
      }
    };

    if (!(subscriptionKey in eventSubscriptions.current)) {
      connections.current[subscriptionKey] = 1;
    } else {
      connections.current[subscriptionKey] += 1;
    }

    return () => cleanup();
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__rpcPrefix = "${rpcPrefix}";`,
        }}
      />

      <IoContext.Provider
        value={{
          createConnection,
          getConnection,
          registerSharedListener,
          server: server as CustomServer,
          rpcPrefix,
        }}
      >
        {children}
      </IoContext.Provider>
    </>
  );
};

export default IoProvider;
