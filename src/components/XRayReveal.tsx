import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { cn } from '../lib/utils';

interface XRayRevealProps {
    children: React.ReactNode;
    revealContent: React.ReactNode;
    className?: string;
    radius?: number;
    gradientSize?: number;
}

export const XRayReveal = ({
    children,
    revealContent,
    className,
    radius = 100,
    gradientSize = 50
}: XRayRevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Animation state for the reveal effect (0 = hidden/no hole, 1 = revealed/hole open)
    const transitionVal = useSpring(0, { stiffness: 400, damping: 30 });

    const innerRadius = useTransform(transitionVal, [0, 1], [0, radius * (gradientSize / 100)]);
    const outerRadius = useTransform(transitionVal, [0, 1], [0, radius]);

    // Construct the mask image dynamically based on mouse position and transition state
    const maskImage = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, transparent ${innerRadius}px, black ${outerRadius}px)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => transitionVal.set(1)}
            onMouseLeave={() => transitionVal.set(0)}
            className={cn("relative overflow-hidden cursor-crosshair", className)}
        >
            {/* Base Layer (Hidden Content) */}
            <div className="absolute inset-0 z-0">
                {revealContent}
            </div>

            {/* Overlay Layer (Main Content) */}
            <motion.div
                className="relative z-10 w-full h-full bg-surface-light dark:bg-surface-dark"
                style={{
                    maskImage,
                    WebkitMaskImage: maskImage,
                    // Use standard no-repeat to prevent tiling of the gradient
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};
