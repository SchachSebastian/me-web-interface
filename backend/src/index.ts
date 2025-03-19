import http from "http";
import { createClientWs } from "./clientWs";
import { createHttpServer } from "./httpServer";
import { createMinecraftWs } from "./minecraftWs";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 80;

const app = createHttpServer();
const server = http.createServer(app);
createClientWs(server);
createMinecraftWs();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
