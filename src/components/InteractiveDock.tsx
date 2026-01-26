import React, { useRef, useState } from "react";
import {
    AnimatePresence,
    motion,
    MotionValue,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import { cn } from "../lib/utils";
import { Home, Search, Calendar, Folder, MessageSquare, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ============================================================================
// TYPES
// ============================================================================
interface DockItem {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
}

interface DockProps {
    items?: DockItem[];
    className?: string;
    children?: React.ReactNode;
}

interface DockIconProps {
    size?: number;
    magnification?: number;
    distance?: number;
    mouseX?: MotionValue<number>;
    className?: string;
    children: React.ReactNode;
    label?: string;
    onClick?: () => void;
    href?: string;
    isActive?: boolean;
}

// ============================================================================
// FLOATING DOCK - Desktop Version (with magnification effect)
// ============================================================================
export const Dock = ({ items, className, children }: DockProps) => {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto flex h-16 items-end gap-4 rounded-2xl px-4 pb-3",
                "bg-neutral-900/80 border border-white/10 backdrop-blur-xl",
                "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                className
            )}
        >
            {children
                ? React.Children.map(children, (child: any) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { mouseX } as any);
                    }
                    return child;
                })
                : items?.map((item) => (
                    <DockIcon
                        key={item.title}
                        mouseX={mouseX}
                        label={item.title}
                        href={item.href}
                        onClick={item.onClick}
                    >
                        {item.icon}
                    </DockIcon>
                ))}
        </motion.div>
    );
};

// ============================================================================
// DOCK ICON - Individual icon with magnification and tooltip
// ============================================================================
export const DockIcon = ({
    size = 40,
    magnification = 70,
    distance = 150,
    mouseX,
    className,
    children,
    label,
    onClick,
    href,
    isActive,
}: DockIconProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    // Distance calculation from mouse to icon center
    const distanceCalc = useTransform(mouseX ?? useMotionValue(Infinity), (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Icon container size transforms
    const widthSync = useTransform(distanceCalc, [-distance, 0, distance], [size, magnification, size]);
    const heightSync = useTransform(distanceCalc, [-distance, 0, distance], [size, magnification, size]);

    // Inner icon size transforms
    const iconWidthSync = useTransform(distanceCalc, [-distance, 0, distance], [size * 0.5, magnification * 0.5, size * 0.5]);
    const iconHeightSync = useTransform(distanceCalc, [-distance, 0, distance], [size * 0.5, magnification * 0.5, size * 0.5]);

    // Spring physics for smooth animations
    const springConfig = { mass: 0.1, stiffness: 150, damping: 12 };
    const width = useSpring(widthSync, springConfig);
    const height = useSpring(heightSync, springConfig);
    const iconWidth = useSpring(iconWidthSync, springConfig);
    const iconHeight = useSpring(iconHeightSync, springConfig);

    const content = (
        <motion.div
            ref={ref}
            style={{ width, height }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            className={cn(
                "relative flex aspect-square cursor-pointer items-center justify-center rounded-full",
                "bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200",
                "border border-white/5 shadow-lg",
                className
            )}
        >
            {/* Animated Tooltip */}
            <AnimatePresence>
                {hovered && label && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 2, x: "-50%" }}
                        className={cn(
                            "absolute -top-10 left-1/2 w-fit px-3 py-1.5 rounded-lg",
                            "bg-neutral-800/95 border border-white/10 backdrop-blur-md",
                            "text-xs font-medium text-white whitespace-nowrap",
                            "shadow-xl"
                        )}
                    >
                        {label}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Icon */}
            <motion.div
                style={{ width: iconWidth, height: iconHeight }}
                className="flex items-center justify-center text-neutral-300"
            >
                {children}
            </motion.div>

            {/* Active Indicator */}
            {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
            )}
        </motion.div>
    );

    // Wrap in anchor if href is provided
    if (href) {
        return <a href={href}>{content}</a>;
    }

    return content;
};

// ============================================================================
// FLOATING DOCK MOBILE - Collapsible mobile version
// ============================================================================
export const DockMobile = ({
    items,
    className,
}: {
    items: DockItem[];
    className?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={cn("relative block md:hidden", className)}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="nav"
                        className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
                    >
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    transition: { delay: idx * 0.05 },
                                }}
                                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                            >
                                <a
                                    href={item.href}
                                    onClick={item.onClick}
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full",
                                        "bg-neutral-900 border border-white/10 backdrop-blur-xl",
                                        "shadow-lg hover:bg-neutral-800 transition-colors"
                                    )}
                                >
                                    <div className="h-4 w-4 text-neutral-300">{item.icon}</div>
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    "bg-neutral-900 border border-white/10 backdrop-blur-xl",
                    "shadow-lg hover:bg-neutral-800 transition-colors"
                )}
            >
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronUp className="h-5 w-5 text-neutral-400" />
                </motion.div>
            </button>
        </div>
    );
};

// ============================================================================
// FLOATING DOCK - Combined Desktop & Mobile
// ============================================================================
export const FloatingDock = ({
    items,
    desktopClassName,
    mobileClassName,
}: {
    items: DockItem[];
    desktopClassName?: string;
    mobileClassName?: string;
}) => {
    return (
        <>
            {/* Desktop - Hidden on mobile */}
            <div className={cn("hidden md:block", desktopClassName)}>
                <Dock items={items} />
            </div>

            {/* Mobile - Hidden on desktop */}
            <DockMobile items={items} className={mobileClassName} />
        </>
    );
};

// ============================================================================
// DEFAULT INTERACTIVE DOCK DEMO
// ============================================================================
export const InteractiveDock = () => {
    const navigate = useNavigate();

    const dockItems: DockItem[] = [
        { title: "Home", icon: <Home className="w-full h-full" />, onClick: () => navigate("/") },
        { title: "Components", icon: <Search className="w-full h-full" />, onClick: () => navigate("/components/glass-card") },
        { title: "Calendar", icon: <Calendar className="w-full h-full" />, onClick: () => { } },
        { title: "Files", icon: <Folder className="w-full h-full" />, onClick: () => { } },
        { title: "Messages", icon: <MessageSquare className="w-full h-full" />, onClick: () => { } },
    ];

    return <FloatingDock items={dockItems} />;
};
