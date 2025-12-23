import { $items, Item } from "diff-store";

export const MissingImage = "/missingItem.webp";

const getPath = (name: string) => {
    return "/assets/" + name + ".webp";
}

export const getItemImagePath = (item: Item): string => {
    if (item.name === undefined) return MissingImage;
    if (item.isFluid) {
        return getPath(item.name.replace(":", "/").replace("_source","") + "_bucket");
    }
    return getPath(item.name.replace(":", "/"));
}