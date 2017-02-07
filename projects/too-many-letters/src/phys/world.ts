require('./world.css');

import {Sprite, makeBody} from './sprite';
import {Shape} from './shape';

import * as p2 from 'p2';

const GRAVITY = 400;

export interface WorldConfig {
    width: number;
    height: number;
    fixedShapes?: Array<Shape>;
}

export class World {
    element: HTMLElement;
    width: number;
    height: number;

    world: p2.World;
    material: p2.Material;
    sprites: Sprite[] = [];

    lastTime: number;

    paused: boolean;

    private addPlane(position: number[], angle: number) {
        const body = new p2.Body({
            mass: 0,
            position,
            angle
        });
        const shape = new p2.Plane();
        shape.material = this.material;
        body.addShape(shape);
        this.world.addBody(body);
    }

    constructor(config: WorldConfig) {
        const {width, height} = config;
        this.element = document.createElement('div');
        this.element.className = 'world';
        this.width = width;
        this.height = height;
        this.world = new p2.World({
            gravity: [0, GRAVITY]
        });
        this.material = new p2.Material(1);
        this.world.addContactMaterial(new p2.ContactMaterial(this.material, this.material, {
            friction: 1,
            stiffness: 100000000000,
            restitution: 0.1,
        } as p2.ContactMaterialOptions));
        this.addPlane([0, height-1], - Math.PI);
        this.addPlane([1, 0], - Math.PI / 2);
        this.addPlane([width-1, 0], Math.PI / 2);
        if (config.fixedShapes) {
            const fixedBody = makeBody({
                position: [0, 0],
                shapes: config.fixedShapes
            });
            fixedBody.type = p2.Body.STATIC;
            fixedBody.updateMassProperties();
            fixedBody.shapes.forEach(shape => shape.material = this.material);
            this.world.addBody(fixedBody);
        }
        this.paused = false;

        requestAnimationFrame(this.step.bind(this));
    }

    addSprite(sprite: Sprite) {
        this.sprites.push(sprite);
        sprite.body.shapes.forEach(shape => shape.material = this.material);
        this.world.addBody(sprite.body);
        this.element.appendChild(sprite.element);
    }

    step(time: number) {
        if (this.paused)
            return;
        requestAnimationFrame(this.step.bind(this));
        if (this.lastTime) {
            const deltaTime = (time - this.lastTime) / 1000;
            this.world.step(1/60, deltaTime, 10);
            this.sprites.forEach(sprite => sprite.update());
        }
        this.lastTime = time;
    }

    pause() {
        this.paused = true;
    }

    play() {
        if (!this.paused)
            return;
        this.paused = false;
        delete this.lastTime;
        requestAnimationFrame(this.step.bind(this));
    }
}