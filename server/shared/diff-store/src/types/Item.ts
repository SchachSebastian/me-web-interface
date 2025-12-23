import CountHistoryElement from "./CountHistoryElement.js";

export type Item = {
    id: string;
    name: string;
    displayName: string;
    count: number;
    fiveMinAgo?: CountHistoryElement;
    oneHourDelta?: number;
    twentyFourHourDelta?: number;
    components?: any;
    isCraftable: boolean;
    isFluid?: boolean;
    isChemical?: boolean;
};

export type ItemUpdate = Partial<Item> & Pick<Item, "id">;