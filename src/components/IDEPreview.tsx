import { motion } from 'framer-motion';
import { Dock, DockIcon } from './InteractiveDock';
import { Zap, Activity, Users, DollarSign, Home, Search, Calendar, Folder, MessageSquare } from 'lucide-react';
import { StatCard } from './StatCard';
import { GlassCard } from './GlassCard';

export const IDEPreview = () => {
    return (
        <div className="w-full max-w-6xl mx-auto relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0A]/90 backdrop-blur-xl">
            {/* Window Header */}
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <div className="ml-4 text-xs text-gray-500 font-mono">nexus-dashboard.tsx</div>
            </div>

            {/* Window Content */}
            <div className="p-6 md:p-8 min-h-[500px] flex flex-col gap-8 relative bg-grid-white/[0.02]">
                {/* Decorative Code Sidebar */}
                <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-white/5 hidden md:flex flex-col items-center py-4 gap-4 text-gray-600">
                    <div className="text-[10px] font-mono">01</div>
                    <div className="text-[10px] font-mono">02</div>
                    <div className="text-[10px] font-mono">03</div>
                    <div className="text-[10px] font-mono">04</div>
                    <div className="text-[10px] font-mono">05</div>
                </div>

                <div className="md:pl-16 space-y-8">
                    {/* Dashboard Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Overview</h2>
                            <p className="text-gray-400 text-sm">Real-time metrics and performance data.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs border border-green-500/20">Live</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Revenue"
                            value={45231.89}
                            prefix="$"
                            decimals={2}
                            trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
                            sparklineData={[40, 30, 45, 50, 65, 60, 75, 80]}
                            color="purple"
                            icon={<DollarSign />}
                            variant="compact"
                        />
                        <StatCard
                            title="Active Users"
                            value={1234}
                            trend={{ value: 5.2, direction: 'up' }}
                            color="blue"
                            icon={<Users />}
                            variant="compact"
                        />
                        <StatCard
                            title="Engagement"
                            value={854}
                            trend={{ value: 2.1, direction: 'down' }}
                            color="purple"
                            icon={<Activity />}
                            variant="compact"
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
                        {/* Glass Card - Main */}
                        <div className="md:col-span-2 h-full">
                            <GlassCard className="h-full p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                            <Zap className="w-4 h-4 text-accent" />
                                        </div>
                                        <h3 className="font-semibold text-white">System Performance</h3>
                                    </div>
                                    <div className="flex gap-1 h-24 items-end mb-4">
                                        {[40, 60, 45, 70, 50, 65, 80, 55, 75, 90, 60, 85].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex-1 bg-gradient-to-t from-accent/20 to-accent/60 rounded-t-sm"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                    <span className="text-accent">{`>>> system.check_integrity()`}</span><br />
                                    <span className="text-green-500">✓ All systems operational</span>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Side Panel */}
                        <div className="h-full space-y-4">
                            <div className="h-full rounded-2xl bg-white/5 border border-white/10 p-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/0" />
                                <h4 className="relative text-sm font-semibold text-white mb-3">Activities</h4>
                                <div className="space-y-3 relative">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                            <div className="h-2 w-24 bg-white/10 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dock */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <Dock className="bg-black/50 backdrop-blur-md border-white/10">
                        <DockIcon><Home className="w-5 h-5" /></DockIcon>
                        <DockIcon><Search className="w-5 h-5" /></DockIcon>
                        <DockIcon><Calendar className="w-5 h-5" /></DockIcon>
                        <DockIcon><Folder className="w-5 h-5" /></DockIcon>
                        <DockIcon><MessageSquare className="w-5 h-5" /></DockIcon>
                    </Dock>
                </div>
            </div>
        </div>
    );
};
