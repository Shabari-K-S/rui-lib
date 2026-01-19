import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Code, Layers, Zap, Home, Settings, Layout, Box } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { TeleportSearch, type SearchGroup } from './components/TeleportSearch';
import { useNexus } from './lib/nexus-provider';
import { ComponentPage } from './pages/ComponentPage';
import { COMPONENTS } from './lib/component-data';
import { cn } from './lib/utils';

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">Nexus UI v1.0</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">
          The future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Interface Design</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
          A next-generation component library for React. Built with magnetic physics,
          glassmorphism, and deep interactivity.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/components/glass-card')}
            className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
          >
            Browse Components <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all backdrop-blur-md">
            Documentation
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Magnetic Physics", icon: <Zap />, desc: "Interactions that feel alive with spring-based animations." },
          { title: "Glassmorphism 2.0", icon: <Layers />, desc: "Next-level blur effects and translucent materials." },
          { title: "Developer First", icon: <Code />, desc: "Type-safe, accessible, and easy to customize." },
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

function LayoutWrapper() {
  const { theme, toggleTheme } = useNexus();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Configuration Definition
  const searchGroups: SearchGroup[] = [
    {
      heading: 'Navigation',
      items: [
        {
          id: 'home',
          label: 'Home',
          icon: Home,
          action: () => navigate('/')
        },
        {
          id: 'components',
          label: 'All Components',
          icon: Layout,
          action: () => navigate('/components')
        }
      ]
    },
    {
      heading: 'Components',
      items: Object.values(COMPONENTS).map(comp => ({
        id: comp.id,
        label: comp.name,
        icon: Box,
        action: () => navigate(`/components/${comp.id}`)
      }))
    },
    {
      heading: 'Settings',
      items: [
        {
          id: 'theme',
          label: 'Toggle Theme',
          icon: Settings,
          action: () => toggleTheme(),
          shortcut: '⌘ T'
        }
      ]
    }
  ];


  return (
    <div className={cn("min-h-screen transition-colors duration-300 selection:bg-accent/30", theme === 'dark' ? "bg-[#0F0F0F]" : "bg-[#F9FAFB]")}>
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/components" element={<ComponentPage />} />
        <Route path="/components/:ignore" element={<ComponentPage />} />
      </Routes>

      {/* Global Elements */}
      <TeleportSearch searchGroups={searchGroups} />
    </div>
  );
}

export default function App() {
  return (
    <LayoutWrapper />
  );
}
