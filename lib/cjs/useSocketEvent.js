"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var _1 = require(".");
var useSocketEvent = function (socket, event) {
    var ioContext = react_1.useContext(_1.IoContext);
    var registerSharedListener = ioContext.registerSharedListener, getLastMessage = ioContext.getLastMessage, getError = ioContext.getError;
    var errorShared = getError(socket.namespace);
    var lastMessageShared = getLastMessage(socket.namespace, event);
    var _a = react_1.useState(), lastMessage = _a[0], setLastMessage = _a[1];
    var _b = react_1.useState(), error = _b[0], setError = _b[1];
    react_1.useEffect(function () {
        setError(errorShared);
    }, [errorShared]);
    react_1.useEffect(function () {
        setLastMessage(lastMessageShared);
    }, [lastMessageShared]);
    react_1.useEffect(function () {
        registerSharedListener(socket.namespace, event);
    }, [socket]);
    return { lastMessage: lastMessage, error: error };
};
exports.default = useSocketEvent;
