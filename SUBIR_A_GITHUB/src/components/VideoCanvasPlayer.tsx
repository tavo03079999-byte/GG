import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Flame,
  Check,
  Video,
  Disc3
} from 'lucide-react';
import { ReelShort, VideoScene } from '../types';
import { bgmSynthesizer, musicEngine } from '../utils/bgmSynthesizer';
import { speechService } from '../utils/speechService';
import { soundManager } from '../utils/audioEffects';

interface VideoCanvasPlayerProps {
  short: ReelShort;
  onNextReel?: () => void;
  onPrevReel?: () => void;
  onOpenMusicSelector?: () => void;
}

export const VideoCanvasPlayer: React.FC<VideoCanvasPlayerProps> = ({
  short,
  onNextReel,
  onPrevReel,
  onOpenMusicSelector,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [bgmActive, setBgmActive] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Default fallback scenes if not present
  const scenes: VideoScene[] = short.scenes && short.scenes.length > 0 ? short.scenes : [
    {
      sceneNumber: 1,
      durationSec: 8,
      headline: short.viralFormat || 'EL SECRETO DE ORO',
      subtext: short.hook,
      visualPreset: 'gold-cascade',
      captionWords: short.hook.split(' '),
    },
    {
      sceneNumber: 2,
      durationSec: 12,
      headline: short.title.replace(/[^\w\s#]/gi, ''),
      subtext: short.coreInsight,
      visualPreset: 'matrix-wealth',
      captionWords: short.coreInsight.split(' '),
    },
    {
      sceneNumber: 3,
      durationSec: 8,
      headline: 'ACCIÓN INMEDIATA',
      subtext: short.actionableTakeaway,
      visualPreset: 'cyber-bars',
      captionWords: short.actionableTakeaway.split(' '),
    },
  ];

  const currentScene = scenes[currentSceneIdx] || scenes[0];

  // Particle systems
  const particles = useRef<Array<{ x: number; y: number; speed: number; size: number; alpha: number; angle: number }>>([]);

  useEffect(() => {
    // Initialize 60 particles
    particles.current = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * 1080,
      y: Math.random() * 1920,
      speed: 1.5 + Math.random() * 3.5,
      size: 4 + Math.random() * 10,
      alpha: 0.3 + Math.random() * 0.7,
      angle: Math.random() * Math.PI * 2,
    }));
  }, [currentSceneIdx]);

  // Scene timing timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 50;
    const sceneDurationMs = (currentScene.durationSec || 8) * 1000;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalMs;
      const progress = Math.min(elapsed / sceneDurationMs, 1);
      setSceneProgress(progress);

      if (progress >= 1) {
        // Next scene
        if (currentSceneIdx < scenes.length - 1) {
          setCurrentSceneIdx((prev) => prev + 1);
          elapsed = 0;
        } else {
          // Loop back to scene 0 or stop
          setCurrentSceneIdx(0);
          elapsed = 0;
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIdx, scenes.length, currentScene.durationSec]);

  // Background Lo-Fi music toggle
  useEffect(() => {
    if (bgmActive && isPlaying) {
      bgmSynthesizer.start();
    } else {
      bgmSynthesizer.stop();
    }
    return () => {
      bgmSynthesizer.stop();
    };
  }, [bgmActive, isPlaying]);

  // Canvas 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw dynamic background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (currentScene.visualPreset === 'gold-cascade') {
        gradient.addColorStop(0, '#1c1303');
        gradient.addColorStop(0.5, '#2b1a04');
        gradient.addColorStop(1, '#080501');
      } else if (currentScene.visualPreset === 'matrix-wealth') {
        gradient.addColorStop(0, '#021810');
        gradient.addColorStop(0.5, '#042b1c');
        gradient.addColorStop(1, '#010a06');
      } else if (currentScene.visualPreset === 'cyber-bars') {
        gradient.addColorStop(0, '#0a0d24');
        gradient.addColorStop(0.5, '#12183d');
        gradient.addColorStop(1, '#04050e');
      } else {
        gradient.addColorStop(0, '#170b24');
        gradient.addColorStop(0.5, '#241038');
        gradient.addColorStop(1, '#07030c');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated Background Visuals (Particles / Grid)
      ctx.save();
      particles.current.forEach((p) => {
        p.y += p.speed;
        p.angle += 0.02;
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        if (currentScene.visualPreset === 'gold-cascade') {
          // Gold coin / dust particle
          ctx.arc(p.x + Math.sin(p.angle) * 15, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
          ctx.fill();
        } else if (currentScene.visualPreset === 'matrix-wealth') {
          // Digital matrix falling code
          ctx.font = 'bold 20px monospace';
          ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
          ctx.fillText('$', p.x, p.y);
        } else {
          // Glowing stars
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
          ctx.fill();
        }
      });
      ctx.restore();

      // Pulsating central radial glow
      const radial = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        600
      );
      radial.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // 3. Top Watermark & Category Tag
      ctx.save();
      ctx.textAlign = 'center';

      // Badge pill
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 260, 160, 520, 70, 35);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`⚡ GG ✝ · ${short.bookTitle.toUpperCase()}`, width / 2, 205);

      // Scene indicator pill
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `ESCENA ${currentSceneIdx + 1} DE ${scenes.length}: ${currentScene.headline.toUpperCase()}`,
        width / 2,
        320
      );

      // 4. Kinetic Typography (CapCut / Alex Hormozi Style)
      // Displays the current scene's subtext word-by-word with spring zoom!
      const words = currentScene.captionWords || currentScene.subtext.split(' ');
      const totalWords = words.length;
      const currentWordIdx = Math.min(
        Math.floor(sceneProgress * totalWords),
        totalWords - 1
      );

      // Group words into lines for centered readability
      const wordsPerChunk = 4;
      const currentChunkStart = Math.floor(currentWordIdx / wordsPerChunk) * wordsPerChunk;
      const activeChunk = words.slice(currentChunkStart, currentChunkStart + wordsPerChunk);

      ctx.font = '900 68px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lineY = height / 2 - 40;

      // Draw active punchline words
      activeChunk.forEach((word, idx) => {
        const actualIdx = currentChunkStart + idx;
        const isCurrentWord = actualIdx === currentWordIdx;
        const wordOffset = (idx - (activeChunk.length - 1) / 2) * 55;

        ctx.save();
        ctx.translate(width / 2, lineY + wordOffset);

        if (isCurrentWord) {
          ctx.scale(1.15, 1.15);
        }

        // Drop shadow / stroke
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 14;
        ctx.strokeText(word.toUpperCase(), 0, 0);

        // Highlight active word in bright yellow, others in white
        if (isCurrentWord) {
          ctx.fillStyle = '#fde047';
        } else if (actualIdx < currentWordIdx) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        }

        ctx.fillText(word.toUpperCase(), 0, 0);
        ctx.restore();
      });

      // 5. Bottom Takeaway Banner in Video
      ctx.fillStyle = 'rgba(6, 78, 59, 0.7)';
      ctx.beginPath();
      ctx.roundRect(80, height - 420, width - 160, 160, 30);
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText('🎯 ACCIÓN CONCRETA:', 120, height - 365);

      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      const maxLen = 42;
      const truncated =
        short.actionableTakeaway.length > maxLen
          ? short.actionableTakeaway.slice(0, maxLen) + '...'
          : short.actionableTakeaway;
      ctx.fillText(truncated, 120, height - 310);

      // 6. Top Video Progress Bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(40, 80, width - 80, 12);

      const overallProgress = (currentSceneIdx + sceneProgress) / scenes.length;
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(40, 80, (width - 80) * overallProgress, 12);

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentSceneIdx, sceneProgress, currentScene, short, scenes.length]);

  // Download Video (.webm) using Canvas captureStream & MediaRecorder
  const handleDownloadVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      soundManager.playPop();
      setIsRecording(true);
      recordedChunksRef.current = [];

      const stream = canvas.captureStream(30); // 30 FPS
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GG_Reel_${short.bookTitle.replace(/\s+/g, '_')}_${short.title.replace(/\s+/g, '_')}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setDownloadSuccess(true);
        soundManager.playSuccessChime();
        setTimeout(() => setDownloadSuccess(false), 3000);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      // Record for 8 seconds (a full viral short punch)
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 8000);
    } catch (e) {
      console.error('Error recording video:', e);
      setIsRecording(false);
    }
  };

  const handlePlayVoice = () => {
    soundManager.playPop();
    speechService.playNarration(
      currentScene.subtext,
      currentScene.captionWords,
      () => {},
      () => {}
    );
  };

  return (
    <div className="relative w-full h-full max-w-[430px] mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black border border-amber-500/30 flex flex-col items-center justify-center select-none">
      {/* 9:16 Canvas */}
      <canvas
        ref={canvasRef}
        width={1080}
        height={1920}
        className="w-full h-full object-cover rounded-3xl"
      />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 shadow-lg">
          <Video className="w-3.5 h-3.5 text-amber-400" />
          MODO VIDEO REEL
        </span>

        {short.viralFormat && (
          <span className="px-2.5 py-1 rounded-full bg-indigo-900/80 backdrop-blur-md border border-indigo-500/40 text-indigo-200 font-bold text-[11px] truncate max-w-[170px]">
            🔥 {short.viralFormat}
          </span>
        )}
      </div>

      {/* Floating Video Controls Sidebar */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-3">
        {/* Play / Pause Video */}
        <button
          onClick={() => {
            soundManager.playPop();
            setIsPlaying(!isPlaying);
          }}
          className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform active:scale-75 shadow-lg"
          title={isPlaying ? 'Pausar video' : 'Reproducir video'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Lo-Fi Background Music toggle */}
        <button
          onClick={() => {
            soundManager.playPop();
            setBgmActive(!bgmActive);
          }}
          className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-transform active:scale-75 shadow-lg ${
            bgmActive
              ? 'bg-amber-500 border-amber-400 text-zinc-950 font-bold animate-pulse'
              : 'bg-black/60 border-white/20 text-white'
          }`}
          title="Música de fondo Lo-Fi"
        >
          <Music className="w-5 h-5" />
        </button>

        {/* Voice Speech Trigger */}
        <button
          onClick={handlePlayVoice}
          className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-emerald-400 flex items-center justify-center transition-transform active:scale-75 shadow-lg"
          title="Narrar escena con voz"
        >
          <Volume2 className="w-5 h-5" />
        </button>

        {/* Replay Scene */}
        <button
          onClick={() => {
            soundManager.playPop();
            setCurrentSceneIdx(0);
            setSceneProgress(0);
          }}
          className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform active:scale-75 shadow-lg"
          title="Reiniciar video desde el inicio"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Download Video Button */}
        <button
          onClick={handleDownloadVideo}
          disabled={isRecording}
          className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-transform active:scale-75 shadow-lg ${
            downloadSuccess
              ? 'bg-emerald-500 border-emerald-400 text-zinc-950 font-bold'
              : isRecording
              ? 'bg-rose-600 border-rose-400 text-white animate-spin'
              : 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-300 text-zinc-950 font-bold'
          }`}
          title="Exportar y Descargar Video Reel (.webm)"
        >
          {downloadSuccess ? (
            <Check className="w-5 h-5" />
          ) : isRecording ? (
            <Layers className="w-5 h-5" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Recording indicator pill */}
      {isRecording && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center gap-2 animate-pulse shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-white" />
          Grabando Video Reel (8 segundos)...
        </div>
      )}

      {downloadSuccess && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-xl animate-fade-in">
          <Check className="w-4 h-4" />
          ¡Video descargado con éxito!
        </div>
      )}

      {/* Scene Switcher & Music Ticker on Bottom */}
      <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {scenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundManager.playPop();
                setCurrentSceneIdx(idx);
                setSceneProgress(0);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentSceneIdx
                  ? 'w-7 bg-amber-400'
                  : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
          <span className="text-[10px] font-bold text-white/80 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
            {currentSceneIdx + 1}/{scenes.length}
          </span>
        </div>

        {/* Spinning Vinyl Disk Trigger */}
        <div
          onClick={onOpenMusicSelector}
          className="flex items-center gap-2 bg-black/60 hover:bg-black/80 px-2.5 py-1 rounded-full border border-amber-500/30 cursor-pointer group transition-all"
          title="Cambiar pista de música"
        >
          <div
            className={`w-5 h-5 rounded-full bg-zinc-800 border border-amber-500 flex items-center justify-center shrink-0 ${
              bgmActive ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '3s' }}
          >
            <Disc3 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-[10px] font-bold text-white truncate max-w-[110px]">
            {musicEngine.getCurrentTrack().name}
          </span>
        </div>
      </div>
    </div>
  );
};
