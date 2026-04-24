import React, { useState } from 'react';
import Head from 'next/head';
import { Download, Zap, Settings, BookOpen, BarChart3, GraduationCap, Loader2 } from 'lucide-react';

export default function DovaMathApp() {
  const [loading, setLoading] = useState(false);
  const [ensayo, setEnsayo] = useState("");
  const [nivel, setNivel] = useState("2° Medio");

  const generateItems = async () => {
    setLoading(true);
    const prompt = `Genera un ensayo corto de matemática para ${nivel} formato SIMCE. 
    Incluye 3 preguntas con 4 alternativas y la clave correcta al final. 
    Usa lenguaje técnico pedagógico chileno.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const textoGenerado = data.candidates[0].content.parts[0].text;
      setEnsayo(textoGenerado);
    } catch (error) {
      setEnsayo("Error de conexión: Verifica tu API Key en Vercel.");
    }
    setLoading(false);
  };

  const handlePrint = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('print-area');
    html2pdf().from(element).save('Ensayo_DovaMath.pdf');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>DOVA MATH Studio | Ing. Eliseo Córdova</title>
      </Head>

      <nav className="bg-[#2563eb] text-white p-4 shadow-md flex justify-between items-center px-8">
        <div className="flex items-center gap-2 font-black text-xl">
          <div className="bg-white text-blue-600 px-2 py-0.5 rounded">DM</div> DOVA MATH STUDIO
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-slate-700 mb-6 uppercase text-xs">
              <Settings size={16} className="text-blue-600" /> Configuración
            </h2>
            <select 
              onChange={(e) => setNivel(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold mb-4">
              <option>1° Medio</option><option>2° Medio</option><option>3° Medio</option>
            </select>
            <button 
              onClick={generateItems}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Zap size={20} fill="white" /> GENERAR ENSAYO</>}
            </button>
          </div>
        </aside>

        <main className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
              <span className="font-bold text-xs text-slate-500 uppercase"><BarChart3 size={16} className="inline mr-2"/> Vista Previa</span>
              {ensayo && <button onClick={handlePrint} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold">DESCARGAR PDF</button>}
            </div>
            <div id="print-area" className="p-12 min-h-[500px] whitespace-pre-wrap font-serif leading-relaxed">
              {ensayo ? ensayo : (
                <div className="text-center py-20 text-slate-300">
                  <GraduationCap size={60} className="mx-auto mb-4" />
                  <p className="italic">Presione Generar para crear el contenido...</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
