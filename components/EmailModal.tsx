
import React, { useState } from 'react';
import { X, Mail, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { AnalysisResult, FilterSettings } from '../types';

interface EmailModalProps {
  onClose: () => void;
  analysisResult: AnalysisResult | null;
  filters: FilterSettings;
}

const EmailModal: React.FC<EmailModalProps> = ({ onClose, analysisResult, filters }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://hook.eu1.make.com/uxp6o031fhb2swo3knmr3995m7b2x027', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'style_guide_pdf',
          first_name: firstName,
          gender: filters.gender,
          email: email,
          analysis_text: analysisResult?.description_premium || analysisResult?.user_analysis,
          filters: filters,
          analysis_id: analysisResult?.analysis_id
        }),
      });

      if (!response.ok) throw new Error('Network error');
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Es gab einen Fehler. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-10 md:p-16">
          {!isSuccess ? (
            <div className="space-y-10">
              <div className="space-y-3">
                <span className="text-[10px] font-black tracking-[0.6em] uppercase text-black/20">Finaler Schritt</span>
                <h3 className="text-3xl md:text-4xl font-black chroma-logo tracking-tighter uppercase text-[#1A1A1A]">Wohin dürfen wir <br/>den Guide senden?</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-2">Vorname</label>
                    <input 
                      required
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Dein Vorname"
                      className="w-full bg-black/[0.03] border border-black/[0.05] rounded-2xl px-6 py-5 text-sm font-bold placeholder:text-black/20 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-2">E-Mail Adresse</label>
                    <input 
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@beispiel.de"
                      className="w-full bg-black/[0.03] border border-black/[0.05] rounded-2xl px-6 py-5 text-sm font-bold placeholder:text-black/20 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full gradient-cta text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                  <span>Guide jetzt erhalten</span>
                </button>
              </form>

              <p className="text-center text-black/20 text-[9px] font-black uppercase tracking-widest leading-relaxed">
                Mit dem Klick abonnierst du unseren Newsletter. <br/>Abmeldung jederzeit möglich.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black chroma-logo tracking-tighter uppercase text-[#1A1A1A]">Post ist da!</h3>
                <p className="text-black/50 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                  Wir haben dir deinen persönlichen Style-Guide soeben an <span className="text-black">{email}</span> gesendet.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
              >
                Fertig
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
