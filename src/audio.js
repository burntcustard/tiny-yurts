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

  const frequency = 130.81 * 1.0595 ** frequencyIndex;
  const bufferData = [];
  const v = [];
  let p = 0;
  const period = sampleRate / frequency;
  let reset;

  const w = () => {
    reset = false;
    return v.length <= 1 + ~~period
      ? (v.push(noise()), v.at(-1))
      : (
        v[p] = (
          v[p >= v.length - 1 ? 0 : p + 1] * 0.5 + v[p] * (0.5 - (pingyness / 1000))
          // v[p >= v.length - 1 ? 0 : p + 1]
        ),
        p >= ~~period && (
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
      ? i / 88 * w()
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

// [ frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass ]
const warnNotes = {
  [colors.ox]: {
    currentIndex: 0,
    notes: [
      [10, 0.13, 0.25, 400, 0.5, 600],
      [11, 0.13, 0.25, 400, 0.5, 600],
      [12, 0.13, 0.25, 400, 0.5, 600],
      [11, 0.13, 0.25, 400, 0.5, 600],
      [12, 0.13, 0.25, 400, 0.5, 600],
      [13, 0.13, 0.25, 400, 0.5, 600],
      [11, 0.13, 0.25, 400, 0.5, 600],
      [10, 0.13, 0.25, 400, 0.5, 600],
      [12, 0.13, 0.25, 400, 0.5, 600],
      [13, 0.13, 0.25, 400, 0.5, 600],
    ],
  },
  [colors.goat]: {
    currentIndex: 0,
    notes: [
      [20, 2, 2, 1, 0.4, 10000, 1000],
      [21, 2, 2, 1, 0.4, 10000, 1000],
      [22, 2, 2, 1, 0.4, 10000, 1000],
      [23, 2, 2, 1, 0.4, 10000, 1000],
      [24, 2, 2, 1, 0.4, 10000, 1000],
      [25, 2, 2, 1, 0.4, 10000, 1000],
      [26, 2, 2, 1, 0.4, 10000, 1000],
      [27, 2, 2, 1, 0.4, 10000, 1000],
      [28, 2, 2, 1, 0.4, 10000, 1000],
      [29, 2, 2, 1, 0.4, 10000, 1000],
    ],
  },
  [colors.fish]: {
    currentIndex: 0,
    notes: [
      [31],
      [32],
      [33],
      [34],
      [35],
      [36],
    ],
  },
};

export const playPathPlacementNote = () => {
  // frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass
  playSound(1, 0.5, 1, 1, 1, 1000, 300, () => 2);
};

export const playPathDeleteNote = () => {
  // frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass
  playSound(1, 0.5, 1, 1, 4, 1000, 1500, () => 2);
};

export const playWarnNote = (animalType) => {
  // console.log(warnNotes[animalType]);
  const noteInfo = warnNotes[animalType].notes[warnNotes[animalType].currentIndex];
  warnNotes[animalType].currentIndex = (warnNotes[animalType].currentIndex + 1) % warnNotes[animalType].notes.length;
  playSound(...noteInfo);
  // const { currentIndex, notes } = warnNotes[animalType];
  // playSound(notes[currentIndex++]);
};
