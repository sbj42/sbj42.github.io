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
    export interface AABB {
        lowerBound: number[];
        upperBound: number[];
    }
}