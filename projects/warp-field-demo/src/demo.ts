///<reference path="simplex-noise.d.ts" />

import 'babel-polyfill';
import * as WarpField from 'warp-field';
import * as EasyStar from 'easystarjs';
import SimplexNoise = require('simplex-noise');

const demo = document.getElementById('canvas') as HTMLCanvasElement;
const context = demo.getContext('2d');
const width = 37;
const height = 19;
let easystar: EasyStar.js;
let noise: SimplexNoise;
const lava = new Array<boolean[]>();

function index(x: number, y: number) {
    return y * width + x;
}

function generateMap(id: string) {
    const map = new WarpField.FieldOfViewMap(id, width, height, true);

    const turnChance = 0.1;
    const wallCount = map.id === '0' ? 60 : map.id === '1' ? 9 : 3;
    for (let i = 0; i < wallCount; i ++) {
        let x = Math.floor(Math.random() * (width - 2) + 1);
        let y = Math.floor(Math.random() * (height - 2) + 1);
        if (map.getWalls(x, y)) {
            continue;
        }
        let dir = Math.floor(Math.random() * 4) as WarpField.Direction;
        const len = map.id === '0' ? Math.floor(Math.random() * 5 + 1) : Math.floor(Math.random() * 7 + 5);
        for (let j = 0; j < len; j ++) {
            if (x < 1 || x >= width-1 || y < 1 || y >= height-1)
                break;
            map.addWall(x, y, dir);
            const turn = Math.random();
            switch (dir) {
            case WarpField.Direction.NORTH:
                if (turn < turnChance) {
                    dir = WarpField.Direction.WEST;
                    x ++;
                    y --;
                } else if (turn > 1 - turnChance) {
                    dir = WarpField.Direction.EAST;
                } else {
                    x ++;
                }
                break;
            case WarpField.Direction.EAST:
                if (turn < turnChance) {
                    dir = WarpField.Direction.NORTH;
                    x ++;
                    y ++;
                } else if (turn > 1 - turnChance) {
                    dir = WarpField.Direction.SOUTH;
                } else {
                    y ++;
                }
                break;
            case WarpField.Direction.SOUTH:
                if (turn < turnChance) {
                    dir = WarpField.Direction.EAST;
                    x --;
                    y ++;
                } else if (turn > 1 - turnChance) {
                    dir = WarpField.Direction.WEST;
                } else {
                    x --;
                }
                break;
            case WarpField.Direction.WEST:
                if (turn < turnChance) {
                    dir = WarpField.Direction.SOUTH;
                    x --;
                    y --;
                } else if (turn > 1 - turnChance) {
                    dir = WarpField.Direction.NORTH;
                } else {
                    y --;
                }
                break;
            }
        }
    }

    const bodyChance = map.id === '0' ? 0.04 : 0.08;
    for (let y = 0; y < height; y ++) {
        let lavaRow: boolean[];
        if (map.id === '2') {
            lavaRow = new Array<boolean>();
            lava.push(lavaRow);
        }
        for (let x = 0; x < width; x ++) {
            const walls = map.getWalls(x, y);
            if (map.id === '2') {
                lavaRow.push(noise.noise2D(x / 4, y / 4) < -0.4);
            } else {
                if (walls === 0 && Math.random() < bodyChance) {
                    map.addBody(x, y);
                }
            }
        }
    }
    return map;
}

function addWarp(map1: WarpField.FieldOfViewMap, map2: WarpField.FieldOfViewMap) {
    const l = 4;
    const dir = [WarpField.Direction.NORTH, WarpField.Direction.EAST, WarpField.Direction.SOUTH, WarpField.Direction.WEST][Math.floor(Math.random() * 4)];
    if (dir === WarpField.Direction.NORTH || dir === WarpField.Direction.SOUTH) {
        let x = Math.floor(Math.random() * (width - 2 - l) + 1);
        let y = Math.floor(Math.random() * (height - 2) + 1);
        let y2 = (dir === WarpField.Direction.NORTH) ? y - 1 : y + 1;
        for (let i = 0; i < l; i ++) {
            if (map1.getWarpFlags(x + i, y) || map2.getWarpFlags(x + i, y2)) {
                addWarp(map1, map2);
                return;
            }
        }
        map1.addWall(x, y, WarpField.Direction.WEST);
        //map2.addWall(x, y, WarpField.Direction.WEST);
        //map1.addWall(x, y2, WarpField.Direction.WEST);
        map2.addWall(x, y2, WarpField.Direction.WEST);
        for (let i = 0; i < l; i ++) {
            map1.removeBody(x, y);
            map1.removeWall(x, y, WarpField.Direction.NORTH);
            map1.removeWall(x, y, WarpField.Direction.EAST);
            map1.removeWall(x, y, WarpField.Direction.SOUTH);
            map2.removeBody(x, y2);
            map2.removeWall(x, y2, WarpField.Direction.NORTH);
            map2.removeWall(x, y2, WarpField.Direction.EAST);
            map2.removeWall(x, y2, WarpField.Direction.SOUTH);
            map1.addWarp(x, y, dir, map2, x, y2);
            map2.addWarp(x, y2, (dir + 2) & 3, map1, x, y);
            map1.addWall(x, y2, (dir + 2) & 3, true);
            map2.addWall(x, y, dir, true);
            //map2.addWarp(x, y, dir, map1, x, y2);
            //map1.addWarp(x, y2, (dir + 2) & 3, map2, x, y);
            x += 1;
        }
        map1.addWall(x - 1, y, WarpField.Direction.EAST);
        //map2.addWall(x - 1, y, WarpField.Direction.EAST);
        //map1.addWall(x - 1, y2, WarpField.Direction.EAST);
        map2.addWall(x - 1, y2, WarpField.Direction.EAST);
    } else {
        let x = Math.floor(Math.random() * (width - 2) + 1);
        let y = Math.floor(Math.random() * (height - 2 - l) + 1);
        let x2 = (dir === WarpField.Direction.WEST) ? x - 1 : x + 1;
        for (let i = 0; i < l; i ++) {
            if (map1.getWarpFlags(x, y + i) || map2.getWarpFlags(x2, y + i)) {
                addWarp(map1, map2);
                return;
            }
        }
        map1.addWall(x, y, WarpField.Direction.NORTH);
        //map2.addWall(x, y, WarpField.Direction.NORTH);
        //map1.addWall(x2, y, WarpField.Direction.NORTH);
        map2.addWall(x2, y, WarpField.Direction.NORTH);
        for (let i = 0; i < l; i ++) {
            map1.removeBody(x, y);
            map1.removeWall(x, y, WarpField.Direction.EAST);
            map1.removeWall(x, y, WarpField.Direction.SOUTH);
            map1.removeWall(x, y, WarpField.Direction.WEST);
            map2.removeBody(x2, y);
            map2.removeWall(x2, y, WarpField.Direction.EAST);
            map2.removeWall(x2, y, WarpField.Direction.SOUTH);
            map2.removeWall(x2, y, WarpField.Direction.WEST);
            map1.addWarp(x, y, dir, map2, x2, y);
            map2.addWarp(x2, y, (dir + 2) & 3, map1, x, y);
            map1.addWall(x2, y, (dir + 2) & 3, true);
            map2.addWall(x, y, dir, true);
            //map2.addWarp(x, y, dir, map1, x2, y);
            //map1.addWarp(x2, y, (dir + 2) & 3, map2, x, y);
            y += 1;
        }
        map1.addWall(x, y - 1, WarpField.Direction.SOUTH);
        //map2.addWall(x, y - 1, WarpField.Direction.SOUTH);
        //map1.addWall(x2, y - 1, WarpField.Direction.SOUTH);
        map2.addWall(x2, y - 1, WarpField.Direction.SOUTH);
    }
}

const map_count = 3;
let maps: WarpField.FieldOfViewMap[];

function generateMaps() {
    maps = new Array<WarpField.FieldOfViewMap>();
    for (let i = 0; i < map_count; i ++) {
        maps.push(generateMap(String(i)));
    }
    for (let i = 0; i < map_count; i ++) {
        for (let j = i + 1; j < map_count; j ++) {
            addWarp(maps[i], maps[j]);
            addWarp(maps[i], maps[j]);
            addWarp(maps[i], maps[j]);
        }
    }
}

function randomPlace() {
    let x: number;
    let y: number;
    const map = Math.floor(Math.random() * maps.length);
    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
    } while (maps[map].getWalls(x, y) || maps[map].getBody(x, y) || maps[map].getWarpFlags(x, y));
    return [map, x, y];
}

const tileRand = new Array<number>(width * height);

let pmap: number;
let px: number;
let py: number;

function start() {
    noise = new SimplexNoise();
    generateMaps();
    [pmap, px, py] = randomPlace();
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            tileRand[index(x, y)] = Math.random();
        }
    }
}

function drawImage(image: string, map: number, x: number, y: number) {
    context.drawImage(tiles, imageXOff[image] * 64, map * 64, 64, 64, x * 32 - 16, y * 32 - 16, 64, 64);
}

function render() {
    context.fillStyle = '#666';
    context.fillRect(0, 0, width * 32, height * 32);
    const fov = maps[pmap].getFieldOfView(px, py, 15);
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            if (!fov.getMask(x, y)) {
            } else {
                let map = fov.getMap(x, y);
                let mx = x, my = y;
                if (!map) {
                    map = maps[pmap];
                } else {
                    const offset = fov.getOffset(x, y);
                    mx = x + offset.x;
                    my = y + offset.y;
                }
                const mapId = parseInt(map.id);
                if (mapId === 0) {
                    context.fillStyle = '#aaf';
                } else if (mapId === 1) {
                    context.fillStyle = '#afa';
                } else {
                    context.fillStyle = '#faa';
                }
                context.fillRect(x * 32, y * 32, 32, 32);
                drawImage('floor' + Math.floor(1 + tileRand[index(x, y)] * 6), mapId, x, y);
                {
                    const walls = map.getWalls(mx, my);
                    if ((walls & WarpField.DirectionFlags.NORTH) !== 0) {
                        drawImage('north', mapId, x, y);
                    }
                    if ((walls & WarpField.DirectionFlags.EAST) !== 0) {
                        drawImage('east', mapId, x, y);
                    }
                    if ((walls & WarpField.DirectionFlags.SOUTH) !== 0) {
                        drawImage('south', mapId, x, y);
                    }
                    if ((walls & WarpField.DirectionFlags.WEST) !== 0) {
                        drawImage('west', mapId, x, y);
                    }
                }
                if (map.getBody(mx, my)) {
                    drawImage('box' + Math.floor(1 + tileRand[index(x, y)] * 3), mapId, x, y);
                }
                if (mapId === 2 && lava[my][mx]) {
                    drawImage('box' + Math.floor(1 + tileRand[index(x, y)] * 3), mapId, x, y);
                }
                {
                    const warps = map.getWarpFlags(mx, my);
                    if ((warps & WarpField.DirectionFlags.NORTH) !== 0) {
                        drawImage('warpnorth', mapId, x, y);
                    }
                    if ((warps & WarpField.DirectionFlags.EAST) !== 0) {
                        drawImage('warpeast', mapId, x, y);
                    }
                    if ((warps & WarpField.DirectionFlags.SOUTH) !== 0) {
                        drawImage('warpsouth', mapId, x, y);
                    }
                    if ((warps & WarpField.DirectionFlags.WEST) !== 0) {
                        drawImage('warpwest', mapId, x, y);
                    }
                }
            }
        }
    }
    drawImage('player', pmap, px, py);
    return fov;
}

const imageXOff: {[id: string]: number} = {
    'floor1': 0,
    'floor2': 1,
    'floor3': 2,
    'floor4': 3,
    'floor5': 4,
    'floor6': 5,
    'box1': 6,
    'box2': 7,
    'box3': 8,
    'north': 9,
    'east': 10,
    'south': 11,
    'west': 12,
    'warpnorth': 13,
    'warpeast': 14,
    'warpsouth': 15,
    'warpwest': 16,
    'player': 17
};
const tiles = new Image();
tiles.src = './tiles.png';
tiles.onload = function() {

    start();

    let working = false;
    let path: {x: number, y: number}[] = null;

    function step() {

        const fov = render();

        if (path == null) {
            if (working) {
                easystar.calculate();
            } else {
                const nextMapId = String((pmap + 1) % maps.length)
                for (let i = 0; i < 100; i ++) {
                    const [, nx, ny] = randomPlace();
                    if (fov.getMask(nx, ny)) {
                        let nmap = fov.getMap(nx, ny);
                        if (!nmap)
                            nmap = maps[pmap];
                        if (i < 10 && nmap.id !== nextMapId)
                            continue;
                        if (nmap.getBody(nx, ny))
                            continue;
                        if (nmap.id === '2' && lava[ny][nx])
                            continue;
                        easystar = new EasyStar.js();
                        easystar.setAcceptableTiles([0]);
                        let grid = new Array<number[]>();
                        for (let y = 0; y < height; y ++) {
                            let row = new Array<number>();
                            grid.push(row);
                            for (let x = 0; x < width; x ++) {
                                if (fov.getMask(x, y)) {
                                    let map = fov.getMap(x, y);
                                    if (!map) {
                                        map = maps[pmap];
                                    }
                                    if (map.getBody(x, y)) {
                                        row.push(1);
                                    } else {
                                        if (map.id === '2' && lava[y][x]) {
                                            row.push(1);
                                        } else {
                                            row.push(0);
                                        }
                                    }
                                } else {
                                    row.push(1);
                                }
                            }
                        }
                        easystar.setGrid(grid);
                        easystar.enableDiagonals();
                        easystar.enableSync();
                        for (let y = 0; y < height; y ++) {
                            for (let x = 0; x < width; x ++) {
                                if (fov.getMask(x, y)) {
                                    let map = fov.getMap(x, y);
                                    if (!map) {
                                        map = maps[pmap];
                                    }
                                    const walls = map.getWalls(x, y);
                                    if (walls !== 0) {
                                        let ok: EasyStar.Direction[] = [];
                                        if ((walls & WarpField.DirectionFlags.NORTH) === 0) {
                                            ok.push(EasyStar.TOP);
                                        }
                                        if ((walls & WarpField.DirectionFlags.EAST) === 0) {
                                            ok.push(EasyStar.RIGHT);
                                        }
                                        if ((walls & WarpField.DirectionFlags.SOUTH) === 0) {
                                            ok.push(EasyStar.BOTTOM);
                                        }
                                        if ((walls & WarpField.DirectionFlags.WEST) === 0) {
                                            ok.push(EasyStar.LEFT);
                                        }
                                        easystar.setDirectionalCondition(x, y, ok);
                                    }
                                }
                            }
                        }
                        working = true;
                        easystar.findPath(px, py, nx, ny, function(p) {
                            path = p;
                            working = false;
                            requestAnimationFrame(step);
                        });
                        easystar.calculate();
                        return;
                    }
                }
            }
        } else if (path.length > 0) {
            const {x, y} = path.shift();
            if (fov.getMask(x, y)) {
                let map = fov.getMap(x, y);
                if (map) {
                    pmap = parseInt(map.id);
                }
                px = x;
                py = y;
            }
        } else {
            path = undefined;
        }

        setTimeout(() => requestAnimationFrame(step), 120);
    }

    requestAnimationFrame(step);

};