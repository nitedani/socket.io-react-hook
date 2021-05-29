import React, { useRef } from "react";
import io from "socket.io-client";
import IoContext from "./IoContext";
var IoProvider = function (_a) {
    var children = _a.children;
    var connections = useRef({});
    var createConnection = function (namespace, options) {
        var _a;
        if (namespace === void 0) { namespace = ""; }
        if (options === void 0) { options = {}; }
        var connection = io(namespace, options);
        connections.current = Object.assign({}, connections, (_a = {},
            _a[namespace] = connection,
            _a));
        return connection;
    };
    var getConnection = function (namespace) {
        if (namespace === void 0) { namespace = ""; }
        return connections.current[namespace];
    };
    return (React.createElement(IoContext.Provider, { value: {
            createConnection: createConnection,
            getConnection: getConnection,
        } }, children));
};
export default IoProvider;
