import { Item } from "diff-store/src/types/Item";

export type MinecraftItem = Omit<
    Item,
    "fiveMinAgo" | "oneHourDelta" | "twentyFourHourDelta"
>;

export type MinecraftItemUpdate = Partial<MinecraftItem> &
    Pick<MinecraftItem, "id">;
