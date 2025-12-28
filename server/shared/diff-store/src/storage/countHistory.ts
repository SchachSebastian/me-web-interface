import { atom } from "nanostores";
import { CountHistory, CountHistoryUpdate } from "../types/CountHistory.js";
import CountHistoryElement from "../types/CountHistoryElement.js";
import { Item } from "../types/Item.js";

export const FIVE_MINUTES = 1000 * 60 * 5;
export const ONE_HOUR = 1000 * 60 * 60;
export const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;

export const $countHistory = atom<CountHistory[]>([]);

export const updateCountHistory = (
    updates: CountHistoryUpdate[],
    oldestValidTimestamp?: number
) => {
    if (updates === undefined || updates.length === 0) {
        return;
    }
    const new_history: CountHistory[] = [];
    updates.forEach((update) => {
        const old = $countHistory.get().find((old) => old.id === update.id);
        if (old) {
            new_history.push({
                id: update.id,
                history: [update.historyElement, ...old.history].filter(
                    (ele) =>
                        oldestValidTimestamp === undefined ||
                        ele.timestamp >= oldestValidTimestamp
                ),
            });
        } else {
            new_history.push({
                id: update.id,
                history: [update.historyElement],
            });
        }
    });
    $countHistory.get().forEach((old) => {
        if (!updates.find((update) => update.id === old.id)) {
            new_history.push(old);
        }
    });
    $countHistory.set(new_history);
};

export const calculateCountDelta = (
    id: Item["id"],
    from: number,
    to: number
) => {
    const history = $countHistory.get().find((history) => history.id === id);
    if (!history || history.history.length === 0) return undefined;
    let earliest: CountHistoryElement | null = null;
    let latest: CountHistoryElement | null = null;

    for (const ele of history.history) {
        if (
            ele.timestamp <= from &&
            (earliest === null || ele.timestamp > earliest.timestamp)
        ) {
            earliest = ele;
        }
        if (
            ele.timestamp >= to &&
            (latest === null || ele.timestamp < latest.timestamp)
        ) {
            latest = ele;
        }
    }
    if (!earliest || !latest || earliest.timestamp > latest.timestamp)
        return undefined;
    return (
        ((latest.count - earliest.count) /
            (latest.timestamp - earliest.timestamp)) *
        (to - from)
    );
};
