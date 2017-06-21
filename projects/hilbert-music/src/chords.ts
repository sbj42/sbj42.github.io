import {
    onChord,
    onOut,
} from './event';

const chords = document.getElementById('chords');
chords.innerHTML = 'Chords (hold down):<br/>';

function addButton(name: string, v: number[]) {
    const button = document.createElement('div');
    button.style.padding = '3px';
    button.style.border = '1px solid black';
    button.style.margin = '3px';
    button.style.background = '#aaf';
    button.style.width = '100px';
    button.style.display = 'inline-block';
    button.style.cursor = 'pointer';
    button.innerHTML = name;
    chords.appendChild(button);

    button.onmousedown = () => {
        onChord(v.map((v) => v / 12));
        return false;
    };
    button.onmouseup = () => {
        onOut();
    };
}

addButton('Cmaj', [0, 4, 7]);
addButton('Cmin', [0, 3, 7]);
addButton('Dmin', [2, 5, 9]);
addButton('Ddim', [2, 5, 8]);
addButton('Fmaj', [0, 5, 9]);
addButton('Gmaj', [2, 7, 11]);
addButton('Gmin', [2, 7, 10]);
addButton('Daug', [2, 6, 10]);