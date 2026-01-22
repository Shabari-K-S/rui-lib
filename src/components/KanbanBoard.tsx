import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
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

// Card Component
const Card = ({
    card,
    onClick,
}: {
    card: KanbanCard;
    onClick?: () => void;
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={cn(
                "p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer",
                "hover:bg-white/10 hover:border-white/20 transition-all duration-200",
                "group"
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
    );
};

// Column Component
const Column = ({
    column,
    onCardClick,
    onAddCard,
    onCardsReorder,
    onCardDrop,
    draggedCard,
    setDraggedCard,
}: {
    column: KanbanColumn;
    onCardClick?: (card: KanbanCard) => void;
    onAddCard?: () => void;
    onCardsReorder: (cards: KanbanCard[]) => void;
    onCardDrop: (card: KanbanCard, targetColumnId: string) => void;
    draggedCard: { card: KanbanCard; sourceColumnId: string } | null;
    setDraggedCard: (data: { card: KanbanCard; sourceColumnId: string } | null) => void;
}) => {
    const isOverLimit = column.wipLimit ? column.cards.length >= column.wipLimit : false;
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (draggedCard && draggedCard.sourceColumnId !== column.id) {
            onCardDrop(draggedCard.card, column.id);
        }
    };

    return (
        <div
            className={cn(
                "flex-shrink-0 w-72 bg-white/[0.02] rounded-xl border border-white/10 flex flex-col max-h-full",
                isDragOver && "border-accent/50 bg-accent/5"
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
            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                <Reorder.Group
                    axis="y"
                    values={column.cards}
                    onReorder={onCardsReorder}
                    className="space-y-2"
                >
                    <AnimatePresence>
                        {column.cards.map((card) => (
                            <Reorder.Item
                                key={card.id}
                                value={card}
                                draggable
                                onDragStart={() => setDraggedCard({ card, sourceColumnId: column.id })}
                                onDragEnd={() => setDraggedCard(null)}
                            >
                                <Card
                                    card={card}
                                    onClick={() => onCardClick?.(card)}
                                />
                            </Reorder.Item>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>
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
    const [draggedCard, setDraggedCard] = useState<{ card: KanbanCard; sourceColumnId: string } | null>(null);
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState<'none' | 'priority' | 'date'>('none');

    // Update columns and notify parent
    const updateColumns = useCallback((newColumns: KanbanColumn[]) => {
        setColumns(newColumns);
        onColumnsChange?.(newColumns);
    }, [onColumnsChange]);

    // Handle card reorder within same column
    const handleCardsReorder = useCallback((columnId: string, newCards: KanbanCard[]) => {
        const newColumns = columns.map(col =>
            col.id === columnId ? { ...col, cards: newCards } : col
        );
        updateColumns(newColumns);
    }, [columns, updateColumns]);

    // Handle card drop to different column
    const handleCardDrop = useCallback((card: KanbanCard, targetColumnId: string) => {
        if (!draggedCard) return;

        const newColumns = columns.map(col => {
            if (col.id === draggedCard.sourceColumnId) {
                return { ...col, cards: col.cards.filter(c => c.id !== card.id) };
            }
            if (col.id === targetColumnId) {
                return { ...col, cards: [...col.cards, card] };
            }
            return col;
        });

        updateColumns(newColumns);
        setDraggedCard(null);
    }, [columns, draggedCard, updateColumns]);

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
        <div className={cn("flex flex-col h-full", className)}>
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
                        onChange={(e) => setSortBy(e.target.value as any)}
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
                            onCardsReorder={(cards) => handleCardsReorder(column.id, cards)}
                            onCardDrop={handleCardDrop}
                            draggedCard={draggedCard}
                            setDraggedCard={setDraggedCard}
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
