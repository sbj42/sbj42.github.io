require('./image.css');

import {Sprite} from '../../phys/sprite';
import {Rectangle, Shape} from '../../phys/shape';
import {ThingConfig, Thing, ThingeratorConfig, Thingerator} from '../gen';

export interface ImageConfig {
    url: string;
    shapes: Shape[];
    textFillColor: string;
    textStrokeColor: string;
    textRect: Rectangle;
};

export interface ImageThingeratorConfig extends ThingeratorConfig {
    font: string;
}

export abstract class ImageThingerator implements Thingerator {
    private readonly imageGenConfig: ImageThingeratorConfig;

    constructor(config: ImageThingeratorConfig) {
        this.imageGenConfig = config;
    }

    protected generateImage(imageConfig: ImageConfig, thingConfig: ThingConfig) {
        const spriteElem = document.createElement('div');

        const img = document.createElement('img');
        img.className = 'img_image';
        img.src = imageConfig.url;
        spriteElem.appendChild(img);

        const imgWidth = img.width;
        const imgHeight = img.height;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'img_text';
        textDiv.style.font = `${this.imageGenConfig.font}`;
        textDiv.style.top = `${imageConfig.textRect.topLeft[1]}px`;
        textDiv.style.left = `${imageConfig.textRect.topLeft[0]}px`;
        textDiv.style.width = `${imageConfig.textRect.width}px`;
        textDiv.style.height = `${imageConfig.textRect.height}px`;
        textDiv.style.lineHeight = `${imageConfig.textRect.height}px`;
        textDiv.style.color = `${imageConfig.textFillColor}`;
        const {textStrokeColor} = imageConfig;
        textDiv.style.textShadow = `-1px -1px 0 ${textStrokeColor}, -1px 1px 0 ${textStrokeColor}, 1px -1px 0 ${textStrokeColor}, 1px 1px 0 ${textStrokeColor}`;
        textDiv.appendChild(document.createTextNode(thingConfig.text));
        spriteElem.appendChild(textDiv);

        const sprite = new Sprite({
            element: spriteElem,
            position: thingConfig.position,
            fixedRotation: this.imageGenConfig.fixedRotation,
            shapes: imageConfig.shapes
        })
        return {
            sprite
        };
    }

    abstract generate(thingConfig: ThingConfig): Thing;
}