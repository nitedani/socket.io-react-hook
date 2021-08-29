import React from "react";

import { IoContextInterface } from "./types";

const IoContext = React.createContext<IoContextInterface<any>>({
  createConnection: () => undefined,
  getConnection: () => undefined,
  getLastMessage: () => undefined,
  setLastMessage: () => undefined,
  registerSharedListener: () => undefined,
  getError: () => undefined,
  setError: () => undefined,
  getStatus: () => "disconnected",
});

export default IoContext;
