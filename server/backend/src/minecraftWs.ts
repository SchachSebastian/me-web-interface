import {
    $items,
    $state,
    defaultState,
    Message,
    MessageCallback,
    State,
    updateItemStorage,
} from "diff-store";
import dotenv from "dotenv";
import http from "http";
import typia from "typia";
import WebSocket, { Data } from "ws";
import { sendClientMessage } from "./clientWs";
import { MinecraftItem, MinecraftItemUpdate } from "./types/MinecraftItem";

dotenv.config();

type CraftingResponse = {
    id: string;
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
            $state.set(defaultState);
            sendClientMessage({
                type: "reset",
            });
        },
    },
    {
        type: "inventory-update",
        callback: (data: any) => {
            if (!typia.equals<MinecraftItemUpdate[]>(data)) {
                console.error("Invalid inventory update data:", data);
                return false;
            }
            const seen = new Set<string>();
            const validUpdates = data
                .filter((update) => {
                    const item = $items
                        .get()
                        .find((item) => item.id === update.id);
                    if (
                        (item && typia.is<MinecraftItemUpdate>(update)) ||
                        typia.is<MinecraftItem>(update)
                    ) {
                        return true;
                    }
                    console.error("Invalid item update:", update);
                    return false;
                })
                .filter((update) => {
                    if (seen.has(update.id)) {
                        console.error(
                            "Duplicate item update for :",
                            update.id,
                            $items.get().find((item) => item.id === update.id)
                        );
                        return false;
                    }
                    seen.add(update.id);
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
            if (!typia.equals<CraftingResponse>(data)) {
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
        type: "state-update",
        callback: (data: any) => {
            if (!typia.equals<Partial<State>>(data)) {
                console.error("Invalid state data:", data);
                return false;
            }
            $state.set({
                ...$state.get(),
                ...data,
            });
            console.log("Received State Update message");
            sendClientMessage({
                type: "state-update",
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

    minecraftSocket.on("error", function (err: any) {
        console.error("[Minecraft WS] Error:", err);
        minecraftSocket = null;
    });

    minecraftSocket.on("close", function () {
        $state.set({
            ...$state.get(),
            status: "minecraft_disconnected",
        });
        sendClientMessage({
            type: "state-update",
            data: {
                status: "minecraft_disconnected",
            },
        });
        console.log("[Minecraft WS] Socket closed");
        minecraftSocket = null;
    });
}

export function sendMinecraftMessage(message: Message) {
    if (!minecraftSocket) return false;
    minecraftSocket.send(JSON.stringify(message));
    return true;
}
