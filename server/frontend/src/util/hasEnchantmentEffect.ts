import { Item } from "diff-store";
import { isEnchantedItem } from "./isEnchantedItem";

const itemsWithEnchantmentEffect = ["minecraft:nether_star"];
export const hasEnchantmentEffect = (item: Item): boolean => {
    if (itemsWithEnchantmentEffect.includes(item.name)) {
        return true;
    }
    return isEnchantedItem(item);
}