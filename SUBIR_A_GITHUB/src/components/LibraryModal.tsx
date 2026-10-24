import React from 'react';
import { BookOpen, Bookmark, X, Play, Trash2, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { BookCollection, ReelShort } from '../types';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: BookCollection[];
  currentCollectionId: string;
  onSelectCollection: (id: string) => void;
  savedShorts: ReelShort[];
  onSelectShort: (short: ReelShort) => void;
  onDeleteCollection?: (id: string) => void;
  quizPoints: number;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  collections,
  currentCollectionId,
  onSelectCollection,
  savedShorts,
  onSelectShort,
  onDeleteCollection,
  quizPoints,
}) => {
  const [tab, setTab] = React.useState<'books' | 'saved'>('books');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/70 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Tu Biblioteca de Sabiduría
              </h2>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-amber-300">
                  <Award className="w-3.5 h-3.5" /> {quizPoints} XP Ganados
                </span>
                <span>·</span>
                <span>{collections.length} Libros</span>
                <span>·</span>
                <span>{savedShorts.length} Guardados</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-zinc-850 rounded-2xl my-4 text-xs font-semibold">
          <button
            onClick={() => setTab('books')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              tab === 'books'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Libros & Documentos ({collections.length})
          </button>
          <button
            onClick={() => setTab('saved')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              tab === 'saved'
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Lecciones Guardadas ({savedShorts.length})
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {tab === 'books' && (
            <>
              {collections.map((coll) => {
                const isSelected = coll.id === currentCollectionId;
                return (
                  <div
                    key={coll.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/30'
                        : 'bg-zinc-850/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        onSelectCollection(coll.id);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                          {coll.category}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> En reproducción
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-zinc-100">{coll.title}</h4>
                      <p className="text-xs text-zinc-400 mb-2">Por {coll.author}</p>
                      <p className="text-xs text-zinc-500 line-clamp-2">{coll.summary}</p>
                      <div className="mt-2 text-xs text-amber-400/90 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {coll.shorts.length} Shorts interactivos
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onSelectCollection(coll.id);
                          onClose();
                        }}
                        className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950 font-bold'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>

                      {onDeleteCollection && !['babilonia', 'habitos-atomicos', 'psicologia-dinero'].includes(coll.id) && (
                        <button
                          onClick={() => onDeleteCollection(coll.id)}
                          className="p-2 text-zinc-500 hover:text-rose-400 rounded-xl hover:bg-zinc-800 transition-colors"
                          title="Eliminar documento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {tab === 'saved' && (
            <>
              {savedShorts.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 space-y-2">
                  <Bookmark className="w-8 h-8 mx-auto opacity-40 text-amber-400" />
                  <p className="text-sm font-medium">Aún no has guardado ninguna lección.</p>
                  <p className="text-xs">
                    Toca el icono del marcador en cualquier Reel para guardarlo en tu cuaderno de sabiduría.
                  </p>
                </div>
              ) : (
                savedShorts.map((short) => (
                  <div
                    key={short.id}
                    onClick={() => {
                      onSelectShort(short);
                      onClose();
                    }}
                    className="p-4 rounded-2xl border border-zinc-800 bg-zinc-850/60 hover:bg-zinc-800 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase">
                        {short.bookTitle}
                      </span>
                      <h4 className="font-bold text-sm text-zinc-100">{short.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">"{short.hook}"</p>
                      <p className="text-xs text-emerald-400/90 font-medium mt-1">
                        🎯 {short.actionableTakeaway}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
