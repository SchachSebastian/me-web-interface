import http from "http";
import { handleClientWs } from "./clientWs";
import { createHttpServer } from "./httpServer";

import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { handleMinecraftWs } from "./minecraftWs";
import updateCountHistoryInterval from "./service/countHistory";
import { $state } from 'diff-store';

dotenv.config();

$state.set({
    ...$state.get(),
    status: "never_connected",
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 80;

const app = createHttpServer();
const server = http.createServer(app);

const ws = new WebSocketServer({
    server,
    perMessageDeflate: {
        zlibDeflateOptions: {
            level: 6,
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024,
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        threshold: 512,
    },
});
ws.on("connection", (socket, req) => {
    console.log("Incoming Websocket Connection");
    if (req.url === "/api") {
        handleClientWs(socket);
    } else if (req.url === "/mc") {
        handleMinecraftWs(socket, req);
    } else {
        ws.close();
    }
});

updateCountHistoryInterval();

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
