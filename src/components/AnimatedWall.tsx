import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { cn } from '../lib/utils';

// Light beam that follows grid lines
interface GridBeam {
    id: string;
    direction: 'horizontal' | 'vertical';
    gridLine: number;
    fromStart: boolean;
    speed: number;
    color: string;
    delay: number;
    length: number;
}

export const AnimatedWall = ({ className }: { className?: string }) => {
    const gridSize = 4;
    const cols = 50;
    const rows = 30;
    const beamIdCounter = useRef(0);

    // Blue color palette
    const beamColors = [
        'rgba(59, 130, 246, 1)',
        'rgba(74, 143, 254, 1)',
        'rgba(90, 156, 254, 1)',
        'rgba(106, 169, 254, 1)',
        'rgba(122, 182, 254, 1)',
        'rgba(139, 195, 254, 1)',
        'rgba(155, 208, 254, 1)',
        'rgba(171, 221, 254, 1)',
        'rgba(187, 234, 254, 1)',
        'rgba(203, 247, 254, 1)',
    ];

    const [beams, setBeams] = useState<GridBeam[]>([]);

    // Create a single random beam
    const createBeam = (delay: number = 0): GridBeam => {
        const isHorizontal = Math.random() > 0.5;
        beamIdCounter.current += 1;

        return {
            id: `beam-${beamIdCounter.current}-${Date.now()}`,
            direction: isHorizontal ? 'horizontal' : 'vertical',
            gridLine: isHorizontal
                ? Math.floor(Math.random() * rows)
                : Math.floor(Math.random() * cols),
            fromStart: Math.random() > 0.5,
            speed: 1.5 + Math.random() * 2,
            color: beamColors[Math.floor(Math.random() * beamColors.length)],
            delay,
            length: 12 + Math.random() * 20,
        };
    };

    // Initialize beams with staggered timing
    useEffect(() => {
        const initialBeams: GridBeam[] = [];
        const numBeams = 25;

        for (let i = 0; i < numBeams; i++) {
            initialBeams.push(createBeam(i * 0.15)); // Stagger initial beams
        }
        setBeams(initialBeams);

        // Continuously spawn new beams at random intervals
        const spawnBeam = () => {
            const newBeam = createBeam(0);
            setBeams(prev => [...prev.slice(-40), newBeam]); // Keep max 40 beams
        };

        // Multiple spawn intervals for variety
        const intervals = [
            setInterval(spawnBeam, 300),
            setInterval(spawnBeam, 500),
            setInterval(spawnBeam, 700),
        ];

        return () => intervals.forEach(clearInterval);
    }, []);

    // Static glow points with variety
    const [glowPoints] = useState(() =>
        Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.floor(Math.random() * cols) * gridSize,
            y: Math.floor(Math.random() * rows) * gridSize,
            color: beamColors[Math.floor(Math.random() * beamColors.length)],
            duration: 1.5 + Math.random() * 2,
            delay: Math.random() * 3,
        }))
    );

    return (
        <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}>
            {/* Base Grid */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`,
                    backgroundSize: `${gridSize}rem ${gridSize}rem`
                }}
            />

            {/* Grid line beams */}
            {beams.map((beam) => {
                const position = beam.gridLine * gridSize;

                return (
                    <motion.div
                        key={beam.id}
                        className="absolute"
                        style={{
                            ...(beam.direction === 'horizontal'
                                ? {
                                    top: `${position}rem`,
                                    left: 0,
                                    width: `${beam.length}%`,
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${beam.color}, white, ${beam.color}, transparent)`,
                                }
                                : {
                                    left: `${position}rem`,
                                    top: 0,
                                    height: `${beam.length}%`,
                                    width: '2px',
                                    background: `linear-gradient(180deg, transparent, ${beam.color}, white, ${beam.color}, transparent)`,
                                }
                            ),
                            boxShadow: `0 0 8px ${beam.color}, 0 0 16px ${beam.color}`,
                            borderRadius: '2px',
                        }}
                        initial={{
                            ...(beam.direction === 'horizontal'
                                ? { x: beam.fromStart ? '-100%' : '100vw' }
                                : { y: beam.fromStart ? '-100%' : '100vh' }
                            ),
                        }}
                        animate={{
                            ...(beam.direction === 'horizontal'
                                ? { x: beam.fromStart ? '100vw' : '-100%' }
                                : { y: beam.fromStart ? '100vh' : '-100%' }
                            ),
                        }}
                        transition={{
                            duration: beam.speed,
                            delay: beam.delay,
                            ease: "linear",
                        }}
                    />
                );
            })}

            {/* Intersection glows */}
            {glowPoints.map((glow) => (
                <motion.div
                    key={`glow-${glow.id}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        left: `${glow.x}rem`,
                        top: `${glow.y}rem`,
                        transform: 'translate(-50%, -50%)',
                        background: glow.color,
                        boxShadow: `0 0 10px ${glow.color}, 0 0 20px ${glow.color}`,
                    }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                        duration: glow.duration,
                        delay: glow.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
        </div>
    );
};
