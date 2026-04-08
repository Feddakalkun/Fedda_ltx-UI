// Sidebar Navigation — v3 slim icon rail
import {
  Video, Music, Sparkles, Settings, Terminal,
  MessageSquare, Images, Film, Wand2, LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  group?: string[];   // sub-tab ids that "belong" to this item
}

const NAV_ITEMS: NavItem[] = [
  { id: 'chat',          label: 'Agent Chat',   icon: MessageSquare,  color: '#a78bfa' },
  { id: 'z-image',       label: 'Image Studio', icon: Sparkles,       color: '#f472b6',
    group: ['image','z-image','flux','qwen','image-other'] },
  { id: 'wan22-vid2vid', label: 'Video Studio', icon: Video,          color: '#60a5fa',
    group: ['video','wan22-vid2vid','wan22-img2vid','ltx','ltx-flf','ltx-img-audio'] },
  { id: 'audio',         label: 'Audio / SFX',  icon: Music,          color: '#34d399' },
];

const EXPLORE_ITEMS: NavItem[] = [
  { id: 'gallery',   label: 'Gallery',      icon: Images,          color: '#fb923c' },
  { id: 'videos',    label: 'Videos',       icon: Film,            color: '#f87171' },
  { id: 'library',   label: 'LoRA Library', icon: LayoutDashboard, color: '#facc15' },
  { id: 'workflows', label: 'Workflows',    icon: Wand2,           color: '#e879f9' },
];

const SYSTEM_ITEMS: NavItem[] = [
  { id: 'logs',     label: 'Logs',     icon: Terminal, color: '#94a3b8' },
  { id: 'settings', label: 'Settings', icon: Settings, color: '#94a3b8' },
];

const IconButton = ({
  item, activeTab, onTabChange,
}: { item: NavItem; activeTab: string; onTabChange: (t: string) => void }) => {
  const isActive = activeTab === item.id || (item.group?.includes(activeTab) ?? false);
  return (
    <div className="tooltip-trigger flex justify-center">
      <button
        id={`nav-${item.id}`}
        onClick={() => onTabChange(item.id)}
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative"
        style={isActive ? {
          background: 'var(--accent-subtle)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 0 12px var(--accent-glow)',
        } : {
          background: 'transparent',
          border: '1px solid transparent',
        }}
      >
        <item.icon
          className="w-[18px] h-[18px] transition-colors duration-150"
          style={{ color: isActive ? item.color : '#475569' }}
        />
        {/* Active dot */}
        {isActive && (
          <span
            className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
          />
        )}
      </button>
      <div className="tooltip-content left-full ml-3 bottom-auto top-1/2 -translate-y-1/2 translate-x-0"
        style={{ transform: 'translateY(-50%)' }}>
        {item.label}
      </div>
    </div>
  );
};

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside
      className="w-[60px] flex flex-col items-center z-20 relative py-3 gap-1"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Gradient accent line top */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, #6366f1, transparent)' }} />

      {/* Logo mark */}
      <div className="mb-3 flex justify-center">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            boxShadow: '0 0 14px rgba(139,92,246,0.4)',
          }}
        >
          F
        </div>
      </div>

      {/* Create section */}
      <div className="flex flex-col gap-0.5 w-full px-1.5">
        {NAV_ITEMS.map(item => (
          <IconButton key={item.id} item={item} activeTab={activeTab} onTabChange={onTabChange} />
        ))}
      </div>

      {/* Divider */}
      <div className="w-6 h-px my-2" style={{ background: 'rgba(255,255,255,0.07)' }} />

      {/* Explore section */}
      <div className="flex flex-col gap-0.5 w-full px-1.5">
        {EXPLORE_ITEMS.map(item => (
          <IconButton key={item.id} item={item} activeTab={activeTab} onTabChange={onTabChange} />
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* System at bottom */}
      <div className="flex flex-col gap-0.5 w-full px-1.5 mb-2">
        {SYSTEM_ITEMS.map(item => (
          <IconButton key={item.id} item={item} activeTab={activeTab} onTabChange={onTabChange} />
        ))}
      </div>

      {/* Live dot */}
      <div className="dot-online animate-pulse mb-1" />
    </aside>
  );
};
