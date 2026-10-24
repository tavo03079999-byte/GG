import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, X, Check, Book, Zap, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { BookCollection, ReelShort } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCollection: (collection: BookCollection) => void;
  initialViralTrend?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddCollection,
  initialViralTrend = '',
}) => {
  const [tab, setTab] = useState<'file' | 'book' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rawText, setRawText] = useState('');
  const [count, setCount] = useState<number>(5);
  const [tone, setTone] = useState<string>('Dinámico & Productivo');
  const [viralTrend, setViralTrend] = useState<string>(initialViralTrend);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialViralTrend) {
      setViralTrend(initialViralTrend);
    }
  }, [initialViralTrend]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!bookTitle) {
        // Auto-fill book title from file name without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setBookTitle(cleanName);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!bookTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setBookTitle(cleanName);
      }
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        // Strip data:mime/type;base64,
        const base64 = res.split(',')[1] || res;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      setCurrentStepText('Analizando el material con Gemini 3.8 Flash...');

      let fileData: string | undefined = undefined;
      let textContent: string | undefined = rawText.trim() || undefined;

      if (selectedFile) {
        if (selectedFile.type === 'application/pdf') {
          setCurrentStepText('Extrayendo páginas y estructura del PDF...');
          fileData = await readFileAsBase64(selectedFile);
        } else {
          setCurrentStepText('Leyendo contenido del archivo...');
          textContent = await readFileAsText(selectedFile);
        }
      }

      setCurrentStepText('Diseñando ganchos adictivos, analogías y guiones de Reels...');

      const response = await fetch('/api/generate-shorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTitle: bookTitle.trim() || selectedFile?.name || 'Libro Educativo',
          author: author.trim() || 'Sabiduría Práctica',
          topic: `Educación de alto rendimiento, micro-aprendizaje y hábitos. Tono: ${tone}`,
          fileData,
          fileName: selectedFile?.name,
          fileType: selectedFile?.type,
          rawText: textContent,
          count,
          tone,
          viralTrend: viralTrend.trim() || undefined,
          useWebSearch,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Error en el servidor al generar los reels');
      }

      const resData = await response.json();
      if (!resData.success || !resData.data || !resData.data.shorts?.length) {
        throw new Error('No se pudieron estructurar los shorts. Intenta con otro texto o archivo.');
      }

      setCurrentStepText('Generando guiones de video, reto interactivo y finalizando...');

      const generated = resData.data;
      const themeColors: ('gold' | 'emerald' | 'violet' | 'indigo' | 'rose' | 'amber' | 'cyan')[] = [
        'gold', 'emerald', 'violet', 'indigo', 'rose', 'amber', 'cyan'
      ];

      const newShorts: ReelShort[] = generated.shorts.map((s: any, idx: number) => ({
        id: `gen-${Date.now()}-${idx}`,
        title: s.title || `Lección #${idx + 1}`,
        bookTitle: generated.bookTitle || bookTitle || 'Documento Personal',
        author: generated.author || author || 'Autor',
        category: s.category || 'Productividad',
        readTime: s.readTime || '40s',
        hook: s.hook || 'Una lección que cambiará tu perspectiva para siempre...',
        coreInsight: s.coreInsight || 'Concepto clave del texto.',
        steps: s.steps || ['Comprender la raíz', 'Aplicar el principio', 'Medir el progreso'],
        actionableTakeaway: s.actionableTakeaway || 'Aplica este principio hoy mismo.',
        quote: s.quote || 'El conocimiento sin acción es mera ilusión.',
        visualTheme: s.visualTheme && themeColors.includes(s.visualTheme) ? s.visualTheme : themeColors[idx % themeColors.length],
        keyPhrases: s.keyPhrases || ['Lección clave', 'Acción diaria'],
        fullNarration: s.fullNarration || s.coreInsight,
        viralFormat: s.viralFormat || (viralTrend ? viralTrend : 'CapCut POV Viral'),
        trendSource: s.trendSource || 'Inspirado en tendencias de #BookTok',
        scenes: s.scenes && s.scenes.length > 0 ? s.scenes : [
          {
            sceneNumber: 1,
            durationSec: 8,
            headline: s.viralFormat || 'EL GANCHO VIRAL',
            subtext: s.hook || 'Lección clave del libro',
            visualPreset: 'gold-cascade',
            captionWords: (s.hook || '').split(' '),
          },
          {
            sceneNumber: 2,
            durationSec: 12,
            headline: 'LA REVELACIÓN',
            subtext: s.coreInsight || '',
            visualPreset: 'matrix-wealth',
            captionWords: (s.coreInsight || '').split(' '),
          },
          {
            sceneNumber: 3,
            durationSec: 8,
            headline: 'ACCIÓN INMEDIATA',
            subtext: s.actionableTakeaway || '',
            visualPreset: 'cyber-bars',
            captionWords: (s.actionableTakeaway || '').split(' '),
          },
        ],
        likes: Math.floor(Math.random() * 400) + 120,
        quiz: s.quiz || {
          question: `¿Cuál es el beneficio principal de aplicar ${s.title}?`,
          options: ['Mejora exponencial', 'Poco impacto', 'Solo teoría', 'Ninguno'],
          correctAnswerIndex: 0,
          explanation: 'La aplicación consistente genera resultados multiplicadores.'
        }
      }));

      const newCollection: BookCollection = {
        id: `collection-${Date.now()}`,
        title: generated.bookTitle || bookTitle || selectedFile?.name || 'Documento Personal',
        author: generated.author || author || 'Autor',
        category: 'Personalizado',
        summary: generated.summary || 'Serie de reels educativos generados con IA.',
        coverGradient: 'from-amber-600 via-rose-700 to-indigo-900',
        shorts: newShorts,
        trendInspiration: generated.trendInspiration || viralTrend || 'Tendencias de Reels en la Web',
      };

      onAddCollection(newCollection);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Ocurrió un error inesperado al procesar.');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuickBooks = [
    { title: 'El hombre más rico de Babilonia', author: 'George S. Clason' },
    { title: 'Padre Rico Padre Pobre', author: 'Robert Kiyosaki' },
    { title: 'El monje que vendió su Ferrari', author: 'Robin Sharma' },
    { title: 'Meditaciones', author: 'Marco Aurelio' },
    { title: 'De Cero a Uno', author: 'Peter Thiel' },
    { title: 'Sapiens', author: 'Yuval Noah Harari' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/70 rounded-3xl p-6 sm:p-7 shadow-2xl text-white max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 hover:bg-zinc-800 transition-colors disabled:opacity-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-zinc-950 font-black shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Crear Reels de tu PDF o Libro
            </h2>
            <p className="text-xs text-zinc-400">
              Convierte cualquier archivo en Shorts educativos con down-scrolling
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-zinc-800/70 rounded-2xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTab('file')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                tab === 'file'
                  ? 'bg-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" /> Subir PDF / Archivo
            </button>
            <button
              type="button"
              onClick={() => setTab('book')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                tab === 'book'
                  ? 'bg-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Book className="w-4 h-4" /> Buscar Libro
            </button>
            <button
              type="button"
              onClick={() => setTab('text')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                tab === 'text'
                  ? 'bg-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Pegar Texto
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'file' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.epub,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 hover:border-amber-500/80 rounded-2xl p-6 text-center cursor-pointer bg-zinc-850/40 hover:bg-zinc-800/60 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400 group-hover:text-amber-400 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" /> {selectedFile.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Clic para cambiar archivo
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Arrastra tu archivo PDF aquí o haz clic para explorar
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Soporta PDF, TXT, EPUB, DOCX (libros, resúmenes, apuntes)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'book' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Título del libro o temática
                  </label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Ej: El hombre más rico de Babilonia"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Autor (opcional)
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ej: George S. Clason"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-1.5 font-medium">Sugerencias rápidas:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleQuickBooks.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setBookTitle(item.title);
                          setAuthor(item.author);
                        }}
                        className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'text' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Texto o extracto del libro
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Pega aquí los capítulos o fragmentos que quieras convertir en Reels..."
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            )}

            {/* Customization Settings */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Cantidad de Reels
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={3}>3 Reels (Flash)</option>
                  <option value={5}>5 Reels (Recomendado)</option>
                  <option value={8}>8 Reels (Masterclass)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Estilo de Narración
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Dinámico & Productivo">⚡ Dinámico & Viral</option>
                  <option value="Storytelling Épico">📖 Storytelling & Parábolas</option>
                  <option value="Micro-Clase Rápida">🎓 Paso a paso concreto</option>
                  <option value="Mindset & Filosofía">🧠 Mindset & Reflexión</option>
                </select>
              </div>
            </div>

            {/* Web Search & Viral Trend Grounding */}
            <div className="p-3.5 rounded-2xl bg-zinc-850 border border-zinc-750 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Adaptar a Formato Viral de la Web
                </label>
                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                  Google Search
                </span>
              </div>

              <input
                type="text"
                value={viralTrend}
                onChange={(e) => setViralTrend(e.target.value)}
                placeholder="Ej: POV Brutal, Regla de los 3 Segundos, Desafío 10%..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />

              <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={useWebSearch}
                  onChange={(e) => setUseWebSearch(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 accent-amber-500"
                />
                <span>Buscar en la web formatos populares de Reels para enriquecer el guión</span>
              </label>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Progress indicator during generation */}
            {loading && (
              <div className="p-4 rounded-2xl bg-zinc-800/80 border border-amber-500/40 text-center space-y-2 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generando tus Shorts Educativos...</span>
                </div>
                <p className="text-xs text-zinc-300">{currentStepText}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || (tab === 'file' && !selectedFile && !bookTitle) || (tab === 'book' && !bookTitle) || (tab === 'text' && !rawText)}
                className="w-full py-3 px-6 rounded-2xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Creando Shorts...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Crear Feed de Shorts con IA <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
