import { Search, Github, Sun, Moon } from 'lucide-react';
import { useNexus } from '../lib/nexus-provider';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Navbar = ({
    className
}: {
    className?: string
}) => {
    const { emit, theme, toggleTheme } = useNexus();

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300",
            "bg-background/80 backdrop-blur-xl border-b border-border supports-[backdrop-filter]:bg-background/60",
            className
        )}>
            {/* Logo */}
            <Link
                to="/"
                className="flex items-center gap-2 cursor-pointer group"
            >
                <img src="/logo.png" alt="ReactUI" className="h-8 w-auto object-contain" />
                <span className="text-lg font-bold tracking-tight text-foreground">
                    React<span className="text-primary">UI</span>
                </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
                <Link
                    to="/"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    Home
                </Link>
                <Link
                    to="/components"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    Components
                </Link>
                <a
                    href="#"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    Docs
                </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Search Trigger */}
                {/* Search Trigger */}
                <button
                    onClick={() => emit('command-palette:open')}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors group text-muted-foreground"
                >
                    <Search className="w-4 h-4" />
                    <span className="text-xs">Search...</span>
                    <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Mobile Search Icon Only */}
                <button
                    onClick={() => emit('command-palette:open')}
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                >
                    <Search className="w-5 h-5" />
                </button>

                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="w-5 h-5" />
                </a>
            </div>
        </header>
    );
};
