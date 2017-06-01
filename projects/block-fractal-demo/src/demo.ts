import 'babel-polyfill';
import * as BlockFractal from 'block-fractal';
import * as seedrandom from 'seedrandom';

const demo = document.getElementById('canvas') as HTMLCanvasElement;
const {width, height} = demo;
const context = demo.getContext('2d');

function getControl(id: string) {
    return (document.getElementById(id) as HTMLInputElement).value;
}

function getControlInteger(id: string, min: number, max: number, defaultValue: number) {
    const str = getControl(id);
    const int = parseInt(str, 10);
    if (Number.isFinite(int))
        return Math.max(min, Math.min(max, int));
    return defaultValue;
}

// let path: BlockFractal.Path;
let mask: BlockFractal.RasterMask;

let mult = 1;

function generate() {
    const iterations = getControlInteger('iterations', 0, 9, 7);
    const seed = getControl('seed');
    const variation = getControlInteger('variation', 0, 100, 60) / 100;
    const path = BlockFractal.makeBlockFractal({
        random: seedrandom.alea(seed),
        iterations,
        variation
    });
	mask = path.rasterize();
    //const maxSize = (Math.pow(2, iterations + 2) - 1) * zoom;
	mult = Math.pow(2, 7 - iterations);
	document.getElementById('label').innerText = seed;
}

let zoom = 1;
let centerX = 0;
let centerY = 0;

let target_zoom = 1;
let target_centerX = 0;
let target_centerY = 0;

function reset() {
	zoom = 0.5;
	target_zoom = 1;
	centerX = target_centerX = 0;
	centerY = target_centerY = 0;
}

const imageData = context.getImageData(0, 0, width, height);
function render() {
	if (document.hidden || typeof mask === 'undefined') {
		return;
	}
	const data = imageData.data;

	const halfHeight = height >>> 1;
	const halfWidth = width >>> 1;
	let index = 0;
    for (let sy = 0; sy < height; sy ++) {
		const my = Math.floor(centerY / mult + (sy - halfHeight) / zoom / mult);
		for (let sx = 0; sx < width; sx ++) {
			const mx = Math.floor(centerX / mult + (sx - halfWidth) / zoom / mult);
			if (mask.get(mx, my)) {
				data[index++] = 0x40;
				data[index++] = 0xfb;
				data[index++] = 0x06;
				data[index++] = 0xff;
			} else {
				data[index++] = 0x15;
				data[index++] = 0x57;
				data[index++] = 0x86;
				data[index++] = 0xff;
			}
		}
	}
	context.putImageData(imageData, 0, 0);
}

const ADJECTIVES = ['North', 'East', 'South', 'West', 'Upper', 'Lower', 'Middle', 'Far', 'Near', 'Great', 'High', 'Low',
	'Ancient', 'True', 'Superior', 'Greater', 'Lesser', 'Distant', 'Old', 'Ye Olde', 'New', 'Lost', 'Forgotten'];

const CONSONANT = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y',
    'Z', 'Br', 'Bl', 'By', 'Cr', 'Cl', 'Ch', 'Dr', 'Fr', 'Fl', 'Gr', 'Gl', 'Gh', 'G\'', 'Kr', 'Kl', 'Kh', 'Pr', 'Pl',
	'Ph', 'Py', 'Q\'', 'St', 'Scr', 'Sch', 'Sh', 'Sm', 'Sn', 'Sp', 'Spr', 'Sv', 'Sw', 'Th', 'Thr', 'T\'', 'Tw', 'Vr',
	'Wr'];

const VOWEL = ['A', 'E', 'I', 'O', 'U', 'A', 'E', 'I', 'O', 'U', 'A', 'E', 'I', 'O', 'U', 'Ae', 'Aeo', 'Ai', 'Ao',
    'Aou', 'Au', 'Ea', 'Ee', 'Ei', 'Eia', 'Eo', 'Eou', 'Ia', 'Iao', 'Ie', 'Io', 'Iou', 'Iu', 'Oa', 'Oau', 'Oe', 'Oi',
	'Oiu', 'Oo', 'Ou'];

const CSUFFIXES = ['shire', 'land', 'tis', 'fell', 'ness', 'sia', 'ria', 'delle', 'landia', 'dom', 'vania', 'ville',
    'ton', 'berg', 'ham', 'pico', 'stead', 'dero', 'lato', ];

const VSUFFIXES = ['ica', 'inor', 'eros', 'ilia', 'istan', 'edonia', 'uguay', 'onia', 'arnia', 'ing', 'onne', 'ine',
    'ovo', 'ovka', 'ique'];

function newSeed() {
	let name = '';
	if (Math.random() < 0.6) {
		if (name) {
			name += ' ';
		}
		name += ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
	}
	if (name) {
		name += ' ';
	}
	let length = Math.floor(Math.random() * 3 + 1);
	if (Math.random() < 0.25) {
		length ++;
	}
	let consonant = Math.random() < 0.5;
	for (let i = 0; i < length; i ++) {
		let next: string;
		if (consonant) {
			next = CONSONANT[Math.floor(Math.random() * CONSONANT.length)];
		} else {
			next = VOWEL[Math.floor(Math.random() * VOWEL.length)];
		}
		if (i > 0) {
			next = next.toLowerCase();
		}
		name += next;
		consonant = !consonant;
	}
	if (consonant) {
		name += CSUFFIXES[Math.floor(Math.random() * CSUFFIXES.length)];
	} else {
		name += VSUFFIXES[Math.floor(Math.random() * VSUFFIXES.length)];
	}
    (document.getElementById('seed') as HTMLInputElement).value = name;
    generate();
	reset();
}

newSeed();

const iterationsInput = (document.getElementById('iterations') as HTMLInputElement);
iterationsInput.onchange = generate;
iterationsInput.oninput = generate;
const variationInput = (document.getElementById('variation') as HTMLInputElement);
variationInput.onchange = generate;
variationInput.oninput = generate;
const seedInput = (document.getElementById('seed') as HTMLInputElement);
seedInput.onchange = generate;
seedInput.oninput = generate;
const newseedInput = (document.getElementById('newseed') as HTMLInputElement);
newseedInput.onclick = newSeed;

const PAN_SPEED = 45;
const ZOOM_SPEED = 1.15;

document.getElementById('zoomin').onclick = () => {
	target_zoom *= ZOOM_SPEED;
};
document.getElementById('zoomout').onclick = () => {
	target_zoom /= ZOOM_SPEED;
};

let mousePressed = false;
let mouseDragX: number;
let mouseDragY: number;
let mouseOver = false;

document.getElementById('demoinner').onmouseleave = () => {
	mouseOver = false;
};
document.getElementById('demoinner').onmousedown = (event: MouseEvent) => {
	mousePressed = true;
	mouseDragX = target_centerX + event.clientX / zoom;
	mouseDragY = target_centerY + event.clientY / zoom;
};
document.getElementById('demoinner').onmousemove = (event: MouseEvent) => {
	if (mousePressed == true) {
		centerX = target_centerX = mouseDragX - event.clientX / zoom;
		centerY = target_centerY = mouseDragY - event.clientY / zoom;
	}
	mouseOver = true;
};
document.onmouseup = (event: MouseEvent) => {
	mousePressed = false;
};
document.getElementById('demoinner').onmousewheel = (event: MouseWheelEvent) => {
	if (mouseOver) {
		const x = centerX + (event.offsetX - (width >>> 1)) / zoom;
		const y = centerY + (event.offsetY - (height >>> 1)) / zoom;
		target_zoom *= Math.pow(ZOOM_SPEED, event.wheelDelta / 120);
		target_centerX = x - (event.offsetX - (width >>> 1)) / target_zoom;
		target_centerY = y - (event.offsetY - (height >>> 1)) / target_zoom;
		event.preventDefault();
	}
};
document.onkeypress = (event: KeyboardEvent) => {
	if (document.getElementById('seed') == document.activeElement) {
		return;
	}
	switch (event.code) {
		case 'Digit0':
		case 'Numpad5':
			reset();
			break;
		case 'Numpad8':
			target_centerY -= PAN_SPEED / zoom;
			break;
		case 'Numpad2':
			target_centerY += PAN_SPEED / zoom;
			break;
		case 'Numpad4':
			target_centerX -= PAN_SPEED / zoom;
			break;
		case 'Numpad6':
			target_centerX += PAN_SPEED / zoom;
			break;
		case 'Equal':
		case 'NumpadAdd':
			target_zoom *= ZOOM_SPEED;
			break;
		case 'Minus':
		case 'NumpadSubtract':
			target_zoom /= ZOOM_SPEED;
			break;
	}
};
document.onkeydown = (event: KeyboardEvent) => {
	if (document.getElementById('seed') == document.activeElement) {
		return;
	}
	if (mouseOver) {
		switch (event.code) {
			case 'ArrowUp':
				target_centerY -= PAN_SPEED / zoom;
				event.preventDefault();
				break;
			case 'ArrowDown':
				target_centerY += PAN_SPEED / zoom;
				event.preventDefault();
				break;
			case 'ArrowLeft':
				target_centerX -= PAN_SPEED / zoom;
				event.preventDefault();
				break;
			case 'ArrowRight':
				target_centerX += PAN_SPEED / zoom;
				event.preventDefault();
				break;
		}
	}
};

function animate() {
	zoom = (zoom * 4 + target_zoom) / 5;
	centerX = (centerX * 4 + target_centerX) / 5;
	centerY = (centerY * 4 + target_centerY) / 5;
	render();
	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

document.addEventListener('visibilitychange', () => {
	console.info('hidden', document.hidden);
	if (document.hidden) {
		mask = undefined;
	} else {
		generate();
	}
})