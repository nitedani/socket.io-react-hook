import type { IncomingMessage, ServerResponse, Server } from "http";
import type { Server as SocketIOServer } from "socket.io";
declare module "rakkasjs" {
  interface ServerSideLocals {
    io: SocketIOServer;
  }
  interface RequestContext {
    platform: {
      request: IncomingMessage & {
        socket: {
          server: Server & {
            io?: SocketIOServer;
          };
        };
      };
      response: ServerResponse;
    };
  }
}
