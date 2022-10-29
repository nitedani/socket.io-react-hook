import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import IoContext from "./IoContext";
import { IoContextInterface, SocketLike } from "./types";

const useSocketEvent = <T extends unknown>(
  socket: SocketLike,
  event: string,
  {
    keepPrevious,
    onMessage,
  }: {
    keepPrevious?: boolean;
    onMessage?: (message: T) => void;
  }
) => {
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
    const unsubscribe = connection.subscribe((state) => {
      const lastMessage = state.lastMessage[event] as T;
      setLastMessage(lastMessage);
      if (onMessage) {
        onMessage(lastMessage);
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