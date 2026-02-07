
import React, { useState } from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { AnalysisResult, AppStatus, FilterSettings } from '../types';
import Stage3AOutfits from './Stage3A_Outfits';
import Stage3BPdfBox from './Stage3B_PdfBox';

interface ResultsSectionProps {
  result: AnalysisResult | null;
  status: AppStatus;
  filters: FilterSettings;
  setFilters: React.Dispatch<React.SetStateAction<FilterSettings>>;
  onFindOutfits: (filters: FilterSettings) => void;
  onOpenModal: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  result, 
  status, 
  filters, 
  setFilters, 
  onFindOutfits, 
  onOpenModal 
}) => {
  const [activeTab, setActiveTab] = useState<'outfits' | 'guide'>('outfits');

  // Safety Checks
  if (!result) {
    return (
      <div className="py-20 text-center bg-white rounded-[40px] border border-black/5 p-12 shadow-sm">
        <p className="text-black/40 font-bold uppercase tracking-widest text-sm">Keine Ergebnisse geladen (Result is null)</p>
      </div>
    );
  }

  if (!result.season_type) {
    return (
      <div className="py-20 text-center bg-white rounded-[40px] border border-red-100 p-12 shadow-sm">
        <h3 className="text-red-500 font-black uppercase tracking-widest text-lg mb-4">Fehler: Saison-Typ fehlt</h3>
        <p className="text-black/40 text-xs font-mono max-w-lg mx-auto overflow-hidden whitespace-nowrap text-ellipsis">
          Empfangen: {JSON.stringify(result)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-20 animate-in fade-in duration-1000">
      <div className="flex flex-col items-center gap-4">
        <span className="text-xs font-black tracking-[0.4em] uppercase text-black/20">Result Analysis</span>
        <h2 className="text-5xl md:text-7xl font-black chroma-logo tracking-tighter uppercase text-center">
          {result.season_type}
        </h2>
        <div className="w-16 h-1 gradient-cta rounded-full mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/30">Stil-Profil</h3>
             <div className="h-px bg-black/5 w-full" />
          </div>
          <p className="text-[#1A1A1A] text-xl md:text-2xl leading-relaxed italic font-light serif pr-0 md:pr-8">
            "{result.description_premium || result.user_analysis}"
          </p>
        </div>

        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/30">Chromatische Palette</h3>
             <div className="h-px bg-black/5 w-full" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Fix: Renamed iterator variable 'c' to 'color' to resolve "Cannot find name 'color'" on line 82 */}
            {result.color_palette?.map((color, i) => (
              <div key={i} className="group space-y-3 md:space-y-4">
                <div 
                  className="w-full aspect-square rounded-full shadow-md border border-black/[0.08] transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-center">
                  <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest truncate leading-none text-[#1A1A1A]">
                    {color.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEGMENTED CONTROL / TABS */}
      <div className="pt-6 md:pt-10 space-y-8 md:space-y-12">
        <div className="max-w-md mx-auto p-1.5 bg-black/[0.05] rounded-2xl flex gap-1 shadow-inner border border-black/[0.02]">
          <button
            onClick={() => setActiveTab('outfits')}
            className={`flex-1 py-3.5 px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === 'outfits'
                ? "bg-white text-[#1A1A1A] shadow-md"
                : "text-black/40 hover:text-black/60"
            }`}
          >
            <ShoppingBag size={14} />
            🛍️ Dein Shop
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3.5 px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === 'guide'
                ? "bg-white text-[#1A1A1A] shadow-md"
                : "text-black/40 hover:text-black/60"
            }`}
          >
            <Star size={14} />
            📩 Gratis-Guide
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          {activeTab === 'outfits' ? (
            <Stage3AOutfits 
              filters={filters}
              setFilters={setFilters}
              result={result}
            />
          ) : (
            <Stage3BPdfBox onOpenModal={onOpenModal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
