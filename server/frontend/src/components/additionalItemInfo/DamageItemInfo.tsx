import { Item } from "diff-store";
import { ReactNode } from "react";

type Props = {
    item: Item;
}
export const DamageItemInfo = (props: Props) => {
    const components = props.item.components;
    const keys = Object.keys(components);
    if (keys.includes("minecraft:damage")) {
        const damage = components["minecraft:damage"];
        return (
            <div
                className={"text-red-600 font-mono text-sm mb-1"}
            >
                Damage: {damage}
            </div>
        );
    }
    return <></>;

}