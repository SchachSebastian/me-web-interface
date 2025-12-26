import { useState, useEffect } from "react";

export const usePath = (defaultValue?: string) => {
    const [path, setPath] = useState<string>(
        window.location.pathname || defaultValue || "/"
    );

    useEffect(() => {
        const handlePopState = () => {
            setPath(window.location.pathname || defaultValue || "/");
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [defaultValue]);

    const setFullPath = (newPath: string) => {
        if (newPath !== path) {
            window.history.pushState({}, "", newPath);
            setPath(newPath);
        }
    };

    return [path, setFullPath] as [string, (newPath: string) => void];
};
