import { motion } from 'framer-motion';
import { Zap, Layers, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Introduction = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-12 py-8">
            <div className="space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
                >
                    Introduction to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">ReactUI</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-muted-foreground leading-relaxed"
                >
                    ReactUI is a next-generation React component library designed for building modern, high-performance, and visually stunning web applications. It combines the power of Framer Motion for animations with Tailwind CSS for styling.
                </motion.p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { title: "Motion First", icon: <Zap className="w-6 h-6 text-yellow-500" />, desc: "Every component is built with natural, spring-based physics." },
                    { title: "Glassmorphism", icon: <Layers className="w-6 h-6 text-blue-500" />, desc: "Premium glass effects and blurs out of the box." },
                    { title: "Developer DX", icon: <Code className="w-6 h-6 text-purple-500" />, desc: "Copy-paste ready code with full TypeScript support." },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="p-6 rounded-2xl bg-card border border-border shadow-sm"
                    >
                        <div className="mb-4">{item.icon}</div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Philosophy</h2>
                <p className="text-muted-foreground leading-relaxed">
                    We believe that modern interfaces should be more than just static pixels. They should react, breathe, and move with the user. ReactUI provides the building blocks to create these immersive experiences without getting bogged down in complex animation logic.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Unlike other libraries that abstract away the DOM, we expose the underlying structure so you have full control. Components are designed to be copy-pasted into your project, giving you true ownership of your code.
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <Link
                    to="/components/installation"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                    to="/components/glass-card"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary border border-border text-foreground font-semibold hover:bg-secondary/80 transition-colors"
                >
                    Browse Components
                </Link>
            </div>
        </div>
    );
};
