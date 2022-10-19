import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import IoContext from "./IoContext";
import { IoContextInterface, SocketLike } from "./types";

const useSocketEvent = <T extends unknown>(
  socket: SocketLike,
  event: string
) => {
  const ioContext = useContext<IoContextInterface<Socket>>(IoContext);
  const { registerSharedListener, getConnection } = ioContext;
  const connection = getConnection(socket.namespaceKey);

  const [lastMessage, setLastMessage] = useState(
    connection?.state.lastMessage[event] as T
  );

  const sendMessage = (message: any) => socket.emit(event, message);

  useEffect(() => {
    registerSharedListener(socket.namespaceKey, event);
    return connection?.subscribe((state) => {
      setLastMessage(state.lastMessage[event] as T);
    });
  }, [socket]);

  return { lastMessage, sendMessage, socket };
};

export default useSocketEvent;
