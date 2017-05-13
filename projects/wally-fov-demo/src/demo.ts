import * as WallyFOV from 'wally-fov';
import * as EasyStar from 'easystarjs';

const demo = document.getElementById('canvas') as HTMLCanvasElement;
const context = demo.getContext('2d');
const width = 37;
const height = 19;
const tileImages = new Array<string[]>(width * height);

function index(x: number, y: number) {
    return y * width + x;
}

let map: WallyFOV.FieldOfViewMap;
let easystar: EasyStar.js;

function generateMap() {

    map = new WallyFOV.FieldOfViewMap(width, height);
    easystar = new EasyStar.js();
    const grid = new Array<number[]>();
    for (let y = 0; y < height; y ++) {
        grid.push(new Array<number>(width).fill(0));
    }
    easystar.enableDiagonals();
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0]);
    easystar.enableSync();

    const turnChance = 0.1;
    for (let i = 0; i < 50; i ++) {
        let x = Math.floor(Math.random() * (width - 2) + 1);
        let y = Math.floor(Math.random() * (height - 2) + 1);
        if (map.getWalls(x, y)) {
            continue;
        }
        let dir = Math.floor(Math.random() * 4) as WallyFOV.Direction;
        const len = Math.floor(Math.random() * 7 + 2);
        for (let j = 0; j < len; j ++) {
            if (x < 1 || x >= width-1 || y < 1 || y >= height-1)
                break;
            map.addWall(x, y, dir);
            const turn = Math.random();
            switch (dir) {
            case WallyFOV.Direction.NORTH:
                if (turn < turnChance) {
                    dir = WallyFOV.Direction.WEST;
                    x ++;
                    y --;
                } else if (turn > 1 - turnChance) {
                    dir = WallyFOV.Direction.EAST;
                } else {
                    x ++;
                }
                break;
            case WallyFOV.Direction.EAST:
                if (turn < turnChance) {
                    dir = WallyFOV.Direction.NORTH;
                    x ++;
                    y ++;
                } else if (turn > 1 - turnChance) {
                    dir = WallyFOV.Direction.SOUTH;
                } else {
                    y ++;
                }
                break;
            case WallyFOV.Direction.SOUTH:
                if (turn < turnChance) {
                    dir = WallyFOV.Direction.EAST;
                    x --;
                    y ++;
                } else if (turn > 1 - turnChance) {
                    dir = WallyFOV.Direction.WEST;
                } else {
                    x --;
                }
                break;
            case WallyFOV.Direction.WEST:
                if (turn < turnChance) {
                    dir = WallyFOV.Direction.SOUTH;
                    x --;
                    y --;
                } else if (turn > 1 - turnChance) {
                    dir = WallyFOV.Direction.NORTH;
                } else {
                    y --;
                }
                break;
            }
        }
    }

    const bodyChance = 0.08;
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            const walls = map.getWalls(x, y);
            if (walls === 0 && Math.random() < bodyChance) {
                map.addBody(x, y);
                grid[y][x] = 1;
            } else {
                let ok: EasyStar.Direction[] = [];
                if ((walls & WallyFOV.DirectionFlags.NORTH) === 0) {
                    ok.push(EasyStar.TOP);
                }
                if ((walls & WallyFOV.DirectionFlags.EAST) === 0) {
                    ok.push(EasyStar.RIGHT);
                }
                if ((walls & WallyFOV.DirectionFlags.SOUTH) === 0) {
                    ok.push(EasyStar.BOTTOM);
                }
                if ((walls & WallyFOV.DirectionFlags.WEST) === 0) {
                    ok.push(EasyStar.LEFT);
                }
                easystar.setDirectionalCondition(x, y, ok);
            }
        }
    }

}

function randomPlace() {
    let x: number;
    let y: number;
    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
    } while (map.getWalls(x, y) || map.getBody(x, y));
    return [x, y];
}

let px: number;
let py: number;

function start() {
    generateMap();
    [px, py] = randomPlace();
    tileImages.fill([]);
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            const walls = map.getWalls(x, y);
            const images = tileImages[index(x, y)] = [] as string[];
            if (Math.random() > 0.3) {
                images.push('grass' + Math.floor(1 + Math.random() * 3));
            }
            if ((walls & WallyFOV.DirectionFlags.NORTH) !== 0) {
                images.push('north');
            }
            if ((walls & WallyFOV.DirectionFlags.EAST) !== 0) {
                images.push('east');
            }
            if ((walls & WallyFOV.DirectionFlags.SOUTH) !== 0) {
                images.push('south');
            }
            if ((walls & WallyFOV.DirectionFlags.WEST) !== 0) {
                images.push('west');
            }
            if (map.getBody(x, y)) {
                images.push('box');
            }
            images.forEach((image) => {
                context.drawImage(tiles, imageOff[image] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            });
        }
    }
}

function render() {
    context.clearRect(0, 0, width * 32, height * 32);
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            const images = tileImages[index(x, y)];
            images.forEach((image) => {
                context.drawImage(tiles, imageOff[image] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            });
            if (x === px && y === py) {
                context.drawImage(tiles, imageOff['player'] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            }
        }
    }
    const fov = map.getFieldOfView(px, py, 15);
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            if (!fov.get(x, y)) {
                context.drawImage(tiles, imageOff['shadow'] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            }
        }
    }
}

const imageOff: {[id: string]: number} = {
    'grass1': 0,
    'grass2': 1,
    'grass3': 2,
    'north': 3,
    'east': 4,
    'south': 5,
    'west': 6,
    'player': 7,
    'box': 8,
    'shadow': 9,
};
const tiles = new Image();
tiles.src = './tiles.png';
tiles.onload = function() {

    start();

    let working = false;
    let path: {x: number, y: number}[] = null;

    function step() {

        if (path == null) {
            if (working) {
                easystar.calculate();
            } else {
                const [nx, ny] = randomPlace();
                working = true;
                easystar.findPath(px, py, nx, ny, function(p) {
                    path = p;
                    working = false;
                    requestAnimationFrame(step);
                });
                easystar.calculate();
                return;
            }
        } else if (path.length > 0) {
            const {x: nx, y: ny} = path.shift();
            px = nx;
            py = ny;
        } else {
            path = undefined;
        }

        render();
        setTimeout(() => requestAnimationFrame(step), 120);
    }

    requestAnimationFrame(step);

};