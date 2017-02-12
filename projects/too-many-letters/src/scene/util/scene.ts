import {WIDTH, HEIGHT} from '../../constants';
import {World} from '../../phys/world';
import {Shape} from '../../phys/shape';
import {Scene, SceneConfig} from '../gen';
import {Thing} from '../../thing/gen';

export interface SceneBaseConfig {
    bgElement: HTMLElement;
    bounciness?: number;
    fixedShapes: Shape[];
}

export class SceneBase implements Scene {
    protected readonly baseConfig: SceneBaseConfig;
    protected readonly sceneConfig: SceneConfig;

    world: World;

    constructor(baseConfig: SceneBaseConfig, sceneConfig: SceneConfig) {
        this.baseConfig = baseConfig;
        this.sceneConfig = sceneConfig;

        this.reset();
    }

    reset() {
        this.world = new World({
            width: WIDTH,
            height: HEIGHT,
            bounciness: this.baseConfig.bounciness,
            fixedShapes: this.baseConfig.fixedShapes,
        });
    }

    activate() {
        const sceneDiv = document.getElementById('scene');
        if (!sceneDiv) throw new Error('no scene');

        sceneDiv.innerHTML = '';
        sceneDiv.appendChild(this.baseConfig.bgElement);
        sceneDiv.appendChild(this.world.element);
    }

    addThing(thing: Thing) {
        this.world.addSprite(thing.sprite);
    }

    removeThing(thing: Thing) {
        this.world.removeSprite(thing.sprite);
    }
}