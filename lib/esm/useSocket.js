import * as React from "react";
import IoContext from "./IoContext";
import SocketMock from "socket.io-mock";
var useSocket = function (args) {
    var _a;
    var namespace = args && args.namespace;
    var options = args && args.options;
    var enabled = ((_a = args === null || args === void 0 ? void 0 : args.options) === null || _a === void 0 ? void 0 : _a.enabled) === undefined || args.options.enabled;
    var ioContext = React.useContext(IoContext);
    var existingConnection = ioContext.getConnection(namespace);
    var _b = React.useState(false), connected = _b[0], setConnected = _b[1];
    React.useEffect(function () {
        if (existingConnection) {
            existingConnection.on("connect", function () {
                return setConnected(existingConnection.connected);
            });
            existingConnection.on("disconnect", function () {
                return setConnected(existingConnection.connected);
            });
        }
    }, [existingConnection]);
    if (!existingConnection) {
        return {
            socket: enabled
                ? ioContext.createConnection(namespace, options)
                : new SocketMock(),
            connected: connected,
        };
    }
    return {
        socket: enabled
            ? existingConnection || new SocketMock()
            : new SocketMock(),
        connected: connected,
    };
};
export default useSocket;
useSocket();
