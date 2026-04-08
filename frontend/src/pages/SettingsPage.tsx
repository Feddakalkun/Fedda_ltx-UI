import { ModelDownloader } from '../components/ui/ModelDownloader';
import { Settings, Download, Info, BadgeCheck, AlertTriangle } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#08080b]">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-[0.1em] flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-500" />
            Settings
          </h1>
          <p className="text-slate-500 text-sm">LTX-first configuration and model synchronization.</p>
        </div>

        <section className="space-y-5 animate-slide-up">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Download className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">LTX Model Packs</h2>
          </div>

          <div className="grid gap-3">
            <ModelDownloader label="LTX 2.3 Core (Diffusion/Text/VAE)" repo="Kijai/LTX2.3_comfy" subfolder="ltx23_core" />
            <ModelDownloader label="LTX 2.3 LoRAs + IC Control" repo="Lightricks/LTX-2.3" subfolder="ltx23" />
            <ModelDownloader label="LTX 2.3 IC LoRA Union Control" repo="Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control" subfolder="ltx23" />
            <ModelDownloader label="LTX 2 Legacy Split Files" repo="Comfy-Org/ltx-2" subfolder="ltx2" />
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-300" />
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              Pack sync is on-demand only in v1. It will not auto-download until you press <span className="font-semibold">Sync Pack</span>.
            </p>
          </div>
        </section>

        <section className="space-y-5 animate-slide-up" style={{ animationDelay: '0.08s' }}>
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <BadgeCheck className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Release Gate (LTX v1)</h2>
          </div>

          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 text-[12px] text-slate-300">
            <p>Before marking an installer-ready build, verify all of these:</p>
            <ul className="space-y-1 list-disc pl-5 text-slate-400">
              <li>LTX First/Last Frame completes and outputs video preview.</li>
              <li>LTX Image+Audio Lipsync completes and outputs video preview.</li>
              <li>No missing critical nodes in Comfy workflow load.</li>
              <li>Cold start shows landing and enters app once services are ready.</li>
            </ul>
          </div>
        </section>

        <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-widest">LTX-first baseline</h4>
            <p className="text-[11px] text-blue-200/50 leading-relaxed">
              This build is intentionally scoped to LTX-first workflows while runtime parity and RunPod stabilization are in progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
