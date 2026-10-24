import { VisualTheme } from '../types';

export interface ThemeConfig {
  background: string;
  cardBg: string;
  accent: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  textColor: string;
  progressColor: string;
  glowColor: string;
}

export const THEME_CONFIGS: Record<VisualTheme, ThemeConfig> = {
  gold: {
    background: 'from-[#171206] via-[#241a06] to-[#0a0702]',
    cardBg: 'bg-amber-950/40 border-amber-500/20',
    accent: 'text-amber-400',
    accentBorder: 'border-amber-400/30',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    badgeText: 'text-amber-300',
    textColor: 'text-amber-100',
    progressColor: 'bg-gradient-to-r from-amber-400 to-yellow-300',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
  emerald: {
    background: 'from-[#03150d] via-[#062417] to-[#010a06]',
    cardBg: 'bg-emerald-950/40 border-emerald-500/20',
    accent: 'text-emerald-400',
    accentBorder: 'border-emerald-400/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    badgeText: 'text-emerald-300',
    textColor: 'text-emerald-100',
    progressColor: 'bg-gradient-to-r from-emerald-400 to-teal-300',
    glowColor: 'rgba(16, 185, 129, 0.25)',
  },
  violet: {
    background: 'from-[#140a24] via-[#1f0f38] to-[#090312]',
    cardBg: 'bg-purple-950/40 border-purple-500/20',
    accent: 'text-purple-400',
    accentBorder: 'border-purple-400/30',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    badgeText: 'text-purple-300',
    textColor: 'text-purple-100',
    progressColor: 'bg-gradient-to-r from-purple-400 to-pink-400',
    glowColor: 'rgba(168, 85, 247, 0.25)',
  },
  indigo: {
    background: 'from-[#080d24] via-[#0d163d] to-[#030612]',
    cardBg: 'bg-indigo-950/40 border-indigo-500/20',
    accent: 'text-indigo-400',
    accentBorder: 'border-indigo-400/30',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    badgeText: 'text-indigo-300',
    textColor: 'text-indigo-100',
    progressColor: 'bg-gradient-to-r from-indigo-400 to-cyan-300',
    glowColor: 'rgba(99, 102, 241, 0.25)',
  },
  rose: {
    background: 'from-[#210912] via-[#330d1d] to-[#0e0207]',
    cardBg: 'bg-rose-950/40 border-rose-500/20',
    accent: 'text-rose-400',
    accentBorder: 'border-rose-400/30',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    badgeText: 'text-rose-300',
    textColor: 'text-rose-100',
    progressColor: 'bg-gradient-to-r from-rose-400 to-orange-400',
    glowColor: 'rgba(244, 63, 94, 0.25)',
  },
  amber: {
    background: 'from-[#1c1206] via-[#2c1b08] to-[#0d0702]',
    cardBg: 'bg-amber-950/40 border-amber-500/20',
    accent: 'text-amber-400',
    accentBorder: 'border-amber-400/30',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    badgeText: 'text-amber-300',
    textColor: 'text-amber-100',
    progressColor: 'bg-gradient-to-r from-amber-400 to-orange-400',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
  cyan: {
    background: 'from-[#03141f] via-[#072133] to-[#01090f]',
    cardBg: 'bg-cyan-950/40 border-cyan-500/20',
    accent: 'text-cyan-400',
    accentBorder: 'border-cyan-400/30',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    badgeText: 'text-cyan-300',
    textColor: 'text-cyan-100',
    progressColor: 'bg-gradient-to-r from-cyan-400 to-blue-400',
    glowColor: 'rgba(6, 182, 212, 0.25)',
  },
};
