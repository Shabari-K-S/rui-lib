import React, { useState } from 'react';
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
};
