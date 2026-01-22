import { useRef, useEffect, type RefObject } from 'react';

interface UseCanvasOptions {
    onResize?: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
    devicePixelRatio?: boolean;
}

/**
 * Custom hook for canvas setup with automatic resize handling
 * Returns canvas ref and context
 */
export const useCanvas = (options: UseCanvasOptions = {}): [RefObject<HTMLCanvasElement | null>, CanvasRenderingContext2D | null] => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const { onResize, devicePixelRatio = true } = options;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        ctxRef.current = ctx;

        const handleResize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const dpr = devicePixelRatio ? window.devicePixelRatio || 1 : 1;
            const rect = parent.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            ctx.scale(dpr, dpr);

            if (onResize) {
                onResize(canvas, ctx);
            }
        };

        handleResize();

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(canvas.parentElement!);

        return () => {
            resizeObserver.disconnect();
        };
    }, [onResize, devicePixelRatio]);

    return [canvasRef, ctxRef.current];
};
