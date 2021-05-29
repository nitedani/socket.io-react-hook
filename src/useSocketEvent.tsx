import { useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { IoContext } from ".";
import { IoContextInterface } from "./types";

const useSocketEvent = <T extends unknown>(socket: Socket, event: string) => {
  const ioContext = useContext<IoContextInterface<Socket>>(IoContext);
  const { registerSharedListener, getLastMessage, getError } = ioContext;
  const error = getError((socket as any).namespace);
  const lastMessage = getLastMessage((socket as any).namespace, event) as T;

  useEffect(() => {
    registerSharedListener((socket as any).namespace, event);
  }, [socket]);

  return { lastMessage, error };
};

export default useSocketEvent;
