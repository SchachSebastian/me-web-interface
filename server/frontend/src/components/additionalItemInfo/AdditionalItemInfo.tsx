import { Item } from "diff-store";
import { ReactNode } from "react";
import { ApotheosisItemInfo } from "./ApotheosisItemInfo";
import { DamageItemInfo } from "./DamageItemInfo";
import { EnchantmentItemInfo } from "./EnchantmentItemInfo";
import { ApotheosisGemInfo } from "./ApotheosisGemInfo";

type Props = {
    item: Item;
}

const itemInfos = [
    ApotheosisItemInfo,
    ApotheosisGemInfo,
    EnchantmentItemInfo,
    DamageItemInfo,
];
export const AdditionalItemInfo = (props: Props) => {
    if (!props.item.components) return <></>;
    const additionalInfo: ReactNode[] = [];
    itemInfos.forEach(ItemInfo => {
        additionalInfo.push(<ItemInfo key={ItemInfo.name} item={props.item}></ItemInfo>);
    });
    return additionalInfo;
}