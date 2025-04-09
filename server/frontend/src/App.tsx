import { $items } from "diff-store/src/storage/items";
import { Item } from "diff-store/src/types/Item";
import { useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import Dialog from "./components/Dialog";
import { ItemSquare } from "./components/ItemSquare";
import NumberInput from "./components/NumberInput";
import { useMeItems, useResetMessage } from "./requests/useMeItems";
import useVirtuosoComponents from "./useVirtuosoComponents";
import { filterItems } from "./util/filterItems";
import { useWebSocket } from "./WebsocketProvider";
import { useQueryParam } from "./hooks/useQueryParam";
import { ItemTooltip } from "./components/ItemTooltip";

function App() {
    const [searchText, setSearchText] = useQueryParam("search", "");
    const [clickedItem, setClickedItem] = useState<Item>();
    const [hoveredItem, setHoveredItem] = useState<Item>();
    const [hoveredItemRef, setHoveredItemRef] =
        useState<React.RefObject<HTMLDivElement>>();
    const socket = useWebSocket();

    const items = useMeItems();

    useResetMessage(() => $items.set([]));

    const gridComponents = useVirtuosoComponents();

    const filteredItems = filterItems(items, searchText??"").toSorted(
        (a, b) => b.count - a.count
    );

    console.log(filteredItems.length);
    const onCraftItem = (value: number) => {
        if (clickedItem?.isCraftable) {
            alert(`Crafting ${clickedItem.displayName}`);
            socket.send(
                JSON.stringify({
                    type: "craft-item",
                    data: {
                        fingerprint: clickedItem.fingerprint,
                        count: value,
                    },
                })
            );
        }
    };

    return (
        <>
            <div className="bg-minecraft-bg bg-cover bg-center w-full h-full p-[2%]">
                <div className="w-full h-full bg-[#c6c6c6] border-white border-8 rounded flex flex-col overflow-hidden p-5">
                    <div className="flex flex-wrap gap-4 justify-between items-center bg-[#c6c6c6] pb-5">
                        <button
                            className="text-[#3e3e3e] text-4xl font-bold"
                            onClick={() => setSearchText("")}
                        >
                            Terminal
                        </button>
                        <input
                            type="text"
                            value={searchText ?? ""}
                            onChange={(event) => {
                                console.log(event.target.value);
                                setSearchText(event.target.value);
                            }}
                            className="bg-[#8b8b8b] rounded px-3 py-1 text-white text-4xl min-w-10 max-w-4/12"
                        />
                    </div>
                    <div className="flex-1">
                        <VirtuosoGrid
                            computeItemKey={(index) => filteredItems[index].id}
                            totalCount={filteredItems.length}
                            components={gridComponents}
                            itemContent={(index) => {
                                const item = filteredItems[index];
                                return (
                                    <ItemSquare
                                        onClick={() => setClickedItem(item)}
                                        setHoveredItem={(
                                            item: Item | undefined,
                                            ref?: React.RefObject<HTMLDivElement>
                                        ) => {
                                            setHoveredItem(item);
                                            setHoveredItemRef(ref);
                                        }}
                                        item={item}
                                    />
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
            <Dialog
                isOpen={clickedItem !== undefined}
                title={clickedItem?.displayName + " produzieren"}
                onClose={() => {
                    setClickedItem(undefined);
                }}
            >
                <NumberInput onValueSubmit={onCraftItem} />
            </Dialog>
            {hoveredItem && hoveredItemRef ? (
                <ItemTooltip item={hoveredItem} itemRef={hoveredItemRef} />
            ) : null}
        </>
    );
}

export default App;
