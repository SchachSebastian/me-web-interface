import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import { items } from "./storage/storage";
import { Message } from "./types/Message";

let sockets: WebSocket[] = [];

export function createClientWs(server: http.Server) {
    const ws = new WebSocketServer({ server });
    ws.on("connection", (socket) => {
        console.log("[Client WS] WebSocket connection established");
        sockets.push(socket);
        socket.send(
            JSON.stringify({
                type: "update-inventory",
                data: items.get(),
            } as Message)
        );
        ws.on("message", (message) => {
            const parsed = JSON.parse(message.toString());
            console.log("[Client WS] Received:", parsed);
        });
        ws.on("error", function (err: any) {
            console.error("[Client WS] Error:", err);
            sockets = sockets.filter((s) => s !== socket);
        });
    
        ws.on("close", function () {
            console.log("[Client WS] Socket closed");
            sockets = sockets.filter((s) => s !== socket);
        });
    });

    return ws;
}

items.listen((items) => {
    sockets.forEach(socket => {
        socket.send(
            JSON.stringify({
                type: "update-inventory",
                data: items,
            } as Message)
        );
    })
})
