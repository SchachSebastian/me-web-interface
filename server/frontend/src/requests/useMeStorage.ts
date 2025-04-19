import { useStore } from "@nanostores/react";
import { $storage } from "diff-store/src/storage/storage";
import { Storage } from "diff-store/src/types/Storage";
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
