import React, { useState, useEffect } from 'react';
import { Download, Zap, BookOpen, Settings, BarChart3, ChevronRight } from 'lucide-react';
import Head from 'next/head';

export default function DovaMathStudio() {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ nivel: '2° Medio', formato: 'SIMCE', cantidad: 10 });

  const exportPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('ensayo-render');
    const opt = {
      margin: 10, filename: 'DovaMath_Ensayo_Oficial.pdf',
      html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Head><title>DOVA MATH STUDIO | Ing. Eliseo Córdova</title></Head>
      
      {/* Navbar Profesional */}
      <nav className="bg-blue-600 text-white p-4 shadow-lg flex justify-between items-center px-8">
        <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-tighter">
          <div className="bg-white text-blue-600 p-1 rounded">DM</div> DOVA MATH STUDIO
        </div>
        <div className="text-xs opacity-80 font-mono">V 2.0 | HYPER-SPEED ENABLED</div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* Panel Lateral: Parámetros de Ingeniería */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-slate-700 mb-6 uppercase text-sm tracking-widest">
              <Settings size={18} className="text-blue-600" /> Parámetros de Ingeniería
            </h2>
            
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase">Nivel Académico</label>
              <select className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 outline-none transition-all">
                <option>7° Básico</option><option>8° Básico</option><option>1° Medio</option><option>2° Medio</option>
              </select>

              <label className="block text-xs font-bold text-slate-500 uppercase mt-4">Formato de Evaluación</label>
              <div className="grid grid-cols-1 gap-2">
                {['SIMCE', 'PAES M1', 'PAES M2'].map(f => (
                  <button key={f} className={`p-3 rounded-xl border-2 text-left font-medium transition-all ${f === 'SIMCE' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'}`}>
                    {f}
                  </button>
                ))}
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-blue-200 shadow-lg flex items-center justify-center gap-2 mt-6 transition-all active:scale-95">
                <Zap size={20} fill="currentColor" /> GENERAR ÍTEMS
              </button>
            </div>
          </div>
        </aside>

        {/* Vista Previa del Facsímil */}
        <main className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm uppercase">
                <BarChart3 size={18} /> Facsímil de Alta Fidelidad
              </div>
              <button onClick={exportPDF} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2">
                <Download size={14} /> DESCARGAR PDF
              </button>
            </div>

            <div id="ensayo-render" className="p-12 min-h-[800px] bg-white">
              <div className="border-b-4 border-slate-800 pb-4 mb-8 flex justify-between items-end">
                <div>
                   <h1 className="text-4xl font-black italic text-slate-800">DM</h1>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">DovaMath Studio | Matemática</p>
                </div>
                <div className="text-right text-[10px] font-mono text-slate-400">
                  REF: {new Date().getFullYear()}-SIMCE-EDU<br/>ID: 99283-XC
                </div>
              </div>

              {/* Aquí es donde la IA inyectará las preguntas */}
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <BookOpen size={60} strokeWidth={1} className="mb-4" />
                <p className="font-medium italic">Configure los parámetros para iniciar la generación...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
