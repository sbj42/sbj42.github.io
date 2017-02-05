import {Point, Shape, Circle, ConvexPolygon} from './shape';
import * as p2 from 'p2';

declare module 'p2' {
    export interface ConvexOptions extends SharedShapeOptions {
        // missing declaration in @types/p2:
        vertices?: number[][];
    }
    export interface BodyOptions {
        id?: number
    }
    export interface Convex {
        updateTriangles: () => void;
    }
}

export interface BodyConfig {
    position: Point;
    shapes: Array<Shape>;
}

export function makeBody(config: BodyConfig) {
    const shapes: Array<p2.Shape> = config.shapes.map(shape => {
        if (shape instanceof Circle) {
            return new p2.Circle({
                position: [shape.center.x, shape.center.y],
                radius: shape.radius,
            });
        } else if (shape instanceof ConvexPolygon) {
            const ret = new p2.Convex({
                vertices: shape.points.map(point => [point.x, point.y]),
            });
            ret.vertices = ret.vertices.map(vertex => [vertex[0] - ret.centerOfMass[0], vertex[1] - ret.centerOfMass[1]]);
            ret.position = [ret.position[0] + ret.centerOfMass[0], ret.position[1] + ret.centerOfMass[1]];
            ret.updateTriangles();
            return ret;
        } else {
            throw new Error('shape type');
        }
    });
    const position = [config.position.x, config.position.y];

    const body = new p2.Body({
        mass: 1,
        position,
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
        this.offset = {x: this.body.position[0] - config.position.x, y: this.body.position[1] - config.position.y};
        this.update();
    }

    update() {
        this.element.style.left = `${this.body.position[0] - this.offset.x}px`;
        this.element.style.top = `${this.body.position[1] - this.offset.y}px`;
        this.element.style.transformOrigin = `${this.offset.x}px ${this.offset.y}px`;
        this.element.style.transform = `rotate(${this.body.angle}rad)`;
    }
}