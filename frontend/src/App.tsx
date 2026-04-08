import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LandingPage } from './pages/LandingPage';
import { TopSystemStrip } from './components/ui/TopSystemStrip';
import { ToastProvider } from './components/ui/Toast';
import { ComfyExecutionProvider } from './contexts/ComfyExecutionContext';
import {
  MessageSquare,
  Images,
  Film,
  LayoutDashboard,
  Terminal,
  Settings,
} from 'lucide-react';

// LTX-first shell tabs
const VALID_TABS = new Set([
  'chat',
  'ltx',
  'ltx-flf',
  'ltx-img-audio',
  'gallery',
  'videos',
  'library',
  'logs',
  'settings',
]);

const PAGE_META: Record<string, { label: string; description: string; Icon: any }> = {
  chat: { label: 'Agent Chat', description: 'Your AI assistant and creative collaborator.', Icon: MessageSquare },
  ltx: { label: 'LTX Studio', description: 'LTX-first video generation workspace.', Icon: Film },
  'ltx-flf': { label: 'LTX - First / Last Frame', description: 'Generate video between two keyframes with LTX.', Icon: Film },
  'ltx-img-audio': { label: 'LTX - Img + Audio Lipsync', description: 'Generate lipsync video from image and audio with LTX.', Icon: Film },
  gallery: { label: 'Gallery', description: 'Browse and manage your generated images.', Icon: Images },
  videos: { label: 'Videos', description: 'View and manage your generated video files.', Icon: Film },
  library: { label: 'LoRA Library', description: 'Manage your installed LoRA models.', Icon: LayoutDashboard },
  logs: { label: 'Console Logs', description: 'Monitor backend logs and debug information.', Icon: Terminal },
  settings: { label: 'Settings', description: 'Configure models and system preferences.', Icon: Settings },
};

const TAB_KEY = 'fedda_active_tab_v2';

function readActiveTab(): string {
  try {
    const raw = localStorage.getItem(TAB_KEY);
    if (raw && VALID_TABS.has(raw)) return raw;
  } catch {
    // ignore storage read errors
  }
  return 'ltx';
}

import { VideoStudioPage } from './pages/VideoStudioPage';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';

function FeddaApp() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(readActiveTab);

  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, activeTab);
    } catch {
      // ignore storage write errors
    }
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    if (!VALID_TABS.has(tab)) return;
    setActiveTab(tab);
  };

  const meta = PAGE_META[activeTab] ?? PAGE_META.ltx;

  const renderPage = () => {
    switch (activeTab) {
      case 'ltx':
      case 'ltx-flf':
      case 'ltx-img-audio':
        return <VideoStudioPage activeTab={activeTab} onTabChange={handleTabChange} />;
      case 'library':
        return <LibraryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <PlaceholderPage
            label={meta.label}
            description={meta.description}
            icon={<meta.Icon className="w-8 h-8" />}
          />
        );
    }
  };

  return (
    <div className="flex h-screen theme-bg-app text-white overflow-hidden font-sans selection:bg-violet-500/20">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40 z-0" />

      {showLanding && <LandingPage onEnter={() => setShowLanding(false)} />}

      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="relative flex-1 flex flex-col overflow-hidden theme-bg-main z-10">
        <header
          className="h-14 flex items-center px-6 shrink-0 z-10 justify-between"
          style={{
            background: 'rgba(4,4,10,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border-accent)' }}
            >
              <meta.Icon className="w-3.5 h-3.5" style={{ color: 'var(--accent-from)' }} />
            </div>
            <h2 className="text-sm font-semibold text-white/90 tracking-tight">{meta.label}</h2>
            <span className="text-slate-700 text-xs">/</span>
            <span className="text-[11px] text-slate-500 truncate max-w-[260px]">{meta.description}</span>
          </div>

          <TopSystemStrip />
        </header>

        <div className="flex-1 overflow-hidden">{renderPage()}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ComfyExecutionProvider>
      <ToastProvider>
        <FeddaApp />
      </ToastProvider>
    </ComfyExecutionProvider>
  );
}
