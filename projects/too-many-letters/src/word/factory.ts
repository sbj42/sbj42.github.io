import {WorderatorConfig} from './gen';

import {RandomWorderator, RandomWorderatorConfig} from './inst/random/random';

export const WORDERATOR_RANDOM = 'random';

export function getWorderator(config: WorderatorConfig) {
    if (config.type == WORDERATOR_RANDOM) {
        return new RandomWorderator(config as RandomWorderatorConfig);
    } else
        throw new Error('worderator ' + config.type);
}