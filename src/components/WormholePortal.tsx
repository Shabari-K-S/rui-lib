import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useCanvas } from '../hooks/useCanvas';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface WormholePortalProps {
    children?: React.ReactNode;
    className?: string;
    starCount?: number;
    speed?: number;
    color?: string;
    vortexSize?: number;
    interactive?: boolean;
}

interface Star {
    x: number;
    y: number;
    z: number;
    originalX: number;
    originalY: number;
    size: number;
    brightness: number;
    color: string;
}

// Real sky star colors based on stellar classification
// O/B type: Blue-white, A type: White, F/G type: Yellow, K type: Orange, M type: Red
const STAR_COLORS = {
    white: '#ffffff',      // 70% probability - most common visible
    blueWhite: '#cad8ff',  // Hot O/B type stars
    yellow: '#fff4e8',     // Sun-like G type stars
    orange: '#ffd2a1',     // K type stars like Arcturus
    red: '#ffcc99',        // M type stars like Betelgeuse
};

const getRandomStarColor = (): string => {
    const rand = Math.random();
    if (rand < 0.70) return STAR_COLORS.white;
    if (rand < 0.78) return STAR_COLORS.blueWhite;
    if (rand < 0.86) return STAR_COLORS.yellow;
    if (rand < 0.94) return STAR_COLORS.orange;
    return STAR_COLORS.red;
};

export const WormholePortal = ({
    children,
    className,
    starCount = 800,
    speed = 1.0,
    vortexSize = 100,
    interactive = true,
}: WormholePortalProps) => {
    const prefersReducedMotion = useReducedMotion();
    const [canvasRef, ctx] = useCanvas({ devicePixelRatio: true });
    const starsRef = useRef<Star[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const timeRef = useRef(0);



    useEffect(() => {
        const newStars: Star[] = [];

        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            newStars.push({
                x,
                y,
                z: Math.random(),
                originalX: x,
                originalY: y,
                size: 1.0 + Math.random() * 2.0,
                brightness: 0.5 + Math.random() * 0.5,
                color: getRandomStarColor(),
            });
        }

        starsRef.current = newStars;
    }, [starCount]);

    useEffect(() => {
        if (!interactive) return;

        const handleMouseMove = (e: MouseEvent) => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            mouseRef.current = {
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
                active: true,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, [interactive]);

    useAnimationFrame((deltaTime) => {
        if (!ctx || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);

        timeRef.current += deltaTime * 0.001;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const mouse = mouseRef.current;

        // ONLY draw wormhole if mouse is active
        if (mouse.active && interactive) {
            // Visual effects removed per user request
        }

        // Update and draw stars
        starsRef.current.forEach((star) => {
            let targetX = star.originalX;
            let targetY = star.originalY;

            // Wormhole effect ONLY if mouse is active
            if (mouse.active && interactive) {
                const dx = star.originalX - mouse.x;
                const dy = star.originalY - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDist = vortexSize / 5;

                if (distance < maxDist) {
                    const pullStrength = (1 - distance / maxDist) * speed;
                    const angle = Math.atan2(dy, dx);
                    const spiralAngle = angle + (1 - distance / maxDist) * Math.PI * 2;
                    targetX = star.originalX - Math.cos(spiralAngle) * pullStrength * 20;
                    targetY = star.originalY - Math.sin(spiralAngle) * pullStrength * 20;
                }
            }

            // Move star towards target (slow down significantly for reduced motion)
            const motionFactor = prefersReducedMotion ? 0.05 : 0.1;
            star.x += (targetX - star.x) * motionFactor * speed;
            star.y += (targetY - star.y) * motionFactor * speed;

            // Twinkle effect
            const twinkle = Math.sin(timeRef.current * 3 + star.x * 10) * 0.2 + 0.8;

            // Idle rotation removed per user request
            // Stars are static unless moved by mouse

            const px = (star.x / 100) * width;
            const py = (star.y / 100) * height;

            const starSize = star.size * (0.5 + star.z * 0.5);
            let opacity = star.brightness * twinkle;

            // Star stretching and brightening near wormhole
            let stretchX = 1;
            let stretchY = 1;
            if (mouse.active && interactive) {
                const dxMouse = star.x - mouse.x;
                const dyMouse = star.y - mouse.y;
                const distToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                const maxDist = vortexSize / 5;

                if (distToMouse < maxDist) {
                    const proximity = 1 - distToMouse / maxDist;
                    opacity = Math.min(1, opacity + proximity * 0.5);
                    const angle = Math.atan2(dyMouse, dxMouse);
                    stretchX = 1 + proximity * Math.abs(Math.cos(angle)) * 2;
                    stretchY = 1 + proximity * Math.abs(Math.sin(angle)) * 2;
                }
            }

            // Glow
            ctx.save();
            ctx.globalAlpha = opacity * 0.5;
            const glowGradient = ctx.createRadialGradient(px, py, 0, px, py, starSize * 3);
            glowGradient.addColorStop(0, star.color);
            glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glowGradient;
            ctx.fillRect(px - starSize * 3, py - starSize * 3, starSize * 6, starSize * 6);
            ctx.restore();

            // Star core (with stretching)
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.ellipse(px, py, starSize * stretchX, starSize * stretchY, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }, false); // Never pause animation loop, just slow it down

    // Reduced motion early return removed to ensure stars are visible


    return (
        <div ref={containerRef} className={cn("relative w-full h-full overflow-hidden bg-black cursor-pointer", className)}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ imageRendering: 'auto' }} />
            <div className="relative z-10 w-full h-full">{children}</div>
        </div>
    );
};
