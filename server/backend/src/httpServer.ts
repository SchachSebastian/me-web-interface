import cors from "cors";
import express from "express";
import path from "path";
import errorHandler from "./middlewares/errorHandler";

export function createHttpServer() {
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: "10mb" }));
    app.use(errorHandler);
    const buildPath = path.resolve(__dirname, "../public");

    app.use(express.static(buildPath));

    app.get("/{*splat}", (req, res) => {
        if (
            req.headers.upgrade &&
            req.headers.upgrade.toLowerCase() === "websocket"
        ) {
            return;
        }
        res.sendFile(path.join(buildPath, "index.html"));
    });

    return app;
}
