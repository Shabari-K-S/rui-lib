import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Types
export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    color?: string;
}

interface CalendarProps {
    value?: Date | null;
    onChange?: (date: Date | null) => void;
    events?: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
    minDate?: Date;
    maxDate?: Date;
    rangeMode?: boolean;
    rangeStart?: Date | null;
    rangeEnd?: Date | null;
    onRangeChange?: (start: Date | null, end: Date | null) => void;
    className?: string;
}

// Helper functions
const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
};

const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    return date >= start && date <= end;
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar = ({
    value,
    onChange,
    events = [],
    onEventClick,
    minDate,
    maxDate,
    rangeMode = false,
    rangeStart,
    rangeEnd,
    onRangeChange,
    className,
}: CalendarProps) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? today.getMonth());
    const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? today.getFullYear());
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [isSelectingRange, setIsSelectingRange] = useState(false);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const days: (Date | null)[] = [];

        // Add empty slots for days before the first day
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(currentYear, currentMonth, day));
        }

        return days;
    }, [currentMonth, currentYear]);

    // Navigation
    const goToPreviousMonth = useCallback(() => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    }, [currentMonth]);

    const goToNextMonth = useCallback(() => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    }, [currentMonth]);

    const goToToday = useCallback(() => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    }, [today]);

    // Handle date click
    const handleDateClick = useCallback((date: Date) => {
        if (minDate && date < minDate) return;
        if (maxDate && date > maxDate) return;

        if (rangeMode) {
            if (!isSelectingRange || !rangeStart) {
                onRangeChange?.(date, null);
                setIsSelectingRange(true);
            } else {
                if (date < rangeStart) {
                    onRangeChange?.(date, rangeStart);
                } else {
                    onRangeChange?.(rangeStart, date);
                }
                setIsSelectingRange(false);
            }
        } else {
            onChange?.(date);
        }
    }, [rangeMode, rangeStart, isSelectingRange, onChange, onRangeChange, minDate, maxDate]);

    // Get events for a specific date
    const getEventsForDate = useCallback((date: Date) => {
        return events.filter(event => isSameDay(event.date, date));
    }, [events]);

    // Check if date is disabled
    const isDisabled = useCallback((date: Date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    }, [minDate, maxDate]);

    // Determine range highlight
    const getRangeState = useCallback((date: Date) => {
        if (!rangeMode) return null;

        if (rangeStart && rangeEnd) {
            if (isSameDay(date, rangeStart)) return 'start';
            if (isSameDay(date, rangeEnd)) return 'end';
            if (isDateInRange(date, rangeStart, rangeEnd)) return 'middle';
        } else if (rangeStart && hoverDate && isSelectingRange) {
            const effectiveEnd = hoverDate > rangeStart ? hoverDate : rangeStart;
            const effectiveStart = hoverDate < rangeStart ? hoverDate : rangeStart;
            if (isSameDay(date, effectiveStart)) return 'start';
            if (isSameDay(date, effectiveEnd)) return 'end';
            if (isDateInRange(date, effectiveStart, effectiveEnd)) return 'middle';
        }

        return null;
    }, [rangeMode, rangeStart, rangeEnd, hoverDate, isSelectingRange]);

    return (
        <div className={cn("w-full max-w-sm", className)}>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-white">
                            {MONTHS[currentMonth]} {currentYear}
                        </h2>
                        <button
                            onClick={goToToday}
                            className="text-xs px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                        >
                            Today
                        </button>
                    </div>

                    <button
                        onClick={goToNextMonth}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-white/10">
                    {DAYS.map(day => (
                        <div
                            key={day}
                            className="py-2 text-center text-xs font-medium text-gray-500 uppercase"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="p-2">
                    <div className="grid grid-cols-7 gap-1">
                        <AnimatePresence mode="wait">
                            {calendarDays.map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="aspect-square" />;
                                }

                                const isToday = isSameDay(date, today);
                                const isSelected = value && isSameDay(date, value);
                                const dateEvents = getEventsForDate(date);
                                const disabled = isDisabled(date);
                                const rangeState = getRangeState(date);

                                return (
                                    <motion.button
                                        key={date.toISOString()}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ delay: index * 0.01 }}
                                        onClick={() => handleDateClick(date)}
                                        onMouseEnter={() => setHoverDate(date)}
                                        onMouseLeave={() => setHoverDate(null)}
                                        disabled={disabled}
                                        className={cn(
                                            "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all",
                                            "hover:bg-white/10",
                                            disabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                                            isToday && !isSelected && "ring-1 ring-accent/50",
                                            isSelected && "bg-accent text-white",
                                            rangeState === 'start' && "bg-accent text-white rounded-r-none",
                                            rangeState === 'end' && "bg-accent text-white rounded-l-none",
                                            rangeState === 'middle' && "bg-accent/30 rounded-none"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-sm font-medium",
                                            isSelected || rangeState === 'start' || rangeState === 'end'
                                                ? "text-white"
                                                : isToday
                                                    ? "text-accent"
                                                    : "text-gray-300"
                                        )}>
                                            {date.getDate()}
                                        </span>

                                        {/* Event Dots */}
                                        {dateEvents.length > 0 && (
                                            <div className="absolute bottom-1 flex gap-0.5">
                                                {dateEvents.slice(0, 3).map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className="w-1 h-1 rounded-full"
                                                        style={{ backgroundColor: event.color || '#8B5CF6' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEventClick?.(event);
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer - Selected Date Info */}
                {(value || (rangeStart && rangeEnd)) && (
                    <div className="p-3 border-t border-white/10 text-center">
                        {rangeMode && rangeStart && rangeEnd ? (
                            <p className="text-sm text-gray-400">
                                <span className="text-white font-medium">
                                    {rangeStart.toLocaleDateString()} - {rangeEnd.toLocaleDateString()}
                                </span>
                            </p>
                        ) : value && (
                            <p className="text-sm text-gray-400">
                                Selected: <span className="text-white font-medium">{value.toLocaleDateString()}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple DatePicker wrapper with input
export const DatePicker = ({
    value,
    onChange,
    placeholder = "Select date",
    className,
    ...calendarProps
}: CalendarProps & { placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("relative", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5",
                    "flex items-center gap-2 text-left",
                    "hover:border-white/20 transition-colors",
                    isOpen && "border-accent"
                )}
            >
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className={value ? "text-white" : "text-gray-500"}>
                    {value ? value.toLocaleDateString() : placeholder}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 z-50"
                    >
                        <Calendar
                            value={value}
                            onChange={(date) => {
                                onChange?.(date);
                                setIsOpen(false);
                            }}
                            {...calendarProps}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};
