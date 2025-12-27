import useSubscribe from "./useSubsribe";

export const useErrorMessage = (reason: string, callback: (data: any) => void) => {
    useSubscribe({
        type: "error",
        callback: (data: any) => {
            if( data.reason !== reason) return;
            console.log("Received error message:", data);
            callback(data);
        },
    });
};
