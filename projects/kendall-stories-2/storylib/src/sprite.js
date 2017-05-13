import {createImage, setImage, getImageSize} from './image';
import TWEEN from 'tween.js';
import {wait} from './time';

require('./sprite.css');

class Sprite {
    constructor(stage, config) {
        this.stage = stage;
        this.img = createImage(config.imageId);
        const {width, height} = getImageSize(config.imageId);
        this.width = width;
        this.height = height;
        this.position = config.position || {x: 0, y: 0};
        this.anchor = config.anchor || {dx: 0.5, dy: 0.5};
        this.rotation = 0;
        this.scale = 1;
        this.flip = 1;
        this.div = document.createElement('div');
        this.div.className = 'storylib-sprite';
        this.div.appendChild(this.img);
        this.setAnchor(this.anchor.dx, this.anchor.dy);
        this.setPosition(this.position.x, this.position.y);
        if (config.hide) {
            this.hide();
        } else {
            this.show();
        }
        this.moveToTop();
    }

    show() {
        this.img.style.visibility = "visible";
        return this;
    }

    hide() {
        this.img.style.visibility = "hidden";
        return this;
    }

    moveToTop() {
        this.stage.elem.appendChild(this.div);
        return this;
    }

    moveToBottom() {
        this.stage.elem.insertBefore(this.div, this.stage.firstChild);
        return this;
    }

    setImage(imageId) {
        setImage(this.img, imageId);
        const {width, height} = getImageSize(imageId);
        this.width = width;
        this.height = height;
        this.setAnchor(this.anchor.dx, this.anchor.dy);
        return this;
    }

    setImageAlternate(id1, id2, delay, count) {
        for (let t = 1; t <= count; t ++) {
            const time = t * delay;
            const id = (t & 1) ? id1 : id2;
            wait(time).then(() => {
                this.setImage(id);
            });
        }
        return wait(count * delay);
    }

    setPosition(x, y, delay, ease) {
        return new Promise((resolve, reject) => {
            new TWEEN.Tween(this.position)
                .to({x, y}, (delay || 0) * 1000)
                .easing(ease || TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.div.style.left = `${this.position.x}px`;
                    this.div.style.top = `${this.position.y}px`;
                })
                .onComplete(resolve)
                .start();
        });
    }

    setRotation(a, delay, ease) {
        var obj = {a: this.rotation};
        return new Promise((resolve, reject) => {
            new TWEEN.Tween(obj)
                .to({a}, (delay || 0) * 1000)
                .easing(ease || TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.rotation = obj.a;
                    this._doTransform();
                })
                .onComplete(resolve)
                .start();
        });
    }

    setAnchor(dx, dy, delay, ease) {
        return new Promise((resolve, reject) => {
            new TWEEN.Tween(this.anchor)
                .to({dx, dy}, (delay || 0) * 1000)
                .easing(ease || TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    const x = Math.floor(-this.anchor.dx * this.width);
                    const y = Math.floor(-this.anchor.dy * this.height);
                    this.img.style.left = `${x}px`;
                    this.img.style.top = `${y}px`;
                })
                .onComplete(resolve)
                .start();
        });
    }

    _doTransform() {
        this.img.style.transform = `rotate(${this.rotation}deg) scale(${this.flip * this.scale}, ${this.scale})`;
    }

    setScale(s) {
        this.scale = s;
        this._doTransform();
        return this;
    }

    setFlip(f) {
        this.flip = f;
        this._doTransform();
        return this;
    }
}

export function createSprite(stage, config) {
    return new Sprite(stage, config);
}