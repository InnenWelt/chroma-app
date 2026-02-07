
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles } from 'lucide-react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative group border-2 border-dashed rounded-3xl p-8 transition-all duration-300 ${
          dragActive 
            ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]" 
            : "border-slate-200 hover:border-indigo-300 bg-white"
        } ${preview ? "border-solid" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        {!preview ? (
          <div 
            className="flex flex-col items-center justify-center py-12 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Bild hochladen oder ziehen</h3>
            <p className="text-slate-500 text-center max-w-xs">
              Nutze ein Porträtfoto bei Tageslicht für die beste KI-Analyse deines Farbtyps.
            </p>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-80 object-cover rounded-2xl shadow-inner bg-slate-100" 
            />
            <button 
              onClick={clearFile}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 p-2 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/10" />
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-top-4">
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="group relative flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={24} className="group-hover:animate-pulse" />
            <span>Jetzt analysieren</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
