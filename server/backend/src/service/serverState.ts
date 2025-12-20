import { sendClientMessage } from './../clientWs';
import { $state } from 'diff-store';
export let lastMinecraftResponse: Date;

export const setMinecraftResponseNow = () => {
    lastMinecraftResponse = new Date();
};

const updateServerStateInterval = () =>
    setInterval(() => {
        console.log("Updating server state");
        if(new Date().getTime() - lastMinecraftResponse.getTime() > 10 * 1000) {
            console.warn("No response from Minecraft server in the last 10 seconds.");
            $state.set({
                ...$state.get(),
                status: "minecraft_disconnected",
            });
            sendClientMessage({
                type: "state-update",
                data: $state.get(),
            });
        }
    }, 1000);

export default updateServerStateInterval;
