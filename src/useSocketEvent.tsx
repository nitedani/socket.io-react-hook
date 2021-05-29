import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export const useSocketEvent = <T extends unknown>(
  socket: Socket,
  event: string
) => {
  const [lastMessage, setLastMessage] = useState<T>();
  const [error, setError] = useState<any>();
  useEffect(() => {
    socket.on(event, setLastMessage);
    socket.on("error", setError);
    return () => {
      socket.off(event, setLastMessage);
      socket.off("error", setError);
    };
  }, [socket]);

  return { lastMessage, error };
};
