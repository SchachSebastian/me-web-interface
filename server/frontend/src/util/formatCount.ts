import { Item } from "diff-store";


const prefixes = [{
    prefix: "",
    nextAt: 10_000,
},{
    prefix: "K",
    nextAt: 1_000,
},{
    prefix: "M",
    nextAt: 1_000,
},{
    prefix: "B",
    nextAt: 1_000,
}]
export const formatCount = (item: Item) => {
    let amount = item.count;
    let prefix = 0;
    while (prefix < prefixes.length-1 && amount >= prefixes[prefix].nextAt) {
        amount /= 1000.0;
        prefix++;
    }
    return `${Number(amount.toFixed(2)).toString()}${prefixes[prefix].prefix}`;
}
