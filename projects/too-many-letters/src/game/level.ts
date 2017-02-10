import {Scenerator, Scene} from '../scene/gen';
import {Thingerator, Thing} from '../thing/gen';
import {Stopwatch} from '../ui/stopwatch';
import {Roadmap, RoadmapStop} from '../ui/roadmap';
import {Worderator} from '../word/gen';
import {WIDTH, HEIGHT} from '../constants';

const INTERVAL = 0.1;
const KILL_DELAY = 0.8;

const SCORE_KILL = 100;
const SCORE_MISTAKE = -110;
const SCORE_BONUS = 1000;

export interface LevelConfig {
    scenerator: Scenerator;
    thingerator: Thingerator;
    worderator: Worderator;

    startWordCount: number;
    extraWordCount?: number;
    extraWordRate?: number;
    extraWordTimes?: number;
    timeLimit: number;
    caseSensitive?: boolean;
    punishment?: number;
}

export class Level {
    private config: LevelConfig;

    private interval: any;

    private startTime: number;
    private mistakes: number;
    private extraCount: number;
    private extraTime: number;
    
    private scene: Scene;
    private nextThings: Thing[];
    private things: Thing[];

    private stopwatch: Stopwatch;
    private roadmap: Roadmap;

    private keys: string;
    private score: number;

    constructor(config: LevelConfig) {
        this.config = {
            extraWordCount: 1,
            caseSensitive: false,
            ...config
        };
        if (typeof this.config.extraWordRate == 'undefined' && this.config.extraWordTimes) {
            this.config.extraWordRate = this.config.timeLimit * 0.5 / this.config.extraWordTimes;
        }
        if (this.config.extraWordRate && this.config.extraWordTimes && this.config.extraWordRate * (this.config.extraWordTimes + 1) > this.config.timeLimit)
            throw new Error('impossible extra words');

        this.stopwatch = new Stopwatch({
            timeLimit: config.timeLimit
        });
        const stops: RoadmapStop[] = [];
        for (let i = 0; i < this.config.extraWordTimes; i ++) {
            stops.push({
                time: this.config.extraWordRate || 1
            });
        }
        this.roadmap = new Roadmap({
            stops
        });
    }

    private now() {
        return new Date().getTime() / 1000;
    }

    start() {
        const uiDiv = document.getElementById('ui');
        if (!uiDiv) throw new Error('no ui');
        uiDiv.innerHTML = '';
        uiDiv.appendChild(this.stopwatch.element);
        this.stopwatch.reset();
        uiDiv.appendChild(this.roadmap.element);
        this.roadmap.reset();
        this.scene = this.config.scenerator.generate({});
        this.startTime = this.now();
        this.mistakes = 0;
        this.extraCount = this.config.extraWordTimes || 0;
        if (this.extraCount && this.config.extraWordRate) {
            this.extraTime = this.config.extraWordRate;
        }
        this.nextThings = [];
        this.things = [];
        this.keys = '';
        this.score = 0;
        this.generate(this.config.startWordCount);
        clearInterval(this.interval);
        this.interval = setInterval(() => this.tick(), INTERVAL * 1000);
    }

    activate() {
        this.scene.activate();
    }

    private generate(howMany: number): number {
        let total = 0;
        while (howMany > 0) {
            const word = this.config.worderator.generate({});
            const thing = this.config.thingerator.generate({
                word,
            });
            this.nextThings.push(thing);
            howMany --;
            total += word.text.length;
        }
        return total;
    }

    private place() {
        for (let i = 0; i < this.nextThings.length; i ++) {
            const thing = this.nextThings[i];
            const bounds = thing.sprite.bounds();
            thing.sprite.setTopLeft([Math.random() * (WIDTH - bounds.width), -bounds.height]);
            if (this.scene.world.checkOverlap(thing.sprite))
                continue;
            this.scene.addThing(thing);
            this.nextThings.splice(i, 1);
            this.things.push(thing);
            i --;
        }
    }

    private tick() {
        const elapsed = this.now() - this.startTime;
        this.stopwatch.update(elapsed);
        if (this.extraCount) {
            this.roadmap.update(this.extraTime - elapsed);
            if (elapsed > this.extraTime) {
                this.extraTime += this.config.extraWordRate;
                this.extraCount --;
                this.generate(this.config.extraWordCount || 1);
                this.roadmap.next();
                this.roadmap.update(this.extraTime - elapsed);
            }
        }
        if (elapsed > this.config.timeLimit) {
            this.lose();
        }
        this.place();
    }

    onKey(key: string) {
        this.keys += key;
        const killed = this.things.find(thing => {
            if (this.config.caseSensitive)
                return thing.word.text == this.keys;
            else
                return thing.word.text.toLowerCase() == this.keys.toLowerCase();
        });
        if (killed) {
            this.kill(killed);
            return;
        }
        const hit = this.things.filter(thing => {
            let hit;
            if (this.config.caseSensitive)
                hit = thing.word.text.startsWith(this.keys);
            else
                hit = thing.word.text.toLowerCase().startsWith(this.keys.toLowerCase());
            if (hit) {
                thing.hit(this.keys.length);
            } else {
                thing.hit(0);
            }
            return hit;
        });
        if (!hit.length) {
            this.mistake();
            return;
        }
    }

    private kill(thing: Thing) {
        this.score += SCORE_KILL * thing.word.text.length;
        thing.die();
        this.things = this.things.filter(t => t != thing);
        this.things.forEach(thing => thing.hit(0));
        setTimeout(() => this.scene.removeThing(thing), KILL_DELAY * 1000);
        this.keys = '';
        if (this.things.length == 0 && this.nextThings.length == 0) {
            if (this.extraCount) {
                this.score += SCORE_BONUS;
                this.extraTime = this.now() - this.startTime;
            } else {
                this.win();
            }
        }
    }

    private mistake() {
        this.keys = '';
        this.mistakes ++;
        this.score += SCORE_MISTAKE * this.generate(this.config.punishment || 1);
    }

    private win() {
        this.stopwatch.win();
        clearInterval(this.interval);
        console.info('win: ' + this.score);
    }

    private lose() {
        this.stopwatch.lose();
        clearInterval(this.interval);
        console.info('lose: ' + this.score);
    }
}