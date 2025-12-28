export type State = {
    itemStorage?: number;
    fluidStorage?: number;
    chemicalStorage?: number;
    energyStorage?: number;
    status:
        | "bridge_missing"
        | "network_disconnected"
        | "network_offline"
        | "network_connected"
        | "minecraft_disconnected"
        | "server_disconnected"
        | "never_connected";
};
