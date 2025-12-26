import {
    calculateCountDelta,
    FIVE_MINUTES,
    ONE_HOUR,
    TWENTY_FOUR_HOURS,
    updateCountHistory,
} from "diff-store";
import { $items, updateItemStorage } from "diff-store";
import { CountHistoryUpdate } from "diff-store";
import { ItemUpdate } from "diff-store";
import { sendClientMessage } from "../clientWs";
import chunkArray from "../util/chunkArray";

const updateCountHistoryInterval = () =>
    setInterval(() => {
        if ($items.get().length === 0) {
            console.log("Skipping countHistory update: no items available");
            return;
        }
        console.log("Updating countHistory");
        const timestamp = Date.now();
        const updates: CountHistoryUpdate[] = [];
        $items.get().forEach((item) => {
            updates.push({
                id: item.id,
                historyElement: {
                    count: item.count,
                    timestamp: timestamp,
                },
            });
        });
        updateCountHistory(
            updates,
            timestamp - TWENTY_FOUR_HOURS + FIVE_MINUTES
        );
        setTimeout(() => {
            const actualUpdates: ItemUpdate[] = [];
            const updateMap = new Map(
                updates.map((u) => [u.id, u])
            );
            for (const item of $items.get()) {
                const update = updateMap.get(item.id);
                if (!update) continue;
                actualUpdates.push({
                    id: item.id,
                    fiveMinAgo: update.historyElement,
                    oneHourDelta: calculateCountDelta(
                        item.id,
                        update.historyElement.timestamp - ONE_HOUR,
                        update.historyElement.timestamp
                    ),
                    twentyFourHourDelta: calculateCountDelta(
                        item.id,
                        update.historyElement.timestamp - TWENTY_FOUR_HOURS,
                        update.historyElement.timestamp
                    ),
                });
            }
            chunkArray(actualUpdates, 100).forEach((chunk) => {
                sendClientMessage({
                    type: "inventory-update",
                    data: chunk,
                });
            });
            updateItemStorage(actualUpdates);
        }, FIVE_MINUTES);
    }, FIVE_MINUTES);

export default updateCountHistoryInterval;
