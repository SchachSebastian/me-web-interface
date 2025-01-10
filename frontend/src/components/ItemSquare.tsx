import {Item} from "../types/Item";
import {formatAmount} from "../helper/formatAmount";
import ReactDOM from "react-dom";
import {useRef, useState} from "react";

interface Props {
    item: Item;
    onClick?: () => void;
}

export const ItemSquare = (props: Props) => {
    const mod = props.item.id.split(":")[0].toLowerCase();
    const [mouseHover, setMouseHover] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const handleClick = () => {
        if (props.onClick && props.item.craftable) {
            props.onClick();
        }
    }
    let top = 0
    let left = 0
    if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        top = rect.bottom + window.scrollY;
        left = rect.left + window.scrollX;
    }
    return (
        <div className="relative inline-block" onClick={handleClick} onMouseEnter={() => setMouseHover(true)}
             onMouseLeave={() => setMouseHover(false)} ref={ref}>
            <div
                className="relative cursor-pointer bg-[#8b8b8b] aspect-square overflow-hidden"
            >
                <div className="absolute bottom-1 right-2 z-10 text-white font-bold text-2xl">
                    {formatAmount(props.item)}
                </div>
                <div className="absolute top-0 right-2 z-10 text-white font-bold text-3xl">
                    {props.item.craftable ? "+" : ""}
                </div>
                <div className="overflow-hidden h-full w-full p-1 relative">
                    <img style={{
                        imageRendering: "pixelated"
                    }} className="object-cover w-full h-auto" src={"/assets/" + props.item.id.replace(":", "/") + ".png"} alt={props.item.displayName}/>
                </div>
            </div>
            {ReactDOM.createPortal(<div style={{
                top: top,
                left: left,
                zIndex: 9999
            }} className={"absolute " + (mouseHover?"":"hidden")}>
                <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded border-4 border-[#250259]">
                    <div className="text-white text-xl font-bold mb-1 tr">
                        {props.item.displayName}
                    </div>
                    <div className="text-gray-400 font-mono text-sm mb-1">
                        {props.item.id}
                    </div>
                    <div className="text-blue-400 text-lg italic">
                        {mod}
                    </div>
                </div>
            </div>, document.body)}
        </div>
    );
}
