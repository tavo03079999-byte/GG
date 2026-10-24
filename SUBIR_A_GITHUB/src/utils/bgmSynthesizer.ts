// Advanced Web Audio API Multi-Genre Music Engine for TikTok & Instagram Reels
export type MusicTrackId = 'phonk' | 'lofi' | 'synthwave' | 'hustle' | 'epic';

export interface MusicTrackInfo {
  id: MusicTrackId;
  name: string;
  artist: string;
  bpm: number;
  emoji: string;
  tag: string;
  color: string;
}

export const MUSIC_TRACKS: MusicTrackInfo[] = [
  {
    id: 'phonk',
    name: 'Phonk Motivación Viral',
    artist: 'TikTok Trending · #Hustle',
    bpm: 130,
    emoji: '🔥',
    tag: 'Energético / Adrenalina',
    color: 'from-amber-500 to-red-600',
  },
  {
    id: 'hustle',
    name: 'Pop Hustle & Beat',
    artist: 'Viral Shorts Beats',
    bpm: 120,
    emoji: '⚡',
    tag: 'Rápido / Dinámico',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'synthwave',
    name: 'Cyberpunk Neon Drive',
    artist: 'Retro Wave AI',
    bpm: 115,
    emoji: '🚀',
    tag: 'Futurista / Enfoque',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Chill & Study',
    artist: 'Lofi Girl Vibes',
    bpm: 85,
    emoji: '🎧',
    tag: 'Relajante / Sabiduría',
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'epic',
    name: 'Triunfo Cinematográfico',
    artist: 'Epic Cinematic Orchestra',
    bpm: 100,
    emoji: '🎻',
    tag: 'Inspiracional / Revelación',
    color: 'from-emerald-400 to-teal-600',
  },
];

class MusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: MusicTrackId = 'phonk';
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private duckingGain: GainNode | null = null;
  private volume: number = 0.45; // 0 to 1
  private step: number = 0;
  private noiseBuffer: AudioBuffer | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        this.duckingGain = this.ctx.createGain();
        this.duckingGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        this.duckingGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        // Pre-build white noise buffer for crisp snares and hi-hats
        const bufferSize = this.ctx.sampleRate * 0.5;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Set Ducking: lowers music when voice speaks, raises back smoothly when narrator stops
  setDucking(isDucking: boolean) {
    if (!this.ctx || !this.duckingGain) return;
    const now = this.ctx.currentTime;
    const targetGain = isDucking ? 0.22 : 1.0;
    this.duckingGain.gain.cancelScheduledValues(now);
    this.duckingGain.gain.linearRampToValueAtTime(targetGain, now + 0.3);
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(vol, 1));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  getVolume() {
    return this.volume;
  }

  // --- Instrument Synthesisers ---

  // 1. Punchy 808 Kick
  private play808Kick(pitch: number = 130) {
    const ctx = this.getContext();
    if (!ctx || !this.duckingGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.22);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.duckingGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 2. Crisp Trap / Pop Snare
  private playSnare() {
    const ctx = this.getContext();
    if (!ctx || !this.duckingGain || !this.noiseBuffer) return;
    const now = ctx.currentTime;

    // Noise component
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.duckingGain);

    // Tonal body
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.duckingGain);

    noise.start(now);
    noise.stop(now + 0.2);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 3. Hi-Hat (closed or open)
  private playHiHat(open = false) {
    const ctx = this.getContext();
    if (!ctx || !this.duckingGain || !this.noiseBuffer) return;
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, now);

    const gain = ctx.createGain();
    const duration = open ? 0.2 : 0.05;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.duckingGain);

    noise.start(now);
    noise.stop(now + duration);
  }

  // 4. Iconic Phonk Cowbell Synth (TikTok Drift signature sound)
  private playCowbell(freq: number) {
    const ctx = this.getContext();
    if (!ctx || !this.duckingGain) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'square';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.5, now); // Metallic harmonic

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.2, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.duckingGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.28);
    osc2.stop(now + 0.28);
  }

  // 5. Synthwave Bass Pulse
  private playSynthBass(freq: number, duration: number = 0.2) {
    const ctx = this.getContext();
    if (!ctx || !this.duckingGain) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + duration);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.duckingGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // 6. Polyphonic Chords (LoFi / Cinematic / Synth)
  private playChord(freqs: number[], duration: number, wave: OscillatorType = 'triangle', baseVol = 0.05) {
    const ctx = this.getContext();
    if (!ctx || !this.duckingGain) return;
    const now = ctx.currentTime;

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(baseVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.duckingGain!);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // Play sequencer step based on active track
  private triggerStep() {
    const s = this.step % 16;

    if (this.currentTrackId === 'phonk') {
      // High-energy Drift Phonk: 130 BPM
      // Drums: Kick on 0, 4, 8, 12. Snare on 4, 12.
      if (s === 0 || s === 6 || s === 10) this.play808Kick(140);
      if (s === 4 || s === 12) this.playSnare();
      if (s % 2 === 0) this.playHiHat(s === 14);

      // Phonk Cowbell Melody: G minor pentatonic
      const melody = [587.33, 523.25, 440.00, 392.00, 440.00, 523.25, 659.25, 587.33];
      if (s % 2 === 0) {
        const note = melody[(this.step / 2) % melody.length];
        this.playCowbell(note);
      }
    } else if (this.currentTrackId === 'hustle') {
      // Energetic Hustle Pop: 120 BPM
      if (s === 0 || s === 8 || s === 10) this.play808Kick(150);
      if (s === 4 || s === 12) this.playSnare();
      this.playHiHat(s % 4 === 2);

      // Driving bass
      const bassNotes = [110, 110, 130.81, 146.83];
      if (s % 4 === 0) {
        this.playSynthBass(bassNotes[(s / 4) % bassNotes.length], 0.25);
      }
      if (s === 0 || s === 8) {
        this.playChord([220, 261.63, 329.63], 0.4, 'sawtooth', 0.04);
      }
    } else if (this.currentTrackId === 'synthwave') {
      // Retro Cyber Synthwave: 115 BPM
      if (s === 0 || s === 8) this.play808Kick(110);
      if (s === 4 || s === 12) this.playSnare();
      if (s % 2 === 0) this.playHiHat();

      // Rolling 16th synth bass arpeggio
      const bassProg = [65.41, 73.42, 82.41, 87.31];
      const root = bassProg[Math.floor(this.step / 16) % bassProg.length];
      const oct = s % 2 === 0 ? root : root * 2;
      this.playSynthBass(oct, 0.12);

      if (s === 0) {
        this.playChord([root * 4, root * 5, root * 6], 1.2, 'sawtooth', 0.04);
      }
    } else if (this.currentTrackId === 'lofi') {
      // Relaxed LoFi Chill: 85 BPM
      if (s === 0 || s === 10) this.play808Kick(95);
      if (s === 4 || s === 12) this.playSnare();
      if (s % 4 === 2) this.playHiHat(true);

      const lofiChords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];
      if (s % 8 === 0) {
        const chordIdx = Math.floor((this.step / 8) % lofiChords.length);
        this.playChord(lofiChords[chordIdx], 1.8, 'triangle', 0.06);
      }
    } else if (this.currentTrackId === 'epic') {
      // Cinematic Triumph: 100 BPM
      if (s === 0 || s === 8) this.play808Kick(80);
      if (s === 12) this.playSnare();

      const epicChords = [
        [146.83, 220.00, 293.66], // D minor
        [174.61, 220.00, 261.63], // F major
        [130.81, 196.00, 261.63], // C major
        [110.00, 164.81, 220.00], // A minor
      ];
      if (s % 4 === 0) {
        const chord = epicChords[Math.floor(this.step / 8) % epicChords.length];
        this.playChord(chord, 0.9, 'triangle', 0.07);
      }
    }

    this.step++;
  }

  start(trackId?: MusicTrackId) {
    if (trackId) {
      this.currentTrackId = trackId;
    }
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.isPlaying) {
      this.stop();
    }

    this.isPlaying = true;
    this.step = 0;

    const track = MUSIC_TRACKS.find((t) => t.id === this.currentTrackId) || MUSIC_TRACKS[0];
    const stepDurationMs = (60 / track.bpm / 4) * 1000; // 16th note step

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.triggerStep();
    }, stepDurationMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  switchTrack(trackId: MusicTrackId) {
    this.currentTrackId = trackId;
    if (this.isPlaying) {
      this.start(trackId);
    }
  }

  getCurrentTrack(): MusicTrackInfo {
    return MUSIC_TRACKS.find((t) => t.id === this.currentTrackId) || MUSIC_TRACKS[0];
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const musicEngine = new MusicEngine();
export const bgmSynthesizer = musicEngine; // backwards compatibility
