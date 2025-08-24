import { Item } from "diff-store";
import { ReactNode } from "react";

type Props = {
    item: Item;
}
export const ApotheosisItemInfo = (props: Props) => {
    const components = props.item.components;
    const keys = Object.keys(components);
    if (keys.includes("apotheosis:rarity")) {
        const rarity = components["apotheosis:rarity"];
        const color = components["apotheosis:affix_name"]["color"] ?? "black";
        return (
            <div
                style={{
                    color: color,
                }}
                className={"font-mono text-sm mb-1"}
            >
                {rarity}
            </div>
        );
    }
    return <></>;

}