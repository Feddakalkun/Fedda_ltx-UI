import { useState, useEffect } from 'react';
import { Loader2, Play, CheckCircle2, Cpu, Activity, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage = ({ onEnter }: LandingPageProps) => {
  const [activeVideo, setActiveVideo] = useState<'bg' | 'grok'>('bg');
  const [backendOnline, setBackendOnline] = useState(false);
  const [comfyOnline, setComfyOnline] = useState(false);
  const [, setComfyFullyReady] = useState(false);
  const [startupDetail, setStartupDetail] = useState('Initializing services...');
  const [checks, setChecks] = useState(0);
  const [lastCheckedAt, setLastCheckedAt] = useState<number>(Date.now());

  const showDoneVideo = comfyOnline;
  const readyPercent = comfyOnline ? 100 : backendOnline ? 45 : 10;
  const statusLabel = showDoneVideo ? 'System Ready' : 'Starting ComfyUI';

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      let backendAlive = false, comfyAlive = false, comfyReady = false;
      let detail = 'Initializing services...';
      try {
        const r = await fetch('/comfy/system_stats', { cache: 'no-store' });
        comfyReady = r.ok; comfyAlive = r.ok;
      } catch { comfyReady = false; comfyAlive = false; }
      if (!comfyAlive) {
        try {
          const r = await fetch('/comfy/', { cache: 'no-store' });
          comfyAlive = r.status < 500;
        } catch { comfyAlive = false; }
      }
      try {
        const r = await fetch('/health', { cache: 'no-store' });
        backendAlive = r.ok;
      } catch { backendAlive = false; }
      if (!backendAlive) detail = 'Starting backend API service...';
      else if (!comfyAlive) detail = 'ComfyUI startup in progress...';
      else if (!comfyReady) detail = 'ComfyUI port online — loading nodes...';
      else detail = 'All systems online.';
      if (!isMounted) return;
      setBackendOnline(backendAlive);
      setComfyOnline(comfyAlive);
      setComfyFullyReady(comfyReady);
      setStartupDetail(detail);
      setChecks(p => p + 1);
      setLastCheckedAt(Date.now());
    };
    const id = setInterval(checkStatus, 2000);
    checkStatus();
    return () => { isMounted = false; clearInterval(id); };
  }, []);

  useEffect(() => {
    if (showDoneVideo) return;
    const id = setInterval(() => setActiveVideo(p => p === 'bg' ? 'grok' : 'bg'), 8000);
    return () => clearInterval(id);
  }, [showDoneVideo]);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center font-sans">

      {/* Background videos */}
      {!showDoneVideo && (
        <>
          <video autoPlay muted loop playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ${activeVideo === 'bg' ? 'opacity-50' : 'opacity-0'}`}>
            <source src="/loading/pingpong/bg.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ${activeVideo === 'grok' ? 'opacity-50' : 'opacity-0'}`}>
            <source src="/loading/pingpong/grok.mp4" type="video/mp4" />
          </video>
        </>
      )}
      <video autoPlay muted loop playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${showDoneVideo ? 'opacity-70' : 'opacity-0 pointer-events-none'}`}>
        <source src="/loading/pingpong/done.mp4" type="video/mp4" />
      </video>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Radial vignette */}
      <div className="absolute inset-0 vignette-radial pointer-events-none" />

      {/* Accent glow behind the card */}
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-8">

        {/* Title */}
        <div className="animate-fade-in">
          <h1 className="text-[80px] font-black text-white tracking-[0.15em] uppercase leading-none"
            style={{ textShadow: '0 0 60px rgba(139,92,246,0.4)' }}>
            FEDDA
          </h1>
          {/* Accent underline */}
          <div className="h-[3px] w-20 mx-auto mt-3 rounded-full"
            style={{ background: 'linear-gradient(90deg, #8b5cf6, #6366f1)', boxShadow: '0 0 12px rgba(139,92,246,0.8)' }} />
          <p className="text-[11px] text-slate-500 font-semibold tracking-[0.3em] uppercase mt-3">
            AI Creative Platform
          </p>
        </div>

        {/* Status card */}
        <div className="animate-slide-up w-[340px] space-y-3">

          {/* Status pill */}
          <div className={`flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full border text-xs font-bold tracking-widest uppercase transition-all duration-500 ${
            showDoneVideo
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-violet-500/10 border-violet-500/25 text-violet-300'
          }`}>
            {showDoneVideo
              ? <CheckCircle2 className="w-4 h-4" />
              : <Loader2 className="w-4 h-4 animate-spin" />
            }
            {statusLabel}
          </div>

          {/* Detail text */}
          <p className="text-[11px] text-slate-500 text-center">{startupDetail}</p>

          {/* Readiness card */}
          <div
            className="rounded-2xl p-4 text-left space-y-3"
            style={{
              background: 'rgba(8,8,20,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-600">
              <span>Startup Readiness</span>
              <span className="font-mono" style={{ color: readyPercent === 100 ? '#34d399' : '#8b5cf6' }}>
                {readyPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${readyPercent}%`,
                  background: readyPercent === 100
                    ? 'linear-gradient(90deg, #34d399, #10b981)'
                    : 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                  boxShadow: readyPercent === 100
                    ? '0 0 8px rgba(52,211,153,0.5)'
                    : '0 0 8px rgba(139,92,246,0.5)',
                }}
              />
            </div>

            {/* Service status row */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Backend API', online: backendOnline, icon: Cpu },
                { label: 'ComfyUI', online: comfyOnline, icon: Activity },
              ].map(({ label, online, icon: Icon }) => (
                <div key={label}
                  className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{
                    background: online ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${online ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" style={{ color: online ? '#34d399' : '#475569' }} />
                  <div>
                    <p className="text-[10px] font-semibold" style={{ color: online ? '#34d399' : '#475569' }}>
                      {online ? 'Online' : 'Starting'}
                    </p>
                    <p className="text-[9px] text-slate-600">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[9px] text-slate-700 font-mono">
              polls: {checks} · {new Date(lastCheckedAt).toLocaleTimeString()}
            </div>
          </div>

          {/* Enter button — enabled when ready */}
          <button
            id="landing-enter-btn"
            onClick={onEnter}
            className="w-full py-4 font-black text-base uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 text-white cursor-pointer active:scale-95 hover:scale-[1.02]"
            style={showDoneVideo ? {
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              boxShadow: '0 0 24px rgba(139,92,246,0.5)',
            } : {
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span className="flex items-center justify-center gap-3">
              Enter System <Play className="w-4 h-4 fill-current" />
            </span>
          </button>

          {/* Explore without backend */}
          {!showDoneVideo && (
            <button
              onClick={onEnter}
              className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-400 transition-colors mx-auto"
            >
              <ArrowRight className="w-3 h-3" />
              Explore without backend
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
