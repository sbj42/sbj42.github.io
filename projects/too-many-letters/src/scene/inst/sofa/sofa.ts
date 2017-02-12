import {SceneConfig, Scene, SceneratorConfig, Scenerator} from '../../gen';
import {ConvexPolygon} from '../../../phys/shape';
import {SceneBase} from '../../util/scene';

require('./sofa.css');

const imageContext = require.context('./images', false, /\.(svg|jpg)$/);

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
        outsideImg.src = imageContext(`./outside${Math.floor(Math.random()*3+1)}.jpg`);
        outsideImg.className = 'sofa_outside';
        bgDiv.appendChild(outsideImg);
        const wallImg = document.createElement('img');
        wallImg.src = imageContext(`./wall${Math.floor(Math.random()*3+1)}.svg`);
        wallImg.className = 'sofa_image';
        bgDiv.appendChild(wallImg);
        const artImg = document.createElement('img');
        artImg.src = imageContext(`./art${Math.floor(Math.random()*3+1)}.svg`);
        artImg.className = 'sofa_image';
        bgDiv.appendChild(artImg);
        const sofaImg = document.createElement('img');
        sofaImg.src = imageContext(`./sofa${Math.floor(Math.random()*2+1)}.svg`);
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