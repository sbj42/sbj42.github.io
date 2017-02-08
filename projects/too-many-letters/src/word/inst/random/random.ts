import {Random} from '../../../util/random';
import {ConvexPolygon, Circle, Rectangle, Shape} from '../../../phys/shape';
import {WordConfig, Word, WorderatorConfig, Worderator} from '../../gen';

type LetterCaseOption = 'upper' | 'lower' | 'both';

export interface RandomWorderatorConfig extends WorderatorConfig {
    case?: LetterCaseOption;
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
        this.parts = config.parts || DEFAULT_PARTS;
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