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
                    className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                >
                    Introduction to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ReactUI</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-400 leading-relaxed"
                >
                    ReactUI is a next-generation React component library designed for building modern, high-performance, and visually stunning web applications. It combines the power of Framer Motion for animations with Tailwind CSS for styling.
                </motion.p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { title: "Motion First", icon: <Zap className="w-6 h-6 text-yellow-400" />, desc: "Every component is built with natural, spring-based physics." },
                    { title: "Glassmorphism", icon: <Layers className="w-6 h-6 text-blue-400" />, desc: "Premium glass effects and blurs out of the box." },
                    { title: "Developer DX", icon: <Code className="w-6 h-6 text-purple-400" />, desc: "Copy-paste ready code with full TypeScript support." },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <div className="mb-4">{item.icon}</div>
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Philosophy</h2>
                <p className="text-gray-400 leading-relaxed">
                    We believe that modern interfaces should be more than just static pixels. They should react, breathe, and move with the user. ReactUI provides the building blocks to create these immersive experiences without getting bogged down in complex animation logic.
                </p>
                <p className="text-gray-400 leading-relaxed">
                    Unlike other libraries that abstract away the DOM, we expose the underlying structure so you have full control. Components are designed to be copy-pasted into your project, giving you true ownership of your code.
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <Link
                    to="/components/installation"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                    to="/components/glass-card"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                    Browse Components
                </Link>
            </div>
        </div>
    );
};
