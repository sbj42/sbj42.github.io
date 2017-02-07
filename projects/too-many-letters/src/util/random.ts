import * as randomjs from 'random-js';

export interface RandomConfig {
    seed?: number;
}

export class Random {
    protected engine: randomjs.MT19937;

    constructor(config: RandomConfig) {
        const seed = typeof config.seed != 'undefined' ? config.seed : Math.random();
        this.engine = randomjs.engines.mt19937();
        this.engine.seed(seed);
    }

    choice<T>(arr: T[]): T {
        return randomjs.pick(this.engine, arr);
    }

    percent(p: number) {
        return randomjs.bool(p)(this.engine);
    }
}