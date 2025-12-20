import { useStore } from "@nanostores/react";
import { $state } from "diff-store";
import { State } from "diff-store";
import useSubscribe from "./useSubsribe";

export const useNetworkState = () => {
    useSubscribe({
        type: "state-update",
        callback: (state: State) => {
            console.log("Received state update:", state);
            $state.set({
                ...$state.get(),
                ...state,
            });
        },
    });
    return useStore($state);
};
