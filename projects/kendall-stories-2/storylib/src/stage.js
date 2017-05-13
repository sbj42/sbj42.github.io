import {createSprite} from './sprite';

require('./stage.css');

class Stage {
    
    constructor(config) {
        this.elem = config.elem;
        this.elem.className += ' storylib-stage';
        this.sprites = {};
        this.bg = this.createSprite('bg', {
            imageId: null,
            anchor: {dx: 0, dy: 0}
        });
    }

    clear() {
        this.elem.innerHTML = '';
        for (let x in this.sprites)
            this.sprites[x].remove();
        this.sprites = {};
    }

    setBackground(imageId) {
        this.bg.setImage(imageId);
    }

    createSprite(id, config) {
        if (!config)
            config = {};
        const sprite = createSprite(this, config);
        this.sprites[id] = sprite;
        return sprite;
    }

    sprite(id) {
        if (id in this.sprites) {
            return this.sprites[id];
        } else {
            console.error(`StoryLib: sprite "${id}" not yet created`);
        }
    }
}

export function createStage(config) {
    return new Stage(config);
}