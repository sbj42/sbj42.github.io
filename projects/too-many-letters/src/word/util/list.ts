import {RandomConfig, Random} from '../../util/random';
import {WordConfig, Word, WorderatorConfig, Worderator} from '../gen';

export interface ListWorderatorConfig extends WorderatorConfig, RandomConfig {
    items: string[];
}

export class ListWorderator implements Worderator {
    protected listConfig: ListWorderatorConfig;
    protected random: Random;

    protected constructor(config: ListWorderatorConfig) {
        this.listConfig = config;
        this.random = new Random(config);
    }

    generate(wordConfig: WordConfig): Word {
        const text = this.random.choice(this.listConfig.items);
        return {
            text,
        };
    }
}