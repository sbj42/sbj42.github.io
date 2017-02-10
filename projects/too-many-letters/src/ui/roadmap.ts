require('./roadmap.css');

export interface RoadmapStop {
    time: number;
}

interface RoadmapConfig {
    stops: RoadmapStop[];
}

const CENTER = 15;
const PADDING = 2;
const ACTIVERADIUS = 14;
const INACTIVERADIUS = 7;
const svgns = 'http://www.w3.org/2000/svg';

export class Roadmap {
    private config: RoadmapConfig;

    element: HTMLElement;
    stopElements: SVGElement[];
    stopCircles: SVGCircleElement[];
    stopPaths: SVGPathElement[];
    at: number;

    constructor(config: RoadmapConfig) {
        this.config = config;

        this.element = document.createElement('div');
        this.element.setAttribute('class', 'roadmap');

        this.stopElements = [];
        this.stopCircles = [];
        this.stopPaths = [];

        this.config.stops.forEach((stop, index) => {
            const stopElement = document.createElementNS(svgns, 'svg');
            stopElement.setAttribute('width', `${CENTER*2}px`);
            stopElement.setAttribute('height', `${CENTER*2}px`);
            stopElement.setAttribute('viewBox', `0 0 ${CENTER*2} ${CENTER*2}`);
            stopElement.setAttribute('class', 'roadmap_stop');
            
            const circle = document.createElementNS(svgns, 'circle');
            circle.setAttribute('class', 'roadmap_stop_circle');
            circle.setAttribute('cx', `${CENTER}`);
            circle.setAttribute('cy', `${CENTER}`);
            stopElement.appendChild(circle);
            this.stopCircles.push(circle);
            
            const path = document.createElementNS(svgns, 'path');
            path.setAttribute('class', 'roadmap_stop_path');
            stopElement.appendChild(path);
            this.stopPaths.push(path);

            this.stopElements.push(stopElement);
            this.element.appendChild(stopElement);
        });
    }

    reset() {
        this.at = 0;
        this.stopElements.forEach((stopElement, index) => {
            stopElement.setAttribute('style', `top: ${(CENTER*2 + PADDING) * index}px;`);
            this.stopCircles[index].setAttribute('r', `${index == this.at ? ACTIVERADIUS : INACTIVERADIUS}`);
        });
        this.stopPaths[this.at].setAttribute('d', `M ${CENTER} ${CENTER} L ${CENTER} ${CENTER-ACTIVERADIUS} A ${ACTIVERADIUS} ${ACTIVERADIUS} 0 1 1 ${CENTER} ${CENTER-ACTIVERADIUS} Z`);
        this.update(0);
    }

    next() {
        this.stopElements[this.at].setAttribute('style', 'opacity: 0');
        this.at ++;
        this.stopElements.forEach((stopElement, index) => {
            stopElement.setAttribute('style', `top: ${(CENTER*2 + PADDING) * (index - this.at)}px; opacity: ${index < this.at ? 0 : 1};`);
            this.stopCircles[index].setAttribute('r', `${index <= this.at ? ACTIVERADIUS : INACTIVERADIUS}`);
            this.stopPaths[index].setAttribute('d', '');
        });
    }

    update(remain: number) {
        if (this.at >= this.config.stops.length)
            return;
        let stopTime = this.config.stops[this.at].time;
        const angle = remain * 2 * Math.PI / stopTime;
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        this.stopPaths[this.at].setAttribute('d', `M ${CENTER} ${CENTER} L ${CENTER} ${CENTER-ACTIVERADIUS} A ${ACTIVERADIUS} ${ACTIVERADIUS} 0 ${angle>Math.PI?1:0} 1 ${CENTER+ACTIVERADIUS*s} ${CENTER-ACTIVERADIUS*c} Z`);
    }

    lose() {
    }

    win() {
    }
}