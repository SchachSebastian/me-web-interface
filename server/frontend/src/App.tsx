import { $items } from "diff-store/src/storage/items";
import { Item } from "diff-store/src/types/Item";
import { useRef, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import Dialog from "./components/Dialog";
import NumberInput from "./components/NumberInput";
import { useMeItems, useResetMessage } from "./requests/useMeItems";
import useVirtuosoComponents from "./useVirtuosoComponents";
import { filterItems } from "./util/filterItems";
import { useWebSocket } from "./WebsocketProvider";
import { useQueryParam } from "./hooks/useQueryParam";
import { ItemTooltip } from "./components/ItemTooltip";
import ItemSquare from "./components/ItemSquare";
import { NotificationArea } from "./components/NotificationArea";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
    const [searchText, setSearchText] = useQueryParam("search", "");
    const [clickedItem, setClickedItem] = useState<Item>();
    const [hoveredItem, setHoveredItem] = useState<Item>();
    const [hoveredItemRef, setHoveredItemRef] =
        useState<React.RefObject<HTMLDivElement>>();
    const [craftingSecret, setCraftingSecret] = useLocalStorage<string|undefined>("craftingSecret",undefined);
    const socket = useWebSocket();

    const items = useMeItems();

    useResetMessage(() => $items.set([]));

    const ref = useRef<HTMLDivElement>(null);

    const gridComponents = useVirtuosoComponents();

    const filteredItems = filterItems(items, searchText??"").toSorted(
        (a, b) => b.count - a.count
    );

    const onCraftItem = (value: number) => {
        let secret = craftingSecret;
        if (craftingSecret === undefined) {
            const result = window.prompt("Enter crafting secret:");
            if (result === null) {
                return;
            }
            secret = result;
            setCraftingSecret(result);
        }
        if (clickedItem?.isCraftable) {
            socket.send(
                JSON.stringify({
                    type: "crafting-request",
                    data: {
                        fingerprint: clickedItem.fingerprint,
                        count: value,
                        secret: secret,
                    },
                })
            );
        }
        setClickedItem(undefined);
    };

    return (
        <>
            <div className="bg-minecraft-bg bg-cover bg-center w-full h-full p-[2%]">
                <div className="w-full h-full bg-[#c6c6c6] border-white border-8 rounded flex flex-col overflow-hidden p-5">
                    <div className="flex flex-wrap gap-4 justify-between items-center bg-[#c6c6c6] pb-5">
                        <div
                            className="text-[#3e3e3e] text-4xl font-bold hover:cursor-pointer"
                            onClick={() => setSearchText("")}
                        >
                            Terminal
                        </div>
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
                    <div className="flex-1" ref={ref}>
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
                <ItemTooltip item={hoveredItem} itemRef={hoveredItemRef} containerRef={ref}/>
            ) : null}
            <NotificationArea/>
        </>
    );
}

export default App;
