import { useRef, useState } from "react";
import { useSocketEvent, useSocketServer } from "socket.io-react-hook";

export default function HomePage() {
  const ref = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useSocketEvent<string>("message", {
    onMessage: (message) => setMessages((messages) => [...messages, message]),
  });

  const methods = useSocketServer();

  return (
    <div>
      <button
        onClick={() => methods.broadcast("message", ref.current?.value ?? "")}
      >
        Send
      </button>
      <input type="text" ref={ref} />
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
    </div>
  );
}
