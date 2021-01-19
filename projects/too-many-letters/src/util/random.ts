import * as randomjs from 'random-js';

export interface RandomConfig {
    seed?: number;
}

export class Random {
    protected engine: randomjs.MersenneTwister19937;

    constructor(config: RandomConfig) {
        this.engine = typeof config.seed === 'undefined' ? randomjs.MersenneTwister19937.autoSeed() : randomjs.MersenneTwister19937.seed(config.seed);
    }

    choice<T>(arr: T[]): T {
        return randomjs.pick(this.engine, arr);
    }

    integer(min: number | undefined, max: number | undefined): number {
        if (!min)
            min = 1;
        if (!max)
            max = min;
        if (max < min)
            throw new Error('minmax');
        return randomjs.integer(min, max)(this.engine);
    }

    percent(p: number) {
        return randomjs.bool(p)(this.engine);
    }
}