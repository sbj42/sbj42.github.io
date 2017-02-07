import {ThingeratorConfig} from './gen';

import {FruitThingerator, FruitThingeratorConfig} from './inst/fruit/fruit';
import {TextThingerator, TextThingeratorConfig} from './inst/text/text';

export const THINGERATOR_TEXT = 'text';
export const THINGERATOR_FRUIT = 'fruit';

export function getThingerator(config: ThingeratorConfig) {
    if (config.type == THINGERATOR_TEXT) {
        return new TextThingerator(config as TextThingeratorConfig);
    } else if (config.type == THINGERATOR_FRUIT) {
        return new FruitThingerator(config as FruitThingeratorConfig);
    } else
        throw new Error('thingerator ' + config.type);
}