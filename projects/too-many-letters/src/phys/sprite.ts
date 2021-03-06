import {Point, Shape, Circle, ConvexPolygon} from './shape';
import * as p2 from 'p2';

export interface BodyConfig {
    fixedRotation?: boolean,
    position: Point;
    shapes: Shape[];
}

export function makeBody(config: BodyConfig) {
    const shapes: p2.Shape[] = config.shapes.map(shape => {
        if (shape instanceof Circle) {
            return new p2.Circle({
                position: shape.center,
                radius: shape.radius,
            });
        } else if (shape instanceof ConvexPolygon) {
            const ret = new p2.Convex({
                vertices: shape.points,
            });
            ret.vertices = ret.vertices.map(vertex => [vertex[0] - ret.centerOfMass[0], vertex[1] - ret.centerOfMass[1]]);
            ret.position = [ret.position[0] + ret.centerOfMass[0], ret.position[1] + ret.centerOfMass[1]];
            ret.updateTriangles();
            return ret;
        } else {
            throw new Error('shape type');
        }
    });
    const {position} = config;

    const body = new p2.Body({
        mass: 1,
        position,
        fixedRotation: config.fixedRotation
    });
    shapes.forEach(shape => body.addShape(shape, shape.position));
    body.setDensity(1);
    body.adjustCenterOfMass();
    return body;
}

export interface SpriteConfig extends BodyConfig {
    element: HTMLElement;
}

export class Sprite {
    element: HTMLElement;
    body: p2.Body;
    offset: Point;

    constructor(config: SpriteConfig) {
        const {element, position} = config;
        element.style.position = 'absolute';
        
        this.element = element;
        this.body = makeBody(config);
        this.offset = [this.body.position[0] - config.position[0], this.body.position[1] - config.position[1]];
        this.update();
    }

    bounds() {
        const aabb = this.body.getAABB();
        return {
            topLeft: aabb.lowerBound,
            width: aabb.upperBound[0] - aabb.lowerBound[0],
            height: aabb.upperBound[1] - aabb.lowerBound[1],
        };
    }

    setTopLeft(topLeft: Point) {
        const aabb = this.body.getAABB();
        this.body.position = [this.body.position[0] - aabb.lowerBound[0] + topLeft[0], this.body.position[1] - aabb.lowerBound[1] + topLeft[1]];
        this.body.aabbNeedsUpdate = true;
    }

    update() {
        this.element.style.left = `${this.body.position[0] - this.offset[0]}px`;
        this.element.style.top = `${this.body.position[1] - this.offset[1]}px`;
        this.element.style.transformOrigin = `${this.offset[0]}px ${this.offset[1]}px`;
        this.element.style.transform = `rotate(${this.body.angle}rad)`;
    }

    remove() {
        if (this.element.parentNode)
            this.element.parentNode.removeChild(this.element);
    }
}