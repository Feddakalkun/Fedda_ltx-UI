import type { ReactNode } from 'react';

interface PlaceholderPageProps {
  icon?: ReactNode;
  label: string;
  description?: string;
}

export const PlaceholderPage = ({ icon, label, description }: PlaceholderPageProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 select-none">

      {/* Accent glow orb */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-3xl scale-[2.5]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }}
        />
        <div
          className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-accent)',
            boxShadow: '0 0 24px var(--accent-glow)',
          }}
        >
          <span style={{ color: 'var(--accent-from)' }}>
            {icon ?? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none"
                viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </span>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <h2 className="text-2xl font-bold text-white tracking-tight">{label}</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description ?? 'This section is ready to be built. Add your components here.'}
        </p>
      </div>

      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase"
        style={{
          background: 'var(--accent-subtle)',
          border: '1px solid var(--border-accent)',
          color: 'var(--accent-from)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-from)' }} />
        Coming Soon
      </div>
    </div>
  );
};
