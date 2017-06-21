let context: AudioContext;

const GAIN = 0.4;

const HARMONICS = [
    [1, 1],
    [2, 0.399],
    [3, 0.299],
    [4, 0.152],
    [5, 0.197],
    [6, 0.094],
    [7, 0.061],
    [8, 0.139],
    // [10, 0.071]
];

const oscillators: OscillatorNode[] = [];

export function start(hertz: number[]) {
    function setOscillator(index, freq, relAmp) {
        let oscillator;
        const newOsc = oscillators.length <= index;
        if (newOsc) {
            oscillator = context.createOscillator();
        } else {
            oscillator = oscillators[index];
        }
        oscillator.frequency.value = freq;
        if (newOsc) {
            var gain = context.createGain();
            gain.gain.value = 0.125 * GAIN * relAmp;
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillators.push(oscillator);
            oscillator.start();
        }
    }
    if (!context) {
        if (!('AudioContext' in window))
            return;
        context = new AudioContext();
    }
    let i = 0;
    for (const hz of hertz) {
        for (const h of HARMONICS) {
            setOscillator(i, hz * h[0], h[1]);
            i ++;
        }
    }
    while (i < oscillators.length) {
        oscillators.pop().stop();
    }
}

export function stop() {
    for (const n of oscillators) {
        n.stop();
    }
    oscillators.length = 0;
    if (context) {
        context.close();
        context = null;
    }
}