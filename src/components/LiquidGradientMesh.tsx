import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface LiquidGradientMeshProps {
    children?: React.ReactNode;
    className?: string;
    /** Array of colors to blend (hex or rgb format) */
    colors?: string[];
    /** Animation speed multiplier (0.1 = slow, 2 = fast) */
    speed?: number;
    /** Complexity of the gradient mesh (1-5) */
    complexity?: number;
    /** Blur amount in pixels for softer blending */
    blur?: number;
    /** Enable mouse interaction */
    interactive?: boolean;
}

// Simple noise function for organic movement
const createNoise = () => {
    const permutation = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    const p = [...permutation, ...permutation];

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t: number, a: number, b: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number) => {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    return (x: number, y: number): number => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u = fade(xf);
        const v = fade(yf);
        const aa = p[p[X] + Y];
        const ab = p[p[X] + Y + 1];
        const ba = p[p[X + 1] + Y];
        const bb = p[p[X + 1] + Y + 1];
        return lerp(v,
            lerp(u, grad(aa, xf, yf), grad(ba, xf - 1, yf)),
            lerp(u, grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1))
        );
    };
};

// Parse color from various formats to RGB
const parseColor = (color: string): [number, number, number] => {
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        const bigint = parseInt(hex.length === 3
            ? hex.split('').map(c => c + c).join('')
            : hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }
    const match = color.match(/\d+/g);
    if (match) {
        return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
    }
    return [139, 92, 246]; // Default purple
};

interface BlobState {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    radius: number;
    color: [number, number, number];
    phase: number;
    speed: number;
}

export const LiquidGradientMesh = ({
    children,
    className,
    colors = ['#8B5CF6', '#3B82F6', '#EC4899', '#10B981'],
    speed = 1,
    complexity = 3,
    blur = 60,
    interactive = true,
}: LiquidGradientMeshProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const blobsRef = useRef<BlobState[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const timeRef = useRef(0);
    const noiseRef = useRef(createNoise());
    const animationRef = useRef<number>(0);
    const prefersReducedMotion = useReducedMotion();

    const parsedColors = colors.map(parseColor);

    // Initialize blobs
    const initializeBlobs = useCallback((width: number, height: number) => {
        const blobCount = Math.max(3, complexity + 2);
        blobsRef.current = Array.from({ length: blobCount }, (_, i) => ({
            x: Math.random() * width,
            y: Math.random() * height,
            targetX: Math.random() * width,
            targetY: Math.random() * height,
            radius: Math.min(width, height) * (0.3 + Math.random() * 0.3),
            color: parsedColors[i % parsedColors.length],
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5,
        }));
    }, [complexity, parsedColors]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Set up canvas size
        const updateSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.scale(dpr, dpr);
            if (blobsRef.current.length === 0) {
                initializeBlobs(rect.width, rect.height);
            }
        };
        updateSize();

        const noise = noiseRef.current;
        const actualSpeed = prefersReducedMotion ? speed * 0.2 : speed;

        const animate = () => {
            const rect = container.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            timeRef.current += 0.01 * actualSpeed;
            const time = timeRef.current;

            // Clear with dark background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Update blob positions with noise-based movement
            blobsRef.current.forEach((blob, i) => {
                const noiseX = noise(i * 0.5, time * blob.speed) * 100;
                const noiseY = noise(i * 0.5 + 100, time * blob.speed) * 100;

                blob.targetX = width * 0.5 + noiseX * (width / 200);
                blob.targetY = height * 0.5 + noiseY * (height / 200);

                // Mouse interaction
                if (mouseRef.current.active && interactive) {
                    const dx = mouseRef.current.x - blob.x;
                    const dy = mouseRef.current.y - blob.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 300;
                    if (dist < maxDist) {
                        const force = (1 - dist / maxDist) * 50;
                        blob.targetX += (dx / dist) * force;
                        blob.targetY += (dy / dist) * force;
                    }
                }

                // Smooth movement
                blob.x += (blob.targetX - blob.x) * 0.02;
                blob.y += (blob.targetY - blob.y) * 0.02;

                // Pulsating radius
                const pulseRadius = blob.radius * (1 + Math.sin(time * 2 + blob.phase) * 0.1);

                // Draw radial gradient blob
                const gradient = ctx.createRadialGradient(
                    blob.x, blob.y, 0,
                    blob.x, blob.y, pulseRadius
                );

                const [r, g, b] = blob.color;
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.7)`);
                gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.35)`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                // Use source-over for natural layering without washing to white
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(blob.x, blob.y, pulseRadius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalCompositeOperation = 'source-over';
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Mouse handlers
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        if (interactive) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
        }

        window.addEventListener('resize', updateSize);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', updateSize);
            if (interactive) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [colors, speed, complexity, interactive, initializeBlobs, prefersReducedMotion]);

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-full overflow-hidden bg-black", className)}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ filter: `blur(${blur}px)` }}
            />
            {/* Overlay for content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
