import { MessageCallback } from "diff-store";
import { useEffect } from "react";
import { useWebSocket } from "../WebsocketProvider";

function useSubscribe(props: MessageCallback, deps?: React.DependencyList) {
    const { addListener, removeListener } = useWebSocket();
    useEffect(() => {
        const listenerId = addListener(props);
        return () => {
            removeListener(listenerId);
        };
    }, [addListener, removeListener, deps]);
}

export default useSubscribe;
