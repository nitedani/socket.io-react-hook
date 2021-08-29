import { useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { IoContext } from ".";
import { IoContextInterface, SocketLikeWithNamespace } from "./types";

const useSocketEvent = <T extends unknown>(
  socket: SocketLikeWithNamespace,
  event: string
) => {
  const ioContext = useContext<IoContextInterface<Socket>>(IoContext);
  const { registerSharedListener, getLastMessage } = ioContext;
  const lastMessage = getLastMessage(socket.namespaceKey, event) as T;
  const sendMessage = (message: any) => socket.emit(event, message);

  useEffect(() => {
    registerSharedListener(socket.namespaceKey, event);
  }, [socket]);

  return { lastMessage, sendMessage, socket };
};

export default useSocketEvent;
