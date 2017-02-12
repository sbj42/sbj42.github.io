require('./fruit.css');

import {ImageThingerator, ImageConfig} from '../../util/image';
import {ConvexPolygon, Circle, Rectangle, Shape} from '../../../phys/shape';
import {ThingConfig, Thing, ThingeratorConfig, Thingerator} from '../../gen';
import {getTextExtent} from '../../../util/text-extent';

const FIT_LIMIT = 0.6;

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
        textRect: new Rectangle([10, 10], 39, 36),
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
        textRect: new Rectangle([8, 12], 38, 36),
        shapes: [new ConvexPolygon([
            [0, 17], [27, 3], [35, 3], [60, 17], [53, 46], [40, 59], [20, 59], [6, 46],
        ])],
    },
    {
        name: 'pear',
        textFillColor: DKBLUE,
        textStrokeColor: WHITE,
        textRect: new Rectangle([9, 34], 38, 36),
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
        textRect: new Rectangle([9, 10], 39, 36),
        shapes: [new ConvexPolygon([
            [9, 7], [53, 7], [60, 31], [51, 53], [32, 58], [10, 52], [2, 28],
        ])],
    },
    {
        name: 'lemon',
        textFillColor: DKGREEN,
        textStrokeColor: WHITE,
        textRect: new Rectangle([10, 10], 38, 36),
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
    private readonly font: string;

    constructor(config: FruitThingeratorConfig) {
        const font = config.font || DEFAULT_FONT;
        super({
            font,
            ...config
        });
        this.config = config;
        this.font = font;
    }

    generate(thingConfig: ThingConfig): Thing {
        const {word} = thingConfig;
        const extent = getTextExtent(word.text, this.font);
        let fruits = FRUITS.filter(fruitImageConfig => {
            const ratio = fruitImageConfig.textRect.width / extent.width;
            return ratio > FIT_LIMIT;
        });
        let fruitImageConfig;
        if (fruits.length == 0) {
            fruits = FRUITS.slice();
            fruits.sort((a, b) => b.textRect.width - a.textRect.width);
            fruitImageConfig = fruits[0];
        } else 
            fruitImageConfig = fruits[Math.floor(Math.random() * fruits.length)];
        const imageConfig = {
            url: imageContext(`./${fruitImageConfig.name}.svg`),
            deadUrl: imageContext(`./${fruitImageConfig.name}-chomp.svg`),
            hitStrokeColor: '#fff',
            hitFillColor: '#f00',
            ...fruitImageConfig,
        }
        return this.generateImage(imageConfig, thingConfig);
    }

    signText(): [string, string] {
        return [`There is too much`, `fruit`];
    }
}