import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Home, Search, Calendar, Folder, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DockProps {
    className?: string;
    children: React.ReactNode;
}

interface DockIconProps {
    size?: number;
    magnification?: number;
    distance?: number;
    mouseX?: any; // MotionValue<number>
    className?: string;
    children: React.ReactNode;
    label?: string;
    onClick?: () => void;
    isActive?: boolean;
}

export const Dock = ({ className, children }: DockProps) => {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-[rgba(255,255,255,0.05)] px-4 pb-3 border border-[rgba(255,255,255,0.1)] backdrop-blur-[12px]",
                className
            )}
        >
            {React.Children.map(children, (child: any) => {
                // Pass mouseX to children
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { mouseX } as any);
                }
                return child;
            })}
        </motion.div>
    );
};

export const DockIcon = ({
    size = 40,
    magnification = 60,
    distance = 140,
    mouseX,
    className,
    children,
    label,
    onClick,
    isActive
}: DockIconProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const distanceCalc = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distanceCalc, [-distance, 0, distance], [size, magnification, size]);

    const width = useSpring(widthSync, {
        mass: 0.1,
        stiffness: 400, // Tactile feel
        damping: 25, // Soft bouncy
    });

    return (
        <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <div onClick={onClick} className="relative group">
                        <motion.div
                            ref={ref}
                            style={{ width, height: width }}
                            className={cn(
                                "flex aspect-square cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.05)] shadow-sm transition-colors",
                                className
                            )}
                        >
                            {/* Adjust icon size based on container */}
                            <motion.div
                                style={{ width: useTransform(width, (w) => w * 0.5), height: useTransform(width, (w) => w * 0.5) }}
                                className="text-gray-200"
                            >
                                {children}
                            </motion.div>
                        </motion.div>

                        {/* Active Indicator */}
                        {isActive && (
                            <div className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                        )}
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="animate-fade-in rounded-md bg-gray-900/90 px-3 py-1.5 text-xs text-white border border-white/10 backdrop-blur-md mb-2 z-50"
                        sideOffset={10}
                    >
                        {label}
                        <Tooltip.Arrow className="fill-gray-900/90" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export const InteractiveDock = () => {
    const navigate = useNavigate();

    return (
        <Dock>
            <DockIcon label="Home" onClick={() => navigate('/')}><Home /></DockIcon>
            <DockIcon label="Components" onClick={() => navigate('/components/glass-card')}><Search /></DockIcon>
            <DockIcon label="Calendar" onClick={() => { }}><Calendar /></DockIcon>
            <DockIcon label="Files" onClick={() => { }}><Folder /></DockIcon>
            <DockIcon label="Messages" onClick={() => { }}><MessageSquare /></DockIcon>
        </Dock>
    );
};
