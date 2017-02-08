import {WorderatorConfig} from './gen';

import {RandomWorderator, RandomWorderatorConfig} from './inst/random/random';
import {WordListWorderator, WordListWorderatorConfig} from './inst/wordlist/wordlist';

export const WORDERATOR_RANDOM = 'random';
export const WORDERATOR_WORDLIST = 'wordlist';

export function getWorderator(config: WorderatorConfig) {
    if (config.type == WORDERATOR_RANDOM) {
        return new RandomWorderator(config as RandomWorderatorConfig);
    } else if (config.type == WORDERATOR_WORDLIST) {
        return new WordListWorderator(config as WordListWorderatorConfig);
    } else
        throw new Error('worderator ' + config.type);
}