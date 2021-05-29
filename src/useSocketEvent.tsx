import { useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { IoContext } from ".";
import { IoContextInterface } from "./types";

const useSocketEvent = <T extends unknown>(socket: Socket, event: string) => {
  const ioContext = useContext<IoContextInterface<Socket>>(IoContext);
  const { registerSharedListener, getLastMessage } = ioContext;
  const lastMessage = getLastMessage((socket as any).namespace, event) as T;
  const sendMessage = (message: any) => socket.emit(event, message);

  useEffect(() => {
    registerSharedListener((socket as any).namespace, event);
  }, [socket]);

  return { lastMessage, sendMessage, socket };
};

export default useSocketEvent;
