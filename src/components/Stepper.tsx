import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface Step {
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    status?: 'pending' | 'current' | 'completed' | 'error';
}

export interface StepperProps {
    steps: Step[];
    currentStep: number;
    orientation?: 'horizontal' | 'vertical';
    onStepClick?: (stepIndex: number) => void;
    className?: string;
}

export const Stepper = ({
    steps,
    currentStep,
    orientation = 'horizontal',
    onStepClick,
    className
}: StepperProps) => {
    return (
        <div className={cn(
            "w-full",
            orientation === 'vertical' ? "flex flex-col" : "flex flex-row items-center",
            className
        )}>
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isError = step.status === 'error';

                // Override derived status if step explicitly has error
                const status = isError ? 'error' : (isCompleted ? 'completed' : (isCurrent ? 'current' : 'pending'));

                return (
                    <React.Fragment key={step.id}>
                        <div
                            className={cn(
                                "relative z-10 flex items-center gap-4 group cursor-pointer",
                                orientation === 'vertical' ? "pb-12 last:pb-0" : "flex-col md:flex-row md:gap-3 text-center md:text-left flex-1"
                            )}
                            onClick={() => onStepClick?.(index)}
                        >
                            {/* Step Indicator */}
                            <motion.div
                                layout
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-500",
                                    status === 'completed' && "bg-accent border-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]",
                                    status === 'current' && "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110",
                                    status === 'pending' && "bg-black/40 border-white/10 text-gray-500 group-hover:border-white/30 group-hover:text-gray-400",
                                    status === 'error' && "bg-red-500/10 border-red-500/50 text-red-500"
                                )}
                            >
                                {step.icon ? (
                                    <div className="w-4 h-4">{step.icon}</div>
                                ) : (
                                    status === 'completed' ? <Check className="w-4 h-4" /> :
                                        status === 'error' ? <X className="w-4 h-4" /> :
                                            <span>{index + 1}</span>
                                )}
                            </motion.div>

                            {/* Label & Description */}
                            <div className={cn(
                                "flex flex-col transition-opacity duration-300",
                                orientation === 'horizontal' && "items-center md:items-start",
                                status === 'pending' ? "opacity-50 group-hover:opacity-80" : "opacity-100"
                            )}>
                                <span className={cn(
                                    "text-sm font-medium tracking-wide",
                                    status === 'current' ? "text-white" : "text-gray-300",
                                    status === 'error' && "text-red-400"
                                )}>
                                    {step.label}
                                </span>
                                {step.description && (
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-0.5">
                                        {step.description}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Connector Line */}
                        {!isLast && (
                            <div className={cn(
                                "relative flex-1 bg-white/5 overflow-hidden rounded-full",
                                orientation === 'vertical' ?
                                    "absolute left-4 top-8 bottom-0 w-[2px] -ml-[1px] h-[calc(100%-32px)]" :
                                    "h-[2px] min-w-[2rem] mx-2 hidden md:block mt-4 md:mt-0"
                            )}>
                                <motion.div
                                    initial={{ width: '0%', height: '0%' }}
                                    animate={{
                                        width: orientation === 'horizontal' ? (index < currentStep ? '100%' : '0%') : '100%',
                                        height: orientation === 'vertical' ? (index < currentStep ? '100%' : '0%') : '100%'
                                    }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className={cn(
                                        "absolute top-0 left-0 bg-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]",
                                        orientation === 'horizontal' && "h-full",
                                        orientation === 'vertical' && "w-full"
                                    )}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
