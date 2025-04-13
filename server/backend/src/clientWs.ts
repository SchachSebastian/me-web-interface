import { $items } from "diff-store/src/storage/items";
import { Message } from "diff-store/src/types/Message";
import WebSocket from "ws";
import chunkArray from "./util/chunkArray";
import { MessageCallback } from "diff-store/src/types/MessageCallback";
import { sendMinecraftMessage } from "./minecraftWs";

let sockets: WebSocket[] = [];

let messageCallbacks: MessageCallback[] = [
    {
        type: "crafting-request",
        callback: (data:any) => {
            console.log("Received Crafting Request message");
            sendMinecraftMessage({
                type: "crafting-request",
                data: {
                    fingerprint: data.fingerprint,
                    count: data.count,
                },
            });
        },
    }
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
                .forEach((c) => c.callback(received.data));
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
