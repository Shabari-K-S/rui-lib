import { useEffect, useRef } from 'react';

/**
 * Custom hook for requestAnimationFrame loop
 * Automatically handles cleanup and pausing
 */
export const useAnimationFrame = (callback: (deltaTime: number) => void, isPaused = false) => {
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);
    const callbackRef = useRef(callback);

    // Keep callback ref up to date
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (isPaused) return;

        const animate = (time: number) => {
            if (previousTimeRef.current !== undefined) {
                const deltaTime = time - previousTimeRef.current;
                callbackRef.current(deltaTime);
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isPaused]);
};
