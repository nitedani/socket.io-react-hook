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

  const sendMessage = <T extends unknown>(message: any) =>
    new Promise<T>((resolve, _reject) => {
      socket.emit(event, message, (response: T) => {
        resolve(response);
      });
    });

  useEffect(() => {
    if (!connection) return;
    const cleanup = registerSharedListener(socket.namespaceKey, event);
    const unsubscribe = connection.subscribe((state, _event) => {
      if (_event === "message") {
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
