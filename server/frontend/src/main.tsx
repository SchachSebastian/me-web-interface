import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { WebsocketProvider } from "./WebsocketProvider";
import { NotificationProvider } from "./NotificationProvider";

const root = document.getElementById("root");
if (!root) {
    throw new Error("No 'root' element found in document");
}
const { protocol, hostname } = window.location;
const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${wsProtocol}//${hostname}/api`;
createRoot(root).render(
    <StrictMode>
        <NotificationProvider>
            <WebsocketProvider url={wsUrl}>
                <App />
            </WebsocketProvider>
        </NotificationProvider>
    </StrictMode>
);
