import {SceneConfig, Scene, SceneratorConfig, Scenerator} from '../../gen';
import {ConvexPolygon} from '../../../phys/shape';
import {SceneBase} from '../../util/scene';

require('./bed.css');

const imageContext = require.context('./images', false, /\.(svg|jpg)$/);

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
        wallImg.src = imageContext(`./wall${Math.floor(Math.random()*2+1)}.svg`);
        wallImg.className = 'bed_image';
        bgDiv.appendChild(wallImg);
        const shelfImg = document.createElement('img');
        shelfImg.src = imageContext(`./shelf${Math.floor(Math.random()*2+1)}.svg`);
        shelfImg.className = 'bed_image';
        bgDiv.appendChild(shelfImg);
        const artImg = document.createElement('img');
        artImg.src = imageContext(`./art${Math.floor(Math.random()*3+1)}.svg`);
        artImg.className = 'bed_image';
        bgDiv.appendChild(artImg);
        const bedImg = document.createElement('img');
        bedImg.src = imageContext(`./bed${Math.floor(Math.random()*3+1)}.svg`);
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