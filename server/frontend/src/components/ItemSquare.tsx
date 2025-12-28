import { $items, Item } from "diff-store";
import { useMemo, useRef, useState } from "react";
import { withErrorBoundary } from "react-error-boundary";
import { formatCount } from "../util/formatCount";
import { getItemImagePath, MissingImage } from "../util/getItemImagePath";
import { hasEnchantmentEffect } from "../util/hasEnchantmentEffect";
import { useNotifications } from "../NotificationProvider";
import { useErrorMessage } from "../requests/useErrorMessage";

interface Props {
    item: Item;
    onClick?: () => void;
    setHoveredItem?: (
        item: Item["id"] | undefined,
        ref?: React.RefObject<HTMLDivElement>
    ) => void;
    style?: React.CSSProperties;
}
const hoverDelay = 100; // milliseconds

const ItemSquare = (props: Props) => {
    if (props.item.count === -1) {
        console.warn(
            "Rendering item with count -1:",
            $items.get().find((item) => item.id === props.item.id)
        );
    }
    const { addNotification } = useNotifications();
    const [useFallbackImage, setUseFallbackImage] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const handleClick = (event: React.MouseEvent) => {
        if (event.shiftKey) {
            const toCopy = {
                displayName: props.item.displayName,
                name: props.item.name,
                count: props.item.count,
                isCraftable: props.item.isCraftable,
                isFluid: props.item.isFluid,
                isChemical: props.item.isChemical,
                components: props.item.components,
                id: props.item.id,
            };
            navigator.clipboard.writeText(JSON.stringify(toCopy, null, 2));
            addNotification({
                header: "Item Copied",
                message: `Copied item ${props.item.displayName} to clipboard`,
                status: "success",
            });
        } else if (props.onClick && props.item.isCraftable) {
            props.onClick();
        }
    };

    const handlePointerEnter = () => {
        timeoutRef.current = setTimeout(() => {
            if (props.setHoveredItem) {
                props.setHoveredItem(props.item.id, ref);
            }
        }, hoverDelay);
    };
    const handlePointerLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (props.setHoveredItem) {
            props.setHoveredItem(undefined);
        }
    };

    const handleImageUnavailable = useFallbackImage
        ? undefined
        : () => setUseFallbackImage(true);
    let imageSrc = useMemo(() => getItemImagePath(props.item), [props.item]);
    if (useFallbackImage) imageSrc = MissingImage;
    return (
        <div
            style={{
                ...props.style,
            }}
            className="flex-grow relative inline-block"
            onClick={handleClick}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            ref={ref}
        >
            <div className="relative select-none cursor-pointer bg-[#8b8b8b] aspect-square p-1 overflow-hidden">
                <div className="absolute bottom-1 right-2 z-10 text-white font-bold text-2xl">
                    {formatCount(props.item)}
                </div>
                <div className="absolute top-0 right-2 z-10 text-white font-bold text-3xl">
                    {props.item.isCraftable ? "+" : ""}
                </div>
                <div className="overflow-hidden w-full aspect-square relative">
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
                    {hasEnchantmentEffect(props.item) ? (
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
