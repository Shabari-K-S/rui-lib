import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    title?: string;
    description: string;
    type?: ToastType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    toast: (props: Omit<Toast, 'id'>) => void;
    dismiss: (id: string) => void;
}

// --- Context ---
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// --- Component ---
const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
    };

    React.useEffect(() => {
        if (toast.duration !== Infinity) {
            const timer = setTimeout(() => {
                onDismiss(toast.id);
            }, toast.duration || 5000);
            return () => clearTimeout(timer);
        }
    }, [toast, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="w-full max-w-sm pointer-events-auto"
        >
            <div className={cn(
                "relative group overflow-hidden p-4 rounded-xl border backdrop-blur-xl shadow-2xl",
                "flex items-start gap-4 transition-all duration-300",
                toast.type === 'success' && "bg-green-500/10 border-green-500/20 shadow-green-500/10",
                toast.type === 'error' && "bg-red-500/10 border-red-500/20 shadow-red-500/10",
                toast.type === 'warning' && "bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/10",
                toast.type === 'info' && "bg-blue-500/10 border-blue-500/20 shadow-blue-500/10",
                !toast.type && "bg-black/80 border-white/10"
            )}>
                {/* Glow Effect */}
                <div className={cn(
                    "absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent pointer-events-none",
                )} />

                <div className="flex-shrink-0 mt-0.5">
                    {toast.type && icons[toast.type]}
                </div>

                <div className="flex-1 min-w-0">
                    {toast.title && (
                        <h4 className={cn(
                            "text-sm font-semibold mb-1",
                            toast.type === 'success' && "text-green-400",
                            toast.type === 'error' && "text-red-400",
                            toast.type === 'warning' && "text-yellow-400",
                            toast.type === 'info' && "text-blue-400",
                            !toast.type && "text-white"
                        )}>
                            {toast.title}
                        </h4>
                    )}
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {toast.description}
                    </p>

                    {toast.action && (
                        <button
                            onClick={toast.action.onClick}
                            className="mt-3 text-xs font-medium text-white underline underline-offset-2 hover:text-gray-200 transition-colors"
                        >
                            {toast.action.label}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => onDismiss(toast.id)}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

// --- Provider ---
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((props: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...props, id }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <div className="fixed z-[100] bottom-4 right-4 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                <AnimatePresence mode='popLayout'>
                    {toasts.map((t) => (
                        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
