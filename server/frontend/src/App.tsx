import { $items } from "diff-store/src/storage/items";
import { Item } from "diff-store/src/types/Item";
import { useRef, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import Dialog from "./components/Dialog";
import ItemSquare from "./components/ItemSquare";
import { ItemTooltip } from "./components/ItemTooltip";
import { NotificationArea } from "./components/NotificationArea";
import NumberInput from "./components/NumberInput";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useQueryParam } from "./hooks/useQueryParam";
import { useMeItems, useResetMessage } from "./requests/useMeItems";
import useVirtuosoComponents from "./useVirtuosoComponents";
import { filterItems } from "./util/filterItems";
import { useWebSocket } from "./WebsocketProvider";

function App() {
    const [searchText, setSearchText] = useQueryParam("search", "");
    const [clickedItem, setClickedItem] = useState<Item>();
    const [hoveredItem, setHoveredItem] = useState<Item>();
    const [hoveredItemRef, setHoveredItemRef] =
        useState<React.RefObject<HTMLDivElement>>();
    const [openHelp, setOpenHelp] = useState(false);
    const [craftingSecret, setCraftingSecret] = useLocalStorage<
        string | undefined
    >("craftingSecret", undefined);
    const socket = useWebSocket();

    const items = useMeItems();

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
                        <div className="relative w-fit max-w-4/12">
                            <input
                                type="text"
                                value={searchText ?? ""}
                                onChange={(event) =>
                                    setSearchText(event.target.value)
                                }
                                className="bg-[#8b8b8b] rounded px-3 py-1 text-white text-4xl pr-10 w-full"
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 transition"
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
                title={"Produce " + clickedItem?.displayName}
                onClose={() => {
                    setClickedItem(undefined);
                }}
            >
                <NumberInput onValueSubmit={onCraftItem} />
            </Dialog>
            <Dialog
                isOpen={openHelp}
                title={"🔍 How Filtering Works"}
                onClose={() => {
                    setOpenHelp(false);
                }}
            >
                <div className="text-black text-base space-y-4">
                    <p>
                        You can filter items by typing search terms into the
                        input field. Filters are{" "}
                        <strong>case-insensitive</strong> and can be combined by
                        separating them with spaces.
                    </p>

                    <div>
                        <h3 className="font-semibold">🧠 Basic Filtering</h3>
                        <p>
                            <strong>Text only</strong> → Matches against the
                            item's <code>displayName</code>.<br />
                            <em>Example:</em> <code>iron</code> finds items like{" "}
                            Iron Ingot, Iron Ore, etc.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">#️⃣ NBT Filtering</h3>
                        <p>
                            <strong>
                                <code>#</code> prefix
                            </strong>{" "}
                            → Searches inside the item's nbt data.
                            <br />
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">🧩 Mod Filtering</h3>
                        <p>
                            <strong>
                                <code>@</code> prefix
                            </strong>{" "}
                            → Filters by the mod name.
                            <br />
                            <em>Example:</em> <code>@mekanism</code> shows items
                            from the Mekanism mod.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">🏷️ Type Filtering</h3>
                        <p>
                            <strong>
                                <code>$</code> prefix
                            </strong>{" "}
                            → Filters by type:
                        </p>
                        <ul className="list-disc list-inside ml-4">
                            <li>
                                <code>$item</code> – only shows items
                            </li>
                            <li>
                                <code>$fluid</code> – only fluids
                            </li>
                            <li>
                                <code>$gas</code> – only gases
                            </li>
                            <li>
                                <code>$craftable</code> – only craftable items
                            </li>
                            <li>
                                <code>$enchanted</code> – only enchanted items
                            </li>
                        </ul>
                        <p>
                            <em>Example:</em> <code>$craftable</code> shows all
                            items that can be crafted.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">🔢 Count Comparison</h3>
                        <p>
                            You can filter based on the{" "}
                            <strong>item count</strong>:
                        </p>
                        <ul className="list-disc list-inside ml-4">
                            <li>
                                <code>&gt;10</code> → Count greater than 10
                            </li>
                            <li>
                                <code>&lt;5</code> → Count less than 5
                            </li>
                            <li>
                                <code>=64</code> → Count exactly 64
                            </li>
                        </ul>
                    </div>
                </div>
            </Dialog>
            {hoveredItem && hoveredItemRef ? (
                <ItemTooltip
                    item={hoveredItem}
                    itemRef={hoveredItemRef}
                    containerRef={ref}
                />
            ) : null}
            <NotificationArea />
        </>
    );
}

export default App;
