import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Dock, DockIcon } from '../components/InteractiveDock';
import { GlassCard } from '../components/GlassCard';
import { SmartBreadcrumb } from '../components/SmartBreadcrumb';
import { Home, Search, Calendar, Folder, MessageSquare, ArrowLeft, Zap, Settings } from 'lucide-react';
import { COMPONENTS } from '../lib/component-data';
import { CodeBlock } from '../components/CodeBlock';

export const ComponentPage = () => {
    const { ignore } = useParams();
    const navigate = useNavigate();
    const activeId = ignore || 'glass-card'; // Default to glass-card
    const component = COMPONENTS[activeId];

    const [activeTab, setActiveTab] = useState('preview');
    const [activeDockApp, setActiveDockApp] = useState('home');

    // If ID is invalid, redirect to default
    useEffect(() => {
        if (!component) {
            navigate('/components/glass-card', { replace: true });
        }
    }, [component, navigate]);


    if (!component) return null;

    return (
        <div className="min-h-screen pt-24 px-8 pb-12 max-w-7xl mx-auto flex gap-12">

            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-3">Components</h3>
                    {Object.values(COMPONENTS).map((item) => (
                        <Link
                            key={item.id}
                            to={`/components/${item.id}`}
                            onClick={() => setActiveTab('preview')}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeId === item.id
                                ? 'bg-white/10 text-white font-medium shadow-sm'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl font-bold text-white tracking-tight">{component.name}</h1>
                    <p className="text-lg text-gray-400">{component.description}</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 border-b border-white/10 mb-8">
                    {['Preview', 'Code', 'Installation'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                ? 'border-accent text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">
                    {activeTab === 'preview' && (
                        <div className="glass rounded-3xl p-12 min-h-[400px] flex items-center justify-center bg-gray-900/50 relative overflow-hidden perspective-1000">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                            {/* Specific Render Logic based on ID */}
                            {activeId === 'dock' && (
                                <div className="mt-auto">
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
                                <GlassCard className="w-[340px] h-auto p-8 flex flex-col justify-between">
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
                                <div className="mt-[-100px]">
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
                                    <p className="text-gray-400 mb-4">Press <kbd className="bg-white/10 px-2 py-1 rounded text-white">Cmd+K</kbd> to open</p>
                                    <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} className="px-4 py-2 bg-accent/20 text-accent rounded-lg border border-accent/20">
                                        Open Palette
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Usage Tab */}
                    {activeTab === 'code' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Usage Example</h3>
                            <CodeBlock code={component.usage} language="tsx" />
                        </div>
                    )}

                    {/* Installation Tab */}
                    {activeTab === 'installation' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Step 1: Dependencies */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">1. Install Dependencies</h3>
                                <CodeBlock code={component.dependencies} language="bash" />
                            </div>

                            {/* Step 2: Source Code */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">2. Copy Source Code</h3>
                                <CodeBlock
                                    code={component.code}
                                    language="tsx"
                                    maxHeight="600px"
                                    showLineNumbers={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
