import {useEffect, useState} from "react";
import {Item} from "./types/Item";
import axios from "axios";

function App() {
    const [searchText, setSearchText] = useState("");

    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/items").then((response) => {
            setItems(response.data);
        })
    }, []);

    return (
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
                        {items.sort((a,b) =>  b.amount - a.amount).map(item => (
                            <div
                                key={item.id}
                                className="bg-[#8b8b8b] aspect-square"
                            >{item.displayName} {item.amount}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
