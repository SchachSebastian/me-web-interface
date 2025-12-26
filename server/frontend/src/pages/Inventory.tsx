import { $items, Item } from "diff-store";
import { useRef, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { useWebSocket } from "../WebsocketProvider";
import Dialog from "../components/Dialog";
import HelpDialog from "../components/HelpDialog";
import ItemSquare from "../components/ItemSquare";
import { ItemTooltip } from "../components/ItemTooltip";
import NumberInput from "../components/NumberInput";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useQueryParam } from "../hooks/useQueryParam";
import useVirtuosoComponents from "../hooks/useVirtuosoComponents";
import { useMeItems } from "../requests/useMeItems";
import { useNetworkState } from "../requests/useNetworkState";
import { useResetMessage } from "../requests/useResetMessage";
import { filterItems } from "../util/filterItems";
import { useEscapeEffect } from "../hooks/useEscapeEffect";

export const Inventory = () => {
    const [searchText, setSearchText] = useQueryParam("search", "");
    useEscapeEffect(()=>setSearchText(""));
    const [clickedItem, setClickedItem] = useState<Item>();
    const [hoveredItemId, setHoveredItemId] = useState<Item["id"]>();
    const [hoveredItemRef, setHoveredItemRef] =
        useState<React.RefObject<HTMLDivElement>>();
    const [openHelp, setOpenHelp] = useState(false);
    const [craftingSecret, setCraftingSecret] = useLocalStorage<
        string | undefined
    >("craftingSecret", undefined);
    const socket = useWebSocket();

    const items = useMeItems();
    const state = useNetworkState();

    useResetMessage(() => $items.set([]));

    const ref = useRef<HTMLDivElement>(null);

    const gridComponents = useVirtuosoComponents();

    const filteredItems = filterItems(items, searchText ?? "").toSorted(
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
                        id: clickedItem.id,
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
            <div className="flex flex-wrap gap-4 items-center bg-[#c6c6c6] pb-5">
                {state.itemStorage ? (
                    <div className="pointer-events-none min-w-fit">
                        {"📦 "}
                        {(state.itemStorage * 100).toFixed(2)} %
                    </div>
                ) : (
                    <></>
                )}
                {state.fluidStorage ? (
                    <div className="pointer-events-none min-w-fit">
                        {"💧 "}
                        {(state.fluidStorage * 100).toFixed(2)} %
                    </div>
                ) : (
                    <></>
                )}
                {state.chemicalStorage ? (
                    <div className="pointer-events-none min-w-fit">
                        {"🧪 "}
                        {(state.chemicalStorage * 100).toFixed(2)} %
                    </div>
                ) : (
                    <></>
                )}
                {state.energyStorage ? (
                    <div className="pointer-events-none min-w-fit">
                        {"⚡ "}
                        {(state.energyStorage * 100).toFixed(2)} %
                    </div>
                ) : (
                    <></>
                )}
                <div className="relative grow flex justify-end">
                    <input
                        type="text"
                        value={searchText ?? ""}
                        onChange={(event) => setSearchText(event.target.value)}
                        className="bg-[#8b8b8b] rounded px-3 py-1 text-white text-4xl pr-10 w-full xl:max-w-3/5"
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black rounded-full border-no w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 transition"
                        onClick={() => setOpenHelp(true)}
                        title="Help"
                    >
                        ?
                    </button>
                </div>
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
                                    item: Item["id"] | undefined,
                                    ref?: React.RefObject<HTMLDivElement>
                                ) => {
                                    setHoveredItemId(item);
                                    setHoveredItemRef(ref);
                                }}
                                item={item}
                            />
                        );
                    }}
                />
            </div>
            <Dialog
                isOpen={clickedItem !== undefined}
                title={"Produce " + clickedItem?.displayName}
                onClose={() => {
                    setClickedItem(undefined);
                }}
            >
                <NumberInput onValueSubmit={onCraftItem} />
            </Dialog>
            <HelpDialog openHelp={openHelp} setOpenHelp={setOpenHelp} />
            {hoveredItemId && hoveredItemRef ? (
                <ItemTooltip
                    item={filteredItems.find((i) => i.id === hoveredItemId)!}
                    itemRef={hoveredItemRef}
                    containerRef={ref}
                />
            ) : null}
        </>
    );
};
