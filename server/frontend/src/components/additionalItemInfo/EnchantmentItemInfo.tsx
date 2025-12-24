import { Item } from "diff-store";
import { getRomanNumber } from "../../util/getRomanNumber";

type Props = {
    item: Item;
};
export const EnchantmentItemInfo = (props: Props) => {
    const components = props.item.components;
    const keys = Object.keys(components);
    let enchantments = components["minecraft:enchantments"]?.["levels"];
    if (!enchantments) {
        enchantments = components["minecraft:stored_enchantments"]?.["levels"];
    }
    if (!enchantments) return <></>;
    return (
        <>
            {Object.keys(enchantments).map((enchantment) => {
                const level = enchantments[enchantment];
                return (
                    <div
                        key={enchantment + ""}
                        className={
                            "text-[#00b1fc] font-mono text-sm font-bold mb-1"
                        }
                    >
                        {enchantment + ""} {getRomanNumber(level)}
                    </div>
                );
            })}
        </>
    );
};
