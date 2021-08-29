import * as React from "react";
import { url } from "socket.io-client/build/url";
import IoContext from "./IoContext";
import SocketMock from "socket.io-mock";
function useSocket(namespace, options) {
    var _a;
    var opts = {
        namespace: typeof namespace === "string" ? namespace : "",
        options: typeof namespace === "object" ? namespace : options,
    };
    var enabled = ((_a = opts.options) === null || _a === void 0 ? void 0 : _a.enabled) === undefined || opts.options.enabled;
    var _b = React.useContext(IoContext), getStatus = _b.getStatus, createConnection = _b.createConnection, getConnection = _b.getConnection, getError = _b.getError;
    var status = getStatus(opts.namespace);
    var error = getError(opts.namespace);
    var existingConnection = getConnection(opts.namespace);
    var _c = React.useState(new SocketMock()), socket = _c[0], setSocket = _c[1];
    var _d = React.useState(false), connected = _d[0], setConnected = _d[1];
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
    React.useEffect(function () {
        var _a;
        if (!existingConnection && enabled) {
            var urlConfig = url(opts.namespace, ((_a = opts.options) === null || _a === void 0 ? void 0 : _a.path) || "/socket.io");
            var _b = createConnection(urlConfig, opts.options), _socket = _b.socket, cleanup_1 = _b.cleanup;
            setSocket(_socket);
            return function () {
                cleanup_1();
            };
        }
        return function () { };
    }, [existingConnection, enabled]);
    return {
        socket: socket,
        connected: connected,
        error: error,
    };
}
export default useSocket;
