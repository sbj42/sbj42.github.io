import Promise from 'promise-polyfill';
import howler from 'howler';

const sounds = {};

export function stopSounds() {
    for (let id in sounds) {
        if (sounds.hasOwnProperty(id)) {
            sounds[id].stop();
        }
    }
}

export function playSound(id) {
    console.log('sound.play "' + id + '"');
    return new Promise((resolve, reject) => {
        if (id in sounds) {
            const howl = sounds[id];
            sounds[id].play();
            setTimeout(function() {
                console.log(`sound.play "${id}" done`);
                resolve();
            }, howl.duration() * 1000);
        } else {
            console.error(`StoryLib: sound "${id}" not yet loaded`);
            resolve();
        }
    });
}

export function loadSound(config) {
    console.log('sound.load');
    return new Promise((resolve, reject) => {
        const ids = config.sounds;
        if (!ids || ids.length == 0) {
            console.log('sound.load done');
            resolve();
            return;
        }
        let loaded = 0;
        const onload = (id,  howl) => {
            return () => {
                console.log(`sound.load.onload "${id}"`);
                if (id in sounds) {
                    console.error(`StoryLib: sound "${id}" already loaded`);
                } else {
                    sounds[id] = howl;
                }
                if (++loaded == ids.length) {
                    console.log('sound.load done');
                    resolve();
                }
            };
        }
        const dir = config.soundDir || '.';
        let exts = null;
        if (config.soundExts)
            exts = config.soundExts;
        else if (config.soundExt)
            exts = [config.soundExt];
        else
            exts = ['ogg', 'm4a'];
        ids.forEach(id => {
            const src = exts.map(ext => `${dir}/${id}.${ext}`);
            const howl = new howler.Howl({
                src
            });
            howl.once('load', onload(id, howl));
        });
    });
}
