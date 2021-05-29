import * as React from "react";
var EventSourceContext = React.createContext({
    createConnection: function () { return undefined; },
    getConnection: function () { return undefined; },
});
export default EventSourceContext;
