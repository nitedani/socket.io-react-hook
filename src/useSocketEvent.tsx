import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IoContext } from ".";
import { IoContextInterface } from "./types";

const useSocketEvent = <T extends unknown>(socket: Socket, event: string) => {
  const ioContext = useContext<IoContextInterface<Socket>>(IoContext);
  const { registerSharedListener, getLastMessage, getError } = ioContext;
  const errorShared = getError((socket as any).namespace);
  const lastMessageShared = getLastMessage((socket as any).namespace, event);
  const [lastMessage, setLastMessage] = useState<T>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    setError(errorShared);
  }, [errorShared]);

  useEffect(() => {
    setLastMessage(lastMessageShared);
  }, [lastMessageShared]);

  useEffect(() => {
    registerSharedListener((socket as any).namespace, event);
  }, [socket]);

  return { lastMessage, error };
};

export default useSocketEvent;
