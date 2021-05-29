import * as React from "react";
import IoContext from "./IoContext";
import SocketMock from "socket.io-mock";
function useSocket(namespace, options) {
    var _a;
    var opts = {
        namespace: typeof namespace === "string" ? namespace : undefined,
        options: typeof namespace === "string" ? options : namespace,
    };
    var enabled = ((_a = opts.options) === null || _a === void 0 ? void 0 : _a.enabled) === undefined || opts.options.enabled;
    var ioContext = React.useContext(IoContext);
    var existingConnection = ioContext.getConnection(opts.namespace);
    var _b = React.useState(false), connected = _b[0], setConnected = _b[1];
    var handleConnect = function () { return setConnected(true); };
    var handleDisconnect = function () { return setConnected(false); };
    if (!existingConnection && enabled) {
        var socket = ioContext.createConnection(opts.namespace, opts.options);
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        return {
            socket: socket,
            connected: connected,
        };
    }
    return {
        socket: enabled
            ? existingConnection || new SocketMock()
            : new SocketMock(),
        connected: connected,
    };
}
export default useSocket;
