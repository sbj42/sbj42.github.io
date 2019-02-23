import {createScene} from './stage';
import {playSound, stopSounds} from './sound';
import {wait} from './time';
import TWEEN from 'tween.js';

const RE_BLANK = /^\s*(?:|\/\/(.*))$/;
const RE_OPEN_BRACE = /^\s*\{\s*$/;
const RE_CLOSE_BRACE = /^\s*\}\s*$/;
const RE_SCENE = /^\s*scene\s*$/;
const RE_WAIT = /^\s*wait\s+(\d+(?:|\.\d+))\s*$/;
const RE_BACKGROUND = /^\s*background\s+(\S+)\s*$/;
const RE_ADD = /^\s*add\s+(\S+)\s+(\S+)\s+(-?\d+)\s*,\s*(-?\d+)(?:|\s+(\d+)\s*,\s*(\d+))\s*$/;
const RE_MOVE = /^\s*move\s+(\S+)\s+(-?\d+)\s*,\s*(-?\d+)(?:|\s+(\d+(?:|\.\d+))(?:|\s+(\S+)))\s*$/;
const RE_ANCHOR = /^\s*anchor\s+(\S+)\s+(-?\d+)\s*,\s*(-?\d+)(?:|\s+(\d+(?:|\.\d+))(?:|\s+(\S+)))\s*$/;
const RE_TOP = /^\s*top\s+(\S+)\s*$/;
const RE_SET = /^\s*set\s+(\S+)\s+(\S+)(?:|\s+(-?\d+)\s*,\s*(-?\d+))\s*$/;
const RE_SET_ALTERNATE = /^\s*set-alternate\s+(\S+)\s+(\S+)\s+(\S+)\s+(\d+(?:|\.\d+))\s+(\d+(?:|\.\d+))*$/;
const RE_HIDE = /^\s*hide\s+(\S+)\s*$/;
const RE_SPEED = /^\s*speed\s+(\d+(?:|\.\d+))\s*$/;
const RE_PLAY = /^\s*play\s+(\S+)\s*$/;
const RE_ROTATE = /^\s*rotate\s+(\S+)\s+(\d+)(?:|\s+(\d+(?:|\.\d+)))\s*$/;

function getEase(ease) {
    switch (ease) {
        default: return TWEEN.Easing.Linear.None;
    }
}

let speed = 1;

export function runScript(stage, script) {
    stopSounds();
    return new Promise((resolve, reject) => {
        const lines = script.split(/\n/);
        let at = 0;

        function step() {
            if (at >= lines.length) {
                resolve();
                return;
            }
            const line = lines[at++].trim();
            let result;

            if (result = RE_BLANK.exec(line)) {
                const comment = result[1];
                if (comment) {
                    console.info(comment);
                }

            } else if (RE_OPEN_BRACE.test(line)) {
                const subscript = [];
                let count = 0;
                while (true) {
                    let subline = lines[at++].trim();
                    if (RE_CLOSE_BRACE.test(subline)) {
                        count --;
                        if (count < 0)
                            break;
                    }
                    subscript.push(subline);
                    if (RE_OPEN_BRACE.test(subline))
                        count ++;
                }
                console.log(`start subscript ${subscript.join(';')}`);
                runScript(stage, subscript.join('\n')).then(() => {
                console.log(`end subscript ${subscript.join(';')}`);
                });;

            } else if (result = RE_SPEED.exec(line)) {
                speed = result[1];
                console.log(`speed ${speed}`);

            } else if (result = RE_SCENE.exec(line)) {
                console.log(`scene`);
                stage.clear();
                
            } else if (result = RE_WAIT.exec(line)) {
                const delay = result[1];
                console.log(`wait ${delay}`);
                return wait(delay / speed).then(step);

            } else if (result = RE_BACKGROUND.exec(line)) {
                const imageId = result[1];
                console.log(`background ${imageId}`);
                stage.setBackground(imageId);

            } else if (result = RE_ADD.exec(line)) {
                const id = result[1];
                const imageId = result[2];
                const x = result[3] == null ? 0 : +result[3];
                const y = result[4] == null ? 0 : +result[4];
                const ax = result[5] == null ? 0.5 : +result[5];
                const ay = result[6] == null ? 0.5 : +result[6];
                console.log(`add ${id} ${imageId} ${x},${y} ${ax},${ay}`);
                const sprite = stage.createSprite(id, {imageId, position: {x, y}});
                sprite.setAnchor(ax, ay);

            } else if (result = RE_SET.exec(line)) {
                const id = result[1];
                const sprite = stage.sprite(id);
                const imageId = result[2];
                const ax = result[3] == null ? sprite.anchor.dx : +result[3];
                const ay = result[4] == null ? sprite.anchor.dy : +result[4];
                console.log(`set ${id} ${imageId} ${ax},${ay}`);
                sprite.setImage(imageId)
                    .setAnchor(ax, ay);

            } else if (result = RE_SET_ALTERNATE.exec(line)) {
                const id = result[1];
                const sprite = stage.sprite(id);
                const imageId1 = result[2];
                const imageId2 = result[3];
                const delay = +result[4];
                const count = +result[5];
                console.log(`set-alternate ${id} ${imageId1} ${imageId2} ${delay} ${count}`);
                return sprite.setImageAlternate(imageId1, imageId2, delay, count).then(step);

            } else if (result = RE_HIDE.exec(line)) {
                const id = result[1];
                console.log(`hide ${id}`);
                stage.sprite(id).hide();

            } else if (result = RE_ANCHOR.exec(line)) {
                const id = result[1];
                const dx = +result[2];
                const dy = +result[3];
                const duration = result[4] == null ? 0 : +result[4];
                const ease = result[5] == null ? 'linear' : result[5];
                console.log(`anchor ${id} ${dx},${dy} ${duration} ${ease}`);
                return stage.sprite(id).setAnchor(dx, dy, duration / speed, getEase(ease)).then(step);

            } else if (result = RE_MOVE.exec(line)) {
                const id = result[1];
                const x = +result[2];
                const y = +result[3];
                const duration = result[4] == null ? 0 : +result[4];
                const ease = result[5] == null ? 'linear' : result[5];
                console.log(`move ${id} ${x},${y} ${duration} ${ease}`);
                return stage.sprite(id).setPosition(x, y, duration / speed, getEase(ease)).then(step);

            } else if (result = RE_ROTATE.exec(line)) {
                const id = result[1];
                const a = result[2];
                const duration = result[3] == null ? 0 : +result[3];
                console.log(`rotate ${id} ${a} ${duration}`);
                return stage.sprite(id).setRotation(a, duration / speed).then(step);

            } else if (result = RE_TOP.exec(line)) {
                const id = result[1];
                console.log(`top ${id}`);
                stage.sprite(id).moveToTop();

            } else if (result = RE_PLAY.exec(line)) {
                const id = result[1];
                console.log(`play ${id}`);
                return playSound(id).then(step);

            } else {
                console.error(`invalid script: ${line}`);
            }
            step();
        }
        step();
    });
}