import { useCallback } from "react";

export function useDebounce(callback: CallableFunction, delay: number) {
  const debouncedFunction = useCallback(
    (...args: any[]) => {
      const timer = setTimeout(() => callback(...args), delay);
      return () => clearTimeout(timer);
    },
    [callback, delay]
  );

  return debouncedFunction;
}
