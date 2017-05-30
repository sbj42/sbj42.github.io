import 'babel-polyfill';
import * as BlockFractal from 'block-fractal';
import * as seedrandom from 'seedrandom';

const demo = document.getElementById('canvas') as HTMLCanvasElement;
const {width, height} = demo;
const context = demo.getContext('2d');

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

function generate(seed: string, iterations: number, variation: number) {
    return BlockFractal.makeBlockFractal({
        random: seedrandom.alea(seed),
        iterations,
        variation
    });
}

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

function render() {
    const iterations = getControlInteger('iterations', 0, 8, 6);
    const seed = getControl('seed');
    const variation = getControlInteger('variation', 0, 100, 60) / 100;
    const rast = generate(seed, iterations, variation).rasterize();

    const zoom = Math.pow(2, 7 - iterations);
    const maxSize = (Math.pow(2, iterations + 2) - 1) * zoom;
    const northWestShift = maxSize >>> 1;

    const centerX = width >>> 1;
    const centerY = height >>> 1;
    const westX = centerX - northWestShift;
    const northY = centerY - northWestShift;

    context.fillStyle = '#155786';
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#40fb06';
    for (let y = rast.northY; y <= rast.southY; y ++) {
        rast.bandsAt(y, (x1, x2) => {
            context.fillRect(westX + x1 * zoom + northWestShift, northY + y * zoom + northWestShift, (x2 - x1 + 1) * zoom, Math.max(1, zoom));
        });
    }
}

function newSeed() {
    const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const seed = a + ' ' + n + ' ' + Math.floor(Math.random() * 20 + 1);
    (document.getElementById('seed') as HTMLInputElement).value = seed;
    render();
}

newSeed();

const iterationsInput = (document.getElementById('iterations') as HTMLInputElement);
iterationsInput.onchange = render;
iterationsInput.oninput = render;
const variationInput = (document.getElementById('variation') as HTMLInputElement);
variationInput.onchange = render;
variationInput.oninput = render;
const seedInput = (document.getElementById('seed') as HTMLInputElement);
seedInput.onchange = render;
seedInput.oninput = render;
const newseedInput = (document.getElementById('newseed') as HTMLInputElement);
newseedInput.onclick = newSeed;