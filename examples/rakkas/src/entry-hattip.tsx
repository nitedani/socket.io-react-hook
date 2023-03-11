import { createRequestHandler, RequestContext } from "rakkasjs";
import { Server } from "socket.io";
import { IoProvider } from "socket.io-react-hook";
const socketIoMiddleware = (ctx: RequestContext) => {
  const server = ctx.platform.request.socket.server;
  if (!server.io) {
    server.io = new Server(server);
  }
  ctx.locals.io = server.io;
};

export default createRequestHandler({
  middleware: {
    beforePages: [socketIoMiddleware],
    beforeApiRoutes: [socketIoMiddleware],
  },
  createPageHooks(ctx) {
    return {
      wrapApp(app) {
        return <IoProvider server={ctx.locals.io}>{app}</IoProvider>;
      },
    };
  },
});
