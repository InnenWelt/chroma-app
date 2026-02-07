
import React from 'react';
import { ShoppingBag, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset }) => {
  const getZalandoLink = (query: string) => {
    // Ersetze Leerzeichen durch ein + wie angefordert
    const formattedQuery = query.trim().replace(/\s+/g, '+');
    return `https://www.zalando.ch/katalog/?q=${formattedQuery}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle2 size={16} />
          Analyse abgeschlossen
        </div>
        <h2 className="text-5xl md:text-6xl font-bold serif text-slate-900">
          {result.season_type || 'Dein Farbtyp'}
        </h2>
        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
      </div>

      {/* Description */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Deine Farb-DNA</h3>
        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line italic">
          "{result.description_premium || result.user_analysis}"
        </p>
      </div>

      {/* Color Palette */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold serif text-center">Deine Signature-Farben</h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {result.color_palette.map((color, idx) => (
            <div key={idx} className="group flex flex-col items-center gap-3">
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg border-4 border-white transform transition-transform group-hover:scale-110"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-center">
                <p className="font-medium text-slate-900">{color.name}</p>
                <p className="text-xs text-slate-400 uppercase font-mono">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zalando Recommendations */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold serif">Produkt-Empfehlungen für dich</h3>
          <ShoppingBag className="text-slate-300" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.zalando_search_queries?.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[160px]">
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">{item}</h4>
                <p className="text-sm text-slate-500 mb-6">Optimiert für deinen Farbtyp {result.season_type || 'Profil'}.</p>
              </div>
              <a 
                href={getZalandoLink(item)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-600 transition-colors group"
              >
                Auf Zalando ansehen
                <ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-slate-900 underline underline-offset-4 transition-colors"
        >
          Ein weiteres Foto analysieren
        </button>
      </div>
    </div>
  );
};

export default AnalysisView;
