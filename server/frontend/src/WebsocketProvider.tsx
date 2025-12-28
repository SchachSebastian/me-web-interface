import { $state, MessageCallback } from "diff-store";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";

type WebsocketContextType = {
    addListener: (listener: MessageCallback) => string;
    removeListener: (id: string) => void;
    send: (type: string, data: any) => void;
};

const WebsocketContext = createContext<WebsocketContextType | undefined>(
    undefined
);

interface Props {
    url: string;
    children: ReactNode;
}
export const WebsocketProvider = (props: Props) => {
    const socketRef = useRef<WebSocket | null>(null);
    const listenersRef = useRef(new Map<string, MessageCallback>());

    const connect = () => {
        const ws = new WebSocket(props.url);

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            const received = JSON.parse(event.data);
            listenersRef.current.forEach((listener) => {
                if (listener.type === received.type) {
                    listener.callback(received.data);
                }
            });
        };

        ws.onclose = (event) => {
            console.error("WebSocket closed:", event);
            $state.set({
                ...$state.get(),
                status: "server_disconnected",
            });
            setTimeout(connect, 1000);
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            ws.close();
        };

        socketRef.current = ws;
    };

    useEffect(() => {
        connect();

        const handleFocus = () => {
            const ws = socketRef.current;
            if (!ws || ws.readyState === WebSocket.CLOSED) {
                connect();
            }
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
            socketRef.current?.close();
        };
    }, []);

    const addListener = (listener: MessageCallback) => {
        const id = crypto.randomUUID();
        listenersRef.current.set(id, listener);
        return id;
    };
    const removeListener = (id: string) => {
        listenersRef.current.delete(id);
    };
    const send = (type: string, data: any) => {
        socketRef.current?.send(JSON.stringify({ type, data }));
    };

    return (
        <WebsocketContext.Provider value={{ addListener, removeListener, send }}>
            {props.children}
        </WebsocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebsocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebsocketProvider");
    }
    return context;
};
