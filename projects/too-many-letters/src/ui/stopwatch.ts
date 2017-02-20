require('./stopwatch.css');

interface StopwatchConfig {
    timeLimit: number;
}

const CENTER = 60;
const MAXRADIUS = 55;
const RADIUS = 50;
const INNERRADIUS = 5;
const TICKLENGTH = 5;
const svgns = 'http://www.w3.org/2000/svg';

export class Stopwatch {
    private config: StopwatchConfig;

    element: SVGElement;

    private outer: SVGGElement;
    private needle: SVGGElement;

    private range: number;
    private cur: number;

    constructor(config: StopwatchConfig) {
        this.config = config;
        this.range = Math.ceil(this.config.timeLimit / 60) * 60;

        this.element = document.createElementNS(svgns, 'svg');
        this.element.setAttribute('width', `${CENTER*2}px`);
        this.element.setAttribute('height', `${CENTER*2}px`);
        this.element.setAttribute('viewBox', `0 0 ${CENTER*2} ${CENTER*2}`);
        this.element.setAttribute('class', 'stopwatch');

        this.outer = document.createElementNS(svgns, 'g');
        this.outer.setAttribute('class', 'stopwatch_outer');
        this.element.appendChild(this.outer);
        const outerCircle = document.createElementNS(svgns, 'circle');
        outerCircle.setAttribute('class', 'stopwatch_outer_circle');
        outerCircle.setAttribute('cx', `${CENTER}`);
        outerCircle.setAttribute('cy', `${CENTER}`);
        outerCircle.setAttribute('r', `${RADIUS}`);
        this.outer.appendChild(outerCircle);
        const warning = document.createElementNS(svgns, 'path');
        this.outer.appendChild(warning)
        warning.setAttribute('class', 'stopwatch_warning');
        {
            const angle = 5 * 2 * Math.PI / this.range;
            const s = Math.sin(angle);
            const c = Math.cos(angle);
            const r2 = RADIUS - TICKLENGTH;
            const r1 = r2 - TICKLENGTH;
            warning.setAttribute('d', ` M ${CENTER} ${CENTER-r1} L ${CENTER} ${CENTER-r2} A ${r2} ${r2} 0 0 1 ${CENTER+r2*s} ${CENTER-r2*c}`
            + ` L ${CENTER+r1*s} ${CENTER-r1*c} A ${r1} ${r1} 0 0 0 ${CENTER} ${CENTER-r1} Z`);
        }
        const ticks = document.createElementNS(svgns, 'path');
        this.outer.appendChild(ticks)
        ticks.setAttribute('class', 'stopwatch_ticks');
        {
            const r2 = RADIUS - 2;
            let ticksPath = '';
            for (let i = 0; i < this.range; i ++) {
                const r1 = r2 - TICKLENGTH - ((i % 5 == 0) ? TICKLENGTH : 0);
                const angle = i * 2 * Math.PI / this.range;
                const s = Math.sin(angle);
                const c = Math.cos(angle);
                ticksPath += ` M ${CENTER + r1*s} ${CENTER - r1*c} L ${CENTER + r2*s} ${CENTER - r2*c}`
            }
            ticks.setAttribute('d', ticksPath);
        }

        const innerCircle = document.createElementNS(svgns, 'circle');
        innerCircle.setAttribute('class', 'stopwatch_inner_circle');
        innerCircle.setAttribute('cx', `${CENTER}`);
        innerCircle.setAttribute('cy', `${CENTER}`);
        innerCircle.setAttribute('r', `${INNERRADIUS}`);
        this.element.appendChild(innerCircle);

        this.needle = document.createElementNS(svgns, 'path');
        this.needle.setAttribute('class', 'stopwatch_needle');
        this.needle.setAttribute('d', `M ${-INNERRADIUS/2} 0 L ${INNERRADIUS/2} 0 L 0 ${TICKLENGTH-RADIUS}`);
        this.needle.setAttribute('transform', `translate(${CENTER}, ${CENTER})`);
        this.element.appendChild(this.needle);
    }

    reset() {
        this.cur = 0;
        this.element.setAttribute('class', 'stopwatch');
        this.outer.setAttribute('transform', '');
        this.update(0);
    }

    update(elapsed: number) {
        const remain = Math.max(0, this.config.timeLimit - elapsed);
        const angle = remain * 2 * Math.PI / this.range;
        this.needle.setAttribute('transform', `translate(${CENTER}, ${CENTER}) rotate(${angle*180/Math.PI})`);
        if (remain == 0) {
            this.element.setAttribute('class', 'stopwatch stopwatch_done');
        } else if (remain <= 5) {
            if (Math.floor(this.cur) != Math.floor(elapsed)) {
                this.element.setAttribute('class', 'stopwatch stopwatch_urgent');
                this.outer.setAttribute('transform', `translate(${CENTER}, ${CENTER}) scale(${MAXRADIUS/RADIUS}) translate(${-CENTER}, ${-CENTER})`);
                setTimeout(() => {
                    this.element.setAttribute('class', 'stopwatch');
                    this.outer.setAttribute('transform', '');
                }, 200);
            }
        }
        this.cur = elapsed;
    }

    lose() {
        this.element.setAttribute('class', 'stopwatch stopwatch_lose');
        this.outer.setAttribute('transform', '');
    }

    win(elapsed: number) {
        this.update(elapsed);
        this.element.setAttribute('class', 'stopwatch stopwatch_win');
        this.outer.setAttribute('transform', '');
    }
}