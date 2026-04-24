import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/genai";
import { Download, Zap, Settings, BarChart3, GraduationCap, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Configuración del motor de IA
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export default function App() {
  const [loading, setLoading] = useState(false);
  const [ensayo, setEnsayo] = useState("");
  const [nivel, setNivel] = useState("2° Medio");

  const generarEvaluacion = async () => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setEnsayo("⚠️ Error: No se detecta la API Key. Configura VITE_GEMINI_API_KEY en Vercel.");
      return;
    }

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Actúa como un experto en pedagogía matemática chilena. 
      Genera un facsímil de evaluación para ${nivel} en formato SIMCE. 
      Usa LaTeX para todas las expresiones matemáticas. 
      Incluye 3 preguntas de selección múltiple con 4 alternativas cada una y la pauta de corrección al final. 
      Tema: Aplicaciones cotidianas de la matemática en la Región del Maule.`;

      const result = await model.generateContent(prompt);
      setEnsayo(result.response.text());
    } catch (error) {
      console.error(error);
      setEnsayo("❌ Error al conectar con Gemini. Revisa los logs de la consola.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Barra de Navegación Profesional */}
      <nav className="bg-[#2563eb] text-white p-4 shadow-xl flex justify-between items-center px-8 border-b-4 border-blue-800">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="bg-white text-blue-600 px-2 rounded shadow-sm">DM</div> 
          <span>DOVA MATH STUDIO</span>
        </div>
        <div className="hidden md:block text-[10px] font-mono opacity-70 font-bold uppercase tracking-[0.2em]">
          Ingeniería Pedagógica | Maule, Chile
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* Panel Lateral de Configuración */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-slate-700 mb-6 uppercase text-xs tracking-widest">
              <Settings size={16} className="text-blue-600" /> Parámetros del Facsímil
            </h2>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase">Nivel Académico</label>
              <select 
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-blue-500 outline-none transition-all"
              >
                <option>1° Medio</option>
                <option>2° Medio</option>
                <option>3° Medio</option>
                <option>4° Medio</option>
              </select>

              <button 
                onClick={generarEvaluacion}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Zap size={20} fill="white" /> GENERAR EVALUACIÓN</>}
              </button>
            </div>
          </div>
        </aside>

        {/* Área de Visualización del Ensayo */}
        <main className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-h-[700px]">
            <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                <BarChart3 size={16} /> Vista Previa del Documento
              </span>
            </div>

            <div className="p-12">
              {ensayo ? (
                <div className="prose prose-slate max-w-none prose-headings:text-blue-900 prose-strong:text-slate-800">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {ensayo}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-slate-300 text-center">
                  <GraduationCap size={80} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="italic font-medium text-slate-400 uppercase tracking-widest text-[10px]">
                    Seleccione el nivel y presione generar para comenzar
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
