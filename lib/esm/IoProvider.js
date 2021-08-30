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
    var sockets = useRef({});
    var _b = useState({}), statuses = _b[0], setStatuses = _b[1];
    var _c = useState({}), lastMessages = _c[0], setLastMessages = _c[1];
    var _d = useState({}), errors = _d[0], setErrors = _d[1];
    var createConnection = function (urlConfig, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var connectionKey = urlConfig.id;
        if (!(connectionKey in connections.current)) {
            connections.current[connectionKey] = 1;
        }
        else {
            connections.current[connectionKey] += 1;
        }
        var cleanup = function () {
            if (--connections.current[connectionKey] === 0) {
                var socketsToClose = Object.keys(sockets.current).filter(function (key) {
                    return key.includes(connectionKey);
                });
                for (var _i = 0, socketsToClose_1 = socketsToClose; _i < socketsToClose_1.length; _i++) {
                    var key = socketsToClose_1[_i];
                    sockets.current[key].disconnect();
                    delete sockets.current[key];
                }
            }
        };
        var namespaceKey = "" + connectionKey + urlConfig.path;
        // By default socket.io-client creates a new connection for the same namespace
        // The next line prevents that
        if (sockets.current[namespaceKey]) {
            sockets.current[namespaceKey].connect();
            return { socket: sockets.current[namespaceKey], cleanup: cleanup };
        }
        var handleConnect = function () {
            return setStatuses(function (state) {
                var _a;
                return (__assign(__assign({}, state), (_a = {}, _a[namespaceKey] = "connected", _a)));
            });
        };
        var handleDisconnect = function () {
            return setStatuses(function (state) {
                var _a;
                return (__assign(__assign({}, state), (_a = {}, _a[namespaceKey] = "disconnected", _a)));
            });
        };
        var socket = io(urlConfig.source, options);
        socket.namespaceKey = namespaceKey;
        sockets.current = Object.assign({}, sockets.current, (_a = {},
            _a[namespaceKey] = socket,
            _a));
        socket.on("error", function (error) { return setError(namespaceKey, error); });
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        return { socket: socket, cleanup: cleanup };
    };
    var getLastMessage = function (namespaceKey, forEvent) {
        if (namespaceKey === void 0) { namespaceKey = ""; }
        if (forEvent === void 0) { forEvent = ""; }
        return lastMessages["" + namespaceKey + forEvent];
    };
    var setLastMessage = function (namespaceKey, forEvent, message) {
        return setLastMessages(function (state) {
            var _a;
            return (__assign(__assign({}, state), (_a = {}, _a["" + namespaceKey + forEvent] = message, _a)));
        });
    };
    var getConnection = function (namespaceKey) {
        if (namespaceKey === void 0) { namespaceKey = ""; }
        return sockets.current[namespaceKey];
    };
    var getStatus = function (namespaceKey) {
        if (namespaceKey === void 0) { namespaceKey = ""; }
        return statuses[namespaceKey];
    };
    var getError = function (namespaceKey) {
        if (namespaceKey === void 0) { namespaceKey = ""; }
        return errors[namespaceKey];
    };
    var setError = function (namespaceKey, error) {
        if (namespaceKey === void 0) { namespaceKey = ""; }
        return setErrors(function (state) {
            var _a;
            return (__assign(__assign({}, state), (_a = {}, _a[namespaceKey] = error, _a)));
        });
    };
    var registerSharedListener = function (namespaceKey, forEvent) {
        if (namespaceKey === void 0) { namespaceKey = ""; }
        if (forEvent === void 0) { forEvent = ""; }
        if (sockets.current[namespaceKey] &&
            !sockets.current[namespaceKey].hasListeners(forEvent)) {
            sockets.current[namespaceKey].on(forEvent, function (message) {
                return setLastMessage(namespaceKey, forEvent, message);
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
