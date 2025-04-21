import {
    calculateCountDelta,
    FIVE_MINUTES,
    ONE_HOUR,
    TWENTY_FOUR_HOURS,
} from "diff-store/src/storage/countHistory";
import { Item } from "diff-store/src/types/Item";

export const calcCountChange = (item: Item) => {
    const timestamp = Date.now();
    if (!item.fiveMinAgo) {
        return {
            delta5m: 0,
            delta1h: 0,
            delta24h: 0,
        };
    }
    const actualTimeDiff = timestamp - item.fiveMinAgo.timestamp;
    let fiveMinDelta = calculateCountDelta(
        item.id,
        timestamp - FIVE_MINUTES,
        timestamp
    );
    if (fiveMinDelta === undefined) {
        fiveMinDelta = Math.round(
            ((item.count - item.fiveMinAgo.count) / actualTimeDiff) *
                FIVE_MINUTES
        );
    }

    let oneHourDelta = 0;
    if (item.oneHourDelta) {
        oneHourDelta =
            (item.oneHourDelta / (ONE_HOUR - FIVE_MINUTES)) *
                (ONE_HOUR - actualTimeDiff) +
            (item.count - item.fiveMinAgo.count);
    }
    let twentyFourHourDelta = 0;
    if (item.twentyFourHourDelta) {
        twentyFourHourDelta =
            (item.twentyFourHourDelta / (TWENTY_FOUR_HOURS - FIVE_MINUTES)) *
                (TWENTY_FOUR_HOURS - actualTimeDiff) +
            (item.count - item.fiveMinAgo.count);
    }
    return {
        delta5m: fiveMinDelta,
        delta1h: oneHourDelta,
        delta24h: twentyFourHourDelta,
    };
};
