import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

export const Installation = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-12 py-8">
            <div className="space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                >
                    Installation
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-400 leading-relaxed"
                >
                    Get up and running with ReactUI in minutes. Follow these steps to prepare your environment.
                </motion.p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">1</span>
                        Prerequisites
                    </h2>
                    <p className="text-gray-400">Ensure you have a React project set up with Tailwind CSS. We recommend Vite or Next.js.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">2</span>
                        Install Dependencies
                    </h2>
                    <p className="text-gray-400">ReactUI relies on <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">framer-motion</code> for animations and <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">clsx</code> + <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">tailwind-merge</code> for class handling.</p>

                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Terminal className="w-4 h-4" />
                                <span>Terminal</span>
                            </div>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <code className="text-sm font-mono text-blue-300">npm install framer-motion clsx tailwind-merge lucide-react</code>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">3</span>
                        Add Utilities
                    </h2>
                    <p className="text-gray-400">Create a <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">utils.ts</code> file in your project (usually under <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">src/lib/utils.ts</code>) to handle class merging.</p>

                    <CodeBlock
                        language="typescript"
                        code={`import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">4</span>
                        That's it!
                    </h2>
                    <p className="text-gray-400">You are now ready to copy and paste components into your project. Browse the collection to get started.</p>
                </section>
            </div>
        </div>
    );
};
