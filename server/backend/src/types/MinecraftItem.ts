import { Item } from "diff-store";

export type MinecraftItem = Omit<
    Item,
    "fiveMinAgo" | "oneHourDelta" | "twentyFourHourDelta"
>;

export type MinecraftItemUpdate = Partial<MinecraftItem> &
    Pick<MinecraftItem, "id">;
