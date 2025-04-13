import { Item } from "diff-store/src/types/Item";

const matchesItem = (item: Item, term: string) => {
    if (term.startsWith("#")) {
        if (!item.components) return false;
        return JSON.stringify(item.components).toLowerCase().includes(term.slice(1));
    } else if (term.startsWith("@")) {
        return item.name.split(":")[0].toLowerCase().includes(term.slice(1));
    } else if (term.startsWith("$")) {
        if ("item".startsWith(term.slice(1))) {
            return !item.isFluid && !item.isGas;
        }
        if ("fluid".startsWith(term.slice(1))) {
            return item.isFluid as boolean;
        }
        if ("gas".startsWith(term.slice(1))) {
            return item.isGas as boolean;
        }
        if ("craftable".startsWith(term.slice(1))) {
            return item.isCraftable as boolean;
        }
        return false;
    } else {
        return item.displayName.toLowerCase().includes(term);
    }
}
export const filterItems = (items: Item[], searchText: string) => {
    /*
        Filter items based on the search text separated by space. The filtering is case-insensitive.
        - basic text checks for displayName
        - # text checks for item.components content
        - @ text checks for mod (item.name.split(':')[0]) content

    */
    const searchTerms = searchText.toLowerCase().split(" ");
    return items.filter((item) => {
        return searchTerms.every(
            (term) => matchesItem(item, term)
        )
    }
    );
};