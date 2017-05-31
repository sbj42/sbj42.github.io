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
}

let zoom = 1;
let centerX = 0;
let centerY = 0;

let target_zoom = 1;
let target_centerX = 0;
let target_centerY = 0;

function reset() {
	zoom = target_zoom = 1;
	centerX = target_centerX = 0;
	centerY = target_centerY = 0;
}

function render() {
	const imageData = context.getImageData(0, 0, width, height);
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

const ADJECTIVES = [
	'other', 'new', 'good', 'high',
	'old', 'great', 'big', 'American',
	'small', 'large', 'national', 'young',
	'different', 'black', 'long', 'little',
	'important', 'political', 'bad', 'white',
	'real', 'best', 'right', 'social',
	'only', 'public', 'sure', 'low',
	'early', 'able', 'human', 'local',
	'late', 'hard', 'major', 'better',
	'economic', 'strong', 'possible', 'whole',
	'free', 'military', 'true', 'federal',
	'international', 'full', 'special', 'easy',
	'clear', 'recent', 'certain', 'personal',
	'open', 'red', 'difficult', 'available',
	'likely', 'short', 'single', 'medical',
	'current', 'wrong', 'private', 'past',
	'foreign', 'fine', 'common', 'poor',
	'natural', 'significant', 'similar', 'hot',
	'dead', 'central', 'happy', 'serious',
	'ready', 'simple', 'left', 'physical',
	'general', 'environmental', 'financial', 'blue',
	'democratic', 'dark', 'various', 'entire',
	'close', 'legal', 'religious', 'cold',
	'final', 'main', 'green', 'nice',
	'huge', 'popular', 'traditional', 'cultural',
];

const NOUNS = [
	'time', 'year', 'people', 'way',
	'day', 'man', 'thing', 'woman',
	'life', 'child', 'world', 'school',
	'state', 'family', 'student', 'group',
	'country', 'problem', 'hand', 'part',
	'place', 'case', 'week', 'company',
	'system', 'program', 'question', 'work',
	'government', 'number', 'night', 'point',
	'home', 'water', 'room', 'mother',
	'area', 'money', 'story', 'fact',
	'month', 'lot', 'right', 'study',
	'book', 'eye', 'job', 'word',
	'business', 'issue', 'side', 'kind',
	'head', 'house', 'service', 'friend',
	'father', 'power', 'hour', 'game',
	'line', 'end', 'member', 'law',
	'car', 'city', 'community', 'name',
	'president', 'team', 'minute', 'idea',
	'kid', 'body', 'information', 'back',
	'parent', 'face', 'others', 'level',
	'office', 'door', 'health', 'person',
	'art', 'war', 'history', 'party',
	'result', 'change', 'morning', 'reason',
	'research', 'girl', 'guy', 'moment',
	'air', 'teacher', 'force', 'education',
];

function newSeed() {
    const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const seed = a + ' ' + n + ' ' + Math.floor(Math.random() * 20 + 1);
    (document.getElementById('seed') as HTMLInputElement).value = seed;
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