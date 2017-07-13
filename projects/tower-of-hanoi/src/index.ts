import './style.css'

function getLetter(num: number) {
    return 'ASDFGHJKL'[num];
}
function getNumber(str: string) {
    return 'ASDFGHJKL'.indexOf(str);
}

class Game {
    readonly pegs: number;
    readonly disks: number;

    diskPegs: number[];
    goal: string;
    moves: number;

    selectedDisk: number = null;

    constructor(pegs: number, disks: number) {
        this.pegs = pegs;
        this.disks = disks;
        this.diskPegs = new Array(this.disks).fill(pegs - 1);
        this.goal = this.stateString();
        this.moves = 0;
        document.getElementById('goal').innerHTML = this.goal;
        document.getElementById('moves').innerHTML = String(this.moves);
        this.diskPegs = new Array(this.disks).fill(0);

        const gameDiv = document.getElementById('game');
        gameDiv.innerHTML = '';
        for (let i = 0; i < this.pegs; i ++) {
            const pegDiv = document.createElement('div');
            pegDiv.id = `peg_${i}`;
            pegDiv.className = 'peg';
            const spindle = document.createElement('div');
            spindle.className = 'spindle';
            pegDiv.appendChild(spindle);
            const base = document.createElement('div');
            base.className = 'base';
            pegDiv.appendChild(base);
            const label = document.createElement('div');
            label.className = 'label';
            label.innerHTML = getLetter(i);
            pegDiv.onclick = (event) => {
                this.selectPeg(i);
                event.preventDefault();
                event.cancelBubble = true;
                return false;
            };
            pegDiv.appendChild(label);
            gameDiv.appendChild(pegDiv);
        }
        for (let i = 0; i < this.disks; i ++) {
            const peg = this.diskPegs[i];
            const pegDiv = document.getElementById(`peg_${peg}`);
            const height = this.height(i);
            const diskDiv = document.createElement('div');
            diskDiv.id = `disk_${i}`;
            diskDiv.className = 'disk';
            diskDiv.style.left = `${100 - i * 10}px`;
            diskDiv.style.right = `${100 - i * 10}px`;
            diskDiv.style.background = `hsl(${i * 360 / (this.disks + 0.5)}, 80%, 40%)`;
            const label = document.createElement('div');
            label.className = 'label';
            label.innerHTML = String(i);
            diskDiv.appendChild(label);
            // diskDiv.onclick = (event) => {
            //     this.selectDisk(i);
            //     event.preventDefault();
            //     event.cancelBubble = true;
            //     return false;
            // };
            
            diskDiv.style.bottom = `${40 + height*20}px`;
            pegDiv.appendChild(diskDiv);
        }
        document.getElementById('state').innerHTML = this.stateString();
        document.getElementById('winner').innerHTML = '';
    }

    moveTo(disk: number, peg: number) {
        const top = this.topDisk(peg);
        if (top != -1 && top < disk)
            return;
        this.diskPegs[disk] = peg;
    }

    redraw() {
        for (let i = 0; i < this.disks; i ++) {
            const diskDiv = document.getElementById(`disk_${i}`);
            const peg = this.diskPegs[i];
            const pegDiv = document.getElementById(`peg_${peg}`);
            const height = this.height(i);
            
            diskDiv.style.bottom = `${40 + height*20}px`;
            pegDiv.appendChild(diskDiv);
        }
        const str = this.stateString();
        document.getElementById('state').innerHTML = str;
        this.moves ++;
        document.getElementById('moves').innerHTML = String(this.moves);
        if (str == this.goal) {
            document.getElementById('winner').innerHTML = 'Success!';
        }
    }

    selectDisk(disk: number) {
        if (this.selectedDisk !== null) {
            const diskDiv = document.getElementById(`disk_${this.selectedDisk}`);
            diskDiv.className = 'disk';
        }
        const diskDiv = document.getElementById(`disk_${disk}`);
        diskDiv.className = 'disk selected';
        this.selectedDisk = disk;
    }

    selectPeg(peg: number) {
        if (this.selectedDisk !== null) {
            this.moveTo(this.selectedDisk, peg);
            this.redraw();
            peg = this.diskPegs[this.selectedDisk];
            const diskDiv = document.getElementById(`disk_${this.selectedDisk}`);
            diskDiv.className = 'disk';
            const pegDiv = document.getElementById(`peg_${peg}`);
            pegDiv.appendChild(diskDiv);
            this.selectedDisk = null;
        } else {
            const top = this.topDisk(peg);
            if (top != -1)
                this.selectDisk(top);
        }
    }

    stateString() {
        const ret: string[] = [];
        for (let i = this.disks - 1; i >= 0; i --) {
            ret.push(getLetter(this.diskPegs[i]));
        }
        return ret.join('');
    }

    height(disk: number) {
        const peg = this.diskPegs[disk];
        let height = 0;
        for (let i = this.disks - 1; i > disk; i --) {
            if (this.diskPegs[i] === peg) {
                height ++;
            }
        }
        return height;
    }

    topDisk(peg: number) {
        for (let i = 0; i < this.disks; i ++) {
            if (this.diskPegs[i] === peg) {
                return i;
            }
        }
        return -1;
    }
}

let game: Game = null;

function start() {
    const disks = +(document.getElementById('disks') as HTMLInputElement).value;
    game = new Game(3, disks);
}

(document.getElementById('reset') as HTMLInputElement).onclick = start;
document.onkeypress = (event) => {
    if (!game)
        return;
    const num = getNumber(event.key.toUpperCase());
    if (num >= 0 && num < game.pegs)
        game.selectPeg(num);
};
start();