import { Item } from "diff-store";
import { useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { calcCountChange } from "../util/calcCountChange";
import { AdditionalItemInfo } from "./additionalItemInfo/AdditionalItemInfo";
import { TooltipTitle } from "./tooltipTitle/TooltipTitle";

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
            const containerMaxX = containerRect?.right ?? 0;
            const containerMaxY = containerRect?.bottom ?? 0;
            const tooltipRect = ref.current?.getBoundingClientRect();
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

    if (props.item == undefined) {
        return <></>;
    }

    const mod = props.item.name.split(":")[0].toLowerCase();
    const { delta5m, delta1h, delta24h} = calcCountChange(props.item);
    return ReactDOM.createPortal(
        <div
            ref={ref}
            style={{
                top: top,
                left: left,
                zIndex: 100,
                pointerEvents: "none",
                maxWidth: props.containerRef.current?.clientWidth,
            }}
            className="absolute"
        >
            <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded overflow-hidden border-4 border-[#250259]">
                <TooltipTitle item={props.item} />
                <div className="text-gray-300 font-mono text-sm">
                    Count: {props.item.count.toLocaleString()}
                </div>
                {delta5m ? (
                    <div className="text-gray-300 font-mono text-sm">
                        {"5min "}
                        {delta5m >= 0 ? (
                            <span className="text-green-600 font-extrabold">
                                ↑
                            </span>
                        ) : (
                            <span className="text-red-600 font-extrabold">
                                ↓
                            </span>
                        )}
                        {": "}
                        {Math.round(delta5m).toLocaleString()}
                    </div>
                ) : (
                    <></>
                )}
                {delta1h ? (
                    <div className="text-gray-300 font-mono text-sm">
                        {"1h "}
                        {delta1h >= 0 ? (
                            <span className="text-green-600 font-extrabold">
                                ↑
                            </span>
                        ) : (
                            <span className="text-red-600 font-extrabold">
                                ↓
                            </span>
                        )}
                        {": "}
                        {Math.round(delta1h).toLocaleString()}
                    </div>
                ) : (
                    <></>
                )}
                {delta24h ? (
                    <div className="text-gray-300 font-mono text-sm">
                        {"24h "}
                        {delta24h >= 0 ? (
                            <span className="text-green-600 font-extrabold">
                                ↑
                            </span>
                        ) : (
                            <span className="text-red-600 font-extrabold">
                                ↓
                            </span>
                        )}
                        {": "}
                        {Math.round(delta24h).toLocaleString()}
                    </div>
                ) : (
                    <></>
                )}
                <div className="text-gray-400 font-mono text-sm mb-1">
                    {props.item.name}
                </div>
                <AdditionalItemInfo item={props.item} />
                <div className="text-blue-400 text-lg italic">{mod}</div>
                <div className="text-gray-400 font-mono text-xs">
                    {props.item.id}
                </div>
            </div>
        </div>,
        document.body
    );
};
