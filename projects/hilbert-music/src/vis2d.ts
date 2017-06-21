import {
    HILBERT1D_LENGTH,
    HILBERT2D_WIDTH,
    HILBERT_ITERATIONS,
    conv1to2,
    conv2to1
} from './hilbert';
import { getColor } from './gradient';
import { onHover, onOut } from './event';

let VIS2D_ZOOM = 8;
let VIS2D_WIDTH = HILBERT2D_WIDTH() * VIS2D_ZOOM;
let context;

function vis2DColor(x: number, y: number, c: string) {
    context.fillStyle = c;
    context.fillRect(x * VIS2D_ZOOM, y * VIS2D_ZOOM, VIS2D_ZOOM, VIS2D_ZOOM);
}
function vis2DLine(d: number) {
    context.strokeStyle = '#000';
    context.beginPath();
    if (d > 0) {
        const [x, y] = conv1to2(d - 1);
        context.moveTo(x * VIS2D_ZOOM + VIS2D_ZOOM/2, y * VIS2D_ZOOM + VIS2D_ZOOM/2);
        const [x2, y2] = conv1to2(d);
        context.lineTo(x2 * VIS2D_ZOOM + VIS2D_ZOOM/2, y2 * VIS2D_ZOOM + VIS2D_ZOOM/2);
        if (d < HILBERT1D_LENGTH() - 1) {
            const [x3, y3] = conv1to2(d + 1);
            context.lineTo(x3 * VIS2D_ZOOM + VIS2D_ZOOM/2, y3 * VIS2D_ZOOM + VIS2D_ZOOM/2);
        }
    } else {
        const [x, y] = conv1to2(d);
        context.moveTo(x * VIS2D_ZOOM + VIS2D_ZOOM/2, y * VIS2D_ZOOM + VIS2D_ZOOM/2);
        const [x2, y2] = conv1to2(d + 1);
        context.lineTo(x2 * VIS2D_ZOOM + VIS2D_ZOOM/2, y2 * VIS2D_ZOOM + VIS2D_ZOOM/2);
    }
    context.stroke();
}
function vis2DCircle(d: number) {
    context.fillStyle = '#fff';
    const [x, y] = conv1to2(d);
    context.fillRect(x * VIS2D_ZOOM + VIS2D_ZOOM/4, y * VIS2D_ZOOM + VIS2D_ZOOM/4, VIS2D_ZOOM/2, VIS2D_ZOOM/2);
}
function recircle() {
    for (let i = 0; i <= 12; i ++) {
        if (i == 12) {
            vis2DCircle(Math.floor(i * HILBERT1D_LENGTH() / 12) - 1);
        } else {
            vis2DCircle(Math.floor(i * HILBERT1D_LENGTH() / 12));
        }
    }
}

export function restart() {
    VIS2D_ZOOM = Math.floor(16 / Math.pow(2, HILBERT_ITERATIONS() - 5));
    VIS2D_WIDTH = HILBERT2D_WIDTH() * VIS2D_ZOOM;

    const vis2d = document.getElementById('vis2d');
    vis2d.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.width = VIS2D_WIDTH;
    canvas.height = VIS2D_WIDTH;
    vis2d.appendChild(canvas);
    context = canvas.getContext('2d');

    for (let d = 0; d < HILBERT1D_LENGTH(); d ++) {
        const [x, y] = conv1to2(d);
        vis2DColor(x, y, getColor(d));
    }
    for (let d = 0; d < HILBERT1D_LENGTH(); d ++) {
        vis2DLine(d);
    }
    recircle();

    canvas.addEventListener('mousemove', (event) => {
        const x = Math.floor(event.offsetX / VIS2D_ZOOM);
        const y = Math.floor(event.offsetY / VIS2D_ZOOM);
        onHover(conv2to1(x, y));
    });
    canvas.addEventListener('mouseout', (event) => {
        onOut();
    });
}

export function reset(d: number) {
    const [x, y] = conv1to2(d);
    vis2DColor(x, y, getColor(d));
    vis2DLine(d);
    recircle();
}

export function highlight(d: number) {
    const [x, y] = conv1to2(d);
    vis2DColor(x, y, 'yellow');
}