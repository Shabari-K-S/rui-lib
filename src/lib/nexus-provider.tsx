import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

// --- Types ---

type Theme = 'light' | 'dark';

interface NexusState {
    theme: Theme;
    user: { name: string; avatar: string } | null;
    notifications: number;
}

type EventCallback = (payload: any) => void;

interface NexusContextType extends NexusState {
    toggleTheme: () => void;
    emit: (event: string, payload?: any) => void;
    on: (event: string, callback: EventCallback) => () => void;
}

// --- Event Bus ---

class EventBus {
    private listeners: Record<string, EventCallback[]> = {};

    emit(event: string, payload?: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((cb) => cb(payload));
        }
    }

    on(event: string, callback: EventCallback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return () => {
            this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
        };
    }
}

const globalEventBus = new EventBus();

// --- Context ---

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Use system preference or default to dark (per requirement)
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light'; // Fallback logic, but we default to dark mostly
        }
        return 'dark';
    });

    const [notifications, setNotifications] = useState(0);

    // Apply theme class to html/body
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const emit = useCallback((event: string, payload?: any) => {
        globalEventBus.emit(event, payload);
        // Internal state updates based on events could happen here
        if (event === 'notification:new') {
            setNotifications(prev => prev + 1);
        }
    }, []);

    const on = useCallback((event: string, callback: EventCallback) => {
        return globalEventBus.on(event, callback);
    }, []);

    const value = useMemo(() => ({
        theme,
        user: { name: 'Demo User', avatar: 'https://github.com/shadcn.png' }, // Mock user
        notifications,
        toggleTheme,
        emit,
        on
    }), [theme, notifications, toggleTheme, emit, on]);

    return (
        <NexusContext.Provider value={value}>
            {children}
        </NexusContext.Provider>
    );
};

export const useNexus = () => {
    const context = useContext(NexusContext);
    if (!context) {
        throw new Error('useNexus must be used within a NexusProvider');
    }
    return context;
};
