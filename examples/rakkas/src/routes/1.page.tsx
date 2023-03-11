import { useRef, useState } from "react";
import type { Socket } from "socket.io";
import { useSocketEvent, useSocketServer } from "socket.io-react-hook";

const authSocket = (socket: Socket) => {
  if (socket.handshake.auth.token !== process.env.SECRET) {
    socket.disconnect(true);
  }
};

export default function HomePage() {
  const ref = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const { sendMessage } = useSocketEvent<string>("message", {
    onMessage: (message) => setMessages((messages) => [...messages, message]),
    auth: {
      token: "secret",
    },
  });

  useSocketServer((socket, server) => {
    authSocket(socket);
    socket.on("message", (message) => {
      server.emit("message", message);
    });
  });

  return (
    <div>
      <button onClick={() => sendMessage(ref.current?.value ?? "")}>
        Send
      </button>
      <input type="text" ref={ref} />
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
    </div>
  );
}
