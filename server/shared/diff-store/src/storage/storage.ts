import { atom } from "nanostores";
import { Storage } from "../types/Storage";

export const $storage = atom<Storage>({
    item: {
        total: 0,
        used: 0,
    },
    fluid: {
        total: 0,
        used: 0,
    },
});
