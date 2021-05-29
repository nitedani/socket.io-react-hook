import React, { useRef } from "react";
import io from "socket.io-client";
import IoContext from "./IoContext";
var IoProvider = function (_a) {
    var children = _a.children;
    var connections = useRef({});
    var statuses = useRef({});
    var lastMessages = useRef({});
    var errors = useRef({});
    var createConnection = function (namespace, options) {
        var _a;
        if (namespace === void 0) { namespace = ""; }
        if (options === void 0) { options = {}; }
        var handleConnect = function () { return (statuses.current[namespace] = "connected"); };
        var handleDisconnect = function () {
            return (statuses.current[namespace] = "disconnected");
        };
        var connection = io(namespace, options);
        connections.current = Object.assign({}, connections.current, (_a = {},
            _a[namespace] = connection,
            _a));
        connection.on("connect", handleConnect);
        connection.on("disconnect", handleDisconnect);
        return connection;
    };
    var getLastMessage = function (namespace, forEvent) {
        if (namespace === void 0) { namespace = ""; }
        if (forEvent === void 0) { forEvent = ""; }
        return lastMessages.current["" + namespace + forEvent];
    };
    var setLastMessage = function (namespace, forEvent, message) {
        return (lastMessages.current["" + namespace + forEvent] = message);
    };
    var getConnection = function (namespace) {
        if (namespace === void 0) { namespace = ""; }
        return connections.current[namespace];
    };
    var getStatus = function (namespace) {
        if (namespace === void 0) { namespace = ""; }
        return statuses.current[namespace];
    };
    var getError = function (namespace) {
        if (namespace === void 0) { namespace = ""; }
        return errors.current[namespace];
    };
    var setError = function (namespace, error) {
        if (namespace === void 0) { namespace = ""; }
        return (errors.current[namespace] = error);
    };
    var registerSharedListener = function (namespace, forEvent) {
        if (namespace === void 0) { namespace = ""; }
        if (forEvent === void 0) { forEvent = ""; }
        if (!connections.current[namespace].hasListeners(forEvent)) {
            connections.current[namespace].on(forEvent, function (message) {
                return setLastMessage(namespace, forEvent, message);
            });
            connections.current[namespace].on("error", function (error) {
                return setError(namespace, error);
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
