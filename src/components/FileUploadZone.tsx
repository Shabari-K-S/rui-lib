import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Upload, X, File, Image, FileText, Film, Music, Archive, Check, AlertCircle } from 'lucide-react';

// Types
export interface UploadFile {
    id: string;
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    preview?: string;
    error?: string;
}

interface FileUploadZoneProps {
    onFilesSelected?: (files: File[]) => void;
    onUpload?: (files: File[]) => Promise<void>;
    accept?: string; // e.g., "image/*,.pdf"
    maxSize?: number; // in bytes
    maxFiles?: number;
    multiple?: boolean;
    className?: string;
}

// Get file icon based on type
const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return Archive;
    return File;
};

// Format file size
const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const FileUploadZone = ({
    onFilesSelected,
    onUpload,
    accept = '*',
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxFiles = 10,
    multiple = true,
    className,
}: FileUploadZoneProps) => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Validate file
    const validateFile = useCallback((file: File): string | null => {
        if (file.size > maxSize) {
            return `File too large. Max size: ${formatSize(maxSize)}`;
        }

        if (accept !== '*') {
            const acceptedTypes = accept.split(',').map(t => t.trim());
            const isAccepted = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return file.name.toLowerCase().endsWith(type.toLowerCase());
                }
                if (type.endsWith('/*')) {
                    return file.type.startsWith(type.replace('/*', '/'));
                }
                return file.type === type;
            });
            if (!isAccepted) {
                return `File type not accepted. Allowed: ${accept}`;
            }
        }

        return null;
    }, [accept, maxSize]);

    // Process files
    const processFiles = useCallback((fileList: FileList | File[]) => {
        const newFiles: UploadFile[] = [];
        const filesToProcess = Array.from(fileList).slice(0, maxFiles - files.length);

        filesToProcess.forEach(file => {
            const error = validateFile(file);
            const uploadFile: UploadFile = {
                id: generateId(),
                file,
                progress: 0,
                status: error ? 'error' : 'pending',
                error: error || undefined,
            };

            // Create preview for images
            if (file.type.startsWith('image/') && !error) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFiles(prev => prev.map(f =>
                        f.id === uploadFile.id
                            ? { ...f, preview: e.target?.result as string }
                            : f
                    ));
                };
                reader.readAsDataURL(file);
            }

            newFiles.push(uploadFile);
        });

        setFiles(prev => [...prev, ...newFiles]);
        onFilesSelected?.(newFiles.filter(f => !f.error).map(f => f.file));
    }, [files.length, maxFiles, validateFile, onFilesSelected]);

    // Handle drag events
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    }, [processFiles]);

    // Handle paste
    const handlePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        const pastedFiles: File[] = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                if (file) pastedFiles.push(file);
            }
        }

        if (pastedFiles.length > 0) {
            processFiles(pastedFiles);
        }
    }, [processFiles]);

    // Setup paste listener
    React.useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [handlePaste]);

    // Handle file input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
        // Reset input
        if (inputRef.current) inputRef.current.value = '';
    }, [processFiles]);

    // Remove file
    const removeFile = useCallback((id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    }, []);

    // Simulate upload (replace with real upload logic)
    const handleUpload = useCallback(async () => {
        const pendingFiles = files.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0) return;

        setIsUploading(true);

        // Update status to uploading
        setFiles(prev => prev.map(f =>
            f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
        ));

        // Simulate upload progress
        for (const uploadFile of pendingFiles) {
            for (let progress = 0; progress <= 100; progress += 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setFiles(prev => prev.map(f =>
                    f.id === uploadFile.id ? { ...f, progress } : f
                ));
            }

            // Mark as success
            setFiles(prev => prev.map(f =>
                f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f
            ));
        }

        // Call onUpload callback
        if (onUpload) {
            try {
                await onUpload(pendingFiles.map(f => f.file));
            } catch (error) {
                console.error('Upload error:', error);
            }
        }

        setIsUploading(false);
    }, [files, onUpload]);

    const pendingCount = files.filter(f => f.status === 'pending').length;

    return (
        <div className={cn("w-full", className)}>
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer",
                    "flex flex-col items-center justify-center gap-4 min-h-[200px]",
                    isDragOver
                        ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                        : "border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.04]"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleInputChange}
                    className="hidden"
                />

                <motion.div
                    animate={{
                        scale: isDragOver ? 1.1 : 1,
                        y: isDragOver ? -5 : 0
                    }}
                    className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                        isDragOver ? "bg-accent/20 text-accent" : "bg-white/10 text-gray-400"
                    )}
                >
                    <Upload className="w-8 h-8" />
                </motion.div>

                <div className="text-center">
                    <p className="text-white font-medium mb-1">
                        {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
                    </p>
                    <p className="text-gray-500 text-sm">
                        or click to browse • Max {formatSize(maxSize)} per file
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                        Paste from clipboard supported (Ctrl+V)
                    </p>
                </div>
            </div>

            {/* File List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2"
                    >
                        {files.map((uploadFile) => {
                            const FileIcon = getFileIcon(uploadFile.file.type);

                            return (
                                <motion.div
                                    key={uploadFile.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                                        uploadFile.status === 'error'
                                            ? "bg-red-500/10 border-red-500/30"
                                            : uploadFile.status === 'success'
                                                ? "bg-green-500/10 border-green-500/30"
                                                : "bg-white/5 border-white/10"
                                    )}
                                >
                                    {/* Preview or Icon */}
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                                        {uploadFile.preview ? (
                                            <img
                                                src={uploadFile.preview}
                                                alt={uploadFile.file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FileIcon className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {uploadFile.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatSize(uploadFile.file.size)}
                                        </p>

                                        {/* Progress Bar */}
                                        {uploadFile.status === 'uploading' && (
                                            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-accent"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${uploadFile.progress}%` }}
                                                />
                                            </div>
                                        )}

                                        {/* Error Message */}
                                        {uploadFile.error && (
                                            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {uploadFile.error}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status / Actions */}
                                    <div className="flex-shrink-0">
                                        {uploadFile.status === 'success' ? (
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-green-400" />
                                            </div>
                                        ) : uploadFile.status === 'uploading' ? (
                                            <div className="text-xs text-gray-400">
                                                {uploadFile.progress}%
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(uploadFile.id);
                                                }}
                                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors group"
                                            >
                                                <X className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Upload Button */}
                        {pendingCount > 0 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleUpload}
                                disabled={isUploading}
                                className={cn(
                                    "w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                    isUploading
                                        ? "bg-accent/50 cursor-not-allowed"
                                        : "bg-accent hover:bg-accent/80"
                                )}
                            >
                                <Upload className="w-4 h-4" />
                                {isUploading ? 'Uploading...' : `Upload ${pendingCount} file${pendingCount > 1 ? 's' : ''}`}
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
