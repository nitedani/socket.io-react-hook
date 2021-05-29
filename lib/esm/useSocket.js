import * as React from "react";
import IoContext from "./IoContext";
import SocketMock from "socket.io-mock";
var useSocket = function (args) {
    var namespace = args && args.namespace;
    var options = args && args.options;
    var ioContext = React.useContext(IoContext);
    var existingConnection = ioContext.getConnection(namespace);
    if (!existingConnection) {
        return ioContext.createConnection(namespace, options);
    }
    return {
        socket: existingConnection || new SocketMock(),
        connected: !!existingConnection,
    };
};
export default useSocket;
useSocket();
