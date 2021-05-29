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

  const { socket, connected } = useSocket();  
  const { lastMessage, error } = useSocketEvent(socket, 'message');

```

useSocket forwards all parameters to socket.io constructor.<br>


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

The useSocket hook always returns a socket-like object, so you don't have to worry about errors caused by undefined values.<br>

Example:

```tsx
export const useAuthenticatedSocket = (namespace?: string) => {
  const [accessToken] = useCookie('jwt');
  return useSocket(namespace, {
    enabled: !!accessToken,
  });
};
const Index = () => {

  const { socket, connected } = useAuthenticatedSocket();
  const { lastMessage, error } = useSocketEvent<string>(socket, 'eventName');

  return <div>{ lastMessage }</div>
}
```

Emitting messages works as always:

```tsx
  const { socket, connected } = useSocket();
  socket.emit('eventName', data);

```