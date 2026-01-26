// Component Source Code Imports
// Using Vite's ?raw query to import component files as strings

import GlassCardSource from '../components/GlassCard.tsx?raw';
import InteractiveDockSource from '../components/InteractiveDock.tsx?raw';
import SmartBreadcrumbSource from '../components/SmartBreadcrumb.tsx?raw';
import XRayRevealSource from '../components/XRayReveal.tsx?raw';
import MagneticButtonSource from '../components/MagneticButton.tsx?raw';
import AnimatedWallSource from '../components/AnimatedWall.tsx?raw';
import AuroraBackgroundSource from '../components/AuroraBackground.tsx?raw';
import ParticlesBackgroundSource from '../components/ParticlesBackground.tsx?raw';
import MorphingTabsSource from '../components/MorphingTabs.tsx?raw';
import SpotlightEffectSource from '../components/SpotlightEffect.tsx?raw';
import WormholePortalSource from '../components/WormholePortal.tsx?raw';
import TeleportSearchSource from '../components/TeleportSearch.tsx?raw';
import TimelineSource from '../components/Timeline.tsx?raw';
import KanbanBoardSource from '../components/KanbanBoard.tsx?raw';
import FileUploadZoneSource from '../components/FileUploadZone.tsx?raw';
import CalendarSource from '../components/Calendar.tsx?raw';
import StatCardSource from '../components/StatCard.tsx?raw';
import DataTableSource from '../components/DataTable.tsx?raw';
import ComparisonTableSource from '../components/ComparisonTable.tsx?raw';
import ChartsSource from '../components/Charts.tsx?raw';
import TreeViewSource from '../components/TreeView.tsx?raw';
import ToastSource from '../components/Toast.tsx?raw';
import SkeletonSource from '../components/Skeleton.tsx?raw';
import EmptyStateSource from '../components/EmptyState.tsx?raw';
import StepperSource from '../components/Stepper.tsx?raw';
import ConfettiSource from '../components/Confetti.tsx?raw';
import MegaMenuSource from '../components/MegaMenu.tsx?raw';
import LiquidGradientMeshSource from '../components/LiquidGradientMesh.tsx?raw';
import HolographicFoilSource from '../components/DigitalMatrix.tsx?raw';
import MaskedTextSource from '../components/MaskedText.tsx?raw';

// Map component IDs to their full source code
// IDs must match those in component-data.ts
export const COMPONENT_SOURCES: Record<string, string> = {
    'glass-card': GlassCardSource,
    'dock': InteractiveDockSource,
    'breadcrumb': SmartBreadcrumbSource,
    'x-ray-reveal': XRayRevealSource,
    'magnetic-button': MagneticButtonSource,
    'cyber-grid': AnimatedWallSource,
    'aurora-background': AuroraBackgroundSource,
    'particles-background': ParticlesBackgroundSource,
    'morphing-tabs': MorphingTabsSource,
    'spotlight-effect': SpotlightEffectSource,
    'wormhole-portal': WormholePortalSource,
    'teleport': TeleportSearchSource,
    'timeline': TimelineSource,
    'kanban-board': KanbanBoardSource,
    'file-upload': FileUploadZoneSource,
    'calendar': CalendarSource,
    'stat-card': StatCardSource,
    'data-table': DataTableSource,
    'comparison-table': ComparisonTableSource,
    'charts': ChartsSource,
    'tree-view': TreeViewSource,
    'toasts': ToastSource,
    'skeleton': SkeletonSource,
    'empty-state': EmptyStateSource,
    'stepper': StepperSource,
    'confetti': ConfettiSource,
    'mega-menu': MegaMenuSource,
    'liquid-gradient-mesh': LiquidGradientMeshSource,
    'digital-matrix': HolographicFoilSource,
    'masked-text': MaskedTextSource,
};

