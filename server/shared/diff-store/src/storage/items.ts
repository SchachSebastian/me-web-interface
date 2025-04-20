import { atom } from "nanostores";
import { Item, ItemUpdate } from "../types/Item";

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
                    countHistory: update.countHistory
                        ? [...update.countHistory, ...item.countHistory]
                        : item.countHistory,
                } as Item;
            }
            return item;
        })
        .filter((item) => item.count !== -1);
    updates
        .filter(
            (update) =>
                $items.get().find((item) => update.id === item.id) === undefined
        )
        .forEach((item) => {
            new_items.push({ ...item, countHistory: item.countHistory?item.countHistory:[] } as Item);
        });
    $items.set(new_items);
};
