declare function require(path: string): string;
require('./tml.css');

import {World} from './phys/world';
import {ConvexPolygon} from './phys/shape';
import {makeFruitSprite} from './scene/fruit-sprite';

const WIDTH = 1200;
const HEIGHT = 800;

const root = document.getElementById("root");
if (!root) throw new Error('no root');

const view = document.createElement('div');
view.id = 'view';
view.style.width = `${WIDTH}px`;
view.style.height = `${HEIGHT}px`;
root.appendChild(view);
const bg = document.createElement('img');
bg.id = 'bg';
bg.src = require('../data/sofa.svg');
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

const world = new World({
    width: WIDTH,
    height: HEIGHT,
    fixedShapes: [
        new ConvexPolygon({
            points: [
                {x: 0, y: 598},
                {x: 81, y: 580},
                {x: 142, y: 620},
                {x: 198, y: 800},
                {x: 0, y: 800},
            ]
        }),
        new ConvexPolygon({
            points: [
                {x: 0, y: 692},
                {x: 1200, y: 692},
                {x: 1200, y: 800},
                {x: 0, y: 800},
            ]
        }),
        new ConvexPolygon({
            points: [
                {x: 1200, y: 595},
                {x: 1200, y: 800},
                {x: 1010, y: 800},
                {x: 1065, y: 630},
                {x: 1120, y: 586},
            ]
        })
    ]
});

// var options = ['Hello', 'this', 'is', 'a', 'test'];
var options = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var i = 0;
setInterval(() => {
    if (i < 100) {
        var text = options[Math.floor(Math.random() * options.length)];
        // if (Math.random() < 0.75)
        //     text += options[Math.floor(Math.random() * options.length)];
        // if (Math.random() < 0.66)
        //     text += options[Math.floor(Math.random() * options.length)];
        // if (Math.random() < 0.5)
        //     text += options[Math.floor(Math.random() * options.length)];
        world.addSprite(makeFruitSprite((WIDTH - 200) * Math.random(), -50, text.toUpperCase()));
        i ++;
    }
}, 500);

view.appendChild(world.element);