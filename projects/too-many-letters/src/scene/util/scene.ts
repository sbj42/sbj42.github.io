import {WIDTH, HEIGHT} from '../../constants';
import {World} from '../../phys/world';
import {Shape} from '../../phys/shape';
import {Scene, SceneConfig} from '../gen';

export interface SceneBaseConfig {
    bgElement: HTMLElement;
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
            fixedShapes: this.baseConfig.fixedShapes
        });
    }

    activate() {
        const scene = document.getElementById('scene');
        if (!scene) throw new Error('no scene');

        scene.innerHTML = '';
        scene.appendChild(this.baseConfig.bgElement);
        scene.appendChild(this.world.element);
    }
}