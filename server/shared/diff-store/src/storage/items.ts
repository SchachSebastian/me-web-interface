import { atom } from "nanostores";
import { Item, ItemUpdate } from "../types/Item.js";

export const $items = atom<Item[]>([]);

export const updateItemStorage = (updates: ItemUpdate[]) => {
    if (updates === undefined || updates.length === 0) {
        return;
    }
    const new_items = $items
        .get()
        .map((item) => {
            const update = updates.find((update) => update.id === item.id);
            if (update) {
                return {
                    ...item,
                    ...update,
                } as Item;
            }
            return item;
        })
        .filter((item) => item.count !== -1);
    updates
        .filter(
            (update) =>
                new_items.find((item) => update.id === item.id) === undefined
        )
        .filter((item) => item.count !== -1)
        .forEach((item) => {
            new_items.push(item as Item);
        });
    $items.set(new_items.filter(item => item.id && item.count).sort((a, b) => b.count - a.count));
};
