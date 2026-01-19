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
import { Search, Home, Settings, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TeleportSearch = () => {
    const [open, setOpen] = useState(false);
    const { toggleTheme, emit, on } = useNexus();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);

        // Listen for global open event
        const cleanup = on('command-palette:open', () => setOpen(true));

        return () => {
            document.removeEventListener('keydown', down);
            cleanup();
        };
    }, [on]);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Dialog */}
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

                                <Command.Group heading="Navigation" className="text-xs font-medium text-gray-400 px-2 py-1.5 mb-2">
                                    <Command.Item
                                        onSelect={() => runCommand(() => emit('navigate', 'home'))}
                                        className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm text-gray-200 outline-none hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    >
                                        <Home className="mr-2 h-4 w-4" />
                                        <span>Home</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => emit('navigate', 'components'))}
                                        className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm text-gray-200 outline-none hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-white"
                                    >
                                        <Layout className="mr-2 h-4 w-4" />
                                        <span>Components</span>
                                    </Command.Item>
                                </Command.Group>

                                <Command.Group heading="Settings" className="text-xs font-medium text-gray-400 px-2 py-1.5 mb-2">
                                    <Command.Item
                                        onSelect={() => runCommand(() => toggleTheme())}
                                        className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm text-gray-200 outline-none hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-white"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Toggle Theme</span>
                                    </Command.Item>
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};`,
        usage: `<TeleportSearch />`
    }
};
