import { Item } from "diff-store/src/types/Item";
import { useEffect, useRef, useState } from "react";
import { formatCount } from "../helper/formatCount";
import { isEnchantedItem } from "../util/isEnchantedItem";
import { withErrorBoundary } from "react-error-boundary";

interface Props {
    item: Item;
    onClick?: () => void;
    setHoveredItem?: (
        item: Item | undefined,
        ref?: React.RefObject<HTMLDivElement>
    ) => void;
    style?: React.CSSProperties;
}
const hoverDelay = 100; // milliseconds

const ItemSquare = (props: Props) => {
    if (props.item.displayName === undefined) {
        console.error("Item has no display name", JSON.stringify(props.item));
    }
    const [useFallbackImage, setUseFallbackImage] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const handleClick = () => {
        if (props.onClick && props.item.isCraftable && false) {
            props.onClick();
        }
    };

    const handlePointerEnter = () => {
        timeoutRef.current = setTimeout(() => {
            if (props.setHoveredItem) {
                props.setHoveredItem(props.item, ref);
            }
        }, hoverDelay);
    };
    const handlePointerLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (props.setHoveredItem) {
            props.setHoveredItem(undefined);
        }
    };

    useEffect(() => {
        return () => {
            if (props.setHoveredItem) {
                props.setHoveredItem(undefined);
            }
        };
    }, []);

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
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            ref={ref}
        >
            <div className="relative cursor-pointer bg-[#8b8b8b] aspect-square overflow-hidden">
                <div className="absolute bottom-1 right-2 z-10 text-white font-bold text-2xl">
                    {formatCount(props.item)}
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
                        alt={props.item.displayName}
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
                                />
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withErrorBoundary(ItemSquare, {
    fallback: <div>Error loading item</div>,
    onError: (error, info) => {
        console.error("Error in ItemSquare:", error, info);
    },
});