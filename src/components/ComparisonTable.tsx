import React from 'react';
import { Check, Minus, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export interface Plan {
    id: string;
    name: string;
    price: string;
    period?: string;
    description?: string;
    isRecommended?: boolean;
    buttonText?: string;
    onAction?: () => void;
}

export interface Feature {
    id: string;
    name: string;
    helpText?: string;
    category?: string;
}

export interface ComparisonData {
    [featureId: string]: {
        [planId: string]: boolean | string | React.ReactNode;
    };
}

export interface ComparisonTableProps {
    plans: Plan[];
    features: Feature[];
    data: ComparisonData;
    className?: string;
}

export const ComparisonTable = ({ plans, features, data, className }: ComparisonTableProps) => {
    // Group features by category
    const featuresByCategory = features.reduce((acc, feature) => {
        const category = feature.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(feature);
        return acc;
    }, {} as Record<string, Feature[]>);

    const categories = Object.keys(featuresByCategory);

    return (
        <div className={cn("w-full max-w-full overflow-x-auto pb-4", className)}>
            <div className="min-w-[900px]">
                {/* Plans Header */}
                <div
                    className="grid gap-0 sticky top-0 z-20"
                    style={{ gridTemplateColumns: `300px repeat(${plans.length}, 1fr)` }}
                >
                    <div className="p-8 bg-black/80 backdrop-blur-xl border-b border-r border-white/5 rounded-tl-2xl flex flex-col justify-end">
                        <h2 className="text-2xl font-bold text-white">Compare Plans</h2>
                        <p className="text-gray-400 text-sm mt-2">Find the perfect plan for you.</p>
                    </div>
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={cn(
                                "p-8 border-b border-r border-white/5 flex flex-col relative bg-black/80 backdrop-blur-xl",
                                index === plans.length - 1 && "border-r-0 rounded-tr-2xl",
                                plan.isRecommended && "bg-accent/5"
                            )}
                        >
                            {plan.isRecommended && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider rounded-full border border-accent/20">
                                        Recommended
                                    </span>
                                </div>
                            )}
                            <div className="flex-1 mt-4">
                                <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-sm text-gray-400">{plan.period}</span>}
                                </div>
                                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
                            </div>
                            <button
                                onClick={plan.onAction}
                                className={cn(
                                    "w-full py-2.5 rounded-xl text-sm font-medium transition-all",
                                    plan.isRecommended
                                        ? "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20"
                                        : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                                )}
                            >
                                {plan.buttonText || "Choose Plan"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="bg-white/[0.02] border-x border-b border-white/5 rounded-b-2xl">
                    {categories.map((category) => (
                        <div key={category}>
                            {category !== 'General' && (
                                <div className="px-8 py-3 bg-white/5 border-y border-white/5">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{category}</span>
                                </div>
                            )}

                            {featuresByCategory[category].map((feature, featureIdx) => (
                                <div
                                    key={feature.id}
                                    className={cn(
                                        "grid group hover:bg-white/[0.02] transition-colors",
                                        featureIdx !== featuresByCategory[category].length - 1 && "border-b border-white/5"
                                    )}
                                    style={{ gridTemplateColumns: `300px repeat(${plans.length}, 1fr)` }}
                                >
                                    <div className="p-4 pl-8 flex items-center gap-2 border-r border-white/5">
                                        <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                                            {feature.name}
                                        </span>
                                        {feature.helpText && (
                                            <div className="group/tooltip relative">
                                                <HelpCircle className="w-3.5 h-3.5 text-gray-500 hover:text-gray-400 cursor-help" />
                                                {/* Tooltip implementation if needed */}
                                            </div>
                                        )}
                                    </div>
                                    {plans.map((plan) => {
                                        const value = data[feature.id]?.[plan.id];
                                        return (
                                            <div
                                                key={`${plan.id}-${feature.id}`}
                                                className={cn(
                                                    "p-4 flex items-center justify-center border-r border-white/5 last:border-r-0",
                                                    plan.isRecommended && "bg-accent/[0.01]"
                                                )}
                                            >
                                                {typeof value === 'boolean' ? (
                                                    value ? (
                                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                                            <Check className="w-3.5 h-3.5 text-green-500" />
                                                        </div>
                                                    ) : (
                                                        <Minus className="w-4 h-4 text-gray-700" />
                                                    )
                                                ) : (
                                                    <span className="text-sm text-gray-300 font-medium">{value}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
