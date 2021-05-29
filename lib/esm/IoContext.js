import React from "react";
var IoContext = React.createContext({
    createConnection: function () { return undefined; },
    getConnection: function () { return undefined; },
    getLastMessage: function () { return undefined; },
    setLastMessage: function () { return undefined; },
    registerSharedListener: function () { return undefined; },
    getError: function () { return undefined; },
    setError: function () { return undefined; },
    getStatus: function () { return "disconnected"; },
});
export default IoContext;
