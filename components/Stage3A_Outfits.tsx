
import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, Sparkles, ChevronDown, Filter } from 'lucide-react';
import { FilterSettings, AnalysisResult } from '../types';

interface Stage3AProps {
  filters: FilterSettings;
  setFilters: React.Dispatch<React.SetStateAction<FilterSettings>>;
  result: AnalysisResult;
}

const CATEGORIES: Record<string, string[]> = {
  'Damen': ['Blazer', 'Kleider', 'Strickmode', 'Hosen', 'Blusen', 'Mäntel', 'Shirts & Tops', 'Röcke'],
  'Herren': ['Sakkos', 'Hemden', 'Strickwaren', 'Hosen', 'Jacken', 'Mäntel', 'T-Shirts', 'Anzüge']
};

const FILTER_OPTIONS = {
  occasion: ['Alle', 'Business', 'Casual', 'Party', 'Hochzeit', 'Sport'],
  season: ['Alle', 'Frühling', 'Sommer', 'Herbst', 'Winter'],
  fit: ['Alle', 'Slim Fit', 'Regular Fit', 'Oversized', 'Petite', 'Tall'],
  budget: ['Alle', '€', '€€', '€€€']
};

const Stage3AOutfits: React.FC<Stage3AProps> = ({ filters, setFilters, result }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleGenderChange = (val: string) => {
    setFilters(prev => ({ ...prev, gender: val }));
    setSelectedCategory(null);
  };

  const updateFilter = (key: keyof FilterSettings, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getZalandoLink = (category: string, colorName: string) => {
    const baseUrl = filters.gender === 'Herren' 
      ? 'https://www.zalando.ch/herren/' 
      : 'https://www.zalando.ch/damen/';
    
    // Intelligente Such-Logik: Kategorie + Farbe + Anlass + Passform
    const searchParts = [category, colorName];
    
    if (filters.occasion && filters.occasion !== 'Alle') searchParts.push(filters.occasion);
    if (filters.fit && filters.fit !== 'Alle') searchParts.push(filters.fit);
    // Saison wird optional hinzugefügt für präzisere Ergebnisse
    if (filters.season && filters.season !== 'Alle') searchParts.push(filters.season);

    const query = encodeURIComponent(searchParts.join(' '));
    return `${baseUrl}?q=${query}`;
  };

  const currentCategories = CATEGORIES[filters.gender] || CATEGORIES['Damen'];

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 border border-black/[0.03] shadow-lg shadow-black/[0.01] space-y-12">
      {/* Header & Gender Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/[0.03] pb-8">
        <div className="space-y-1">
          <h3 className="text-2xl font-black chroma-logo tracking-tighter uppercase">Editorial Shopping</h3>
          <p className="text-black/30 text-xs font-bold uppercase tracking-widest">Wähle eine Kategorie für deinen Typ</p>
        </div>
        
        <div className="flex p-1 bg-black/[0.03] rounded-2xl border border-black/[0.02] self-start md:self-center">
          {['Damen', 'Herren'].map((g) => (
            <button
              key={g}
              onClick={() => handleGenderChange(g)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filters.gender === g 
                  ? "bg-black text-white shadow-lg" 
                  : "text-black/30 hover:text-black"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-6">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 ml-1">Kategorie wählen</span>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {currentCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? "bg-black border-black text-white shadow-xl scale-105" 
                    : "bg-white border-black/[0.08] text-black/60 hover:border-black/20 hover:bg-black/[0.01]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 ml-1">
            <Filter size={10} className="text-black/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Suche verfeinern</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FilterDropdown 
              label="Anlass" 
              value={filters.occasion} 
              options={FILTER_OPTIONS.occasion} 
              onChange={(val) => updateFilter('occasion', val)} 
            />
            <FilterDropdown 
              label="Saison" 
              value={filters.season} 
              options={FILTER_OPTIONS.season} 
              onChange={(val) => updateFilter('season', val)} 
            />
            <FilterDropdown 
              label="Passform" 
              value={filters.fit} 
              options={FILTER_OPTIONS.fit} 
              onChange={(val) => updateFilter('fit', val)} 
            />
            <FilterDropdown 
              label="Budget" 
              value={filters.budget} 
              options={FILTER_OPTIONS.budget} 
              onChange={(val) => updateFilter('budget', val)} 
            />
          </div>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      {selectedCategory ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
             <div className="h-px bg-black/5 flex-grow" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 px-4">Deine persönlichen Vorschläge</span>
             <div className="h-px bg-black/5 flex-grow" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.color_palette.map((color, idx) => (
              <div 
                key={idx}
                className="group relative bg-black/[0.01] border border-black/[0.03] rounded-3xl p-6 transition-all duration-300 hover:border-black/[0.1] hover:bg-white hover:shadow-xl hover:shadow-black/[0.02]"
              >
                <div className="flex items-center gap-5">
                  <div 
                    className="w-14 h-14 rounded-2xl shadow-inner border border-black/[0.05] shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="text-black font-black text-xs uppercase tracking-tight truncate">
                      {selectedCategory}
                    </h4>
                    <p className="text-[9px] text-black/40 uppercase tracking-widest font-bold truncate">
                      in {color.name}
                    </p>
                  </div>
                </div>

                <a 
                  href={getZalandoLink(selectedCategory, color.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-indigo-600 active:scale-95 shadow-md group-hover:shadow-lg"
                >
                  Auf Zalando suchen
                  <ArrowUpRight size={12} strokeWidth={3} />
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-20 border-2 border-dashed border-black/[0.03] rounded-[32px] flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-16 h-16 bg-black/[0.02] rounded-full flex items-center justify-center text-black/10">
             <Sparkles size={32} />
           </div>
           <p className="text-black/30 font-black uppercase tracking-[0.2em] text-[10px]">Wähle eine Kategorie, um dein Shopping zu starten</p>
        </div>
      )}
    </div>
  );
};

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[9px] font-black uppercase tracking-widest text-black/30 ml-3">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-white border rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-widest outline-none transition-all cursor-pointer pr-10 ${
            value !== 'Alle' 
              ? "border-black text-black" 
              : "border-black/[0.08] text-black/50 hover:border-black/20"
          }`}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/20 group-hover:text-black/40 transition-colors">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};

export default Stage3AOutfits;
