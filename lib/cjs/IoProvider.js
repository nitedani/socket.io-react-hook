"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _b = react_1.useState({}), statuses = _b[0], setStatuses = _b[1];
    var _c = react_1.useState({}), lastMessages = _c[0], setLastMessages = _c[1];
    var _d = react_1.useState({}), errors = _d[0], setErrors = _d[1];
    var createConnection = function (namespace, options) {
        var _a;
        if (namespace === void 0) { namespace = ""; }
        if (options === void 0) { options = {}; }
        var handleConnect = function () {
            return setStatuses(function (state) {
                var _a;
                return (__assign(__assign({}, state), (_a = {}, _a[namespace] = "connected", _a)));
            });
        };
        var handleDisconnect = function () {
            return setStatuses(function (state) {
                var _a;
                return (__assign(__assign({}, state), (_a = {}, _a[namespace] = "disconnected", _a)));
            });
        };
        var connection = socket_io_client_1.default(namespace, options);
        connections.current = Object.assign({}, connections.current, (_a = {},
            _a[namespace] = connection,
            _a));
        connection.on("error", function (error) { return setError(namespace, error); });
        connection.on("connect", handleConnect);
        connection.on("disconnect", handleDisconnect);
        return connection;
    };
    var getLastMessage = function (namespace, forEvent) {
        if (namespace === void 0) { namespace = ""; }
        if (forEvent === void 0) { forEvent = ""; }
        return lastMessages["" + namespace + forEvent];
    };
    var setLastMessage = function (namespace, forEvent, message) {
        return setLastMessages(function (state) {
            var _a;
            return (__assign(__assign({}, state), (_a = {}, _a["" + namespace + forEvent] = message, _a)));
        });
    };
    var getConnection = function (namespace) {
        if (namespace === void 0) { namespace = ""; }
        return connections.current[namespace];
    };
    var getStatus = function (namespace) {
        if (namespace === void 0) { namespace = ""; }
        return statuses[namespace];
    };
    var getError = function (namespace) {
        if (namespace === void 0) { namespace = ""; }
        return errors[namespace];
    };
    var setError = function (namespace, error) {
        if (namespace === void 0) { namespace = ""; }
        return setErrors(function (state) {
            var _a;
            return (__assign(__assign({}, state), (_a = {}, _a[namespace] = error, _a)));
        });
    };
    var registerSharedListener = function (namespace, forEvent) {
        if (namespace === void 0) { namespace = ""; }
        if (forEvent === void 0) { forEvent = ""; }
        if (connections.current[namespace] &&
            !connections.current[namespace].hasListeners(forEvent)) {
            connections.current[namespace].on(forEvent, function (message) {
                return setLastMessage(namespace, forEvent, message);
            });
        }
    };
    return (react_1.default.createElement(IoContext_1.default.Provider, { value: {
            createConnection: createConnection,
            getConnection: getConnection,
            getLastMessage: getLastMessage,
            setLastMessage: setLastMessage,
            getError: getError,
            setError: setError,
            getStatus: getStatus,
            registerSharedListener: registerSharedListener,
        } }, children));
};
exports.default = IoProvider;
