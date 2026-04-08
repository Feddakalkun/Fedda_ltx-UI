// Sidebar Navigation — FEDDA v3 redesign
import {
  Video,
  Music,
  Sparkles,
  Settings,
  Terminal,
  MessageSquare,
  Images,
  Film,
  Wand2,
  LayoutDashboard,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { APP_CONFIG } from '../../config/api';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;      // icon accent colour when active
  subitems?: { id: string; label: string }[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    label: 'Create',
    items: [
      { id: 'chat',  label: 'Agent Chat',   icon: MessageSquare, color: '#a78bfa' },
      {
        id: 'image', label: 'Image Studio', icon: Sparkles, color: '#f472b6',
        subitems: [
          { id: 'z-image',     label: 'Z-Image'    },
          { id: 'flux',        label: 'Flux'        },
          { id: 'qwen',        label: 'Qwen'        },
          { id: 'image-other', label: 'Other'       },
        ],
      },
      {
        id: 'video', label: 'Video Studio', icon: Video, color: '#60a5fa',
        subitems: [
          { id: 'wan22-vid2vid', label: 'WAN 2.2 — Vid2Vid'      },
          { id: 'wan22-img2vid', label: 'WAN 2.2 — Img2Vid'      },
          { id: 'ltx-flf',       label: 'LTX — First/Last Frame' },
          { id: 'ltx-img-audio', label: 'LTX — Img + Audio'      },
        ],
      },
      { id: 'audio', label: 'Audio / SFX',  icon: Music, color: '#34d399' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { id: 'gallery',   label: 'Gallery',      icon: Images,         color: '#fb923c' },
      { id: 'videos',    label: 'Videos',        icon: Film,           color: '#f87171' },
      { id: 'library',   label: 'LoRA Library',  icon: LayoutDashboard,color: '#facc15' },
      { id: 'workflows', label: 'Workflows',     icon: Wand2,          color: '#e879f9' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'logs',     label: 'Console Logs', icon: Terminal, color: '#94a3b8' },
      { id: 'settings', label: 'Settings',     icon: Settings, color: '#94a3b8' },
    ],
  },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside
      className="w-[220px] flex flex-col z-20 relative"
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Gradient accent line along the top */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, #6366f1, transparent)' }} />

      {/* ── Logo ── */}
      <div className="px-5 pt-7 pb-5">
        <div className="flex items-end gap-2">
          {/* Glowing accent box */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              boxShadow: '0 0 16px rgba(139,92,246,0.5)',
            }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none">
              {APP_CONFIG.NAME}
            </h1>
            <p className="text-[9px] font-semibold mt-0.5 uppercase tracking-[0.15em]"
              style={{ color: '#8b5cf6' }}>
              AI Creative Hub
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto custom-scrollbar space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
              {section.label}
            </p>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isGroupActive = activeTab === item.id
                  || (item.subitems?.some(s => s.id === activeTab) ?? false);
                const isLeafActive = activeTab === item.id && !item.subitems;

                return (
                  <div key={item.id}>
                    <button
                      id={`nav-${item.id}`}
                      onClick={() =>
                        onTabChange(item.subitems ? item.subitems[0].id : item.id)
                      }
                      className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                        isLeafActive
                          ? 'theme-active-tab'
                          : isGroupActive
                            ? 'text-white bg-white/6'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {/* Icon with accent colour when active */}
                      <item.icon
                        className="w-[15px] h-[15px] flex-shrink-0 transition-colors duration-150"
                        style={{ color: isGroupActive ? item.color : undefined }}
                      />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.subitems && (
                        <ChevronRight
                          className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
                            isGroupActive ? 'rotate-90 text-white/60' : 'text-slate-700'
                          }`}
                        />
                      )}
                    </button>

                    {/* Subitems — animated reveal */}
                    {item.subitems && isGroupActive && (
                      <div className="mt-0.5 mb-1 ml-4 pl-3 space-y-0.5 animate-slide-in-left"
                        style={{ borderLeft: '1px solid rgba(139,92,246,0.2)' }}>
                        {item.subitems.map((sub) => {
                          const isSubActive = activeTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => onTabChange(sub.id)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                                isSubActive
                                  ? 'text-white bg-white/8'
                                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/4'
                              }`}
                              style={
                                isSubActive
                                  ? { color: item.color, textShadow: `0 0 8px ${item.color}60` }
                                  : undefined
                              }
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-mono text-slate-700 tracking-widest">
          v{APP_CONFIG.VERSION}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="dot-online animate-pulse" />
          <span className="text-[9px] text-slate-600">live</span>
        </div>
      </div>
    </aside>
  );
};