import './style.css'

class Game {
    readonly pegs: number;
    readonly disks: number;

    diskPegs: number[];
    goal: string;
    moves: number;

    selectedDisk: number = null;

    constructor(pegs: number, disks: number, rules: string) {
        this.pegs = pegs;
        this.disks = disks;
        this.moves = 0;
        this.setGoal();
        document.getElementById('moves').innerHTML = String(this.moves);
        document.getElementById('rules').innerHTML = rules;
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
            label.innerHTML = this.getLetter(i);
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

    setGoal() {
        this.diskPegs = new Array(this.disks).fill(this.pegs - 1);
        this.goal = this.stateString();
        document.getElementById('goal').innerHTML = this.goal;
    }

    getLetter(num: number) {
        return 'ASDFGHJKL'[num];
    }

    getNumber(str: string) {
        return 'ASDFGHJKL'.indexOf(str);
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
            const npeg = this.diskPegs[this.selectedDisk];
            const diskDiv = document.getElementById(`disk_${this.selectedDisk}`);
            diskDiv.className = 'disk';
            this.selectedDisk = null;
            if (peg === npeg) {
                this.moves ++;
                this.redraw();
                const pegDiv = document.getElementById(`peg_${npeg}`);
                pegDiv.appendChild(diskDiv);
            }
        } else {
            const top = this.topDisk(peg);
            if (top != -1)
                this.selectDisk(top);
        }
    }

    stateString() {
        const ret: string[] = [];
        for (let i = this.disks - 1; i >= 0; i --) {
            ret.push(this.getLetter(this.diskPegs[i]));
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

class AdjacentGame extends Game {
    moveTo(disk: number, peg: number) {
        const cur = this.diskPegs[disk];
        if (Math.abs(cur - peg) !== 1)
            return;
        const top = this.topDisk(peg);
        if (top != -1 && top < disk)
            return;
        this.diskPegs[disk] = peg;
    }
}

class CyclicGame extends Game {
    moveTo(disk: number, peg: number) {
        const cur = this.diskPegs[disk];
        if (((cur + 1) % this.pegs) !== peg)
            return;
        const top = this.topDisk(peg);
        if (top != -1 && top < disk)
            return;
        this.diskPegs[disk] = peg;
    }
}

class SwappingGame extends Game {
    moveTo(disk: number, peg: number) {
        if (disk === 0) {
            this.diskPegs[disk] = peg;
            return;
        }
        const cur = this.diskPegs[disk];
        const top = this.topDisk(peg);
        if (disk !== 0 && top !== disk - 1)
            return;
        this.diskPegs[top] = cur;
        this.diskPegs[disk] = peg;
    }
}

class SpecialGame extends Game {
    constructor(pegs: number, disks: number, rules: string) {
        super(pegs + 1, disks, rules);
    }
    setGoal() {
        this.diskPegs = new Array(this.disks).fill(this.pegs - 2);
        this.goal = this.stateString();
        document.getElementById('goal').innerHTML = this.goal;
    }
    getLetter(num: number) {
        if (num === this.pegs - 1)
            return 'X';
        return 'ASDFGHJKL'[num];
    }
    getNumber(str: string) {
        if (str === 'X')
            return this.pegs - 1;
        return 'ASDFGHJKL'.indexOf(str);
    }
    moveTo(disk: number, peg: number) {
        const cur = this.diskPegs[disk];
        const top = this.topDisk(peg);
        if (top !== -1 && top < disk)
            return;
        if (peg !== this.pegs - 1 && cur !== this.pegs - 1)
            return;
        this.diskPegs[disk] = peg;
    }
}

let game: Game = null;

function start() {
    const variation = (document.getElementById('variation') as HTMLInputElement).value;
    const disks = +(document.getElementById('disks') as HTMLInputElement).value;
    const pegs = +(document.getElementById('pegs') as HTMLInputElement).value;
    if (variation === 'standard') {
        game = new Game(pegs, disks, `
            <b>Standard Tower of Hanoi</b> <a href="https://en.wikipedia.org/wiki/Tower_of_Hanoi">(see wikipedia)</a><br/>
            You can only move the top disk from one of the stacks.<br/>
            You can't put a disk on top of a smaller disk.
        `);
    } else if (variation === 'adjacent') {
        game = new AdjacentGame(pegs, disks, `
            <b>Adjacent Tower of Hanoi</b> <a href="http://www.cs.wm.edu/~pkstoc/boca.pdf">(see 'The Four-in-a-Row Puzzle' here)<br/>
            You can only move the top disk from one of the stacks.<br/>
            You can't put a disk on top of a smaller disk.<br/>
            A disk can only move to an adjacent peg.
        `);
    } else if (variation === 'cyclic') {
        game = new CyclicGame(pegs, disks, `
            <b>Cyclic Tower of Hanoi</b> <a href="https://en.wikipedia.org/wiki/Tower_of_Hanoi#Cyclic_Hanoi">(see wikipedia)</a><br/>
            You can only move the top disk from one of the stacks.<br/>
            You can't put a disk on top of a smaller disk.<br/>
            A disk can only move to the next peg on the right (or to the first peg from the last).
        `);
    } else if (variation === 'swapping') {
        game = new SwappingGame(pegs, disks, `
            <b>Swapping Tower of Hanoi</b> <a href="http://www.cs.wm.edu/~pkstoc/gov.pdf">(see this paper)</a><br/>
            Disk 0 can move to any peg.<br/>
            Other disks can only be swapped with the next smallest disk, if each is at the top of its stack.<br/>
        `);
    } else if (variation === 'special') {
        game = new SpecialGame(pegs, disks, `
            <b>Special-Peg Tower of Hanoi</b> <a href="http://www.cs.wm.edu/~pkstoc/boca.pdf">(see 'The Star Puzzle' here)</a><br/>
            You can only move the top disk from one of the stacks.<br/>
            You can't put a disk on top of a smaller disk.<br/>
            Every move must involve peg X.
        `);
    }
}

(document.getElementById('reset') as HTMLInputElement).onclick = start;
document.onkeypress = (event) => {
    if (!game)
        return;
    const num = game.getNumber(event.key.toUpperCase());
    if (num >= 0 && num < game.pegs)
        game.selectPeg(num);
};
start();