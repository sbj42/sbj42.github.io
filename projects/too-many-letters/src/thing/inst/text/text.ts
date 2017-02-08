require('./text.css');

import {Sprite} from '../../../phys/sprite';
import {Rectangle} from '../../../phys/shape';
import {ThingConfig, Thing, ThingeratorConfig, Thingerator} from '../../gen';
import {getTextExtent} from '../../../util/text-extent';

const DEFAULT_FONT = "90px 'Paytone One', sans-serif";

export interface TextThingeratorConfig extends ThingeratorConfig {
    font?: string;
    textFillColor?: string;
    textStrokeColor?: string;
    hitFillColor?: string;
    hitStrokeColor?: string;
}

export class TextThingerator implements Thingerator {
    private readonly config: TextThingeratorConfig;

    constructor(config: TextThingeratorConfig) {
        this.config = config;
    }

    generate(thingConfig: ThingConfig): Thing {
        const font = this.config.font || DEFAULT_FONT;
        const extent = getTextExtent(thingConfig.word.text, font);
        
        const spriteElem = document.createElement('div');
        spriteElem.className = 'text_sprite';
        spriteElem.style.font = font;
        spriteElem.style.width = `${extent.width}px`;
        const hitSpan = document.createElement('span');
        hitSpan.className = 'text_sprite_hit';
        hitSpan.style.color = this.config.hitFillColor || '#f00';
        const hitStrokeColor = this.config.hitStrokeColor || '#fff';
        hitSpan.style.textShadow = `-2px -2px 0 ${hitStrokeColor}, -2px 2px 0 ${hitStrokeColor}, 2px -2px 0 ${hitStrokeColor}, 2px 2px 0 ${hitStrokeColor}`;
        spriteElem.appendChild(hitSpan);
        const textSpan = document.createElement('span');
        textSpan.className = 'text_sprite_text';
        textSpan.appendChild(document.createTextNode(thingConfig.word.text));
        textSpan.style.color = this.config.textFillColor || '#fff';
        const textStrokeColor = this.config.textStrokeColor || '#000';
        textSpan.style.textShadow = `-2px -2px 0 ${textStrokeColor}, -2px 2px 0 ${textStrokeColor}, 2px -2px 0 ${textStrokeColor}, 2px 2px 0 ${textStrokeColor}`;
        spriteElem.appendChild(textSpan);
        
        const sprite = new Sprite({
            element: spriteElem,
            position: thingConfig.position || [0, 0],
            fixedRotation: this.config.fixedRotation,
            shapes: [
                new Rectangle([0, extent.height*0.2], extent.width, extent.height*0.65),
            ]
        })

        return {
            sprite,
            word: thingConfig.word,
            die: () => {
                hitSpan.innerHTML = '';
                textSpan.innerHTML = '';
                hitSpan.appendChild(document.createTextNode(thingConfig.word.text));
            },
            hit: count => {
                hitSpan.innerHTML = '';
                hitSpan.appendChild(document.createTextNode(thingConfig.word.text.substr(0, count)));
                textSpan.innerHTML = '';
                hitSpan.appendChild(document.createTextNode(thingConfig.word.text.substr(count)));
            }
        };
    }
}