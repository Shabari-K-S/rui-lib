import React from 'react';
import { cn } from '../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton = ({
    variant = 'text',
    className,
    width,
    height,
    style,
    ...props
}: SkeletonProps) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden bg-white/5",
                "before:absolute before:inset-0 before:-translate-x-full",
                "before:animate-[shimmer_2s_infinite]",
                "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
                variant === 'text' && "w-full h-4 rounded-md",
                variant === 'circular' && "rounded-full",
                variant === 'rectangular' && "rounded-xl",
                className
            )}
            style={{
                width,
                height,
                ...style
            }}
            {...props}
        />
    );
};

// --- Presets ---

export const SkeletonProfile = () => (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm max-w-sm w-full">
        <Skeleton variant="circular" width={48} height={48} className="flex-shrink-0" />
        <div className="space-y-2 flex-1">
            <Skeleton variant="text" width="60%" className="h-4" />
            <Skeleton variant="text" width="40%" className="h-3.5" />
        </div>
    </div>
);

export const SkeletonCard = () => (
    <div className="space-y-4 p-4 rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm max-w-sm w-full">
        <Skeleton variant="rectangular" className="w-full h-48 rounded-lg" />
        <div className="space-y-2">
            <Skeleton variant="text" width="85%" className="h-5" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="75%" />
        </div>
        <div className="pt-2 flex gap-3">
            <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
            <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
        </div>
    </div>
);

export const SkeletonRow = () => (
    <div className="flex items-center gap-4 p-4 border-b border-white/5 w-full">
        <Skeleton variant="rectangular" width={24} height={24} className="rounded" />
        <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="100%" />
        </div>
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={80} />
    </div>
);
