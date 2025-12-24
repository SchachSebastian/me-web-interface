import { Item } from "diff-store";
import "../../css/rainbow.css";
import { getColor } from "../../util/apotheosis/getColor";

type Props = {
    item: Item;
};

export const TooltipTitle = (props: Props) => {
    let className = "";
    let style = {};
    const components = props.item.components;
    if (components !== undefined) {
        const keys = Object.keys(components);
        if (keys.includes("apotheosis:purity")) {
            const purity = components["apotheosis:purity"];
            style = {
                ...style,
                color: getColor(purity),
            };
            const rainbowClass = purity === "perfect" ? "rainbow-gradient" : "";
            className += " " + rainbowClass;
        }
        if (keys.includes("apotheosis:affix_name")) {
            const color =
                components["apotheosis:affix_name"]["color"] ?? "black";
            style = {
                ...style,
                color: color,
            };
        }
    }
    return (
        <div style={style} className={"text-white text-xl font-bold " + className}>
            {props.item.displayName}
        </div>
    );
};
