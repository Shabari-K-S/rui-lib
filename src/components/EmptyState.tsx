import React from 'react';
import { motion } from 'framer-motion';
import { Search, FolderOpen, AlertTriangle, FileQuestion, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'default' | 'search' | 'error' | 'folder';
    className?: string;
}

const variants = {
    default: {
        icon: FileQuestion,
        color: "text-gray-400",
        bg: "bg-gray-500/10",
        border: "border-gray-500/20"
    },
    search: {
        icon: Search,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    error: {
        icon: AlertTriangle,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    },
    folder: {
        icon: FolderOpen,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20"
    }
};

export const EmptyState = ({
    title,
    description,
    icon,
    action,
    variant = 'default',
    className
}: EmptyStateProps) => {
    const style = variants[variant];
    const IconComponent = style.icon;

    return (
        <div className={cn(
            "flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed bg-black/20 backdrop-blur-sm",
            "min-h-[300px] w-full max-w-lg mx-auto",
            style.border,
            className
        )}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center mb-6",
                    style.bg
                )}>
                    {icon ? (
                        <div className={cn(style.color)}>{icon}</div>
                    ) : (
                        <IconComponent className={cn("w-10 h-10", style.color)} />
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="max-w-xs"
            >
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 mb-8">{description}</p>
            </motion.div>

            {action && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <button
                        onClick={action.onClick}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95",
                            "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        )}
                    >
                        {variant === 'default' && <Plus className="w-4 h-4" />}
                        {action.label}
                    </button>
                    {/* Alternatively use MagneticButton if preferred */}
                </motion.div>
            )}
        </div>
    );
};
