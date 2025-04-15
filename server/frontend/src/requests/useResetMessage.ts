import useSubscribe from "./useSubsribe";

export const useResetMessage = (callback: () => void) => {
    useSubscribe({
        type: "reset",
        callback: () => {
            console.log("Received reset message");
            callback();
        },
    });
};
