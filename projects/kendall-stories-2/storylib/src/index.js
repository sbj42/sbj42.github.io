import load from './load';
import {playSound} from './sound';
import {createStage} from './stage';
import {wait} from './time';
import {runScript} from './script';
import TWEEN from 'tween.js';

window.Story = {
    load,
    playSound,
    createStage,
    wait,
    runScript,
};
window.TWEEN = TWEEN;