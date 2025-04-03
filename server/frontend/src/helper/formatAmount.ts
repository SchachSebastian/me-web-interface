import { Item } from "diff-store/src/types/Item";


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
export const formatAmount = (item: Item) => {
    let amount = item.count;
    let prefix = 0;
    while(amount >= prefixes[prefix].nextAt && prefix < prefixes.length) {
        amount /= 1000.0;
        prefix++;
    }
    return `${Number(amount.toFixed(2)).toString()}${prefixes[prefix].prefix}`;
}
