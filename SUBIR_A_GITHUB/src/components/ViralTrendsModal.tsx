import React, { useState, useEffect } from 'react';
import {
  Flame,
  Globe,
  Sparkles,
  X,
  ArrowRight,
  TrendingUp,
  Loader2,
  Zap,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { ViralWebTrend } from '../types';
import { soundManager } from '../utils/audioEffects';

interface ViralTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBookTitle: string;
  onApplyTrendToGenerator: (trend: ViralWebTrend) => void;
}

export const ViralTrendsModal: React.FC<ViralTrendsModalProps> = ({
  isOpen,
  onClose,
  currentBookTitle,
  onApplyTrendToGenerator,
}) => {
  const [trends, setTrends] = useState<ViralWebTrend[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTopic, setSearchTopic] = useState<string>(currentBookTitle || 'El hombre más rico de Babilonia');

  const fetchTrends = async (topic: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/search-viral-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookTitle: topic }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setTrends(json.data.trends || []);
        setSummary(json.data.summary || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTrends(searchTopic);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/70 rounded-3xl p-6 sm:p-7 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-zinc-950 font-black shadow-lg shadow-rose-500/20">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Radar de Tendencias Web <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">EN VIVO</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Formatos virales de TikTok y Reels adaptables a tu PDF o libro
            </p>
          </div>
        </div>

        {/* Search Bar for Topic */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            placeholder="Buscar tendencias para otro libro o tema..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => fetchTrends(searchTopic)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
            Explorar Web
          </button>
        </div>

        {/* Trends List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="p-10 text-center space-y-3 text-zinc-400">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-amber-400" />
              <p className="text-sm font-semibold text-zinc-200">
                Buscando en la web tendencias de Reels y #BookTok...
              </p>
              <p className="text-xs text-zinc-500">
                Analizando ganchos virales con Google Search Grounding
              </p>
            </div>
          ) : (
            <>
              {summary && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                  <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Panorama Viral en Internet:
                  </span>
                  {summary}
                </div>
              )}

              <p className="text-xs font-semibold text-zinc-400 pt-1">
                Formatos virales encontrados para adaptar a tu libro:
              </p>

              {trends.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-850/60 hover:border-amber-500/50 hover:bg-zinc-800/80 transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                      {t.formatCategory}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Alta Retención
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-zinc-100 group-hover:text-amber-300 transition-colors">
                      {t.trendName}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 italic">
                      "{t.hookTemplate}"
                    </p>
                  </div>

                  <div className="text-[11px] text-zinc-400 bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <p>
                      <strong className="text-zinc-300">Por qué funciona:</strong> {t.whyViral}
                    </p>
                    <p>
                      <strong className="text-zinc-300">Ritmo sugerido:</strong> {t.suggestedPacing}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playPop();
                      onApplyTrendToGenerator(t);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                  >
                    <Zap className="w-3.5 h-3.5" /> Adaptar este Formato a mi PDF / Libro
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
