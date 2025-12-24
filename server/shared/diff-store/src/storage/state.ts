import { atom } from "nanostores";
import { State } from "../types/State.js";

export const defaultState: State = {
    status: "server_disconnected",
};

export const $state = atom<State>(defaultState);
