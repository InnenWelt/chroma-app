
import React, { useState, useRef } from 'react';
import { Upload, X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface Stage1UploadProps {
  onAnalyze: (file: File) => void;
  isBusy: boolean;
}

const Stage1Upload: React.FC<Stage1UploadProps> = ({ onAnalyze, isBusy }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div 
        onClick={() => !preview && inputRef.current?.click()}
        className={`relative aspect-[16/10] rounded-[40px] border border-black/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 shadow-sm ${
          preview ? 'border-transparent bg-white shadow-xl' : 'bg-white hover:border-black/20 hover:shadow-lg'
        }`}
      >
        <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        
        {preview ? (
          <div className="absolute inset-0 w-full h-full p-4">
            <img src={preview} className="w-full h-full object-cover rounded-[32px] shadow-inner" alt="Preview" />
            <button 
              onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
              className="absolute top-8 right-8 p-3 bg-white/95 backdrop-blur rounded-full shadow-2xl hover:bg-white text-black transition-all hover:scale-110 active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="text-center p-12 space-y-6">
            <div className="w-24 h-24 bg-black/[0.02] text-black/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-black/[0.03]">
              <Upload size={32} />
            </div>
            <div className="space-y-2">
               <h3 className="text-xl font-black uppercase tracking-tighter chroma-logo">Select Portrait</h3>
               <p className="text-black/30 text-sm tracking-wide font-medium">JPG, PNG / Max 10MB</p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <div className="flex justify-center">
           <button
            onClick={() => onAnalyze(file)}
            disabled={isBusy}
            className="group gradient-cta text-white px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all active:scale-[0.98] flex items-center gap-4"
          >
            <Sparkles size={20} className="group-hover:animate-pulse" />
            <span>Analyze Persona</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Stage1Upload;
