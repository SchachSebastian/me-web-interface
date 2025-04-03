import { atom } from "nanostores";
import { Item } from "../types/Item";
import isEqual from "fast-deep-equal";

export const $items = atom<Item[]>([]);

export const updateItemStorage = (updates: Partial<Item>[]) => {
    console.log("start")
    // console.log(JSON.stringify(updates,null,2));
    if (updates===undefined||updates.length === 0) {
        return;
    }
    const new_items = $items
        .get()
        .map((item) => {
            const update = updates.find(
                (update) =>
                    isEqual(update.components, item.components) &&
                    update.name === item.name
            );
            if (update) {
                return { ...item, ...update };
            }
            return item;
        })
        .filter((item) => item?.count !== 0);
    updates
        .filter(
            (update) =>
                $items
                    .get()
                    .find(
                        (item) =>
                            isEqual(update.components, item.components) &&
                            update.name === item.name
                    ) === undefined
        )
        .forEach((item) => {
            new_items.push({ ...item } as Item);
        });
    $items.set(new_items);
    console.log("end");
};