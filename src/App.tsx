import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/genai";
import { Download, Zap, Settings, BarChart3, GraduationCap, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [ensayo, setEnsayo] = useState("");
  const [nivel, setNivel] = useState("2° Medio");

  const generar = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Genera un ensayo de matemática para ${nivel} formato SIMCE. Usa LaTeX. Incluye 3 preguntas con alternativas.`;
      const result = await model.generateContent(prompt);
      setEnsayo(result.response.text());
    } catch (error) {
      setEnsayo("⚠️ Error de conexión. Revisa la API Key en Vercel.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-[#2563eb] text-white p-4 shadow-lg flex justify-between items-center px-8">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="bg-white text-blue-600 px-2 rounded">DM</div> DOVA MATH STUDIO
        </div>
        <span className="text-xs font-mono opacity-70 italic">PROYECTO INGENIERÍA PEDAGÓGICA</span>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        <aside className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 h-fit">
          <h2 className="flex items-center gap-2 font-bold text-slate-700 mb-6 uppercase text-xs tracking-widest">
            <Settings size={16} className="text-blue-600" /> Configuración
          </h2>
          <select 
            value={nivel} 
            onChange={(e) => setNivel(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold mb-6">
            <option>1° Medio</option><option>2° Medio</option><option>3° Medio</option>
          </select>
          <button 
            onClick={generar}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Zap size={20} fill="white" /> GENERAR EVALUACIÓN</>}
          </button>
        </aside>

        <main className="lg:col-span-8 bg-white rounded-2xl shadow-2xl border border-slate-200 min-h-[600px] p-12 overflow-auto">
          {ensayo ? (
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {ensayo}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 py-20">
              <GraduationCap size={80} className="mb-4 opacity-20" />
              <p className="italic font-medium">Esperando parámetros para generar el facsímil...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
