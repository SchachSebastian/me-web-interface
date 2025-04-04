import { Item } from "diff-store/src/types/Item";

export const isEnchantedItem = (item: Item): boolean => {
    if (!item.components) return false;
    const components = item.components;
    const keys = Object.keys(components);
    if (keys.includes("minecraft:enchantments") || keys.includes("minecraft:stored_enchantments")) {
        return true;
    }
    return false;
}