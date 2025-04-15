import { useStore } from "@nanostores/react";
import { $items, updateItemStorage } from "diff-store/src/storage/items";
import { Item } from "diff-store/src/types/Item";
import { useState } from "react";
import useSubscribe from "./useSubsribe";

export const useMeItems = () => {
    useSubscribe({
        type: "inventory-update",
        callback: (items: Item[]) => {
            console.log("Received inventory update:", items.length);
            updateItemStorage(Array.from(items));
        },
    });
    return useStore($items);
};
