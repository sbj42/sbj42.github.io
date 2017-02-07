require('./tml.css');

import * as SceneratorFactory from './scene/factory';
import * as ThingeratorFactory from './thing/factory';
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
    type: ThingeratorFactory.THINGERATOR_FRUIT,
});

const scene = scenerator.generate({});
scene.activate();

// var options = ['Hello', 'this', 'is', 'a', 'test'];
var options = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var i = 0;
setInterval(() => {
    if (i < 26) {
        var text = options[Math.floor(Math.random() * options.length)];
        // if (Math.random() < 0.75)
        //     text += options[Math.floor(Math.random() * options.length)];
        // if (Math.random() < 0.66)
        //     text += options[Math.floor(Math.random() * options.length)];
        // if (Math.random() < 0.5)
        //     text += options[Math.floor(Math.random() * options.length)];
        scene.world.addSprite(thingerator.generate({
            text: text.toUpperCase(),
            position: [(WIDTH - 200) * Math.random(), -50],
        }).sprite);
        i ++;
    }
}, 500);