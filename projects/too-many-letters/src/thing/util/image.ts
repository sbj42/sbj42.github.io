require('./image.css');

import {Sprite} from '../../phys/sprite';
import {Rectangle, Shape} from '../../phys/shape';
import {ThingConfig, Thing, ThingeratorConfig, Thingerator} from '../gen';
import {getTextExtent} from '../../util/text-extent';

export interface ImageConfig {
    url: string;
    deadUrl: string;
    shapes: Shape[];
    textFillColor: string;
    textStrokeColor: string;
    hitFillColor: string;
    hitStrokeColor: string;
    textRect: Rectangle;
};

export interface ImageThingeratorConfig extends ThingeratorConfig {
    font: string;
}

export abstract class ImageThingerator implements Thingerator {
    protected readonly imageGenConfig: ImageThingeratorConfig;

    constructor(config: ImageThingeratorConfig) {
        this.imageGenConfig = config;
    }

    protected generateImage(imageConfig: ImageConfig, thingConfig: ThingConfig): Thing {
        let {font} = this.imageGenConfig;
        const {fixedRotation} = this.imageGenConfig;
        const {hitStrokeColor, hitFillColor, textStrokeColor, textRect, textFillColor, url, deadUrl} = imageConfig;
        const {word} = thingConfig;
        for (;;) {
            const extent = getTextExtent(thingConfig.word.text, font);
            if (extent.width < textRect.width)
                break;
            let parts = font.split('px');
            parts[0] = String(Math.min(Math.floor((+parts[0])*textRect.width / extent.width), (+parts[0]) - 1));
            font = parts.join('px');
        }

        const spriteElem = document.createElement('div');

        const img = document.createElement('img');
        img.className = 'img_image';
        img.src = url;
        spriteElem.appendChild(img);

        const imgWidth = img.width;
        const imgHeight = img.height;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'img_text';
        textDiv.style.font = `${font}`;
        textDiv.style.top = `${textRect.topLeft[1]}px`;
        textDiv.style.left = `${textRect.topLeft[0]}px`;
        textDiv.style.width = `${textRect.width}px`;
        textDiv.style.height = `${textRect.height}px`;
        textDiv.style.lineHeight = `${textRect.height}px`;
        spriteElem.appendChild(textDiv);

        const hitSpan = document.createElement('span');
        hitSpan.className = 'img_text_hit';
        hitSpan.style.color = hitFillColor;
        hitSpan.style.textShadow = `-2px -2px 0 ${hitStrokeColor}, -2px 2px 0 ${hitStrokeColor}, 2px -2px 0 ${hitStrokeColor}, 2px 2px 0 ${hitStrokeColor}`;
        textDiv.appendChild(hitSpan);
        const textSpan = document.createElement('span');
        textSpan.className = 'img_text_text';
        textSpan.appendChild(document.createTextNode(word.text));
        textSpan.style.color = textFillColor;
        textSpan.style.textShadow = `-2px -2px 0 ${textStrokeColor}, -2px 2px 0 ${textStrokeColor}, 2px -2px 0 ${textStrokeColor}, 2px 2px 0 ${textStrokeColor}`;
        textDiv.appendChild(textSpan);

        const sprite = new Sprite({
            element: spriteElem,
            position: thingConfig.position || [0, 0],
            fixedRotation,
            shapes: imageConfig.shapes
        })
        return {
            sprite,
            word,
            die: () => {
                hitSpan.innerHTML = '';
                textSpan.innerHTML = '';
                img.src = deadUrl;
            },
            hit: count => {
                hitSpan.innerHTML = '';
                hitSpan.appendChild(document.createTextNode(word.text.substr(0, count)));
                textSpan.innerHTML = '';
                textSpan.appendChild(document.createTextNode(word.text.substr(count)));
            }
        };
    }

    abstract generate(thingConfig: ThingConfig): Thing;

    abstract signText(): [string, string];
}