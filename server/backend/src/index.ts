import http from "http";
import { handleClientWs, sendClientMessage } from "./clientWs";
import { createHttpServer } from "./httpServer";

import { $items } from "diff-store/src/storage/items";
import dotenv from "dotenv";
import { Item } from "shared/diff-store/src/types/Item";
import { WebSocketServer } from "ws";
import { handleMinecraftWs } from "./minecraftWs";
import chunkArray from "./util/chunkArray";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 80;

const app = createHttpServer();
const server = http.createServer(app);

const ws = new WebSocketServer({ server });
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

setInterval(() => {
    const timestamp = Date.now();
    const updates: Pick<Item,"id"|"countHistory">[] = [];
    const newItems = $items.get().map((item) => {
        const newCountHistoryElement = {
            count: item.count,
            timestamp: timestamp,
        };
        const newCountHistory = [
            newCountHistoryElement,
            ...item.countHistory,
        ];
        const newItem: Item = {
            ...item,
            countHistory: newCountHistory.slice(0, 25),
        };
        updates.push({
            id: item.id,
            countHistory: [newCountHistoryElement],
        })
        return newItem;
    });
    chunkArray(updates, 100).forEach((chunk) => {
        sendClientMessage({
            type: "inventory-update",
            data: chunk,
        });
    });
    $items.set(newItems);
}, 1000 * 60 * 60); // 1 hour

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
