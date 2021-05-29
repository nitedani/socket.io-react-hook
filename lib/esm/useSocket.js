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
    var _b = React.useContext(IoContext), getStatus = _b.getStatus, createConnection = _b.createConnection, getConnection = _b.getConnection, getError = _b.getError;
    var status = getStatus();
    var error = getError(opts.namespace);
    var existingConnection = getConnection(opts.namespace);
    var _c = React.useState(false), connected = _c[0], setConnected = _c[1];
    React.useEffect(function () {
        switch (status) {
            case "connected":
                setConnected(true);
                break;
            case "disconnected":
                setConnected(false);
                break;
            default:
                break;
        }
    }, [status]);
    if (!existingConnection && enabled) {
        var socket_1 = createConnection(opts.namespace, opts.options);
        socket_1.namespace = opts.namespace;
        return {
            socket: socket_1,
            connected: connected,
            error: error,
        };
    }
    var socket = enabled
        ? existingConnection || new SocketMock()
        : new SocketMock();
    socket.namespace = opts.namespace;
    return {
        socket: socket,
        connected: connected,
        error: error,
    };
}
export default useSocket;
