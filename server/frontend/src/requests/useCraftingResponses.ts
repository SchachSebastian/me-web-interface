import { CraftingResponse } from "diff-store";
import { useNotifications } from "../NotificationProvider";
import { useMeItems } from "./useMeItems";
import useSubscribe from "./useSubsribe";

export const useCraftingResponses = () => {
    const items = useMeItems();
    const { addNotification } = useNotifications();
    useSubscribe(
        {
            type: "crafting-response",
            callback: (craftingResponse: CraftingResponse) => {
                console.log("Received crafting response", craftingResponse);
                const item = items.find(
                    (item) => item.id === craftingResponse.id
                );
                let name = craftingResponse.id;
                if (item) {
                    name = item.displayName ?? item.name;
                }
                let status: "error" | "success" | "warning" = "error";
                let message = "Failed to craft ";
                if (craftingResponse.status === "success") {
                    status = "success";
                    message = "Successfully started crafting ";
                } else if (craftingResponse.status === "calculation_failed") {
                    status = "warning";
                    message = "Missing items for crafting ";
                }
                addNotification({
                    header: message + name,
                    message: "Count: " + craftingResponse.count,
                    status,
                });
            },
        },
        items
    );
};
