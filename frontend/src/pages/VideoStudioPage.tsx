import { Wan22Vid2Vid } from './wan22/Wan22Vid2Vid';
import { Wan22Img2Vid } from './wan22/Wan22Img2Vid';
import { LtxFlfPage } from './ltx/LtxFlfPage';
import { LtxImgAudioPage } from './ltx/LtxImgAudioPage';
import { Video, Film } from 'lucide-react';

interface VideoStudioPageProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const VIDEO_TABS = [
  { id: 'wan22-vid2vid', label: 'WAN 2.2 — Vid2Vid',      icon: Video },
  { id: 'wan22-img2vid', label: 'WAN 2.2 — Img2Vid',      icon: Video },
  { id: 'ltx-flf',       label: 'LTX — First/Last Frame', icon: Film  },
  { id: 'ltx-img-audio', label: 'LTX — Img + Audio',      icon: Film  },
];

export const VideoStudioPage = ({ activeTab = 'wan22-vid2vid', onTabChange }: VideoStudioPageProps) => {
  const renderPage = () => {
    if (activeTab === 'video' || activeTab === 'wan22-vid2vid') return <Wan22Vid2Vid />;
    if (activeTab === 'wan22-img2vid') return <Wan22Img2Vid />;
    if (activeTab === 'ltx' || activeTab === 'ltx-flf') return <LtxFlfPage />;
    if (activeTab === 'ltx-img-audio') return <LtxImgAudioPage />;
    return <Wan22Vid2Vid />;
  };

  // Normalise activeTab for the tab bar highlight
  const normalised = activeTab === 'video' ? 'wan22-vid2vid'
    : activeTab === 'ltx' ? 'ltx-flf'
    : activeTab;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Sub-tab bar ── */}
      <div
        className="shrink-0 flex items-center gap-1 px-4 overflow-x-auto"
        style={{
          height: '42px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.25)',
        }}
      >
        {VIDEO_TABS.map(({ id, label, icon: Icon }) => {
          const isActive = normalised === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange?.(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-150"
              style={isActive ? {
                background: 'var(--accent-subtle)',
                border: '1px solid var(--border-accent)',
                color: 'var(--accent-from)',
              } : {
                background: 'transparent',
                border: '1px solid transparent',
                color: '#475569',
              }}
            >
              <Icon className="w-3 h-3 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Page content ── */}
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>
    </div>
  );
};
