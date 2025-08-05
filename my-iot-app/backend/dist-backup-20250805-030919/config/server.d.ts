import { Server as SocketIOServer } from 'socket.io';
export declare function createApp(): import("express-serve-static-core").Express;
export declare function createHTTPServer(): {
    httpServer: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    io: SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
};
//# sourceMappingURL=server.d.ts.map