import * as React from "react";

import { IoContextInterface } from "./types";

const EventSourceContext = React.createContext<IoContextInterface<any>>({
  createConnection: () => undefined,
  getConnection: () => undefined,
});

export default EventSourceContext;
