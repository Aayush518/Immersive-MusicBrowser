import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from localStorage or use provided initial value
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);

  // Wrapper to handle errors when setting value
  const updateValue = useCallback((newValue: T | ((val: T) => T)) => {
    try {
      setValue(newValue);
    } catch (error) {
      console.error('Error updating value:', error);
    }
  }, []);

  return [value, updateValue] as const;
}