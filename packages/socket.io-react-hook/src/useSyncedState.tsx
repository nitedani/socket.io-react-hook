import { useId, useState } from "react";
import useSocket from "./useSocket";
import useSocketEvent from "./useSocketEvent";
import useSocketServer from "./useSocketServer";

export const useSyncedState = <T,>(
  defaultValue: T | undefined | null,
  options: {
    serverStore: {
      get: () => T | Promise<T>;
      set: (state: T) => void | Promise<void>;
    };
    clientStore?: {
      get: () => T;
      set: (state: T) => void | Promise<void>;
    };
  }
) => {
  const [clientState, setClientState] = useState(
    options?.clientStore?.get() ?? defaultValue
  );
  const { socket: clientSocket } = useSocket();
  const id = useId();
  const eventId = "setState" + id;

  useSocketServer(async (serverSocket) => {
    // this runs on the server
    serverSocket.join(eventId);
    const serverState = await options.serverStore.get();
    serverSocket.emit(eventId, serverState);
    serverSocket.on(eventId, async (state) => {
      await options.serverStore.set(state);
      const serverState = await options.serverStore.get();
      serverSocket.emit(eventId, serverState);
      serverSocket.to(eventId).emit(eventId, serverState);
    });
  });

  // runs on client
  useSocketEvent<T>(clientSocket, eventId, {
    onMessage: (state) => {
      if (options.clientStore) {
        options.clientStore.set(state);
        setClientState(options.clientStore.get());
      } else {
        setClientState(state);
      }
    },
  });

  const setState = (state: any) => {
    clientSocket.emit(eventId, state);
  };

  return [clientState, setState] as const;
};

export default useSyncedState;
