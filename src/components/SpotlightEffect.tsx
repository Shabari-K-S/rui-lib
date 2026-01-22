import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { cn } from '../lib/utils';

export interface SpotlightEffectProps {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
    spotlightSize?: number;
    spotlightIntensity?: number;
    showBorder?: boolean;
}

export const SpotlightEffect = ({
    children,
    className,
    spotlightColor = 'rgba(139, 92, 246, 0.15)',
    spotlightSize = 400,
    spotlightIntensity = 1,
    showBorder = true,
}: SpotlightEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Raw mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth spring animation for the spotlight
    const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
    
    // Opacity for fade in/out
    const opacity = useSpring(0, { stiffness: 300, damping: 30 });

    // Create dynamic background gradient using useMotionTemplate
    const spotlightBackground = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${springX}px ${springY}px, ${spotlightColor}, transparent 80%)`;
    
    // Border glow with stronger color
    const borderGlowColor = spotlightColor.replace(/[\d.]+\)$/, '0.4)');
    const borderBackground = useMotionTemplate`radial-gradient(${spotlightSize * 0.8}px circle at ${springX}px ${springY}px, ${borderGlowColor}, transparent 60%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseEnter = () => {
        opacity.set(spotlightIntensity);
    };

    const handleMouseLeave = () => {
        opacity.set(0);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden",
                showBorder && "border border-white/10 rounded-xl",
                className
            )}
        >
            {/* Spotlight gradient overlay */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    opacity,
                    background: spotlightBackground,
                }}
            />
            
            {/* Border glow effect */}
            {showBorder && (
                <motion.div
                    className="pointer-events-none absolute inset-0 z-10 rounded-xl"
                    style={{
                        opacity,
                        background: borderBackground,
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'xor',
                        WebkitMaskComposite: 'xor',
                        padding: '1px',
                    }}
                />
            )}
            
            {/* Content */}
            <div className="relative z-0">
                {children}
            </div>
        </div>
    );
};

// Spotlight Card variant - a card with built-in spotlight effect
export interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

export const SpotlightCard = ({
    children,
    className,
    spotlightColor = 'rgba(139, 92, 246, 0.15)',
}: SpotlightCardProps) => {
    return (
        <SpotlightEffect
            spotlightColor={spotlightColor}
            className={cn(
                "bg-white/5 backdrop-blur-sm",
                className
            )}
        >
            <div className="p-6">
                {children}
            </div>
        </SpotlightEffect>
    );
};
