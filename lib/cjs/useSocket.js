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
var IoContext_1 = __importDefault(require("./IoContext"));
var socket_io_mock_1 = __importDefault(require("socket.io-mock"));
function useSocket(namespace, options) {
    var _a;
    var opts = {
        namespace: typeof namespace === "string" ? namespace : undefined,
        options: typeof namespace === "string" ? options : namespace,
    };
    var enabled = ((_a = opts.options) === null || _a === void 0 ? void 0 : _a.enabled) === undefined || opts.options.enabled;
    var _b = React.useContext(IoContext_1.default), getStatus = _b.getStatus, createConnection = _b.createConnection, getConnection = _b.getConnection, getError = _b.getError;
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
        ? existingConnection || new socket_io_mock_1.default()
        : new socket_io_mock_1.default();
    socket.namespace = opts.namespace;
    return {
        socket: socket,
        connected: connected,
        error: error,
    };
}
exports.default = useSocket;
