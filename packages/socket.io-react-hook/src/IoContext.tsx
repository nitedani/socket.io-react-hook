import React from "react";

import { IoContextInterface } from "./types";

const IoContext = React.createContext<IoContextInterface<any>>({
  createConnection: () => undefined,
  getConnection: () => undefined,
  registerSharedListener: () => () => {},
});

export default IoContext;
