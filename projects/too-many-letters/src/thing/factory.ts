import {ThingeratorConfig} from './gen';

import {FruitGenerator, FruitGeneratorConfig} from './inst/fruit/fruit';

export const THINGERATOR_FRUIT = 'fruit';

export function getThingerator(config: ThingeratorConfig) {
    if (config.type == THINGERATOR_FRUIT) {
        return new FruitGenerator(config as FruitGeneratorConfig);
    } else
        throw new Error('thingerator ' + config.type);
}