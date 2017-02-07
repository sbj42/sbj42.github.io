import {Sprite} from '../phys/sprite';
import {Point} from '../phys/shape';

export interface ThingConfig {
    position: Point;
    text: string;
}

export interface Thing {
    sprite: Sprite;
}

export interface ThingeratorConfig {
    type: string;
    fixedRotation?: boolean;
}

export interface Thingerator {
    generate(config: ThingConfig): Thing;
}