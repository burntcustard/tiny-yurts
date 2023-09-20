/* eslint-disable array-bracket-spacing */
import { colors } from './colors';

// This must only be called on user interaction. So probably on pressing a
// main menu button? But we don't want to re-do it er ever as well hrm
let audioContext;

// Sample rate in Hz. Could be fetched with audioContext.sampleRate, but writing
// out just the number will minify slightly better
const sampleRate = 44100;

export const soundSetings = {
  on: localStorage.getItem('Tiny Yurtss') !== 'false',
};

export const initAudio = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  // Do we need to return it?...
  return audioContext;
};

export const playSound = (
  frequencyIndex,
  noteLength = 2,
  playbackRate = 1,
  // Makes the note not go on for as long, like it's pinging a tighter string
  pingyness = 1,
  volume = 1,
  // Most sound below this frequency (Hz) goes through
  lowpassFrequency = 10000,
  // Most sound above this frequency (Hz) goes through
  highpassFrequency = 100,
  noise = () => (2 * Math.random() - 1),
) => {
  if (!soundSetings.on) return;

  // Magic maths to get an index to line up with musical notes
  const frequency = 130.81 * 1.0595 ** frequencyIndex;
  const bufferData = [];
  const v = [];
  let p = 0;
  const period = sampleRate / frequency;
  let reset;

  const w = () => {
    reset = false;
    return v.length <= 1 + Math.floor(period)
      ? (v.push(noise()), v.at(-1))
      : (
        v[p] = (
          v[p >= v.length - 1 ? 0 : p + 1] * 0.5 + v[p] * (0.5 - (pingyness / 1000))
          // v[p >= v.length - 1 ? 0 : p + 1]
        ),
        p >= Math.floor(period) && (
          reset = true, v[p + 1] = (v[0] * 0.5 + v[p + 1] * 0.5)
        ),
        p = reset ? 0 : p + 1,
        v[p]
      );
  };

  for (
    let i = 0;
    i < sampleRate * noteLength;
    i++
  ) {
    bufferData[i] = i < 88
      ? (i / 88) * w()
      : (1 - (i - 88) / (sampleRate * noteLength)) * w();
  }

  const buffer = audioContext.createBuffer(1, sampleRate * noteLength, sampleRate);
  buffer.getChannelData(0).set(bufferData);

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = playbackRate;

  const lowpassNode = audioContext.createBiquadFilter();
  lowpassNode.type = 'lowpass';
  lowpassNode.frequency.value = lowpassFrequency;

  // Two low pass filters for more aggressive filtering,
  // without using many more bytes as they're identical
  const lowpassNode2 = audioContext.createBiquadFilter();
  lowpassNode2.type = 'lowpass';
  lowpassNode2.frequency.value = lowpassFrequency;

  const highpassNode = audioContext.createBiquadFilter();
  highpassNode.type = 'highpass';
  highpassNode.frequency.value = highpassFrequency;

  const volumeNode = audioContext.createGain();
  volumeNode.gain.value = volume;

  source.connect(lowpassNode);
  lowpassNode.connect(lowpassNode2);
  lowpassNode2.connect(highpassNode);
  highpassNode.connect(volumeNode);
  volumeNode.connect(audioContext.destination);
  source.start();
};

// Ox & Goat tunes are based off:
// Ravel's Ma mère l'oye (1910) III. Laideronnette, impératrice des pagodes
// https://en.wikipedia.org/wiki/File:Ravel_Ma_Mere_l%27Oye_Laideronnette_Imperatricedes_Pagodes_m.9-13.png

// [ frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass ]
const warnNotes = {
  [colors.ox]: {
    currentIndex: 0,
    notes: [
      [18, 0.5, 0.5, 30, 0.2, 1800, 200], // F#
      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#
      [13, 0.5, 0.5, 30, 0.2, 1800, 200], // C#
      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#

      [10, 0.5, 0.5, 30, 0.2, 1800, 200], // A#
      [18, 0.5, 0.5, 30, 0.2, 1800, 200], // F#
      [13, 0.5, 0.5, 30, 0.2, 1800, 200], // C#

      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#
      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#

      [18, 0.5, 0.5, 30, 0.2, 1800, 200], // F#
      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#
      [13, 0.5, 0.5, 30, 0.2, 1800, 200], // C#
      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#

      [10, 0.5, 0.5, 30, 0.2, 1800, 200], // A#
      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#
      [18, 0.5, 0.5, 30, 0.2, 1800, 200], // F#
      [13, 0.5, 0.5, 30, 0.2, 1800, 200], // C#

      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#
      [18, 0.5, 0.5, 30, 0.2, 1800, 200], // F#
      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#

      [13, 0.5, 0.5, 30, 0.2, 1800, 200], // C#
      [15, 0.5, 0.5, 30, 0.2, 1800, 200], // D#
      [10, 0.5, 0.5, 30, 0.2, 1800, 200], // A#
      [13, 0.5, 0.5, 30, 0.2, 1800, 200], // C#

      [ 8, 0.5, 0.5, 30, 0.2, 1800, 200], // G# (first one)
      [10, 0.5, 0.5, 30, 0.2, 1800, 200], // A#
      [ 5, 0.5, 0.5, 30, 0.2, 1800, 200], // E# (F)
      [ 8, 0.5, 0.5, 30, 0.2, 1800, 200], // G#
    ],
  },
  [colors.goat]: {
    currentIndex: 0,
    notes: [
      [30, 1, 1, 1, 0.2, 3000, 1000], // F#
      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D# 0.995 is annoying but repeated isn't too bad
      [25, 1, 1, 1, 0.2, 3000, 1000], // C#
      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#

      [22, 1, 1, 1, 0.2, 3000, 1000], // A#
      [30, 1, 1, 1, 0.2, 3000, 1000], // F#
      [25, 1, 1, 1, 0.2, 3000, 1000], // C#

      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#
      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#

      [30, 1, 1, 1, 0.2, 3000, 1000], // F#
      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#
      [25, 1, 1, 1, 0.2, 3000, 1000], // C#
      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#

      [22, 1, 1, 1, 0.2, 3000, 1000], // A#
      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#
      [30, 1, 1, 1, 0.2, 3000, 1000], // F#
      [25, 1, 1, 1, 0.2, 3000, 1000], // C#

      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#
      [30, 1, 1, 1, 0.2, 3000, 1000], // F#
      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#

      [25, 1, 1, 1, 0.2, 3000, 1000], // C#
      [27, 1, 0.995, 1, 0.2, 3000, 1000], // D#
      [22, 1, 1, 1, 0.2, 3000, 1000], // A#
      [25, 1, 1, 1, 0.2, 3000, 1000], // C#

      [20, 1, 1, 1, 0.2, 3000, 1000], // G# (first one)
      [22, 1, 1, 1, 0.2, 3000, 1000], // A#
      [17, 1, 1, 1, 0.2, 3000, 1000], // E# (i.e. F. Music is weird)
      [20, 1, 1, 1, 0.2, 3000, 1000], // G#
    ],
  },
  [colors.fish]: {
    currentIndex: 0,
    notes: [
      [70, 0.1, 0.05, 900, 1, 1000, 200],
      [73, 0.1, 0.05, 900, 1, 1000, 200],
      [68, 0.1, 0.05, 900, 1, 1000, 200],
      [70, 0.1, 0.05, 900, 1, 1000, 200],
      [70, 0.1, 0.05, 900, 1, 1000, 200],
      [73, 0.1, 0.05, 900, 1, 1000, 200],
      [68, 0.1, 0.05, 900, 1, 1000, 200],
    ],
  },
};

export const playPathPlacementNote = () => {
  if (audioContext) {
    // frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass
    playSound(1, 0.5, 1, 0, 1, 1000, 300, () => 2);
  }
};

export const playPathDeleteNote = () => {
  if (audioContext) {
    // frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass
    playSound(1, 0.5, 1, 0, 6, 800, 1500, () => 2);
  }
};

export const playTreeDeleteNote = () => {
  if (audioContext) {
    playSound(10, 0.1, 1, 1000, 0.2, 1500, 500, () => 2);
  }
};

export const playYurtSpawnNote = () => {
  if (audioContext) {
    playSound(39, 0.1, 0.25, 10, 0.2, 1000, 100); // E# (i.e. F. Music is weird)
  }
};

export const playOutOfPathsNote = () => {
  if (audioContext) {
    // frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass
    // playSound(18, 0.5, 0.25, 30, 0.2, 1800, 200);
    setTimeout(() => playSound(8, 0.5, 0.5, 40, 0.1, 1000, 100), 100);
    setTimeout(() => playSound(5, 0.5, 0.5, 20, 0.1, 1000, 100), 250);
  }
};

export const playWarnNote = (animalType) => {
  if (audioContext) {
    const notes = warnNotes[animalType];
    const noteInfo = notes.notes[notes.currentIndex];
    notes.currentIndex = (notes.currentIndex + 1) % notes.notes.length;
    playSound(...noteInfo);
    // const { currentIndex, notes } = warnNotes[animalType];
    // playSound(notes[currentIndex++]);
  }
};
