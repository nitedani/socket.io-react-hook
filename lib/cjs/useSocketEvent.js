"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSocketEvent = void 0;
var react_1 = require("react");
var useSocketEvent = function (socket, event) {
    var _a = react_1.useState(), lastMessage = _a[0], setLastMessage = _a[1];
    var _b = react_1.useState(), error = _b[0], setError = _b[1];
    react_1.useEffect(function () {
        socket.on(event, setLastMessage);
        socket.on("error", setError);
        return function () {
            socket.off(event, setLastMessage);
            socket.off("error", setError);
        };
    }, [socket]);
    return { lastMessage: lastMessage, error: error };
};
exports.useSocketEvent = useSocketEvent;
