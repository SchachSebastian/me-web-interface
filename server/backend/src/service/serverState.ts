import { sendClientMessage } from './../clientWs';
import { $state } from 'diff-store';
export let lastMinecraftResponse: Date = new Date();

export const setMinecraftResponseNow = () => {
    lastMinecraftResponse = new Date();
};

const updateServerStateInterval = () =>
    setInterval(() => {
        console.log("Updating server state");
        if(new Date().getTime() - lastMinecraftResponse.getTime() > 10 * 1000) {
            console.warn("No response from Minecraft server in the last 10 seconds.");
            if ($state.get().status !== "minecraft_disconnected") {
                $state.set({
                    ...$state.get(),
                    status: "minecraft_disconnected",
                });
                sendClientMessage({
                    type: "state-update",
                    data: {
                        status: "minecraft_disconnected",
                    },
                });
            }
        }
    }, 1000);

export default updateServerStateInterval;
