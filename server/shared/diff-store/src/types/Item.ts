import CountHistoryElement from "./CountHistoryElement";

export type Item = {
    id: string;
    name: string;
    displayName: string;
    count: number;
    fiveMinAgo?: CountHistoryElement;
    oneHourDelta?: number;
    twentyFourHourDelta?: number;
    fingerprint?: string;
    components?: any;
    isCraftable: boolean;
    isFluid?: boolean;
    isGas?: boolean;
};

export type ItemUpdate = Partial<Item> & Pick<Item, "id">;