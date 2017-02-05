export interface Shape {
}

export interface Point {
    x: number;
    y: number;
}

export interface CircleConfig {
    center: Point;
    radius: number;
}

export class Circle implements Shape {
    center: Point;
    radius: number;

    constructor(config: CircleConfig) {
        this.center = config.center;
        this.radius = config.radius;
    }
}

export interface ConvexPolygonConfig {
    points: Array<Point>;
}

export class ConvexPolygon implements Shape {
    points: Array<Point>;

    constructor(config: ConvexPolygonConfig) {
        this.points = config.points;
    }
}

export interface RectangleConfig {
    topLeft: Point;
    width: number;
    height: number;
}

export class Rectangle extends ConvexPolygon {
    topLeft: Point;
    width: number;
    height: number;

    constructor(config: RectangleConfig) {
        const {topLeft, width, height} = config;
        const bottomRight = {
            x: topLeft.x + width,
            y: topLeft.y + height,
        };
        super({
            points: [
                topLeft,
                {x: bottomRight.x, y: topLeft.y},
                bottomRight,
                {x: topLeft.x, y: bottomRight.y},
            ]
        });
        this.topLeft = topLeft;
        this.width = width;
        this.height = height;
    }
}
