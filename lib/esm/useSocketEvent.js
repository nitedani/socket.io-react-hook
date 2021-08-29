import { useContext, useEffect } from "react";
import { IoContext } from ".";
var useSocketEvent = function (socket, event) {
    var ioContext = useContext(IoContext);
    var registerSharedListener = ioContext.registerSharedListener, getLastMessage = ioContext.getLastMessage;
    var lastMessage = getLastMessage(socket.namespaceKey, event);
    var sendMessage = function (message) { return socket.emit(event, message); };
    useEffect(function () {
        registerSharedListener(socket.namespaceKey, event);
    }, [socket]);
    return { lastMessage: lastMessage, sendMessage: sendMessage, socket: socket };
};
export default useSocketEvent;
