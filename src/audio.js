import { colors } from "./colors";

// This must only be called on user interaction. So probably on pressing a
// main menu button? But we don't want to re-do it er ever as well hrm
let audioContext;

// Sample rate in Hz. Could be fetched with audioContext.sampleRate, but writing
// out just the number will minify slightly better
const sampleRate = 44100;

export const soundSetings = {
  on: localStorage.getItem('Tiny Yurts s') === 'false' ? false : true,
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
    bufferData[i] = i < 8
      ? i / 8 * w()
      : (1 - (i - 8) / (sampleRate * noteLength)) * w();
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

// [ frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass ]
const warnNotes = {
  [colors.ox]: {
    currentIndex: 0,
    notes: [
      [6, 0.5, 0.5, 100, 1, 1000, 2000],
      // [3, 0.25, 0.5, 100, 0.5, 1000],
      // [4, 0.25, 0.5, 100, 0.5, 1000],
      // [1, 0.25, 0.5, 100, 0.5, 1000],
      // [2, 0.25, 0.5, 100, 0.5, 800],
      // [3, 0.25, 0.5, 100, 0.5, 800],
      // [1, 0.25, 0.5, 100, 0.5, 800],
      // [0, 0.25, 0.5, 100, 0.5, 800],
      // [2, 0.25, 0.5, 100, 0.5, 800],
      // [3, 0.25, 0.5, 100, 0.5, 800],
    ],
  },
  [colors.goat]: {
    currentIndex: 0,
    notes: [
      // Based off
      // https://en.wikipedia.org/wiki/File:Ravel_Ma_Mere_l%27Oye_Laideronnette_Imperatricedes_Pagodes_m.9-13.png
      [30, 1, 1, 1, 0.3, 3000, 1000], // F#
      [26, 1, 1, 1, 0.3, 3000, 1000], // D
      [25, 1, 1, 1, 0.3, 3000, 1000], // C#
      [26, 1, 1, 1, 0.3, 3000, 1000], // D

      [21, 1, 1, 1, 0.3, 3000, 1000], // A
      [30, 1, 1, 1, 0.3, 3000, 1000], // F#
      [25, 1, 1, 1, 0.3, 3000, 1000], // C#

      [26, 1, 1, 1, 0.3, 3000, 1000], // D
      [26, 1, 1, 1, 0.3, 3000, 1000], // D

      [30, 1, 1, 1, 0.3, 3000, 1000], // F#
      [26, 1, 1, 1, 0.3, 3000, 1000], // D
      [25, 1, 1, 1, 0.3, 3000, 1000], // C#
      [26, 1, 1, 1, 0.3, 3000, 1000], // D

      [21, 1, 1, 1, 0.3, 3000, 1000], // A
      [26, 1, 1, 1, 0.3, 3000, 1000], // D
      [30, 1, 1, 1, 0.3, 3000, 1000], // F#
      [25, 1, 1, 1, 0.3, 3000, 1000], // C#

      [26, 1, 1, 1, 0.3, 3000, 1000], // D
      [30, 1, 1, 1, 0.3, 3000, 1000], // F#
      [26, 1, 1, 1, 0.3, 3000, 1000], // D

      [25, 1, 1, 1, 0.3, 3000, 1000], // C#
      [26, 1, 1, 1, 0.3, 3000, 1000], // D
      [21, 1, 1, 1, 0.3, 3000, 1000], // A
      [25, 1, 1, 1, 0.3, 3000, 1000], // C#

      [20, 1, 1, 1, 0.3, 3000, 1000], // G# (first one)
      [21, 1, 1, 1, 0.3, 3000, 1000], // A
      [18, 1, 1, 1, 0.3, 3000, 1000], // F# (lower...down I don't know music)
      [20, 1, 1, 1, 0.3, 3000, 1000], // G#
    ],
  },
  [colors.fish]: {
    currentIndex: 0,
    notes: [
      [31],
      [32],
      [33],
      [34],
      [33],
      [32],
    ],
  },
};

export const playPathPlacementNote = () => {
  // frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass
  playSound(1, 0.5, 1, 0, 1, 1000, 300, () => 2);
};

export const playPathDeleteNote = () => {
  // frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass
  playSound(1, 0.5, 1, 0, 6, 1000, 1500, () => 2);
};

export const playWarnNote = (animalType) => {
  // console.log(warnNotes[animalType]);
  const noteInfo = warnNotes[animalType].notes[warnNotes[animalType].currentIndex];
  warnNotes[animalType].currentIndex = (warnNotes[animalType].currentIndex + 1) % warnNotes[animalType].notes.length;
  playSound(...noteInfo);
  // const { currentIndex, notes } = warnNotes[animalType];
  // playSound(notes[currentIndex++]);
};
