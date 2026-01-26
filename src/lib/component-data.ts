export interface ComponentData {
    id: string;
    name: string;
    description: string;
    dependencies: string; // npm install command
    usage: string; // Usage example
    category?: 'Text & Typography' | 'Cards & Containers' | 'Navigation' | 'Data Display' | 'Inputs & Forms' | 'Feedback & Overlays' | 'Interactive Effects' | 'Backgrounds';
}

export const COMPONENTS: Record<string, ComponentData> = {
    'glass-card': {
        id: 'glass-card',
        name: 'Glass Card',
        description: 'A high-fidelity glass surface with magnetic 3D tilt effect on hover.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Cards & Containers',
        usage: `import { GlassCard } from '@/components/GlassCard';
import { Zap } from 'lucide-react';

export const MyCard = () => (
    <GlassCard className="w-80 h-96 p-8 flex flex-col justify-between">
         <div>
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4 text-accent border border-accent/20">
                <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
            <p className="text-gray-400">Unlock full access to Nexus UI components and premium support.</p>
         </div>
         <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors">
             Get Started
         </button>
    </GlassCard>
);`
    },
    'dock': {
        id: 'dock',
        name: 'Interactive Dock',
        description: 'A macOS-inspired dock with magnification physics and glassmorphism.',
        dependencies: 'npm install framer-motion @radix-ui/react-tooltip clsx tailwind-merge',
        category: 'Navigation',
        usage: `import { Dock, DockIcon } from '@/components/InteractiveDock';
import { Home, Search } from 'lucide-react';

export const MyDock = () => (
  <Dock>
    <DockIcon label="Home"><Home /></DockIcon>
    <DockIcon label="Search"><Search /></DockIcon>
  </Dock>
);`
    },
    'breadcrumb': {
        id: 'breadcrumb',
        name: 'Smart Breadcrumb',
        description: 'Context-aware navigation trail with dropdown menus.',
        dependencies: 'npm install @radix-ui/react-dropdown-menu clsx tailwind-merge lucide-react',
        category: 'Navigation',
        usage: `import { SmartBreadcrumb } from '@/components/SmartBreadcrumb';

// ... items definition
<SmartBreadcrumb items={items} />`
    },
    'teleport': {
        id: 'teleport',
        name: 'Teleport Search',
        description: 'Global command palette for fast navigation and actions.',
        dependencies: 'npm install cmdk framer-motion lucide-react',
        category: 'Inputs & Forms',
        usage: `<TeleportSearch />`
    },
    'x-ray-reveal': {
        id: 'x-ray-reveal',
        name: 'X-Ray Reveal',
        description: 'A magical effect where a cursor-guided mask reveals hidden content layer underneath.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Interactive Effects',
        usage: `import { XRayReveal } from '@/components/XRayReveal';
import { Skull, AlertTriangle, Lock } from 'lucide-react';

export const SecretDossier = () => (
    <XRayReveal
        className="w-full h-96 rounded-xl border border-white/10"
        radius={120}
        revealContent={
            <div className="w-full h-full bg-red-900/20 flex flex-col items-center justify-center text-red-500 p-8 text-center">
                <Skull className="w-16 h-16 mb-4 animate-pulse" />
                <h2 className="text-3xl font-black uppercase tracking-widest mb-2">Top Secret</h2>
                <p className="font-mono text-sm max-w-md">
                    CLASSIFIED INFORMATION: The payload has been delivered. 
                    Meeting point coordinates: 34.0522° N, 118.2437° W
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md opacity-50">
                     {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-red-500/10 rounded border border-red-500/20" />
                     ))}
                </div>
            </div>
        }
    >
        <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-gray-400 p-8 text-center group">
            <Lock className="w-16 h-16 mb-4 group-hover:text-gray-200 transition-colors" />
            <h2 className="text-3xl font-bold mb-2 text-gray-200">Restricted Access</h2>
            <p className="max-w-md">
                This document is classified. Authorization level 4 required to view contents.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-yellow-500 border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span>Hover to decouple security layer</span>
            </div>
        </div>
    </XRayReveal>
);`
    },
    'magnetic-button': {
        id: 'magnetic-button',
        name: 'Magnetic Button',
        description: 'A button that physically attracts to your cursor when you get close.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Interactive Effects',
        usage: `import { MagneticButton } from '@/components/MagneticButton';
import { MousePointer2 } from 'lucide-react';

export const MagneticCTA = () => (
    <div className="flex gap-8 items-center justify-center p-12">
        <MagneticButton strength={0.2} className="p-4 bg-gray-800 rounded-full border border-gray-700 hover:border-gray-500">
             <MousePointer2 className="w-6 h-6 text-white" />
        </MagneticButton>
        
        <MagneticButton strength={0.6} range={150} className="px-8 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow">
             Strong Pull
        </MagneticButton>
    </div>
);`
    },
    'cyber-grid': {
        id: 'cyber-grid',
        name: 'Cyber Grid',
        description: 'A futuristic grid background with pulsing digital blocks, perfect for landing pages or dashboards.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Backgrounds',
        usage: `import { AnimatedWall } from '@/components/AnimatedWall';

export const MyLandingPage = () => (
    <div className="relative w-full h-screen bg-black">
        <AnimatedWall />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <h1 className="text-6xl font-bold mb-4">The Future is Here</h1>
            <button className="px-8 py-4 bg-white text-black rounded-lg font-bold">
                Get Started
            </button>
        </div>
    </div>
);`
    },
    'aurora-background': {
        id: 'aurora-background',
        name: 'Aurora Background',
        description: 'A mesmerizing, flowing gradient background resembling the northern lights.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Backgrounds',
        usage: `import { AuroraBackground } from '@/components/AuroraBackground';

export const LoginPage = () => (
    <div className="h-screen w-full">
        <AuroraBackground>
             <div className="flex items-center justify-center h-full">
                 <h1 className="text-white text-4xl">Login</h1>
             </div>
        </AuroraBackground>
    </div>
);`
    },
    'particles-background': {
        id: 'particles-background',
        name: 'Particles Network',
        description: 'An interactive neural network of connected particles.',
        dependencies: 'npm install clsx tailwind-merge',
        category: 'Backgrounds',
        usage: `import { ParticlesBackground } from '@/components/ParticlesBackground';

export const HeroSection = () => (
    <div className="relative h-[400px] w-full bg-gray-900 overflow-hidden">
        <ParticlesBackground particleCount={50} color="#8B5CF6" />
        <div className="relative z-10 flex items-center justify-center h-full text-white">
            <h1>Connected World</h1>
        </div>
    </div>
);`
    },
    'morphing-tabs': {
        id: 'morphing-tabs',
        name: 'Morphing Tabs',
        description: 'Animated tab navigation with smooth morphing indicator that flows between tabs.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Navigation',
        usage: `import { MorphingTabs } from '@/components/MorphingTabs';
import { Home, Search, Settings } from 'lucide-react';

export const TabVariants = () => {
    return (
        <div className="space-y-8">
            {/* Pill Variant - Filled background indicator */}
            <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                    Pill Variant
                </p>
                <MorphingTabs
                    tabs={[
                        { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
                        { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
                        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                    ]}
                    variant="pill"
                    onChange={(tabId) => console.log('Selected:', tabId)}
                />
            </div>

            {/* Boxed Variant - Subtle border indicator */}
            <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                    Boxed Variant
                </p>
                <MorphingTabs
                    tabs={[
                        { id: 'overview', label: 'Overview' },
                        { id: 'analytics', label: 'Analytics' },
                        { id: 'reports', label: 'Reports' },
                    ]}
                    variant="boxed"
                />
            </div>

            {/* Underline Variant - Bottom border indicator */}
            <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                    Underline Variant
                </p>
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
    );
};`
    },
    'spotlight-effect': {
        id: 'spotlight-effect',
        name: 'Spotlight Effect',
        description: 'A mouse-following spotlight glow effect that dynamically highlights content as the cursor moves.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Cards & Containers',
        usage: `import { SpotlightEffect, SpotlightCard } from '@/components/SpotlightEffect';
import { Sparkles, Zap, Star } from 'lucide-react';

export const SpotlightDemo = () => {
    return (
        <div className="space-y-8">
            {/* Basic Spotlight Effect */}
            <SpotlightEffect className="p-8 bg-black/50">
                <div className="text-center">
                    <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                        Hover to Reveal
                    </h3>
                    <p className="text-gray-400">
                        Move your cursor to see the spotlight effect
                    </p>
                </div>
            </SpotlightEffect>

            {/* Custom Color Spotlight */}
            <SpotlightEffect 
                spotlightColor="rgba(59, 130, 246, 0.2)"
                spotlightSize={300}
                className="p-8 bg-black/50"
            >
                <div className="text-center">
                    <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white">
                        Blue Spotlight
                    </h3>
                </div>
            </SpotlightEffect>

            {/* Spotlight Cards Grid */}
            <div className="grid grid-cols-3 gap-4">
                <SpotlightCard>
                    <Star className="w-8 h-8 text-yellow-500 mb-2" />
                    <h4 className="font-semibold text-white">Feature One</h4>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(34, 197, 94, 0.15)">
                    <Star className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-semibold text-white">Feature Two</h4>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.15)">
                    <Star className="w-8 h-8 text-red-500 mb-2" />
                    <h4 className="font-semibold text-white">Feature Three</h4>
                </SpotlightCard>
            </div>
        </div>
    );
};`
    },
    'wormhole-portal': {
        id: 'wormhole-portal',
        name: 'Wormhole Portal',
        description: 'An infinite tunnel effect with particle acceleration and gravitational lensing. Creates a mesmerizing spacetime distortion visualization.',
        dependencies: 'npm install framer-motion clsx tailwind-merge',
        category: 'Backgrounds',
        usage: `import { WormholePortal } from '@/components/WormholePortal';

export const HeroSection = () => {
    return (
        <div className="h-screen w-full">
            {/* Full-screen background */}
            <WormholePortal intensity={0.8} speed={1.2} interactive>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-white mb-4">
                            Enter the Vortex
                        </h1>
                        <p className="text-xl text-gray-300">
                            Experience spacetime distortion
                        </p>
                    </div>
                </div>
            </WormholePortal>

            {/* Custom color */}
            <WormholePortal 
                color="#3B82F6" 
                intensity={0.6} 
                distortion={0.5}
                className="h-96"
            >
                <div className="p-8">
                    <h2>Blue Wormhole</h2>
                </div>
            </WormholePortal>

            {/* Non-interactive */}
            </WormholePortal>
        </div>
    );
};`
    },
    'timeline': {
        id: 'timeline',
        name: 'Timeline',
        description: 'A beautiful timeline component for displaying events, milestones, or project progress with scroll-reveal animations.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Data Display',
        usage: `import { Timeline, TimelineItem } from '@/components/Timeline';
import { Rocket, Star, Flag, Trophy, Code, Zap } from 'lucide-react';

const milestones: TimelineItem[] = [
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
];

export const ProjectTimeline = () => (
    <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Journey
        </h2>
        
        {/* Vertical Alternating (default) */}
        <Timeline items={milestones} />
        
        {/* Horizontal */}
        <Timeline items={milestones} orientation="horizontal" className="mt-16" />
        
        {/* Vertical Non-Alternating */}
        <Timeline items={milestones} alternating={false} className="mt-16" />
    </div>
);`
    },
    'kanban-board': {
        id: 'kanban-board',
        name: 'Kanban Board',
        description: 'A drag-and-drop task board with columns, cards, filtering, sorting, and WIP limits.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Data Display',
        usage: `import { KanbanBoard, KanbanColumn } from '@/components/KanbanBoard';

const initialColumns: KanbanColumn[] = [
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
];

export const TaskBoard = () => (
    <div className="h-[600px] bg-gray-900 p-4 rounded-xl">
        <KanbanBoard
            columns={initialColumns}
            onColumnsChange={(cols) => console.log('Updated:', cols)}
            onCardClick={(card) => console.log('Clicked:', card)}
            onAddCard={(colId) => console.log('Add to:', colId)}
        />
    </div>
);`
    },
    'file-upload': {
        id: 'file-upload',
        name: 'File Upload Zone',
        description: 'Advanced file uploader with drag-and-drop, preview thumbnails, progress bars, and paste support.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Inputs & Forms',
        usage: `import { FileUploadZone } from '@/components/FileUploadZone';

export const UploadDemo = () => (
    <div className="max-w-lg mx-auto p-8">
        <FileUploadZone
            accept="image/*,.pdf,.doc,.docx"
            maxSize={5 * 1024 * 1024} // 5MB
            maxFiles={5}
            multiple={true}
            onFilesSelected={(files) => console.log('Selected:', files)}
            onUpload={async (files) => {
                // Your upload logic here
                console.log('Uploading:', files);
            }}
        />
    </div>
);`
    },
    'calendar': {
        id: 'calendar',
        name: 'Calendar',
        description: 'Full-featured calendar with month view, date selection, range picking, and event markers.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Data Display',
        usage: `import { Calendar, DatePicker } from '@/components/Calendar';

export const CalendarDemo = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

    const events = [
        { id: '1', title: 'Meeting', date: new Date(), color: '#8B5CF6' },
        { id: '2', title: 'Deadline', date: new Date(Date.now() + 86400000 * 3), color: '#EF4444' },
    ];

    return (
        <div className="space-y-8">
            {/* Basic Calendar */}
            <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                events={events}
            />

            {/* Date Range Selection */}
            <Calendar
                rangeMode
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onRangeChange={(start, end) => {
                    setRangeStart(start);
                    setRangeEnd(end);
                }}
            />

            {/* DatePicker Dropdown */}
            <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Pick a date"
            />
        </div>
    );
};`
    },
    'stat-card': {
        id: 'stat-card',
        name: 'Stats & Metrics',
        description: 'Versatile statistic cards with trends, sparklines, and animated counters. Supports multiple layout variants.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Cards & Containers',
        usage: `import { StatCard } from '@/components/StatCard';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

export const StatsDemo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            className="md:col-span-2"
        />
    </div>
);`
    },
    'data-table': {
        id: 'data-table',
        name: 'Advanced Data Table',
        description: 'Feature-rich data table with sorting, filtering, selection, pagination, and CSV export.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Data Display',
        usage: `import { DataTable, Column } from '@/components/DataTable';

interface User {
  id: number;
  name: string;
  role: string;
  status: string;
  email: string;
}

const columns: Column<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    render: (value) => (
      <span className={\\\`px-2 py-1 rounded-full text-xs font-medium \\\${
        value === 'Active' ? 'bg-green-500/10 text-green-500' : 
        value === 'Inactive' ? 'bg-gray-500/10 text-gray-500' : 
        'bg-yellow-500/10 text-yellow-500'
      }\\\`}>
        {value}
      </span>
    )
  },
  { key: 'email', label: 'Email' },
];

const data = [
  { id: 1, name: 'Alice Johnson', role: 'Admin', status: 'Active', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', role: 'Member', status: 'Inactive', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', role: 'Editor', status: 'Active', email: 'charlie@example.com' },
  { id: 4, name: 'David Wilson', role: 'Member', status: 'Pending', email: 'david@example.com' },
  { id: 5, name: 'Eva Green', role: 'Admin', status: 'Active', email: 'eva@example.com' },
];

export const DataTableDemo = () => (
  <div className="p-4">
    <DataTable
      columns={columns}
      data={data}
      title="Team Members"
      rowsPerPage={3}
    />
  </div>
);`
    },
    'comparison-table': {
        id: 'comparison-table',
        name: 'Comparison Table',
        description: 'Pricing and feature comparison table with sticky headers, recommended plan highlighting, and check/cross indicators.',
        dependencies: 'npm install framer-motion clsx tailwind-merge lucide-react',
        category: 'Data Display',
        usage: `import { ComparisonTable, Plan, Feature, ComparisonData } from '@/components/ComparisonTable';

const plans: Plan[] = [
    { id: 'starter', name: 'Starter', price: '$0', period: '/mo', description: 'For individuals just getting started.' },
    { id: 'pro', name: 'Pro', price: '$29', period: '/mo', description: 'For professional developers.', isRecommended: true },
    { id: 'team', name: 'Team', price: '$99', period: '/mo', description: 'For growing teams.' }
];

const features: Feature[] = [
    { id: 'users', name: 'Users', category: 'General' },
    { id: 'projects', name: 'Projects', category: 'General' },
    { id: 'analytics', name: 'Analytics', category: 'Features' },
    { id: 'support', name: 'Support', category: 'Support' },
];

const data: ComparisonData = {
    users: { starter: '1 User', pro: '5 Users', team: 'Unlimited' },
    projects: { starter: '3 Projects', pro: 'Unlimited', team: 'Unlimited' },
    analytics: { starter: false, pro: true, team: true },
    support: { starter: 'Community', pro: 'Email', team: '24/7 Priority' }
};

export const PricingDemo = () => (
    <div className="p-8">
        <ComparisonTable plans={plans} features={features} data={data} />
    </div>
);`
    },
    'charts': {
        id: 'charts',
        name: 'Neon Charts',
        description: 'High-performance charts with unique neon glows, glassmorphism effects, and custom animations.',
        dependencies: 'npm install recharts framer-motion clsx tailwind-merge',
        category: 'Data Display',
        usage: `import { NeonLineChart, GlassBarChart, HoloPieChart } from '@/components/Charts';

const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
];

export const ChartsDemo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <NeonLineChart 
            title="User Growth" 
            description="Monthly active users" 
            data={data} 
            color="#ec4899" 
        />
        <GlassBarChart 
            title="Revenue" 
            description="Monthly revenue in K" 
            data={data} 
            color="#10B981" 
        />
        <HoloPieChart 
            title="Device Usage" 
            description="Traffic by device type" 
            data={[
                { name: 'Mobile', value: 400 },
                { name: 'Desktop', value: 300 },
                { name: 'Tablet', value: 100 },
            ]} 
        />
    </div>
);`
    },
    'tree-view': {
        id: 'tree-view',
        name: 'Tree View',
        description: 'Hierarchical list component with expandable nodes, custom icons, and smooth animations.',
        dependencies: 'npm install framer-motion lucide-react clsx tailwind-merge',
        category: 'Data Display',
        usage: `import { TreeView, TreeNode } from '@/components/TreeView';
import { Folder, FileCode, CheckCircle, Image as ImageIcon } from 'lucide-react';

const treeData: TreeNode[] = [
    {
        id: '1',
        label: 'src',
        type: 'folder',
        children: [
            {
                id: '2',
                label: 'components',
                type: 'folder',
                children: [
                    { id: '3', label: 'Button.tsx', type: 'file', icon: <FileCode className="w-4 h-4 text-blue-400" />, meta: '2KB' },
                    { id: '4', label: 'Card.tsx', type: 'file', icon: <FileCode className="w-4 h-4 text-blue-400" />, meta: '4KB' },
                ]
            },
            {
                id: '5',
                label: 'assets',
                type: 'folder',
                children: [
                    { id: '6', label: 'logo.png', type: 'file', icon: <ImageIcon className="w-4 h-4 text-purple-400" />, meta: '15KB' },
                ]
            }
        ]
    },
    {
        id: '7',
        label: 'package.json',
        type: 'file',
        icon: <FileCode className="w-4 h-4 text-yellow-500" />
    }
];

export const FileTreeDemo = () => (
    <div className="w-full max-w-sm">
        <TreeView 
            data={treeData} 
            defaultExpanded={['1', '2']} 
            onSelect={(node) => console.log('Selected:', node.label)} 
        />
    </div>
);`
    },
    'toasts': {
        id: 'toasts',
        name: 'Toast Notifications',
        description: 'Global notification system with context API, stackable queuing, and multiple variants.',
        dependencies: 'npm install framer-motion lucide-react clsx tailwind-merge',
        category: 'Feedback & Overlays',
        usage: `import { ToastProvider } from '@/components/Toast';

// Wrap your app root
<ToastProvider>
  <App />
</ToastProvider>

// Use in components
const { toast } = useToast();
toast({ title: "Hello", description: "World" });`
    },
    'skeleton': {
        id: 'skeleton',
        name: 'Skeleton Loader',
        description: 'Animated placeholder elements that mimic the layout of content while it is loading.',
        dependencies: 'npm install clsx tailwind-merge',
        category: 'Feedback & Overlays',
        usage: `import { Skeleton, SkeletonCard, SkeletonProfile } from '@/components/Skeleton';

// Primitives
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="text" width="100%" />
<Skeleton variant="rectangular" className="h-32 w-full" />

// Presets
<SkeletonProfile />
<SkeletonCard />`
    },
    'empty-state': {
        id: 'empty-state',
        name: 'Empty State',
        description: 'Placeholder illustrations for empty data sets, errors, or search results.',
        dependencies: 'npm install framer-motion lucide-react clsx tailwind-merge',
        category: 'Feedback & Overlays',
        usage: `import { EmptyState } from '@/components/EmptyState';

// Default variant
<EmptyState
  title="No items"
  description="Add an item to get started"
  action={{ label: "Add Item", onClick: handleAdd }}
/>

// Search variant
<EmptyState
  variant="search"
  title="No results found"
  description="Try adjusting your filters"
/>

// Error variant
<EmptyState
  variant="error"
  title="Something went wrong"
  description="Please try again later"
/>`
    },
    'stepper': {
        id: 'stepper',
        name: 'Progress Stepper',
        description: 'Multi-step progress indicator with support for horizontal/vertical layouts and current/completed/error states.',
        dependencies: 'npm install framer-motion lucide-react clsx tailwind-merge',
        category: 'Feedback & Overlays',
        usage: `import { Stepper } from '@/components/Stepper';

// Horizontal
<Stepper steps={steps} currentStep={1} />

// Vertical
<Stepper 
    steps={steps} 
    currentStep={1} 
    orientation="vertical" 
/>`
    },
    'confetti': {
        id: 'confetti',
        name: 'Confetti',
        description: 'High-performance canvas-based confetti explosion effect.',
        dependencies: 'No external dependencies',
        category: 'Feedback & Overlays',
        usage: `import { triggerConfetti } from '@/components/Confetti';

// Simple burst
triggerConfetti();

// Custom burst
triggerConfetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#bb0000', '#ffffff']
});`
    },
    'mega-menu': {
        id: 'mega-menu',
        name: 'Mega Menu',
        description: 'A sophisticated navigation menu with multi-column layouts, category headers, featured items with images, and full keyboard navigation.',
        dependencies: 'npm install framer-motion lucide-react',
        category: 'Navigation',
        usage: `import { MegaMenu, MegaMenuSection } from '@/components/MegaMenu';
import { Layers, Zap, Sparkles, Code, Rocket } from 'lucide-react';

const menuSections: MegaMenuSection[] = [
  {
    id: 'products',
    label: 'Products',
    categories: [
      {
        id: 'components',
        title: 'Components',
        items: [
          { id: '1', label: 'Glass Card', icon: Layers, description: 'Beautiful glassmorphism cards' },
          { id: '2', label: 'Spotlight', icon: Zap, description: 'Interactive spotlight effects', badge: 'New' },
        ]
      },
      {
        id: 'animations',
        title: 'Animations',
        items: [
          { id: '3', label: 'Confetti', icon: Sparkles, description: 'Celebration effects' },
          { id: '4', label: 'Aurora', icon: Code, description: 'Background gradients' },
        ]
      }
    ],
    featured: {
      id: 'featured-1',
      title: 'Getting Started Guide',
      description: 'Learn how to use our components',
      image: '/featured-image.png'
    }
  }
];

<MegaMenu sections={menuSections} trigger="hover" />`
    },
    'liquid-gradient-mesh': {
        id: 'liquid-gradient-mesh',
        name: 'Liquid Gradient Mesh',
        description: 'GPU-accelerated fluid gradient background with organic blob morphing, mouse interactivity, and smooth color blending.',
        dependencies: 'npm install clsx tailwind-merge',
        category: 'Backgrounds',
        usage: 'import { LiquidGradientMesh } from \'@/components/LiquidGradientMesh\';\n\nexport const HeroSection = () => (\n    <div className=\"h-screen w-full\">\n        <LiquidGradientMesh\n            colors={[\'#8B5CF6\', \'#3B82F6\', \'#EC4899\', \'#10B981\']}\n            speed={1}\n            complexity={3}\n            blur={60}\n            interactive\n        >\n            <div className=\"flex items-center justify-center h-full\">\n                <h1 className=\"text-white text-6xl font-bold\">Welcome</h1>\n            </div>\n        </LiquidGradientMesh>\n    </div>\n);'
    },
    'digital-matrix': {
        id: 'digital-matrix',
        name: 'Digital Matrix',
        description: 'Animated matrix-style background with random characters, wave distortion, and scanlines inspired by Midjourney.',
        dependencies: 'npm install clsx tailwind-merge',
        category: 'Backgrounds',
        usage: 'import { DigitalMatrix } from \'@/components/DigitalMatrix\';\n\nexport const HeroSection = () => (\n    <div className=\"h-screen w-full\">\n        <DigitalMatrix\n            color=\"#4a9eff\"\n            secondaryColor=\"#7c3aed\"\n            density={0.65}\n            speed={0.8}\n            wave={true}\n            scanlineOpacity={0.15}\n        >\n            <div className=\"flex items-center justify-center h-full\">\n                <h1 className=\"text-white text-6xl font-bold\">Welcome</h1>\n            </div>\n        </DigitalMatrix>\n    </div>\n);'
    },
    'masked-text': {
        id: 'masked-text',
        name: 'Masked Text',
        description: 'An animated text component with a hover-triggered letter reveal effect. Each letter slides up with customizable stagger delay, duration, easing, and hover color.',
        dependencies: 'No external dependencies (React only)',
        category: 'Text & Typography',
        usage: `import MaskedText from '@/components/MaskedText';

// Default settings
<MaskedText>Hello World</MaskedText>

// Fast animation with quick stagger
<MaskedText 
    duration={0.3} 
    staggerDelay={0.02}
>
    Fast Animation
</MaskedText>

// Slow, dramatic effect with bounce easing
<MaskedText 
    duration={1} 
    staggerDelay={0.1}
    hoverColor="#ff6b6b"
    easing="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
>
    Slow Bounce
</MaskedText>

// Custom color and easing
<MaskedText 
    duration={0.6} 
    staggerDelay={0.03}
    hoverColor="#00d4ff"
    easing="ease-out"
    className="text-4xl font-bold"
>
    Custom Style
</MaskedText>

// No delay (all letters move together)
<MaskedText 
    duration={0.4} 
    staggerDelay={0}
    hoverColor="#9b59b6"
>
    Synchronized
</MaskedText>`
    }
};
