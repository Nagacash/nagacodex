const BG_MUSIC_URL = new URL(
  '../assets/music/SHORTLORD - GANJA FLOW (Instrumental).mp3',
  import.meta.url
).href;

class SoundManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private musicAudio: HTMLAudioElement | null = null;
  private contentPaused: boolean = false;
  private wasEnabledBeforeContent: boolean = false;
  private droneOscs: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  toggle(forceState?: boolean): boolean {
    this.init();
    if (!this.ctx) return false;

    const nextState = forceState !== undefined ? forceState : !this.isEnabled;
    if (nextState === this.isEnabled) return this.isEnabled;

    this.isEnabled = nextState;

    if (this.isEnabled) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.startMusic();
      this.startDrone();
    } else {
      this.stopMusic();
      this.stopDrone();
    }

    return this.isEnabled;
  }

  getEnabled() {
    return this.isEnabled;
  }

  pauseForContent() {
    this.wasEnabledBeforeContent = this.isEnabled;
    if (this.musicAudio && !this.musicAudio.paused) {
      this.musicAudio.pause();
      this.contentPaused = true;
    }
  }

  resumeFromContent() {
    if (this.wasEnabledBeforeContent && this.musicAudio && this.contentPaused) {
      this.musicAudio.play().catch(() => {});
    }
    this.contentPaused = false;
  }

  private startMusic() {
    if (this.musicAudio && !this.musicAudio.paused) return;
    try {
      if (!this.musicAudio) {
        this.musicAudio = new Audio(BG_MUSIC_URL);
        this.musicAudio.loop = true;
        this.musicAudio.volume = 0.4;
      }
      this.musicAudio.play().catch(() => {});
    } catch (e) {}
  }

  private stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
    this.contentPaused = false;
  }

  private startDrone() {
    if (!this.ctx) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 3.0);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(120, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const fundamental = 55;
    const harmonics = [1.0, 1.5, 2.0, 3.01];

    harmonics.forEach((h, index) => {
      if (!this.ctx || !this.filter) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(fundamental * h + (Math.random() * 0.4 - 0.2), this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1 + index * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(10, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.12 / h, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.filter);

      lfo.start();
      osc.start();

      this.droneOscs.push(osc);
      this.droneOscs.push(lfo);
    });

    this.filter.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);
  }

  private stopDrone() {
    if (this.droneGain && this.ctx) {
      const currentGain = this.droneGain.gain.value;
      this.droneGain.gain.setValueAtTime(currentGain, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
    }
    setTimeout(() => {
      this.droneOscs.forEach(o => {
        try { o.stop(); } catch (e) {}
      });
      this.droneOscs = [];
      this.droneGain = null;
      this.filter = null;
    }, 1300);
  }

  // Crisp mechanical tactile click trigger
  playClick() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const termOsc = this.ctx.createOscillator();
      const termGain = this.ctx.createGain();

      termOsc.type = 'triangle';
      termOsc.frequency.setValueAtTime(800, this.ctx.currentTime);
      termOsc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.06);

      termGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      termGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      termOsc.connect(termGain);
      termGain.connect(this.ctx.destination);

      termOsc.start();
      termOsc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  // Heavy resonant sweeping atmospheric sound
  playTransition() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.15);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.45);
      filter.Q.setValueAtTime(8, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.46);
    } catch (e) {}
  }

  // Short sci-fi synth beep
  playBeep() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }
}

export const sound = new SoundManager();
export default sound;
