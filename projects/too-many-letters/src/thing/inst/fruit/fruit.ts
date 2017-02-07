require('./fruit.css');

import {ImageThingerator, ImageConfig} from '../../util/image';
import {ConvexPolygon, Circle, Rectangle, Shape} from '../../../phys/shape';
import {ThingConfig, Thing, ThingeratorConfig, Thingerator} from '../../gen';

const DEFAULT_FONT = "40px 'Paytone One', sans-serif";
const WHITE = '#fff';
const BLACK = '#000';
const GREEN = '#1a2';
const DKBLUE = '#206';
const DKGREEN = '#051';
const DKRED = '#410';

const imageContext = require.context('./images', false, /\.svg$/);

export interface FruitImageConfig {
    name: string;
    shapes: Shape[];
    textFillColor: string;
    textStrokeColor: string;
    textRect: Rectangle;
};

const FRUITS: FruitImageConfig[] = [
    {
        name: 'apple',
        textFillColor: WHITE,
        textStrokeColor: BLACK,
        textRect: new Rectangle([11, 10], 40, 36),
        shapes: [new ConvexPolygon([
            [2, 25], [15, 2], [49, 2], [60, 25], [45, 59], [15, 59],
        ])],
    },
    {
        name: 'banana',
        textFillColor: GREEN,
        textStrokeColor: BLACK,
        textRect: new Rectangle([50, 44], 112, 36),
        shapes: [new ConvexPolygon([
            [0, 41], [212, 41], [180, 72], [137, 86], [80, 86], [20, 67],
        ]), new ConvexPolygon([
            [155, 54], [211, 3], [220, 6], [212, 41], [189, 59],
        ]), new ConvexPolygon([
            [0, 41], [10, 27], [92, 49], [16, 61],
        ])],
    },
    {
        name: 'orange',
        textFillColor: WHITE,
        textStrokeColor: BLACK,
        textRect: new Rectangle([10, 10], 40, 36),
        shapes: [new Circle([30, 30], 29)],
    },
    {
        name: 'strawberry',
        textFillColor: WHITE,
        textStrokeColor: BLACK,
        textRect: new Rectangle([10, 12], 40, 36),
        shapes: [new ConvexPolygon([
            [0, 17], [27, 3], [35, 3], [60, 17], [53, 46], [40, 59], [20, 59], [6, 46],
        ])],
    },
    {
        name: 'pear',
        textFillColor: DKBLUE,
        textStrokeColor: WHITE,
        textRect: new Rectangle([10, 34], 40, 36),
        shapes: [new ConvexPolygon([
            [0, 54], [27, 4], [31, 4], [60, 54], [57, 72], [40, 79], [22, 79], [3, 72],
        ])],
    },
    {
        name: 'pineapple',
        textFillColor: DKGREEN,
        textStrokeColor: WHITE,
        textRect: new Rectangle([6, 24], 109, 36),
        shapes: [new ConvexPolygon([
            [98, 45], [133, 12], [156, 18], [164, 45], [163, 68], [140, 74],
        ]), new ConvexPolygon([
            [1, 45], [9, 13], [40, 1], [97, 7], [135, 45], [95, 81], [41, 88], [12, 77],
        ])],
    },
    {
        name: 'grapes',
        textFillColor: WHITE,
        textStrokeColor: BLACK,
        textRect: new Rectangle([10, 26], 77, 36),
        shapes: [new ConvexPolygon([
            [0, 38], [12, 20], [45, 9], [86, 19], [100, 34], [61, 114], [38, 114],
        ])],
    },
    {
        name: 'peach',
        textFillColor: DKRED,
        textStrokeColor: WHITE,
        textRect: new Rectangle([11, 10], 40, 36),
        shapes: [new ConvexPolygon([
            [9, 7], [53, 7], [60, 31], [51, 53], [32, 58], [10, 52], [2, 28],
        ])],
    },
    {
        name: 'lemon',
        textFillColor: DKGREEN,
        textStrokeColor: WHITE,
        textRect: new Rectangle([11, 10], 40, 36),
        shapes: [new ConvexPolygon([
            [4, 26], [21, 6], [54, 3], [57, 37], [35, 57], [3, 57],
        ])],
    },
];

export interface FruitThingeratorConfig extends ThingeratorConfig {
    font?: string;
}

export class FruitThingerator extends ImageThingerator {
    private readonly config: FruitThingeratorConfig;

    constructor(config: FruitThingeratorConfig) {
        super({
            font: config.font || DEFAULT_FONT,
            ...config
        });
        this.config = config;
    }

    generate(thingConfig: ThingConfig): Thing {
        const fruitImageConfig = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        const imageConfig = {
            url: imageContext(`./${fruitImageConfig.name}.svg`),
            ...fruitImageConfig,
        }
        return this.generateImage(imageConfig, thingConfig);
    }
}