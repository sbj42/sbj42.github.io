import * as randomjs from 'random-js';

export interface BaseGenConfig {
    seed?: number;
}

export abstract class BaseGen {
    protected engine: randomjs.MT19937;

    protected constructor(config: BaseGenConfig) {
        const seed = typeof config.seed != 'undefined' ? config.seed : Math.random();
        this.engine = randomjs.engines.mt19937();
        this.engine.seed(seed);
    }

    protected randomChoice<T>(arr: T[]): T {
        return randomjs.pick(this.engine, arr);
    }

    protected randomPercent(p: number) {
        return randomjs.bool(p)(this.engine);
    }

    abstract next(): string;
}

export interface ListGenConfig extends BaseGenConfig {
    seed?: number;
    items: string[];
}

export class ListGen extends BaseGen {
    protected items: string[];

    protected constructor(config: ListGenConfig) {
        super(config);
        this.items = config.items;
    }

    next(): string {
        return this.randomChoice(this.items);
    }
}