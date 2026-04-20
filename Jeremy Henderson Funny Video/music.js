// music.js — Birthday theme extended to 47s for expanded video
(function () {
  let ctx = null, masterGain = null, scheduled = false, startOffset = 0;

  const NOTE = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
  };

  const MELODY = [
    // Intro fanfare (0-3s)
    [0.0, NOTE.C5, 0.18, 0.25], [0.3, NOTE.E5, 0.18, 0.25], [0.6, NOTE.G5, 0.18, 0.25],
    [1.0, NOTE.C5, 0.18, 0.25], [1.3, NOTE.E5, 0.18, 0.25], [1.6, NOTE.G5, 0.18, 0.25],
    [2.0, NOTE.C5, 0.15, 0.3], [2.3, NOTE.E5, 0.15, 0.3], [2.6, NOTE.G5, 0.4, 0.35],

    // Title blast (3-7s)
    [3.0, NOTE.C5, 0.25, 0.35], [3.3, NOTE.C5, 0.15, 0.3], [3.5, NOTE.E5, 0.25, 0.35],
    [3.8, NOTE.G5, 0.35, 0.4], [4.2, NOTE.E5, 0.2, 0.3], [4.4, NOTE.C5, 0.2, 0.3],
    [4.7, NOTE.D5, 0.5, 0.35], [5.3, NOTE.E5, 0.25, 0.35], [5.6, NOTE.F5, 0.25, 0.35],
    [5.9, NOTE.G5, 0.5, 0.4], [6.5, NOTE.E5, 0.25, 0.3], [6.75, NOTE.C5, 0.25, 0.3],

    // Origin (7-12s) — nostalgic chord progression
    [7.0, NOTE.G4, 0.3, 0.3], [7.35, NOTE.C5, 0.3, 0.3], [7.7, NOTE.E5, 0.3, 0.3],
    [8.0, NOTE.G5, 0.5, 0.35], [8.6, NOTE.E5, 0.2, 0.3], [8.85, NOTE.D5, 0.2, 0.3],
    [9.1, NOTE.C5, 0.4, 0.3], [9.55, NOTE.A4, 0.3, 0.3], [9.9, NOTE.C5, 0.3, 0.3],
    [10.25, NOTE.D5, 0.3, 0.3], [10.6, NOTE.E5, 0.4, 0.35], [11.05, NOTE.G5, 0.5, 0.4],
    [11.6, NOTE.E5, 0.35, 0.35],

    // Cool Card (12-17s) — funky upbeat
    [12.0, NOTE.C5, 0.2, 0.35], [12.25, NOTE.E5, 0.2, 0.35], [12.5, NOTE.G5, 0.2, 0.35],
    [12.75, NOTE.E5, 0.2, 0.35], [13.0, NOTE.F5, 0.3, 0.35], [13.35, NOTE.D5, 0.3, 0.35],
    [13.7, NOTE.E5, 0.3, 0.35], [14.05, NOTE.C5, 0.3, 0.35], [14.4, NOTE.A4, 0.25, 0.3],
    [14.7, NOTE.C5, 0.25, 0.3], [15.0, NOTE.D5, 0.25, 0.3], [15.3, NOTE.E5, 0.4, 0.35],
    [15.75, NOTE.G5, 0.3, 0.35], [16.1, NOTE.F5, 0.3, 0.35], [16.45, NOTE.E5, 0.4, 0.35],

    // Entourage (17-21s) — hip swing
    [17.0, NOTE.E5, 0.3, 0.35], [17.35, NOTE.G5, 0.3, 0.35], [17.7, NOTE.A5, 0.3, 0.35],
    [18.05, NOTE.G5, 0.25, 0.3], [18.35, NOTE.E5, 0.25, 0.3], [18.65, NOTE.D5, 0.4, 0.3],
    [19.1, NOTE.E5, 0.3, 0.35], [19.45, NOTE.G5, 0.3, 0.35], [19.8, NOTE.C5, 0.4, 0.35],
    [20.25, NOTE.D5, 0.25, 0.3], [20.55, NOTE.E5, 0.4, 0.35],

    // Dad Joke (21-25s) — trombone slide feel
    [21.0, NOTE.G4, 0.3, 0.3], [21.35, NOTE.A4, 0.3, 0.3], [21.7, NOTE.B4, 0.3, 0.3],
    [22.05, NOTE.C5, 0.4, 0.35], [22.5, NOTE.B4, 0.25, 0.3], [22.8, NOTE.A4, 0.25, 0.3],
    [23.1, NOTE.G4, 0.4, 0.3], [23.55, NOTE.F4, 0.25, 0.3], [23.85, NOTE.G4, 0.25, 0.3],
    [24.15, NOTE.A4, 0.4, 0.3], [24.6, NOTE.G4, 0.35, 0.3],

    // Bodyguard (25-29s) — action theme
    [25.0, NOTE.E4, 0.25, 0.3], [25.3, NOTE.G4, 0.25, 0.3], [25.6, NOTE.C5, 0.3, 0.35],
    [25.95, NOTE.E5, 0.3, 0.35], [26.3, NOTE.D5, 0.25, 0.3], [26.6, NOTE.C5, 0.4, 0.35],
    [27.05, NOTE.G4, 0.25, 0.3], [27.35, NOTE.C5, 0.25, 0.3], [27.65, NOTE.E5, 0.3, 0.35],
    [28.0, NOTE.G5, 0.4, 0.4], [28.5, NOTE.E5, 0.3, 0.35],

    // Dad Sim (29-33s) — 8-bit video game
    [29.0, NOTE.C5, 0.15, 0.3], [29.2, NOTE.E5, 0.15, 0.3], [29.4, NOTE.G5, 0.15, 0.3],
    [29.6, NOTE.C5, 0.15, 0.3], [29.8, NOTE.E5, 0.15, 0.3], [30.0, NOTE.G5, 0.3, 0.35],
    [30.35, NOTE.A5, 0.15, 0.3], [30.55, NOTE.G5, 0.15, 0.3], [30.75, NOTE.E5, 0.3, 0.3],
    [31.1, NOTE.D5, 0.15, 0.3], [31.3, NOTE.F5, 0.15, 0.3], [31.5, NOTE.A5, 0.3, 0.35],
    [31.85, NOTE.G5, 0.2, 0.3], [32.1, NOTE.E5, 0.2, 0.3], [32.35, NOTE.C5, 0.5, 0.35],

    // Showoff (33-37s) — show-off crescendo
    [33.0, NOTE.E5, 0.25, 0.35], [33.3, NOTE.F5, 0.25, 0.35], [33.6, NOTE.G5, 0.3, 0.4],
    [33.95, NOTE.A5, 0.35, 0.4], [34.35, NOTE.G5, 0.25, 0.35], [34.65, NOTE.E5, 0.3, 0.35],
    [35.0, NOTE.C5, 0.25, 0.3], [35.3, NOTE.E5, 0.25, 0.3], [35.6, NOTE.G5, 0.25, 0.35],
    [35.9, NOTE.A5, 0.35, 0.4], [36.3, NOTE.G5, 0.5, 0.4],

    // Team Henderson (37-47s) — warm/romantic, slightly goofy (10s)
    [37.0, NOTE.F4, 0.4, 0.3], [37.5, NOTE.A4, 0.4, 0.3], [38.0, NOTE.C5, 0.4, 0.35],
    [38.4, NOTE.F5, 0.5, 0.35], [38.95, NOTE.E5, 0.25, 0.3], [39.25, NOTE.D5, 0.25, 0.3],
    [39.55, NOTE.C5, 0.4, 0.3], [40.0, NOTE.A4, 0.3, 0.3], [40.35, NOTE.C5, 0.3, 0.3],
    [40.7, NOTE.E5, 0.3, 0.35], [41.05, NOTE.F5, 0.4, 0.35], [41.5, NOTE.E5, 0.4, 0.35],
    // Phase 2 — bonus stats cascade (42-47s), brighter/playful
    [42.0, NOTE.C5, 0.25, 0.3], [42.3, NOTE.D5, 0.25, 0.3], [42.6, NOTE.F5, 0.3, 0.35],
    [42.95, NOTE.A5, 0.35, 0.4], [43.4, NOTE.G5, 0.25, 0.3], [43.7, NOTE.F5, 0.25, 0.3],
    [44.0, NOTE.E5, 0.3, 0.3], [44.35, NOTE.D5, 0.3, 0.3], [44.7, NOTE.C5, 0.3, 0.3],
    [45.05, NOTE.E5, 0.25, 0.3], [45.35, NOTE.G5, 0.25, 0.35], [45.65, NOTE.A5, 0.3, 0.4],
    [46.0, NOTE.G5, 0.25, 0.35], [46.3, NOTE.F5, 0.35, 0.35], [46.7, NOTE.C5, 0.3, 0.3],

    // Warning (47-51s)
    [47.0, NOTE.E4, 0.3, 0.3], [47.4, NOTE.F4, 0.3, 0.3], [47.8, NOTE.E4, 0.3, 0.3],
    [48.2, NOTE.F4, 0.3, 0.3], [48.7, NOTE.G4, 0.2, 0.3], [48.95, NOTE.A4, 0.2, 0.3],
    [49.2, NOTE.B4, 0.2, 0.3], [49.45, NOTE.C5, 0.2, 0.3], [49.7, NOTE.D5, 0.2, 0.3],
    [49.95, NOTE.E5, 0.4, 0.35], [50.4, NOTE.G5, 0.5, 0.4],

    // Finale (51-57s)
    [51.0, NOTE.C5, 0.3, 0.4], [51.35, NOTE.E5, 0.3, 0.4], [51.7, NOTE.G5, 0.3, 0.4],
    [52.05, NOTE.C5, 0.5, 0.45], [52.6, NOTE.E5, 0.3, 0.4], [52.95, NOTE.G5, 0.3, 0.4],
    [53.3, NOTE.C5, 0.5, 0.45], [53.9, NOTE.G5, 0.25, 0.4], [54.2, NOTE.A5, 0.25, 0.4],
    [54.5, NOTE.G5, 0.25, 0.4], [54.8, NOTE.F5, 0.25, 0.4], [55.1, NOTE.E5, 0.3, 0.4],
    [55.45, NOTE.D5, 0.3, 0.4], [55.8, NOTE.C5, 1.2, 0.5],
  ];

  const BASS = [];
  // Walking bass 3-37s
  for (let t = 3.0; t < 37.0; t += 0.5) {
    const idx = Math.floor((t - 3.0) * 2);
    const root = [NOTE.C4, NOTE.C4, NOTE.F4, NOTE.G4][idx % 4] / 2;
    BASS.push([t, root, 0.45, 0.3]);
  }
  // Team section bass 37-47s — F/Am warm progression
  for (let t = 37.0; t < 47.0; t += 0.5) {
    const idx = Math.floor((t - 37.0) * 2);
    const root = [NOTE.F4, NOTE.F4, NOTE.A4, NOTE.A4, NOTE.C5, NOTE.C5, NOTE.G4, NOTE.G4][idx % 8] / 2;
    BASS.push([t, root, 0.45, 0.3]);
  }
  // Warning bass 47-51
  for (let t = 47.0; t < 51.0; t += 0.5) {
    const idx = Math.floor((t - 47.0) * 2);
    const root = [NOTE.C4, NOTE.C4, NOTE.F4, NOTE.G4][idx % 4] / 2;
    BASS.push([t, root, 0.45, 0.3]);
  }
  // Finale bass (51-57s)
  for (let t = 51.0; t < 56.5; t += 0.5) {
    const idx = Math.floor((t - 51.0) * 2);
    const root = [NOTE.C4, NOTE.G4, NOTE.C4, NOTE.E4, NOTE.F4, NOTE.G4][idx % 6] / 2;
    BASS.push([t, root, 0.45, 0.35]);
  }
  BASS.push([56.5, NOTE.C4 / 2, 0.8, 0.4]);

  // Kicks every half beat through the song
  const KICKS = [];
  for (let t = 3.0; t < 56.5; t += 0.5) KICKS.push(t);
  KICKS.push(56.5, 57.0);

  // Snares on 2 and 4
  const SNARES = [];
  for (let t = 3.5; t < 56.5; t += 1.0) SNARES.push(t);

  function playNote(t0, freq, dur, gain, type = 'triangle') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g).connect(masterGain);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }

  function playKick(t0) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t0);
    osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.12);
    g.gain.setValueAtTime(0.5, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2);
    osc.connect(g).connect(masterGain);
    osc.start(t0); osc.stop(t0 + 0.25);
  }

  function playSnare(t0) {
    const bufLen = ctx.sampleRate * 0.15;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.15);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 1200;
    src.connect(hp).connect(g).connect(masterGain);
    src.start(t0);
  }

  function scheduleAll(startT) {
    MELODY.forEach(([t, f, d, gain]) => playNote(startT + t, f, d, gain, 'triangle'));
    BASS.forEach(([t, f, d, gain]) => playNote(startT + t, f, d, gain, 'sawtooth'));
    KICKS.forEach((t) => playKick(startT + t));
    SNARES.forEach((t) => playSnare(startT + t));
  }

  function start() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      const vol = (window.JEREMY_TWEAKS && typeof window.JEREMY_TWEAKS.musicVolume === 'number')
        ? window.JEREMY_TWEAKS.musicVolume : 0.6;
      masterGain.gain.value = Math.max(0, Math.min(1, vol)) * 0.6;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    if (scheduled) return;
    scheduled = true;
    startOffset = ctx.currentTime + 0.1;
    scheduleAll(startOffset);
  }

  function stop() {
    if (ctx) { ctx.close(); ctx = null; masterGain = null; scheduled = false; }
  }

  function setVolume(v) {
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, v)) * 0.6, ctx.currentTime);
    }
  }

  window.BirthdayMusic = { start, stop, setVolume };
})();
