
import React, { useState } from 'react';
import { Palette, Loader2, X, RefreshCw, AlertCircle } from 'lucide-react';
import { AppStatus, AnalysisResult, FilterSettings } from './types';
import Stage1Upload from './components/Stage1_Upload';
import EmailModal from './components/EmailModal';
import ResultsSection from './components/ResultsSection';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debugData, setDebugData] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterSettings>({
    gender: 'Damen',
    occasion: 'Freizeit',
    budget: 'Mittel',
    vibe: 'Minimalistisch',
    season: 'Übergang',
    fit: 'Regular',
    categories: []
  });

  const extractJson = (text: string) => {
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}') + 1;
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error('Kein JSON-Objekt in der Antwort gefunden');
    }
    return text.substring(jsonStartIndex, jsonEndIndex);
  };

  const startAnalysis = async (file: File) => {
    setStatus(AppStatus.ANALYZING);
    setDebugData(null);
    let rawResponseText = "";
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('https://hook.eu1.make.com/uxp6o031fhb2swo3knmr3995m7b2x027', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      rawResponseText = await response.text();
      const cleanJson = extractJson(rawResponseText);
      const data = JSON.parse(cleanJson);
      
      // Korrektes Mapping basierend auf der Make-Struktur
      const mappedData: AnalysisResult = {
        analysis_id: data.analysis_id || Date.now().toString(),
        // user_analysis kann ein String oder ein Objekt sein
        user_analysis: data.user_analysis?.description_premium || (typeof data.user_analysis === 'string' ? data.user_analysis : "Dein Style-Profil"),
        season_type: data.user_analysis?.season_type || data.season_type,
        description_premium: data.user_analysis?.description_premium || data.description_premium,
        color_palette: data.color_palette || [],
        zalando_search_queries: data.zalando_search_queries || []
      };

      console.log('Final Mapped Data:', mappedData);
      setResult(mappedData);
      setStatus(AppStatus.ANALYSIS_COMPLETE);
    } catch (error: any) {
      console.error("Parsing Error:", error);
      setDebugData(rawResponseText || error.message || "Keine lesbare Antwort vom Server erhalten.");
      setStatus(AppStatus.ERROR);
    }
  };

  const findOutfits = async (currentFilters: FilterSettings) => {
    setStatus(AppStatus.FINDING_OUTFITS);
    try {
      const response = await fetch('https://hook.eu1.make.com/uxp6o031fhb2swo3knmr3995m7b2x027', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: currentFilters,
          previous_analysis_text: result?.user_analysis,
          mode: 'filter_search',
          analysis_id: result?.analysis_id
        }),
      });

      if (!response.ok) throw new Error('Network error');
      
      const rawText = await response.text();
      const cleanJson = extractJson(rawText);
      const data = JSON.parse(cleanJson);

      setResult(prev => prev ? {
        ...prev,
        zalando_search_queries: data.zalando_search_queries || []
      } : null);
      setStatus(AppStatus.ANALYSIS_COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ANALYSIS_COMPLETE);
    }
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setDebugData(null);
    setFilters({
      gender: 'Damen',
      occasion: 'Freizeit',
      budget: 'Mittel',
      vibe: 'Minimalistisch',
      season: 'Übergang',
      fit: 'Regular',
      categories: []
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-[#00C6FF]/20 selection:text-[#1A1A1A]">
      <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-xl border-b border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6 cursor-pointer group" onClick={reset}>
            <img 
              src="https://i.ibb.co/NgCCm5WC/logo.png" 
              alt="CHROMA Logo" 
              className="h-12 w-12 object-contain rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            <span className="text-3xl md:text-4xl chroma-logo font-black tracking-tighter uppercase leading-none text-[#1A1A1A]">CHROMA</span>
          </div>
          {status !== AppStatus.IDLE && (
            <button onClick={reset} className="text-black/40 hover:text-black flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors">
              <RefreshCw size={14} /> Reset
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 md:py-20">
        {status === AppStatus.IDLE && (
          <div className="space-y-24 py-12">
            <div className="text-center max-w-4xl mx-auto space-y-10">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-9xl font-black chroma-logo tracking-tighter leading-[0.85] uppercase italic text-[#1A1A1A]">
                  Editorial <br/>
                  Intelligence
                </h1>
                <div className="flex justify-center pt-4">
                  <div className="w-24 h-2 gradient-cta rounded-full glow-accent animate-pulse" />
                </div>
              </div>
              <p className="text-2xl text-black/50 leading-relaxed font-light max-w-2xl mx-auto">
                Präzise KI-Analyse für deine persönliche Stil-DNA. <br/>Minimalistisch, modern, exklusiv.
              </p>
            </div>
            <Stage1Upload onAnalyze={startAnalysis} isBusy={false} />
          </div>
        )}

        {status === AppStatus.ANALYZING && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAFAFA] animate-in fade-in">
            <div className="relative">
               <Loader2 size={80} className="text-black/10 animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 gradient-cta rounded-full animate-pulse" />
               </div>
            </div>
            <h2 className="text-3xl font-black chroma-logo mt-10 uppercase tracking-tighter">Analyzing identity</h2>
            <p className="text-black/30 font-medium mt-2 tracking-widest text-xs uppercase">Please wait for the editorial result</p>
          </div>
        )}

        {(status === AppStatus.ANALYSIS_COMPLETE || status === AppStatus.FINDING_OUTFITS) && (
          <ResultsSection 
            result={result} 
            status={status} 
            filters={filters} 
            setFilters={setFilters} 
            onFindOutfits={findOutfits} 
            onOpenModal={() => setIsModalOpen(true)}
          />
        )}

        {status === AppStatus.ERROR && (
          <div className="py-20 text-center space-y-8 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <X size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black chroma-logo tracking-tighter uppercase">System Failure</h2>
              <p className="text-black/40 max-w-md mx-auto">Die chromatische Analyse konnte nicht abgeschlossen werden.</p>
            </div>
            
            {debugData && (
              <div className="max-w-2xl mx-auto mt-8 p-6 bg-black/[0.02] border border-black/5 rounded-3xl text-left overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-red-500/60 font-bold uppercase tracking-widest text-[10px]">
                  <AlertCircle size={14} /> Critical Data Debugger
                </div>
                <div className="bg-white/80 p-6 rounded-2xl font-mono text-xs text-black/60 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-black/[0.03]">
                  {debugData}
                </div>
              </div>
            )}

            <button onClick={reset} className="gradient-cta text-white px-12 py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20">Retry</button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <EmailModal 
          onClose={() => setIsModalOpen(false)} 
          analysisResult={result}
          filters={filters}
        />
      )}

      <footer className="bg-white border-t border-black/[0.03] py-20 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl chroma-logo font-black tracking-tighter uppercase text-[#1A1A1A]">CHROMA</span>
          </div>
          <p className="text-[10px] text-black/20 font-black tracking-[0.3em] uppercase">© 2024 Editorial intelligence group. All rights reserved.</p>
          <div className="flex gap-10 text-[10px] font-black tracking-[0.2em] uppercase text-black/40">
            <a href="#" className="hover:text-black transition-colors">Legal</a>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
