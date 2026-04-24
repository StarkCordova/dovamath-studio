import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/genai";
import { Download, Zap, Settings, BarChart3, GraduationCap, Loader2, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import html2pdf from 'html2pdf.js';
import 'katex/dist/katex.min.css';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export default function App() {
  const [loading, setLoading] = useState(false);
  const [ensayo, setEnsayo] = useState("");
  const [nivel, setNivel] = useState("2° Medio");
  const reportTemplateRef = useRef<HTMLDivElement>(null);

  const generarEvaluacion = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Actúa como experto en pedagogía matemática chilena. Genera un facsímil SIMCE para ${nivel}. 
      REQUISITOS:
      1. Usa LaTeX para todas las fórmulas.
      2. Genera 4 preguntas de selección múltiple con alternativas A, B, C, D.
      3. Al final, añade una sección titulada "HOJA DE RESPUESTAS" con las claves correctas.
      4. Contexto: Problemas reales del Maule o tecnología.`;

      const result = await model.generateContent(prompt);
      setEnsayo(result.response.text());
    } catch (error) {
      setEnsayo("❌ Error: Verifica la VITE_GEMINI_API_KEY en Vercel.");
    }
    setLoading(false);
  };

  const descargarPDF = () => {
    const element = reportTemplateRef.current;
    if (!element || !ensayo) return;

    const opt = {
      margin: 10,
      filename: `Ensayo_DovaMath_${nivel.replace(' ', '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <nav className="bg-[#1e40af] text-white p-4 shadow-xl flex justify-between items-center px-8">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="bg-white text-blue-700 px-2 rounded">DM</div> DOVA MATH STUDIO
        </div>
        <div className="text-[10px] font-mono opacity-80 uppercase font-bold">V 3.0 | Proceso Maule</div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* PANEL LATERAL */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-slate-700 mb-6 uppercase text-xs tracking-widest text-blue-600">
              <Settings size={16} /> Configuración Pedagógica
            </h2>
            <select 
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold mb-4 outline-none focus:border-blue-600"
            >
              <option>1° Medio</option><option>2° Medio</option><option>3° Medio</option><option>4° Medio</option>
            </select>
            <button 
              onClick={generarEvaluacion}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Zap size={20} fill="white" /> GENERAR ENSAYO</>}
            </button>
          </div>
        </aside>

        {/* VISTA PREVIA Y PDF */}
        <main className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                <BarChart3 size={16} /> Documento Renderizado
              </span>
              {ensayo && (
                <button 
                  onClick={descargarPDF}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
                >
                  <Download size={14} /> DESCARGAR PDF
                </button>
              )}
            </div>

            <div className="p-12 bg-white" ref={reportTemplateRef}>
              {ensayo ? (
                <div className="prose prose-slate max-w-none">
                  <div className="border-b-4 border-black pb-4 mb-8 flex justify-between items-end">
                    <div>
                      <h1 className="text-4xl font-black italic">DM</h1>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DovaMath Studio | Matemática</p>
                    </div>
                    <div className="text-right text-[10px] font-bold">
                      EVALUACIÓN: {nivel}<br/>LINARES, MAULE
                    </div>
                  </div>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {ensayo}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 text-slate-200">
                  <FileText size={80} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="italic font-bold uppercase tracking-widest text-slate-300">Esperando instrucciones del Ing. Eliseo...</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
