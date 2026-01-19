import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../lib/utils';

export interface BreadcrumbItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    href?: string;
    children?: BreadcrumbItem[]; // Sub-items for dropdown
}

interface SmartBreadcrumbProps {
    items: BreadcrumbItem[];
    onNavigate?: (id: string) => void;
    className?: string;
}

export const SmartBreadcrumb = ({ items, onNavigate, className }: SmartBreadcrumbProps) => {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1", className)}>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-colors backdrop-blur-md">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <div key={item.id} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-500 mx-2" />
                            )}

                            {item.children ? (
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger className="outline-none">
                                        <div className={cn(
                                            "flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer group rounded-md px-2 py-1",
                                            isLast ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                                        )}>
                                            {item.icon && <span className="opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>}
                                            {item.label}
                                            <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="min-w-[180px] bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-lg p-1 animate-scale-in shadow-xl z-50 text-white"
                                            sideOffset={5}
                                        >
                                            {item.children.map((child) => (
                                                <DropdownMenu.Item
                                                    key={child.id}
                                                    onSelect={() => onNavigate?.(child.id)}
                                                    className="flex items-center gap-2 px-2 py-2 text-sm text-gray-300 rounded-md hover:bg-white/10 hover:text-white cursor-pointer outline-none transition-colors"
                                                >
                                                    {child.icon || <Folder className="w-3 h-3 opacity-50" />}
                                                    {child.label}
                                                </DropdownMenu.Item>
                                            ))}
                                            <DropdownMenu.Arrow className="fill-gray-900/90" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            ) : (
                                <button
                                    onClick={() => onNavigate?.(item.id)}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-medium transition-colors px-2 py-1 rounded-md",
                                        isLast ? "text-white pointer-events-none" : "text-gray-400 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    {item.icon && <span className="opacity-70">{item.icon}</span>}
                                    {item.label}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
};
