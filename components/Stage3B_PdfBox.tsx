
import React from 'react';
import { Sparkles, FileText, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface Stage3BPdfBoxProps {
  onOpenModal: () => void;
}

const Stage3BPdfBox: React.FC<Stage3BPdfBoxProps> = ({ onOpenModal }) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-[40px] p-10 md:p-20 border border-black/[0.03] shadow-lg shadow-black/[0.01] flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-2 gradient-cta opacity-50" />
      
      <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-10 shadow-inner border border-indigo-100/50">
        <Star size={40} className="fill-indigo-500/20" />
      </div>

      <div className="max-w-3xl space-y-10">
        <div className="space-y-4">
           <span className="text-[10px] font-black tracking-[0.6em] uppercase text-black/20">Exklusives Editorial</span>
           <h3 className="text-4xl md:text-6xl font-black chroma-logo tracking-tighter uppercase leading-[0.9] text-[#1A1A1A]">
             Dein persönliches <br/>Style-Profil sichern
           </h3>
        </div>
        
        <div className="space-y-8">
          <p className="text-black/70 text-xl md:text-2xl font-medium leading-relaxed max-w-xl mx-auto">
            Speichere deine Analyse-Ergebnisse dauerhaft ab. Wir senden dir deinen digitalen Farbpass und erste Tipps direkt in dein Postfach.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-[11px] font-black uppercase tracking-widest text-black/40">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-indigo-500" /> Digitaler Farbpass fürs Handy</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-indigo-500" /> Die wichtigsten Do's & Don'ts</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-indigo-500" /> Outfit-Inspirationen</span>
          </div>
        </div>

        <div className="pt-8 w-full max-w-md mx-auto">
          <button 
            onClick={onOpenModal}
            className="group gradient-cta text-white w-full py-7 rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-[0_20px_50px_-10px_rgba(0,198,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-5"
          >
            <FileText size={24} />
            <span>Jetzt kostenlos anfordern</span>
          </button>
        </div>

        <p className="text-black/20 text-[10px] font-black uppercase tracking-[0.3em] pt-8">
          100% kostenlos anfordern • Sofort-Versand via E-Mail
        </p>
      </div>
    </div>
  );
};

export default Stage3BPdfBox;
