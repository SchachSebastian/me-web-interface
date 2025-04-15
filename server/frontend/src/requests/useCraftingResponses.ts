import { Item } from "diff-store/src/types/Item";
import { useState } from "react";
import useSubscribe from "./useSubsribe";

export const useCraftingResponses = () => {
    const [craftingResponses, setCraftingResponses] = useState<
        (Pick<Item, "count" | "fingerprint"> & { success: boolean })[]
    >([]);
    useSubscribe({
        type: "crafting-response",
        callback: (
            item: Pick<Item, "count" | "fingerprint"> & { success: boolean }
        ) => {
            console.log("Received crafting response", item);
            setCraftingResponses((prev) => [...prev, item]);
        },
    });
    return [craftingResponses, setCraftingResponses] as [
        (Pick<Item, "count" | "fingerprint"> & { success: boolean })[],
        React.Dispatch<
            React.SetStateAction<
                (Pick<Item, "count" | "fingerprint"> & { success: boolean })[]
            >
        >
    ];
};
