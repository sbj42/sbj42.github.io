import {Random} from '../../../util/random';
import {WordConfig, Word, WorderatorConfig, Worderator} from '../../gen';

export type CaseOption = 'upper' | 'lower' | 'both';

export interface RandomWorderatorConfig extends WorderatorConfig {
    case?: CaseOption;
    parts?: string[];
    minLength?: number;
    maxLength?: number;
}

const DEFAULT_PARTS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export class RandomWorderator implements Worderator {
    protected config: RandomWorderatorConfig;
    protected parts: string[];
    protected random: Random;

    constructor(config: RandomWorderatorConfig) {
        this.config = config;
        this.random = new Random(config);
        this.parts = (config.parts || DEFAULT_PARTS).map(value => {
            if (this.config.case == 'upper') {
                return value.toUpperCase();
            } else if (this.config.case == 'lower') {
                return value.toLowerCase();
            } else {
                return value;
            }
        });
        if (this.config.case == 'both') {
            this.parts = this.parts.map(value => value.toLowerCase()).concat(this.parts.map(value => value.toUpperCase()));
        }
    }

    generate(wordConfig: WordConfig): Word {
        const length = this.random.integer(this.config.minLength, this.config.maxLength);
        let text = '';
        for (let i = 0; i < length; i ++) {
            text += this.random.choice(this.parts);
        }
        return {
            text,
        };
    }
}