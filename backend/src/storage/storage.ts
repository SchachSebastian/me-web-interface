import { atom } from "nanostores";
import { Item } from "../types/Item";

export const items = atom<Item[]>([]);
