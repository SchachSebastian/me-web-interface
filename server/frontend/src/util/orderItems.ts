import { Item } from "diff-store";

export const orderItems = (items: Item[], orderBy: string, order: string) => {
    const orderedItems = items.sort((a, b) => {
        if (orderBy === "name") {
            return (a.displayName ?? a.name).localeCompare(b.displayName ?? b.name);
        } else if (orderBy === "count") {
            return b.count - a.count;
        }
        return 0;
    });
    if (order === "asc") {
        orderedItems.reverse();
    }
    return orderedItems;
}