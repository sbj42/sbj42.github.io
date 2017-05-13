import Promise from 'promise-polyfill';

const images = {};

export function loadImage(config) {
    console.log('image.load');
    return new Promise((resolve, reject) => {
        const paths = config.images;
        if (!paths || paths.length == 0) {
            console.log('image.load done');
            resolve();
            return;
        }
        let loaded = 0;
        const onload = (id, img) => {
            return () => {
                console.log(`image.load.onload "${id}"`);
                if (id in images) {
                    console.error(`StoryLib: image "${id}" already loaded`);
                } else {
                    images[id] = img;
                }
                if (++loaded == paths.length) {
                    console.log('image.load done');
                    resolve();
                }
            };
        }
        paths.forEach(path => {
            const id = path.split('.')[0];
            const img = new Image();
            img.onload = onload(id, img);
            img.onerror = onload(id, img);
            img.onabort = onload(id, img);
            const dir = config.imageDir || '.';
            img.src = `${dir}/${path}`;
        });
    });
}

export function createImage(id) {
    const img = new Image();
    if (id == null) {
        // nothing
        img.style.visibility = 'hidden';
    } else if (id in images) {
        img.src = images[id].src;
        img.style.visibility = 'visible';
    } else {
        console.error(`StoryLib: image "${id}" not yet loaded`);
    }
    return img;
}

export function setImage(img, id) {
    if (id == null) {
        img.src = '';
        img.style.visibility = 'hidden';
    } else if (id in images) {
        img.src = images[id].src;
        img.style.visibility = 'visible';
    } else {
        console.error(`StoryLib: image "${id}" not yet loaded`);
    }
    return img;
}

export function getImageSize(id) {
    if (id == null) {
        return {width: 0, height: 0};
    } else if (id in images) {
        return {
            width: images[id].width,
            height: images[id].height
        };
    } else {
        console.error(`StoryLib: image "${id}" not yet loaded`);
    }
}
