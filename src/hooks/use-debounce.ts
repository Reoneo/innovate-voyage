
import { useEffect, useState, useCallback, useRef } from 'react';

// Creates a debounced state value that updates after a specified delay
export function useDebouncedState<T>(initialValue: T, delay = 500): [T, React.Dispatch<React.SetStateAction<T>>, T] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return [debouncedValue, setValue, value];
}

// Creates a debounced function that only executes after a specified delay
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<number | null>(null);
  
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
  
  return debouncedCallback;
}

// Creates a throttled function that only executes at most once per specified interval
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  interval = 300
): (...args: Parameters<T>) => void {
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const elapsed = now - lastExecuted.current;
    
    if (elapsed >= interval) {
      lastExecuted.current = now;
      callback(...args);
    } else {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        lastExecuted.current = Date.now();
        callback(...args);
      }, interval - elapsed);
    }
  }, [callback, interval]);
}

export default useDebounce;
