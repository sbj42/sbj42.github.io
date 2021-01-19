import {SceneConfig, Scene, SceneratorConfig, Scenerator} from '../../gen';
import {ConvexPolygon} from '../../../phys/shape';
import {SceneBase} from '../../util/scene';

import './sofa.css';

import ART_1 from './images/art1.svg';
import ART_2 from './images/art2.svg';
import ART_3 from './images/art3.svg';
import OUTSIDE_1 from './images/outside1.jpg';
import OUTSIDE_2 from './images/outside2.jpg';
import OUTSIDE_3 from './images/outside3.jpg';
import SOFA_1 from './images/sofa1.svg';
import SOFA_2 from './images/sofa2.svg';
import WALL_1 from './images/wall1.svg';
import WALL_2 from './images/wall2.svg';
import WALL_3 from './images/wall3.svg';

function pick(arr: string[]) {
    return arr[Math.floor(Math.random()*arr.length)];
}

export interface SofaSceneratorConfig extends SceneratorConfig {
}

export class SofaScenerator implements Scenerator {
    private readonly config: SceneConfig;

    constructor(config: SofaSceneratorConfig) {
        this.config = config;
    }

    generate(sceneConfig: SceneConfig): Scene {
        const bgDiv = document.createElement('div');
        bgDiv.className = 'sofa_bg';
        const outsideImg = document.createElement('img');
        outsideImg.src = pick([OUTSIDE_1, OUTSIDE_2, OUTSIDE_3]);
        outsideImg.className = 'sofa_outside';
        bgDiv.appendChild(outsideImg);
        const wallImg = document.createElement('img');
        wallImg.src = pick([WALL_1, WALL_2, WALL_3]);
        wallImg.className = 'sofa_image';
        bgDiv.appendChild(wallImg);
        const artImg = document.createElement('img');
        artImg.src = pick([ART_1, ART_2, ART_3]);
        artImg.className = 'sofa_image';
        bgDiv.appendChild(artImg);
        const sofaImg = document.createElement('img');
        sofaImg.src = pick([SOFA_1, SOFA_2]);
        sofaImg.className = 'sofa_image';
        bgDiv.appendChild(sofaImg);

        return new SceneBase({
            bgElement: bgDiv,
            fixedShapes: [
                new ConvexPolygon([
                    [0, 598], [81, 580], [142, 620], [198, 800], [0, 800],
                ]), new ConvexPolygon([
                    [0, 692], [1200, 692], [1200, 800], [0, 800],
                ]), new ConvexPolygon([
                    [1200, 595], [1200, 800], [1010, 800], [1065, 630], [1120, 586],
                ])
            ]
        }, sceneConfig);
    }

    signText(): string {
        return `on my sofa`;
    }
}