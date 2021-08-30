"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var url_1 = require("socket.io-client/build/url");
var IoContext_1 = __importDefault(require("./IoContext"));
var socket_io_mock_1 = __importDefault(require("socket.io-mock"));
function useSocket(namespace, options) {
    var _a, _b;
    var opts = {
        namespace: typeof namespace === "string" ? namespace : "",
        options: typeof namespace === "object" ? namespace : options,
    };
    var urlConfig = (0, url_1.url)(opts.namespace, ((_a = opts.options) === null || _a === void 0 ? void 0 : _a.path) || "/socket.io");
    var connectionKey = urlConfig.id;
    var namespaceKey = "" + connectionKey + urlConfig.path;
    var enabled = ((_b = opts.options) === null || _b === void 0 ? void 0 : _b.enabled) === undefined || opts.options.enabled;
    var _c = React.useContext(IoContext_1.default), getStatus = _c.getStatus, createConnection = _c.createConnection, getError = _c.getError;
    var status = getStatus(namespaceKey);
    var error = getError(namespaceKey);
    var _d = React.useState(new socket_io_mock_1.default()), socket = _d[0], setSocket = _d[1];
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
exports.default = useSocket;
