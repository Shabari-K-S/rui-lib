import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export interface TimelineItem {
    id: string;
    date: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    color?: string; // Tailwind color class or hex
}

interface TimelineProps {
    items: TimelineItem[];
    orientation?: 'vertical' | 'horizontal';
    alternating?: boolean; // Only for vertical - items alternate left/right
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
                {/* Horizontal Line */}
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
                            {/* Node */}
                            <div
                                className={cn(
                                    "relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 border-white/20 bg-gray-900/80 backdrop-blur-sm shadow-lg",
                                    "hover:scale-110 hover:border-accent transition-all duration-300"
                                )}
                                style={item.color ? { borderColor: item.color } : undefined}
                            >
                                {item.icon ? (
                                    <span className="text-accent">{item.icon}</span>
                                ) : (
                                    <span
                                        className="w-3 h-3 rounded-full bg-accent"
                                        style={item.color ? { backgroundColor: item.color } : undefined}
                                    />
                                )}
                            </div>

                            {/* Content */}
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

    // Vertical Layout
    return (
        <div className={cn("relative", className)}>
            {/* Vertical Line */}
            <div
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 w-0.5 h-full",
                    lineColor,
                    !alternating && "left-8"
                )}
            />

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
                            transition={{
                                delay: index * 0.15,
                                duration: 0.5,
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            {/* Content Card */}
                            <div
                                className={cn(
                                    "relative w-[calc(50%-2rem)] p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm",
                                    "hover:bg-white/10 hover:border-white/20 transition-all duration-300",
                                    "group",
                                    alternating
                                        ? (isLeft ? "mr-auto text-right" : "ml-auto text-left")
                                        : "w-full text-left"
                                )}
                            >
                                {/* Connector Line */}
                                <div
                                    className={cn(
                                        "absolute top-1/2 -translate-y-1/2 w-8 h-0.5",
                                        lineColor,
                                        "group-hover:bg-accent/50 transition-colors",
                                        alternating
                                            ? (isLeft ? "-right-8" : "-left-8")
                                            : "-left-8"
                                    )}
                                />

                                <span
                                    className="text-xs font-medium uppercase tracking-wider"
                                    style={{ color: item.color || 'rgb(139, 92, 246)' }}
                                >
                                    {item.date}
                                </span>
                                <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-accent transition-colors">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="mt-2 text-sm text-gray-400">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            {/* Node */}
                            <div
                                className={cn(
                                    "absolute left-1/2 -translate-x-1/2 z-10",
                                    "flex items-center justify-center w-12 h-12 rounded-full",
                                    "border-2 border-white/20 bg-gray-900/90 backdrop-blur-sm",
                                    "hover:scale-110 hover:border-accent transition-all duration-300",
                                    "shadow-[0_0_20px_rgba(139,92,246,0.3)]",
                                    !alternating && "left-8"
                                )}
                                style={item.color ? { borderColor: item.color } : undefined}
                            >
                                {item.icon ? (
                                    <span className="text-accent">{item.icon}</span>
                                ) : (
                                    <motion.div
                                        className="w-2.5 h-2.5 rounded-full bg-accent"
                                        style={item.color ? { backgroundColor: item.color } : undefined}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 1
                                        }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
