import {RandomWorderator, CaseOption} from '../random/random';
import {Random} from '../../../util/random';
import {WordConfig, Word, WorderatorConfig, Worderator} from '../../gen';

export interface WordListWorderatorConfig extends WorderatorConfig {
    data: string;
    case?: CaseOption;
}

export class WordListWorderator extends RandomWorderator {
    protected config: WordListWorderatorConfig;

    constructor(config: WordListWorderatorConfig) {
        super({
            parts: config.data.split(/\r?\n/),
            ...config
        });
    }
}