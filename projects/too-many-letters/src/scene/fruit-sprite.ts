declare function require(path: string): string;
require('./fruit-sprite.css');

import {ImgSpriteConfig, makeImgSprite} from './img-sprite';

import {ConvexPolygon, Circle} from '../phys/shape';

const FONT = "40px 'Paytone One', sans-serif";
const WHITE = '#fff';
const BLACK = '#000';
const GREEN = '#1a2';
const DKBLUE = '#206';
const DKGREEN = '#051';
const DKRED = '#410';

const SVG_APPLE = require('../../data/fruit/apple.svg');
const SVG_APPLE_CHOMP = require('../../data/fruit/apple-chomp.svg');
const SVG_BANANA = require('../../data/fruit/banana.svg');
const SVG_BANANA_CHOMP = require('../../data/fruit/banana-chomp.svg');
const SVG_ORANGE = require('../../data/fruit/orange.svg');
const SVG_ORANGE_CHOMP = require('../../data/fruit/orange-chomp.svg');
const SVG_STRAWBERRY = require('../../data/fruit/strawberry.svg');
const SVG_STRAWBERRY_CHOMP = require('../../data/fruit/strawberry-chomp.svg');
const SVG_PEAR = require('../../data/fruit/pear.svg');
const SVG_PEAR_CHOMP = require('../../data/fruit/pear-chomp.svg');
const SVG_PINEAPPLE = require('../../data/fruit/pineapple.svg');
const SVG_PINEAPPLE_CHOMP = require('../../data/fruit/pineapple-chomp.svg');
const SVG_GRAPES = require('../../data/fruit/grapes.svg');
const SVG_GRAPES_CHOMP = require('../../data/fruit/grapes-chomp.svg');
const SVG_PEACH = require('../../data/fruit/peach.svg');
const SVG_PEACH_CHOMP = require('../../data/fruit/peach-chomp.svg');
const SVG_LEMON = require('../../data/fruit/lemon.svg');
const SVG_LEMON_CHOMP = require('../../data/fruit/lemon-chomp.svg');

export interface FruitConfig extends ImgSpriteConfig {
    textLength: number,
    chompUrl: string,
};

const FRUITS: FruitConfig[] = [
    {
        url: SVG_APPLE,
        chompUrl: SVG_APPLE_CHOMP,
        textLength: 1,

        font: FONT,
        textFillColor: WHITE,
        textStrokeColor: BLACK,
        textTopLeft: {x: 12, y: 10},
        textWidth: 40,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new ConvexPolygon({
            points: [
                {x: 2, y: 25},
                {x: 15, y: 2},
                {x: 49, y: 2},
                {x: 60, y: 25},
                {x: 45, y: 59},
                {x: 15, y: 59},
            ]
        })],
    },
    {
        url: SVG_BANANA,
        chompUrl: SVG_BANANA_CHOMP,
        textLength: 4,

        font: FONT,
        textFillColor: GREEN,
        textStrokeColor: BLACK,
        textTopLeft: {x: 50, y: 44},
        textWidth: 112,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new ConvexPolygon({
            points: [
                {x: 0, y: 41},
                {x: 212, y: 41},
                {x: 180, y: 72},
                {x: 137, y: 86},
                {x: 80, y: 86},
                {x: 20, y: 67},
            ]
        }), new ConvexPolygon({
            points: [
                {x: 155, y: 54},
                {x: 211, y: 3},
                {x: 220, y: 6},
                {x: 212, y: 41},
                {x: 189, y: 59},
            ]
        }), new ConvexPolygon({
            points: [
                {x: 0, y: 41},
                {x: 10, y: 27},
                {x: 92, y: 49},
                {x: 16, y: 61},
            ]
        })],
    },
    {
        url: SVG_ORANGE,
        chompUrl: SVG_ORANGE_CHOMP,
        textLength: 1,

        font: FONT,
        textFillColor: WHITE,
        textStrokeColor: BLACK,
        textTopLeft: {x: 10, y: 10},
        textWidth: 40,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new Circle({
            center: {x: 30, y: 30},
            radius: 29
        })],
    },
    {
        url: SVG_STRAWBERRY,
        chompUrl: SVG_STRAWBERRY_CHOMP,
        textLength: 1,

        font: FONT,
        textFillColor: WHITE,
        textStrokeColor: BLACK,
        textTopLeft: {x: 10, y: 10},
        textWidth: 40,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new ConvexPolygon({
            points: [
                {x: 0, y: 17},
                {x: 27, y: 3},
                {x: 35, y: 3},
                {x: 60, y: 17},
                {x: 53, y: 46},
                {x: 40, y: 59},
                {x: 20, y: 59},
                {x: 6, y: 46},
            ]
        })],
    },
    {
        url: SVG_PEAR,
        chompUrl: SVG_PEAR_CHOMP,
        textLength: 1,

        font: FONT,
        textFillColor: DKBLUE,
        textStrokeColor: WHITE,
        textTopLeft: {x: 10, y: 34},
        textWidth: 40,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new ConvexPolygon({
            points: [
                {x: 0, y: 54},
                {x: 27, y: 4},
                {x: 31, y: 4},
                {x: 60, y: 54},
                {x: 57, y: 72},
                {x: 40, y: 79},
                {x: 22, y: 79},
                {x: 3, y: 72},
            ]
        })],
    },
    {
        url: SVG_PINEAPPLE,
        chompUrl: SVG_PINEAPPLE_CHOMP,
        textLength: 1,

        font: FONT,
        textFillColor: DKGREEN,
        textStrokeColor: WHITE,
        textTopLeft: {x: 6, y: 24},
        textWidth: 109,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new ConvexPolygon({
            points: [
                {x: 98, y: 45},
                {x: 133, y: 12},
                {x: 156, y: 18},
                {x: 164, y: 45},
                {x: 163, y: 68},
                {x: 140, y: 74},
            ]
        }), new ConvexPolygon({
            points: [
                {x: 1, y: 45},
                {x: 9, y: 13},
                {x: 40, y: 1},
                {x: 97, y: 7},
                {x: 135, y: 45},
                {x: 95, y: 81},
                {x: 41, y: 88},
                {x: 12, y: 77},
            ]
        })],
    },
    {
        url: SVG_GRAPES,
        chompUrl: SVG_GRAPES_CHOMP,
        textLength: 1,

        font: FONT,
        textFillColor: WHITE,
        textStrokeColor: BLACK,
        textTopLeft: {x: 10, y: 26},
        textWidth: 77,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new ConvexPolygon({
            points: [
                {x: 0, y: 38},
                {x: 12, y: 20},
                {x: 45, y: 9},
                {x: 86, y: 19},
                {x: 100, y: 34},
                {x: 61, y: 114},
                {x: 38, y: 114},
            ]
        })],
    },
    {
        url: SVG_PEACH,
        chompUrl: SVG_PEACH_CHOMP,
        textLength: 1,

        font: FONT,
        textFillColor: DKRED,
        textStrokeColor: WHITE,
        textTopLeft: {x: 11, y: 10},
        textWidth: 40,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new ConvexPolygon({
            points: [
                {x: 9, y: 7},
                {x: 53, y: 7},
                {x: 60, y: 31},
                {x: 51, y: 53},
                {x: 32, y: 58},
                {x: 10, y: 52},
                {x: 2, y: 28},
            ]
        })],
    },
    {
        url: SVG_LEMON,
        chompUrl: SVG_LEMON_CHOMP,
        textLength: 1,

        font: FONT,
        textFillColor: DKGREEN,
        textStrokeColor: WHITE,
        textTopLeft: {x: 11, y: 10},
        textWidth: 40,
        textHeight: 36,
        //fixedRotation: true,
        shapes: [new ConvexPolygon({
            points: [
                {x: 4, y: 26},
                {x: 21, y: 6},
                {x: 54, y: 3},
                {x: 57, y: 37},
                {x: 35, y: 57},
                {x: 3, y: 57},
            ]
        })],
    },
];

export function makeFruitSprite(x: number, y: number, text: string) {
    const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    return makeImgSprite(fruit, x, y, text);
}