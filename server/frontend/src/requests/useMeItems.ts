import { useStore } from "@nanostores/react";
import { $items, FIVE_MINUTES, updateCountHistory } from "diff-store";
import { updateItemStorage } from "diff-store";
import { Item } from "diff-store";
import useSubscribe from "./useSubsribe";

export const useMeItems = () => {
    useSubscribe({
        type: "inventory-update",
        callback: (items: Item[]) => {
            console.log("Received inventory update:", items.length);
            const timestamp = Date.now();
            updateItemStorage(Array.from(items));
            updateCountHistory(
                items.map((item) => ({
                    id: item.id,
                    historyElement: {
                        timestamp: timestamp,
                        count: item.count,
                    },
                })), timestamp-FIVE_MINUTES*1.2
            );
        },
    });
    return useStore($items);
};
