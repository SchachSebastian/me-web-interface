import { sendClientMessage } from './../clientWs';
import { $state, State } from 'diff-store';
export let lastMinecraftResponse: Date = new Date();
let previousStatus: State["status"] = "never_connected";

export const setMinecraftResponseNow = () => {
    lastMinecraftResponse = new Date();
    if ($state.get().status === "minecraft_disconnected") {
        $state.set({
            ...$state.get(),
            status: previousStatus,
        });
        sendClientMessage({
            type: "state-update",
            data: {
                status: previousStatus,
            },
        });
    };
};

const updateServerStateInterval = () =>
    setInterval(() => {
        if(new Date().getTime() - lastMinecraftResponse.getTime() > 10 * 1000) {
            if ($state.get().status !== "minecraft_disconnected") {
                console.warn("No response from Minecraft server in the last 10 seconds.");
                previousStatus = $state.get().status;
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
