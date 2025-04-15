import { MessageCallback } from "diff-store/src/types/MessageCallback";
import { useWebSocket } from "../WebsocketProvider";
import { useEffect } from "react";

function useSubscribe(props: MessageCallback) {
    const socket = useWebSocket();
    useEffect(() => {
        socket.addEventListener("message", (event) => {
            const received = JSON.parse(event.data);
            if (received.type === props.type) {
                props.callback(received.data);
            }
        });

        return () => {
            socket.removeEventListener("message", () => {});
        };
    }, []);
}

export default useSubscribe;