import {SceneConfig, Scene, SceneratorConfig, Scenerator} from '../../gen';
import {ConvexPolygon} from '../../../phys/shape';
import {SceneBase} from '../../util/scene';

import './bed.css';

import ART_1 from './images/art1.svg';
import ART_2 from './images/art2.svg';
import ART_3 from './images/art3.svg';
import BED_1 from './images/bed1.svg';
import BED_2 from './images/bed2.svg';
import BED_3 from './images/bed3.svg';
import SHELF_1 from './images/shelf1.svg';
import SHELF_2 from './images/shelf2.svg';
import WALL_1 from './images/wall1.svg';
import WALL_2 from './images/wall2.svg';
import WALL_3 from './images/wall3.svg';

function pick(arr: string[]) {
    return arr[Math.floor(Math.random()*arr.length)];
}

export interface BedSceneratorConfig extends SceneratorConfig {
}

export class BedScenerator implements Scenerator {
    private readonly config: SceneConfig;

    constructor(config: BedSceneratorConfig) {
        this.config = config;
    }

    generate(sceneConfig: SceneConfig): Scene {
        const bgDiv = document.createElement('div');
        bgDiv.className = 'bed_bg';
        const wallImg = document.createElement('img');
        wallImg.src = pick([WALL_1, WALL_2, WALL_3]);
        wallImg.className = 'bed_image';
        bgDiv.appendChild(wallImg);
        const shelfImg = document.createElement('img');
        shelfImg.src = pick([SHELF_1, SHELF_2]);
        shelfImg.className = 'bed_image';
        bgDiv.appendChild(shelfImg);
        const artImg = document.createElement('img');
        artImg.src = pick([ART_1, ART_2, ART_3]);
        artImg.className = 'bed_image';
        bgDiv.appendChild(artImg);
        const bedImg = document.createElement('img');
        bedImg.src = pick([BED_1, BED_2, BED_3]);
        bedImg.className = 'bed_image';
        bgDiv.appendChild(bedImg);

        return new SceneBase({
            bgElement: bgDiv,
            bounciness: 0.8,
            fixedShapes: [
                new ConvexPolygon([
                    [0, 612], [1200, 612], [1200, 800], [0, 800],
                ]), new ConvexPolygon([
                    [70, 578], [220, 571], [1200, 571], [1200, 612], [70, 612],
                ]), new ConvexPolygon([
                    [856, 550], [898, 516], [1035, 506], [1150, 539], [1150, 571], [856, 571],
                ]), new ConvexPolygon([
                    [1150, 571], [1150, 346], [1159, 343], [1200, 343], [1200, 571],
                ])
            ]
        }, sceneConfig);
    }

    signText(): string {
        return `on my bed`;
    }
}