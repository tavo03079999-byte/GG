import React, { useState } from 'react';
import {
  Heart,
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
  Bookmark,
  Share2,
  Check,
  Quote,
  Flame,
  Bot,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Music,
  Disc3
} from 'lucide-react';
import { ReelShort } from '../types';
import { THEME_CONFIGS } from './ThemeStyles';
import { soundManager } from '../utils/audioEffects';

interface ReelCardProps {
  short: ReelShort;
  index: number;
  total: number;
  isActive: boolean;
  isAudioPlaying: boolean;
  audioProgress: number;
  currentPhraseIndex: number;
  onToggleAudio: () => void;
  onOpenQuiz: () => void;
  onOpenDeepDive: () => void;
  onToggleSave: () => void;
  onNextReel: () => void;
  onPrevReel: () => void;
  isMusicPlaying: boolean;
  musicTrackName: string;
  onToggleMusic: () => void;
  onOpenMusicSelector: () => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  short,
  index,
  total,
  isActive,
  isAudioPlaying,
  audioProgress,
  currentPhraseIndex,
  onToggleAudio,
  onOpenQuiz,
  onOpenDeepDive,
  onToggleSave,
  onNextReel,
  onPrevReel,
  isMusicPlaying,
  musicTrackName,
  onToggleMusic,
  onOpenMusicSelector,
}) => {
  const [likes, setLikes] = useState(short.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFullQuote, setShowFullQuote] = useState(false);

  const theme = THEME_CONFIGS[short.visualTheme] || THEME_CONFIGS.gold;

  const handleLike = () => {
    soundManager.playPop();
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCopy = async () => {
    soundManager.playPop();
    const textToCopy = `💡 "${short.title}" (${short.bookTitle} - ${short.author})\n\n"${short.hook}"\n\n🎯 Acción de hoy: ${short.actionableTakeaway}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      // fallback
    }
  };

  return (
    <div
      className={`relative w-full h-full max-w-[430px] mx-auto rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none transition-all duration-300 border border-white/10 bg-gradient-to-b ${theme.background}`}
      style={{
        boxShadow: isActive ? `0 0 50px ${theme.glowColor}` : 'none',
      }}
    >
      {/* Dynamic ambient background glow circles */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 animate-pulse"
        style={{ backgroundColor: theme.glowColor }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ backgroundColor: theme.glowColor }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 pt-4 px-5 pb-2">
        {/* Progress Bar (Segments for each reel in collection) */}
        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  i < index
                    ? 'w-full bg-white'
                    : i === index
                    ? isAudioPlaying
                      ? theme.progressColor
                      : 'w-full bg-white/70'
                    : 'w-0'
                }`}
                style={{
                  width: i === index && isAudioPlaying ? `${audioProgress * 100}%` : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* Source metadata badge */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide uppercase ${theme.badgeBg}`}
            >
              {short.category}
            </span>
            <span className="text-white/80 font-semibold truncate max-w-[170px]">
              {short.bookTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/70 text-[11px] shrink-0 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {short.readTime}
            </span>
            <span className="bg-black/30 px-2 py-0.5 rounded-full border border-white/10">
              {index + 1}/{total}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Stage (Vertical Scroll inside Reel if needed, but fits view) */}
      <div className="relative z-10 flex-1 px-5 py-2 flex flex-col justify-center overflow-y-auto no-scrollbar">
        {/* Title */}
        <div className="mb-2">
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
            {short.title}
          </h2>
          <p className="text-xs text-white/60 font-medium mt-0.5">
            Por {short.author}
          </p>
        </div>

        {/* The Hook: Big energetic punchline (TikTok/Reels format) */}
        <div className="relative my-2 p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-400 mb-1">
            <Flame className="w-3.5 h-3.5" /> Gancho del reel
          </div>
          <p className="text-sm sm:text-base font-bold text-white leading-snug drop-shadow-sm">
            "{short.hook}"
          </p>
        </div>

        {/* Core Insight / 3 Steps */}
        <div className="space-y-1.5 my-1.5">
          {short.steps.map((step, sIdx) => (
            <div
              key={sIdx}
              className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white/90"
            >
              <div
                className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] text-zinc-950 ${theme.progressColor}`}
              >
                {sIdx + 1}
              </div>
              <p className="leading-tight font-medium">{step}</p>
            </div>
          ))}
        </div>

        {/* Actionable Takeaway (The immediate practical advice) */}
        <div className="my-2 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-100 shadow-md">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Aplica esto hoy:
          </div>
          <p className="text-xs sm:text-sm font-semibold leading-snug">
            {short.actionableTakeaway}
          </p>
        </div>

        {/* Book Quote pill */}
        <div
          onClick={() => setShowFullQuote(!showFullQuote)}
          className="cursor-pointer p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs text-white/80 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 truncate">
            <Quote className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="italic truncate text-[11px]">
              "{short.quote}"
            </span>
          </div>
          <span className="text-[10px] text-white/40 uppercase font-bold shrink-0">
            {showFullQuote ? 'Menos' : 'Cita'}
          </span>
        </div>

        {showFullQuote && (
          <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 text-xs text-amber-200 italic my-1 animate-fade-in">
            "{short.quote}"
            <div className="text-[10px] text-white/50 text-right mt-1 not-italic">
              — {short.author}, {short.bookTitle}
            </div>
          </div>
        )}
      </div>

      {/* Music Sound Ticker (TikTok / Instagram Reels style) */}
      <div className="relative z-10 px-5 pt-1">
        <div
          onClick={onOpenMusicSelector}
          className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between gap-2 cursor-pointer group transition-all"
          title="Toca para cambiar la canción del Reel"
        >
          <div className="flex items-center gap-2 truncate">
            <div
              className={`w-6 h-6 rounded-full bg-zinc-800 border border-amber-500/40 flex items-center justify-center shrink-0 ${
                isMusicPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              <Disc3 className="w-4 h-4 text-amber-400" />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] truncate text-white/90">
              <Music className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="font-bold truncate">
                ♫ {musicTrackName || 'Phonk Motivación Viral'} · Sonido Original
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isMusicPlaying && (
              <div className="flex items-center gap-0.5 text-amber-400 mr-1">
                <span className="w-0.5 h-2.5 bg-amber-400 animate-pulse rounded-full" />
                <span className="w-0.5 h-3.5 bg-amber-400 animate-pulse delay-75 rounded-full" />
                <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
              </div>
            )}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 group-hover:bg-amber-500 group-hover:text-zinc-950 text-white/80 transition-colors">
              CAMBIAR
            </span>
          </div>
        </div>
      </div>

      {/* Subtitle Karaoke Ticker (Real-time highlighted spoken phrase) */}
      <div className="relative z-10 px-5 py-2">
        <div className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs truncate">
            {isAudioPlaying ? (
              <div className="flex items-center gap-0.5 shrink-0 text-amber-400">
                <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                <span className="w-1 h-4 bg-amber-400 animate-pulse delay-75 rounded-full" />
                <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-white/50 shrink-0" />
            )}
            <span className="font-semibold text-white/90 truncate text-[11px]">
              {isAudioPlaying
                ? short.keyPhrases[currentPhraseIndex] || short.keyPhrases[0]
                : 'Toca el altavoz para escuchar la narración con voz'}
            </span>
          </div>

          <button
            onClick={onToggleAudio}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
              isAudioPlaying
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isAudioPlaying ? 'PAUSAR' : 'REPRODUCIR'}
          </button>
        </div>
      </div>

      {/* Right Floating Interaction Sidebar (TikTok / Instagram Reels style) */}
      <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-3.5">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center group transition-transform active:scale-75"
          aria-label="Dar me gusta"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              hasLiked
                ? 'bg-rose-600/90 border-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${hasLiked ? 'fill-current text-white' : ''}`}
            />
          </div>
          <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
            {likes}
          </span>
        </button>

        {/* Music Track Button */}
        <button
          onClick={onToggleMusic}
          className="flex flex-col items-center group transition-transform active:scale-75"
          aria-label="Música de fondo"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isMusicPlaying
                ? 'bg-gradient-to-tr from-amber-500 to-rose-500 border-amber-300 text-white shadow-lg shadow-rose-500/30'
                : 'bg-black/40 border-white/20 text-white/70 hover:bg-black/60'
            }`}
          >
            <Music className={`w-5 h-5 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
            {isMusicPlaying ? 'Beat' : 'Música'}
          </span>
        </button>

        {/* Audio Narration Button */}
        <button
          onClick={onToggleAudio}
          className="flex flex-col items-center group transition-transform active:scale-75"
          aria-label="Audio narración"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isAudioPlaying
                ? 'bg-amber-500 border-amber-400 text-zinc-950 shadow-lg shadow-amber-500/40 animate-pulse'
                : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
            }`}
          >
            {isAudioPlaying ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </div>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
            {isAudioPlaying ? 'Voz' : 'Mute'}
          </span>
        </button>

        {/* Interactive Quiz Button */}
        <button
          onClick={onOpenQuiz}
          className="flex flex-col items-center group transition-transform active:scale-75"
          aria-label="Hacer quiz"
        >
          <div className="relative w-11 h-11 rounded-full flex items-center justify-center bg-indigo-600/80 hover:bg-indigo-600 backdrop-blur-md border border-indigo-400 text-white shadow-lg shadow-indigo-500/30">
            <HelpCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-zinc-900" />
          </div>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
            Quiz
          </span>
        </button>

        {/* Deep Dive AI Button */}
        <button
          onClick={onOpenDeepDive}
          className="flex flex-col items-center group transition-transform active:scale-75"
          aria-label="Preguntar a la IA"
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-indigo-300">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
            IA
          </span>
        </button>

        {/* Bookmark / Save */}
        <button
          onClick={onToggleSave}
          className="flex flex-col items-center group transition-transform active:scale-75"
          aria-label="Guardar lección"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              short.isSaved
                ? 'bg-amber-500 border-amber-400 text-zinc-950'
                : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
            }`}
          >
            <Bookmark
              className={`w-5 h-5 ${short.isSaved ? 'fill-current' : ''}`}
            />
          </div>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
            {short.isSaved ? 'Guardado' : 'Guardar'}
          </span>
        </button>

        {/* Share / Copy Action */}
        <button
          onClick={handleCopy}
          className="flex flex-col items-center group transition-transform active:scale-75"
          aria-label="Compartir lección"
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white">
            {copied ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </div>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
            {copied ? 'Copiado' : 'Copiar'}
          </span>
        </button>
      </div>

      {/* Floating Prev/Next Reel navigation arrows */}
      <div className="absolute left-3.5 bottom-24 z-20 flex flex-col gap-2">
        <button
          onClick={onPrevReel}
          disabled={index === 0}
          className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none transition-all"
          title="Reel anterior (Flecha Arriba)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <button
          onClick={onNextReel}
          disabled={index === total - 1}
          className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none transition-all"
          title="Siguiente Reel (Flecha Abajo)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Down-Scroll Cue Footer */}
      <div
        onClick={onNextReel}
        className="relative z-10 py-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border-t border-white/5 flex items-center justify-center gap-1.5 cursor-pointer text-white/70 hover:text-white transition-colors"
      >
        <span className="text-xs font-semibold">
          {index === total - 1 ? 'Fin de esta colección' : 'Desliza hacia abajo para más'}
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </div>
  );
};
