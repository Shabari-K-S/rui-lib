import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Plus, MoreHorizontal, Filter, ArrowUpDown } from 'lucide-react';

// Types
export interface KanbanCard {
    id: string;
    title: string;
    description?: string;
    labels?: { text: string; color: string }[];
    assignee?: { name: string; avatar?: string };
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface KanbanColumn {
    id: string;
    title: string;
    cards: KanbanCard[];
    color?: string;
    wipLimit?: number;
}

interface KanbanBoardProps {
    columns: KanbanColumn[];
    onColumnsChange?: (columns: KanbanColumn[]) => void;
    onCardClick?: (card: KanbanCard, columnId: string) => void;
    onAddCard?: (columnId: string) => void;
    className?: string;
}

// Priority colors
const priorityColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// Card Component with HTML5 drag support
const Card = ({
    card,
    columnId,
    onClick,
    onDragStart,
    isDragging,
}: {
    card: KanbanCard;
    columnId: string;
    onClick?: () => void;
    onDragStart: (e: React.DragEvent, card: KanbanCard, columnId: string) => void;
    isDragging: boolean;
}) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, card, columnId)}
            className="cursor-grab active:cursor-grabbing"
        >
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isDragging ? 0.5 : 1, y: 0, scale: isDragging ? 0.95 : 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                onClick={onClick}
                className={cn(
                    "p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm",
                    "hover:bg-white/10 hover:border-white/20 transition-all duration-200",
                    "group",
                    isDragging && "opacity-50"
                )}
            >
                {/* Labels */}
                {card.labels && card.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {card.labels.map((label, i) => (
                            <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: label.color + '30', color: label.color }}
                            >
                                {label.text}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h4 className="text-sm font-medium text-white mb-1 group-hover:text-accent transition-colors">
                    {card.title}
                </h4>

                {/* Description */}
                {card.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {card.description}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                    {/* Priority */}
                    {card.priority && (
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded border font-medium uppercase",
                            priorityColors[card.priority]
                        )}>
                            {card.priority}
                        </span>
                    )}

                    {/* Due Date */}
                    {card.dueDate && (
                        <span className="text-[10px] text-gray-500">
                            {card.dueDate}
                        </span>
                    )}

                    {/* Assignee */}
                    {card.assignee && (
                        <div className="flex items-center gap-1">
                            {card.assignee.avatar ? (
                                <img
                                    src={card.assignee.avatar}
                                    alt={card.assignee.name}
                                    className="w-5 h-5 rounded-full"
                                />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-medium text-accent">
                                    {card.assignee.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Column Component with drop zone
const Column = ({
    column,
    onCardClick,
    onAddCard,
    onCardDrop,
    draggedCardId,
    onDragStart,
}: {
    column: KanbanColumn;
    onCardClick?: (card: KanbanCard) => void;
    onAddCard?: () => void;
    onCardDrop: (sourceColumnId: string, targetColumnId: string, cardId: string) => void;
    draggedCardId: string | null;
    onDragStart: (e: React.DragEvent, card: KanbanCard, columnId: string) => void;
}) => {
    const isOverLimit = column.wipLimit ? column.cards.length >= column.wipLimit : false;
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setIsDragOver(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.sourceColumnId !== column.id) {
                onCardDrop(data.sourceColumnId, column.id, data.cardId);
            }
        } catch (err) {
            console.error('Drop error:', err);
        }
    };

    return (
        <div
            className={cn(
                "flex-shrink-0 w-72 bg-white/[0.02] rounded-xl border-2 flex flex-col max-h-full transition-all duration-200",
                isDragOver
                    ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                    : "border-white/10"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Column Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {column.color && (
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: column.color }}
                        />
                    )}
                    <h3 className="text-sm font-semibold text-white">{column.title}</h3>
                    <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        isOverLimit
                            ? "bg-red-500/20 text-red-400"
                            : "bg-white/10 text-gray-400"
                    )}>
                        {column.cards.length}
                        {column.wipLimit && `/${column.wipLimit}`}
                    </span>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Cards Container */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide min-h-[100px]">
                <AnimatePresence>
                    {column.cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            columnId={column.id}
                            onClick={() => onCardClick?.(card)}
                            onDragStart={onDragStart}
                            isDragging={draggedCardId === card.id}
                        />
                    ))}
                </AnimatePresence>

                {/* Drop zone indicator when dragging */}
                {isDragOver && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 60 }}
                        className="border-2 border-dashed border-accent/50 rounded-lg bg-accent/10 flex items-center justify-center"
                    >
                        <span className="text-xs text-accent">Drop here</span>
                    </motion.div>
                )}
            </div>

            {/* Add Card Button */}
            <div className="p-2 border-t border-white/10">
                <button
                    onClick={onAddCard}
                    disabled={isOverLimit}
                    className={cn(
                        "w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                        isOverLimit
                            ? "bg-white/5 text-gray-600 cursor-not-allowed"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                >
                    <Plus className="w-4 h-4" />
                    Add Card
                </button>
            </div>
        </div>
    );
};

// Main Kanban Board Component
export const KanbanBoard = ({
    columns: initialColumns,
    onColumnsChange,
    onCardClick,
    onAddCard,
    className,
}: KanbanBoardProps) => {
    const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
    const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState<'none' | 'priority' | 'date'>('none');

    // Update columns and notify parent
    const updateColumns = useCallback((newColumns: KanbanColumn[]) => {
        setColumns(newColumns);
        onColumnsChange?.(newColumns);
    }, [onColumnsChange]);

    // Handle card drag start
    const handleDragStart = useCallback((e: React.DragEvent, card: KanbanCard, columnId: string) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({ cardId: card.id, sourceColumnId: columnId }));
        setDraggedCardId(card.id);
    }, []);

    // Handle card drop to different column
    const handleCardDrop = useCallback((sourceColumnId: string, targetColumnId: string, cardId: string) => {
        const sourceColumn = columns.find(c => c.id === sourceColumnId);
        const card = sourceColumn?.cards.find(c => c.id === cardId);

        if (!card) return;

        const newColumns = columns.map(col => {
            if (col.id === sourceColumnId) {
                return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
            }
            if (col.id === targetColumnId) {
                return { ...col, cards: [...col.cards, card] };
            }
            return col;
        });

        updateColumns(newColumns);
        setDraggedCardId(null);
    }, [columns, updateColumns]);

    // Handle drag end (cleanup)
    const handleDragEnd = useCallback(() => {
        setDraggedCardId(null);
    }, []);

    // Filter and sort cards
    const getProcessedColumns = useCallback(() => {
        return columns.map(col => {
            let cards = [...col.cards];

            // Filter
            if (filterText) {
                cards = cards.filter(card =>
                    card.title.toLowerCase().includes(filterText.toLowerCase()) ||
                    card.description?.toLowerCase().includes(filterText.toLowerCase())
                );
            }

            // Sort
            if (sortBy === 'priority') {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                cards.sort((a, b) =>
                    (priorityOrder[a.priority || 'low']) - (priorityOrder[b.priority || 'low'])
                );
            } else if (sortBy === 'date') {
                cards.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                });
            }

            return { ...col, cards };
        });
    }, [columns, filterText, sortBy]);

    const processedColumns = getProcessedColumns();

    return (
        <div
            className={cn("flex flex-col h-full", className)}
            onDragEnd={handleDragEnd}
        >
            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-4 px-2">
                {/* Filter */}
                <div className="relative flex-1 max-w-xs">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Filter cards..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50"
                    />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'none' | 'priority' | 'date')}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                    >
                        <option value="none">No sorting</option>
                        <option value="priority">Priority</option>
                        <option value="date">Due Date</option>
                    </select>
                </div>
            </div>

            {/* Columns */}
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 p-2 min-h-full">
                    {processedColumns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            onCardClick={(card) => onCardClick?.(card, column.id)}
                            onAddCard={() => onAddCard?.(column.id)}
                            onCardDrop={handleCardDrop}
                            draggedCardId={draggedCardId}
                            onDragStart={handleDragStart}
                        />
                    ))}

                    {/* Add Column Button */}
                    <button className="flex-shrink-0 w-72 h-16 rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Column
                    </button>
                </div>
            </div>
        </div>
    );
};
