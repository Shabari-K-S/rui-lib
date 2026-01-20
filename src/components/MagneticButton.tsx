import React, { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How far the button moves (default 0.5)
    range?: number; // How close the mouse needs to be (default 100)
    onClick?: () => void;
}

export const MagneticButton = ({
    children,
    className,
    strength = 0.5,
    range = 100,
    onClick
}: MagneticButtonProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // Spring physics for smooth movement
    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < range) {
            // Move button towards the mouse
            x.set(distanceX * strength);
            y.set(distanceY * strength);
        } else {
            // Reset if out of range
            x.set(0);
            y.set(0);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            onClick={onClick}
            className={cn(
                "inline-block cursor-pointer transition-colors duration-200",
                className
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.div>
    );
};
