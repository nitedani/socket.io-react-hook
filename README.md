React hooks for socket.io 4.x
---
Usage: <br>
1. Wrap your components with the provider

```
  import { IoProvider } from 'socket.io-react-hooks';

  <IoProvider>
    <App />       
  </IoProvider>
```

2. 
```
  import { useSocket, useSocketEvent } from 'socket.io-react-hooks';

  const { socket, connected } = useSocket();  
  const { lastMessage, error } = useSocketEvent(socket, 'message');

```

useSocket forwards all parameters to socket.io constructor.

If the socket connection depends on state, use it like this: <br>
The connection will be initiated once the socket is enabled.

```
import { useCookie } from 'react-use';
import { useSocket } from 'socket.io-react-hooks';

export const useAuthenticatedSocket = (namespace?: string) => {
  const [accessToken] = useCookie('jwt');
  return useSocket(namespace, {
    enabled: !!accessToken,
  });
};


```

The useSocket hook always returns a socket-like object, so you don't have to worry about errors caused by undefined values.<br>

Example:

```

export const useAuthenticatedSocket = (namespace?: string) => {
  const [accessToken] = useCookie('jwt');
  return useSocket(namespace, {
    enabled: !!accessToken,
  });
};
const Index = () => {

  const { socket, connected } = useAuthenticatedSocket();
  const { lastMessage, error } = useSocketEvent<string>(socket, 'randomNumber');

  return <div>{ lastMessage }</div>
}
```