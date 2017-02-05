import {ListGen, BaseGenConfig} from './gen';

type LetterCaseOption = 'upper' | 'lower' | 'both';

export interface LetterGenConfig extends BaseGenConfig {
    case?: LetterCaseOption;
    letters?: string;
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export class LetterGen extends ListGen {

    constructor(config: LetterGenConfig) {
        let letters = config.letters || LETTERS;
        switch (config.case) {
        case 'upper':
            letters = letters.toUpperCase();
            break;
        case 'lower':
            letters = letters.toUpperCase();
            break;
        default:
            letters = letters.toUpperCase() + letters.toLowerCase();
            break;
        }
        const items = letters.split('');
        super({
            seed: config.seed,
            items,
        });
    }
}