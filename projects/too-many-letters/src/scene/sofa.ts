import {WIDTH, HEIGHT} from '../constants';
import {World} from '../phys/world';
import {ConvexPolygon} from '../phys/shape';

export class SofaScene {
    readonly world: World;

    constructor() {
        const view = document.getElementById('view');
        if (!view) throw new Error('no view');
        const bg = document.getElementById('bg');
        if (!bg) throw new Error('no bg');
        (bg as HTMLImageElement).src = require('../../data/sofa.svg');

        this.world = new World({
            width: WIDTH,
            height: HEIGHT,
            fixedShapes: [
                new ConvexPolygon([
                    [0, 598], [81, 580], [142, 620], [198, 800], [0, 800],
                ]), new ConvexPolygon([
                    [0, 692], [1200, 692], [1200, 800], [0, 800],
                ]), new ConvexPolygon([
                    [1200, 595], [1200, 800], [1010, 800], [1065, 630], [1120, 586],
                ])
            ]
        });

        view.appendChild(this.world.element);
    }
}