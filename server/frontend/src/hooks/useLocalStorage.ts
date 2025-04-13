import { useState } from 'react';

/**
 * A hook to use local storage.
 * @param key - the key to store the value
 * @param initialValue - the initial value to store
 */
export const useLocalStorage = <Type>(
	key: string,
	initialValue: Type | (() => Type),
): [Type, (value: ((value: Type) => Type) | Type) => void] => {
	const [storedValue, setStoredValue] = useState<Type>(() => {
		initialValue =
			initialValue instanceof Function ? initialValue() : initialValue;
		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as Type) : initialValue;
		} catch (error) {
			return initialValue;
		}
	});
	const setLocalStorage = (value: ((value: Type) => Type) | Type) => {
		const valueToStore =
			value instanceof Function ? value(storedValue) : value;
		window.localStorage.setItem(key, JSON.stringify(valueToStore));
		setStoredValue(valueToStore);
	};
	return [storedValue, setLocalStorage];
};
