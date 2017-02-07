require('./tml.css');

import * as SceneratorFactory from './scene/factory';
import * as ThingeratorFactory from './thing/factory';
import * as WorderatorFactory from './word/factory';
import {WIDTH, HEIGHT} from './constants';

const root = document.getElementById("root");
if (!root) throw new Error('no root');

const viewDiv = document.createElement('div');
viewDiv.id = 'view';
viewDiv.style.width = `${WIDTH}px`;
viewDiv.style.height = `${HEIGHT}px`;
root.appendChild(viewDiv);
const sceneDiv = document.createElement('div');
sceneDiv.id = 'scene';
viewDiv.appendChild(sceneDiv);

const scaleRoot = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(width/WIDTH, height/HEIGHT);
    root.style.width = `${width/scale}px`;
    root.style.transform = `scale(${scale})`;
};

window.onresize = scaleRoot;
scaleRoot();

const scenerator = SceneratorFactory.getScenerator({
    type: SceneratorFactory.SCENERATOR_SOFA,
});
const thingerator = ThingeratorFactory.getThingerator({
    //type: ThingeratorFactory.THINGERATOR_TEXT,
    type: ThingeratorFactory.THINGERATOR_FRUIT,
    //fixedRotation: true,
});
const worderator = WorderatorFactory.getWorderator({
    type: WorderatorFactory.WORDERATOR_LETTER,
    //letters: '!@#$%^&*()',
    //case: 'lower'
} as any);

const scene = scenerator.generate({});
scene.activate();

var i = 0;
setInterval(() => {
    if (i < 26) {
        const word = worderator.generate({});
        const position = [(WIDTH - 200) * Math.random(), -50]
        const thing = thingerator.generate({
            text: word.text,
            position,
        });
        scene.world.addSprite(thing.sprite);
        i ++;
    }
}, 500);