import { Search, Github } from 'lucide-react';
import { useNexus } from '../lib/nexus-provider';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Navbar = ({
    className
}: {
    className?: string
}) => {
    const { emit } = useNexus();

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300",
            "bg-black/50 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-black/20",
            className
        )}>
            {/* Logo */}
            <Link
                to="/"
                className="flex items-center gap-2 cursor-pointer group"
            >
                <img src="/logo.png" alt="ReactUI" className="h-8 w-auto object-contain" />
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    React<span className="text-accent">UI</span>
                </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
                <Link
                    to="/"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-accent transition-colors"
                >
                    Home
                </Link>
                <Link
                    to="/components"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-accent transition-colors"
                >
                    Components
                </Link>
                <a
                    href="#"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-accent transition-colors"
                >
                    Docs
                </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Search Trigger */}
                <button
                    onClick={() => emit('command-palette:open')}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors group text-gray-500 dark:text-gray-400"
                >
                    <Search className="w-4 h-4" />
                    <span className="text-xs">Search...</span>
                    <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>

                {/* Mobile Search Icon Only */}
                <button
                    onClick={() => emit('command-palette:open')}
                    className="md:hidden p-2 text-gray-500 hover:text-white"
                >
                    <Search className="w-5 h-5" />
                </button>

                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Github className="w-5 h-5" />
                </a>
            </div>
        </header>
    );
};
