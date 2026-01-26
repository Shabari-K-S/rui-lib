import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNexus } from '../lib/nexus-provider';
import { Search, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data Structures
export interface SearchItem {
    id: string;
    label: string;
    icon: LucideIcon;
    shortcut?: string;
    action: () => void;
}

export interface SearchGroup {
    heading: string;
    items: SearchItem[];
}

export const TeleportSearch = ({ searchGroups }: { searchGroups: SearchGroup[] }) => {
    const [open, setOpen] = useState(false);
    const { on } = useNexus();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        const cleanup = on('command-palette:open', () => setOpen(true));

        return () => {
            document.removeEventListener('keydown', down);
            cleanup();
        };
    }, [on]);

    const runCommand = (action: () => void) => {
        setOpen(false);
        action();
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10"
                    >
                        <Command className="w-full bg-transparent">
                            <div className="flex items-center border-b border-black/5 dark:border-white/10 px-4" cmdk-input-wrapper="">
                                <Search className="mr-2 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
                                <Command.Input
                                    placeholder="Type a command or search..."
                                    className="flex h-12 w-full rouned-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                                <Command.Empty className="py-6 text-center text-sm text-gray-500">No results found.</Command.Empty>

                                {searchGroups.map((group) => (
                                    <Command.Group key={group.heading} heading={group.heading} className="text-xs font-medium text-gray-400 px-2 py-1.5 mb-2">
                                        {group.items.map((item) => (
                                            <Command.Item
                                                key={item.id}
                                                onSelect={() => runCommand(item.action)}
                                                value={`${group.heading} ${item.label}`}
                                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none hover:bg-black/5 dark:hover:bg-white/10 aria-selected:bg-black/5 dark:aria-selected:bg-white/10 aria-selected:text-black dark:aria-selected:text-white"
                                            >
                                                <item.icon className="mr-2 h-4 w-4 opacity-70" />
                                                <span className="flex-1">{item.label}</span>
                                                {item.shortcut && (
                                                    <span className="text-[10px] text-gray-500 font-mono border border-black/5 dark:border-white/10 rounded px-1 bg-black/5 dark:bg-white/5">{item.shortcut}</span>
                                                )}
                                                <ArrowRight className="ml-2 h-3 w-3 opacity-0 aria-selected:opacity-50 transition-opacity" />
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                ))}
                            </Command.List>
                        </Command>
                    </motion.div>
                </div>
            )
            }
        </AnimatePresence >
    );
};
