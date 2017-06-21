import { HILBERT1D_LENGTH } from './hilbert';

export function getHertz(d: number) {
    const p = d / HILBERT1D_LENGTH();
    return 261.626 * Math.pow(2, p);
}