let iterations = 5;
let width2d = Math.pow(2, iterations);
let length1d = Math.pow(width2d, 2);

export function HILBERT_ITERATIONS() {
    return iterations;
}
export function HILBERT2D_WIDTH() {
    return width2d;
}
export function HILBERT1D_LENGTH() {
    return length1d;
}

export function restart(i: number) {
    iterations = i;
    width2d = Math.pow(2, iterations);
    length1d = Math.pow(width2d, 2);
}

function rot(n: number, x: number, y: number, rx: number, ry: number) {
    if (ry === 0) {
        if (rx === 1) {
            x = n - 1 - x;
            y = n - 1 - y;
        }
        const t = x;
        x = y;
        y = t;
    }
    return [x, y];
}

function xy2d(n: number, x: number, y: number) {
    let d = 0;
    for (let s = Math.floor(n / 2); s > 0; s = Math.floor(s / 2)) {
        const rx = (x & s) > 0 ? 1 : 0;
        const ry = (y & s) > 0 ? 1 : 0;
        d += s * s * ((3 * rx) ^ ry);
        [x, y] = rot(s, x, y, rx, ry);
    }
    return d;
}

function d2xy(n: number, d: number) {
    let t = d;
    let x = 0;
    let y = 0;
    for (let s = 1; s < n; s *= 2) {
        const rx = 1 & Math.floor(t / 2);
        const ry = 1 & (t ^ rx);
        [x, y] = rot(s, x, y, rx, ry);
        x += s * rx;
        y += s * ry;
        t /= 4;
    }
    return [x, y];
}

export function conv2to1(x: number, y: number) {
    return xy2d(width2d, x, y);
}

export function conv1to2(d: number) {
    return d2xy(width2d, d);
}