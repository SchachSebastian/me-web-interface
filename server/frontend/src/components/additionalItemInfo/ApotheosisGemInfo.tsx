import { Item } from "diff-store";
import "../../css/rainbow.css";
import { getColor } from "../../util/apotheosis/getColor";

type Props = {
    item: Item;
}

export const ApotheosisGemInfo = (props: Props) => {
    const components = props.item.components;
    const keys = Object.keys(components);
    if (keys.includes("apotheosis:purity")) {
        const purity = components["apotheosis:purity"];
        const rainbowClass = purity === "perfect" ? "rainbow-gradient" : "";
        return (
            <div
                style={{
                    color: getColor(purity),
                }}
                className={"font-mono text-sm mb-1 " + rainbowClass}
            >
                {purity}
            </div>
        );
    }
    return <></>;
}