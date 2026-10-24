import React, { useState } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Sparkles,
  Check,
  Disc3,
  Sliders,
  Flame
} from 'lucide-react';
import { musicEngine, MUSIC_TRACKS, MusicTrackId } from '../utils/bgmSynthesizer';
import { soundManager } from '../utils/audioEffects';

interface MusicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrackId: MusicTrackId;
  onSelectTrack: (trackId: MusicTrackId) => void;
  isMusicPlaying: boolean;
  onToggleMusicPlay: () => void;
}

export const MusicSelectorModal: React.FC<MusicSelectorModalProps> = ({
  isOpen,
  onClose,
  activeTrackId,
  onSelectTrack,
  isMusicPlaying,
  onToggleMusicPlay,
}) => {
  const [volume, setVolume] = useState<number>(() => Math.round(musicEngine.getVolume() * 100));

  if (!isOpen) return null;

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    musicEngine.setVolume(newVol / 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/70 rounded-3xl p-6 sm:p-7 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white font-black shadow-lg">
            <Disc3 className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Canciones y Sonidos para Reels
            </h2>
            <p className="text-xs text-zinc-400">
              Música viral de fondo estilo TikTok e Instagram Reels
            </p>
          </div>
        </div>

        {/* Master Play/Pause & Volume Banner */}
        <div className="p-4 rounded-2xl bg-zinc-850 border border-zinc-750 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  soundManager.playPop();
                  onToggleMusicPlay();
                }}
                className={`p-3 rounded-2xl font-bold flex items-center gap-2 text-xs transition-all ${
                  isMusicPlaying
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                {isMusicPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isMusicPlaying ? 'Música Activa' : 'Música en Pausa'}</span>
              </button>

              <span className="text-xs text-zinc-400">
                {isMusicPlaying ? 'Sonando en segundo plano' : 'Toca reproducir'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Auto-Ducking Activado
            </div>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 pt-1">
            <VolumeX className="w-4 h-4 text-zinc-500" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-zinc-700 rounded-lg"
            />
            <Volume2 className="w-4 h-4 text-zinc-300" />
            <span className="text-xs font-mono font-bold text-zinc-300 w-8 text-right">
              {volume}%
            </span>
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          <p className="text-xs font-semibold text-zinc-400 mb-1">Elige tu pista musical favorita:</p>

          {MUSIC_TRACKS.map((track) => {
            const isSelected = track.id === activeTrackId;
            return (
              <div
                key={track.id}
                onClick={() => {
                  soundManager.playPop();
                  onSelectTrack(track.id);
                  if (!isMusicPlaying) {
                    onToggleMusicPlay();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/40'
                    : 'bg-zinc-850/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${track.color} flex items-center justify-center text-xl shadow-md`}
                  >
                    {track.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-zinc-100">{track.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {track.bpm} BPM
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{track.artist}</p>
                    <span className="text-[11px] text-amber-400/90 font-medium">
                      {track.tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && isMusicPlaying ? (
                    <div className="flex items-center gap-1 text-amber-400">
                      <span className="w-1 h-3.5 bg-amber-400 animate-pulse rounded-full" />
                      <span className="w-1 h-5 bg-amber-400 animate-pulse delay-75 rounded-full" />
                      <span className="w-1 h-2.5 bg-amber-400 animate-pulse delay-150 rounded-full" />
                    </div>
                  ) : null}

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500">
            💡 Cuando la voz del narrador lee las lecciones, el volumen de la música disminuye suavemente para que la enseñanza se escuche nítida.
          </p>
        </div>
      </div>
    </div>
  );
};
