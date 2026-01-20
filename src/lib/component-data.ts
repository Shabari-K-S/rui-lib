export interface ComponentData {
    id: string;
    name: string;
    description: string;
    dependencies: string; // npm install command
    code: string; // The source code
    usage: string; // Usage example
}

export const COMPONENTS: Record<string, ComponentData> = {
    'glass-card': {
        id: 'glass-card',
        name: 'Glass Card',
        description: 'A high-fidelity glass surface with magnetic 3D tilt effect on hover.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        code: `import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export const GlassCard = ({ children, className, intensity = 20 }: GlassCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // Motion values for mouse position
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for rotation
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    const [hovered, setHovered] = useState(false);

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;

        const xPct = (mouseXVal / width) - 0.5;
        const yPct = (mouseYVal / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={cn(
                "relative transition-all duration-200 ease-out",
                className
            )}
        >
            <div
                style={{ transform: "translateZ(20px)" }}
                className={cn(
                    "relative z-10 h-full w-full rounded-2xl border border-[var(--glass-border)] bg-surface-light/10 dark:bg-surface-dark/10 backdrop-blur-xl shadow-lg transition-all duration-300",
                    hovered ? "shadow-accent/10 border-accent/20" : ""
                )}
            >
                {/* Glossy Reflection Gradient */}
                <div
                    className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100"
                    style={{
                        background: \`radial-gradient(800px circle at \${mouseX.get() * 100 + 50}% \${mouseY.get() * 100 + 50}%, rgba(255,255,255,0.1), transparent 40%)\`
                    }}
                />
                <div className="p-6 h-full">{children}</div>
            </div>
        </motion.div>
    );
};`,
        usage: `import { GlassCard } from '@/components/GlassCard';
import { Zap } from 'lucide-react';

export const MyCard = () => (
    <GlassCard className="w-80 h-96 p-8 flex flex-col justify-between">
         <div>
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4 text-accent border border-accent/20">
                <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
            <p className="text-gray-400">Unlock full access to Nexus UI components and premium support.</p>
         </div>
         <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors">
             Get Started
         </button>
    </GlassCard>
);`
    },
    'dock': {
        id: 'dock',
        name: 'Interactive Dock',
        description: 'A macOS-inspired dock with magnification physics and glassmorphism.',
        dependencies: 'npm install framer-motion @radix-ui/react-tooltip clsx tailwind-merge',
        code: `import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

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
};`,
        usage: `import { Dock, DockIcon } from '@/components/InteractiveDock';
import { Home, Search } from 'lucide-react';

export const MyDock = () => (
  <Dock>
    <DockIcon label="Home"><Home /></DockIcon>
    <DockIcon label="Search"><Search /></DockIcon>
  </Dock>
);`
    },
    'breadcrumb': {
        id: 'breadcrumb',
        name: 'Smart Breadcrumb',
        description: 'Context-aware navigation trail with dropdown menus.',
        dependencies: 'npm install @radix-ui/react-dropdown-menu clsx tailwind-merge lucide-react',
        code: `import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../lib/utils';

export interface BreadcrumbItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    href?: string;
    children?: BreadcrumbItem[]; // Sub-items for dropdown
}

interface SmartBreadcrumbProps {
    items: BreadcrumbItem[];
    onNavigate?: (id: string) => void;
    className?: string;
}

export const SmartBreadcrumb = ({ items, onNavigate, className }: SmartBreadcrumbProps) => {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1", className)}>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-colors backdrop-blur-md">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <div key={item.id} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-500 mx-2" />
                            )}

                            {item.children ? (
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger className="outline-none">
                                        <div className={cn(
                                            "flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer group rounded-md px-2 py-1",
                                            isLast ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                                        )}>
                                            {item.icon && <span className="opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>}
                                            {item.label}
                                            <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="min-w-[180px] bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-lg p-1 animate-scale-in shadow-xl z-50 text-white"
                                            sideOffset={5}
                                        >
                                            {item.children.map((child) => (
                                                <DropdownMenu.Item
                                                    key={child.id}
                                                    onSelect={() => onNavigate?.(child.id)}
                                                    className="flex items-center gap-2 px-2 py-2 text-sm text-gray-300 rounded-md hover:bg-white/10 hover:text-white cursor-pointer outline-none transition-colors"
                                                >
                                                    {child.icon || <Folder className="w-3 h-3 opacity-50" />}
                                                    {child.label}
                                                </DropdownMenu.Item>
                                            ))}
                                            <DropdownMenu.Arrow className="fill-gray-900/90" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            ) : (
                                <button
                                    onClick={() => onNavigate?.(item.id)}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-medium transition-colors px-2 py-1 rounded-md",
                                        isLast ? "text-white pointer-events-none" : "text-gray-400 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    {item.icon && <span className="opacity-70">{item.icon}</span>}
                                    {item.label}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
};`,
        usage: `import { SmartBreadcrumb } from '@/components/SmartBreadcrumb';

// ... items definition
<SmartBreadcrumb items={items} />`
    },
    'teleport': {
        id: 'teleport',
        name: 'Teleport Search',
        description: 'Global command palette for fast navigation and actions.',
        dependencies: 'npm install cmdk framer-motion lucide-react',
        code: `import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNexus } from '../lib/nexus-provider';
import { Search, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data Structures
export interface SearchItem {
    id: string;
    label: string;
    icon: LucideIcon;
    shortcut?: string;
    action: () => void;
}

export interface SearchGroup {
    heading: string;
    items: SearchItem[];
}

export const TeleportSearch = ({ searchGroups }: { searchGroups: SearchGroup[] }) => {
    const [open, setOpen] = useState(false);
    const { on } = useNexus();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        const cleanup = on('command-palette:open', () => setOpen(true));

        return () => {
            document.removeEventListener('keydown', down);
            cleanup();
        };
    }, [on]);

    const runCommand = (action: () => void) => {
        setOpen(false);
        action();
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-gray-900/80 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
                    >
                        <Command className="w-full bg-transparent">
                            <div className="flex items-center border-b border-white/10 px-4" cmdk-input-wrapper="">
                                <Search className="mr-2 h-5 w-5 shrink-0 text-gray-400" />
                                <Command.Input
                                    placeholder="Type a command or search..."
                                    className="flex h-12 w-full rouned-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 text-white disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                                <Command.Empty className="py-6 text-center text-sm text-gray-500">No results found.</Command.Empty>

                                {searchGroups.map((group) => (
                                    <Command.Group key={group.heading} heading={group.heading} className="text-xs font-medium text-gray-400 px-2 py-1.5 mb-2">
                                        {group.items.map((item) => (
                                            <Command.Item
                                                key={item.id}
                                                onSelect={() => runCommand(item.action)}
                                                value={\`\${ group.heading } \${ item.label }\`}
                                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm text-gray-200 outline-none hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-white"
                                            >
                                                <item.icon className="mr-2 h-4 w-4 opacity-70" />
                                                <span className="flex-1">{item.label}</span>
                                                {item.shortcut && (
                                                    <span className="text-[10px] text-gray-500 font-mono border border-white/10 rounded px-1 bg-white/5">{item.shortcut}</span>
                                                )}
                                                <ArrowRight className="ml-2 h-3 w-3 opacity-0 aria-selected:opacity-50 transition-opacity" />
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                ))}
                            </Command.List>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};`,
        usage: `<TeleportSearch />`
    },
    'x-ray-reveal': {
        id: 'x-ray-reveal',
        name: 'X-Ray Reveal',
        description: 'A magical effect where a cursor-guided mask reveals hidden content layer underneath.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        code: `import React, { useRef } from 'react';
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
    const maskImage = useMotionTemplate\`radial-gradient(circle at \${x}px \${y}px, transparent \${innerRadius}px, black \${outerRadius}px)\`;

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
};`,
        usage: `import { XRayReveal } from '@/components/XRayReveal';
import { Skull, AlertTriangle, Lock } from 'lucide-react';

export const SecretDossier = () => (
    <XRayReveal
        className="w-full h-96 rounded-xl border border-white/10"
        radius={120}
        revealContent={
            <div className="w-full h-full bg-red-900/20 flex flex-col items-center justify-center text-red-500 p-8 text-center">
                <Skull className="w-16 h-16 mb-4 animate-pulse" />
                <h2 className="text-3xl font-black uppercase tracking-widest mb-2">Top Secret</h2>
                <p className="font-mono text-sm max-w-md">
                    CLASSIFIED INFORMATION: The payload has been delivered. 
                    Meeting point coordinates: 34.0522° N, 118.2437° W
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md opacity-50">
                     {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-red-500/10 rounded border border-red-500/20" />
                     ))}
                </div>
            </div>
        }
    >
        <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-gray-400 p-8 text-center group">
            <Lock className="w-16 h-16 mb-4 group-hover:text-gray-200 transition-colors" />
            <h2 className="text-3xl font-bold mb-2 text-gray-200">Restricted Access</h2>
            <p className="max-w-md">
                This document is classified. Authorization level 4 required to view contents.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-yellow-500 border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span>Hover to decouple security layer</span>
            </div>
        </div>
    </XRayReveal>
);`
    },
    'magnetic-button': {
        id: 'magnetic-button',
        name: 'Magnetic Button',
        description: 'A button that physically attracts to your cursor when you get close.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        code: `import React, { useRef } from 'react';
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
};`,
        usage: `import { MagneticButton } from '@/components/MagneticButton';
import { MousePointer2 } from 'lucide-react';

export const MagneticCTA = () => (
    <div className="flex gap-8 items-center justify-center p-12">
        <MagneticButton strength={0.2} className="p-4 bg-gray-800 rounded-full border border-gray-700 hover:border-gray-500">
             <MousePointer2 className="w-6 h-6 text-white" />
        </MagneticButton>
        
        <MagneticButton strength={0.6} range={150} className="px-8 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow">
             Strong Pull
        </MagneticButton>
    </div>
);`
    }
};
