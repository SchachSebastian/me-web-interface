import { ItemUpdate } from "shared/diff-store/src/types/Item";

export type MinecraftItem = Omit<ItemUpdate, "countHistory">