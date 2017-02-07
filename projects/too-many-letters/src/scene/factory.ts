import {SceneratorConfig} from './gen';

import {SofaScenerator, SofaSceneratorConfig} from './inst/sofa/sofa';

export const SCENERATOR_SOFA = 'sofa';

export function getScenerator(config: SceneratorConfig) {
    if (config.type == SCENERATOR_SOFA) {
        return new SofaScenerator(config as SofaSceneratorConfig);
    } else
        throw new Error('scene ' + config.type);
}