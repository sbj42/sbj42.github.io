declare function require(path: string): string;
require('./img-sprite.css');

import {Sprite} from '../phys/sprite';
import {Point, Shape} from '../phys/shape';
import {getTextExtent} from './text-sprite';

export interface ImgSpriteConfig {
    url: string,
    font: string,
    shapes: Shape[],
    textFillColor: string,
    textStrokeColor: string,
    textTopLeft: Point,
    textWidth: number,
    textHeight: number,
    fixedRotation?: boolean,
};

export function makeImgSprite(config: ImgSpriteConfig, x: number, y: number, text: string) {
    const spriteElem = document.createElement('div');
    const img = document.createElement('img');
    img.className = 'img_image';
    img.src = config.url;
    const imgWidth = img.width;
    const imgHeight = img.height;
    spriteElem.appendChild(img);
    const textDiv = document.createElement('div');
    textDiv.className = 'img_text';
    textDiv.style.font = `${config.font}`;
    textDiv.style.top = `${config.textTopLeft.y}px`;
    textDiv.style.left = `${config.textTopLeft.x}px`;
    textDiv.style.width = `${config.textWidth}px`;
    textDiv.style.height = `${config.textHeight}px`;
    textDiv.style.lineHeight = `${config.textHeight}px`;
    textDiv.style.color = `${config.textFillColor}`;
    textDiv.style.textShadow = `-1px -1px 0 ${config.textStrokeColor}, -1px 1px 0 ${config.textStrokeColor}, 1px -1px 0 ${config.textStrokeColor}, 1px 1px 0 ${config.textStrokeColor}`;
    textDiv.appendChild(document.createTextNode(text));
    spriteElem.appendChild(textDiv);
    const sprite = new Sprite({
        element: spriteElem,
        position: {x, y},
        fixedRotation: config.fixedRotation,
        shapes: config.shapes
    })
    return sprite;
}