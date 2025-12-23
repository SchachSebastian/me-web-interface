const purityColors = {
    cracked: "#808080",
    chipped: "#33ff33",
    flawed: "#5555ff",
    normal: "#bb00bb",
    flawless: "#ed7014",
};
export function getColor(purity: keyof typeof purityColors): string {
    return purityColors[purity] || "#000000";
}