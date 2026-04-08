import { LtxFlfPage } from './ltx/LtxFlfPage';
import { LtxImgAudioPage } from './ltx/LtxImgAudioPage';
import { Film, Music2 } from 'lucide-react';

interface VideoStudioPageProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const VIDEO_TABS = [
  { id: 'ltx-flf', label: 'LTX — First / Last Frame', icon: Film },
  { id: 'ltx-img-audio', label: 'LTX — Img + Audio Lipsync', icon: Music2 },
];

export const VideoStudioPage = ({ activeTab = 'ltx-flf', onTabChange }: VideoStudioPageProps) => {
  const renderPage = () => {
    if (activeTab === 'ltx' || activeTab === 'ltx-flf') return <LtxFlfPage />;
    if (activeTab === 'ltx-img-audio') return <LtxImgAudioPage />;
    return <LtxFlfPage />;
  };

  const normalised = activeTab === 'ltx' ? 'ltx-flf' : activeTab;

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
              style={
                isActive
                  ? {
                      background: 'var(--accent-subtle)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--accent-from)',
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: '#475569',
                    }
              }
            >
              <Icon className="w-3 h-3 flex-shrink-0" />
              {label}
            </button>
          );
        })}
        <div className="ml-auto px-2 py-1 rounded-md border border-amber-500/30 bg-amber-500/10 text-[10px] font-bold uppercase tracking-wider text-amber-300 whitespace-nowrap">
          LTX Stabilizing
        </div>
      </div>

      <div className="flex-1 overflow-hidden">{renderPage()}</div>
    </div>
  );
};
