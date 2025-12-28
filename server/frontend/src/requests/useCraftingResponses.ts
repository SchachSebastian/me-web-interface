import { useStore } from "@nanostores/react";
import { $items, CraftingResponse } from "diff-store";
import { useNotifications } from "../NotificationProvider";
import useSubscribe from "./useSubsribe";

export const useCraftingResponses = () => {
    const items = useStore($items);
    const { addNotification } = useNotifications();
    useSubscribe({
        type: "crafting-response",
        callback: (craftingResponse: CraftingResponse) => {
            console.log("Received crafting response", craftingResponse);
            const item = items.find((item) => item.id === craftingResponse.id);
            let name = craftingResponse.id;
            if (item) {
                name = item.displayName ?? item.name;
            }
            const success = craftingResponse.status === "success";
            addNotification({
                header:
                    (success
                        ? "Successfully started crafting "
                        : "Failed to craft ") + (name),
                message: "Count: " + craftingResponse.count,
                success,
            });
        },
    });
};
