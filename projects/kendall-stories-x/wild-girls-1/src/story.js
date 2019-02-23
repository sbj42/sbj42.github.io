import title from './title.txt';
import scene1 from './scene-1-julias-room.txt';
import scene2 from './scene-2-julias-kitchen.txt';
import scene3 from './scene-3-julias-room.txt';
import scene4 from './scene-4-lunas-room.txt';
import scene5 from './scene-5-lydias-attic.txt';

function done() {
    document.getElementById('reset').style.visibility = 'visible';
    document.getElementById('reset').onclick = () => {
        document.getElementById('reset').style.visibility = 'hidden';
        document.getElementById('start').style.visibility = 'visible';
        reset();
    };
}

function scene(which) {
    return Story.runScript(Story.createStage({
        elem: document.getElementById('stage')
    }), which);
}

function start() {
    scene(scene5)
    // scene(scene1)
    //     .then(() => scene(scene2))
    //     .then(() => scene(scene3))
    //     .then(() => scene(scene4))
    //     .then(() => scene(scene5))
        .then(done);
}

function reset() {
    Story.runScript(Story.createStage({
        elem: document.getElementById('stage')
    }), title);
    document.getElementById('start').style.visibility = 'visible';
    document.getElementById('start').onclick = function() {
        document.getElementById('start').style.visibility = 'hidden';
        start();
    };
}

Story.load({
    imageDir: 'images',
    imageExt: 'jpg',
    images: [
        'title.jpg',
        'julia-room.jpg',
        'julia-room-door-open.jpg',
        'julia-front.png',
        'julia-front-eat.png',
        'julia-right.png',
        'julia-right-walk.png',
        'julia-sleep.png',
        'julia-fox-sleep.png',
        'julia-fox-front.png',
        'julia-fox-left.png',
        'julia-fox-left-walk.png',
        'julia-fox-right.png',
        'julia-fox-right-walk.png',
        'julia-fox-back.png',
        'julia-kitchen.jpg',
        'julia-mom.png',
        'julia-mom-scream.png',
        'cupcake-chest-open.png',
        'cupcake-1.png',
        'cupcake-2.png',
        'lights-out.png',
        'luna-room.jpg',
        'luna-front.png',
        'luna-back.png',
        'luna-left.png',
        'luna-right.png',
        'luna-bed.png',
        'luna-door.png',
        'luna-friend.png',
        'luna-mad.png',
        'luna-wolf-front.png',
        'luna-wolf-mad.png',
        'lydia-front.png',
        'lydia-back.png',
        'lydia-right.png',
        'lydia-right-walk.png',
        'lydia-left.png',
        'lydia-left-walk.png',
        'lydia-husky-front.png',
        'lydia-husky-back.png',
        'lydia-husky-right.png',
        'lydia-husky-right-walk.png',
        'lydia-husky-surprised.png',
        'rat-left.png',
        'rat-right.png',
        'spider.png',
        'lydia-attic.jpg',
        'cat.png',
        'cat-scratch.png',
        'scratch.png',
    ],
    soundDir: 'sounds',
    sounds: [
        'title',
        'this-is-julia',
        'chomp-1',
        'chomp-2',
        'went-to-bed',
        'snore',
        'hi-mom-aaa',
        'what-you-get',
        'im-a-fox',
        'this-is-luna',
        '9-10-heehee',
        'i-can-find-you',
        'come-on-time',
        'luna-i-have-to',
        'luna-was-mad',
        'noo-argh-ooo',
        'this-is-lydia',
        'hello-mr-spider',
        'hello-mr-rat',
        'cat-mad',
    ]
}).then(reset);

requestAnimationFrame(animate);
 
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}

// Story.load({
//     imageDir: 'images',
//     images: [
//         'lala1'
//     ],
//     soundDir: 'sounds',
//     sounds: [
//         'bye'
//     ]
// })

// function title() {
//     let lala, stage;
//     Story.load({
//         imageDir: 'images',
//         images: [
//             'lala1'
//         ],
//         soundDir: 'sounds',
//         sounds: [
//             'bye'
//         ]
//     }).then(() => {
//         stage = Story.createStage({
//             elem: document.getElementById('stage')
//         });
//         lala = stage.createSprite('lala', {imageId: 'lala1'}).show();
//         console.info('title-loaded');
//     }).then(() => {
//         return Story.wait(1);
//     }).then(() => {
//         lala.setPosition(50, 50).setRotation(15);
//     });
// }

// console.info('story.js');
// title();