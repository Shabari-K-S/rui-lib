import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export const AnimatedWall = ({ className }: { className?: string }) => {
    // block interface
    interface Block {
        id: number;
        x: number;
        y: number;
        duration: number;
        delay: number;
    }
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        // Create a grid of "active" blocks
        const newBlocks: Block[] = [];
        // Use window dimensions but fallback to large defaults if ssr/too early
        // (Just using large numbers ensuring coverage is easier than resizing listener for now)
        // 1920 / 64 = 30 cols. 1080 / 64 = 17 rows.
        const cols = 50;
        const rows = 30;

        // Add more active blocks for better visibility
        // 5% of grid is active
        const numBlocks = Math.floor((cols * rows) * 0.05);

        for (let i = 0; i < numBlocks; i++) {
            newBlocks.push({
                id: i,
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
                duration: 2 + Math.random() * 4, // varied duration
                delay: Math.random() * 5,
            });
        }
        setBlocks(newBlocks);
    }, []);

    return (
        <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}>
            {/* Base Grid - Increased Opacity for visibility */}
            <div
                className="absolute inset-0 opacity-[0.2]"
                style={{
                    backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem'
                }}
            />

            {/* Glowing Orbs / Active Cells */}
            {blocks.map((block) => (
                <motion.div
                    key={block.id}
                    className="absolute bg-accent/20 border border-accent/40 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur-[1px]"
                    style={{
                        left: `${block.x * 4}rem`,
                        top: `${block.y * 4}rem`,
                        width: '3.9rem',
                        height: '3.9rem',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{
                        duration: block.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: block.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Vignette - Reduced strength */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
};
