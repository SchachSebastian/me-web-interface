import cors from "cors";
import express from "express";
import path from "path";
import errorHandler from "./middlewares/errorHandler";

let sockets: WebSocket[] = [];
export function createHttpServer() {
    const app = express();
    app.use(cors());
    app.bind("0.0.0.0");
    app.use(express.json({ limit: "10mb" }));
    app.use(errorHandler);
    const buildPath = path.resolve(__dirname, "../public");

    app.use(express.static(buildPath));

    app.get("*", (_, res) => {
        res.sendFile(path.join(buildPath, "index.html"));
    });

    return app;
}
