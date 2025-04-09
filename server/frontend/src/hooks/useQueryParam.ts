import { useState } from "react";

const getQueryParam = (key: string) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
}

export const useQueryParam = (key: string, defaultValue?: string) => {
    const [value, setValue] = useState<string | null>(getQueryParam(key) ?? defaultValue ?? null);
    const setQueryParam = (newValue: string | null) => {
        const url = new URL(window.location.href);
        if (newValue === null || newValue === "") {
            url.searchParams.delete(key);
            window.history.pushState({}, "", url);
        } else {
            url.searchParams.set(key, newValue);
            window.history.pushState({}, "", url);
        }
        setValue(newValue);
    }
    return [value, setQueryParam] as [string, (newValue: string | null) => void];
};
