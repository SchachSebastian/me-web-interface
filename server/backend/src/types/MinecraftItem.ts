import { ItemUpdate } from "diff-store/src/types/Item";

export type MinecraftItem = Omit<ItemUpdate, "countHistory">