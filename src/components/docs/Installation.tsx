import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, Copy, Check, Info } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

const HookCard = ({
    name,
    description,
    code,
    usedBy
}: {
    name: string;
    description: string;
    code: string;
    usedBy: string[];
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <code className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">{name}</code>
                    <span className="text-muted-foreground text-sm hidden sm:block">{description}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-border">
                            <div className="p-4 bg-muted/30 border-b border-border">
                                <p className="text-muted-foreground text-sm mb-2">{description}</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs text-muted-foreground">Used by:</span>
                                    {usedBy.map((component) => (
                                        <span key={component} className="text-xs px-2 py-0.5 bg-secondary rounded text-foreground">
                                            {component}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                    title="Copy code"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                                <CodeBlock language="typescript" code={code} maxHeight="400px" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Installation = () => {
    const hooks = [
        {
            name: 'useReducedMotion',
            description: 'Detects user\'s motion preference for accessibility',
            usedBy: ['WormholePortal', 'LiquidGradientMesh', 'DigitalMatrix'],
            code: `import { useEffect, useState } from 'react';

/**
 * Custom hook to detect user's motion preference
 * Returns true if user prefers reduced motion
 */
export const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        // Legacy browsers
        else {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    return prefersReducedMotion;
};`
        },
        {
            name: 'useCanvas',
            description: 'Canvas setup with automatic resize handling and DPR scaling',
            usedBy: ['WormholePortal'],
            code: `import { useRef, useEffect, useState, type RefObject } from 'react';

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
            canvas.style.width = \`\${rect.width}px\`;
            canvas.style.height = \`\${rect.height}px\`;

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
};`
        },
        {
            name: 'useAnimationFrame',
            description: 'RequestAnimationFrame loop with automatic cleanup and pause support',
            usedBy: ['WormholePortal'],
            code: `import { useEffect, useRef } from 'react';

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
};`
        }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-12 py-8">
            <div className="space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
                >
                    Installation
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted-foreground leading-relaxed"
                >
                    Get up and running with ReactUI in minutes. Follow these steps to prepare your environment.
                </motion.p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-sm">1</span>
                        Prerequisites
                    </h2>
                    <p className="text-muted-foreground">Ensure you have a React project set up with Tailwind CSS. We recommend Vite or Next.js.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-sm">2</span>
                        Install Dependencies
                    </h2>
                    <p className="text-muted-foreground">ReactUI relies on <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded">framer-motion</code> for animations and <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded">clsx</code> + <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded">tailwind-merge</code> for class handling.</p>

                    <div className="bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Terminal className="w-4 h-4" />
                                <span>Terminal</span>
                            </div>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <code className="text-sm font-mono text-blue-300">npm install framer-motion clsx tailwind-merge lucide-react</code>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-sm">3</span>
                        Add Utilities
                    </h2>
                    <p className="text-muted-foreground">Create a <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded">utils.ts</code> file in your project (usually under <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded">src/lib/utils.ts</code>) to handle class merging.</p>

                    <CodeBlock
                        language="typescript"
                        code={`import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
                    />
                </section>

                <section className="space-y-4" id="hooks">
                    <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 text-sm">4</span>
                        Required Hooks
                    </h2>
                    <p className="text-muted-foreground">
                        Some components require custom hooks for canvas rendering, animation frames, and accessibility.
                        Create these files in <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded">src/hooks/</code> directory.
                    </p>

                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-800 dark:text-amber-200/80 text-sm font-medium">
                            These hooks are only required for specific components. Check each component's documentation to see if any hooks are needed.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {hooks.map((hook) => (
                            <HookCard key={hook.name} {...hook} />
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-sm">5</span>
                        That's it!
                    </h2>
                    <p className="text-muted-foreground">You are now ready to copy and paste components into your project. Browse the collection to get started.</p>
                </section>
            </div>
        </div>
    );
};
