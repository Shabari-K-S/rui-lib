import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface DigitalMatrixProps {
    children?: React.ReactNode;
    className?: string;
    /** Primary color for the effect */
    color?: string;
    /** Secondary color for gradient */
    secondaryColor?: string;
    /** Density of characters (0.1 - 1) */
    density?: number;
    /** Animation speed */
    speed?: number;
    /** Character set to use */
    charset?: string;
    /** Enable wave distortion */
    wave?: boolean;
    /** Scanline opacity (0 - 1) */
    scanlineOpacity?: number;
}

// Characters to display - mix of letters, numbers, and symbols
const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+-=[]{}|;:,./<>?~';

export const DigitalMatrix = ({
    children,
    className,
    color = '#4a9eff',
    secondaryColor = '#7c3aed',
    density = 0.6,
    speed = 1,
    charset = DEFAULT_CHARSET,
    wave = true,
    scanlineOpacity = 0.15,
}: DigitalMatrixProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    const timeRef = useRef(0);
    const prefersReducedMotion = useReducedMotion();

    // Pre-generate character grid
    const charGrid = useMemo(() => {
        const rows = 100;
        const cols = 200;
        const grid: string[][] = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            for (let x = 0; x < cols; x++) {
                grid[y][x] = charset[Math.floor(Math.random() * charset.length)];
            }
        }
        return grid;
    }, [charset]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const dpr = window.devicePixelRatio || 1;

        // Resize canvas if needed
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        }

        const actualSpeed = prefersReducedMotion ? speed * 0.1 : speed;
        timeRef.current += 0.02 * actualSpeed;
        const time = timeRef.current;

        // Clear with dark background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, width, height);

        // Calculate character dimensions
        const charSize = Math.max(8, Math.min(12, width / 80));
        const lineHeight = charSize * 1.4;
        const charWidth = charSize * 0.7;

        ctx.font = `${charSize}px "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cols = Math.ceil(width / charWidth) + 10;
        const rows = Math.ceil(height / lineHeight) + 5;

        // Draw character matrix with wave effect
        for (let row = 0; row < rows; row++) {
            const baseY = row * lineHeight;

            for (let col = 0; col < cols; col++) {
                const baseX = col * charWidth;

                // Wave distortion
                let offsetX = 0;
                let offsetY = 0;
                if (wave && !prefersReducedMotion) {
                    offsetX = Math.sin(baseY * 0.01 + time * 2) * 15 * Math.sin(time * 0.5 + row * 0.1);
                    offsetY = Math.cos(baseX * 0.008 + time) * 5;
                }

                const x = baseX + offsetX;
                const y = baseY + offsetY;

                // Skip if outside canvas
                if (x < -charWidth || x > width + charWidth || y < -lineHeight || y > height + lineHeight) {
                    continue;
                }

                // Density check - randomly skip characters
                const densitySeed = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
                if ((densitySeed - Math.floor(densitySeed)) > density) {
                    continue;
                }

                // Get character from pre-generated grid
                const charIndex = (row % charGrid.length);
                const colIndex = (col % (charGrid[0]?.length || 1));
                const char = charGrid[charIndex]?.[colIndex] || '0';

                // Calculate color based on position and time
                const distFromCenter = Math.abs(x - width / 2) / (width / 2);
                const brightness = 0.3 + Math.sin(time + row * 0.1 + col * 0.05) * 0.15;

                // Gradient between primary and secondary color
                const gradientPos = (Math.sin(baseY * 0.005 + time * 0.3) + 1) / 2;

                // Parse colors
                const parseHex = (hex: string) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : { r: 74, g: 158, b: 255 };
                };

                const c1 = parseHex(color);
                const c2 = parseHex(secondaryColor);

                const r = Math.floor(c1.r + (c2.r - c1.r) * gradientPos);
                const g = Math.floor(c1.g + (c2.g - c1.g) * gradientPos);
                const b = Math.floor(c1.b + (c2.b - c1.b) * gradientPos);

                // Fade towards edges
                const edgeFade = 1 - distFromCenter * 0.3;
                const alpha = brightness * edgeFade * (0.4 + Math.random() * 0.3);

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fillText(char, x, y);
            }
        }

        // Draw horizontal scanlines
        if (scanlineOpacity > 0) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${scanlineOpacity * 0.3})`;
            ctx.lineWidth = 0.5;

            for (let y = 0; y < height; y += 3) {
                const scanlineOffset = wave && !prefersReducedMotion
                    ? Math.sin(y * 0.02 + time * 3) * 2
                    : 0;

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y + scanlineOffset);
                ctx.stroke();
            }
        }

        // Add subtle glow overlay at center
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.max(width, height) * 0.6
        );
        gradient.addColorStop(0, `rgba(74, 158, 255, 0.1)`);
        gradient.addColorStop(0.5, `rgba(124, 58, 237, 0.05)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add vignette
        const vignette = ctx.createRadialGradient(
            width / 2, height / 2, height * 0.3,
            width / 2, height / 2, Math.max(width, height) * 0.8
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);

        animationRef.current = requestAnimationFrame(animate);
    }, [charGrid, color, secondaryColor, density, speed, wave, scanlineOpacity, prefersReducedMotion]);

    useEffect(() => {
        animate();
        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [animate]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-full overflow-hidden",
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {/* Content overlay */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
