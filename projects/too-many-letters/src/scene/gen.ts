import {World} from '../phys/World';
import {Thing} from '../thing/gen';

export interface SceneConfig {
}

export interface Scene {
    world: World;

    activate(): void;
    addThing(thing: Thing): void;
    removeThing(thing: Thing): void;
}

export interface SceneratorConfig {
    type: string;
}

export interface Scenerator {
    generate(config: SceneConfig): Scene;

    signText(): string;
}