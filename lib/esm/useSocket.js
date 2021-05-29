import * as React from "react";
import IoContext from "./IoContext";
import SocketMock from "socket.io-mock";
function useSocket(namespace, options) {
    var opts = {
        namespace: typeof namespace === "string" ? namespace : undefined,
        options: typeof namespace === "string" ? options : namespace,
    };
    var enabled = (options === null || options === void 0 ? void 0 : options.enabled) === undefined || options.enabled;
    var ioContext = React.useContext(IoContext);
    var existingConnection = ioContext.getConnection(opts.namespace);
    var _a = React.useState(false), connected = _a[0], setConnected = _a[1];
    var handleConnect = function () { return setConnected(true); };
    var handleDisconnect = function () { return setConnected(false); };
    if (!existingConnection) {
        var socket = enabled
            ? ioContext.createConnection(opts.namespace, opts.options)
            : new SocketMock();
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        return {
            socket: enabled ? socket : new SocketMock(),
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
