export interface ComponentData {
    id: string;
    name: string;
    description: string;
    dependencies: string; // npm install command
    code: string; // The source code
    usage: string; // Usage example
    category?: 'Components' | 'Backgrounds';
}

export const COMPONENTS: Record<string, ComponentData> = {
    'glass-card': {
        id: 'glass-card',
        name: 'Glass Card',
        description: 'A high-fidelity glass surface with magnetic 3D tilt effect on hover.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Components',
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
        category: 'Components',
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
        category: 'Components',
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
        category: 'Components',
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
        category: 'Components',
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
        category: 'Components',
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
    },
    'cyber-grid': {
        id: 'cyber-grid',
        name: 'Cyber Grid',
        description: 'A futuristic grid background with pulsing digital blocks, perfect for landing pages or dashboards.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Backgrounds',
        code: `import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export const AnimatedWall = ({ className }: { className?: string }) => {
    // block interface
    interface Block {
        id: number;
        x: number;
        y: number;
        duration: number;
        delay: number;
    }
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        // Create a grid of "active" blocks
        const newBlocks: Block[] = [];
        // Use window dimensions but fallback to large defaults if ssr/too early
        const cols = 50; 
        const rows = 30;
        
        // Add more active blocks for better visibility
        // 5% of grid is active
        const numBlocks = Math.floor((cols * rows) * 0.05); 

        for (let i = 0; i < numBlocks; i++) {
            newBlocks.push({
                id: i,
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
                duration: 2 + Math.random() * 4, // varied duration
                delay: Math.random() * 5,
            });
        }
        setBlocks(newBlocks);
    }, []);

    return (
        <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}>
            {/* Base Grid - Increased Opacity for visibility */}
            <div 
                className="absolute inset-0 opacity-[0.2]" 
                style={{ 
                    backgroundImage: \`linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)\`,
                    backgroundSize: '4rem 4rem' 
                }} 
            />

            {/* Glowing Orbs / Active Cells */}
            {blocks.map((block) => (
                <motion.div
                    key={block.id}
                    className="absolute bg-accent/20 border border-accent/40 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur-[1px]"
                    style={{
                        left: \`\${block.x * 4}rem\`, 
                        top: \`\${block.y * 4}rem\`,
                        width: '3.9rem',
                        height: '3.9rem',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                        opacity: [0, 0.8, 0], 
                        scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{
                        duration: block.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: block.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
            
             {/* Vignette - Reduced strength */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
};`,
        usage: `import { AnimatedWall } from '@/components/AnimatedWall';

export const MyLandingPage = () => (
    <div className="relative w-full h-screen bg-black">
        <AnimatedWall />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <h1 className="text-6xl font-bold mb-4">The Future is Here</h1>
            <button className="px-8 py-4 bg-white text-black rounded-lg font-bold">
                Get Started
            </button>
        </div>
    </div>
);`
    },
    'aurora-background': {
        id: 'aurora-background',
        name: 'Aurora Background',
        description: 'A mesmerizing, flowing gradient background resembling the northern lights.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Backgrounds',
        code: `import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const AuroraBackground = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    return (
        <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-50 blur-[100px]"
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, #8B5CF6 90deg, transparent 180deg, #3B82F6 270deg, transparent 360deg)',
                    }}
                />
                <motion.div
                    className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-30 blur-[80px]"
                    animate={{
                        rotate: [360, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 60%)',
                    }}
                />
            </div>
            
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};`,
        usage: `import { AuroraBackground } from '@/components/AuroraBackground';

export const LoginPage = () => (
    <div className="h-screen w-full">
        <AuroraBackground>
             <div className="flex items-center justify-center h-full">
                 <h1 className="text-white text-4xl">Login</h1>
             </div>
        </AuroraBackground>
    </div>
);`
    },
    'particles-background': {
        id: 'particles-background',
        name: 'Particles Network',
        description: 'An interactive neural network of connected particles.',
        dependencies: 'npm install clsx tailwind-merge',
        category: 'Backgrounds',
        code: `import { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

interface ParticlesBackgroundProps {
    className?: string;
    particleCount?: number;
    connectDistance?: number;
    color?: string;
}

export const ParticlesBackground = ({ 
    className, 
    particleCount = 100, 
    connectDistance = 100,
    color = '#8B5CF6'
}: ParticlesBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

        const particles: { x: number; y: number; dx: number; dy: number }[] = [];

        // Resize handler
        const handleResize = () => {
             width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
             height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Update and draw particles
            particles.forEach((p, i) => {
                p.x += p.dx;
                p.y += p.dy;

                // Bounce off edges
                if (p.x < 0 || p.x > width) p.dx *= -1;
                if (p.y < 0 || p.y > height) p.dy *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Connect particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = color;
                        ctx.globalAlpha = 1 - (dist / connectDistance);
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [particleCount, connectDistance, color]);

    return (
        <canvas 
            ref={canvasRef} 
            className={cn("absolute inset-0 pointer-events-none", className)}
        />
    );
};`,
        usage: `import { ParticlesBackground } from '@/components/ParticlesBackground';

export const HeroSection = () => (
    <div className="relative h-[400px] w-full bg-gray-900 overflow-hidden">
        <ParticlesBackground particleCount={50} color="#8B5CF6" />
        <div className="relative z-10 flex items-center justify-center h-full text-white">
            <h1>Connected World</h1>
        </div>
    </div>
);`
    },
    'morphing-tabs': {
        id: 'morphing-tabs',
        name: 'Morphing Tabs',
        description: 'Animated tab navigation with smooth morphing indicator that flows between tabs.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Components',
        code: `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

export interface MorphingTabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    variant?: 'pill' | 'underline' | 'boxed';
    className?: string;
}

export const MorphingTabs = ({
    tabs,
    defaultTab,
    onChange,
    variant = 'pill',
    className,
}: MorphingTabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    return (
        <div
            className={cn(
                "relative inline-flex items-center gap-1 p-1 rounded-xl",
                variant === 'pill' && "bg-white/5 border border-white/10 backdrop-blur-sm",
                variant === 'boxed' && "bg-white/5 border border-white/10 backdrop-blur-sm",
                variant === 'underline' && "border-b border-white/10 rounded-none p-0 gap-0",
                className
            )}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={cn(
                            "relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200",
                            variant === 'underline' && "px-4 py-3",
                            isActive
                                ? "text-white"
                                : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        {tab.icon && (
                            <span className={cn(
                                "transition-colors duration-200",
                                isActive ? "text-white" : "text-gray-500"
                            )}>
                                {tab.icon}
                            </span>
                        )}
                        {tab.label}

                        {/* Animated Indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="morphing-tab-indicator"
                                className={cn(
                                    "absolute inset-0 -z-10",
                                    variant === 'pill' && "bg-accent rounded-lg shadow-lg shadow-accent/25",
                                    variant === 'boxed' && "bg-white/10 rounded-lg border border-white/20",
                                    variant === 'underline' && "bg-transparent border-b-2 border-accent rounded-none top-auto bottom-0 h-0.5"
                                )}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 35,
                                }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

// Tab Content component for managing content visibility
export interface TabContentProps {
    value: string;
    activeTab: string;
    children: React.ReactNode;
    className?: string;
}

export const TabContent = ({ value, activeTab, children, className }: TabContentProps) => {
    if (value !== activeTab) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};`,
        usage: `import { MorphingTabs } from '@/components/MorphingTabs';
import { Home, Search, Settings } from 'lucide-react';

export const TabVariants = () => {
    return (
        <div className="space-y-8">
            {/* Pill Variant - Filled background indicator */}
            <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                    Pill Variant
                </p>
                <MorphingTabs
                    tabs={[
                        { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
                        { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
                        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                    ]}
                    variant="pill"
                    onChange={(tabId) => console.log('Selected:', tabId)}
                />
            </div>

            {/* Boxed Variant - Subtle border indicator */}
            <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                    Boxed Variant
                </p>
                <MorphingTabs
                    tabs={[
                        { id: 'overview', label: 'Overview' },
                        { id: 'analytics', label: 'Analytics' },
                        { id: 'reports', label: 'Reports' },
                    ]}
                    variant="boxed"
                />
            </div>

            {/* Underline Variant - Bottom border indicator */}
            <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                    Underline Variant
                </p>
                <MorphingTabs
                    tabs={[
                        { id: 'all', label: 'All Posts' },
                        { id: 'published', label: 'Published' },
                        { id: 'drafts', label: 'Drafts' },
                    ]}
                    variant="underline"
                />
            </div>
        </div>
    );
};`
    },
    'spotlight-effect': {
        id: 'spotlight-effect',
        name: 'Spotlight Effect',
        description: 'A mouse-following spotlight glow effect that dynamically highlights content as the cursor moves.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Components',
        code: `import React, { useRef } from 'react';
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
    const spotlightBackground = useMotionTemplate\`radial-gradient(\${spotlightSize}px circle at \${springX}px \${springY}px, \${spotlightColor}, transparent 80%)\`;
    
    // Border glow with stronger color
    const borderGlowColor = spotlightColor.replace(/[\\d.]+\\)$/, '0.4)');
    const borderBackground = useMotionTemplate\`radial-gradient(\${spotlightSize * 0.8}px circle at \${springX}px \${springY}px, \${borderGlowColor}, transparent 60%)\`;

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
};`,
        usage: `import { SpotlightEffect, SpotlightCard } from '@/components/SpotlightEffect';
import { Sparkles, Zap, Star } from 'lucide-react';

export const SpotlightDemo = () => {
    return (
        <div className="space-y-8">
            {/* Basic Spotlight Effect */}
            <SpotlightEffect className="p-8 bg-black/50">
                <div className="text-center">
                    <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                        Hover to Reveal
                    </h3>
                    <p className="text-gray-400">
                        Move your cursor to see the spotlight effect
                    </p>
                </div>
            </SpotlightEffect>

            {/* Custom Color Spotlight */}
            <SpotlightEffect 
                spotlightColor="rgba(59, 130, 246, 0.2)"
                spotlightSize={300}
                className="p-8 bg-black/50"
            >
                <div className="text-center">
                    <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white">
                        Blue Spotlight
                    </h3>
                </div>
            </SpotlightEffect>

            {/* Spotlight Cards Grid */}
            <div className="grid grid-cols-3 gap-4">
                <SpotlightCard>
                    <Star className="w-8 h-8 text-yellow-500 mb-2" />
                    <h4 className="font-semibold text-white">Feature One</h4>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(34, 197, 94, 0.15)">
                    <Star className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-semibold text-white">Feature Two</h4>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.15)">
                    <Star className="w-8 h-8 text-red-500 mb-2" />
                    <h4 className="font-semibold text-white">Feature Three</h4>
                </SpotlightCard>
            </div>
        </div>
    );
};`
    },
    'wormhole-portal': {
        id: 'wormhole-portal',
        name: 'Wormhole Portal',
        description: 'An infinite tunnel effect with particle acceleration and gravitational lensing. Creates a mesmerizing spacetime distortion visualization.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Backgrounds',
        code: `// Note: This component requires custom hooks. Install dependencies first.
// Create: src/hooks/useCanvas.ts, src/hooks/useAnimationFrame.ts, src/hooks/useReducedMotion.ts

import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useCanvas } from '../hooks/useCanvas';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface WormholePortalProps {
    children?: React.ReactNode;
    className?: string;
    intensity?: number; // 0-1, particle density
    speed?: number; // animation speed multiplier
    color?: string; // primary vortex color
    distortion?: number; // 0-1, edge warping strength
    interactive?: boolean; // mouse influence
}

interface Particle {
    x: number;
    y: number;
    z: number;
    angle: number;
    speed: number;
    size: number;
    opacity: number;
    hue: number;
}

export const WormholePortal = ({
    children,
    className,
    intensity = 0.8,
    speed = 1.0,
    color = '#8B5CF6',
    distortion = 0.3,
    interactive = true,
}: WormholePortalProps) => {
    const prefersReducedMotion = useReducedMotion();
    const [canvasRef, ctx] = useCanvas({ devicePixelRatio: true });
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const timeRef = useRef(0);

    // Full implementation in actual component file
    // See: src/components/WormholePortal.tsx

    if (prefersReducedMotion) {
        return (
            <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
                <div className="absolute inset-0" style={{ background: \`radial-gradient(circle at center, \${color}20 0%, transparent 70%)\` }} />
                <div className="relative z-10 w-full h-full">{children}</div>
            </div>
        );
    }

    return (
        <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 w-full h-full">{children}</div>
        </div>
    );
};`,
        usage: `import { WormholePortal } from '@/components/WormholePortal';

export const HeroSection = () => {
    return (
        <div className="h-screen w-full">
            {/* Full-screen background */}
            <WormholePortal intensity={0.8} speed={1.2} interactive>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-white mb-4">
                            Enter the Vortex
                        </h1>
                        <p className="text-xl text-gray-300">
                            Experience spacetime distortion
                        </p>
                    </div>
                </div>
            </WormholePortal>

            {/* Custom color */}
            <WormholePortal 
                color="#3B82F6" 
                intensity={0.6} 
                distortion={0.5}
                className="h-96"
            >
                <div className="p-8">
                    <h2>Blue Wormhole</h2>
                </div>
            </WormholePortal>

            {/* Non-interactive */}
            </WormholePortal>
        </div>
    );
};`
    },
    'timeline': {
        id: 'timeline',
        name: 'Timeline',
        description: 'A beautiful timeline component for displaying events, milestones, or project progress with scroll-reveal animations.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Components',
        code: `import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export interface TimelineItem {
    id: string;
    date: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    color?: string;
}

interface TimelineProps {
    items: TimelineItem[];
    orientation?: 'vertical' | 'horizontal';
    alternating?: boolean;
    className?: string;
    lineColor?: string;
    animated?: boolean;
}

export const Timeline = ({
    items,
    orientation = 'vertical',
    alternating = true,
    className,
    lineColor = 'bg-white/20',
    animated = true,
}: TimelineProps) => {
    if (orientation === 'horizontal') {
        return (
            <div className={cn("relative w-full overflow-x-auto", className)}>
                <div className={cn("absolute top-8 left-0 right-0 h-0.5", lineColor)} />
                
                <div className="flex gap-8 px-4 py-4 min-w-max">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="relative flex flex-col items-center min-w-[200px]"
                            initial={animated ? { opacity: 0, y: 20 } : undefined}
                            whileInView={animated ? { opacity: 1, y: 0 } : undefined}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <div className={cn(
                                "relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 border-white/20 bg-gray-900/80 backdrop-blur-sm shadow-lg",
                                "hover:scale-110 hover:border-accent transition-all duration-300"
                            )}>
                                {item.icon ? (
                                    <span className="text-accent">{item.icon}</span>
                                ) : (
                                    <span className="w-3 h-3 rounded-full bg-accent" />
                                )}
                            </div>
                            
                            <div className="mt-4 text-center">
                                <span className="text-xs font-medium text-accent uppercase tracking-wider">
                                    {item.date}
                                </span>
                                <h3 className="mt-1 text-lg font-semibold text-white">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="mt-1 text-sm text-gray-400 max-w-[180px]">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative", className)}>
            <div className={cn(
                "absolute left-1/2 -translate-x-1/2 w-0.5 h-full",
                lineColor,
                !alternating && "left-8"
            )} />
            
            <div className="relative space-y-12">
                {items.map((item, index) => {
                    const isLeft = alternating ? index % 2 === 0 : false;
                    
                    return (
                        <motion.div
                            key={item.id}
                            className={cn(
                                "relative flex items-center",
                                alternating ? "justify-center" : "justify-start pl-16"
                            )}
                            initial={animated ? { 
                                opacity: 0, 
                                x: alternating ? (isLeft ? -50 : 50) : -30 
                            } : undefined}
                            whileInView={animated ? { opacity: 1, x: 0 } : undefined}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
                        >
                            <div className={cn(
                                "relative w-[calc(50%-2rem)] p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm",
                                "hover:bg-white/10 hover:border-white/20 transition-all duration-300 group",
                                alternating 
                                    ? (isLeft ? "mr-auto text-right" : "ml-auto text-left")
                                    : "w-full text-left"
                            )}>
                                <div className={cn(
                                    "absolute top-1/2 -translate-y-1/2 w-8 h-0.5",
                                    lineColor,
                                    "group-hover:bg-accent/50 transition-colors",
                                    alternating ? (isLeft ? "-right-8" : "-left-8") : "-left-8"
                                )} />
                                
                                <span className="text-xs font-medium text-accent uppercase tracking-wider">
                                    {item.date}
                                </span>
                                <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-accent transition-colors">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="mt-2 text-sm text-gray-400">{item.description}</p>
                                )}
                            </div>
                            
                            <div className={cn(
                                "absolute left-1/2 -translate-x-1/2 z-10",
                                "flex items-center justify-center w-12 h-12 rounded-full",
                                "border-2 border-white/20 bg-gray-900/90 backdrop-blur-sm",
                                "hover:scale-110 hover:border-accent transition-all duration-300",
                                "shadow-[0_0_20px_rgba(139,92,246,0.3)]",
                                !alternating && "left-8"
                            )}>
                                {item.icon ? (
                                    <span className="text-accent">{item.icon}</span>
                                ) : (
                                    <motion.div 
                                        className="w-2.5 h-2.5 rounded-full bg-accent"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};`,
        usage: `import { Timeline, TimelineItem } from '@/components/Timeline';
import { Rocket, Star, Flag, Trophy, Code, Zap } from 'lucide-react';

const milestones: TimelineItem[] = [
    {
        id: '1',
        date: 'January 2024',
        title: 'Project Kickoff',
        description: 'Initial planning and team formation.',
        icon: <Rocket className="w-5 h-5" />,
    },
    {
        id: '2',
        date: 'March 2024',
        title: 'Alpha Release',
        description: 'First internal test version deployed.',
        icon: <Code className="w-5 h-5" />,
    },
    {
        id: '3',
        date: 'June 2024',
        title: 'Beta Launch',
        description: 'Public beta with early adopters.',
        icon: <Star className="w-5 h-5" />,
    },
    {
        id: '4',
        date: 'September 2024',
        title: 'Version 1.0',
        description: 'Official production release!',
        icon: <Trophy className="w-5 h-5" />,
    },
];

export const ProjectTimeline = () => (
    <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Journey
        </h2>
        
        {/* Vertical Alternating (default) */}
        <Timeline items={milestones} />
        
        {/* Horizontal */}
        <Timeline items={milestones} orientation="horizontal" className="mt-16" />
        
        {/* Vertical Non-Alternating */}
        <Timeline items={milestones} alternating={false} className="mt-16" />
    </div>
);`
    },
    'kanban-board': {
        id: 'kanban-board',
        name: 'Kanban Board',
        description: 'A drag-and-drop task board with columns, cards, filtering, sorting, and WIP limits.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Components',
        code: `import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { cn } from '../lib/utils';
import { Plus, MoreHorizontal, GripVertical, Filter, ArrowUpDown } from 'lucide-react';

export interface KanbanCard {
    id: string;
    title: string;
    description?: string;
    labels?: { text: string; color: string }[];
    assignee?: { name: string; avatar?: string };
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface KanbanColumn {
    id: string;
    title: string;
    cards: KanbanCard[];
    color?: string;
    wipLimit?: number;
}

interface KanbanBoardProps {
    columns: KanbanColumn[];
    onColumnsChange?: (columns: KanbanColumn[]) => void;
    onCardClick?: (card: KanbanCard, columnId: string) => void;
    onAddCard?: (columnId: string) => void;
    className?: string;
}

const priorityColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const Card = ({ card, onClick }: { card: KanbanCard; onClick?: () => void }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={cn(
            "p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer",
            "hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
        )}
    >
        {card.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
                {card.labels.map((label, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: label.color + '30', color: label.color }}>
                        {label.text}
                    </span>
                ))}
            </div>
        )}
        <h4 className="text-sm font-medium text-white mb-1 group-hover:text-accent transition-colors">
            {card.title}
        </h4>
        {card.description && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{card.description}</p>}
        <div className="flex items-center justify-between mt-2">
            {card.priority && (
                <span className={cn("text-[10px] px-2 py-0.5 rounded border font-medium uppercase", priorityColors[card.priority])}>
                    {card.priority}
                </span>
            )}
            {card.dueDate && <span className="text-[10px] text-gray-500">{card.dueDate}</span>}
            {card.assignee && (
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-medium text-accent">
                    {card.assignee.name.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    </motion.div>
);

export const KanbanBoard = ({ columns: initialColumns, onColumnsChange, onCardClick, onAddCard, className }: KanbanBoardProps) => {
    const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState<'none' | 'priority' | 'date'>('none');

    const updateColumns = useCallback((newColumns: KanbanColumn[]) => {
        setColumns(newColumns);
        onColumnsChange?.(newColumns);
    }, [onColumnsChange]);

    const handleCardsReorder = useCallback((columnId: string, newCards: KanbanCard[]) => {
        updateColumns(columns.map(col => col.id === columnId ? { ...col, cards: newCards } : col));
    }, [columns, updateColumns]);

    const getProcessedColumns = useCallback(() => {
        return columns.map(col => {
            let cards = [...col.cards];
            if (filterText) {
                cards = cards.filter(card => 
                    card.title.toLowerCase().includes(filterText.toLowerCase())
                );
            }
            if (sortBy === 'priority') {
                const order = { high: 0, medium: 1, low: 2 };
                cards.sort((a, b) => (order[a.priority || 'low']) - (order[b.priority || 'low']));
            }
            return { ...col, cards };
        });
    }, [columns, filterText, sortBy]);

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="flex items-center gap-4 mb-4 px-2">
                <div className="relative flex-1 max-w-xs">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" placeholder="Filter cards..." value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50" />
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                    <option value="none">No sorting</option>
                    <option value="priority">Priority</option>
                    <option value="date">Due Date</option>
                </select>
            </div>
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 p-2 min-h-full">
                    {getProcessedColumns().map((column) => (
                        <div key={column.id} className="flex-shrink-0 w-72 bg-white/[0.02] rounded-xl border border-white/10 flex flex-col max-h-full">
                            <div className="p-3 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {column.color && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />}
                                    <h3 className="text-sm font-semibold text-white">{column.title}</h3>
                                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-gray-400">
                                        {column.cards.length}{column.wipLimit && \`/\${column.wipLimit}\`}
                                    </span>
                                </div>
                                <button className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/10">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                                <Reorder.Group axis="y" values={column.cards} onReorder={(cards) => handleCardsReorder(column.id, cards)} className="space-y-2">
                                    <AnimatePresence>
                                        {column.cards.map((card) => (
                                            <Reorder.Item key={card.id} value={card}>
                                                <Card card={card} onClick={() => onCardClick?.(card, column.id)} />
                                            </Reorder.Item>
                                        ))}
                                    </AnimatePresence>
                                </Reorder.Group>
                            </div>
                            <div className="p-2 border-t border-white/10">
                                <button onClick={() => onAddCard?.(column.id)}
                                    className="w-full py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Card
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};`,
        usage: `import { KanbanBoard, KanbanColumn } from '@/components/KanbanBoard';

const initialColumns: KanbanColumn[] = [
    {
        id: 'todo',
        title: 'To Do',
        color: '#EF4444',
        wipLimit: 5,
        cards: [
            { id: '1', title: 'Design system update', priority: 'high', labels: [{ text: 'Design', color: '#8B5CF6' }] },
            { id: '2', title: 'API integration', priority: 'medium', assignee: { name: 'John' } },
        ],
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        color: '#F59E0B',
        cards: [
            { id: '3', title: 'User authentication', priority: 'high', dueDate: 'Jan 25' },
        ],
    },
    {
        id: 'done',
        title: 'Done',
        color: '#22C55E',
        cards: [
            { id: '4', title: 'Project setup', priority: 'low' },
        ],
    },
];

export const TaskBoard = () => (
    <div className="h-[600px] bg-gray-900 p-4 rounded-xl">
        <KanbanBoard
            columns={initialColumns}
            onColumnsChange={(cols) => console.log('Updated:', cols)}
            onCardClick={(card) => console.log('Clicked:', card)}
            onAddCard={(colId) => console.log('Add to:', colId)}
        />
    </div>
);`
    },
    'file-upload': {
        id: 'file-upload',
        name: 'File Upload Zone',
        description: 'Advanced file uploader with drag-and-drop, preview thumbnails, progress bars, and paste support.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Components',
        code: `import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Upload, X, File, Image, FileText, Film, Music, Archive, Check, AlertCircle } from 'lucide-react';

export interface UploadFile {
    id: string;
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    preview?: string;
    error?: string;
}

interface FileUploadZoneProps {
    onFilesSelected?: (files: File[]) => void;
    onUpload?: (files: File[]) => Promise<void>;
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
    multiple?: boolean;
    className?: string;
}

const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf')) return FileText;
    return File;
};

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const FileUploadZone = ({
    onFilesSelected,
    onUpload,
    accept = '*',
    maxSize = 10 * 1024 * 1024,
    maxFiles = 10,
    multiple = true,
    className,
}: FileUploadZoneProps) => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Component implementation...
    // See full component for complete code
    
    return (
        <div className={cn("w-full", className)}>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); /* process files */ }}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer",
                    "flex flex-col items-center justify-center gap-4 min-h-[200px]",
                    isDragOver ? "border-accent bg-accent/10" : "border-white/20 bg-white/[0.02]"
                )}
            >
                <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" />
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-white">Drag & drop or click to browse</p>
            </div>
        </div>
    );
};`,
        usage: `import { FileUploadZone } from '@/components/FileUploadZone';

export const UploadDemo = () => (
    <div className="max-w-lg mx-auto p-8">
        <FileUploadZone
            accept="image/*,.pdf,.doc,.docx"
            maxSize={5 * 1024 * 1024} // 5MB
            maxFiles={5}
            multiple={true}
            onFilesSelected={(files) => console.log('Selected:', files)}
            onUpload={async (files) => {
                // Your upload logic here
                console.log('Uploading:', files);
            }}
        />
    </div>
);`
    },
    'calendar': {
        id: 'calendar',
        name: 'Calendar',
        description: 'Full-featured calendar with month view, date selection, range picking, and event markers.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Components',
        code: `import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Types and helpers included in full component...

export const Calendar = ({ value, onChange, events = [], className }: CalendarProps) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? today.getMonth());
    const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? today.getFullYear());

    // Generate and render calendar grid...
    return (
        <div className={cn("w-full max-w-sm", className)}>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {/* Header with navigation */}
                {/* Day headers */}
                {/* Calendar grid with dates */}
            </div>
        </div>
    );
};

export const DatePicker = ({ value, onChange, placeholder = "Select date" }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="...">
                <CalendarIcon className="w-4 h-4" />
                {value ? value.toLocaleDateString() : placeholder}
            </button>
            {isOpen && <Calendar value={value} onChange={onChange} />}
        </div>
    );
};`,
        usage: `import { Calendar, DatePicker } from '@/components/Calendar';

export const CalendarDemo = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

    const events = [
        { id: '1', title: 'Meeting', date: new Date(), color: '#8B5CF6' },
        { id: '2', title: 'Deadline', date: new Date(Date.now() + 86400000 * 3), color: '#EF4444' },
    ];

    return (
        <div className="space-y-8">
            {/* Basic Calendar */}
            <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                events={events}
            />

            {/* Date Range Selection */}
            <Calendar
                rangeMode
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onRangeChange={(start, end) => {
                    setRangeStart(start);
                    setRangeEnd(end);
                }}
            />

            {/* DatePicker Dropdown */}
            <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Pick a date"
            />
        </div>
    );
};`
    },
    'stat-card': {
        id: 'stat-card',
        name: 'Stats & Metrics',
        description: 'Versatile statistic cards with trends, sparklines, and animated counters. Supports multiple layout variants.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Components',
        code: `import React, { useEffect, useMemo, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { cn } from '../lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus, Activity } from 'lucide-react';

// ... Component implementation ...
// (See full file for details)

export const StatCard = ({
    title,
    value,
    icon,
    trend,
    sparklineData,
    variant = 'default',
    color = 'blue',
    className,
}: StatCardProps) => {
    // Implementation
    return (
        <motion.div className={cn("p-5 rounded-xl border...", className)}>
            {/* Content ... */}
        </motion.div>
    );
};`,
        usage: `import { StatCard } from '@/components/StatCard';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

export const StatsDemo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Default Variant */}
        <StatCard
            title="Total Revenue"
            value={45231.89}
            prefix="$"
            decimals={2}
            trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
            sparklineData={[40, 30, 45, 50, 65, 60, 75, 80]}
            color="green"
            icon={<DollarSign />}
        />

        {/* Compact Variant */}
        <StatCard
            title="Active Users"
            value={1234}
            variant="compact"
            trend={{ value: 5.2, direction: 'down' }}
            color="blue"
        />

        {/* Minimal Variant */}
        <StatCard
            title="Conversion Rate"
            value={3.42}
            suffix="%"
            decimals={2}
            variant="minimal"
            color="purple"
            icon={<Activity />}
        />

        {/* Prominent Variant */}
        <StatCard
            title="Total Orders"
            value={854}
            variant="prominent"
            trend={{ value: 8.1, direction: 'up' }}
            sparklineData={[10, 25, 40, 30, 55, 60, 45, 80, 95]}
            color="yellow"
            icon={<ShoppingCart />}
            className="md:col-span-2"
        />
    </div>
);`
    },
    'data-table': {
        id: 'data-table',
        name: 'Advanced Data Table',
        description: 'Feature-rich data table with sorting, filtering, selection, pagination, and CSV export.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Components',
        code: `import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  rowsPerPage?: number;
  className?: string;
}

export function DataTable<T extends { id: string | number } & Record<string, any>>({ 
  data, 
  columns, 
  title = "Data Table",
  searchable = true,
  selectable = true,
  pagination = true,
  rowsPerPage = 5,
  className 
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Filter
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = pagination 
    ? sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : sortedData;

  const handleSort = (key: keyof T) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' } 
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  const toggleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const exportCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => JSON.stringify(row[col.key])).join(',')
    ).join('\\n');
    
    const blob = new Blob([\\\`\\\${headers}\\\n\\\${rows}\\\`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
  };

  return (
    <div className={cn("w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden", className)}>
      {/* Search and Export Header */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
           <h3 className="text-lg font-semibold text-white">{title}</h3>
           <p className="text-sm text-gray-400">{sortedData.length} entries found</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchable && (
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          )}
          <button onClick={exportCSV} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Table implementation... (see full source) */}
    </div>
  );
}`,
        usage: `import { DataTable, Column } from '@/components/DataTable';

interface User {
  id: number;
  name: string;
  role: string;
  status: string;
  email: string;
}

const columns: Column<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    render: (value) => (
      <span className={\\\`px-2 py-1 rounded-full text-xs font-medium \\\${
        value === 'Active' ? 'bg-green-500/10 text-green-500' : 
        value === 'Inactive' ? 'bg-gray-500/10 text-gray-500' : 
        'bg-yellow-500/10 text-yellow-500'
      }\\\`}>
        {value}
      </span>
    )
  },
  { key: 'email', label: 'Email' },
];

const data = [
  { id: 1, name: 'Alice Johnson', role: 'Admin', status: 'Active', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', role: 'Member', status: 'Inactive', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', role: 'Editor', status: 'Active', email: 'charlie@example.com' },
  { id: 4, name: 'David Wilson', role: 'Member', status: 'Pending', email: 'david@example.com' },
  { id: 5, name: 'Eva Green', role: 'Admin', status: 'Active', email: 'eva@example.com' },
];

export const DataTableDemo = () => (
  <div className="p-4">
    <DataTable
      columns={columns}
      data={data}
      title="Team Members"
      rowsPerPage={3}
    />
  </div>
);`
    }
};
