import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type WebsocketContextType = {
    socket: WebSocket;
};

const WebsocketContext = createContext<WebsocketContextType | undefined>(
    undefined
);

interface Props {
    url: string;
    children: ReactNode;
}
export const WebsocketProvider = (props: Props) => {
    const [socket, setSocket] = useState(new WebSocket(props.url));
    useEffect(() => {
        const handleFocus = () => {
            if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
                setSocket(new WebSocket(props.url));
            }
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, []);
    useEffect(() => {
        socket.addEventListener("close", (event) => {
            console.error("WebSocket error observed:", event);
            localStorage.removeItem("craftingSecret");
            setSocket(new WebSocket(props.url));
            location.reload();
        });
    }, [socket]);
    return (
        <WebsocketContext.Provider value={{ socket }}>
            {props.children}
        </WebsocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebsocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebsocketProvider");
    }
    return context.socket;
};
