import { runSSM } from "rakkasjs";
import { useRef, useState } from "react";
import { useSocketEvent } from "socket.io-react-hook";

export default function HomePage() {
  const ref = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useSocketEvent<string>("message", {
    onMessage: (message) => setMessages((messages) => [...messages, message]),
  });

  const sendMessage = (message: string) =>
    runSSM((ctx) => ctx.locals.io.emit("message", message));

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
