import { HILBERT1D_LENGTH } from './hilbert';

export function getColor(d: number) {
    const p = d / HILBERT1D_LENGTH();
    const p1 = Math.min(1, Math.max(0, 1 - p * 1.5));
    const p2 = Math.min(1, Math.max(0, 1 - Math.abs(p - 0.5) * 3));
    const p3 = Math.min(1, Math.max(0, 1 - (1 - p) * 1.5));
    const color1 = Math.floor(p1 * 255);
    const color2 = Math.floor(p2 * 255);
    const color3 = Math.floor(p3 * 255);
    return `rgb(${color1}, ${color2}, ${color3})`;
}