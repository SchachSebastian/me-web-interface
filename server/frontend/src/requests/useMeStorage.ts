import { useStore } from "@nanostores/react";
import { $storage } from "diff-store";
import { Storage } from "diff-store";
import useSubscribe from "./useSubsribe";

export const useMeStorage = () => {
    useSubscribe({
        type: "storage-update",
        callback: (storage: Storage) => {
            console.log("Received storage update:", storage);
            $storage.set(storage);
        },
    });
    return useStore($storage);
};
