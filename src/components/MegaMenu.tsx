import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, type LucideIcon } from 'lucide-react';

// Types
export interface MegaMenuItem {
    id: string;
    label: string;
    href?: string;
    icon?: LucideIcon;
    description?: string;
    badge?: string;
    onClick?: () => void;
}

export interface MegaMenuCategory {
    id: string;
    title: string;
    items: MegaMenuItem[];
}

export interface MegaMenuFeatured {
    id: string;
    title: string;
    description: string;
    image: string;
    href?: string;
    onClick?: () => void;
}

export interface MegaMenuSection {
    id: string;
    label: string;
    categories: MegaMenuCategory[];
    featured?: MegaMenuFeatured;
}

export interface MegaMenuProps {
    sections: MegaMenuSection[];
    trigger?: 'hover' | 'click';
    className?: string;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
    sections,
    trigger = 'hover',
    className = '',
}) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [focusedItemIndex, setFocusedItemIndex] = useState<number>(-1);
    const menuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Get all items for keyboard navigation
    const getAllItems = useCallback(() => {
        const section = sections.find(s => s.id === activeSection);
        if (!section) return [];
        return section.categories.flatMap(cat => cat.items);
    }, [sections, activeSection]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveSection(null);
                setFocusedItemIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!activeSection) return;

            const items = getAllItems();

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setFocusedItemIndex(prev =>
                        prev < items.length - 1 ? prev + 1 : 0
                    );
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setFocusedItemIndex(prev =>
                        prev > 0 ? prev - 1 : items.length - 1
                    );
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (focusedItemIndex >= 0 && items[focusedItemIndex]) {
                        const item = items[focusedItemIndex];
                        if (item.onClick) item.onClick();
                        if (item.href) window.location.href = item.href;
                        setActiveSection(null);
                    }
                    break;
                case 'Escape':
                    setActiveSection(null);
                    setFocusedItemIndex(-1);
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                        setFocusedItemIndex(-1);
                    }
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    const idx = sections.findIndex(s => s.id === activeSection);
                    if (idx < sections.length - 1) {
                        setActiveSection(sections[idx + 1].id);
                        setFocusedItemIndex(-1);
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [activeSection, focusedItemIndex, getAllItems, sections]);

    const handleMouseEnter = (sectionId: string) => {
        if (trigger === 'hover') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setActiveSection(sectionId);
            setFocusedItemIndex(-1);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === 'hover') {
            timeoutRef.current = setTimeout(() => {
                setActiveSection(null);
                setFocusedItemIndex(-1);
            }, 150);
        }
    };

    const handleClick = (sectionId: string) => {
        if (trigger === 'click') {
            setActiveSection(prev => prev === sectionId ? null : sectionId);
            setFocusedItemIndex(-1);
        }
    };

    const activeSectionData = sections.find(s => s.id === activeSection);

    return (
        <div ref={menuRef} className={`relative ${className}`}>
            {/* Navigation Bar */}
            <nav className="flex items-center gap-1 px-4 py-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onMouseEnter={() => handleMouseEnter(section.id)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(section.id)}
                        className={`
              flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
              transition-all duration-200
              ${activeSection === section.id
                                ? 'bg-white/10 text-white'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }
            `}
                    >
                        {section.label}
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${activeSection === section.id ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                ))}
            </nav>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {activeSection && activeSectionData && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onMouseEnter={() => trigger === 'hover' && timeoutRef.current && clearTimeout(timeoutRef.current)}
                        onMouseLeave={handleMouseLeave}
                        className="absolute left-0 top-full mt-2 w-full min-w-[600px] max-w-4xl z-50"
                    >
                        <div className="
              bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10
              shadow-2xl shadow-black/50 overflow-hidden
            ">
                            <div className="flex">
                                {/* Categories Section */}
                                <div className="flex-1 p-6 grid grid-cols-2 gap-8">
                                    {activeSectionData.categories.map((category) => (
                                        <div key={category.id}>
                                            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                                                {category.title}
                                            </h3>
                                            <ul className="space-y-1">
                                                {category.items.map((item, itemIndex) => {
                                                    const globalIndex = activeSectionData.categories
                                                        .slice(0, activeSectionData.categories.indexOf(category))
                                                        .reduce((acc, cat) => acc + cat.items.length, 0) + itemIndex;

                                                    return (
                                                        <li key={item.id}>
                                                            <a
                                                                href={item.href || '#'}
                                                                onClick={(e) => {
                                                                    if (item.onClick) {
                                                                        e.preventDefault();
                                                                        item.onClick();
                                                                        setActiveSection(null);
                                                                    }
                                                                }}
                                                                className={`
                                  flex items-start gap-3 p-3 rounded-xl
                                  transition-all duration-200 group
                                  ${focusedItemIndex === globalIndex
                                                                        ? 'bg-white/10'
                                                                        : 'hover:bg-white/5'
                                                                    }
                                `}
                                                            >
                                                                {item.icon && (
                                                                    <div className="
                                    w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5
                                    flex items-center justify-center flex-shrink-0
                                    group-hover:from-purple-500/20 group-hover:to-pink-500/20
                                    transition-all duration-300
                                  ">
                                                                        <item.icon size={20} className="text-white/80" />
                                                                    </div>
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-medium text-white">
                                                                            {item.label}
                                                                        </span>
                                                                        {item.badge && (
                                                                            <span className="
                                        px-2 py-0.5 text-[10px] font-semibold
                                        bg-gradient-to-r from-purple-500 to-pink-500
                                        text-white rounded-full uppercase
                                      ">
                                                                                {item.badge}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {item.description && (
                                                                        <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                                                                            {item.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Featured Section */}
                                {activeSectionData.featured && (
                                    <div className="w-72 p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-l border-white/10">
                                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                                            Featured
                                        </h3>
                                        <a
                                            href={activeSectionData.featured.href || '#'}
                                            onClick={(e) => {
                                                if (activeSectionData.featured?.onClick) {
                                                    e.preventDefault();
                                                    activeSectionData.featured.onClick();
                                                    setActiveSection(null);
                                                }
                                            }}
                                            className="block group"
                                        >
                                            <div className="
                        aspect-video rounded-xl overflow-hidden mb-4
                        ring-2 ring-white/10 group-hover:ring-purple-500/50
                        transition-all duration-300
                      ">
                                                <img
                                                    src={activeSectionData.featured.image}
                                                    alt={activeSectionData.featured.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                                {activeSectionData.featured.title}
                                            </h4>
                                            <p className="text-xs text-white/50 line-clamp-2">
                                                {activeSectionData.featured.description}
                                            </p>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MegaMenu;
