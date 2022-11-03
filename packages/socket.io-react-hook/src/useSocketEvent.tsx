import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import IoContext from "./IoContext";
import { IoContextInterface, SocketLike, UseSocketEventProps } from "./types";

const useSocketEvent = <T extends unknown>(
  socket: SocketLike,
  event: string,
  options?: UseSocketEventProps<T>
) => {
  let onMessage;
  let keepPrevious;
  if (options) {
    onMessage = options.onMessage;
    keepPrevious = options.keepPrevious;
  }

  const ioContext = useContext<IoContextInterface<Socket>>(IoContext);
  const { registerSharedListener, getConnection } = ioContext;
  const connection = getConnection(socket.namespaceKey);

  const [lastMessage, setLastMessage] = useState(
    connection?.state.lastMessage[event] as T
  );

  const sendMessage = (message: any) => socket.emit(event, message);

  useEffect(() => {
    if (!connection) return;
    const cleanup = registerSharedListener(socket.namespaceKey, event);
    const unsubscribe = connection.subscribe((state, event) => {
      if (event === "message") {
        const lastMessage = state.lastMessage[event] as T;
        setLastMessage(lastMessage);
        if (onMessage) {
          onMessage(lastMessage);
        }
      }
    });
    return () => {
      unsubscribe();
      if (!keepPrevious) {
        cleanup();
      }
    };
  }, [socket]);

  return { lastMessage, sendMessage, socket };
};

export default useSocketEvent;
