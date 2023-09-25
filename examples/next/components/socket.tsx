import { useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

const Socket1 = () => {
  const [enabled, setEnabled] = useState(true);
  const { socket } = useSocket({ path: "/api/socket", enabled });
  const { lastMessage } = useSocketEvent<string>(socket, "message", {
    onMessage: (message) => console.log(message),
  });
  return (
    <div
      style={{
        padding: 12,
        margin: 12,
        background: "#eee",
      }}
    >
      <h1>Socket1</h1>
      <div>Message: {lastMessage}</div>
      <button onClick={() => setEnabled(!enabled)}>connect/disconnect</button>
    </div>
  );
};

const Socket2 = () => {
  const [enabled, setEnabled] = useState(false);
  const { socket } = useSocket({
    enabled,
    path: "/api/socket",
    extraHeaders: { Authorization: "Bearer xxx" },
  });
  const { lastMessage } = useSocketEvent<string>(socket, "message", {
    onMessage: (message) => console.log(message),
  });
  return (
    <div
      style={{
        padding: 12,
        margin: 12,
        background: "#eee",
      }}
    >
      <h1>Socket2</h1>
      <div>Message: {lastMessage}</div>
      <button onClick={() => setEnabled(!enabled)}>connect/disconnect</button>
    </div>
  );
};

export default function Socket() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <h1>Socket.io React Hook</h1>
      <Socket1 />
      <button onClick={() => setShow(!show)}>
        mount/unmount second component (same options as first)
      </button>
      {show && <Socket1 />}

      <button onClick={() => setShow(!show)}>
        mount/unmount second component (different auth header)
      </button>
      {show && <Socket2 />}
    </div>
  );
}
