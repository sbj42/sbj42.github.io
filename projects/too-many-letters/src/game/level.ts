import {Scenerator, Scene} from '../scene/gen';
import {Thingerator, Thing} from '../thing/gen';
import {Stopwatch} from '../ui/stopwatch';
import {Roadmap, RoadmapStop} from '../ui/roadmap';
import {Door} from '../ui/door';
import {Score} from '../ui/score';
import {Worderator} from '../word/gen';
import {WIDTH, HEIGHT} from '../constants';
import * as audio from './audio';

const INTERVAL = 0.1;
const KILL_DELAY = 0.8;
const MISTAKE_DELAY = 0.75;

const SCORE_KILL = 100;
const SCORE_MISTAKE = -110;
const SCORE_EMPTYBONUS = 100;
const SCORE_TIMEBONUS = 50;

export interface LevelConfig {
    scenerator: Scenerator;
    thingerator: Thingerator;
    worderator: Worderator;

    startWordCount: number;
    extraWordRate?: number;
    extraWords?: number[];
    timeLimit: number;
    caseSensitive?: boolean;
    punishment?: number;
}

export class Level {
    private config: LevelConfig;

    private interval: any;

    private signText: string;

    private startTime: number;
    private mistakes: number;
    private extraWords: number[];
    private extraCount: number;
    private extraTime: number;
    private mistakeTime: number;
    private winTime: number;
    
    private door?: Door;
    private scene: Scene;
    private nextThings: Thing[];
    private things: Thing[];

    private stopwatchUI: Stopwatch;
    private roadmapUI: Roadmap;
    private scoreUI: Score;

    private keys: string;
    private score: number;
    private over: boolean;

    constructor(config: LevelConfig) {
        this.config = {
            caseSensitive: false,
            ...config
        };
        this.extraWords = this.config.extraWords || [];
        if (typeof this.config.extraWordRate == 'undefined' && this.extraWords.length) {
            this.config.extraWordRate = this.config.timeLimit * 0.5 / this.extraWords.length;
        }
        if (this.config.extraWordRate && this.extraWords.length && this.config.extraWordRate * (this.extraWords.length + 1) > this.config.timeLimit)
            throw new Error('impossible extra words');

        this.stopwatchUI = new Stopwatch({
            timeLimit: config.timeLimit
        });
        const stops = this.extraWords.map(() => ({
            time: this.config.extraWordRate || 1
        }));
        this.roadmapUI = new Roadmap({
            stops
        });
        this.scoreUI = new Score({
        });
        const thingSignText = this.config.thingerator.signText();
        const sceneSignText = this.config.scenerator.signText();
        this.signText = thingSignText[0] + ' ' + thingSignText[1] + ' ' + sceneSignText + '.';
    }

    private now() {
        return new Date().getTime() / 1000;
    }

    start() {
        this.door = new Door({
            signText: this.signText,
        });
        const uiDiv = document.getElementById('ui');
        if (!uiDiv) throw new Error('no ui');
        uiDiv.innerHTML = '';
        uiDiv.appendChild(this.stopwatchUI.element);
        this.stopwatchUI.reset();
        uiDiv.appendChild(this.roadmapUI.element);
        this.roadmapUI.reset();
        uiDiv.appendChild(this.scoreUI.element);
        this.scoreUI.reset();
        this.scene = this.config.scenerator.generate({});
        this.mistakes = 0;
        this.mistakeTime = 0;
        this.extraCount = this.extraWords.length;
        if (this.extraCount && this.config.extraWordRate) {
            this.extraTime = this.config.extraWordRate;
        }
        this.nextThings = [];
        this.things = [];
        this.keys = '';
        this.score = 0;
        this.over = false;
        this.generate(this.config.startWordCount);
    }

    start2() {
        clearInterval(this.interval);
        this.startTime = this.now();
        this.interval = setInterval(() => this.tick(), INTERVAL * 1000);
    }

    activate() {
        this.scene.activate();
    }


    private generate(howMany: number): number {
        let total = 0;
        const words: {[word: string]: boolean} = {};
        this.things.forEach(t => words[t.word.text] = true);
        this.nextThings.forEach(t => words[t.word.text] = true);
        while (howMany > 0) {
            let word;
            for (let i = 0; i < 8; i ++) {
                word = this.config.worderator.generate({});
                if (!words[word.text])
                    break;
            }
            if (!word) throw new Error('no word');
            words[word.text] = true;
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
            if (this.things.find(t => t.word.text == thing.word.text))
            continue;
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
        this.stopwatchUI.update(elapsed);
        if (this.extraCount) {
            this.roadmapUI.update(this.extraTime - elapsed);
            if (elapsed > this.extraTime) {
                if (typeof this.config.extraWordRate !== 'undefined') {
                    this.extraTime += this.config.extraWordRate;
                }
                this.generate(this.extraWords[this.extraWords.length - this.extraCount]);
                this.extraCount --;
                this.roadmapUI.next();
                this.roadmapUI.update(this.extraTime - elapsed);
            }
        }
        if (elapsed > this.config.timeLimit) {
            this.lose();
        }
        this.place();
    }

    onKey(key: string) {
        if (this.over)
            return;
        if (this.door) {
            this.door.open(() => this.start2());
            delete this.door;
            return;
        }
        this.keys += key;
        const killed = this.things.find(thing => {
            if (this.config.caseSensitive)
                return thing.word.text == this.keys;
            else
                return thing.word.text.toLowerCase() == this.keys.toLowerCase();
        });
        if (killed) {
            this.mistakeTime = 0;
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
        } else
            this.mistakeTime = 0;
    }

    private kill(thing: Thing) {
        audio.playDing();
        this.score += SCORE_KILL * thing.word.text.length;
        this.scoreUI.update(this.score);
        thing.die();
        this.things = this.things.filter(t => t != thing);
        this.things.forEach(thing => thing.hit(0));
        setTimeout(() => this.scene.removeThing(thing), KILL_DELAY * 1000);
        this.keys = '';
        if (this.things.length == 0 && this.nextThings.length == 0) {
            if (this.extraCount) {
                this.score += SCORE_EMPTYBONUS;
                this.scoreUI.update(this.score);
                this.extraTime = this.now() - this.startTime;
            } else {
                this.win();
            }
        }
    }

    private mistake() {
        const now = this.now();
        if (this.mistakeTime > 0 && now < this.mistakeTime)
            return;
        const sceneDiv = document.getElementById('scene');
        if (!sceneDiv) throw new Error('no scene');
        sceneDiv.style.filter = 'grayscale(0.8)';
        setTimeout(() => sceneDiv.style.filter = '', 1000 * MISTAKE_DELAY);
        this.mistakeTime = now + MISTAKE_DELAY;
        audio.playBuzz();
        this.keys = '';
        this.mistakes ++;
        this.score += SCORE_MISTAKE * this.generate(this.config.punishment || 1);
        this.scoreUI.update(this.score);
    }

    private win() {
        const elapsed = this.now() - this.startTime;
        this.winTime = Math.floor(this.config.timeLimit - elapsed);
        this.over = true;
        this.stopwatchUI.win(elapsed);
        clearInterval(this.interval);
        this.interval = setInterval(() => this.winning(), 100);
    }

    private winning() {
        this.winTime --;
        this.score += SCORE_TIMEBONUS;
        this.scoreUI.update(this.score);
        const elapsed = this.config.timeLimit - this.winTime;
        this.stopwatchUI.win(elapsed);
        if (this.winTime == 0) {
            const uiDiv = document.getElementById('ui');
            if (!uiDiv) throw new Error('no ui');
            uiDiv.removeChild(this.stopwatchUI.element);
            clearInterval(this.interval);
            console.info('win: ' + this.score);
        }
    }

    private lose() {
        this.over = true;
        this.stopwatchUI.lose();
        clearInterval(this.interval);
        console.info('lose: ' + this.score);
    }
}