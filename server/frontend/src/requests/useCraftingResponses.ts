import { Item } from "diff-store";
import { useState } from "react";
import useSubscribe from "./useSubsribe";

export const useCraftingResponses = () => {
    const [craftingResponses, setCraftingResponses] = useState<
        (Pick<Item, "count" | "id"> & { success: boolean })[]
    >([]);
    useSubscribe({
        type: "crafting-response",
        callback: (item: Pick<Item, "count" | "id"> & { success: boolean }) => {
            console.log("Received crafting response", item);
            setCraftingResponses((prev) => [...prev, item]);
        },
    });
    return [craftingResponses, setCraftingResponses] as [
        (Pick<Item, "count" | "id"> & { success: boolean })[],
        React.Dispatch<
            React.SetStateAction<
                (Pick<Item, "count" | "id"> & { success: boolean })[]
            >
        >
    ];
};
