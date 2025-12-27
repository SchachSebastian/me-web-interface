import { MessageCallback } from "diff-store";
import { useEffect } from "react";
import { useWebSocket } from "../WebsocketProvider";

function useSubscribe(props: MessageCallback) {
    const { addListener, removeListener } = useWebSocket();
    useEffect(() => {
        addListener(props);
        return () => {
            removeListener(props);
        };
    }, [addListener, removeListener]);
}

export default useSubscribe;
