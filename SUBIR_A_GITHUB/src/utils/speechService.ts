export interface SpeechPlayerState {
  isPlaying: boolean;
  progress: number; // 0 to 1
  currentPhraseIndex: number;
}

class SpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private synthUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback: ((state: SpeechPlayerState) => void) | null = null;
  private progressInterval: number | null = null;
  private isSpeaking = false;

  // Speak text using either Gemini TTS or browser SpeechSynthesis
  async playNarration(
    text: string,
    phrases: string[],
    onStateChange: (state: SpeechPlayerState) => void,
    onEnded: () => void
  ) {
    this.stop();
    this.onStateChangeCallback = onStateChange;
    this.isSpeaking = true;

    // Try Gemini TTS first
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Fenrir' }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.audioBase64) {
          this.playAudioBlob(result.audioBase64, result.mimeType || 'audio/wav', phrases, onEnded);
          return;
        }
      }
    } catch (err) {
      console.warn('Fallback to SpeechSynthesis:', err);
    }

    // Fallback to Web Speech API
    this.playWithWebSpeech(text, phrases, onEnded);
  }

  private playAudioBlob(
    base64Data: string,
    mimeType: string,
    phrases: string[],
    onEnded: () => void
  ) {
    const audioUrl = `data:${mimeType};base64,${base64Data}`;
    this.currentAudio = new Audio(audioUrl);

    this.currentAudio.addEventListener('timeupdate', () => {
      if (!this.currentAudio) return;
      const duration = this.currentAudio.duration || 1;
      const currentTime = this.currentAudio.currentTime;
      const progress = Math.min(currentTime / duration, 1);

      const phraseCount = Math.max(phrases.length, 1);
      const currentPhraseIndex = Math.min(
        Math.floor(progress * phraseCount),
        phraseCount - 1
      );

      this.onStateChangeCallback?.({
        isPlaying: true,
        progress,
        currentPhraseIndex,
      });
    });

    this.currentAudio.addEventListener('ended', () => {
      this.isSpeaking = false;
      this.cleanup();
      this.onStateChangeCallback?.({
        isPlaying: false,
        progress: 1,
        currentPhraseIndex: phrases.length - 1,
      });
      onEnded();
    });

    this.currentAudio.addEventListener('error', () => {
      this.stop();
      onEnded();
    });

    this.currentAudio.play().catch(() => {
      this.stop();
    });
  }

  private playWithWebSpeech(text: string, phrases: string[], onEnded: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.simulatePlayback(phrases, onEnded);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick best Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(
      (v) => v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural'))
    ) || voices.find((v) => v.lang.startsWith('es'));

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    const estimatedDurationMs = Math.max((text.length / 14) * 1000, 4000);
    const startTime = Date.now();

    this.progressInterval = window.setInterval(() => {
      if (!this.isSpeaking) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / estimatedDurationMs, 0.98);
      const phraseCount = Math.max(phrases.length, 1);
      const currentPhraseIndex = Math.min(
        Math.floor(progress * phraseCount),
        phraseCount - 1
      );

      this.onStateChangeCallback?.({
        isPlaying: true,
        progress,
        currentPhraseIndex,
      });
    }, 150);

    utterance.onend = () => {
      this.isSpeaking = false;
      this.cleanup();
      this.onStateChangeCallback?.({
        isPlaying: false,
        progress: 1,
        currentPhraseIndex: phrases.length - 1,
      });
      onEnded();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.cleanup();
      this.onStateChangeCallback?.({
        isPlaying: false,
        progress: 0,
        currentPhraseIndex: 0,
      });
      onEnded();
    };

    this.synthUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private simulatePlayback(phrases: string[], onEnded: () => void) {
    let progress = 0;
    this.progressInterval = window.setInterval(() => {
      progress += 0.05;
      const phraseCount = Math.max(phrases.length, 1);
      const currentPhraseIndex = Math.min(
        Math.floor(progress * phraseCount),
        phraseCount - 1
      );

      if (progress >= 1) {
        this.stop();
        onEnded();
      } else {
        this.onStateChangeCallback?.({
          isPlaying: true,
          progress,
          currentPhraseIndex,
        });
      }
    }, 300);
  }

  stop() {
    this.isSpeaking = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.synthUtterance = null;
    this.cleanup();
    this.onStateChangeCallback?.({
      isPlaying: false,
      progress: 0,
      currentPhraseIndex: 0,
    });
  }

  private cleanup() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}

export const speechService = new SpeechService();
