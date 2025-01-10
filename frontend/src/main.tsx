import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {WebsocketProvider} from "./WebsocketProvider";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <WebsocketProvider url={"ws://localhost:3000"}>
            <App/>
        </WebsocketProvider>
    </StrictMode>,
)
