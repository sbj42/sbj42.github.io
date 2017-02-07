import {WorderatorConfig} from './gen';

import {LetterWorderator, LetterWorderatorConfig} from './inst/letter/letter';

export const WORDERATOR_LETTER = 'letter';

export function getWorderator(config: WorderatorConfig) {
    if (config.type == WORDERATOR_LETTER) {
        return new LetterWorderator(config as LetterWorderatorConfig);
    } else
        throw new Error('worderator ' + config.type);
}