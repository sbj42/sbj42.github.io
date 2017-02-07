import {World} from '../phys/World';

export interface SceneConfig {
}

export interface Scene {
    world: World;

    activate(): void;
}

export interface SceneratorConfig {
    type: string;
}

export interface Scenerator {
    generate(config: SceneConfig): Scene;
}