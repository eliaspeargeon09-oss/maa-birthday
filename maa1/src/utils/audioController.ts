/**
 * Resilient audio controller for background music and ambient sound effects.
 * Supports HTML5 Audio with graceful fallback to synthesized ambient piano chimes
 * and water droplets via Web Audio API when no MP3 file is present.
 */

import { AUDIO_CONFIG, AUDIO_TRACKS, type AudioTrack } from "../data/audioTracks";

class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  // Oceanic pentatonic chords in E-flat major: serene, warm, cinematic
  private chords = [
    [311.13, 392.00, 466.16, 622.25], // Eb major
    [261.63, 311.13, 392.00, 523.25], // C minor
    [233.08, 293.66, 349.23, 466.16], // Bb major
    [207.65, 261.63, 311.13, 415.30]  // Ab major
  ];
  private currentChordIndex = 0;

  private initCtx() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  start() {
    if (this.isPlaying) return;
    this.initCtx();
    if (!this.audioCtx) return;
    this.isPlaying = true;

    const playArpeggio = () => {
      if (!this.audioCtx || !this.isPlaying) return;
      const chord = this.chords[this.currentChordIndex];
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

      chord.forEach((freq, i) => {
        if (!this.audioCtx) return;
        const noteTime = this.audioCtx.currentTime + i * 0.4;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        // Warm oceanic tone
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.035, noteTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 3.4);
      });
    };

    playArpeggio();
    this.intervalId = window.setInterval(playArpeggio, 3800);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Synthesized water droplet sound effect
  playWaterDrop() {
    this.initCtx();
    if (!this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.08);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.025, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Synthesized candle blow gentle breeze
  playCandleBlow() {
    this.initCtx();
    if (!this.audioCtx) return;
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.4);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.03, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.55);
  }
}

export class BackgroundMusicManager {
  private audioEl: HTMLAudioElement | null = null;
  private audioEngine: AmbientAudioEngine | null = null;
  private isPlaying = false;
  private isUsingSynthFallback = false;
  private currentTrackIndex = 0;
  private listeners: Set<(playing: boolean, track: AudioTrack) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.audioEngine = new AmbientAudioEngine();
      this.initAudioElement(0);
    }
  }

  private initAudioElement(index: number) {
    if (typeof window === "undefined") return;

    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = "";
    }

    this.currentTrackIndex = Math.max(0, Math.min(index, AUDIO_TRACKS.length - 1));
    const track = AUDIO_TRACKS[this.currentTrackIndex];

    this.audioEl = new Audio(track.src);
    this.audioEl.loop = true;
    this.audioEl.volume = AUDIO_CONFIG.defaultVolume;

    this.audioEl.addEventListener("error", () => {
      // Fallback gracefully to ambient synthesis if file missing or network issue
      if (this.isPlaying) {
        this.isUsingSynthFallback = true;
        this.audioEngine?.start();
      }
    });
  }

  subscribe(listener: (playing: boolean, track: AudioTrack) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const currentTrack = this.getCurrentTrack();
    this.listeners.forEach((l) => l(this.isPlaying, currentTrack));
  }

  getTracks(): AudioTrack[] {
    return AUDIO_TRACKS;
  }

  getCurrentTrack(): AudioTrack {
    return AUDIO_TRACKS[this.currentTrackIndex] || AUDIO_TRACKS[0];
  }

  getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  setTrack(indexOrId: number | string) {
    let newIndex = 0;
    if (typeof indexOrId === "number") {
      newIndex = Math.max(0, Math.min(indexOrId, AUDIO_TRACKS.length - 1));
    } else {
      const found = AUDIO_TRACKS.findIndex((t) => t.id === indexOrId);
      if (found !== -1) newIndex = found;
    }

    if (newIndex === this.currentTrackIndex && this.audioEl) {
      return;
    }

    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.pause();
    }

    this.initAudioElement(newIndex);
    this.isUsingSynthFallback = false;

    if (wasPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % AUDIO_TRACKS.length;
    this.setTrack(nextIdx);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.audioEl && !this.isUsingSynthFallback) {
      this.audioEl.play().catch(() => {
        // Autoplay restricted or file not found: activate ambient synth engine
        this.isUsingSynthFallback = true;
        this.audioEngine?.start();
      });
    } else {
      this.audioEngine?.start();
    }
    this.notify();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.audioEngine?.stop();
    this.notify();
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  playWaterDrop() {
    this.audioEngine?.playWaterDrop();
  }

  playCandleBlow() {
    this.audioEngine?.playCandleBlow();
  }
}

export const musicManager = new BackgroundMusicManager();

