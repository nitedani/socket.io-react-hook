React hooks for socket.io 4.x

Examples:
- [Next.js](examples/next/)
- [Rakkas](examples/rakkas/) - [Try on StackBlitz](https://stackblitz.com/github/nitedani/socket.io-react-hook/tree/main/examples/rakkas?file=src%2Froutes%2Findex.page.tsx)

---
Usage: <br>
1. Wrap your components with the provider

```tsx
  import { IoProvider } from 'socket.io-react-hook';

  <IoProvider>
    <App />       
  </IoProvider>
```

2. 
```tsx
  import { useSocket, useSocketEvent } from 'socket.io-react-hook';

  const { socket, error } = useSocket();  
  const { lastMessage, sendMessage } = useSocketEvent(socket, 'message');

```

useSocket forwards all parameters to socket.io constructor.<br>
See the available options [here](https://socket.io/docs/v4/client-initialization/)

If the socket connection depends on state, use it like this: <br>
The connection will be initiated once the socket is enabled.<br>
The connection for a namespace is shared between your components, feel free to use the hooks in multiple components.

```tsx
import { useCookie } from 'react-use';
import { useSocket } from 'socket.io-react-hook';

export const useAuthenticatedSocket = (namespace?: string) => {
  const [accessToken] = useCookie('jwt');
  return useSocket(namespace, {
    enabled: !!accessToken,
  });
};

```

The useSocket hook always returns a socket-like object, even before a succesful connection. You don't have to check whether it is undefined.<br>

Example:

```tsx
export const useAuthenticatedSocket = (namespace?: string) => {
  const [accessToken] = useCookie('jwt');
  return useSocket(namespace, {
    enabled: !!accessToken,
  });
};
const Index = () => {

  const { socket, connected, error } = useAuthenticatedSocket();
  const { lastMessage, sendMessage } = 
    useSocketEvent<string>(socket, 'eventName');

  return <div>{ lastMessage }</div>
}
```



```tsx
const Index = () => {
  const [messages, setMessages] = useState([]);
  const { socket, connected, error } = useAuthenticatedSocket();
  const onMessage = (message) => setMessages((state) => [...state, message]);
  useSocketEvent<string>(socket, "eventName", { onMessage });
  ...
};
```

useSocketEvent parameters:
- socket: SocketIo object
- event: string
- options:
  - onMessage: (message) => void
  - keepPrevious: (default false) if true, useSocketEvent will immediately return the last available value of lastMessage after being remounted



Emitting messages works as always:

```tsx
  const { socket, connected, error } = useSocket();
  socket.emit('eventName', data);

```
Or by calling sendMessage
```tsx
  //Client
  const { socket, lastMessage, sendMessage } = useSocketEvent<string>(socket, 'eventName');
  ...
  const response = await sendMessage<{ status: string }>("hi server");
  console.log(response.status) // "ok"

  //Server
  io.on("connection", (socket) => {
    socket.on("eventName", (message, callback) => {
      console.log(message) // "hi server"
      callback({
        status: "ok"
      });
    });
  });

```

[Typescript usage](https://socket.io/docs/v4/typescript/#types-for-the-client):

```ts
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: any) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}
const { socket } = useSocket<ServerToClientEvents, ClientToServerEvents>();

socket.on("withAck", (d, callback) => {});
socket.emit("hello");
```