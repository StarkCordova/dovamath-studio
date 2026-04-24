import React, { useState } from 'react';
import Head from 'next/head';
import { Download, Zap, Settings, BookOpen, BarChart3, GraduationCap } from 'lucide-react';

export default function DovaMathApp() {
  const [loading, setLoading] = useState(false);
  const [ensayo, setEnsayo] = useState(null);

  const generateItems = async () => {
    setLoading(true);
    // Aquí se conecta con la API de Gemini usando la variable de entorno
    setTimeout(() => { 
      setEnsayo(true); 
      setLoading(false); 
    }, 2000);
  };

  const handlePrint = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('print-area');
    const opt = {
      margin: 10,
      filename: 'DovaMath_Ensayo_Oficial.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>DOVA MATH Studio | Ing. Eliseo Córdova</title>
      </Head>

      <nav className="bg-[#2563eb] text-white p-4 shadow-md flex justify-between items-center px-8 border-b-4 border-blue-800">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="bg-white text-blue-600 px-2 py-0.5 rounded">DM</div> DOVA MATH STUDIO
        </div>
        <div className="flex items-center gap-4 text-xs font-bold opacity-90">
          <span>{new Date().toLocaleDateString()}</span>
          <span className="bg-blue-500 px-2 py-1 rounded">V 2.5 PRO</span>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* PANEL DE CONTROL */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-slate-700 mb-6 uppercase text-xs tracking-[0.2em]">
              <Settings size={16} className="text-blue-600" /> Configuración Docente
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nivel Académico</label>
                <select className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-blue-500 outline-none">
                  <option>7° Básico</option><option>8° Básico</option><option>1° Medio</option><option>2° Medio</option><option>3° Medio</option><option>4° Medio</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Eje Temático</label>
                <select className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-blue-500 outline-none">
                  <option>Números</option><option>Álgebra y Funciones</option><option>Geometría</option><option>Probabilidad y Estadística</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-700 font-bold text-sm">SIMCE</button>
                <button className="p-3 rounded-xl border-2 border-slate-100 text-slate-400 font-bold text-sm">PAES</button>
              </div>

              <button 
                onClick={generateItems}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {loading ? "PROCESANDO..." : <><Zap size={20} fill="white" /> GENERAR ÍTEMS</>}
              </button>
            </div>
          </div>
        </aside>

        {/* VISTA PREVIA */}
        <main className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                <BarChart3 size={16} /> Renderizado de Evaluación
              </span>
              {ensayo && (
                <button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-100">
                  <Download size={14} /> DESCARGAR PDF
                </button>
              )}
            </div>

            <div id="print-area" className="p-12 min-h-[700px] bg-white">
              <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-5xl font-black italic tracking-tighter text-slate-900">DM</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">DovaMath Studio | Educación Técnica</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-800">FACSIMIL OFICIAL 2026</p>
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Proceso de Evaluación Maule</p>
                </div>
              </div>

              {!ensayo ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-200">
                  <GraduationCap size={80} strokeWidth={1} className="mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest italic text-slate-300">Esperando parámetros del Ing. Eliseo...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Aquí el contenido de las preguntas se vería profesional */}
                  <div className="p-4 border-l-4 border-blue-600 bg-slate-50 font-bold text-blue-800">
                    Ensayo generado exitosamente. Listo para exportar.
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
