import React, { useEffect, useRef, useId, useMemo } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { cn } from '../lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus, Activity } from 'lucide-react';

// Types
export interface StatCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    trend?: {
        value: number; // percentage
        label?: string; // e.g., "vs last month"
        direction?: 'up' | 'down' | 'neutral';
    };
    sparklineData?: number[];
    variant?: 'default' | 'compact' | 'prominent' | 'minimal';
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
    onClick?: () => void;
}

// Helper for color classes
const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; stroke: string; glow: string; border: string }> = {
        blue: {
            bg: 'bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent',
            text: 'text-blue-500',
            stroke: '#3B82F6',
            glow: 'group-hover:shadow-blue-500/10',
            border: 'group-hover:border-blue-500/20'
        },
        green: {
            bg: 'bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent',
            text: 'text-green-500',
            stroke: '#22C55E',
            glow: 'group-hover:shadow-green-500/10',
            border: 'group-hover:border-green-500/20'
        },
        red: {
            bg: 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent',
            text: 'text-red-500',
            stroke: '#EF4444',
            glow: 'group-hover:shadow-red-500/10',
            border: 'group-hover:border-red-500/20'
        },
        yellow: {
            bg: 'bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent',
            text: 'text-yellow-500',
            stroke: '#EAB308',
            glow: 'group-hover:shadow-yellow-500/10',
            border: 'group-hover:border-yellow-500/20'
        },
        purple: {
            bg: 'bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent',
            text: 'text-purple-500',
            stroke: '#A855F7',
            glow: 'group-hover:shadow-purple-500/10',
            border: 'group-hover:border-purple-500/20'
        },
        gray: {
            bg: 'bg-gradient-to-br from-gray-500/10 via-gray-500/5 to-transparent',
            text: 'text-gray-400',
            stroke: '#9CA3AF',
            glow: 'group-hover:shadow-gray-500/10',
            border: 'group-hover:border-gray-500/20'
        },
    };
    return colors[color] || colors.blue;
};

// Animated Number Component
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0 }: { value: number | string, prefix?: string, suffix?: string, decimals?: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    // Parse value if it is a number string, otherwise return as is
    const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    const isNumber = !isNaN(numericValue);

    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => {
        if (!isNumber) return value;
        return current.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    });

    useEffect(() => {
        if (inView && isNumber) {
            spring.set(numericValue);
        }
    }, [inView, numericValue, isNumber, spring]);

    if (!isNumber) return <span>{prefix}{value}{suffix}</span>;

    return (
        <span ref={ref} className="tabular-nums tracking-tight">
            {prefix}<motion.span>{display as any}</motion.span>{suffix}
        </span>
    );
};

// Helper to generate smooth SVG path (Catmull-Rom)
const getSmoothPath = (data: number[], height: number) => {
    if (data.length === 0) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Use full height with minimal padding for bleed effect
    const padding = 2;
    const availableHeight = height - padding;

    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * 100,
        y: availableHeight - ((val - min) / range) * (availableHeight - padding) + padding
    }));

    return points.reduce((path, point, i, a) => {
        if (i === 0) return `M ${point.x},${point.y}`;

        const p0 = a[i - 2] || a[i - 1];
        const p1 = a[i - 1];
        const p2 = point;
        const p3 = a[i + 1] || point;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        return `${path} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
    }, '');
};

// Sparkline Component
const Sparkline = ({ data, color, height = 40, className }: { data: number[], color: string, height?: number, className?: string }) => {
    const id = useId();
    const path = useMemo(() => getSmoothPath(data, height), [data, height]);
    const fillPath = `${path} L 100,${height + 20} L 0,${height + 20} Z`;

    return (
        <div className={cn("w-full overflow-hidden", className)} style={{ height }}>
            <svg
                viewBox={`0 0 100 ${height}`}
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
            >
                <defs>
                    <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Fill Area */}
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    d={fillPath}
                    fill={`url(#gradient-${id})`}
                    stroke="none"
                />

                {/* Stroke Line */}
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    );
};

export const StatCard = ({
    title,
    value,
    icon,
    trend,
    sparklineData,
    variant = 'default',
    color = 'blue',
    prefix,
    suffix,
    decimals,
    className,
    onClick,
}: StatCardProps) => {
    const theme = getColorClasses(color);

    // Determine trend styles
    const trendColor = trend?.direction === 'up'
        ? 'text-emerald-400'
        : trend?.direction === 'down'
            ? 'text-rose-400'
            : 'text-zinc-400';

    const trendBg = trend?.direction === 'up'
        ? 'bg-emerald-500/10'
        : trend?.direction === 'down'
            ? 'bg-rose-500/10'
            : 'bg-zinc-500/10';

    const TrendIcon = trend?.direction === 'up'
        ? ArrowUpRight
        : trend?.direction === 'down'
            ? ArrowDownRight
            : Minus;

    // Common container styles
    const containerClasses = cn(
        "relative rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl transition-all duration-300 group cursor-pointer",
        "hover:border-white/10 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1",
        theme.border,
        theme.glow,
        className
    );

    // Variants
    if (variant === 'compact') {
        return (
            <motion.div onClick={onClick} className={cn(containerClasses, "p-5 flex items-center justify-between gap-4")}>
                <div>
                    <h4 className="text-sm font-medium text-zinc-400 mb-1">{title}</h4>
                    <div className="text-2xl font-bold text-white tracking-tight">
                        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                    </div>
                </div>
                {trend && (
                    <div className={cn("hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold", trendBg, trendColor)}>
                        <TrendIcon className="w-3.5 h-3.5" />
                        <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
                    </div>
                )}
            </motion.div>
        );
    }

    if (variant === 'minimal') {
        return (
            <motion.div onClick={onClick} className={cn(containerClasses, "p-5 flex flex-col gap-3")}>
                <div className="flex items-center gap-2.5 text-zinc-400">
                    <div className={cn("p-1.5 rounded-md bg-white/5", theme.text)}>
                        {icon || <Activity className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium">{title}</span>
                </div>
                <div className="text-3xl font-bold text-white tracking-tighter">
                    <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                </div>
            </motion.div>
        );
    }

    if (variant === 'prominent') {
        return (
            <motion.div onClick={onClick} className={cn(containerClasses, "overflow-hidden", theme.bg)}>
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className={cn("p-2.5 rounded-xl bg-white/10 backdrop-blur-md shadow-inner", theme.text)}>
                            {icon || <Activity className="w-6 h-6" />}
                        </div>
                        {trend && (
                            <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold shadow-sm", "bg-black/20 text-white")}>
                                <TrendIcon className="w-3.5 h-3.5" />
                                {trend.value > 0 ? '+' : ''}{trend.value}%
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <div className="text-4xl font-bold text-white tracking-tighter drop-shadow-sm">
                            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                        </div>
                        <p className={cn("text-sm font-medium mt-1 opacity-90", theme.text)}>
                            {title}
                        </p>
                    </div>
                </div>

                {/* Decorative Background Chart */}
                {sparklineData && (
                    <div className="absolute -bottom-1 -left-1 -right-1 h-32 opacity-25 group-hover:opacity-40 transition-all duration-500 group-hover:scale-105 origin-bottom z-0 pointer-events-none">
                        <Sparkline data={sparklineData} color={theme.stroke} height={128} />
                    </div>
                )}
            </motion.div>
        );
    }

    // Default Variant
    return (
        <motion.div onClick={onClick} className={cn(containerClasses, "overflow-hidden")}>
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
                    <div className={cn("p-2 rounded-lg bg-white/5 text-zinc-400 group-hover:bg-white/10 transition-colors", theme.text)}>
                        {icon || <Activity className="w-4 h-4" />}
                    </div>
                </div>

                <div className="mt-2">
                    <div className="flex items-end gap-3 mb-1">
                        <span className="text-3xl font-bold text-white tracking-tighter">
                            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                        </span>
                    </div>

                    {trend ? (
                        <div className="flex items-center gap-2 text-xs">
                            <span className={cn("flex items-center gap-1 font-semibold", trendColor)}>
                                <TrendIcon className="w-3.5 h-3.5" />
                                {trend.value > 0 ? '+' : ''}{trend.value}%
                            </span>
                            <span className="text-zinc-500">{trend.label || 'vs last period'}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-zinc-500 block h-4">No data available</span>
                    )}
                </div>
            </div>

            {sparklineData && (
                <div className="absolute bottom-0 left-0 right-0 h-24 opacity-40 group-hover:opacity-60 transition-all duration-500 z-0 pointer-events-none translate-y-2">
                    <Sparkline data={sparklineData} color={theme.stroke} height={96} />
                    {/* Fade overlay for bottom integration */}
                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-zinc-900/0 to-transparent" />
                </div>
            )}
        </motion.div>
    );
};
