import { atom } from "nanostores";
import { Item } from "../types/Item";
import { McItem } from "../types/McItem";

export const items = atom<Item[]>([]);

export const updateItemStorage = (updates: Partial<McItem>[]) => {
    const new_items = items
        .get()
        .map((item) => {
            const update = updates.find((update) => update.nbt === item.nbt);
            if (update) {
                return { ...item, ...update };
            }
            return item;
        })
        .filter((item) => item?.amount !== 0);
    updates.filter((update) => items.get().find(item => update.nbt === item.nbt) === undefined).forEach((item) => {
        new_items.push({ ...item, type: "item" } as Item);
    });
    items.set(new_items);
};
