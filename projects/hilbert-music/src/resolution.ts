import {
    onRestart,
} from './event';

const resolution = document.getElementById('resolution');
resolution.innerHTML = 'Resolution: ';

const input = document.createElement('input');
input.type = 'range';
input.min = '2';
input.max = '7';
input.value = '5';
resolution.appendChild(input);

input.oninput = () => {
    onRestart(+input.value);
};
onRestart(+input.value);