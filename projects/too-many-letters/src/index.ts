require('./tml.css');

import {SofaScene} from './scene/sofa';
import * as ThingeratorFactory from './thing/factory';
import {WIDTH, HEIGHT} from './constants';

const root = document.getElementById("root");
if (!root) throw new Error('no root');

const view = document.createElement('div');
view.id = 'view';
view.style.width = `${WIDTH}px`;
view.style.height = `${HEIGHT}px`;
root.appendChild(view);
const bg = document.createElement('img');
bg.id = 'bg';
view.appendChild(bg);

const scaleRoot = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(width/WIDTH, height/HEIGHT);
    root.style.width = `${width/scale}px`;
    root.style.transform = `scale(${scale})`;
};

window.onresize = scaleRoot;
scaleRoot();

const scene = new SofaScene();
const thingerator = ThingeratorFactory.getThingerator({
    type: ThingeratorFactory.THINGERATOR_FRUIT
});

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