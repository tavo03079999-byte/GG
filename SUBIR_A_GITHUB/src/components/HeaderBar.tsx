import React from 'react';
import {
  UploadCloud,
  BookOpen,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Repeat,
  Compass,
  Globe,
  Video,
  Disc3,
  Shuffle
} from 'lucide-react';
import { BookCollection } from '../types';

interface HeaderBarProps {
  collections: BookCollection[];
  currentCollection: BookCollection;
  onSelectCollection: (id: string) => void;
  onOpenUpload: () => void;
  onOpenLibrary: () => void;
  onOpenViralTrends: () => void;
  onOpenMusicSelector: () => void;
  isMusicPlaying: boolean;
  musicTrackName: string;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  quizPoints: number;
  viewMode: 'card' | 'video';
  onToggleViewMode: () => void;
  isInterleaved: boolean;
  onShuffleFeed?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  collections,
  currentCollection,
  onSelectCollection,
  onOpenUpload,
  onOpenLibrary,
  onOpenViralTrends,
  onOpenMusicSelector,
  isMusicPlaying,
  musicTrackName,
  autoScroll,
  onToggleAutoScroll,
  isMuted,
  onToggleMute,
  quizPoints,
  viewMode,
  onToggleViewMode,
  isInterleaved,
  onShuffleFeed,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Active Book Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenLibrary}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center font-black text-zinc-950 shadow-md shadow-amber-500/25 gap-0.5 select-none">
              <span className="text-xs font-black tracking-tight">GG</span>
              <span className="text-base font-serif font-black leading-none drop-shadow-sm">✝</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                GG <span className="text-amber-400 font-serif font-bold text-sm">✝</span>
                <span className="text-amber-400 font-mono text-[10px] bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">REELS</span>
              </span>
              <p className="text-[10px] text-zinc-400 leading-none">Aprende con Downscrolling</p>
            </div>
          </div>

          {/* Book Switcher with Interleaved Option & Shuffle */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <select
                value={currentCollection.id}
                onChange={(e) => onSelectCollection(e.target.value)}
                className="bg-zinc-900 border border-zinc-700/80 hover:border-zinc-600 rounded-full text-xs font-semibold px-3 py-1.5 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[155px] sm:max-w-[215px] truncate cursor-pointer"
              >
                <option value="all" className="bg-zinc-900 text-amber-300 font-bold">
                  🔀 Para Ti (Libros Alternados)
                </option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                    📖 {c.title}
                  </option>
                ))}
              </select>
            </div>

            {isInterleaved && onShuffleFeed && (
              <button
                onClick={onShuffleFeed}
                className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-amber-400 transition-colors"
                title="Mezclar y alternar el orden de los libros"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* XP Badge */}
          <div
            onClick={onOpenLibrary}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-colors"
            title="Puntos de retención ganados en Quizzes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{quizPoints} XP</span>
          </div>

          {/* Music Track Selector Button */}
          <button
            onClick={onOpenMusicSelector}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
              isMusicPlaying
                ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-amber-500/50 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Elegir canciones y sonido de fondo para los Reels"
          >
            <Disc3 className={`w-3.5 h-3.5 text-amber-400 ${isMusicPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            <span className="hidden sm:inline truncate max-w-[90px]">{musicTrackName || 'Canción'}</span>
          </button>

          {/* Radar Web Button */}
          <button
            onClick={onOpenViralTrends}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all active:scale-95"
            title="Radar de Tendencias Virales en la Web"
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">Radar Web</span>
          </button>

          {/* Video Mode vs Card Mode Switch */}
          <button
            onClick={onToggleViewMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
              viewMode === 'video'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/25'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
            title="Cambiar entre Vista Tarjeta y Modo Video Reel 60FPS"
          >
            <Video className="w-3.5 h-3.5" />
            <span>{viewMode === 'video' ? 'Modo Video' : 'Modo Reel'}</span>
          </button>

          {/* Auto-Scroll Toggle */}
          <button
            onClick={onToggleAutoScroll}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              autoScroll
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Modo Manos Libres: pasa automáticamente al siguiente Reel al terminar el audio"
          >
            <Repeat className={`w-3.5 h-3.5 ${autoScroll ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Auto-Scroll</span>
            <span className={`w-2 h-2 rounded-full ${autoScroll ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          </button>

          {/* Library Button */}
          <button
            onClick={onOpenLibrary}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Ver libros y guardados"
          >
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Biblioteca</span>
          </button>

          {/* Create Reels from PDF button */}
          <button
            onClick={onOpenUpload}
            className="px-3.5 py-1.5 rounded-full font-bold text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden xs:inline">Subir PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
