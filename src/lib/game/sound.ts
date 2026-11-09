type Tone = { freq: number; dur: number; type?: OscillatorType; gain?: number; slide?: number };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: { stop: () => void } | null = null;
let unlocked = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function unlockAudio() {
  const c = ac();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  unlocked = true;
}

export function setMasterGain(value: number, muted: boolean) {
  if (!master || !ctx) return;
  const v = muted ? 0 : value * value;
  master.gain.setTargetAtTime(v, ctx.currentTime, 0.03);
}

function beep(tones: Tone[], dest?: AudioNode) {
  const c = ac();
  if (!c || !master || !unlocked) return;
  const now = c.currentTime;
  let t = now;
  for (const tone of tones) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = tone.type ?? "sine";
    osc.frequency.setValueAtTime(tone.freq, t);
    if (tone.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, tone.slide), t + tone.dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(tone.gain ?? 0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + tone.dur);
    osc.connect(g);
    g.connect(dest ?? master);
    osc.start(t);
    osc.stop(t + tone.dur + 0.02);
    t += tone.dur * 0.35;
  }
}

function noiseBurst(dur: number, gain = 0.08, bp = 1200) {
  const c = ac();
  if (!c || !master || !unlocked) return;
  const n = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = n.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = n;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = bp;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start();
}

export function playSfx(name: "power" | "ping" | "alarm" | "click" | "dice") {
  if (!unlocked) return;
  if (name === "power") {
    beep([{ freq: 80, dur: 0.45, type: "sawtooth", gain: 0.07, slide: 140 }]);
    setTimeout(() => noiseBurst(0.12, 0.05, 2400), 180);
    setTimeout(() => beep([{ freq: 420, dur: 0.05, type: "square", gain: 0.05 }]), 260);
  } else if (name === "ping") {
    beep([{ freq: 880, dur: 0.12, gain: 0.07 }, { freq: 1320, dur: 0.08, gain: 0.04 }]);
  } else if (name === "alarm") {
    beep([
      { freq: 140, dur: 0.18, type: "square", gain: 0.09 },
      { freq: 110, dur: 0.18, type: "square", gain: 0.09 },
      { freq: 140, dur: 0.18, type: "square", gain: 0.09 },
    ]);
  } else if (name === "click") {
    noiseBurst(0.04, 0.04, 1800);
  } else if (name === "dice") {
    noiseBurst(0.08, 0.06, 900);
    beep([{ freq: 240, dur: 0.06, type: "triangle", gain: 0.05 }]);
  }
}

export function setAmbient(kind: "chamber" | "hall" | "latch" | "off") {
  const c = ac();
  if (!c || !master) return;
  ambient?.stop();
  ambient = null;
  if (kind === "off" || !unlocked) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = kind === "latch" ? 72 : kind === "hall" ? 58 : 48;
  lfo.frequency.value = kind === "latch" ? 0.18 : 0.08;
  lfoGain.gain.value = kind === "latch" ? 8 : 4;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  g.gain.value = kind === "latch" ? 0.03 : 0.02;
  osc.connect(g);
  g.connect(master);
  osc.start();
  lfo.start();
  ambient = {
    stop() {
      try {
        osc.stop();
        lfo.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}

export function isAudioUnlocked() {
  return unlocked;
}
