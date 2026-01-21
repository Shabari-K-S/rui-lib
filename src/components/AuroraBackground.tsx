import { motion } from 'framer-motion';
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
};
