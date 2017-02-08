require('./tml.css');

import * as SceneratorFactory from './scene/factory';
import * as ThingeratorFactory from './thing/factory';
import * as WorderatorFactory from './word/factory';
import {Level} from './game/level';
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
    //type: WorderatorFactory.WORDERATOR_RANDOM,
    type: WorderatorFactory.WORDERATOR_WORDLIST,
    data: require('./word/inst/wordlist/data/colors-easy.txt'),
    //minLength: 2,
    //maxLength: 3,
    //parts: ['foo', 'bar', 'baz'],
    //parts: '!@#$%^&*()'.split(''),
    case: 'upper',
    //case: 'lower'
} as any);
const level = new Level({
    scenerator,
    thingerator,
    worderator,
    timeLimit: 10,
    startWordCount: 2,
    extraWordTimes: 2,
    extraWordCount: 2,
});
(window as any)['level'] = level;

window.onkeypress = event => {
    level.onKey(event.key);
};

level.start();
level.activate();