import {useState} from "react";
import {useMeItems} from "./requests/useMeItems";
import {ItemSquare} from "./components/ItemSquare";
import Dialog from "./components/Dialog";
import {Item} from "./types/Item";
import NumberInput from "./components/NumberInput";
import {useWebSocket} from "./WebsocketProvider";

function App() {
    const [searchText, setSearchText] = useState("");
    const [clickedItem, setClickedItem] = useState<Item>();
    const socket = useWebSocket();

    const {data: items, error,} = useMeItems();
    if (error) {
        console.error(error);
        return <div>Error fetching items</div>;
    }

    if (items === undefined) {
        console.error(error);
        return <div>Loading items</div>;
    }
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.displayName.toLowerCase().includes(searchText.toLowerCase())).toSorted((a, b) => b.amount - a.amount);


    const onCraftItem = (value:number) => {
        if (clickedItem?.isCraftable) {
            alert(`Crafting ${clickedItem.displayName}`);
            socket.send(JSON.stringify({
                type: "craft-item",
                data: {
                    item: clickedItem.name,
                    amount: value
                }
            }))
        }
    }

    return (
        <>
            <div className="bg-minecraft-bg bg-cover bg-center w-screen h-screen p-20">
                <div className="w-full h-full bg-[#c6c6c6] border-white border-8 rounded flex flex-col overflow-hidden p-5">
                    <div className="sticky top-0 flex justify-between items-center bg-[#c6c6c6] pb-5">
                        <span className="text-[#3e3e3e] text-4xl font-bold">Terminal</span>
                        <input type="text" value={searchText} onChange={event => setSearchText(event.target.value)} className="bg-[#8b8b8b] rounded px-3 py-1 text-white text-4xl "/>
                    </div>
                    <div
                        className="
                        flex-1 overflow-y-auto
                        [&::-webkit-scrollbar]:w-4
                        [&::-webkit-scrollbar-track]:bg-[#c6c6c6]
                        [&::-webkit-scrollbar-thumb]:bg-[#8b8b8b]
                        [&::-webkit-scrollbar-thumb]:border-2
                        [&::-webkit-scrollbar-thumb]:border-[#c6c6c6]"
                    >
                        <div
                            className="grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] gap-4 p-4"
                        >
                            {filteredItems.map((item, index) => (
                                <ItemSquare onClick={()=>setClickedItem(item)} item={item} key={item.name + index}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog isOpen={clickedItem!==undefined} title={clickedItem?.displayName + " produzieren"} onClose={()=>{setClickedItem(undefined)}}>
                <NumberInput onValueSubmit={onCraftItem}/>
            </Dialog>
        </>
    )
}

export default App
