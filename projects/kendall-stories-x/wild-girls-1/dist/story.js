/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = "background julia-room\r\n\r\nspeed 1\r\n\r\nadd julia julia-front 300,350\r\nplay this-is-julia\r\n\r\n// goto chest\r\nmove julia 220,480 1\r\nwait 1\r\n\r\n// open chest\r\nadd chest cupcake-chest-open 0,605 0,1\r\ntop julia\r\nadd cupcake cupcake-1 150,500\r\nwait 1\r\n\r\n// go closer\r\nmove julia 200,480 0.5\r\n\r\n// pick up cupcake\r\n{\r\n    wait 0.2\r\n    set julia julia-front-eat\r\n}\r\nmove cupcake 200,405 0.6\r\nwait 0.5\r\n\r\n// chomp\r\nset cupcake cupcake-2\r\nmove cupcake 195,410\r\n{\r\n    play chomp-1\r\n}\r\nwait 1\r\n\r\n// chomp\r\nhide cupcake\r\n{\r\n    play chomp-2\r\n}\r\nwait 0.5\r\nset julia julia-front\r\nwait 0.6\r\nhide chest\r\n\r\n// go to bed\r\nset julia julia-right\r\n{\r\n    move julia 642,480 2\r\n}\r\n{\r\n    wait 0.5\r\n    play went-to-bed\r\n}\r\nset-alternate julia julia-right-walk julia-right 0.25 8\r\n\r\n// lay down\r\nwait 1\r\nset julia julia-sleep\r\nmove julia 642,464\r\n\r\n// snore\r\nwait 2\r\n{\r\n    // lights out\r\n    wait 1\r\n    add lights-out lights-out 0,0 0,0\r\n}\r\nplay snore\r\n\r\n// turn into fox\r\nwait 1\r\nset julia julia-fox-sleep\r\nmove julia 642,482\r\nhide lights-out\r\n\r\n// walk left\r\nwait 1\r\nset julia julia-fox-left\r\nmove julia 642,508\r\n{\r\n    move julia 300,508 2\r\n}\r\nset-alternate julia julia-fox-left-walk julia-fox-left 0.25 8\r\n\r\n// walk up\r\nwait 0.25\r\nset julia julia-fox-back\r\nmove julia 300,350 1.5\r\n\r\n// walk to door\r\nwait 0.25\r\nset julia julia-fox-right\r\n{\r\n    move julia 730,250 2\r\n}\r\nset-alternate julia julia-fox-right-walk julia-fox-right 0.25 8\r\nwait 0.25\r\nset julia julia-fox-back\r\n\r\n// open door\r\nwait 0.75\r\nadd door julia-room-door-open 649,68 0,0\r\ntop julia\r\nwait 0.75\r\nmove julia 730,200 1\r\n\r\n// close door\r\nhide julia\r\nhide door\r\nwait 1"

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "background julia-kitchen\r\n\r\nspeed 1\r\n\r\n// setup mom\r\nadd mom julia-mom 384,304\r\nwait 0.5\r\n\r\n// julia enters\r\nadd julia julia-fox-back 300,800\r\nmove julia 300,450 2\r\n\r\n// hi mom\r\n{\r\n    play hi-mom-aaa\r\n}\r\n\r\n// scream\r\nwait 1.3\r\nset mom julia-mom-scream\r\nwait 1.5\r\n\r\n// what\r\nplay what-you-get\r\n\r\n// runs away\r\nset julia julia-fox-front\r\nmove julia 300,700 1\r\n"

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "background julia-room\r\n\r\nspeed 1\r\n\r\nwait 0.5\r\nadd door julia-room-door-open 649,68 0,0\r\nadd julia julia-fox-front 730,200\r\nmove julia 730,250 0.5\r\nhide door\r\n\r\nwait 0.5\r\nplay im-a-fox"

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "background luna-room\r\n\r\nspeed 1\r\n\r\n// setup\r\nadd bed luna-bed 600,520\r\nadd luna luna-back 300,91\r\nwait 0.25\r\n\r\n// this is luna\r\nplay this-is-luna\r\n\r\n// counting\r\nwait 0.25\r\n{\r\n    play 9-10-heehee\r\n}\r\n// setup friend\r\nadd friend luna-friend 740,290\r\nadd door luna-door 611,143 0,0\r\nwait 0.5\r\n\r\n// peek\r\nmove friend 765,290 2.5\r\nset luna luna-front\r\nwait 1\r\n\r\n// hide\r\nmove friend 740,290 1\r\n\r\n// seek\r\nset luna luna-right\r\n{\r\n    play i-can-find-you\r\n}\r\nmove luna 410,91 1.5\r\nset luna luna-left\r\nmove luna 150,311 2\r\nset luna luna-right\r\nmove luna 410,311 2\r\nset luna luna-front\r\nmove luna 460,491 2\r\n\r\nplay come-on-time\r\nmove friend 765,290 1\r\nplay luna-i-have-to\r\nmove friend 740,290 1\r\nset luna luna-mad\r\nplay luna-was-mad\r\n\r\ntop bed\r\nwait 1\r\nplay noo-argh-ooo\r\nset luna luna-wolf-mad\r\nwait 0.2\r\nmove luna 659,441 0.4\r\nmove luna 439,421 0.4\r\nmove luna 349,491 0.4\r\nmove luna 529,451 0.4\r\n{\r\n    rotate bed 180 0.8\r\n}\r\nwait 0.2\r\nmove luna 632,341 0.4\r\nmove luna 212,312 0.4\r\nwait 0.5"

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "background lydia-attic\r\n\r\nspeed 1\r\n\r\n// setup\r\nadd lydia lydia-right 565,345\r\nadd rat rat-left 130,370\r\nadd spider spider 670,330\r\nadd cat cat 100,500\r\nwait 0.25\r\n\r\n// {\r\n//   move spider 630,330 1.7\r\n//   move spider 670,330 1.7\r\n//   move spider 630,360 1.7\r\n//   move spider 630,330 1.7\r\n//   move spider 670,330 1.7\r\n//   move spider 630,330 1.7\r\n//   move spider 670,330 1.7\r\n//   move spider 630,360 1.7\r\n//   move spider 630,330 1.7\r\n//   move spider 670,330 1.7\r\n//   move spider 630,330 1.7\r\n//   move spider 670,330 1.7\r\n// }\r\n// {\r\n//   move rat 69,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-right\r\n//   move rat 130,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-left\r\n//   move rat 69,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-right\r\n//   move rat 130,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-left\r\n//   move rat 69,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-right\r\n//   move rat 130,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-left\r\n//   move rat 69,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-right\r\n//   move rat 130,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-left\r\n//   move rat 69,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-right\r\n//   move rat 130,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-left\r\n//   move rat 69,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-right\r\n//   move rat 130,370 0.6\r\n//   wait 1.2\r\n//   set rat rat-left\r\n// }\r\n//\r\n// play this-is-lydia\r\n// wait 1\r\n// play hello-mr-spider\r\n// move spider 970,330 1.5\r\n\r\nset lydia lydia-front\r\nmove lydia 565,445 1\r\nset lydia lydia-left\r\n{\r\n    move lydia 205,394 2\r\n}\r\nset-alternate lydia lydia-left-walk lydia-left 0.25 8\r\n\r\nplay hello-mr-rat\r\nset cat cat-scratch\r\n{\r\n  play cat-mad \r\n}\r\nmove rat -50,375 0.5\r\nadd scratch scratch 220,390\r\nwait 1\r\nhide scratch"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "background title\r\nplay title"

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__title_txt__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__title_txt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__title_txt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scene_1_julias_room_txt__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scene_1_julias_room_txt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scene_1_julias_room_txt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scene_2_julias_kitchen_txt__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scene_2_julias_kitchen_txt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__scene_2_julias_kitchen_txt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scene_3_julias_room_txt__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scene_3_julias_room_txt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__scene_3_julias_room_txt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scene_4_lunas_room_txt__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scene_4_lunas_room_txt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__scene_4_lunas_room_txt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scene_5_lydias_attic_txt__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scene_5_lydias_attic_txt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__scene_5_lydias_attic_txt__);







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
    scene(__WEBPACK_IMPORTED_MODULE_5__scene_5_lydias_attic_txt___default.a)
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
    }), __WEBPACK_IMPORTED_MODULE_0__title_txt___default.a);
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

/***/ })
/******/ ]);
//# sourceMappingURL=story.js.map