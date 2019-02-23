import Promise from 'promise-polyfill';
import {loadImage} from './image';
import {loadSound} from './sound';

export default function(config, callback) {
    console.log('load');
    return Promise.all([
        loadImage(config),
        loadSound(config)
    ]).then(function() {
        console.log('load done');
    });
};