import { IoProvider } from "socket.io-react-hook";
import { startClient } from "rakkasjs";

startClient({
  hooks: {
    wrapApp(app) {
      return <IoProvider>{app}</IoProvider>;
    },
  },
});
