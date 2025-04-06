import { Item } from "diff-store/src/types/Item";
import { ReactNode } from "react";
import { ApotheosisItemInfo } from "./ApotheosisItemInfo";
import { DamageItemInfo } from "./DamageItemInfo";
import { EnchantmentItemInfo } from "./EnchantmentItemInfo";

type Props = {
    item: Item;
}

const itemInfos = [ApotheosisItemInfo, EnchantmentItemInfo, DamageItemInfo];
export const AdditionalItemInfo = (props: Props) => {
    if (!props.item.components) return <></>;
    const additionalInfo: ReactNode[] = [];
    itemInfos.forEach(ItemInfo => {
        additionalInfo.push(<ItemInfo key={ItemInfo.name} item={props.item}></ItemInfo>);
    });
    return additionalInfo;
}