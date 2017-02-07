import {ListWorderator, ListWorderatorConfig} from '../../util/list';
import {ConvexPolygon, Circle, Rectangle, Shape} from '../../../phys/shape';
import {WordConfig, Word, WorderatorConfig, Worderator} from '../../gen';

type LetterCaseOption = 'upper' | 'lower' | 'both';

export interface LetterWorderatorConfig extends ListWorderatorConfig {
    case?: LetterCaseOption;
    letters?: string;
}

const DEFAULT_LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export class LetterWorderator extends ListWorderator {
    protected config: LetterWorderatorConfig;

    constructor(config: LetterWorderatorConfig) {
        let letters = config.letters || DEFAULT_LETTERS;
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
            items,
            ...config
        });
        this.config = config;
    }
}