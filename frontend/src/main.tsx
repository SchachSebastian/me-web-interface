import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App'
import {WebsocketProvider} from "./WebsocketProvider";

const root = document.getElementById("root");
if (!root) {
    throw new Error("No 'root' element found in document");
}
const { protocol, hostname } = window.location;
const wsProtocol = protocol === 'https:'? 'wss:' : 'ws:';
const wsUrl = `${wsProtocol}//${hostname}`;
createRoot(root).render(
    <StrictMode>
        <WebsocketProvider url={wsUrl}>
            <App/>
        </WebsocketProvider>
    </StrictMode>,
)
