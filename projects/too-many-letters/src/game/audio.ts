import * as Howler from 'howler';

const audioContext = require.context('./audio', false, /\.(ogg)$/);

const dings = [1,2,3,4,5].map(num => new Howler.Howl({
    src: [audioContext('./ding'+num+'.ogg')]
}));
const buzzes = [1,2,3,4,5].map(num => new Howler.Howl({
    src: [audioContext('./buzz'+num+'.ogg')]
}));

export function playDing() {
    const n = Math.floor(Math.random() * dings.length);
    const ding = dings[n];
    ding.play();
}
export function playBuzz() {
    const n = Math.floor(Math.random() * buzzes.length);
    const buzz = buzzes[n];
    buzz.play();
}