import {
    HILBERT1D_LENGTH,
    HILBERT2D_WIDTH,
    conv1to2,
    conv2to1
} from './hilbert';
import { getColor } from './gradient';
import { onHover, onOut } from './event';

let VIS1D_ZOOM = 1;
let VIS1D_HEIGHT = 20;
let TICK_HEIGHT = 15;
let VIS1D_WIDTH = HILBERT1D_LENGTH() * VIS1D_ZOOM;
let context;

function vis1DColor(d: number, c: string) {
    const x = Math.floor(d * VIS1D_ZOOM);
    context.fillStyle = c;
    context.fillRect(x, 0, Math.max(1, VIS1D_ZOOM), VIS1D_HEIGHT);
}

export function restart() {
    VIS1D_ZOOM = 512 / HILBERT1D_LENGTH();
    VIS1D_HEIGHT = 20;
    TICK_HEIGHT = 15;
    VIS1D_WIDTH = HILBERT1D_LENGTH() * VIS1D_ZOOM;

    const vis1d = document.getElementById('vis1d');
    vis1d.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.width = VIS1D_WIDTH + 15;
    canvas.height = VIS1D_HEIGHT + TICK_HEIGHT;
    vis1d.appendChild(canvas);
    context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);


    for (let d = 0; d < HILBERT1D_LENGTH(); d ++) {
        vis1DColor(d, getColor(d));
    }
    const NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
    context.font = '14px sans-serif';
    context.fillStyle = '#000';
    for (let i = 0; i <= 12; i ++) {
        let x = Math.floor(i * VIS1D_ZOOM * HILBERT1D_LENGTH() / 12);
        if (i == 12) {
            x --;
        }
        context.fillRect(x, VIS1D_HEIGHT, 1, TICK_HEIGHT);
        context.fillText(NOTE[i], x + 2, canvas.height - 2);
    }

    canvas.addEventListener('mousemove', (event) => {
        const d = Math.floor(event.offsetX / VIS1D_ZOOM);
        if (d < HILBERT1D_LENGTH()) {
            onHover(d);
        }
    });
    canvas.addEventListener('mouseout', (event) => {
        onOut();
    });
}

export function reset(d: number) {
    vis1DColor(d, getColor(d));
}

export function highlight(d: number) {
    vis1DColor(d, 'yellow');
}