import WebSocket, { Data, WebSocketServer } from "ws";
import { Message } from "./types/Message";
import { MessageCallback } from "./types/MessageCallback";
import { items } from "./storage/storage";
import { Item } from "./types/Item";
import dotenv from "dotenv";

dotenv.config();

let minecraftSocket: WebSocket | null = null;
let messageCallbacks: MessageCallback[] = [
    {
        type: "item-update",
        callback: (data: any) => {
            items.set(data as Item[]);
        },
    },
];

const MINECRAFT_WS_PORT = process.env.MINECRAFT_WS_PORT
    ? parseInt(process.env.MINECRAFT_WS_PORT)
    : 81;
const SECRET = process.env.SECRET;
export function createMinecraftWs() {
    const ws = new WebSocketServer({
        host: "0.0.0.0",
        port: MINECRAFT_WS_PORT,
        skipUTF8Validation: true,
        perMessageDeflate: true,
    });

    ws.on("connection", function (socket: WebSocket, request) {
        if (request.headers['secret'] !== SECRET) {
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
    });
}
