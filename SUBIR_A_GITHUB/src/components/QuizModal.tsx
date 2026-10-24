import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, X, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizData } from '../types';
import { soundManager } from '../utils/audioEffects';

interface QuizModalProps {
  quiz: QuizData;
  reelTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onCorrect: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  reelTitle,
  isOpen,
  onClose,
  onCorrect,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
    setHasSubmitted(true);

    if (idx === quiz.correctAnswerIndex) {
      soundManager.playSuccessChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'],
      });
      onCorrect();
    } else {
      soundManager.playErrorTone();
    }
  };

  const isCorrect = selectedOption === quiz.correctAnswerIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
          aria-label="Cerrar Quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> RETO DE RETENCIÓN
          </span>
          <span className="text-xs text-zinc-400 truncate max-w-[200px]">{reelTitle}</span>
        </div>

        {/* Question */}
        <h3 className="text-xl sm:text-2xl font-bold leading-snug mb-5 text-zinc-100">
          {quiz.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {quiz.options.map((option, idx) => {
            let optionStyles = 'border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-200';

            if (hasSubmitted) {
              if (idx === quiz.correctAnswerIndex) {
                optionStyles = 'border-emerald-500/80 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/40';
              } else if (idx === selectedOption) {
                optionStyles = 'border-rose-500/80 bg-rose-950/60 text-rose-200 ring-2 ring-rose-500/40';
              } else {
                optionStyles = 'border-zinc-800/50 bg-zinc-900/50 text-zinc-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between text-sm sm:text-base ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-zinc-700/50 flex items-center justify-center text-xs font-bold text-zinc-300">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
                {hasSubmitted && idx === quiz.correctAnswerIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                )}
                {hasSubmitted && idx === selectedOption && idx !== quiz.correctAnswerIndex && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Result Explanation */}
        {hasSubmitted && (
          <div
            className={`p-4 rounded-2xl border mb-5 text-sm ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>¡Excelente deducción! +10 XP</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>¡Casi! Aquí está la razón:</span>
                </>
              )}
            </div>
            <p className="text-zinc-300 leading-relaxed">{quiz.explanation}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            {hasSubmitted ? 'Continuar Navegando' : 'Omitir Quiz'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
