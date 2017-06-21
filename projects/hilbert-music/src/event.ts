import { highlight as h1d, reset as r1d, restart as r1 } from './vis1d';
import { highlight as h2d, reset as r2d, restart as r2 } from './vis2d';
import { start, stop } from './audio';
import { getHertz } from './scale';
import { restart as hr, HILBERT1D_LENGTH } from './hilbert';

let lastD = null;

export function onOut() {
    if (lastD !== null) {
        for (const d of lastD) {
            r1d(d);
            r2d(d);
        }
    }
    stop();
    lastD = null;
}
export function onHover(d: number) {
    if (lastD !== null) {
        for (const d of lastD) {
            r1d(d);
            r2d(d);
        }
    }
    h1d(d);
    h2d(d);
    start([getHertz(d)]);
    lastD = [d];
}
window.fix = (d: number) => {
    h1d(d);
    h2d(d);
    start([getHertz(d)]);
}
// fix(Math.log2(261.626/261.626)*1024); fix(Math.log2(349.228/261.626)*1024); fix(Math.log2(440/261.626)*1024);
// fix(Math.log2(493.88/261.626)*1024); fix(Math.log2(349.228/261.626)*1024); fix(Math.log2(391.995/261.626)*1024);

export function onRestart(n) {
    hr(n);
    r1();
    r2();
}
export function onChord(vs: number[]) {
    let ds = [];
    for (const v of vs) {
        ds.push(Math.floor(v * HILBERT1D_LENGTH()));
    }
    let hz = [];
    for (const d of ds) {
        hz.push(getHertz(d));
        h1d(d);
        h2d(d);
    }
    lastD = ds;
    start(hz);
}