require('./world.css');

import {Sprite, makeBody} from './sprite';
import {Shape} from './shape';

import * as p2 from 'p2';

const GRAVITY = 800;

export interface WorldConfig {
    width: number;
    height: number;
    bounciness?: number;
    fixedShapes?: Array<Shape>;
}

export class World {
    config: WorldConfig;
    element: HTMLElement;

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
        this.config = config;
        this.element = document.createElement('div');
        this.element.className = 'world';
        this.world = new p2.World({
            gravity: [0, GRAVITY]
        });
        this.material = new p2.Material(1);
        this.world.addContactMaterial(new p2.ContactMaterial(this.material, this.material, {
            friction: 1,
            stiffness: 100000000000,
            restitution: this.config.bounciness || 0.1,
        } as p2.ContactMaterialOptions));
        this.addPlane([0, this.config.height-1], - Math.PI);
        this.addPlane([1, 0], - Math.PI / 2);
        this.addPlane([this.config.width-1, 0], Math.PI / 2);
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

    checkOverlap(sprite: Sprite) {
        sprite.body.aabbNeedsUpdate = true;
        const aabb = sprite.body.getAABB();
        if (aabb.lowerBound[0] < 0) return true;
        if (aabb.upperBound[0] > this.config.width) return true;
        //if (aabb.lowerBound[1] < 0) return true;
        if (aabb.upperBound[1] > this.config.height) return true;
        return this.world.bodies.some(body => {
            if (body.shapes.some(shape => shape instanceof p2.Plane))
                return false;
            return aabb.overlaps(body.getAABB());
        });
    }

    addSprite(sprite: Sprite) {
        this.sprites.push(sprite);
        sprite.body.shapes.forEach(shape => shape.material = this.material);
        this.world.addBody(sprite.body);
        this.element.appendChild(sprite.element);
    }

    removeSprite(sprite: Sprite) {
        sprite.remove();
        this.world.removeBody(sprite.body);
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