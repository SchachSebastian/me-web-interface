import { Item } from "diff-store/src/types/Item";
import { useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { AdditionalItemInfo } from "./additionalItemInfo/AdditionalItemInfo";

type Props = {
    item: Item;
    itemRef: React.RefObject<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement>;
};
export const ItemTooltip = (props: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);

    useLayoutEffect(() => {
        let top = 0;
        let left = 0;
        if (props.itemRef.current) {
            const containerRect =
                props.containerRef.current?.getBoundingClientRect();
            const containerMaxX =
                (containerRect?.width ?? 0) + (containerRect?.left ?? 0);
            const containerMaxY = (containerRect?.height ?? 0) + (containerRect?.top ?? 0);
            const tooltipRect = ref.current?.getBoundingClientRect();
            console.log("Tooltip rect", tooltipRect);
            const tooltipWidth = tooltipRect?.width ?? 0;
            const tooltipHeight = tooltipRect?.height ?? 0;
            const rect = props.itemRef.current.getBoundingClientRect();
            top = rect.bottom + window.scrollY;
            left = rect.left + window.scrollX;

            if (top + tooltipHeight > containerMaxY) {
                top -= top + tooltipHeight - containerMaxY;
            }
            if (left + tooltipWidth > containerMaxX) {
                left -= left + tooltipWidth - containerMaxX;
            }
        }
        setTop(top);
        setLeft(left);
    }, [props.itemRef.current]);

    const mod = props.item.name.split(":")[0].toLowerCase();
    return ReactDOM.createPortal(
        <div
            ref={ref}
            style={{
                top: top,
                left: left,
                zIndex: 9999,
                pointerEvents: "none",
                maxWidth: props.containerRef.current?.clientWidth,
            }}
            className="absolute"
        >
            <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded overflow-hidden border-4 border-[#250259]">
                <div className="text-white text-xl font-bold">
                    {props.item.displayName}
                </div>
                <div className="text-gray-300 font-mono text-sm">
                    Count: {props.item.count.toLocaleString()}
                </div>
                <div className="text-gray-400 font-mono text-sm mb-1">
                    {props.item.name}
                </div>
                {/* <div className="text-gray-400 font-mono text-sm mb-1">
                            {JSON.stringify(props.item.components, null, 2)}
                        </div>  */}
                <AdditionalItemInfo item={props.item} />
                <div className="text-blue-400 text-lg italic">{mod}</div>
                <div className="text-gray-400 font-mono text-xs">
                    {props.item.fingerprint}
                </div>
            </div>
        </div>,
        document.body
    );
};
