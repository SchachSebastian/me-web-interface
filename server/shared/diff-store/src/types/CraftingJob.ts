export type CraftingJobItem = {
    name: string;
    required: number;
    available: number;
};

export type CraftingJob = {
    id: string;
    quantity: number;
    resource: string;
    completion: number;
    crafted: number;
    status: 'done' | 'calculating' | 'crafting' | 'canceled' | 'error';
    elapsedTime: number;
    items: CraftingJobItem[];
    missingItems?: CraftingJobItem[];
};

export type CraftingJobUpdate = Partial<CraftingJob> & Pick<CraftingJob, "id">;
