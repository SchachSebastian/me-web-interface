import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import { Message } from 'diff-store/src/types/Message';
import { $items } from "diff-store/src/storage/items";

let sockets: WebSocket[] = [];

export function handleClientWs(socket: WebSocket){
        console.log("[Client WS] WebSocket connection established");
        sockets.push(socket);
        socket.send(
            JSON.stringify({
                type: "update-inventory",
                data: $items.get(),
            } as Message)
        );
        socket.on("message", (message) => {
            const parsed = JSON.parse(message.toString());
            console.log("[Client WS] Received:", parsed);
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
