require('./text-sprite.css');

import {Sprite} from '../../phys/sprite';
import {Rectangle} from '../../phys/shape';
import {ThingConfig, Thing, ThingeratorConfig, Thingerator} from '../gen';
import {getTextExtent} from '../../util/text-extent';

const DEFAULT_FONT = "60px 'Paytone One', sans-serif";

export interface TextThingeratorConfig extends ThingeratorConfig {
    font?: string;
    textFillColor: string;
    textStrokeColor: string;
}

export class TextThingerator implements Thingerator {
    private readonly config: TextThingeratorConfig;

    constructor(config: TextThingeratorConfig) {
        this.config = config;
    }

    generate(thingConfig: ThingConfig): Thing {
        const font = this.config.font || DEFAULT_FONT;
        const extent = getTextExtent(thingConfig.text, font);
        
        const spriteElem = document.createElement('div');
        spriteElem.appendChild(document.createTextNode(thingConfig.text));
        spriteElem.className = 'text_sprite';
        spriteElem.style.font = font;
        spriteElem.style.color = this.config.textFillColor;
        const {textStrokeColor} = this.config;
        spriteElem.style.textShadow = `-1px -1px 0 ${textStrokeColor}, -1px 1px 0 ${textStrokeColor}, 1px -1px 0 ${textStrokeColor}, 1px 1px 0 ${textStrokeColor}`;
        
        const sprite = new Sprite({
            element: spriteElem,
            position: thingConfig.position,
            fixedRotation: this.config.fixedRotation,
            shapes: [
                new Rectangle([0, 0], extent.width, extent.height),
            ]
        })

        return {
            sprite
        };
    }
}