import { updateItemStorage } from "diff-store/src/storage/items";
import { Message } from "diff-store/src/types/Message";
import { MessageCallback } from "diff-store/src/types/MessageCallback";
import dotenv from "dotenv";
import http from "http";
import WebSocket, { Data } from "ws";
import { sendClientMessage } from "./clientWs";

dotenv.config();

let minecraftSocket: WebSocket | null = null;
let messageCallbacks: MessageCallback[] = [
    {
        type: "item-update",
        callback: (data: any) => {
            console.log("received updates: " + data.length);
            updateItemStorage(data);
            sendClientMessage({
                type: "update-inventory",
                data,
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
        socket.close();
        return;
    }
    console.log("[Minecraft WS] WebSocket connection established");
    minecraftSocket = socket;

    minecraftSocket.on("message", function (msg: Data) {
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

    minecraftSocket.on("[Minecraft WS] error", function (err: any) {
        console.error("Error:", err);
        minecraftSocket = null;
    });

    minecraftSocket.on("close", function () {
        console.log("[Minecraft WS] Socket closed");
        minecraftSocket = null;
    });
}
