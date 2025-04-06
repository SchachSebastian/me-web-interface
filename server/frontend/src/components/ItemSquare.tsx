import { isEnchantedItem } from "../util/isEnchantedItem";
import { Item } from "diff-store/src/types/Item";
import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { formatAmount } from "../helper/formatAmount";
import { AdditionalItemInfo } from "./additionalItemInfo/AdditionalItemInfo";

interface Props {
    item: Item;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const ItemSquare = (props: Props) => {
    const mod = props.item.name.split(":")[0].toLowerCase();
    const [mouseHover, setMouseHover] = useState(false);
    const [useFallbackImage, setUseFallbackImage] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const handleClick = () => {
        if (props.onClick && props.item.isCraftable && false) {
            props.onClick();
        }
    };
    let top = 0;
    let left = 0;
    if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        top = rect.bottom + window.scrollY;
        left = rect.left + window.scrollX;
    }
    let displayName = props.item.displayName.trim();
    if (displayName.startsWith("[")) displayName = displayName.substring(1);
    if (displayName.endsWith("]"))
        displayName = displayName.substring(0, displayName.length - 1);

    const handleImageUnavailable = useFallbackImage
        ? undefined
        : () => setUseFallbackImage(true);
    let imageSrc = "/assets/" + props.item.name.replace(":", "/") + ".png";
    if (useFallbackImage) imageSrc = "/missingItem.webp";
    return (
        <div
            style={props.style}
            className="flex-grow relative inline-block"
            onClick={handleClick}
            onPointerEnter={() => setMouseHover(true)}
            onPointerLeave={() => setMouseHover(false)}
            ref={ref}
        >
            <div className="relative cursor-pointer bg-[#8b8b8b] aspect-square overflow-hidden">
                <div className="absolute bottom-1 right-2 z-10 text-white font-bold text-2xl">
                    {formatAmount(props.item)}
                </div>
                <div className="absolute top-0 right-2 z-10 text-white font-bold text-3xl">
                    {props.item.isCraftable ? "+" : ""}
                </div>
                <div className="overflow-hidden h-full w-full p-1 relative">
                    <img
                        style={{
                            imageRendering: "pixelated",
                            pointerEvents: "none",
                        }}
                        className="object-cover w-full h-auto"
                        onError={handleImageUnavailable}
                        src={imageSrc}
                        alt={displayName}
                    />
                    {isEnchantedItem(props.item) ? (
                        <>
                            <div
                                style={{
                                    pointerEvents: "none",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    maskImage: `url(${imageSrc})`,
                                    maskSize: "cover",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    style={{
                                        imageRendering: "pixelated",
                                        rotate: "-45deg",
                                        scale: "5",
                                        aspectRatio: 1,
                                        filter: "sepia(100%) hue-rotate(250deg) contrast(150%)",
                                        animation:
                                            "dropDown 8s infinite alternate ease-in-out",
                                        position: "absolute",
                                        opacity: "0.3",
                                    }}
                                    src="glint.png"
                                    alt={displayName}
                                />
                            </div>
                            <style>
                                {`
          @keyframes dropDown {
            from {
              transform: translate(20%, 0%);
            }
            to {
              transform: translate(-20%,0%);
            }
          }
        `}
                            </style>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {ReactDOM.createPortal(
                <div
                    style={{
                        top: top,
                        left: left,
                        zIndex: 9999,
                        pointerEvents: "none",
                    }}
                    className={"absolute " + (mouseHover ? "" : "hidden")}
                >
                    <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded border-4 border-[#250259]">
                        <div className="text-white text-xl font-bold mb-1 tr">
                            {displayName}
                        </div>
                        <div className="text-gray-400 font-mono text-sm mb-1">
                            {props.item.name}
                        </div>
                        {/* <div className="text-gray-400 font-mono text-sm mb-1">
                            {JSON.stringify(props.item.components, null, 2)}
                        </div>  */}
                        <AdditionalItemInfo item={props.item} />
                        <div className="text-blue-400 text-lg italic">
                            {mod}
                        </div>
                        <div className="text-gray-400 font-mono text-xs mb-1">
                            {props.item.fingerprint}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
