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
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left hover:text-primary transition-colors group"
      >
        <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">{question}</span>
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
            <div className="pb-6 text-muted-foreground leading-relaxed">
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

  // Container variants for stagger animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="pt-24 px-6 max-w-[1400px] mx-auto space-y-32 pb-32">
      {/* Hero Section */}
      <motion.section
        className="space-y-16 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-4xl space-y-8">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-4 hover:bg-accent/20 transition-colors cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            v1.0.0 Now Available
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.3
            }}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground leading-[1.1]"
          >
            The open source <br />
            <motion.span
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.5
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 inline-block"
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              UI component library
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            ReactUI provides a comprehensive set of premium, interactive components built with React and Framer Motion. Ship stunning interfaces in minutes, not days.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4"
          >
            <motion.button
              onClick={() => navigate('/components/glass-card')}
              className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              />
              <span className="relative z-10">Browse Components</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-colors flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>View on GitHub</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Hero Visual - IDE Preview */}
        <motion.div
          variants={itemVariants}
          className="relative"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl opacity-50 -z-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <IDEPreview />
        </motion.div>
      </motion.section>

      {/* What is ReactUI Section */}
      <motion.section
        className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start border-t border-black/5 dark:border-white/10 pt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="space-y-6 sticky top-24"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">What is ReactUI?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ReactUI is a collection of re-usable components that you can copy and paste into your apps. It focuses on <span className="text-foreground font-medium">micro-interactions</span>, <span className="text-foreground font-medium">aesthetics</span>, and <span className="text-foreground font-medium">accessibility</span>.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
            Unlike other libraries, ReactUI doesn't just give you buttons and inputs. It gives you complex, production-ready compositions like Kanban boards, interactive docks, and data visualization cards.
          </p>
          <motion.button
            className="px-6 py-3 rounded-lg border border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2 mt-4 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read the docs <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.div
          className="space-y-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {[
            { title: "Magnetic Interactions", desc: "Buttons and cards that react to cursor proximity for a tangible feel." },
            { title: "Glassmorphism", desc: "Premium frosted glass effects using backdrop-filter and noise textures." },
            { title: "Deep Customization", desc: "Built with Tailwind CSS for infinite theming capabilities." },
            { title: "Animation First", desc: "Powered by Framer Motion for buttery smooth transitions." },
            { title: "Type Safe", desc: "Written in TypeScript with comprehensive type definitions." },
            { title: "Accessibility", desc: "WAI-ARIA compliant components for inclusive experiences." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="group"
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 100,
                    damping: 15
                  }
                }
              }}
              whileHover={{ x: 5 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <motion.span
                  className="text-sm font-mono text-gray-500"
                  whileHover={{ scale: 1.2, color: '#8b5cf6' }}
                >
                  0{i + 1}
                </motion.span>
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-400 pl-8 border-l border-black/10 dark:border-white/10 ml-2 py-2 group-hover:border-accent/50 transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Tech Stack - Horizontal Scroll */}
      <motion.section
        className="border-t border-border pt-24"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Powering next-gen apps</h3>
        <motion.div
          className="flex flex-wrap gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 0.5,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion', 'Lucide Icons'].map((tech) => (
            <motion.span
              key={tech}
              className="text-xl font-bold text-foreground cursor-pointer"
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{
                scale: 1.2,
                color: '#8b5cf6',
                transition: { duration: 0.2 }
              }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="border-t border-border pt-24 max-w-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-3xl font-bold text-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </motion.h2>
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
      </motion.section>

      {/* Footer CTA */}
      <motion.section
        className="py-24 text-center border-t border-black/5 dark:border-white/10 mt-12"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to ship?
        </motion.h2>
        <div className="flex justify-center">
          <motion.button
            onClick={() => navigate('/components')}
            className="group relative px-10 py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-lg flex items-center gap-3 shadow-[0_0_40px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)] overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 40px -5px rgba(139, 92, 246, 0.3)',
                '0 0 60px -5px rgba(139, 92, 246, 0.6)',
                '0 0 40px -5px rgba(139, 92, 246, 0.3)'
              ]
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%',
                opacity: 0
              }}
              whileHover={{ opacity: 0.2 }}
            />
            <span className="relative z-10">Start Building</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 blur-xl opacity-50"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

function LayoutWrapper() {
  const { toggleTheme } = useNexus();
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
    <div className={cn("min-h-screen transition-colors duration-300 selection:bg-primary/30 relative overflow-x-hidden bg-background text-foreground")}>
      {/* Enhanced Background Effects */}
      <ParticleField />
      <GridBackground />

      {/* Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[60%] h-[60%] bg-purple-500/5 dark:bg-purple-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-[40%] -right-[20%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
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