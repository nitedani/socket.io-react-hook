import { useRef, useState } from "react";
import { useSocketEvent, useSocketServer } from "socket.io-react-hook";

export default function HomePage() {
  const ref = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const { join, leave, to, socket } = useSocketServer();

  useSocketEvent<string>("message", {
    onMessage: (message) => setMessages((messages) => [...messages, message]),
  });

  const handleJoinRoom = async () => {
    await join("1");
    to("1").broadcast("message", socket.id + "Joined room 1");
  };
  const handleLeaveRoom = async () => {
    await leave("1");
    to("1").broadcast("message", socket.id + "Left room 1");
  };

  const handleSendMessage = () => {
    to("1").broadcast(
      "message",
      socket.id + (ref.current?.value || "Empty message")
    );
  };

  return (
    <div>
      <button onClick={handleSendMessage}>Send to room 1</button>
      <button onClick={handleJoinRoom}>Join Room 1</button>
      <button onClick={handleLeaveRoom}>Leave Room 1</button>
      <input type="text" ref={ref} />
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
    </div>
  );
}
