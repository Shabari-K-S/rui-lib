import { useRef, useEffect, useState, type RefObject } from 'react';

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
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const { onResize, devicePixelRatio = true } = options;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d', { alpha: true });
        if (!context) return;

        setCtx(context);

        const handleResize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const dpr = devicePixelRatio ? window.devicePixelRatio || 1 : 1;
            const rect = parent.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            // Reset and re-scale after resize
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(dpr, dpr);

            if (onResize) {
                onResize(canvas, context);
            }
        };

        handleResize();

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(canvas.parentElement!);

        return () => {
            resizeObserver.disconnect();
        };
    }, [onResize, devicePixelRatio]);

    return [canvasRef, ctx];
};
