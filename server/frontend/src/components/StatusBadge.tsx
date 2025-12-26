import { useNetworkState } from "../requests/useNetworkState";

export const StatusBadge = () => {
    const state = useNetworkState();
    let statusMessage;
    switch (state.status) {
        case "bridge_missing":
            statusMessage = "🔴 Bridge Missing";
            break;
        case "network_disconnected":
            statusMessage = "🔴 Network Disconnected";
            break;
        case "network_offline":
            statusMessage = "🟠 Network Offline";
            break;
        case "network_connected":
            statusMessage = "🟢 Connected";
            break;
        case "minecraft_disconnected":
            statusMessage = "🔴 Minecraft Offline";
            break;
        case "server_disconnected":
            statusMessage = "🔴 Server Offline";
            break;
        case "never_connected":
            statusMessage = "⚪ Not set up yet";
            break;
        default:
            statusMessage = "⚪ Unknown Status";
    }
    return (
        <div className="bg-[#c6c6c6] pointer-events-none min-w-fit rounded p-3 border-white border-b-0 border-8 text-[#3e3e3e] font-bold">
            {statusMessage}
        </div>
    );
};