import {WIDTH, HEIGHT} from '../constants';

require('./door.css');

export interface DoorConfig {
    signText: string;
}

const LIGHTX = -450;
const LIGHTY = -470;
const LIGHTSIZE = 1100;

export class Door {
    config: DoorConfig;

    door1: HTMLImageElement;
    door2: HTMLImageElement;
    sign: HTMLDivElement;
    hint: HTMLDivElement;
    lights: HTMLImageElement[];
    lightAngle: number[];

    interval: number;
    tickCount: number;

    openAmount: number;
    opening: boolean;
    onopen: () => void;

    constructor(config: DoorConfig) {
        this.config = config;

        const doorDiv = document.getElementById('door');
        if (!doorDiv) throw new Error('no door');

        this.door1 = document.createElement('img');
        this.door1.className = 'door_part';
        this.door1.style.height = `${HEIGHT}px`;
        this.door1.style.top = '0px';
        this.door1.src = require('./door1.svg');
        doorDiv.appendChild(this.door1);
        this.door2 = document.createElement('img');
        this.door2.className = 'door_part';
        this.door2.style.height = `${HEIGHT}px`;
        this.door2.style.top = '0px';
        this.door2.src = require('./door2.svg');
        doorDiv.appendChild(this.door2);

        this.sign = document.createElement('div');
        this.sign.className = 'door_sign';
        this.sign.style.top = `20px`;
        const signImage = document.createElement('img');
        signImage.className = 'door_sign_image';
        signImage.src = require('./door-sign.svg');
        this.sign.appendChild(signImage);
        const signText = document.createElement('div');
        signText.className = 'door_sign_text';
        signText.appendChild(document.createTextNode(this.config.signText));
        this.sign.appendChild(signText);
        doorDiv.appendChild(this.sign);

        this.hint = document.createElement('div');
        this.hint.className = 'door_hint';
        this.hint.innerHTML = 'Press any key to start';
        this.hint.style.opacity = '0';
        doorDiv.appendChild(this.hint);

        this.lights = [];
        this.lightAngle = [];
        const makeLight = (x: number, y: number, angle: number) => {
            const light = document.createElement('img');
            light.src = require('./door-light.svg');
            light.className = 'door_light';
            light.style.top = `${y}px`;
            light.style.left = `${x}px`;
            doorDiv.appendChild(light);
            this.lights.push(light);
            this.lightAngle.push(angle);
        };
        makeLight(LIGHTX, LIGHTY, 22);
        makeLight(WIDTH-LIGHTSIZE-LIGHTX, LIGHTY, 45 + 90);
        makeLight(LIGHTX, HEIGHT-LIGHTSIZE-LIGHTY, 67);
        makeLight(WIDTH-LIGHTSIZE-LIGHTX, HEIGHT-LIGHTSIZE-LIGHTY, 90 + 90);
        this.interval = setInterval(() => this.tick(), 20);
        this.tickCount = 0;
        this.opening = false;
        this.openAmount = 0;
    }

    tick() {
        if (this.opening) {
            this.openAmount += 3;
            if (this.openAmount >= 500) {
                if (this.onopen)
                    this.onopen();
                this.remove();
            }
            this.sign.style.top = `${20-this.openAmount}px`;
            this.door1.style.top = `${-this.openAmount}px`;
            this.door2.style.top = `${this.openAmount}px`;
        }
        for (let i = 0; i < this.lights.length; i ++) {
            const light = this.lights[i];
            const angle = this.lightAngle[i] += 5 + [0, 0.2, 0.3, 0.1][i];
            light.style.transform = `rotate(${angle}deg)`
        }
        this.lights[0].style.top = `${LIGHTY-this.openAmount}px`;
        this.lights[1].style.top = `${LIGHTY-this.openAmount}px`;
        this.lights[2].style.top = `${HEIGHT-LIGHTSIZE-LIGHTY+this.openAmount}px`;
        this.lights[3].style.top = `${HEIGHT-LIGHTSIZE-LIGHTY+this.openAmount}px`;
        const angle = Math.sin(this.tickCount / 10)*2;
        this.sign.style.transformOrigin = `250px 30px`;
        this.sign.style.transform = `rotate(${angle}deg)`;
        this.tickCount ++;
        if (this.opening) {
            this.hint.style.opacity = '0';
        } else if (this.tickCount > 50) {
            this.hint.style.opacity = '1';
        }
    }

    open(onopen: () => void) {
        this.opening = true;
        this.onopen = onopen;
    }

    remove() {
        const doorDiv = document.getElementById('door');
        if (!doorDiv) throw new Error('no door');
        doorDiv.innerHTML = '';
        clearInterval(this.interval);
    }
}