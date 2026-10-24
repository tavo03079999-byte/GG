export interface QuizData {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type VisualTheme = 'gold' | 'emerald' | 'violet' | 'indigo' | 'rose' | 'amber' | 'cyan';

export interface VideoScene {
  sceneNumber: number;
  durationSec: number;
  headline: string;
  subtext: string;
  visualPreset: 'gold-cascade' | 'matrix-wealth' | 'cyber-bars' | 'particle-stars' | 'hourglass';
  captionWords: string[];
}

export interface ViralWebTrend {
  id: string;
  trendName: string;
  hookTemplate: string;
  whyViral: string;
  suggestedPacing: string;
  formatCategory: 'POV' | 'Cuenta Regresiva' | 'Pregunta Incómoda' | 'Desafío Mental' | 'Storytelling';
}

export interface ReelShort {
  id: string;
  title: string;
  bookTitle: string;
  author: string;
  category: string;
  readTime: string;
  hook: string;
  coreInsight: string;
  steps: string[];
  actionableTakeaway: string;
  quote: string;
  visualTheme: VisualTheme;
  keyPhrases: string[];
  fullNarration: string;
  quiz: QuizData;
  likes: number;
  isSaved?: boolean;
  userAnsweredCorrectly?: boolean;
  viralFormat?: string;
  trendSource?: string;
  scenes?: VideoScene[];
}

export interface BookCollection {
  id: string;
  title: string;
  author: string;
  category: string;
  summary: string;
  coverGradient: string;
  shorts: ReelShort[];
  trendInspiration?: string;
}

