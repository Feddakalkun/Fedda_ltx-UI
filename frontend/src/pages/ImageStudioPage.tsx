import { ZImageTxt2Img } from './zimage/ZImageTxt2Img';
import { Sparkles } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

interface ImageStudioPageProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const IMAGE_TABS = [
  { id: 'z-image',     label: 'Z-Image'         },
  { id: 'flux',        label: 'Flux'             },
  { id: 'qwen',        label: 'Qwen'             },
  { id: 'image-other', label: 'Other Workflows'  },
];

export const ImageStudioPage = ({ activeTab = 'z-image', onTabChange }: ImageStudioPageProps) => {
  const normalised = activeTab === 'image' ? 'z-image' : activeTab;

  const renderPage = () => {
    if (normalised === 'z-image') return <ZImageTxt2Img />;
    if (normalised === 'flux')
      return <PlaceholderPage label="Flux Studio" description="Flux operations and tools coming soon." icon={<Sparkles className="w-8 h-8" />} />;
    if (normalised === 'qwen')
      return <PlaceholderPage label="Qwen Studio" description="Qwen structural operations coming soon." icon={<Sparkles className="w-8 h-8" />} />;
    if (normalised === 'image-other')
      return <PlaceholderPage label="Other Workflows" description="Uncategorized image processing capabilities coming soon." icon={<Sparkles className="w-8 h-8" />} />;
    return <ZImageTxt2Img />;
  };

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
        {IMAGE_TABS.map(({ id, label }) => {
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
