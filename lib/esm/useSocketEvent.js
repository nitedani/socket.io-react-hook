import { useContext, useEffect, useState } from "react";
import { IoContext } from ".";
var useSocketEvent = function (socket, event) {
    var ioContext = useContext(IoContext);
    var registerSharedListener = ioContext.registerSharedListener, getLastMessage = ioContext.getLastMessage, getError = ioContext.getError;
    var errorShared = getError(socket.namespace);
    var lastMessageShared = getLastMessage(socket.namespace, event);
    var _a = useState(), lastMessage = _a[0], setLastMessage = _a[1];
    var _b = useState(), error = _b[0], setError = _b[1];
    useEffect(function () {
        setError(errorShared);
    }, [errorShared]);
    useEffect(function () {
        setLastMessage(lastMessageShared);
    }, [lastMessageShared]);
    useEffect(function () {
        registerSharedListener(socket.namespace, event);
    }, [socket]);
    return { lastMessage: lastMessage, error: error };
};
export default useSocketEvent;
