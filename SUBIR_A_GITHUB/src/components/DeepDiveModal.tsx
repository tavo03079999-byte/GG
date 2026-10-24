import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { ReelShort } from '../types';

interface DeepDiveModalProps {
  short: ReelShort;
  isOpen: boolean;
  onClose: () => void;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  short,
  isOpen,
  onClose,
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    '¿Cómo aplico esto en mi día a día paso a paso?',
    '¿Un ejemplo moderno adaptado al mundo digital?',
    '¿Cuál es el error más grave al intentar aplicar esta lección?',
    'Explícamelo con una analogía simple.',
  ];

  const handleAsk = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch('/api/reel-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shortTitle: short.title,
          bookTitle: short.bookTitle,
          concept: short.coreInsight,
          userQuestion: userPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer('No pudimos procesar la respuesta en este momento. Intenta de nuevo.');
      }
    } catch (err) {
      setAnswer('Error de conexión con el asistente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-1.5">
                Profundizar con IA <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-[260px]">
                {short.bookTitle} · {short.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Reel Context Snippet */}
          <div className="p-3.5 rounded-2xl bg-zinc-800/40 border border-zinc-800 text-xs text-zinc-300">
            <div className="font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" /> Lección del Reel:
            </div>
            <p className="text-zinc-400 italic">"{short.coreInsight}"</p>
          </div>

          {/* Quick Prompts */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 mb-2">Preguntas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Answer Box */}
          {loading && (
            <div className="p-6 rounded-2xl bg-zinc-800/30 border border-zinc-800 flex flex-col items-center justify-center gap-3 text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <p className="text-xs">Consultando a Gemini 3.8 sobre "{short.bookTitle}"...</p>
            </div>
          )}

          {answer && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-800/80 to-zinc-850 border border-zinc-700/60 text-sm text-zinc-200 leading-relaxed whitespace-pre-line shadow-inner">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300 text-xs mb-2">
                <Sparkles className="w-3.5 h-3.5" /> RESPUESTA PERSONALIZADA
              </div>
              {answer}
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="pt-3 border-t border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(question);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Haz tu propia pregunta sobre esta lección..."
              className="flex-1 bg-zinc-800/80 border border-zinc-700 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
