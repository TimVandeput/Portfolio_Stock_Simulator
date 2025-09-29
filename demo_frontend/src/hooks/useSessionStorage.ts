"use client";

import { useState, useEffect, useCallback } from "react";

export function useSessionStorage<T>(key: string, initialValue?: T) {
  const [value, setValue] = useState<T | undefined>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | undefined) => {
      try {
        setValue(newValue);

        if (typeof window !== "undefined") {
          if (newValue === undefined) {
            sessionStorage.removeItem(key);
          } else {
            sessionStorage.setItem(key, JSON.stringify(newValue));
          }
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setStoredValue(undefined);
  }, [setStoredValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === sessionStorage) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : undefined);
        } catch (error) {
          console.warn(
            `Error parsing sessionStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [value, setStoredValue, removeValue] as const;
}
