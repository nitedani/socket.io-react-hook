import { useContext, useEffect } from "react";
import { IoContext } from ".";
var useSocketEvent = function (socket, event) {
    var ioContext = useContext(IoContext);
    var registerSharedListener = ioContext.registerSharedListener, getLastMessage = ioContext.getLastMessage, getError = ioContext.getError;
    var error = getError(socket.namespace);
    var lastMessage = getLastMessage(socket.namespace, event);
    useEffect(function () {
        registerSharedListener(socket.namespace, event);
    }, [socket]);
    return { lastMessage: lastMessage, error: error };
};
export default useSocketEvent;
