import { NotificationArea } from "./components/NotificationArea";
import { StatusBadge } from "./components/StatusBadge";
import { usePath } from "./hooks/usePath";
import { Inventory } from "./pages/Inventory";

function App() {
    const [openPage, setOpenPage] = usePath();

    return (
        <>
            <div className="bg-minecraft-bg bg-cover bg-center w-full h-full p-[2%] flex flex-col">
                <div className="flex flex-row justify-between items-end">
                    <div
                        className="flex flex-wrap items-baseline"
                        style={{
                            marginBottom: "-8px",
                        }}
                    >
                        <div
                            className={
                                "bg-[#c6c6c6] rounded-t border-white border-b-0 border-8 p-2 text-[#3e3e3e] text-4xl font-bold hover:cursor-pointer " +
                                (openPage === "/" ? "z-1" : "pb-4")
                            }
                            onClick={() => {
                                setOpenPage("/");
                            }}
                        >
                            <img
                                className={openPage === "/" ? "h-15" : "h-10"}
                                src="/wireless_terminal.webp"
                            ></img>
                        </div>
                        <div
                            className={
                                "bg-[#c6c6c6] rounded-t border-white border-b-0 border-8 p-2 text-[#3e3e3e] text-4xl font-bold hover:cursor-pointer " +
                                (openPage === "/crafting" ? "z-1" : "pb-4")
                            }
                            style={{
                                marginLeft: "-8px",
                            }}
                            onClick={() => setOpenPage("/crafting")}
                        >
                            <img
                                className={
                                    openPage === "/crafting" ? "h-15" : "h-10"
                                }
                                src="/crafting_table.webp"
                            ></img>
                        </div>
                    </div>
                    <div
                        style={{
                            marginBottom: "-8px",
                            zIndex: 1,
                        }}
                    >
                        <StatusBadge />
                    </div>
                </div>
                <div className="w-full flex-grow bg-[#c6c6c6] border-white border-8 rounded rounded-tl-none flex flex-col overflow-hidden p-5">
                    {openPage === "/" ? <Inventory /> : <></>}
                    {openPage === "/crafting" ? <></> : <></>}
                </div>
            </div>
            <NotificationArea />
        </>
    );
}

export default App;
