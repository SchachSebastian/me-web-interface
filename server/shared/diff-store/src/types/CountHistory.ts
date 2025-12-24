import CountHistoryElement from "./CountHistoryElement.js";
import { Item } from "./Item.js";

export type CountHistory = {
    id: Item["id"];
    history: CountHistoryElement[];
}

export type CountHistoryUpdate = {
    id: CountHistory["id"];
    historyElement: CountHistoryElement;
};