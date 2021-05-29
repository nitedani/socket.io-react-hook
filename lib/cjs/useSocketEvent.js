"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var _1 = require(".");
var useSocketEvent = function (socket, event) {
    var ioContext = react_1.useContext(_1.IoContext);
    var registerSharedListener = ioContext.registerSharedListener, getLastMessage = ioContext.getLastMessage, getError = ioContext.getError;
    var error = getError(socket.namespace);
    var lastMessage = getLastMessage(socket.namespace, event);
    react_1.useEffect(function () {
        registerSharedListener(socket.namespace, event);
    }, [socket]);
    return { lastMessage: lastMessage, error: error };
};
exports.default = useSocketEvent;
