require('./score.css');

interface ScoreConfig {
}

export class Score {
    private config: ScoreConfig;

    element: HTMLDivElement;

    cur: number;
    from: number;
    to: number;
    interval: number;
    tickCount: number;

    constructor(config: ScoreConfig) {
        this.config = config;
        this.element = document.createElement('div');
        this.element.className = 'score';
    }

    reset() {
        this.element.innerHTML = '0';
        this.cur = 0;
    }

    tick() {
        this.tickCount ++;
        if (this.tickCount == 10) {
            this.cur = this.to;
            this.element.className = 'score';
            this.element.style.transform = '';
            clearInterval(this.interval);
            this.interval = 0;
        } else {
            this.cur = this.from + Math.floor((this.to - this.from) * this.tickCount / 10);
            const angle = [5, 0, -5, 0][this.tickCount & 3];
            this.element.style.transform = `rotate(${angle}deg)`;
        }
        this.element.innerHTML = String(this.cur);
    }

    update(score: number) {
        clearInterval(this.interval);
        this.interval = 0;
        this.to = score;
        this.from = this.cur;
        if (this.to > this.from) {
            this.element.className = 'score score_up';
        } else {
            this.element.className = 'score score_down';
        }
        this.tickCount = 0;
        this.interval = setInterval(() => this.tick(), 20);
    }
}