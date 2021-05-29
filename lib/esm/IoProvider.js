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
import React, { useRef, useState } from "react";
import io from "socket.io-client";
import IoContext from "./IoContext";
var IoProvider = function (_a) {
    var children = _a.children;
    var connections = useRef({});
    var _b = useState({}), statuses = _b[0], setStatuses = _b[1];
    var _c = useState({}), lastMessages = _c[0], setLastMessages = _c[1];
    var _d = useState({}), errors = _d[0], setErrors = _d[1];
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
        var connection = io(namespace, options);
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
    return (React.createElement(IoContext.Provider, { value: {
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
export default IoProvider;
