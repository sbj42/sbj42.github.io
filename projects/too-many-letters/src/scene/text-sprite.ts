declare function require(path: string): void;
require('./text-sprite.css');

import {Sprite} from '../phys/sprite';
import {Rectangle} from '../phys/shape';

export function makeTextSprite(x: number, y: number, text: string, font: string) {
    const spriteElem = document.createElement('div');
    spriteElem.appendChild(document.createTextNode(text));
    spriteElem.className = 'text_extent text_sprite';
    spriteElem.style.font = font;
    const root = document.getElementById('root');
    if (!root) throw new Error('no root');
    root.appendChild(spriteElem);
    const width = spriteElem.clientWidth;
    const height = spriteElem.clientHeight;
    root.removeChild(spriteElem);
    spriteElem.className = 'text_sprite';
    const sprite = new Sprite({
        element: spriteElem,
        position: {x, y},
        shapes: [
            new Rectangle({
                topLeft: {x: 0, y: 0},
                width,
                height
            }),
        ]
    })
    return sprite;
}