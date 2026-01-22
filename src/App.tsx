import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight, Home, Layout, Box, Settings, Github } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { TeleportSearch, type SearchGroup } from './components/TeleportSearch';
import { useNexus } from './lib/nexus-provider';
import { ComponentPage } from './pages/ComponentPage';
import { COMPONENTS } from './lib/component-data';
import { cn } from './lib/utils';
import { ParticleField, GridBackground } from './components/BackgroundEffects';
import { IDEPreview } from './components/IDEPreview';
import { AnimatePresence, motion } from 'framer-motion';

// FAQ Item Component

// FAQ Item Component
const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left hover:text-accent transition-colors group"
      >
        <span className="text-lg font-medium text-white group-hover:text-accent transition-colors">{question}</span>
        <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-gray-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();



  return (
    <div className="pt-24 px-6 max-w-[1400px] mx-auto space-y-32 pb-32">
      {/* Hero Section */}
      <section className="space-y-16 py-12">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            v1.0.0 Now Available
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
            The open source <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">UI component library</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            ReactUI provides a comprehensive set of premium, interactive components built with React and Framer Motion. Ship stunning interfaces in minutes, not days.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
            <button
              onClick={() => navigate('/components/glass-card')}
              className="px-8 py-3.5 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Browse Components <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        {/* Hero Visual - IDE Preview */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl opacity-50 -z-10" />
          <IDEPreview />
        </div>
      </section>

      {/* What is NexusUI Section */}
      <section className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start border-t border-white/10 pt-24">
        <div className="space-y-6 sticky top-24">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">What is ReactUI?</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            ReactUI is a collection of re-usable components that you can copy and paste into your apps. It focuses on <span className="text-white font-medium">micro-interactions</span>, <span className="text-white font-medium">aesthetics</span>, and <span className="text-white font-medium">accessibility</span>.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            Unlike other libraries, ReactUI doesn't just give you buttons and inputs. It gives you complex, production-ready compositions like Kanban boards, interactive docks, and data visualization cards.
          </p>
          <button className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center gap-2 mt-4">
            Read the docs <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-12">
          {[
            { title: "Magnetic Interactions", desc: "Buttons and cards that react to cursor proximity for a tangible feel." },
            { title: "Glassmorphism", desc: "Premium frosted glass effects using backdrop-filter and noise textures." },
            { title: "Deep Customization", desc: "Built with Tailwind CSS for infinite theming capabilities." },
            { title: "Animation First", desc: "Powered by Framer Motion for buttery smooth transitions." },
            { title: "Type Safe", desc: "Written in TypeScript with comprehensive type definitions." },
            { title: "Accessibility", desc: "WAI-ARIA compliant components for inclusive experiences." },
          ].map((feature, i) => (
            <div key={i} className="group">
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                <span className="text-sm font-mono text-gray-500">0{i + 1}</span>
                {feature.title}
              </h3>
              <p className="text-gray-400 pl-8 border-l border-white/10 ml-2 py-2 group-hover:border-accent/50 transition-colors">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack - Horizontal Scroll */}
      <section className="border-t border-white/10 pt-24">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Powering next-gen apps</h3>
        <div className="flex flex-wrap gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion', 'Lucide Icons'].map((tech) => (
            <span key={tech} className="text-xl font-bold text-white">{tech}</span>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-white/10 pt-24 max-w-3xl">
        <h2 className="text-3xl font-bold text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-2">
          <FAQItem
            question="Is ReactUI free to use?"
            answer="Yes, ReactUI is completely free and open source. You can use it in personal and commercial projects."
          />
          <FAQItem
            question="Do I need to install a package?"
            answer="ReactUI is designed as a copy-paste library. You can copy individual components into your project. However, we also provide a CLI tool to automate this process."
          />
          <FAQItem
            question="Can I customize the styles?"
            answer="Absolutely. Since you own the code, you can customize every aspect of the components using Tailwind CSS classes."
          />
          <FAQItem
            question="Does it work with Next.js?"
            answer="Yes, all components are fully compatible with Next.js (App Router and Pages Router), Remix, and Vite."
          />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 text-center border-t border-white/10 mt-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to ship?</h2>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/components')}
            className="group relative px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Start Building</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
          </button>
        </div>
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
    <div className={cn("min-h-screen transition-colors duration-300 selection:bg-purple-500/30 relative overflow-x-hidden", theme === 'dark' ? "bg-[#0a0a0f]" : "bg-[#F9FAFB]")}>
      {/* Enhanced Background Effects */}
      <ParticleField />
      <GridBackground />

      {/* Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-[40%] -right-[20%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
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