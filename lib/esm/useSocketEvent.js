import { useEffect, useState } from "react";
var useSocketEvent = function (socket, event) {
    var _a = useState(), lastMessage = _a[0], setLastMessage = _a[1];
    var _b = useState(), error = _b[0], setError = _b[1];
    useEffect(function () {
        socket.on(event, setLastMessage);
        socket.on("error", setError);
        return function () {
            socket.off(event, setLastMessage);
            socket.off("error", setError);
        };
    }, [socket]);
    return { lastMessage: lastMessage, error: error };
};
export default useSocketEvent;
