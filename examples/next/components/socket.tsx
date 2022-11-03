import { useSocket, useSocketEvent } from "socket.io-react-hook";
export default function Socket() {
  const { socket } = useSocket({ path: "/api/socket" });
  const { lastMessage } = useSocketEvent<string>(socket, "message", {
    onMessage: (message) => console.log(message),
  });
  return (
    <div>
      <h1>Socket.io React Hook</h1>
      <div>Message: {lastMessage}</div>
    </div>
  );
}
