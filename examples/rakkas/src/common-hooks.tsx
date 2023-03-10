import { IoProvider } from "socket.io-react-hook";
import type { CommonHooks } from "rakkasjs";

const hooks: CommonHooks = {
  wrapApp(app) {
    return <IoProvider>{app}</IoProvider>;
  },
};

export default hooks;
