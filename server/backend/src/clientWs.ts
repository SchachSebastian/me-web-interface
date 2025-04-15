import { $items } from "diff-store/src/storage/items";
import { $storage } from "diff-store/src/storage/storage";
import { Message } from "diff-store/src/types/Message";
import { MessageCallback } from "diff-store/src/types/MessageCallback";
import dotenv from "dotenv";
import typia from "typia";
import WebSocket from "ws";
import { sendMinecraftMessage } from "./minecraftWs";
import chunkArray from "./util/chunkArray";

dotenv.config();

const CRAFTING_SECRET = process.env.CRAFTING_SECRET;

let sockets: WebSocket[] = [];

const removeSocket = (socket: WebSocket) => {
    sockets = sockets.filter((s) => s !== socket);
};

type CraftingRequest = {
    fingerprint: string;
    count: number;
    secret: string;
};

let messageCallbacks: MessageCallback[] = [
    {
        type: "crafting-request",
        callback: (data: any) => {
            if (!typia.is<CraftingRequest>(data)) {
                console.error("Invalid crafting request data:", data);
                return false;
            }
            console.log("Received Crafting Request message");
            if (data.secret !== CRAFTING_SECRET) {
                console.error("Invalid crafting secret");
                return false;
            }
            sendMinecraftMessage({
                type: "crafting-request",
                data: {
                    fingerprint: data.fingerprint,
                    count: data.count,
                },
            });
        },
    },
];

export function handleClientWs(socket: WebSocket) {
    console.log("[Client WS] WebSocket connection established");
    chunkArray($items.get(), 100).forEach((chunk) => {
        socket.send(
            JSON.stringify({
                type: "inventory-update",
                data: chunk,
            } as Message)
        );
    });
    socket.send(
        JSON.stringify({
            type: "storage-update",
            data: $storage.get(),
        } as Message)
    );
    sockets.push(socket);
    socket.on("message", (msg) => {
        try {
            const received = typia.json.isParse<Message>(msg.toString());
            if (!received) {
                console.error("Invalid message format:", msg.toString());
                socket.close(1008);
                removeSocket(socket);
                return;
            }
            messageCallbacks
                .filter((c) => c.type === received.type)
                .forEach((c) => {
                    const result = c.callback(received.data);
                    if (result === false) {
                        console.error("Error processing message:", received);
                        socket.close(1008);
                        sockets = sockets.filter((s) => s !== socket);
                    }
                });
        } catch (err) {
            console.error("Error parsing message:", err);
            socket.close(1008);
            removeSocket(socket);
        }
    });
    socket.on("error", function (err: any) {
        console.error("[Client WS] Error:", err);
        removeSocket(socket);
    });

    socket.on("close", function () {
        console.log("[Client WS] Socket closed");
        removeSocket(socket);
    });
}

export function sendClientMessage(message: Message) {
    sockets.forEach((socket) => {
        socket.send(JSON.stringify(message));
    });
}
