import {Sprite} from '../phys/sprite';
import {Point} from '../phys/shape';
import {Word} from '../word/gen';

export interface ThingConfig {
    position?: Point;
    word: Word;
}

export interface Thing {
    word: Word;
    sprite: Sprite;

    die(): void;
    hit(count: number): void;
}

export interface ThingeratorConfig {
    type: string;
    fixedRotation?: boolean;
}

export interface Thingerator {
    generate(config: ThingConfig): Thing;
    signText(): [string, string];
}