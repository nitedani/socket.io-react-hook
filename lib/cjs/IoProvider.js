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
var react_1 = __importStar(require("react"));
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var IoContext_1 = __importDefault(require("./IoContext"));
var IoProvider = function (_a) {
    var children = _a.children;
    var connections = react_1.useRef({});
    var createConnection = function (namespace, options) {
        var _a;
        if (namespace === void 0) { namespace = ""; }
        if (options === void 0) { options = {}; }
        var connection = socket_io_client_1.default(namespace, options);
        connections.current = Object.assign({}, connections, (_a = {},
            _a[namespace] = connection,
            _a));
        return connection;
    };
    var getConnection = function (namespace) {
        if (namespace === void 0) { namespace = ""; }
        return connections.current[namespace];
    };
    return (react_1.default.createElement(IoContext_1.default.Provider, { value: {
            createConnection: createConnection,
            getConnection: getConnection,
        } }, children));
};
exports.default = IoProvider;
