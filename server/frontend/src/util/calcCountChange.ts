import { Item } from "diff-store/src/types/Item";

export const calcCountChange = (item: Item, lookbackTimeInMs: number) => {
    if (item.countHistory.length === 0) return null;
    const currentTimestamp = Date.now();

    const lookbackTimestamp = currentTimestamp - lookbackTimeInMs;
    let index = 0;
    while (
        index < item.countHistory.length &&
        item.countHistory[index].timestamp > lookbackTimestamp
    ) {
        index++;
    }
    if (index === item.countHistory.length) return null;
    const earliestCountHistoryElement = item.countHistory[index];
    const earliestCount = earliestCountHistoryElement.count;
    const actualTimeDiff =
        currentTimestamp - earliestCountHistoryElement.timestamp;
    return ((item.count - earliestCount) / actualTimeDiff) * lookbackTimeInMs;
};
