"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var _1 = require(".");
var useSocketEvent = function (socket, event) {
    var ioContext = (0, react_1.useContext)(_1.IoContext);
    var registerSharedListener = ioContext.registerSharedListener, getLastMessage = ioContext.getLastMessage;
    var lastMessage = getLastMessage(socket.namespaceKey, event);
    var sendMessage = function (message) { return socket.emit(event, message); };
    (0, react_1.useEffect)(function () {
        registerSharedListener(socket.namespaceKey, event);
    }, [socket]);
    return { lastMessage: lastMessage, sendMessage: sendMessage, socket: socket };
};
exports.default = useSocketEvent;
