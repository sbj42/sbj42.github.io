import Promise from 'promise-polyfill';

export function wait(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, seconds * 1000);
    });
}
