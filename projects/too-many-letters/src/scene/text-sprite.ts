declare function require(path: string): void;
require('./text-sprite.css');

import {Sprite} from '../phys/sprite';
import {Rectangle} from '../phys/shape';
            
const extentDiv = document.createElement('div');
extentDiv.className = 'text_extent';
const root = document.getElementById('root');
if (!root) throw new Error('no root');
root.appendChild(extentDiv);

export function getTextExtent(text: string, font: string) {
    extentDiv.style.font = font;
    const node = document.createTextNode(text);
    extentDiv.appendChild(node);
    const width = extentDiv.clientWidth;
    const height = extentDiv.clientHeight;
    extentDiv.removeChild(node);
    return {width, height};
}

export function makeTextSprite(x: number, y: number, text: string, font: string) {
    const extent = getTextExtent(text, font);
    const spriteElem = document.createElement('div');
    spriteElem.appendChild(document.createTextNode(text));
    spriteElem.className = 'text_sprite';
    spriteElem.style.font = font;
    const sprite = new Sprite({
        element: spriteElem,
        position: {x, y},
        shapes: [
            new Rectangle({
                topLeft: {x: 0, y: 0},
                width: extent.width,
                height: extent.height
            }),
        ]
    })
    return sprite;
}