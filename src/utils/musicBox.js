// Dreamy Music Box Synthesizer using Web Audio API (Lofi pastel music box)
let musicCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

// Gentle pentatonic lullaby notes (Frequencies in Hz)
// E5, G5, A5, B5, D6, E6
const MELODY = [
  659.25, 0, 783.99, 880.0, 987.77, 0, 1174.66, 1318.51,
  987.77, 880.0, 783.99, 0, 659.25, 783.99, 880.0, 0,
  587.33, 659.25, 783.99, 880.0, 987.77, 1174.66, 987.77, 0,
  880.0, 783.99, 659.25, 587.33, 659.25, 0, 0, 0
];

export function toggleMusicBox(onStateChange) {
  if (isMusicPlaying) {
    stopMusicBox();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    startMusicBox();
    if (onStateChange) onStateChange(true);
    return true;
  }
}

export function startMusicBox() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  if (!musicCtx) {
    musicCtx = new AudioContext();
  }
  if (musicCtx.state === 'suspended') {
    musicCtx.resume();
  }

  isMusicPlaying = true;
  let step = 0;

  const playNote = () => {
    if (!isMusicPlaying || !musicCtx) return;

    const freq = MELODY[step % MELODY.length];
    step++;

    if (freq > 0) {
      const osc = musicCtx.createOscillator();
      const gain = musicCtx.createGain();

      // Sine wave with slight triangle warmth (music box bell sound)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, musicCtx.currentTime);

      const now = musicCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(musicCtx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    }
  };

  playNote();
  musicInterval = setInterval(playNote, 320);
}

export function stopMusicBox() {
  isMusicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}
