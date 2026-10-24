import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookCollection, ReelShort } from './types';
import { DEFAULT_BOOK_COLLECTIONS } from './data/defaultBooks';
import { ReelCard } from './components/ReelCard';
import { VideoCanvasPlayer } from './components/VideoCanvasPlayer';
import { HeaderBar } from './components/HeaderBar';
import { QuizModal } from './components/QuizModal';
import { DeepDiveModal } from './components/DeepDiveModal';
import { UploadModal } from './components/UploadModal';
import { LibraryModal } from './components/LibraryModal';
import { ViralTrendsModal } from './components/ViralTrendsModal';
import { MusicSelectorModal } from './components/MusicSelectorModal';
import { speechService, SpeechPlayerState } from './utils/speechService';
import { soundManager } from './utils/audioEffects';
import { musicEngine, MusicTrackId } from './utils/bgmSynthesizer';
import { ViralWebTrend } from './types';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Volume2,
  BookOpen,
  Keyboard,
  Compass,
  Flame
} from 'lucide-react';

export default function App() {
  // Collections state
  const [collections, setCollections] = useState<BookCollection[]>(() => {
    try {
      const saved = localStorage.getItem('scrolllearn_collections');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_BOOK_COLLECTIONS;
  });

  // Default to 'all' so books are automatically interleaved and varied across down-scrolls
  const [currentCollectionId, setCurrentCollectionId] = useState<string>('all');
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);

  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(false);

  // Auto-scroll Hands-Free Mode
  const [autoScroll, setAutoScroll] = useState<boolean>(false);

  // View Mode: 'card' (interactive vertical cards) | 'video' (60FPS animated video with kinetic captions)
  const [viewMode, setViewMode] = useState<'card' | 'video'>('card');

  // Music & Reel Soundtrack state
  const [activeTrackId, setActiveTrackId] = useState<MusicTrackId>('phonk');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);
  const [isMusicSelectorOpen, setIsMusicSelectorOpen] = useState<boolean>(false);

  // Modals state
  const [activeQuizShort, setActiveQuizShort] = useState<ReelShort | null>(null);
  const [activeDeepDiveShort, setActiveDeepDiveShort] = useState<ReelShort | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState<boolean>(false);
  const [isViralTrendsOpen, setIsViralTrendsOpen] = useState<boolean>(false);
  const [viralTrendForUpload, setViralTrendForUpload] = useState<string>('');

  // Gamification & Saved
  const [quizPoints, setQuizPoints] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('scrolllearn_xp')) || 0;
    } catch {
      return 0;
    }
  });

  const [savedShortIds, setSavedShortIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('scrolllearn_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compute interleaved shorts across all collections (alternating 1 from each book)
  const interleavedShorts = React.useMemo(() => {
    const result: ReelShort[] = [];
    const maxLen = Math.max(...collections.map((c) => c.shorts.length), 0);

    const activeColls = [...collections];
    if (shuffleSeed > 0) {
      activeColls.sort((a, b) => {
        const hashA = (a.id.length * 31 + shuffleSeed * 19) % 100;
        const hashB = (b.id.length * 31 + shuffleSeed * 19) % 100;
        return hashA - hashB;
      });
    }

    for (let i = 0; i < maxLen; i++) {
      for (const c of activeColls) {
        if (c.shorts[i]) {
          result.push(c.shorts[i]);
        }
      }
    }
    return result;
  }, [collections, shuffleSeed]);

  // Current active collection & shorts
  const isInterleavedMode = currentCollectionId === 'all';

  const currentCollection: BookCollection = isInterleavedMode
    ? {
        id: 'all',
        title: '🔀 Para Ti (Libros Alternados)',
        author: `${collections.length} Libros en Variación`,
        category: 'Feed Alternado',
        summary: 'Reels intercalados de todos tus libros y PDFs para máxima variedad y aprendizaje continuo.',
        coverGradient: 'from-amber-600 via-rose-700 to-indigo-900',
        shorts: interleavedShorts,
      }
    : collections.find((c) => c.id === currentCollectionId) || collections[0];

  const shorts = isInterleavedMode ? interleavedShorts : currentCollection.shorts;
  const currentShort = shorts[currentReelIndex] || shorts[0];

  // Touch gesture tracking for vertical swipe
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isWheeling = useRef<boolean>(false);
  const wheelTimeout = useRef<number | null>(null);

  // Save collections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scrolllearn_collections', JSON.stringify(collections));
    } catch (e) {}
  }, [collections]);

  // Save XP to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scrolllearn_xp', quizPoints.toString());
    } catch (e) {}
  }, [quizPoints]);

  // Save savedShortIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scrolllearn_saved', JSON.stringify(savedShortIds));
    } catch (e) {}
  }, [savedShortIds]);

  // Handle background music playback
  useEffect(() => {
    if (isMusicPlaying) {
      musicEngine.start(activeTrackId);
    } else {
      musicEngine.stop();
    }
    return () => {
      musicEngine.stop();
    };
  }, [isMusicPlaying, activeTrackId]);

  // Navigate to next reel
  const handleNextReel = useCallback(() => {
    if (currentReelIndex < shorts.length - 1) {
      soundManager.playSwoosh();
      speechService.stop();
      musicEngine.setDucking(false);
      setIsAudioPlaying(false);
      setAudioProgress(0);
      setCurrentPhraseIndex(0);
      setCurrentReelIndex((prev) => prev + 1);
    }
  }, [currentReelIndex, shorts.length]);

  // Navigate to prev reel
  const handlePrevReel = useCallback(() => {
    if (currentReelIndex > 0) {
      soundManager.playSwoosh();
      speechService.stop();
      musicEngine.setDucking(false);
      setIsAudioPlaying(false);
      setAudioProgress(0);
      setCurrentPhraseIndex(0);
      setCurrentReelIndex((prev) => prev - 1);
    }
  }, [currentReelIndex]);

  // Toggle audio narration with audio ducking
  const handleToggleAudio = useCallback(() => {
    if (isAudioPlaying) {
      speechService.stop();
      musicEngine.setDucking(false);
      setIsAudioPlaying(false);
    } else {
      soundManager.playPop();
      setIsAudioPlaying(true);
      musicEngine.setDucking(true);
      const textToNarrate = currentShort.fullNarration || `${currentShort.title}. ${currentShort.hook}. ${currentShort.coreInsight}. Acción de hoy: ${currentShort.actionableTakeaway}`;

      speechService.playNarration(
        textToNarrate,
        currentShort.keyPhrases,
        (state: SpeechPlayerState) => {
          setIsAudioPlaying(state.isPlaying);
          setAudioProgress(state.progress);
          setCurrentPhraseIndex(state.currentPhraseIndex);
        },
        () => {
          setIsAudioPlaying(false);
          musicEngine.setDucking(false);
          // If autoScroll is enabled, automatically move to next reel!
          if (autoScroll && currentReelIndex < shorts.length - 1) {
            setTimeout(() => {
              handleNextReel();
            }, 1200);
          }
        }
      );
    }
  }, [isAudioPlaying, currentShort, autoScroll, currentReelIndex, shorts.length, handleNextReel]);

  // Automatically start audio if autoPlay is turned on when reel changes
  useEffect(() => {
    if (autoPlayAudio) {
      handleToggleAudio();
    }
    return () => {
      speechService.stop();
    };
  }, [currentReelIndex, currentCollectionId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused or modal open
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName) ||
        activeQuizShort ||
        activeDeepDiveShort ||
        isUploadModalOpen ||
        isLibraryModalOpen
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrevReel();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleToggleAudio();
      } else if (e.key === 'q' || e.key === 'Q') {
        setActiveQuizShort(currentShort);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextReel, handlePrevReel, handleToggleAudio, currentShort, activeQuizShort, activeDeepDiveShort, isUploadModalOpen, isLibraryModalOpen]);

  // Wheel scroll with debounced snapping
  const handleWheel = (e: React.WheelEvent) => {
    if (activeQuizShort || activeDeepDiveShort || isUploadModalOpen || isLibraryModalOpen) return;

    if (Math.abs(e.deltaY) > 35 && !isWheeling.current) {
      isWheeling.current = true;
      if (e.deltaY > 0) {
        handleNextReel();
      } else {
        handlePrevReel();
      }

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = window.setTimeout(() => {
        isWheeling.current = false;
      }, 450);
    }
  };

  // Touch handlers for mobile down-scrolling / swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;
    if (diff > 50) {
      // Swiped UP -> go DOWN to next reel
      handleNextReel();
    } else if (diff < -50) {
      // Swiped DOWN -> go UP to prev reel
      handlePrevReel();
    }
  };

  // Toggle bookmark / saved
  const handleToggleSave = () => {
    soundManager.playPop();
    const id = currentShort.id;
    setSavedShortIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Handle new collection from upload
  const handleAddCollection = (newColl: BookCollection) => {
    setCollections((prev) => [newColl, ...prev]);
    setCurrentCollectionId(newColl.id);
    setCurrentReelIndex(0);
    speechService.stop();
    setIsAudioPlaying(false);
  };

  // Shuffle interleaved feed
  const handleShuffleFeed = () => {
    soundManager.playPop();
    speechService.stop();
    setIsAudioPlaying(false);
    setShuffleSeed((prev) => prev + 1);
    setCurrentReelIndex(0);
  };

  // Filter all saved shorts for the library
  const allSavedShorts: ReelShort[] = collections
    .flatMap((c) => c.shorts)
    .filter((s) => savedShortIds.includes(s.id));

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-screen bg-[#070709] overflow-hidden flex flex-col font-sans text-white select-none"
    >
      {/* Top Header Bar */}
      <HeaderBar
        collections={collections}
        currentCollection={currentCollection}
        onSelectCollection={(id) => {
          setCurrentCollectionId(id);
          setCurrentReelIndex(0);
          speechService.stop();
          setIsAudioPlaying(false);
        }}
        onOpenUpload={() => {
          setViralTrendForUpload('');
          setIsUploadModalOpen(true);
        }}
        onOpenLibrary={() => setIsLibraryModalOpen(true)}
        onOpenViralTrends={() => setIsViralTrendsOpen(true)}
        onOpenMusicSelector={() => setIsMusicSelectorOpen(true)}
        isMusicPlaying={isMusicPlaying}
        musicTrackName={musicEngine.getCurrentTrack().name}
        autoScroll={autoScroll}
        onToggleAutoScroll={() => {
          soundManager.playPop();
          setAutoScroll(!autoScroll);
        }}
        isMuted={!isAudioPlaying}
        onToggleMute={handleToggleAudio}
        quizPoints={quizPoints}
        viewMode={viewMode}
        onToggleViewMode={() => {
          soundManager.playPop();
          setViewMode(viewMode === 'card' ? 'video' : 'card');
        }}
        isInterleaved={isInterleavedMode}
        onShuffleFeed={handleShuffleFeed}
      />

      {/* Main App Canvas */}
      <div className="relative flex-1 pt-14 pb-2 px-2 sm:px-4 flex items-center justify-center overflow-hidden">
        {/* Desktop Side Guides / Keyboard Hints */}
        <div className="hidden lg:flex flex-col gap-3 absolute left-6 top-1/2 -translate-y-1/2 text-xs text-zinc-500 max-w-[200px]">
          {/* Music Soundtrack Quick Trigger */}
          <div
            onClick={() => setIsMusicSelectorOpen(true)}
            className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs cursor-pointer hover:bg-amber-500/20 transition-all space-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Canción del Reel
              </span>
              <span className="text-[9px] bg-amber-500/30 px-1.5 py-0.5 rounded uppercase">Beat</span>
            </div>
            <p className="text-[11px] text-zinc-300 font-semibold truncate">
              {musicEngine.getCurrentTrack().name}
            </p>
          </div>

          {/* Radar Web Quick Trigger */}
          <div
            onClick={() => setIsViralTrendsOpen(true)}
            className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs cursor-pointer hover:bg-rose-900/50 transition-all space-y-1 shadow-lg"
          >
            <div className="flex items-center justify-between font-bold text-rose-300">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Radar de Tendencias
              </span>
              <span className="text-[9px] bg-rose-500/30 px-1.5 py-0.5 rounded uppercase">Web</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Ideas virales de TikTok/Reels para adaptar a tu PDF.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-2">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5 text-xs">
              <Keyboard className="w-3.5 h-3.5 text-amber-400" /> Atajos Rápidos
            </span>
            <div className="flex items-center justify-between text-[11px]">
              <span>Siguiente Reel</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">↓</kbd>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Reel Anterior</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">↑</kbd>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Voz Narrador</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">Espacio</kbd>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Reto Quiz</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">Q</kbd>
            </div>
          </div>
        </div>

        {/* Center Vertical Reel Stage */}
        <div className="relative w-full h-[calc(100vh-76px)] max-h-[820px] max-w-[420px] flex items-center justify-center">
          {viewMode === 'video' ? (
            <VideoCanvasPlayer
              key={`vid-${currentShort.id}`}
              short={{
                ...currentShort,
                isSaved: savedShortIds.includes(currentShort.id),
              }}
              onNextReel={handleNextReel}
              onPrevReel={handlePrevReel}
              onOpenMusicSelector={() => setIsMusicSelectorOpen(true)}
            />
          ) : (
            <ReelCard
              key={currentShort.id}
              short={{
                ...currentShort,
                isSaved: savedShortIds.includes(currentShort.id),
              }}
              index={currentReelIndex}
              total={shorts.length}
              isActive={true}
              isAudioPlaying={isAudioPlaying}
              audioProgress={audioProgress}
              currentPhraseIndex={currentPhraseIndex}
              onToggleAudio={handleToggleAudio}
              onOpenQuiz={() => setActiveQuizShort(currentShort)}
              onOpenDeepDive={() => setActiveDeepDiveShort(currentShort)}
              onToggleSave={handleToggleSave}
              onNextReel={handleNextReel}
              onPrevReel={handlePrevReel}
              isMusicPlaying={isMusicPlaying}
              musicTrackName={musicEngine.getCurrentTrack().name}
              onToggleMusic={() => {
                soundManager.playPop();
                setIsMusicPlaying(!isMusicPlaying);
              }}
              onOpenMusicSelector={() => setIsMusicSelectorOpen(true)}
            />
          )}
        </div>

        {/* Desktop Right Side: Book Chapters & Quick Overview */}
        <div className="hidden lg:flex flex-col gap-2 absolute right-6 top-1/2 -translate-y-1/2 text-xs text-zinc-400 max-w-[220px]">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                {isInterleavedMode ? 'Feed Alternado' : 'En este Libro'}
              </span>
              <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-300">
                {currentReelIndex + 1}/{shorts.length}
              </span>
            </div>

            <div className="space-y-1.5 max-h-[280px] overflow-y-auto no-scrollbar pr-1">
              {shorts.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    speechService.stop();
                    setIsAudioPlaying(false);
                    setCurrentReelIndex(idx);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-[11px] font-medium transition-all flex items-center gap-2 ${
                    idx === currentReelIndex
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[9px] shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{s.title}</p>
                    {isInterleavedMode && s.bookTitle && (
                      <p className="text-[9px] text-zinc-500 truncate font-normal">
                        📖 {s.bookTitle}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeQuizShort && (
        <QuizModal
          quiz={activeQuizShort.quiz}
          reelTitle={activeQuizShort.title}
          isOpen={!!activeQuizShort}
          onClose={() => setActiveQuizShort(null)}
          onCorrect={() => {
            setQuizPoints((prev) => prev + 10);
          }}
        />
      )}

      {activeDeepDiveShort && (
        <DeepDiveModal
          short={activeDeepDiveShort}
          isOpen={!!activeDeepDiveShort}
          onClose={() => setActiveDeepDiveShort(null)}
        />
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddCollection={handleAddCollection}
        initialViralTrend={viralTrendForUpload}
      />

      <ViralTrendsModal
        isOpen={isViralTrendsOpen}
        onClose={() => setIsViralTrendsOpen(false)}
        currentBookTitle={currentCollection.title}
        onApplyTrendToGenerator={(trend) => {
          setViralTrendForUpload(trend.trendName);
          setIsUploadModalOpen(true);
        }}
      />

      <MusicSelectorModal
        isOpen={isMusicSelectorOpen}
        onClose={() => setIsMusicSelectorOpen(false)}
        activeTrackId={activeTrackId}
        onSelectTrack={(trackId) => {
          setActiveTrackId(trackId);
          musicEngine.switchTrack(trackId);
        }}
        isMusicPlaying={isMusicPlaying}
        onToggleMusicPlay={() => {
          setIsMusicPlaying(!isMusicPlaying);
        }}
      />

      <LibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        collections={collections}
        currentCollectionId={currentCollectionId}
        onSelectCollection={(id) => {
          setCurrentCollectionId(id);
          setCurrentReelIndex(0);
          speechService.stop();
          setIsAudioPlaying(false);
        }}
        savedShorts={allSavedShorts}
        onSelectShort={(s) => {
          // Find collection containing this short
          const parent = collections.find((c) => c.shorts.some((item) => item.id === s.id));
          if (parent) {
            setCurrentCollectionId(parent.id);
            const idx = parent.shorts.findIndex((item) => item.id === s.id);
            setCurrentReelIndex(Math.max(idx, 0));
            speechService.stop();
            setIsAudioPlaying(false);
          }
        }}
        onDeleteCollection={(id) => {
          setCollections((prev) => prev.filter((c) => c.id !== id));
          if (currentCollectionId === id) {
            setCurrentCollectionId('babilonia');
            setCurrentReelIndex(0);
          }
        }}
        quizPoints={quizPoints}
      />
    </div>
  );
}
