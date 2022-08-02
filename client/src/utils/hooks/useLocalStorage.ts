import { useEffect, useState } from "react";

import { LocalStorageKeys } from "../enums";

export default function useLocalStorage<T>(
    key: LocalStorageKeys,
    initialValue: T | (() => T)
): [value: T, setValue: React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(initialValue);

    // in useEffect because localStorage does not exist at the point
    // nextjs server side renders
    useEffect(() => {
        const jsonVal = localStorage.getItem(key);

        // only return if it's not null or undefined
        if (jsonVal != null) {
            setValue(JSON.parse(jsonVal));
            return;
        }

        if (typeof initialValue === "function") {
            setValue((initialValue as CallableFunction)());
            return;
        }

        setValue(initialValue);
    }, [initialValue, key]);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
