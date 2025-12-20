import { atom } from "nanostores";
import { State } from "../types/State.js";

export const defaultState: State = {
    itemStorage: NaN,
    fluidStorage: NaN,
    chemicalStorage: NaN,
    energyStorage: NaN,
    status: "minecraft_disconnected",
};

export const $state = atom<State>(defaultState);
