import http from "http";

export function initializedServer(options: http.ServerOptions, application: http.RequestListener) {
    const httpServer = http.createServer(options, application);

    return httpServer;
}
