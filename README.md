React hooks for socket.io 4.x
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
  const { socket, lastMessage, sendMessage } = useSocketEvent(socket, 'message');

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
  const { socket, lastMessage, sendMessage } = 
    useSocketEvent<string>(socket, 'eventName');

  return <div>{ lastMessage }</div>
}
```

useSocketEvent will immediately return the last available value of lastMessage even on newly mounted components.

Emitting messages works as always:

```tsx
  const { socket, connected, error } = useSocket();
  socket.emit('eventName', data);

```
Or by calling sendMessage
```tsx
  const { socket, lastMessage, sendMessage } = useSocketEvent<string>(socket, 'eventName');
  sendMessage(data);

```