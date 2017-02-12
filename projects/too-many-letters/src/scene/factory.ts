import {SceneratorConfig} from './gen';

import {SofaScenerator, SofaSceneratorConfig} from './inst/sofa/sofa';
import {BedScenerator, BedSceneratorConfig} from './inst/bed/bed';

export const SCENERATOR_SOFA = 'sofa';
export const SCENERATOR_BED = 'bed';

export function getScenerator(config: SceneratorConfig) {
    if (config.type == SCENERATOR_SOFA) {
        return new SofaScenerator(config as SofaSceneratorConfig);
    } else if (config.type == SCENERATOR_BED) {
        return new BedScenerator(config as BedSceneratorConfig);
    } else
        throw new Error('scene ' + config.type);
}