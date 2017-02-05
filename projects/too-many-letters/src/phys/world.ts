declare function require(path: string): void;
require('./world.css');

import {Sprite, makeBody} from './sprite';
import {Shape} from './shape';

import * as p2 from 'p2';

const GRAVITY = 400;

export interface WorldConfig {
    width: number;
    height: number;
    // fixedShapes: Array<Shape>;
}

export class World {
    element: HTMLElement;
    width: number;
    height: number;

    world: p2.World;
    sprites: Array<Sprite> = [];

    lastTime: number;

    constructor(config: WorldConfig) {
        const {width, height} = config;
        this.element = document.createElement('div');
        this.element.className = 'world';
        this.width = width;
        this.height = height;
        this.world = new p2.World({
            gravity: [0, GRAVITY]
        });
        const bottomPlane = new p2.Body({
            mass: 0,
            position: [0, height],
            angle: - Math.PI
        });
        bottomPlane.addShape(new p2.Plane());
        this.world.addBody(bottomPlane);
        const leftPlane = new p2.Body({
            mass: 0,
            position: [0, 0],
            angle: - Math.PI / 2
        });
        leftPlane.addShape(new p2.Plane());
        this.world.addBody(leftPlane);
        const rightPlane = new p2.Body({
            mass: 0,
            position: [width, 0],
            angle: Math.PI / 2
        });
        rightPlane.addShape(new p2.Plane());
        this.world.addBody(rightPlane);
        // const fixedBody = makeBody({
        //     position: {x:0, y:0},
        //     shapes: config.fixedShapes
        // });
        // fixedBody.mass = 0;
        // this.world.addBody(fixedBody);

        requestAnimationFrame(this.step.bind(this));
    }

    addSprite(sprite: Sprite) {
        this.sprites.push(sprite);
        this.world.addBody(sprite.body);
        this.element.appendChild(sprite.element);
    }

    step(time: number) {
        requestAnimationFrame(this.step.bind(this));
        if (this.lastTime) {
            const deltaTime = (time - this.lastTime) / 1000;
            this.world.step(1/60, deltaTime, 10);
            this.sprites.forEach(sprite => sprite.update());
        }
        this.lastTime = time;
    }
}