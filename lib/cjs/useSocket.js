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
var useSocket = function (args) {
    var _a;
    var namespace = args && args.namespace;
    var options = args && args.options;
    var enabled = ((_a = args === null || args === void 0 ? void 0 : args.options) === null || _a === void 0 ? void 0 : _a.enabled) === undefined || args.options.enabled;
    var ioContext = React.useContext(IoContext_1.default);
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
                : new socket_io_mock_1.default(),
            connected: connected,
        };
    }
    return {
        socket: enabled
            ? existingConnection || new socket_io_mock_1.default()
            : new socket_io_mock_1.default(),
        connected: connected,
    };
};
exports.default = useSocket;
useSocket();
