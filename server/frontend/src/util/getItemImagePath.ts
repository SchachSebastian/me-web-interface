import { Item } from "diff-store/src/types/Item";

const MissingImage = "/missingItem.webp";

const getPath = (name: string) => {
    return "/assets/" + name + ".webp";
}

const getApotheosisGemPath = (item: Item) => {
    if (!item.components) return MissingImage;
    const components = item.components;
    const keys = Object.keys(components);
    if (!keys.includes("apotheosis:gem")) return MissingImage;
    const gem = components["apotheosis:gem"];
    if (typeof gem !== "string") return MissingImage;
    const gemName = gem.split("/")[1];
    if (!gemName) return MissingImage;
    return getPath("apotheosis/" + gemName);
}

export const getItemImagePath = (item: Item): string => {
    if (item.name === "apotheosis:gem") {
        return getApotheosisGemPath(item);
    } else if (item.name === "minecraft:lava" || item.name === "minecraft:water") {
        return getPath(item.name.replace(":", "/") + "_still");
    }
    return getPath(item.name.replace(":", "/"));
}