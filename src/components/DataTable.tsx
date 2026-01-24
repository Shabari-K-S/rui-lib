import React, { useState, useMemo } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Search,
    Download,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
    width?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    title?: string;
    searchable?: boolean;
    selectable?: boolean;
    pagination?: boolean;
    rowsPerPage?: number;
    className?: string;
}

export function DataTable<T extends { id: string | number } & Record<string, any>>({
    data,
    columns,
    title = "Data Table",
    searchable = true,
    selectable = true,
    pagination = true,
    rowsPerPage = 5,
    className
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

    // Filter
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(row =>
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    // Sort
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = pagination
        ? sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        : sortedData;

    const handleSort = (key: keyof T) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return current.direction === 'asc'
                    ? { key, direction: 'desc' }
                    : null;
            }
            return { key, direction: 'asc' };
        });
    };

    const toggleSelectAll = () => {
        if (selectedRows.size === paginatedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(paginatedData.map(row => row.id)));
        }
    };

    const toggleSelectRow = (id: string | number) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    const exportCSV = () => {
        const headers = columns.map(col => col.label).join(',');
        const rows = sortedData.map(row =>
            columns.map(col => JSON.stringify(row[col.key])).join(',')
        ).join('\n');

        const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.csv';
        a.click();
    };

    return (
        <div className={cn("w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden", className)}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-sm text-gray-400">{sortedData.length} entries found</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {searchable && (
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
                            />
                        </div>
                    )}
                    <button
                        onClick={exportCSV}
                        className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                        title="Export CSV"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            {selectable && (
                                <th className="p-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-white/20 bg-white/10 text-accent focus:ring-accent"
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={col.key as string}
                                    className={cn(
                                        "p-4 text-xs font-medium text-gray-400 uppercase tracking-wider",
                                        col.sortable && "cursor-pointer hover:text-white transition-colors group"
                                    )}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="text-gray-600 group-hover:text-gray-400">
                                                {sortConfig?.key === col.key ? (
                                                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-accent" /> : <ChevronDown className="w-3 h-3 text-accent" />
                                                ) : (
                                                    <ArrowUpDown className="w-3 h-3" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence mode='popLayout'>
                            {paginatedData.map((row, i) => (
                                <motion.tr
                                    key={row.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={cn(
                                        "group transition-colors hover:bg-white/5",
                                        selectedRows.has(row.id) && "bg-accent/5 hover:bg-accent/10"
                                    )}
                                >
                                    {selectable && (
                                        <td className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(row.id)}
                                                onChange={() => toggleSelectRow(row.id)}
                                                className="rounded border-white/20 bg-white/10 text-accent focus:ring-accent"
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td key={`${row.id}-${col.key as string}`} className="p-4 text-sm text-gray-300 group-hover:text-white transition-colors">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                    <td className="p-4 text-center">
                                        <button className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>

                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 2 : 1)} className="p-8 text-center text-gray-500">
                                    No results found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="p-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <span className="text-white">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="text-white">{Math.min(currentPage * rowsPerPage, sortedData.length)}</span> of <span className="text-white">{sortedData.length}</span> entries
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors border",
                                        currentPage === i + 1
                                            ? "bg-accent/10 border-accent/20 text-accent"
                                            : "bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
