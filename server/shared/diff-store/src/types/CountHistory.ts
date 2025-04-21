import CountHistoryElement from "./CountHistoryElement";
import { Item } from "./Item"

export type CountHistory = {
    id: Item["id"];
    history: CountHistoryElement[];
}

export type CountHistoryUpdate = {
    id: CountHistory["id"];
    historyElement: CountHistoryElement;
};