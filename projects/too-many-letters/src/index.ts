declare function require(path: string): void;
require('./tml.css');

import {World} from './phys/world';
import {makeTextSprite} from './scene/text-sprite';

const WIDTH = 1200;
const HEIGHT = 800;

const root = document.getElementById("root");
if (!root) throw new Error('no root');

const view = document.createElement('div');
view.id = 'view';
view.style.width = `${WIDTH}px`;
view.style.height = `${HEIGHT}px`;
root.appendChild(view);

const scaleRoot = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(width/WIDTH, height/HEIGHT);
    root.style.width = `${width/scale}px`;
    root.style.transform = `scale(${scale})`;
};

window.onresize = scaleRoot;
scaleRoot();

const world = new World({
    width: WIDTH,
    height: HEIGHT,
});

//var options = ['Hello', 'this', 'is', 'a', 'test'];
var options = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var i = 0;
setInterval(() => {
    if (i < 100) {
        var text = options[Math.floor(Math.random() * options.length)];
        if (Math.random() < 0.75)
            text += options[Math.floor(Math.random() * options.length)];
        if (Math.random() < 0.66)
            text += options[Math.floor(Math.random() * options.length)];
        if (Math.random() < 0.5)
            text += options[Math.floor(Math.random() * options.length)];
        world.addSprite(makeTextSprite((WIDTH - 100) * Math.random(), Math.random() * 200, text, `70px 'Inconsolata', monospace`));
        i ++;
    }
}, 100);

view.appendChild(world.element);