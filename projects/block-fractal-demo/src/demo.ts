import 'babel-polyfill';
import * as BlockFractal from 'block-fractal';
import * as seedrandom from 'seedrandom';

const demo = document.getElementById('canvas') as HTMLCanvasElement;
const demoInner = document.getElementById('demoinner');
const {width, height} = demo;
const context = demo.getContext('2d');

const iterationsInput = (document.getElementById('iterations') as HTMLInputElement);
const variationInput = (document.getElementById('variation') as HTMLInputElement);
const seedInput = (document.getElementById('seed') as HTMLInputElement);
const newseedInput = (document.getElementById('newseed') as HTMLInputElement);

function getControlInteger(elem: HTMLInputElement, min: number, max: number, defaultValue: number) {
    const str = elem.value;
    const int = parseInt(str, 10);
    if (Number.isFinite(int))
        return Math.max(min, Math.min(max, int));
    return defaultValue;
}

const DEFAULT_VARIATION = 60;
const DEFAULT_ITERATIONS = 7;
const MAX_VARIATION = 100;
const MAX_ITERATIONS = 9;

let iterations = DEFAULT_ITERATIONS;
let variation = DEFAULT_VARIATION;
let seed: string;
let hashSeed: string;
// let path: BlockFractal.Path;
let mask: BlockFractal.RasterMask;

let mult = 1;

function generate() {
    const thisIterations = getControlInteger(iterationsInput, 0, MAX_ITERATIONS, DEFAULT_ITERATIONS);
    const thisSeed = seedInput.value;
    const thisVariation = getControlInteger(variationInput, 0, MAX_VARIATION, DEFAULT_VARIATION);
	if (mask) {
		if (iterations === thisIterations && seed === thisSeed && variation === thisVariation) {
			return;
		}
	}
    iterations = thisIterations;
    seed = thisSeed;
    variation = thisVariation;
    const path = BlockFractal.makeBlockFractal({
        random: seedrandom.alea(seed),
        iterations,
        variation: variation / 100
    });
	mask = path.rasterize();
    //const maxSize = (Math.pow(2, iterations + 2) - 1) * zoom;
	mult = Math.pow(2, 7 - iterations);
	document.getElementById('label').innerText = seed;
	let newHash = `#${encodeURIComponent(seed)}`;
	if (variation != DEFAULT_VARIATION) {
		newHash += `/v=${variation}`;
	}
	if (hashSeed !== seed) {
		window.location.hash = newHash;
		hashSeed = seed;
	} else {
		window.location.replace(newHash);
	}
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
    seedInput.value = name;
    generate();
	reset();
}

function hashChange() {
	const hash = location.hash;
	if (hash.length > 1) {
		const firstSlash = hash.indexOf('/');
		const newSeed = decodeURIComponent(hash.substr(1, firstSlash < 0 ? hash.length : firstSlash - 1));
		let newVariation = DEFAULT_VARIATION;
		let newIterations = DEFAULT_ITERATIONS;
		if (firstSlash >= 0) {
			for (const arg of hash.substr(firstSlash + 1).split('/')) {
				if (arg.startsWith('v=')) {
					newVariation = parseInt(arg.substr(2));
					if (isNaN(newVariation) || newVariation < 0 || newVariation > MAX_VARIATION) {
						newVariation = DEFAULT_VARIATION
					}
				} else if (arg.startsWith('i=')) {
					newIterations = parseInt(arg.substr(2));
					if (isNaN(newIterations) || newIterations < 0 || newIterations > MAX_ITERATIONS) {
						newIterations = DEFAULT_ITERATIONS
					}
				}
			}
		}
		if (newSeed !== seed) {
			hashSeed = newSeed;
			seedInput.value = newSeed;
			variationInput.value = String(newVariation);
			iterationsInput.value = String(newIterations);
			generate();
		}
	}
}

if (location.hash.length > 1) {
	hashChange();
} else {
	newSeed();
}

iterationsInput.onchange = generate;
iterationsInput.oninput = generate;
variationInput.onchange = generate;
variationInput.oninput = generate;
seedInput.onchange = generate;
seedInput.oninput = generate;
newseedInput.onclick = newSeed;

window.onhashchange = hashChange;

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

demoInner.onmouseleave = () => {
	mouseOver = false;
};
demoInner.onmousedown = (event: MouseEvent) => {
	mousePressed = true;
	mouseDragX = target_centerX + event.clientX / zoom;
	mouseDragY = target_centerY + event.clientY / zoom;
};
demoInner.onmousemove = (event: MouseEvent) => {
	if (mousePressed == true) {
		centerX = target_centerX = mouseDragX - event.clientX / zoom;
		centerY = target_centerY = mouseDragY - event.clientY / zoom;
	}
	mouseOver = true;
};
document.onmouseup = (event: MouseEvent) => {
	mousePressed = false;
};
demoInner.onmousewheel = (event: MouseWheelEvent) => {
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