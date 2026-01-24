
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Dock, DockIcon } from '../components/InteractiveDock';
import { GlassCard } from '../components/GlassCard';
import { SmartBreadcrumb } from '../components/SmartBreadcrumb';
import { XRayReveal } from '../components/XRayReveal';
import { MagneticButton } from '../components/MagneticButton';
import { Home, Search, Calendar as CalendarIcon, Folder, MessageSquare, ArrowLeft, Zap, Settings, ChevronRight, Skull, AlertTriangle, Lock, MousePointer2, Rocket, Code, Star, Trophy, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { COMPONENTS } from '../lib/component-data';
import { CodeBlock } from '../components/CodeBlock';
import { cn } from '../lib/utils';
import { AnimatedWall } from '../components/AnimatedWall';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { MorphingTabs } from '../components/MorphingTabs';
import { SpotlightEffect, SpotlightCard } from '../components/SpotlightEffect';
import { WormholePortal } from '../components/WormholePortal';
import { Timeline } from '../components/Timeline';
import { KanbanBoard } from '../components/KanbanBoard';
import { FileUploadZone } from '../components/FileUploadZone';
import { Calendar as CalendarComponent } from '../components/Calendar';
import { StatCard } from '../components/StatCard';
import { NeonLineChart, GlassBarChart, HoloPieChart } from '../components/Charts';
import { DataTable } from '../components/DataTable';
import { ComparisonTable } from '../components/ComparisonTable';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Introduction } from '../components/docs/Introduction';
import { Installation } from '../components/docs/Installation';

export const ComponentPage = () => {
    const { ignore } = useParams();
    const navigate = useNavigate();
    const activeId = ignore || 'glass-card';
    const component = COMPONENTS[activeId];

    // Allow special docs pages
    const isDocsPage = ['introduction', 'installation'].includes(activeId);

    const [activeDockApp, setActiveDockApp] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [activeId]);

    // If ID is invalid and not a docs page, redirect to default
    useEffect(() => {
        if (!component && !isDocsPage) {
            navigate('/components/glass-card', { replace: true });
        }
    }, [component, navigate, isDocsPage]);

    if (!component && !isDocsPage) return null;

    const sections = [
        { id: 'preview', label: 'Preview' },
        { id: 'installation', label: 'Installation' },
        { id: 'usage', label: 'Usage' },
        { id: 'code', label: 'Source Code' },
    ];



    return (
        <div className="h-screen pt-24 overflow-hidden relative">
            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 z-[70] w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 p-6 lg:hidden overflow-y-auto scrollbar-hide"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-sm font-semibold text-white">Navigation</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-3">Getting Started</h4>
                                    <ul className="space-y-1">
                                        <li>
                                            <Link
                                                to="/components/introduction"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "block text-sm py-1.5 pl-4 -ml-px border-l transition-colors cursor-pointer",
                                                    activeId === 'introduction'
                                                        ? "border-accent text-accent font-medium"
                                                        : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                                                )}
                                            >
                                                Introduction
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/components/installation"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "block text-sm py-1.5 pl-4 -ml-px border-l transition-colors cursor-pointer",
                                                    activeId === 'installation'
                                                        ? "border-accent text-accent font-medium"
                                                        : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                                                )}
                                            >
                                                Installation
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                {['Components', 'Backgrounds'].map((category) => (
                                    <div key={category}>
                                        <h4 className="text-sm font-semibold text-white mb-3">{category}</h4>
                                        <ul className="space-y-1 border-l border-white/5">
                                            {Object.values(COMPONENTS)
                                                .filter(c => (c.category || 'Components') === category)
                                                .map((item) => (
                                                    <li key={item.id}>
                                                        <Link
                                                            to={`/components/${item.id}`}
                                                            className={cn(
                                                                "block text-sm py-1.5 pl-4 -ml-px border-l transition-colors",
                                                                activeId === item.id
                                                                    ? "border-accent text-accent font-medium"
                                                                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                                                            )}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="max-w-[1400px] mx-auto flex gap-6 lg:gap-10 px-4 sm:px-6 lg:px-8 h-full relative z-10">

                {/* Left Sidebar - Navigation */}
                <aside className="w-64 flex-shrink-0 hidden lg:block h-full overflow-y-auto pr-8 pb-12 scrollbar-hide border-r border-white/5">
                    <div className="mb-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-3">Getting Started</h4>
                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        to="/components/introduction"
                                        className={cn(
                                            "block text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer",
                                            activeId === 'introduction'
                                                ? "bg-accent/10 text-accent font-medium"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        Introduction
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/components/installation"
                                        className={cn(
                                            "block text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer",
                                            activeId === 'installation'
                                                ? "bg-accent/10 text-accent font-medium"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        Installation
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {['Components', 'Backgrounds'].map((category) => (
                            <div key={category}>
                                <h4 className="text-sm font-semibold text-white mb-3">{category}</h4>
                                <ul className="space-y-1">
                                    {Object.values(COMPONENTS)
                                        .filter(c => (c.category || 'Components') === category)
                                        .map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    to={`/components/${item.id}`}
                                                    className={cn(
                                                        "block text-sm px-3 py-2 rounded-lg transition-colors",
                                                        activeId === item.id
                                                            ? "bg-accent/10 text-accent font-medium"
                                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 h-full overflow-y-auto pb-12 scrollbar-hide">
                    {isDocsPage ? (
                        <div className="max-w-3xl">
                            {/* Mobile Menu Button */}
                            <div className="lg:hidden mb-6 flex items-center justify-between">
                                <button
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 -ml-3"
                                >
                                    <Menu className="w-5 h-5" />
                                    <span className="text-sm font-medium">Menu</span>
                                </button>
                            </div>

                            {activeId === 'introduction' && <Introduction />}
                            {activeId === 'installation' && <Installation />}
                        </div>
                    ) : (
                        <div className="max-w-3xl">
                            {/* Mobile Components Header */}
                            <div className="lg:hidden mb-6 flex items-center justify-between">
                                <button
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 -ml-3"
                                >
                                    <Menu className="w-5 h-5" />
                                    <span className="text-sm font-medium">Menu</span>
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <span>Components</span>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-white font-medium">{component.name}</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">{component.name}</h1>
                                <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                                    {component.description}
                                </p>
                            </div>

                            {/* Tabs / Switcher */}


                            <div className="animate-fade-in">
                                {/* Preview Tab */}
                                <section id="preview" className="scroll-mt-24 mb-16 space-y-8">
                                    <div className="space-y-8">
                                        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden min-h-[300px] sm:min-h-[400px] flex items-center justify-center relative">

                                            {/* Specific Render Logic */}
                                            {activeId === 'dock' && (
                                                <div className="mt-auto pb-10 w-full overflow-x-auto px-4 flex justify-center scrollbar-hide">
                                                    <Dock>
                                                        <DockIcon label="Home" isActive={activeDockApp === 'home'} onClick={() => setActiveDockApp('home')}><Home /></DockIcon>
                                                        <DockIcon label="Search" isActive={activeDockApp === 'search'} onClick={() => setActiveDockApp('search')}><Search /></DockIcon>
                                                        <DockIcon label="Calendar" isActive={activeDockApp === 'calendar'} onClick={() => setActiveDockApp('calendar')}><CalendarIcon /></DockIcon>
                                                        <DockIcon label="Files" isActive={activeDockApp === 'files'} onClick={() => setActiveDockApp('files')}><Folder /></DockIcon>
                                                        <DockIcon label="Messages" isActive={activeDockApp === 'messages'} onClick={() => setActiveDockApp('messages')}><MessageSquare /></DockIcon>
                                                    </Dock>
                                                </div>
                                            )}

                                            {activeId === 'glass-card' && (
                                                <GlassCard className="w-full max-w-[340px] h-auto p-8 flex flex-col justify-between">
                                                    <div className="flex flex-col gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/10 shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]">
                                                            <Zap className="w-7 h-7" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-3xl font-bold text-white tracking-tight">Pro Plan</h3>
                                                            <p className="text-base text-gray-400 leading-relaxed max-w-[90%]">Unlock full access to Nexus UI components and premium support.</p>
                                                        </div>
                                                    </div>
                                                    <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:border-white/20 mt-3">
                                                        Get Started
                                                    </button>
                                                </GlassCard>
                                            )}

                                            {activeId === 'breadcrumb' && (
                                                <div className="mt-[-60px] max-w-full overflow-x-auto px-4 scrollbar-hide">
                                                    <SmartBreadcrumb
                                                        items={[
                                                            { id: 'home', label: 'Home', icon: <Home className="w-3 h-3" /> },
                                                            {
                                                                id: 'products',
                                                                label: 'Products',
                                                                children: [
                                                                    { id: 'analytics', label: 'Analytics' },
                                                                    { id: 'commerce', label: 'Commerce' },
                                                                ]
                                                            },
                                                            { id: 'settings', label: 'Settings', icon: <Settings className="w-3 h-3" /> },
                                                        ]}
                                                    />
                                                </div>
                                            )}

                                            {activeId === 'teleport' && (
                                                <div className="text-center">
                                                    <p className="text-gray-400 mb-4">Press <kbd className="bg-white/10 px-2 py-1 rounded text-white border border-white/10 text-xs">Cmd+K</kbd> to open</p>
                                                    <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} className="px-4 py-2 bg-accent/10 text-accent rounded-lg border border-accent/20 hover:bg-accent/20 transition-colors">
                                                        Open Palette
                                                    </button>
                                                </div>
                                            )}

                                            {activeId === 'magnetic-button' && (
                                                <div className="flex flex-col sm:flex-row gap-8 items-center justify-center h-full pb-10">
                                                    <MagneticButton strength={0.4} className="p-4 bg-gray-800 rounded-full border border-gray-700 hover:border-gray-500">
                                                        <MousePointer2 className="w-8 h-8 text-white" />
                                                    </MagneticButton>

                                                    <MagneticButton strength={0.8} range={150} className="px-8 py-4 bg-accent text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow">
                                                        Strong Pull
                                                    </MagneticButton>
                                                </div>
                                            )}

                                            {activeId === 'x-ray-reveal' && (
                                                <div className="p-4 sm:p-8 w-full max-w-3xl">
                                                    <XRayReveal
                                                        className="w-full h-72 sm:h-96 rounded-xl border border-white/10"
                                                        radius={120}
                                                        revealContent={
                                                            <div className="w-full h-full bg-red-900/20 flex flex-col items-center justify-center text-red-500 p-4 sm:p-8 text-center">
                                                                <Skull className="w-12 h-12 sm:w-16 sm:h-16 mb-4 animate-pulse" />
                                                                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-widest mb-2">Top Secret</h2>
                                                                <p className="font-mono text-xs sm:text-sm max-w-md">
                                                                    CLASSIFIED INFORMATION: The payload has been delivered.
                                                                    Meeting point coordinates: 34.0522° N, 118.2437° W
                                                                </p>
                                                                <div className="mt-4 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md opacity-50">
                                                                    {[...Array(6)].map((_, i) => (
                                                                        <div key={i} className="h-8 sm:h-12 bg-red-500/10 rounded border border-red-500/20" />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        }
                                                    >
                                                        <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-gray-400 p-4 sm:p-8 text-center group">
                                                            <Lock className="w-12 h-12 sm:w-16 sm:h-16 mb-4 group-hover:text-gray-200 transition-colors" />
                                                            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-200">Restricted Access</h2>
                                                            <p className="max-w-md text-sm sm:text-base">
                                                                This document is classified. Authorization level 4 required to view contents.
                                                            </p>
                                                            <div className="mt-4 sm:mt-8 flex items-center gap-2 text-xs sm:text-sm text-yellow-500 border border-yellow-500/20 bg-yellow-500/5 px-3 sm:px-4 py-2 rounded-full">
                                                                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                <span>Hover to decouple security layer</span>
                                                            </div>
                                                        </div>
                                                    </XRayReveal>
                                                </div>
                                            )}

                                            {activeId === 'cyber-grid' && (
                                                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] relative overflow-hidden rounded-xl border border-white/10">
                                                    <AnimatedWall className="absolute!" />
                                                    <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none p-4 text-center">
                                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 shadow-black drop-shadow-lg">Cyber Grid</h2>
                                                        <p className="text-sm sm:text-base text-gray-300 shadow-black drop-shadow-md">The grid comes alive at your command.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {activeId === 'aurora-background' && (
                                                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] relative overflow-hidden rounded-xl border border-white/10">
                                                    <AuroraBackground>
                                                        <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none p-4 text-center">
                                                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 mix-blend-overlay">Aurora Borealis</h2>
                                                            <p className="text-sm sm:text-base text-white/80 mix-blend-overlay">Flowing gradients of light.</p>
                                                        </div>
                                                    </AuroraBackground>
                                                </div>
                                            )}

                                            {activeId === 'particles-background' && (
                                                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] relative overflow-hidden rounded-xl border border-white/10 bg-gray-900">
                                                    <ParticlesBackground particleCount={80} color="#8B5CF6" />
                                                    <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none p-4 text-center">
                                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Neural Network</h2>
                                                        <p className="text-sm sm:text-base text-gray-400">Interactive particle connections.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {activeId === 'morphing-tabs' && (
                                                <div className="flex flex-col items-center justify-center gap-8 p-8 w-full">
                                                    <div className="space-y-6 w-full max-w-md">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Pill Variant</p>
                                                            <MorphingTabs
                                                                tabs={[
                                                                    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
                                                                    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
                                                                    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                                                                ]}
                                                                variant="pill"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Boxed Variant</p>
                                                            <MorphingTabs
                                                                tabs={[
                                                                    { id: 'overview', label: 'Overview' },
                                                                    { id: 'analytics', label: 'Analytics' },
                                                                    { id: 'reports', label: 'Reports' },
                                                                ]}
                                                                variant="boxed"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Underline Variant</p>
                                                            <MorphingTabs
                                                                tabs={[
                                                                    { id: 'all', label: 'All Posts' },
                                                                    { id: 'published', label: 'Published' },
                                                                    { id: 'drafts', label: 'Drafts' },
                                                                ]}
                                                                variant="underline"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeId === 'spotlight-effect' && (
                                                <div className="flex flex-col items-center justify-center gap-6 p-8 w-full">
                                                    {/* Basic Spotlight */}
                                                    <SpotlightEffect className="p-8 bg-black/50 w-full max-w-md">
                                                        <div className="text-center">
                                                            <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
                                                            <h3 className="text-xl font-bold text-white mb-2">
                                                                Hover to Reveal
                                                            </h3>
                                                            <p className="text-gray-400 text-sm">
                                                                Move your cursor to see the spotlight effect
                                                            </p>
                                                        </div>
                                                    </SpotlightEffect>

                                                    {/* Spotlight Cards Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                                                        <SpotlightCard>
                                                            <Home className="w-8 h-8 text-accent mb-2" />
                                                            <h4 className="font-semibold text-white">Feature One</h4>
                                                            <p className="text-xs text-gray-500 mt-1">Purple glow</p>
                                                        </SpotlightCard>
                                                        <SpotlightCard spotlightColor="rgba(59, 130, 246, 0.2)">
                                                            <Search className="w-8 h-8 text-blue-500 mb-2" />
                                                            <h4 className="font-semibold text-white">Feature Two</h4>
                                                            <p className="text-xs text-gray-500 mt-1">Blue glow</p>
                                                        </SpotlightCard>
                                                        <SpotlightCard spotlightColor="rgba(34, 197, 94, 0.2)">
                                                            <Settings className="w-8 h-8 text-green-500 mb-2" />
                                                            <h4 className="font-semibold text-white">Feature Three</h4>
                                                            <p className="text-xs text-gray-500 mt-1">Green glow</p>
                                                        </SpotlightCard>
                                                    </div>
                                                </div>
                                            )}

                                            {activeId === 'wormhole-portal' && (
                                                <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] relative overflow-hidden rounded-xl border border-white/10">
                                                    <WormholePortal starCount={800} speed={1.2} interactive>
                                                        <div className="flex flex-col items-center justify-center h-full pointer-events-none p-4 text-center">
                                                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                                                Enter the Vortex
                                                            </h2>
                                                            <p className="text-base sm:text-lg text-gray-300 drop-shadow-md">
                                                                Move your mouse to create a wormhole
                                                            </p>
                                                        </div>
                                                    </WormholePortal>
                                                </div>
                                            )}

                                            {activeId === 'timeline' && (
                                                <div className="w-full p-4 sm:p-8 overflow-auto max-h-[600px]">
                                                    <Timeline
                                                        items={[
                                                            {
                                                                id: '1',
                                                                date: 'January 2024',
                                                                title: 'Project Kickoff',
                                                                description: 'Initial planning and team formation.',
                                                                icon: <Rocket className="w-5 h-5" />,
                                                            },
                                                            {
                                                                id: '2',
                                                                date: 'March 2024',
                                                                title: 'Alpha Release',
                                                                description: 'First internal test version deployed.',
                                                                icon: <Code className="w-5 h-5" />,
                                                            },
                                                            {
                                                                id: '3',
                                                                date: 'June 2024',
                                                                title: 'Beta Launch',
                                                                description: 'Public beta with early adopters.',
                                                                icon: <Star className="w-5 h-5" />,
                                                            },
                                                            {
                                                                id: '4',
                                                                date: 'September 2024',
                                                                title: 'Version 1.0',
                                                                description: 'Official production release!',
                                                                icon: <Trophy className="w-5 h-5" />,
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            )}

                                            {activeId === 'kanban-board' && (
                                                <div className="w-full h-[500px] p-4 overflow-hidden">
                                                    <KanbanBoard
                                                        columns={[
                                                            {
                                                                id: 'todo',
                                                                title: 'To Do',
                                                                color: '#EF4444',
                                                                wipLimit: 5,
                                                                cards: [
                                                                    { id: '1', title: 'Design system update', priority: 'high', labels: [{ text: 'Design', color: '#8B5CF6' }] },
                                                                    { id: '2', title: 'API integration', priority: 'medium', assignee: { name: 'John' } },
                                                                ],
                                                            },
                                                            {
                                                                id: 'in-progress',
                                                                title: 'In Progress',
                                                                color: '#F59E0B',
                                                                cards: [
                                                                    { id: '3', title: 'User authentication', priority: 'high', dueDate: 'Jan 25' },
                                                                ],
                                                            },
                                                            {
                                                                id: 'done',
                                                                title: 'Done',
                                                                color: '#22C55E',
                                                                cards: [
                                                                    { id: '4', title: 'Project setup', priority: 'low' },
                                                                ],
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            )}

                                            {activeId === 'file-upload' && (
                                                <div className="w-full max-w-lg mx-auto p-4">
                                                    <FileUploadZone
                                                        accept="image/*,.pdf,.doc,.docx"
                                                        maxSize={5 * 1024 * 1024}
                                                        maxFiles={5}
                                                        multiple={true}
                                                        onFilesSelected={(files) => console.log('Selected:', files)}
                                                    />
                                                </div>
                                            )}

                                            {activeId === 'calendar' && (
                                                <div className="w-full flex items-center justify-center p-4">
                                                    <CalendarComponent
                                                        events={[
                                                            { id: '1', title: 'Meeting', date: new Date(), color: '#8B5CF6' },
                                                            { id: '2', title: 'Deadline', date: new Date(Date.now() + 86400000 * 3), color: '#EF4444' },
                                                            { id: '3', title: 'Launch', date: new Date(Date.now() + 86400000 * 7), color: '#22C55E' },
                                                        ]}
                                                    />
                                                </div>
                                            )}

                                            {activeId === 'stat-card' && (
                                                <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                                    {/* Default Variant */}
                                                    <StatCard
                                                        title="Total Revenue"
                                                        value={45231.89}
                                                        prefix="$"
                                                        decimals={2}
                                                        trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
                                                        sparklineData={[40, 30, 45, 50, 65, 60, 75, 80]}
                                                        color="green"
                                                        icon={<DollarSign />}
                                                    />

                                                    {/* Compact Variant */}
                                                    <StatCard
                                                        title="Active Users"
                                                        value={1234}
                                                        variant="compact"
                                                        trend={{ value: 5.2, direction: 'down' }}
                                                        color="blue"
                                                        icon={<Users />}
                                                    />

                                                    {/* Minimal Variant */}
                                                    <StatCard
                                                        title="Conversion Rate"
                                                        value={3.42}
                                                        suffix="%"
                                                        decimals={2}
                                                        variant="minimal"
                                                        color="purple"
                                                        icon={<Activity />}
                                                    />

                                                    {/* Prominent Variant */}
                                                    <StatCard
                                                        title="Total Orders"
                                                        value={854}
                                                        variant="prominent"
                                                        trend={{ value: 8.1, direction: 'up' }}
                                                        sparklineData={[10, 25, 40, 30, 55, 60, 45, 80, 95]}
                                                        color="yellow"
                                                        icon={<ShoppingCart />}
                                                        className="md:col-span-1"
                                                    />
                                                </div>
                                            )}

                                            {activeId === 'data-table' && (
                                                <div className="w-full p-4 overflow-x-auto">
                                                    <DataTable
                                                        columns={[
                                                            { key: 'name', label: 'Name', sortable: true },
                                                            { key: 'role', label: 'Role', sortable: true },
                                                            {
                                                                key: 'status',
                                                                label: 'Status',
                                                                sortable: true,
                                                                render: (value: any) => (
                                                                    <span className={cn(
                                                                        "px-2 py-1 rounded-full text-xs font-medium",
                                                                        value === 'Active' ? "bg-green-500/10 text-green-500" :
                                                                            value === 'Inactive' ? "bg-gray-500/10 text-gray-500" :
                                                                                "bg-yellow-500/10 text-yellow-500"
                                                                    )}>
                                                                        {value}
                                                                    </span>
                                                                )
                                                            },
                                                            { key: 'lastLogin', label: 'Last Login', sortable: true },
                                                        ]}
                                                        data={[
                                                            { id: 1, name: 'John Doe', role: 'Admin', status: 'Active', lastLogin: '2024-03-10' },
                                                            { id: 2, name: 'Jane Smith', role: 'Member', status: 'Inactive', lastLogin: '2024-03-08' },
                                                            { id: 3, name: 'Bob Johnson', role: 'Editor', status: 'Active', lastLogin: '2024-03-09' },
                                                            { id: 4, name: 'Alice Brown', role: 'Member', status: 'Pending', lastLogin: '2024-03-05' },
                                                            { id: 5, name: 'Charlie Wilson', role: 'Admin', status: 'Active', lastLogin: '2024-03-11' },
                                                            { id: 6, name: 'Diana Prince', role: 'Member', status: 'Active', lastLogin: '2024-03-01' },
                                                            { id: 7, name: 'Evan Wright', role: 'Editor', status: 'Inactive', lastLogin: '2024-02-28' },
                                                        ]}
                                                        title="Team Members"
                                                        rowsPerPage={5}
                                                    />
                                                </div>

                                            )}

                                            {activeId === 'comparison-table' && (
                                                <div className="w-full">
                                                    <ComparisonTable
                                                        plans={[
                                                            { id: 'free', name: 'Free', price: '$0', period: '/mo', description: 'For hobbyists.', buttonText: 'Get Started' },
                                                            { id: 'pro', name: 'Pro', price: '$29', period: '/mo', description: 'For pros.', isRecommended: true, buttonText: 'Upgrade' },
                                                            { id: 'team', name: 'Team', price: '$99', period: '/mo', description: 'For teams.', buttonText: 'Contact Sales' }
                                                        ]}
                                                        features={[
                                                            { id: 'users', name: 'Users', category: 'General' },
                                                            { id: 'storage', name: 'Storage', category: 'General' },
                                                            { id: 'analytics', name: 'Analytics', category: 'Features' },
                                                            { id: 'api', name: 'API Access', category: 'Features' },
                                                            { id: 'support', name: 'Support', category: 'Support' }
                                                        ]}
                                                        data={{
                                                            users: { free: '1', pro: '5', team: 'Unlimited' },
                                                            storage: { free: '1GB', pro: '10GB', team: '1TB' },
                                                            analytics: { free: false, pro: true, team: true },
                                                            api: { free: false, pro: 'Basic', team: 'Unlimited' },
                                                            support: { free: 'Community', pro: 'Email', team: '24/7 Priority' }
                                                        }}
                                                    />
                                                </div>

                                            )}

                                            {activeId === 'charts' && (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full p-4">
                                                    <NeonLineChart
                                                        title="User Growth"
                                                        description="Monthly active users"
                                                        data={[
                                                            { name: 'Jan', value: 400 },
                                                            { name: 'Feb', value: 300 },
                                                            { name: 'Mar', value: 600 },
                                                            { name: 'Apr', value: 800 },
                                                            { name: 'May', value: 500 },
                                                            { name: 'Jun', value: 700 },
                                                        ]}
                                                        color="#ec4899"
                                                        className="col-span-1 lg:col-span-2"
                                                    />
                                                    <GlassBarChart
                                                        title="Revenue"
                                                        description="Monthly revenue in K"
                                                        data={[
                                                            { name: 'Jan', value: 400 },
                                                            { name: 'Feb', value: 300 },
                                                            { name: 'Mar', value: 600 },
                                                            { name: 'Apr', value: 800 },
                                                            { name: 'May', value: 500 },
                                                            { name: 'Jun', value: 700 },
                                                        ]}
                                                        color="#10B981"
                                                    />
                                                    <HoloPieChart
                                                        title="Device Usage"
                                                        description="Traffic by device type"
                                                        data={[
                                                            { name: 'Mobile', value: 400 },
                                                            { name: 'Desktop', value: 300 },
                                                            { name: 'Tablet', value: 100 },
                                                            { name: 'Other', value: 50 },
                                                        ]}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </section>

                                <section id="installation" className="scroll-mt-24 mb-16 space-y-8">
                                    <h3 className="text-2xl font-bold text-white mb-4">Installation</h3>
                                    <div className="space-y-4">
                                        <p className="text-gray-400">Install dependencies:</p>
                                        <CodeBlock code={component.dependencies} language="bash" />
                                    </div>
                                </section>

                                <section id="usage" className="scroll-mt-24 mb-16 space-y-8">
                                    <h3 className="text-2xl font-bold text-white mb-4">Usage</h3>
                                    <CodeBlock code={component.usage} language="tsx" />
                                </section>

                                <section id="code" className="scroll-mt-24 mb-16 space-y-8">
                                    <h3 className="text-2xl font-bold text-white mb-4">Source Code</h3>
                                    <CodeBlock
                                        code={component.code}
                                        language="tsx"
                                        maxHeight="600px"
                                        showLineNumbers={true}
                                    />
                                </section>

                            </div>
                        </div>
                    )
                    }
                </main >

                {/* Right Sidebar - On this page */}
                {
                    !isDocsPage && (
                        <aside className="w-64 flex-shrink-0 hidden xl:block h-full overflow-y-auto pb-12">
                            <h5 className="text-sm font-semibold text-white mb-4">On This Page</h5>
                            <ul className="space-y-2 text-sm">
                                {sections.map(section => (
                                    <li key={section.id}>
                                        <a
                                            href={`#${section.id}`}
                                            className="block text-left text-gray-500 hover:text-white transition-colors"
                                        >
                                            {section.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    )
                }

            </div >
        </div >
    );
};
