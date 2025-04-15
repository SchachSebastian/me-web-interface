import { updateItemStorage, $items } from 'diff-store/src/storage/items';
import { Message } from "diff-store/src/types/Message";
import { MessageCallback } from "diff-store/src/types/MessageCallback";
import dotenv from "dotenv";
import http from "http";
import WebSocket, { Data } from "ws";
import { sendClientMessage } from "./clientWs";
import typia from 'typia';
import { Item, ItemUpdate } from "diff-store/src/types/Item";
import { Storage } from "diff-store/src/types/Storage";
import { $storage } from "diff-store/src/storage/storage";

dotenv.config();

type CraftingResponse = {
    fingerprint: string;
    count: number;
    success: boolean;
};

let minecraftSocket: WebSocket | null = null;
let messageCallbacks: MessageCallback[] = [
    {
        type: "init",
        callback: () => {
            console.log("Received INIT message");
            $items.set([]);
            sendClientMessage({
                type: "reset",
            });
        },
    },
    {
        type: "inventory-update",
        callback: (data: any) => {
            if (!typia.is<ItemUpdate[]>(data)) {
                console.error("Invalid inventory update data:", data);
                return false;
            }
            const validUpdates = data.filter((update) => {
                const item = $items.get().find((item) => item.id === update.id);
                if (!item && !typia.is<Item>(update)) {
                    console.error("Invalid item update:", update);
                    return false;
                }
                return true;
            });
            console.log("Received updates: " + validUpdates.length);
            updateItemStorage(validUpdates);
            sendClientMessage({
                type: "inventory-update",
                data: validUpdates,
            });
        },
    },
    {
        type: "crafting-response",
        callback: (data: any) => {
            if (!typia.is<CraftingResponse>(data)) {
                console.error("Invalid crafting response data:", data);
                return false;
            }
            console.log("Received Crafting Response message");
            sendClientMessage({
                type: "crafting-response",
                data: data,
            });
        },
    },
    {
        type: "storage-update",
        callback: (data: any) => {
            if (!typia.is<Storage>(data)) {
                console.error("Invalid storage data:", data);
                return false;
            }
            $storage.set(data);
            console.log("Received Storage Update message");
            sendClientMessage({
                type: "storage-update",
                data: data,
            });
        },
    },
];

const SECRET = process.env.SECRET;
export function handleMinecraftWs(
    socket: WebSocket,
    request: http.IncomingMessage
) {
    if (request.headers["secret"] !== SECRET) {
        console.error("Invalid secret");
        socket.close(1008);
        return;
    }
    console.log("[Minecraft WS] WebSocket connection established");
    if (minecraftSocket) { 
        console.log("[Minecraft WS] Closing existing socket");
        minecraftSocket.close(1000);
    }
    minecraftSocket = socket;

    minecraftSocket.on("message", function (msg: Data) {
        try {
            const received = typia.json.isParse<Message>(msg.toString());
            if (!received) {
                console.error("Invalid message format:", msg.toString());
                socket.close(1008);
                return;
            }
            messageCallbacks
                .filter((c) => c.type === received.type)
                .forEach((c) => {
                    const result = c.callback(received.data);
                    if (result === false) {
                        console.error("Error processing message:", received);
                        socket.close(1008);
                    }
                });
        } catch (error) {
            console.error("Error parsing message:", error);
            socket.close(1008);
        }
    });

    minecraftSocket.on("[Minecraft WS] error", function (err: any) {
        console.error("Error:", err);
        minecraftSocket = null;
    });

    minecraftSocket.on("close", function () {
        console.log("[Minecraft WS] Socket closed");
        minecraftSocket = null;
    });
}

export function sendMinecraftMessage(message: Message) {
    if (!minecraftSocket) return false;
    minecraftSocket.send(JSON.stringify(message));
    return true;
}