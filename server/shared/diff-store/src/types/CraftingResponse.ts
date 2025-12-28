export type CraftingResponse = {
    id: string;
    count: number;
    status: "success" | "failed" | "calculation_failed";
    debugMessage?: string;
};