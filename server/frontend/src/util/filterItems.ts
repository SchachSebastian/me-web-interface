import { Item } from "diff-store";
import { isEnchantedItem } from "./isEnchantedItem";

const matchesItem = (item: Item, term: string) => {
    if (term.startsWith("#")) {
        if (!item.components) return false;
        return JSON.stringify(item.components).toLowerCase().includes(term.slice(1));
    } else if (term.startsWith("@")) {
        return item.name.split(":")[0].toLowerCase().includes(term.slice(1));
    } else if (term.startsWith("$")) {
        if ("item".startsWith(term.slice(1))) {
            return !item.isFluid && !item.isChemical;
        }
        if ("fluid".startsWith(term.slice(1))) {
            return item.isFluid as boolean;
        }
        if ("chemical".startsWith(term.slice(1))) {
            return item.isChemical as boolean;
        }
        if ("craftable".startsWith(term.slice(1))) {
            return item.isCraftable as boolean;
        }
        if ("enchanted".startsWith(term.slice(1))) {
            return isEnchantedItem(item);
        }
        return false;
    } else if (term.startsWith(">")) {
        return item.count > Number(term.slice(1));
    } else if (term.startsWith("<")) {
        return item.count < Number(term.slice(1));
    } else if (term.startsWith("=")) {
        return item.count === Number(term.slice(1));
    } else {
        return (item.displayName ?? "").toLowerCase().includes(term);
    }
}
export const filterItems = (items: Item[], searchText: string) => {
    /*
        Filter items based on the search text separated by space. The filtering is case-insensitive.
        - basic text checks for displayName
        - # text checks for item.components content
        - @ text checks for mod (item.name.split(':')[0]) content
        - $ text checks for item type (item.isFluid, item.isChemical, item.isCraftable)
        - > text checks for item count greater than defined
        - < text checks for item count smaller than defined
        - = text checks for item count equal to defined

    */
    const searchTerms = searchText.toLowerCase().split(" ");
    return items.filter((item) => {
        return searchTerms.every(
            (term) => matchesItem(item, term)
        )
    }
    );
};