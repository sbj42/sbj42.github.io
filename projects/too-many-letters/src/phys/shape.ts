export interface Shape {
}

export type Point = [number, number];

export class Circle implements Shape {
    center: Point;
    radius: number;

    constructor(center: Point, radius: number) {
        this.center = center;
        this.radius = radius;
    }
}

export class ConvexPolygon implements Shape {
    points: Point[];

    constructor(points: Point[]) {
        this.points = points;
    }
}

export class Rectangle extends ConvexPolygon {
    topLeft: Point;
    width: number;
    height: number;

    constructor(topLeft: Point, width: number, height: number) {
        const x1 = topLeft[0];
        const y1 = topLeft[1];
        const x2 = x1 + width;
        const y2 = y1 + height;
        super([[x1, y1], [x2, y1], [x2, y2], [x1, y2]]);
        this.topLeft = topLeft;
        this.width = width;
        this.height = height;
    }
}
