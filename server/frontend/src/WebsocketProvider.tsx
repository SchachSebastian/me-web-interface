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
        socket.addEventListener("error", (event) => {
            console.error("WebSocket error observed:", event);
            localStorage.removeItem("craftingSecret");
            document.location.reload();
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
