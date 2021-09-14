import * as React from "react";
import { url } from "./utils/url";
import IoContext from "./IoContext";
import SocketMock from "socket.io-mock";
function useSocket(namespace, options) {
    var _a, _b;
    var opts = {
        namespace: typeof namespace === "string" ? namespace : "",
        options: typeof namespace === "object" ? namespace : options,
    };
    var urlConfig = url(opts.namespace, ((_a = opts.options) === null || _a === void 0 ? void 0 : _a.path) || "/socket.io");
    var connectionKey = urlConfig.id;
    var namespaceKey = "" + connectionKey + urlConfig.path;
    var enabled = ((_b = opts.options) === null || _b === void 0 ? void 0 : _b.enabled) === undefined || opts.options.enabled;
    var _c = React.useContext(IoContext), getStatus = _c.getStatus, createConnection = _c.createConnection, getError = _c.getError;
    var status = getStatus(namespaceKey);
    var error = getError(namespaceKey);
    var _d = React.useState(new SocketMock()), socket = _d[0], setSocket = _d[1];
    var _e = React.useState(false), connected = _e[0], setConnected = _e[1];
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
        if (enabled) {
            var _a = createConnection(urlConfig, opts.options), _socket = _a.socket, cleanup_1 = _a.cleanup;
            setSocket(_socket);
            return function () {
                cleanup_1();
            };
        }
        return function () { };
    }, [enabled]);
    return {
        socket: socket,
        connected: connected,
        error: error,
    };
}
export default useSocket;
