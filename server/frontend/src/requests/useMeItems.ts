import { useStore } from "@nanostores/react";
import { $items, updateItemStorage } from "diff-store/src/storage/items";
import { Item } from "diff-store/src/types/Item";
import { MessageCallback } from "diff-store/src/types/MessageCallback";
import { useEffect } from "react";
import { useWebSocket } from "../WebsocketProvider";

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

export const useMeItems = () => {
    useSubscribe({
        type: "update-inventory",
        callback: (items: Item[]) => {
            console.log("Received inventory update:", items.length);
            updateItemStorage(Array.from(items));
        },
    });
    return useStore($items);
};

export const useResetMessage = (callback: () => void) => {
    useSubscribe({
        type: "reset",
        callback: () => {
            console.log("Received reset message");
            callback();
        },
    });
}
