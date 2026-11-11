/**
 * Romantic Instrumental Procedural Audio Synthesizer
 * Handcrafted acoustic music box / harp arpeggio generator using Web Audio API.
 * 100% self-contained with zero external 404 dependencies.
 */

class RomanticMusicPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private noteIndex = 0;

  // Romantic Pentatonic/Major Melody sequence (Frequencies in Hz)
  // D4, F#4, A4, B4, D5, C#5, A4, F#4, G4, B4, D5, E5, F#5, E5, D5, A4
  private readonly melodyNotes: number[] = [
    293.66, 369.99, 440.00, 493.88, 587.33, 554.37, 440.00, 369.99,
    392.00, 493.88, 587.33, 659.25, 739.99, 659.25, 587.33, 440.00,
    329.63, 369.99, 440.00, 587.33, 659.25, 739.99, 880.00, 739.99,
    587.33, 493.88, 440.00, 369.99, 329.63, 293.66, 369.99, 440.00,
  ];

  private readonly bassNotes: number[] = [
    146.83, 146.83, 196.00, 196.00, 220.00, 220.00, 146.83, 146.83,
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master gain for smooth fading
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, time: number, duration: number, isBass = false) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm, bell-like harp/celesta overtone mix
    osc.type = isBass ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, time);

    // Warm low-pass acoustic filtering
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(isBass ? 450 : 2200, time);
    filter.Q.setValueAtTime(2, time);

    // Envelope: sharp gentle pluck, soft exponential decay
    const peakVolume = isBass ? 0.22 : 0.28;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(peakVolume, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private scheduleNextNotes = () => {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const noteFreq = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
    
    // Play melody note
    this.playTone(noteFreq, now, 1.4, false);

    // Every 4th step, play a warm acoustic bass grounding tone
    if (this.noteIndex % 4 === 0) {
      const bassIndex = Math.floor(this.noteIndex / 4) % this.bassNotes.length;
      this.playTone(this.bassNotes[bassIndex], now, 2.5, true);
    }

    this.noteIndex++;
    // Musical tempo: ~500ms per 8th note
    this.timerId = window.setTimeout(this.scheduleNextNotes, 480);
  };

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.scheduleNextNotes();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const musicPlayer = new RomanticMusicPlayer();
