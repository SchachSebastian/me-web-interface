import { $items } from "diff-store/src/storage/items";
import { Message } from "diff-store/src/types/Message";
import { MessageCallback } from "diff-store/src/types/MessageCallback";
import dotenv from "dotenv";
import WebSocket from "ws";
import { sendMinecraftMessage } from "./minecraftWs";
import chunkArray from "./util/chunkArray";

dotenv.config();

const CRAFTING_SECRET = process.env.CRAFTING_SECRET;

let sockets: WebSocket[] = [];

let messageCallbacks: MessageCallback[] = [
    {
        type: "crafting-request",
        callback: (data: any) => {
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
    sockets.push(socket);
    socket.on("message", (msg) => {
        try {
            const received = JSON.parse(msg.toString()) as Message;
            messageCallbacks
                .filter((c) => c.type === received.type)
                .forEach((c) => {
                    const result = c.callback(received.data);
                    if (result === false) {
                        console.error("Error processing message:", received);
                        socket.close();
                        sockets = sockets.filter((s) => s !== socket);
                    }
                });
        } catch (error) {
            console.error("Error parsing message: ", error);
            socket.close();
        }
    });
    socket.on("error", function (err: any) {
        console.error("[Client WS] Error:", err);
        sockets = sockets.filter((s) => s !== socket);
    });

    socket.on("close", function () {
        console.log("[Client WS] Socket closed");
        sockets = sockets.filter((s) => s !== socket);
    });
}

export function sendClientMessage(message: Message) {
    sockets.forEach((socket) => {
        socket.send(JSON.stringify(message));
    });
}
