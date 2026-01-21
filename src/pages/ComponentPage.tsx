
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Dock, DockIcon } from '../components/InteractiveDock';
import { GlassCard } from '../components/GlassCard';
import { SmartBreadcrumb } from '../components/SmartBreadcrumb';
import { XRayReveal } from '../components/XRayReveal';
import { MagneticButton } from '../components/MagneticButton';
import { Home, Search, Calendar, Folder, MessageSquare, ArrowLeft, Zap, Settings, ChevronRight, Skull, AlertTriangle, Lock, MousePointer2 } from 'lucide-react';
import { COMPONENTS } from '../lib/component-data';
import { CodeBlock } from '../components/CodeBlock';
import { cn } from '../lib/utils';
import { AnimatedWall } from '../components/AnimatedWall';
import { AuroraBackground } from '../components/AuroraBackground';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ComponentPage = () => {
    const { ignore } = useParams();
    const navigate = useNavigate();
    const activeId = ignore || 'glass-card';
    const component = COMPONENTS[activeId];

    const [activeTab, setActiveTab] = useState('preview');
    const [activeDockApp, setActiveDockApp] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [activeId]);

    // If ID is invalid, redirect to default
    useEffect(() => {
        if (!component) {
            navigate('/components/glass-card', { replace: true });
        }
    }, [component, navigate]);

    if (!component) return null;

    const sections = [
        { id: 'preview', label: 'Preview' },
        { id: 'usage', label: 'Usage' },
        { id: 'installation', label: 'Installation' },
    ];

    const scrollToSection = (id: string) => {
        // Implement scrolling logic if needed, or just switch tabs for now since the content is tabbed
        // Ideally Next.js docs are single page scroll, but here we have tabs.
        // Let's stick to tabs but maybe "On this page" could link to headers within the active tab?
        // For this version, let's keep the tabs concept but make "On this page" switch tabs or just link to subsections.
        // Actually, to look like Next.js, it might be better if it wasn't tabs but vertical content.
        // However, the prompt asked to "update" the existing page, which uses tabs.
        // Let's keep tabs for Preview/Code to allow interactive playground, but maybe "Installation" could be below?
        // Let's stick to the tabs for now as it's cleaner for a component library.
        setActiveTab(id);
    };

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
                            className="fixed inset-y-0 left-0 z-[70] w-64 bg-[#0A0A0A] border-r border-white/10 p-6 lg:hidden overflow-y-auto scrollbar-hide"
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
                                        <li><span className="text-sm text-gray-500 cursor-not-allowed">Introduction</span></li>
                                        <li><span className="text-sm text-gray-500 cursor-not-allowed">Installation</span></li>
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
                                                            onClick={() => setActiveTab('preview')}
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

            <div className="max-w-[1440px] mx-auto flex gap-6 lg:gap-10 px-4 sm:px-6 lg:px-8 h-full relative z-10">

                {/* Left Sidebar - Navigation */}
                <aside className="w-64 flex-shrink-0 hidden lg:block h-full overflow-y-auto pr-4 pb-12 scrollbar-hide">
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
                                    <span className="text-sm text-gray-500 cursor-not-allowed">Introduction</span>
                                </li>
                                <li>
                                    <span className="text-sm text-gray-500 cursor-not-allowed">Installation</span>
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
                                                    onClick={() => setActiveTab('preview')}
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
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 h-full overflow-y-auto pb-12 scrollbar-hide">
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
                        <div className="flex items-center gap-6 border-b border-white/10 mb-8">
                            {['Preview', 'Code', 'Installation'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={cn(
                                        "pb-3 text-sm font-medium border-b-2 transition-colors relative top-[1px]",
                                        activeTab === tab.toLowerCase()
                                            ? "border-accent text-accent"
                                            : "border-transparent text-gray-400 hover:text-gray-200"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="animate-fade-in">
                            {/* Preview Tab */}
                            {activeTab === 'preview' && (
                                <div className="space-y-8">
                                    <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden min-h-[300px] sm:min-h-[400px] flex items-center justify-center relative bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] bg-[size:20px_20px]">

                                        {/* Specific Render Logic */}
                                        {activeId === 'dock' && (
                                            <div className="mt-auto pb-10 w-full overflow-x-auto px-4 flex justify-center scrollbar-hide">
                                                <Dock>
                                                    <DockIcon label="Home" isActive={activeDockApp === 'home'} onClick={() => setActiveDockApp('home')}><Home /></DockIcon>
                                                    <DockIcon label="Search" isActive={activeDockApp === 'search'} onClick={() => setActiveDockApp('search')}><Search /></DockIcon>
                                                    <DockIcon label="Calendar" isActive={activeDockApp === 'calendar'} onClick={() => setActiveDockApp('calendar')}><Calendar /></DockIcon>
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
                                    </div>
                                </div>
                            )}

                            {/* Code Tab */}
                            {activeTab === 'code' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">Usage</h3>
                                        <CodeBlock code={component.usage} language="tsx" />
                                    </div>
                                </div>
                            )}

                            {/* Installation Tab */}
                            {activeTab === 'installation' && (
                                <div className="space-y-8">
                                    <section className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">1. Install Dependencies</h3>
                                        <p className="text-gray-400 text-sm">run the following command in your terminal</p>
                                        <CodeBlock code={component.dependencies} language="bash" />
                                    </section>

                                    <section className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white">2. Copy Source Code</h3>
                                        <p className="text-gray-400 text-sm">Paste the code into your component file.</p>
                                        <CodeBlock
                                            code={component.code}
                                            language="tsx"
                                            maxHeight="600px"
                                            showLineNumbers={true}
                                        />
                                    </section>
                                </div>
                            )}

                        </div>
                    </div>
                </main>

                {/* Right Sidebar - On this page */}
                <aside className="w-64 flex-shrink-0 hidden xl:block h-full overflow-y-auto pb-12">
                    <h5 className="text-sm font-semibold text-white mb-4">On This Page</h5>
                    <ul className="space-y-2 text-sm">
                        {sections.map(section => (
                            <li key={section.id}>
                                <button
                                    onClick={() => scrollToSection(section.id)}
                                    className={cn(
                                        "block text-left transition-colors hover:text-white",
                                        activeTab === section.id ? "text-accent" : "text-gray-500 p"
                                    )}
                                >
                                    {section.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

            </div>
        </div>
    );
};
