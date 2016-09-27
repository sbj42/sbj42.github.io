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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	
	var fpWorld = __webpack_require__(5);
	var fpView = __webpack_require__(68);
	var fpContext = __webpack_require__(69);
	var fpWorldRender = __webpack_require__(112);
	var fpUtil = __webpack_require__(67);
	var p2 = __webpack_require__(6);
	
	
	var dragBody = null;
	var dragConstraint = null;
	
	function tryHit(position) {
	    fpWorld.actors().forEach(function(actor) {
	        if (dragBody)
	            return;
	        dragBody = fpWorld.hitTest(position, actor.bodies());
	        fpWorld.currentActor(actor);
	    });
	    if (dragBody) {
	        fpWorld.currentActor().startDrag(dragBody);
	        dragConstraint = new p2.RevoluteConstraint(fpWorld.NULL_BODY, dragBody.body(), {
	            worldPivot: position
	        });
	        dragConstraint.setStiffness(10000);
	        fpWorld.world().addConstraint(dragConstraint);
	    }
	}
	
	fpUtil.addEventListener(fpView, 'mousedown', function(event) {
	    if (event.button == 0) {
	        tryHit(fpView.mousePosition());
	    }
	});
	
	fpUtil.addEventListener(fpView, 'mousemove', function(event) {
	    if (dragConstraint) {
	        // setDragSpring(position);
	        // p2.vec2.copy(dragBody.position, position);
	        p2.vec2.copy(dragConstraint.pivotA, fpView.mousePosition());
	        dragConstraint.bodyA.wakeUp();
	        dragConstraint.bodyB.wakeUp();
	    } else if (event.buttons == 1) {
	        tryHit(fpView.mousePosition());
	    }
	});
	
	fpUtil.addEventListener(fpView, 'mouseup', function(event) {
	    if (dragConstraint) {
	        fpWorld.world().removeConstraint(dragConstraint);
	        dragConstraint = null;
	        dragBody = null;
	        fpWorld.currentActor().endDrag();
	    }
	});
	
	// To animate the bodies, we must step the world forward in time, using a fixed time step size.
	// The World will run substeps and interpolate automatically for us, to get smooth animation.
	var fixedTimeStep = 1 / 60; // seconds
	var maxSubSteps = 20; // Max sub steps to catch up with the wall clock
	var lastTime;
	
	var context = fpView.context();
	
	__webpack_require__(113);
	
	//fpView.position([900, -2600]);
	
	function animate(time) {
	    requestAnimationFrame(animate);
	
	    if (time - lastTime > 500)
	        lastTime = time - 500;
	    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
	    fpWorld.world().step(fixedTimeStep, deltaTime, maxSubSteps);
	
	    if (!dragConstraint && fpWorld.currentActor()) {
	        fpView.moveToward(fpWorld.currentActor().head().body().position.slice());
	    }
	
	    fpWorldRender();
	
	    fpContext.setTransform(context);
	    var mouse = fpView.screenMousePosition();
	    if (mouse) {
	        fpContext.image(context, 'cursor-' + (fpView.mouseIsDown() ? 'grabbing' : 'grab'), {
	            position: mouse,
	            offset: [8, 10]
	        });
	    }
	
	    lastTime = time;
	}
	
	requestAnimationFrame(animate);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "html, body {\r\n    margin: 0;\r\n    height: 100%;\r\n    overflow: hidden;\r\n}\r\ncanvas {\r\n    cursor: none;\r\n}\r\n", ""]);
	
	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// Mr. Floppypants World
	
	var p2 = __webpack_require__(6);
	var fpUtil = __webpack_require__(67);
	
	var fpWorld = {
	
	    LEFT:   -5000,
	    RIGHT:   5000,
	    GROUND:     0,
	    TOP:    -4000,
	    BOTTOM:  5000,
	
	    STANDARD_MATERIAL: new p2.Material(),
	    BOUNCY_MATERIAL: new p2.Material(),
	
	    GROUP_GROUND: 1,
	    GROUP_OTHER: 2,
	
	    NULL_BODY: new p2.Body()
	
	};
	
	var GROUP_MAX = 2;
	
	var GRAVITY = 600;
	// GRAVITY =  3; // for testing in slow-mo
	
	var world = new p2.World({
	    gravity: [0, GRAVITY]
	});
	world.solver.iterations = 1000;
	
	world.addBody(fpWorld.NULL_BODY);
	
	var acm = function(m1, m2, f, r, rx) {
	    world.addContactMaterial(new p2.ContactMaterial(m1, m2, {
	        friction: f,
	        restitution: r,
	        relaxation: rx
	    }));
	};
	acm(fpWorld.STANDARD_MATERIAL, fpWorld.STANDARD_MATERIAL,  5, 0.1 );
	acm(fpWorld.BOUNCY_MATERIAL,   fpWorld.STANDARD_MATERIAL,  7, 0.65, 8);
	acm(fpWorld.BOUNCY_MATERIAL,   fpWorld.BOUNCY_MATERIAL,    7, 0.75, 8);
	
	world.on('beginContact', function(event) {
	    if (fpUtil.hasEvent(event.bodyA, 'contact'))
	        fpUtil.fireEvent(event.bodyA, 'contact', [event.bodyB, event.bodyA]);
	    if (fpUtil.hasEvent(event.bodyB, 'contact'))
	        fpUtil.fireEvent(event.bodyB, 'contact', [event.bodyA, event.bodyB]);
	});
	
	fpWorld.world = function() {
	    return world;
	};
	
	fpWorld.hitTest = function(position, bodies) {
	    var hits = world.hitTest(position, bodies.map(function(body) { return body.body();}), 5);
	    if (hits.length) {
	        var hit = hits[hits.length - 1];
	        for (var i = 0; i < bodies.length; i ++) {
	            if (bodies[i].body() === hit)
	                return bodies[i];
	        }
	    }
	    return null;
	};
	
	var backdrops = [];
	
	fpWorld.addBackdrop = function(backdrop) {
	    backdrops.push(backdrop);
	    return this;
	};
	
	fpWorld.backdrops = function() {
	    return backdrops;
	};
	
	var nextCollisionGroup = GROUP_MAX;
	
	fpWorld.newCollisionGroup = function() {
	    nextCollisionGroup *= 2;
	    return nextCollisionGroup;
	};
	
	var bodies = [];
	
	fpWorld.addBody = function(body) {
	    this.world().addBody(body.body());
	    bodies.push(body);
	    return this;
	};
	
	fpWorld.bodies = function() {
	    return bodies;
	};
	
	var actors = [];
	
	fpWorld.addActor = function(actor) {
	    actor.bodies().forEach(function(body) {
	        this.world().addBody(body.body());
	    }.bind(this));
	    actors.push(actor);
	    return this;
	};
	
	fpWorld.actors = function() {
	    return actors;
	};
	
	var currentActor = null;
	
	fpWorld.currentActor = function(actor) {
	    if (actor)
	        currentActor = actor;
	    else
	        return currentActor;
	};
	
	// var dragBody = null;
	// var dragReleasing = false;
	// var dragConstraint = null;
	// var grabConstraint = null;
	//
	// var myBodies;
	//
	// function tryHit(position) {
	//     dragBody = fpWorld.simpleHitTest(position, myBodies);
	//     if (dragBody) {
	//         dragConstraint = new p2.RevoluteConstraint(fpWorld.NULL_BODY, dragBody, {
	//             worldPivot: position
	//         });
	//         dragConstraint.setStiffness(1000);
	//         fpWorld.world().addConstraint(dragConstraint);
	//     }
	// }
	//
	// function onMouseDown(event, position) {
	//     if (event.button == 0) {
	//         tryHit(position);
	//     }
	// }
	//
	// function onMouseMove(event, position) {
	//     if (dragConstraint) {
	//         // setDragSpring(position);
	//         // p2.vec2.copy(dragBody.position, position);
	//         p2.vec2.copy(dragConstraint.pivotA, position);
	//         dragConstraint.bodyA.wakeUp();
	//         dragConstraint.bodyB.wakeUp();
	//     } else if (event.buttons == 1) {
	//         tryHit(position);
	//     }
	// }
	//
	// function onMouseUp(event) {
	//     if (dragConstraint) {
	//         if (dragReleasing) {
	//             theWorld.removeConstraint(grabConstraint);
	//             grabConstraint = null;
	//             dragReleasing = false;
	//         }
	//         theWorld.removeConstraint(dragConstraint);
	//         dragConstraint = null;
	//         dragBody = null;
	//     }
	// }
	
	module.exports = fpWorld;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Export p2 classes
	var p2 = module.exports = {
	    AABB :                          __webpack_require__(7),
	    AngleLockEquation :             __webpack_require__(10),
	    Body :                          __webpack_require__(12),
	    Broadphase :                    __webpack_require__(24),
	    Capsule :                       __webpack_require__(25),
	    Circle :                        __webpack_require__(26),
	    Constraint :                    __webpack_require__(27),
	    ContactEquation :               __webpack_require__(28),
	    ContactEquationPool :           __webpack_require__(29),
	    ContactMaterial :               __webpack_require__(31),
	    Convex :                        __webpack_require__(18),
	    DistanceConstraint :            __webpack_require__(33),
	    Equation :                      __webpack_require__(11),
	    EventEmitter :                  __webpack_require__(23),
	    FrictionEquation :              __webpack_require__(34),
	    FrictionEquationPool :          __webpack_require__(35),
	    GearConstraint :                __webpack_require__(36),
	    GSSolver :                      __webpack_require__(37),
	    Heightfield :                   __webpack_require__(39),
	    Line :                          __webpack_require__(40),
	    LockConstraint :                __webpack_require__(41),
	    Material :                      __webpack_require__(32),
	    Narrowphase :                   __webpack_require__(42),
	    NaiveBroadphase :               __webpack_require__(45),
	    Particle :                      __webpack_require__(47),
	    Plane :                         __webpack_require__(46),
	    Pool :                          __webpack_require__(30),
	    RevoluteConstraint :            __webpack_require__(48),
	    PrismaticConstraint :           __webpack_require__(51),
	    Ray :                           __webpack_require__(22),
	    RaycastResult :                 __webpack_require__(21),
	    Box :                           __webpack_require__(44),
	    RotationalVelocityEquation :    __webpack_require__(49),
	    SAPBroadphase :                 __webpack_require__(52),
	    Shape :                         __webpack_require__(19),
	    Solver :                        __webpack_require__(38),
	    Spring :                        __webpack_require__(53),
	    TopDownVehicle :                __webpack_require__(54),
	    LinearSpring :                  __webpack_require__(55),
	    RotationalSpring :              __webpack_require__(56),
	    Utils :                         __webpack_require__(9),
	    World :                         __webpack_require__(57),
	    vec2 :                          __webpack_require__(8),
	    version :                       __webpack_require__(58).version,
	};
	
	Object.defineProperty(p2, 'Rectangle', {
	    get: function() {
	        console.warn('The Rectangle class has been renamed to Box.');
	        return this.Box;
	    }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8)
	,   Utils = __webpack_require__(9);
	
	module.exports = AABB;
	
	/**
	 * Axis aligned bounding box class.
	 * @class AABB
	 * @constructor
	 * @param {Object}  [options]
	 * @param {Array}   [options.upperBound]
	 * @param {Array}   [options.lowerBound]
	 */
	function AABB(options){
	
	    /**
	     * The lower bound of the bounding box.
	     * @property lowerBound
	     * @type {Array}
	     */
	    this.lowerBound = vec2.create();
	    if(options && options.lowerBound){
	        vec2.copy(this.lowerBound, options.lowerBound);
	    }
	
	    /**
	     * The upper bound of the bounding box.
	     * @property upperBound
	     * @type {Array}
	     */
	    this.upperBound = vec2.create();
	    if(options && options.upperBound){
	        vec2.copy(this.upperBound, options.upperBound);
	    }
	}
	
	var tmp = vec2.create();
	
	/**
	 * Set the AABB bounds from a set of points, transformed by the given position and angle.
	 * @method setFromPoints
	 * @param {Array} points An array of vec2's.
	 * @param {Array} position
	 * @param {number} angle
	 * @param {number} skinSize Some margin to be added to the AABB.
	 */
	AABB.prototype.setFromPoints = function(points, position, angle, skinSize){
	    var l = this.lowerBound,
	        u = this.upperBound;
	
	    if(typeof(angle) !== "number"){
	        angle = 0;
	    }
	
	    // Set to the first point
	    if(angle !== 0){
	        vec2.rotate(l, points[0], angle);
	    } else {
	        vec2.copy(l, points[0]);
	    }
	    vec2.copy(u, l);
	
	    // Compute cosines and sines just once
	    var cosAngle = Math.cos(angle),
	        sinAngle = Math.sin(angle);
	    for(var i = 1; i<points.length; i++){
	        var p = points[i];
	
	        if(angle !== 0){
	            var x = p[0],
	                y = p[1];
	            tmp[0] = cosAngle * x -sinAngle * y;
	            tmp[1] = sinAngle * x +cosAngle * y;
	            p = tmp;
	        }
	
	        for(var j=0; j<2; j++){
	            if(p[j] > u[j]){
	                u[j] = p[j];
	            }
	            if(p[j] < l[j]){
	                l[j] = p[j];
	            }
	        }
	    }
	
	    // Add offset
	    if(position){
	        vec2.add(this.lowerBound, this.lowerBound, position);
	        vec2.add(this.upperBound, this.upperBound, position);
	    }
	
	    if(skinSize){
	        this.lowerBound[0] -= skinSize;
	        this.lowerBound[1] -= skinSize;
	        this.upperBound[0] += skinSize;
	        this.upperBound[1] += skinSize;
	    }
	};
	
	/**
	 * Copy bounds from an AABB to this AABB
	 * @method copy
	 * @param  {AABB} aabb
	 */
	AABB.prototype.copy = function(aabb){
	    vec2.copy(this.lowerBound, aabb.lowerBound);
	    vec2.copy(this.upperBound, aabb.upperBound);
	};
	
	/**
	 * Extend this AABB so that it covers the given AABB too.
	 * @method extend
	 * @param  {AABB} aabb
	 */
	AABB.prototype.extend = function(aabb){
	    // Loop over x and y
	    var i = 2;
	    while(i--){
	        // Extend lower bound
	        var l = aabb.lowerBound[i];
	        if(this.lowerBound[i] > l){
	            this.lowerBound[i] = l;
	        }
	
	        // Upper
	        var u = aabb.upperBound[i];
	        if(this.upperBound[i] < u){
	            this.upperBound[i] = u;
	        }
	    }
	};
	
	/**
	 * Returns true if the given AABB overlaps this AABB.
	 * @method overlaps
	 * @param  {AABB} aabb
	 * @return {Boolean}
	 */
	AABB.prototype.overlaps = function(aabb){
	    var l1 = this.lowerBound,
	        u1 = this.upperBound,
	        l2 = aabb.lowerBound,
	        u2 = aabb.upperBound;
	
	    //      l2        u2
	    //      |---------|
	    // |--------|
	    // l1       u1
	
	    return ((l2[0] <= u1[0] && u1[0] <= u2[0]) || (l1[0] <= u2[0] && u2[0] <= u1[0])) &&
	           ((l2[1] <= u1[1] && u1[1] <= u2[1]) || (l1[1] <= u2[1] && u2[1] <= u1[1]));
	};
	
	/**
	 * @method containsPoint
	 * @param  {Array} point
	 * @return {boolean}
	 */
	AABB.prototype.containsPoint = function(point){
	    var l = this.lowerBound,
	        u = this.upperBound;
	    return l[0] <= point[0] && point[0] <= u[0] && l[1] <= point[1] && point[1] <= u[1];
	};
	
	/**
	 * Check if the AABB is hit by a ray.
	 * @method overlapsRay
	 * @param  {Ray} ray
	 * @return {number} -1 if no hit, a number between 0 and 1 if hit.
	 */
	AABB.prototype.overlapsRay = function(ray){
	    var t = 0;
	
	    // ray.direction is unit direction vector of ray
	    var dirFracX = 1 / ray.direction[0];
	    var dirFracY = 1 / ray.direction[1];
	
	    // this.lowerBound is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
	    var t1 = (this.lowerBound[0] - ray.from[0]) * dirFracX;
	    var t2 = (this.upperBound[0] - ray.from[0]) * dirFracX;
	    var t3 = (this.lowerBound[1] - ray.from[1]) * dirFracY;
	    var t4 = (this.upperBound[1] - ray.from[1]) * dirFracY;
	
	    var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)));
	    var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)));
	
	    // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
	    if (tmax < 0){
	        //t = tmax;
	        return -1;
	    }
	
	    // if tmin > tmax, ray doesn't intersect AABB
	    if (tmin > tmax){
	        //t = tmax;
	        return -1;
	    }
	
	    return tmin;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.
	
	Redistribution and use in source and binary forms, with or without modification,
	are permitted provided that the following conditions are met:
	
	  * Redistributions of source code must retain the above copyright notice, this
	    list of conditions and the following disclaimer.
	  * Redistributions in binary form must reproduce the above copyright notice,
	    this list of conditions and the following disclaimer in the documentation
	    and/or other materials provided with the distribution.
	
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
	ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
	ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
	
	/**
	 * The vec2 object from glMatrix, with some extensions and some removed methods. See http://glmatrix.net.
	 * @class vec2
	 */
	
	var vec2 = module.exports = {};
	
	var Utils = __webpack_require__(9);
	
	/**
	 * Make a cross product and only return the z component
	 * @method crossLength
	 * @static
	 * @param  {Array} a
	 * @param  {Array} b
	 * @return {Number}
	 */
	vec2.crossLength = function(a,b){
	    return a[0] * b[1] - a[1] * b[0];
	};
	
	/**
	 * Cross product between a vector and the Z component of a vector
	 * @method crossVZ
	 * @static
	 * @param  {Array} out
	 * @param  {Array} vec
	 * @param  {Number} zcomp
	 * @return {Number}
	 */
	vec2.crossVZ = function(out, vec, zcomp){
	    vec2.rotate(out,vec,-Math.PI/2);// Rotate according to the right hand rule
	    vec2.scale(out,out,zcomp);      // Scale with z
	    return out;
	};
	
	/**
	 * Cross product between a vector and the Z component of a vector
	 * @method crossZV
	 * @static
	 * @param  {Array} out
	 * @param  {Number} zcomp
	 * @param  {Array} vec
	 * @return {Number}
	 */
	vec2.crossZV = function(out, zcomp, vec){
	    vec2.rotate(out,vec,Math.PI/2); // Rotate according to the right hand rule
	    vec2.scale(out,out,zcomp);      // Scale with z
	    return out;
	};
	
	/**
	 * Rotate a vector by an angle
	 * @method rotate
	 * @static
	 * @param  {Array} out
	 * @param  {Array} a
	 * @param  {Number} angle
	 */
	vec2.rotate = function(out,a,angle){
	    if(angle !== 0){
	        var c = Math.cos(angle),
	            s = Math.sin(angle),
	            x = a[0],
	            y = a[1];
	        out[0] = c*x -s*y;
	        out[1] = s*x +c*y;
	    } else {
	        out[0] = a[0];
	        out[1] = a[1];
	    }
	};
	
	/**
	 * Rotate a vector 90 degrees clockwise
	 * @method rotate90cw
	 * @static
	 * @param  {Array} out
	 * @param  {Array} a
	 * @param  {Number} angle
	 */
	vec2.rotate90cw = function(out, a) {
	    var x = a[0];
	    var y = a[1];
	    out[0] = y;
	    out[1] = -x;
	};
	
	/**
	 * Transform a point position to local frame.
	 * @method toLocalFrame
	 * @param  {Array} out
	 * @param  {Array} worldPoint
	 * @param  {Array} framePosition
	 * @param  {Number} frameAngle
	 */
	vec2.toLocalFrame = function(out, worldPoint, framePosition, frameAngle){
	    vec2.copy(out, worldPoint);
	    vec2.sub(out, out, framePosition);
	    vec2.rotate(out, out, -frameAngle);
	};
	
	/**
	 * Transform a point position to global frame.
	 * @method toGlobalFrame
	 * @param  {Array} out
	 * @param  {Array} localPoint
	 * @param  {Array} framePosition
	 * @param  {Number} frameAngle
	 */
	vec2.toGlobalFrame = function(out, localPoint, framePosition, frameAngle){
	    vec2.copy(out, localPoint);
	    vec2.rotate(out, out, frameAngle);
	    vec2.add(out, out, framePosition);
	};
	
	/**
	 * Transform a vector to local frame.
	 * @method vectorToLocalFrame
	 * @param  {Array} out
	 * @param  {Array} worldVector
	 * @param  {Number} frameAngle
	 */
	vec2.vectorToLocalFrame = function(out, worldVector, frameAngle){
	    vec2.rotate(out, worldVector, -frameAngle);
	};
	
	/**
	 * Transform a point position to global frame.
	 * @method toGlobalFrame
	 * @param  {Array} out
	 * @param  {Array} localVector
	 * @param  {Number} frameAngle
	 */
	vec2.vectorToGlobalFrame = function(out, localVector, frameAngle){
	    vec2.rotate(out, localVector, frameAngle);
	};
	
	/**
	 * Compute centroid of a triangle spanned by vectors a,b,c. See http://easycalculation.com/analytical/learn-centroid.php
	 * @method centroid
	 * @static
	 * @param  {Array} out
	 * @param  {Array} a
	 * @param  {Array} b
	 * @param  {Array} c
	 * @return  {Array} The out object
	 */
	vec2.centroid = function(out, a, b, c){
	    vec2.add(out, a, b);
	    vec2.add(out, out, c);
	    vec2.scale(out, out, 1/3);
	    return out;
	};
	
	/**
	 * Creates a new, empty vec2
	 * @static
	 * @method create
	 * @return {Array} a new 2D vector
	 */
	vec2.create = function() {
	    var out = new Utils.ARRAY_TYPE(2);
	    out[0] = 0;
	    out[1] = 0;
	    return out;
	};
	
	/**
	 * Creates a new vec2 initialized with values from an existing vector
	 * @static
	 * @method clone
	 * @param {Array} a vector to clone
	 * @return {Array} a new 2D vector
	 */
	vec2.clone = function(a) {
	    var out = new Utils.ARRAY_TYPE(2);
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};
	
	/**
	 * Creates a new vec2 initialized with the given values
	 * @static
	 * @method fromValues
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @return {Array} a new 2D vector
	 */
	vec2.fromValues = function(x, y) {
	    var out = new Utils.ARRAY_TYPE(2);
	    out[0] = x;
	    out[1] = y;
	    return out;
	};
	
	/**
	 * Copy the values from one vec2 to another
	 * @static
	 * @method copy
	 * @param {Array} out the receiving vector
	 * @param {Array} a the source vector
	 * @return {Array} out
	 */
	vec2.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};
	
	/**
	 * Set the components of a vec2 to the given values
	 * @static
	 * @method set
	 * @param {Array} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @return {Array} out
	 */
	vec2.set = function(out, x, y) {
	    out[0] = x;
	    out[1] = y;
	    return out;
	};
	
	/**
	 * Adds two vec2's
	 * @static
	 * @method add
	 * @param {Array} out the receiving vector
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @return {Array} out
	 */
	vec2.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    return out;
	};
	
	/**
	 * Subtracts two vec2's
	 * @static
	 * @method subtract
	 * @param {Array} out the receiving vector
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @return {Array} out
	 */
	vec2.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    return out;
	};
	
	/**
	 * Alias for vec2.subtract
	 * @static
	 * @method sub
	 */
	vec2.sub = vec2.subtract;
	
	/**
	 * Multiplies two vec2's
	 * @static
	 * @method multiply
	 * @param {Array} out the receiving vector
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @return {Array} out
	 */
	vec2.multiply = function(out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    return out;
	};
	
	/**
	 * Alias for vec2.multiply
	 * @static
	 * @method mul
	 */
	vec2.mul = vec2.multiply;
	
	/**
	 * Divides two vec2's
	 * @static
	 * @method divide
	 * @param {Array} out the receiving vector
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @return {Array} out
	 */
	vec2.divide = function(out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    return out;
	};
	
	/**
	 * Alias for vec2.divide
	 * @static
	 * @method div
	 */
	vec2.div = vec2.divide;
	
	/**
	 * Scales a vec2 by a scalar number
	 * @static
	 * @method scale
	 * @param {Array} out the receiving vector
	 * @param {Array} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @return {Array} out
	 */
	vec2.scale = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    return out;
	};
	
	/**
	 * Calculates the euclidian distance between two vec2's
	 * @static
	 * @method distance
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @return {Number} distance between a and b
	 */
	vec2.distance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return Math.sqrt(x*x + y*y);
	};
	
	/**
	 * Alias for vec2.distance
	 * @static
	 * @method dist
	 */
	vec2.dist = vec2.distance;
	
	/**
	 * Calculates the squared euclidian distance between two vec2's
	 * @static
	 * @method squaredDistance
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @return {Number} squared distance between a and b
	 */
	vec2.squaredDistance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return x*x + y*y;
	};
	
	/**
	 * Alias for vec2.squaredDistance
	 * @static
	 * @method sqrDist
	 */
	vec2.sqrDist = vec2.squaredDistance;
	
	/**
	 * Calculates the length of a vec2
	 * @static
	 * @method length
	 * @param {Array} a vector to calculate length of
	 * @return {Number} length of a
	 */
	vec2.length = function (a) {
	    var x = a[0],
	        y = a[1];
	    return Math.sqrt(x*x + y*y);
	};
	
	/**
	 * Alias for vec2.length
	 * @method len
	 * @static
	 */
	vec2.len = vec2.length;
	
	/**
	 * Calculates the squared length of a vec2
	 * @static
	 * @method squaredLength
	 * @param {Array} a vector to calculate squared length of
	 * @return {Number} squared length of a
	 */
	vec2.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1];
	    return x*x + y*y;
	};
	
	/**
	 * Alias for vec2.squaredLength
	 * @static
	 * @method sqrLen
	 */
	vec2.sqrLen = vec2.squaredLength;
	
	/**
	 * Negates the components of a vec2
	 * @static
	 * @method negate
	 * @param {Array} out the receiving vector
	 * @param {Array} a vector to negate
	 * @return {Array} out
	 */
	vec2.negate = function(out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    return out;
	};
	
	/**
	 * Normalize a vec2
	 * @static
	 * @method normalize
	 * @param {Array} out the receiving vector
	 * @param {Array} a vector to normalize
	 * @return {Array} out
	 */
	vec2.normalize = function(out, a) {
	    var x = a[0],
	        y = a[1];
	    var len = x*x + y*y;
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len);
	        out[0] = a[0] * len;
	        out[1] = a[1] * len;
	    }
	    return out;
	};
	
	/**
	 * Calculates the dot product of two vec2's
	 * @static
	 * @method dot
	 * @param {Array} a the first operand
	 * @param {Array} b the second operand
	 * @return {Number} dot product of a and b
	 */
	vec2.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	};
	
	/**
	 * Returns a string representation of a vector
	 * @static
	 * @method str
	 * @param {Array} vec vector to represent as a string
	 * @return {String} string representation of the vector
	 */
	vec2.str = function (a) {
	    return 'vec2(' + a[0] + ', ' + a[1] + ')';
	};
	
	/**
	 * Linearly interpolate/mix two vectors.
	 * @static
	 * @method lerp
	 * @param {Array} out
	 * @param {Array} a First vector
	 * @param {Array} b Second vector
	 * @param {number} t Lerp factor
	 */
	vec2.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    return out;
	};
	
	/**
	 * Reflect a vector along a normal.
	 * @static
	 * @method reflect
	 * @param {Array} out
	 * @param {Array} vector
	 * @param {Array} normal
	 */
	vec2.reflect = function(out, vector, normal){
	    var dot = vector[0] * normal[0] + vector[1] * normal[1];
	    out[0] = vector[0] - 2 * normal[0] * dot;
	    out[1] = vector[1] - 2 * normal[1] * dot;
	};
	
	/**
	 * Get the intersection point between two line segments.
	 * @static
	 * @method getLineSegmentsIntersection
	 * @param  {Array} out
	 * @param  {Array} p0
	 * @param  {Array} p1
	 * @param  {Array} p2
	 * @param  {Array} p3
	 * @return {boolean} True if there was an intersection, otherwise false.
	 */
	vec2.getLineSegmentsIntersection = function(out, p0, p1, p2, p3) {
	    var t = vec2.getLineSegmentsIntersectionFraction(p0, p1, p2, p3);
	    if(t < 0){
	        return false;
	    } else {
	        out[0] = p0[0] + (t * (p1[0] - p0[0]));
	        out[1] = p0[1] + (t * (p1[1] - p0[1]));
	        return true;
	    }
	};
	
	/**
	 * Get the intersection fraction between two line segments. If successful, the intersection is at p0 + t * (p1 - p0)
	 * @static
	 * @method getLineSegmentsIntersectionFraction
	 * @param  {Array} p0
	 * @param  {Array} p1
	 * @param  {Array} p2
	 * @param  {Array} p3
	 * @return {number} A number between 0 and 1 if there was an intersection, otherwise -1.
	 */
	vec2.getLineSegmentsIntersectionFraction = function(p0, p1, p2, p3) {
	    var s1_x = p1[0] - p0[0];
	    var s1_y = p1[1] - p0[1];
	    var s2_x = p3[0] - p2[0];
	    var s2_y = p3[1] - p2[1];
	
	    var s, t;
	    s = (-s1_y * (p0[0] - p2[0]) + s1_x * (p0[1] - p2[1])) / (-s2_x * s1_y + s1_x * s2_y);
	    t = ( s2_x * (p0[1] - p2[1]) - s2_y * (p0[0] - p2[0])) / (-s2_x * s1_y + s1_x * s2_y);
	    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { // Collision detected
	        return t;
	    }
	    return -1; // No collision
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* global P2_ARRAY_TYPE */
	
	module.exports = Utils;
	
	/**
	 * Misc utility functions
	 * @class Utils
	 * @constructor
	 */
	function Utils(){}
	
	/**
	 * Append the values in array b to the array a. See <a href="http://stackoverflow.com/questions/1374126/how-to-append-an-array-to-an-existing-javascript-array/1374131#1374131">this</a> for an explanation.
	 * @method appendArray
	 * @static
	 * @param  {Array} a
	 * @param  {Array} b
	 */
	Utils.appendArray = function(a,b){
	    if (b.length < 150000) {
	        a.push.apply(a, b);
	    } else {
	        for (var i = 0, len = b.length; i !== len; ++i) {
	            a.push(b[i]);
	        }
	    }
	};
	
	/**
	 * Garbage free Array.splice(). Does not allocate a new array.
	 * @method splice
	 * @static
	 * @param  {Array} array
	 * @param  {Number} index
	 * @param  {Number} howmany
	 */
	Utils.splice = function(array,index,howmany){
	    howmany = howmany || 1;
	    for (var i=index, len=array.length-howmany; i < len; i++){
	        array[i] = array[i + howmany];
	    }
	    array.length = len;
	};
	
	/**
	 * The array type to use for internal numeric computations throughout the library. Float32Array is used if it is available, but falls back on Array. If you want to set array type manually, inject it via the global variable P2_ARRAY_TYPE. See example below.
	 * @static
	 * @property {function} ARRAY_TYPE
	 * @example
	 *     <script>
	 *         <!-- Inject your preferred array type before loading p2.js -->
	 *         P2_ARRAY_TYPE = Array;
	 *     </script>
	 *     <script src="p2.js"></script>
	 */
	if(typeof P2_ARRAY_TYPE !== 'undefined') {
	    Utils.ARRAY_TYPE = P2_ARRAY_TYPE;
	} else if (typeof Float32Array !== 'undefined'){
	    Utils.ARRAY_TYPE = Float32Array;
	} else {
	    Utils.ARRAY_TYPE = Array;
	}
	
	/**
	 * Extend an object with the properties of another
	 * @static
	 * @method extend
	 * @param  {object} a
	 * @param  {object} b
	 */
	Utils.extend = function(a,b){
	    for(var key in b){
	        a[key] = b[key];
	    }
	};
	
	/**
	 * Extend an options object with default values.
	 * @static
	 * @method defaults
	 * @param  {object} options The options object. May be falsy: in this case, a new object is created and returned.
	 * @param  {object} defaults An object containing default values.
	 * @return {object} The modified options object.
	 */
	Utils.defaults = function(options, defaults){
	    options = options || {};
	    for(var key in defaults){
	        if(!(key in options)){
	            options[key] = defaults[key];
	        }
	    }
	    return options;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Equation = __webpack_require__(11),
	    vec2 = __webpack_require__(8);
	
	module.exports = AngleLockEquation;
	
	/**
	 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
	 *
	 * @class AngleLockEquation
	 * @constructor
	 * @extends Equation
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Object} [options]
	 * @param {Number} [options.angle] Angle to add to the local vector in body A.
	 * @param {Number} [options.ratio] Gear ratio
	 */
	function AngleLockEquation(bodyA, bodyB, options){
	    options = options || {};
	    Equation.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);
	    this.angle = options.angle || 0;
	
	    /**
	     * The gear ratio.
	     * @property {Number} ratio
	     * @private
	     * @see setRatio
	     */
	    this.ratio = typeof(options.ratio)==="number" ? options.ratio : 1;
	
	    this.setRatio(this.ratio);
	}
	AngleLockEquation.prototype = new Equation();
	AngleLockEquation.prototype.constructor = AngleLockEquation;
	
	AngleLockEquation.prototype.computeGq = function(){
	    return this.ratio * this.bodyA.angle - this.bodyB.angle + this.angle;
	};
	
	/**
	 * Set the gear ratio for this equation
	 * @method setRatio
	 * @param {Number} ratio
	 */
	AngleLockEquation.prototype.setRatio = function(ratio){
	    var G = this.G;
	    G[2] =  ratio;
	    G[5] = -1;
	    this.ratio = ratio;
	};
	
	/**
	 * Set the max force for the equation.
	 * @method setMaxTorque
	 * @param {Number} torque
	 */
	AngleLockEquation.prototype.setMaxTorque = function(torque){
	    this.maxForce =  torque;
	    this.minForce = -torque;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Equation;
	
	var vec2 = __webpack_require__(8),
	    Utils = __webpack_require__(9),
	    Body = __webpack_require__(12);
	
	/**
	 * Base class for constraint equations.
	 * @class Equation
	 * @constructor
	 * @param {Body} bodyA First body participating in the equation
	 * @param {Body} bodyB Second body participating in the equation
	 * @param {number} minForce Minimum force to apply. Default: -Number.MAX_VALUE
	 * @param {number} maxForce Maximum force to apply. Default: Number.MAX_VALUE
	 */
	function Equation(bodyA, bodyB, minForce, maxForce){
	
	    /**
	     * Minimum force to apply when solving.
	     * @property minForce
	     * @type {Number}
	     */
	    this.minForce = typeof(minForce)==="undefined" ? -Number.MAX_VALUE : minForce;
	
	    /**
	     * Max force to apply when solving.
	     * @property maxForce
	     * @type {Number}
	     */
	    this.maxForce = typeof(maxForce)==="undefined" ? Number.MAX_VALUE : maxForce;
	
	    /**
	     * First body participating in the constraint
	     * @property bodyA
	     * @type {Body}
	     */
	    this.bodyA = bodyA;
	
	    /**
	     * Second body participating in the constraint
	     * @property bodyB
	     * @type {Body}
	     */
	    this.bodyB = bodyB;
	
	    /**
	     * The stiffness of this equation. Typically chosen to a large number (~1e7), but can be chosen somewhat freely to get a stable simulation.
	     * @property stiffness
	     * @type {Number}
	     */
	    this.stiffness = Equation.DEFAULT_STIFFNESS;
	
	    /**
	     * The number of time steps needed to stabilize the constraint equation. Typically between 3 and 5 time steps.
	     * @property relaxation
	     * @type {Number}
	     */
	    this.relaxation = Equation.DEFAULT_RELAXATION;
	
	    /**
	     * The Jacobian entry of this equation. 6 numbers, 3 per body (x,y,angle).
	     * @property G
	     * @type {Array}
	     */
	    this.G = new Utils.ARRAY_TYPE(6);
	    for(var i=0; i<6; i++){
	        this.G[i]=0;
	    }
	
	    this.offset = 0;
	
	    this.a = 0;
	    this.b = 0;
	    this.epsilon = 0;
	    this.timeStep = 1/60;
	
	    /**
	     * Indicates if stiffness or relaxation was changed.
	     * @property {Boolean} needsUpdate
	     */
	    this.needsUpdate = true;
	
	    /**
	     * The resulting constraint multiplier from the last solve. This is mostly equivalent to the force produced by the constraint.
	     * @property multiplier
	     * @type {Number}
	     */
	    this.multiplier = 0;
	
	    /**
	     * Relative velocity.
	     * @property {Number} relativeVelocity
	     */
	    this.relativeVelocity = 0;
	
	    /**
	     * Whether this equation is enabled or not. If true, it will be added to the solver.
	     * @property {Boolean} enabled
	     */
	    this.enabled = true;
	}
	Equation.prototype.constructor = Equation;
	
	/**
	 * The default stiffness when creating a new Equation.
	 * @static
	 * @property {Number} DEFAULT_STIFFNESS
	 * @default 1e6
	 */
	Equation.DEFAULT_STIFFNESS = 1e6;
	
	/**
	 * The default relaxation when creating a new Equation.
	 * @static
	 * @property {Number} DEFAULT_RELAXATION
	 * @default 4
	 */
	Equation.DEFAULT_RELAXATION = 4;
	
	/**
	 * Compute SPOOK parameters .a, .b and .epsilon according to the current parameters. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
	 * @method update
	 */
	Equation.prototype.update = function(){
	    var k = this.stiffness,
	        d = this.relaxation,
	        h = this.timeStep;
	
	    this.a = 4.0 / (h * (1 + 4 * d));
	    this.b = (4.0 * d) / (1 + 4 * d);
	    this.epsilon = 4.0 / (h * h * k * (1 + 4 * d));
	
	    this.needsUpdate = false;
	};
	
	/**
	 * Multiply a jacobian entry with corresponding positions or velocities
	 * @method gmult
	 * @return {Number}
	 */
	Equation.prototype.gmult = function(G,vi,wi,vj,wj){
	    return  G[0] * vi[0] +
	            G[1] * vi[1] +
	            G[2] * wi +
	            G[3] * vj[0] +
	            G[4] * vj[1] +
	            G[5] * wj;
	};
	
	/**
	 * Computes the RHS of the SPOOK equation
	 * @method computeB
	 * @return {Number}
	 */
	Equation.prototype.computeB = function(a,b,h){
	    var GW = this.computeGW();
	    var Gq = this.computeGq();
	    var GiMf = this.computeGiMf();
	    return - Gq * a - GW * b - GiMf*h;
	};
	
	/**
	 * Computes G\*q, where q are the generalized body coordinates
	 * @method computeGq
	 * @return {Number}
	 */
	var qi = vec2.create(),
	    qj = vec2.create();
	Equation.prototype.computeGq = function(){
	    var G = this.G,
	        bi = this.bodyA,
	        bj = this.bodyB,
	        xi = bi.position,
	        xj = bj.position,
	        ai = bi.angle,
	        aj = bj.angle;
	
	    return this.gmult(G, qi, ai, qj, aj) + this.offset;
	};
	
	/**
	 * Computes G\*W, where W are the body velocities
	 * @method computeGW
	 * @return {Number}
	 */
	Equation.prototype.computeGW = function(){
	    var G = this.G,
	        bi = this.bodyA,
	        bj = this.bodyB,
	        vi = bi.velocity,
	        vj = bj.velocity,
	        wi = bi.angularVelocity,
	        wj = bj.angularVelocity;
	    return this.gmult(G,vi,wi,vj,wj) + this.relativeVelocity;
	};
	
	/**
	 * Computes G\*Wlambda, where W are the body velocities
	 * @method computeGWlambda
	 * @return {Number}
	 */
	Equation.prototype.computeGWlambda = function(){
	    var G = this.G,
	        bi = this.bodyA,
	        bj = this.bodyB,
	        vi = bi.vlambda,
	        vj = bj.vlambda,
	        wi = bi.wlambda,
	        wj = bj.wlambda;
	    return this.gmult(G,vi,wi,vj,wj);
	};
	
	/**
	 * Computes G\*inv(M)\*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
	 * @method computeGiMf
	 * @return {Number}
	 */
	var iMfi = vec2.create(),
	    iMfj = vec2.create();
	Equation.prototype.computeGiMf = function(){
	    var bi = this.bodyA,
	        bj = this.bodyB,
	        fi = bi.force,
	        ti = bi.angularForce,
	        fj = bj.force,
	        tj = bj.angularForce,
	        invMassi = bi.invMassSolve,
	        invMassj = bj.invMassSolve,
	        invIi = bi.invInertiaSolve,
	        invIj = bj.invInertiaSolve,
	        G = this.G;
	
	    vec2.scale(iMfi, fi, invMassi);
	    vec2.multiply(iMfi, bi.massMultiplier, iMfi);
	    vec2.scale(iMfj, fj,invMassj);
	    vec2.multiply(iMfj, bj.massMultiplier, iMfj);
	
	    return this.gmult(G,iMfi,ti*invIi,iMfj,tj*invIj);
	};
	
	/**
	 * Computes G\*inv(M)\*G'
	 * @method computeGiMGt
	 * @return {Number}
	 */
	Equation.prototype.computeGiMGt = function(){
	    var bi = this.bodyA,
	        bj = this.bodyB,
	        invMassi = bi.invMassSolve,
	        invMassj = bj.invMassSolve,
	        invIi = bi.invInertiaSolve,
	        invIj = bj.invInertiaSolve,
	        G = this.G;
	
	    return  G[0] * G[0] * invMassi * bi.massMultiplier[0] +
	            G[1] * G[1] * invMassi * bi.massMultiplier[1] +
	            G[2] * G[2] *    invIi +
	            G[3] * G[3] * invMassj * bj.massMultiplier[0] +
	            G[4] * G[4] * invMassj * bj.massMultiplier[1] +
	            G[5] * G[5] *    invIj;
	};
	
	var addToWlambda_temp = vec2.create(),
	    addToWlambda_Gi = vec2.create(),
	    addToWlambda_Gj = vec2.create(),
	    addToWlambda_ri = vec2.create(),
	    addToWlambda_rj = vec2.create(),
	    addToWlambda_Mdiag = vec2.create();
	
	/**
	 * Add constraint velocity to the bodies.
	 * @method addToWlambda
	 * @param {Number} deltalambda
	 */
	Equation.prototype.addToWlambda = function(deltalambda){
	    var bi = this.bodyA,
	        bj = this.bodyB,
	        temp = addToWlambda_temp,
	        Gi = addToWlambda_Gi,
	        Gj = addToWlambda_Gj,
	        ri = addToWlambda_ri,
	        rj = addToWlambda_rj,
	        invMassi = bi.invMassSolve,
	        invMassj = bj.invMassSolve,
	        invIi = bi.invInertiaSolve,
	        invIj = bj.invInertiaSolve,
	        Mdiag = addToWlambda_Mdiag,
	        G = this.G;
	
	    Gi[0] = G[0];
	    Gi[1] = G[1];
	    Gj[0] = G[3];
	    Gj[1] = G[4];
	
	    // Add to linear velocity
	    // v_lambda += inv(M) * delta_lamba * G
	    vec2.scale(temp, Gi, invMassi*deltalambda);
	    vec2.multiply(temp, temp, bi.massMultiplier);
	    vec2.add( bi.vlambda, bi.vlambda, temp);
	    // This impulse is in the offset frame
	    // Also add contribution to angular
	    //bi.wlambda -= vec2.crossLength(temp,ri);
	    bi.wlambda += invIi * G[2] * deltalambda;
	
	
	    vec2.scale(temp, Gj, invMassj*deltalambda);
	    vec2.multiply(temp, temp, bj.massMultiplier);
	    vec2.add( bj.vlambda, bj.vlambda, temp);
	    //bj.wlambda -= vec2.crossLength(temp,rj);
	    bj.wlambda += invIj * G[5] * deltalambda;
	};
	
	/**
	 * Compute the denominator part of the SPOOK equation: C = G\*inv(M)\*G' + eps
	 * @method computeInvC
	 * @param  {Number} eps
	 * @return {Number}
	 */
	Equation.prototype.computeInvC = function(eps){
	    return 1.0 / (this.computeGiMGt() + eps);
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8)
	,   decomp = __webpack_require__(13)
	,   Convex = __webpack_require__(18)
	,   RaycastResult = __webpack_require__(21)
	,   Ray = __webpack_require__(22)
	,   AABB = __webpack_require__(7)
	,   EventEmitter = __webpack_require__(23);
	
	module.exports = Body;
	
	/**
	 * A rigid body. Has got a center of mass, position, velocity and a number of
	 * shapes that are used for collisions.
	 *
	 * @class Body
	 * @constructor
	 * @extends EventEmitter
	 * @param {Object} [options]
	 * @param {Array} [options.force]
	 * @param {Array} [options.position]
	 * @param {Array} [options.velocity]
	 * @param {Boolean} [options.allowSleep]
	 * @param {Boolean} [options.collisionResponse]
	 * @param {Number} [options.angle=0]
	 * @param {Number} [options.angularForce=0]
	 * @param {Number} [options.angularVelocity=0]
	 * @param {Number} [options.ccdIterations=10]
	 * @param {Number} [options.ccdSpeedThreshold=-1]
	 * @param {Number} [options.fixedRotation=false]
	 * @param {Number} [options.gravityScale]
	 * @param {Number} [options.id]
	 * @param {Number} [options.mass=0] A number >= 0. If zero, the .type will be set to Body.STATIC.
	 * @param {Number} [options.sleepSpeedLimit]
	 * @param {Number} [options.sleepTimeLimit]
	 *
	 * @example
	 *
	 *     // Create a typical dynamic body
	 *     var body = new Body({
	 *         mass: 1,
	 *         position: [0, 0],
	 *         angle: 0,
	 *         velocity: [0, 0],
	 *         angularVelocity: 0
	 *     });
	 *
	 *     // Add a circular shape to the body
	 *     body.addShape(new Circle({ radius: 1 }));
	 *
	 *     // Add the body to the world
	 *     world.addBody(body);
	 */
	function Body(options){
	    options = options || {};
	
	    EventEmitter.call(this);
	
	    /**
	     * The body identifyer
	     * @property id
	     * @type {Number}
	     */
	    this.id = options.id || ++Body._idCounter;
	
	    /**
	     * The world that this body is added to. This property is set to NULL if the body is not added to any world.
	     * @property world
	     * @type {World}
	     */
	    this.world = null;
	
	    /**
	     * The shapes of the body.
	     *
	     * @property shapes
	     * @type {Array}
	     */
	    this.shapes = [];
	
	    /**
	     * The mass of the body.
	     * @property mass
	     * @type {number}
	     */
	    this.mass = options.mass || 0;
	
	    /**
	     * The inverse mass of the body.
	     * @property invMass
	     * @type {number}
	     */
	    this.invMass = 0;
	
	    /**
	     * The inertia of the body around the Z axis.
	     * @property inertia
	     * @type {number}
	     */
	    this.inertia = 0;
	
	    /**
	     * The inverse inertia of the body.
	     * @property invInertia
	     * @type {number}
	     */
	    this.invInertia = 0;
	
	    this.invMassSolve = 0;
	    this.invInertiaSolve = 0;
	
	    /**
	     * Set to true if you want to fix the rotation of the body.
	     * @property fixedRotation
	     * @type {Boolean}
	     */
	    this.fixedRotation = !!options.fixedRotation;
	
	    /**
	     * Set to true if you want to fix the body movement along the X axis. The body will still be able to move along Y.
	     * @property {Boolean} fixedX
	     */
	    this.fixedX = !!options.fixedX;
	
	    /**
	     * Set to true if you want to fix the body movement along the Y axis. The body will still be able to move along X.
	     * @property {Boolean} fixedY
	     */
	    this.fixedY = !!options.fixedY;
	
	    /**
	     * @private
	     * @property {array} massMultiplier
	     */
	    this.massMultiplier = vec2.create();
	
	    /**
	     * The position of the body
	     * @property position
	     * @type {Array}
	     */
	    this.position = vec2.fromValues(0,0);
	    if(options.position){
	        vec2.copy(this.position, options.position);
	    }
	
	    /**
	     * The interpolated position of the body. Use this for rendering.
	     * @property interpolatedPosition
	     * @type {Array}
	     */
	    this.interpolatedPosition = vec2.fromValues(0,0);
	
	    /**
	     * The interpolated angle of the body. Use this for rendering.
	     * @property interpolatedAngle
	     * @type {Number}
	     */
	    this.interpolatedAngle = 0;
	
	    /**
	     * The previous position of the body.
	     * @property previousPosition
	     * @type {Array}
	     */
	    this.previousPosition = vec2.fromValues(0,0);
	
	    /**
	     * The previous angle of the body.
	     * @property previousAngle
	     * @type {Number}
	     */
	    this.previousAngle = 0;
	
	    /**
	     * The current velocity of the body.
	     * @property velocity
	     * @type {Array}
	     */
	    this.velocity = vec2.fromValues(0,0);
	    if(options.velocity){
	        vec2.copy(this.velocity, options.velocity);
	    }
	
	    /**
	     * Constraint velocity that was added to the body during the last step.
	     * @property vlambda
	     * @type {Array}
	     */
	    this.vlambda = vec2.fromValues(0,0);
	
	    /**
	     * Angular constraint velocity that was added to the body during last step.
	     * @property wlambda
	     * @type {Array}
	     */
	    this.wlambda = 0;
	
	    /**
	     * The angle of the body, in radians.
	     * @property angle
	     * @type {number}
	     * @example
	     *     // The angle property is not normalized to the interval 0 to 2*pi, it can be any value.
	     *     // If you need a value between 0 and 2*pi, use the following function to normalize it.
	     *     function normalizeAngle(angle){
	     *         angle = angle % (2*Math.PI);
	     *         if(angle < 0){
	     *             angle += (2*Math.PI);
	     *         }
	     *         return angle;
	     *     }
	     */
	    this.angle = options.angle || 0;
	
	    /**
	     * The angular velocity of the body, in radians per second.
	     * @property angularVelocity
	     * @type {number}
	     */
	    this.angularVelocity = options.angularVelocity || 0;
	
	    /**
	     * The force acting on the body. Since the body force (and {{#crossLink "Body/angularForce:property"}}{{/crossLink}}) will be zeroed after each step, so you need to set the force before each step.
	     * @property force
	     * @type {Array}
	     *
	     * @example
	     *     // This produces a forcefield of 1 Newton in the positive x direction.
	     *     for(var i=0; i<numSteps; i++){
	     *         body.force[0] = 1;
	     *         world.step(1/60);
	     *     }
	     *
	     * @example
	     *     // This will apply a rotational force on the body
	     *     for(var i=0; i<numSteps; i++){
	     *         body.angularForce = -3;
	     *         world.step(1/60);
	     *     }
	     */
	    this.force = vec2.create();
	    if(options.force){
	        vec2.copy(this.force, options.force);
	    }
	
	    /**
	     * The angular force acting on the body. See {{#crossLink "Body/force:property"}}{{/crossLink}}.
	     * @property angularForce
	     * @type {number}
	     */
	    this.angularForce = options.angularForce || 0;
	
	    /**
	     * The linear damping acting on the body in the velocity direction. Should be a value between 0 and 1.
	     * @property damping
	     * @type {Number}
	     * @default 0.1
	     */
	    this.damping = typeof(options.damping) === "number" ? options.damping : 0.1;
	
	    /**
	     * The angular force acting on the body. Should be a value between 0 and 1.
	     * @property angularDamping
	     * @type {Number}
	     * @default 0.1
	     */
	    this.angularDamping = typeof(options.angularDamping) === "number" ? options.angularDamping : 0.1;
	
	    /**
	     * The type of motion this body has. Should be one of: {{#crossLink "Body/STATIC:property"}}Body.STATIC{{/crossLink}}, {{#crossLink "Body/DYNAMIC:property"}}Body.DYNAMIC{{/crossLink}} and {{#crossLink "Body/KINEMATIC:property"}}Body.KINEMATIC{{/crossLink}}.
	     *
	     * * Static bodies do not move, and they do not respond to forces or collision.
	     * * Dynamic bodies body can move and respond to collisions and forces.
	     * * Kinematic bodies only moves according to its .velocity, and does not respond to collisions or force.
	     *
	     * @property type
	     * @type {number}
	     *
	     * @example
	     *     // Bodies are static by default. Static bodies will never move.
	     *     var body = new Body();
	     *     console.log(body.type == Body.STATIC); // true
	     *
	     * @example
	     *     // By setting the mass of a body to a nonzero number, the body
	     *     // will become dynamic and will move and interact with other bodies.
	     *     var dynamicBody = new Body({
	     *         mass : 1
	     *     });
	     *     console.log(dynamicBody.type == Body.DYNAMIC); // true
	     *
	     * @example
	     *     // Kinematic bodies will only move if you change their velocity.
	     *     var kinematicBody = new Body({
	     *         type: Body.KINEMATIC // Type can be set via the options object.
	     *     });
	     */
	    this.type = Body.STATIC;
	
	    if(typeof(options.type) !== 'undefined'){
	        this.type = options.type;
	    } else if(!options.mass){
	        this.type = Body.STATIC;
	    } else {
	        this.type = Body.DYNAMIC;
	    }
	
	    /**
	     * Bounding circle radius.
	     * @property boundingRadius
	     * @type {Number}
	     */
	    this.boundingRadius = 0;
	
	    /**
	     * Bounding box of this body.
	     * @property aabb
	     * @type {AABB}
	     */
	    this.aabb = new AABB();
	
	    /**
	     * Indicates if the AABB needs update. Update it with {{#crossLink "Body/updateAABB:method"}}.updateAABB(){{/crossLink}}.
	     * @property aabbNeedsUpdate
	     * @type {Boolean}
	     * @see updateAABB
	     *
	     * @example
	     *     // Force update the AABB
	     *     body.aabbNeedsUpdate = true;
	     *     body.updateAABB();
	     *     console.log(body.aabbNeedsUpdate); // false
	     */
	    this.aabbNeedsUpdate = true;
	
	    /**
	     * If true, the body will automatically fall to sleep. Note that you need to enable sleeping in the {{#crossLink "World"}}{{/crossLink}} before anything will happen.
	     * @property allowSleep
	     * @type {Boolean}
	     * @default true
	     */
	    this.allowSleep = options.allowSleep !== undefined ? options.allowSleep : true;
	
	    this.wantsToSleep = false;
	
	    /**
	     * One of {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}}, {{#crossLink "Body/SLEEPY:property"}}Body.SLEEPY{{/crossLink}} and {{#crossLink "Body/SLEEPING:property"}}Body.SLEEPING{{/crossLink}}.
	     *
	     * The body is initially Body.AWAKE. If its velocity norm is below .sleepSpeedLimit, the sleepState will become Body.SLEEPY. If the body continues to be Body.SLEEPY for .sleepTimeLimit seconds, it will fall asleep (Body.SLEEPY).
	     *
	     * @property sleepState
	     * @type {Number}
	     * @default Body.AWAKE
	     */
	    this.sleepState = Body.AWAKE;
	
	    /**
	     * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
	     * @property sleepSpeedLimit
	     * @type {Number}
	     * @default 0.2
	     */
	    this.sleepSpeedLimit = options.sleepSpeedLimit !== undefined ? options.sleepSpeedLimit : 0.2;
	
	    /**
	     * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
	     * @property sleepTimeLimit
	     * @type {Number}
	     * @default 1
	     */
	    this.sleepTimeLimit = options.sleepTimeLimit !== undefined ? options.sleepTimeLimit : 1;
	
	    /**
	     * Gravity scaling factor. If you want the body to ignore gravity, set this to zero. If you want to reverse gravity, set it to -1.
	     * @property {Number} gravityScale
	     * @default 1
	     */
	    this.gravityScale = options.gravityScale !== undefined ? options.gravityScale : 1;
	
	    /**
	     * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled. That means that this body will move through other bodies, but it will still trigger contact events, etc.
	     * @property {Boolean} collisionResponse
	     */
	    this.collisionResponse = options.collisionResponse !== undefined ? options.collisionResponse : true;
	
	    /**
	     * How long the body has been sleeping.
	     * @property {Number} idleTime
	     */
	    this.idleTime = 0;
	
	    /**
	     * The last time when the body went to SLEEPY state.
	     * @property {Number} timeLastSleepy
	     * @private
	     */
	    this.timeLastSleepy = 0;
	
	    /**
	     * If the body speed exceeds this threshold, CCD (continuous collision detection) will be enabled. Set it to a negative number to disable CCD completely for this body.
	     * @property {number} ccdSpeedThreshold
	     * @default -1
	     */
	    this.ccdSpeedThreshold = options.ccdSpeedThreshold !== undefined ? options.ccdSpeedThreshold : -1;
	
	    /**
	     * The number of iterations that should be used when searching for the time of impact during CCD. A larger number will assure that there's a small penetration on CCD collision, but a small number will give more performance.
	     * @property {number} ccdIterations
	     * @default 10
	     */
	    this.ccdIterations = options.ccdIterations !== undefined ? options.ccdIterations : 10;
	
	    this.concavePath = null;
	
	    this._wakeUpAfterNarrowphase = false;
	
	    this.updateMassProperties();
	}
	Body.prototype = new EventEmitter();
	Body.prototype.constructor = Body;
	
	Body._idCounter = 0;
	
	/**
	 * @private
	 * @method updateSolveMassProperties
	 */
	Body.prototype.updateSolveMassProperties = function(){
	    if(this.sleepState === Body.SLEEPING || this.type === Body.KINEMATIC){
	        this.invMassSolve = 0;
	        this.invInertiaSolve = 0;
	    } else {
	        this.invMassSolve = this.invMass;
	        this.invInertiaSolve = this.invInertia;
	    }
	};
	
	/**
	 * Set the total density of the body
	 * @method setDensity
	 * @param {number} density
	 */
	Body.prototype.setDensity = function(density) {
	    var totalArea = this.getArea();
	    this.mass = totalArea * density;
	    this.updateMassProperties();
	};
	
	/**
	 * Get the total area of all shapes in the body
	 * @method getArea
	 * @return {Number}
	 */
	Body.prototype.getArea = function() {
	    var totalArea = 0;
	    for(var i=0; i<this.shapes.length; i++){
	        totalArea += this.shapes[i].area;
	    }
	    return totalArea;
	};
	
	/**
	 * Get the AABB from the body. The AABB is updated if necessary.
	 * @method getAABB
	 * @return {AABB} The AABB instance (this.aabb)
	 */
	Body.prototype.getAABB = function(){
	    if(this.aabbNeedsUpdate){
	        this.updateAABB();
	    }
	    return this.aabb;
	};
	
	var shapeAABB = new AABB(),
	    tmp = vec2.create();
	
	/**
	 * Updates the AABB of the Body, and set .aabbNeedsUpdate = false.
	 * @method updateAABB
	 */
	Body.prototype.updateAABB = function() {
	    var shapes = this.shapes,
	        N = shapes.length,
	        offset = tmp,
	        bodyAngle = this.angle;
	
	    for(var i=0; i!==N; i++){
	        var shape = shapes[i],
	            angle = shape.angle + bodyAngle;
	
	        // Get shape world offset
	        vec2.rotate(offset, shape.position, bodyAngle);
	        vec2.add(offset, offset, this.position);
	
	        // Get shape AABB
	        shape.computeAABB(shapeAABB, offset, angle);
	
	        if(i===0){
	            this.aabb.copy(shapeAABB);
	        } else {
	            this.aabb.extend(shapeAABB);
	        }
	    }
	
	    this.aabbNeedsUpdate = false;
	};
	
	/**
	 * Update the bounding radius of the body (this.boundingRadius). Should be done if any of the shape dimensions or positions are changed.
	 * @method updateBoundingRadius
	 */
	Body.prototype.updateBoundingRadius = function(){
	    var shapes = this.shapes,
	        N = shapes.length,
	        radius = 0;
	
	    for(var i=0; i!==N; i++){
	        var shape = shapes[i],
	            offset = vec2.length(shape.position),
	            r = shape.boundingRadius;
	        if(offset + r > radius){
	            radius = offset + r;
	        }
	    }
	
	    this.boundingRadius = radius;
	};
	
	/**
	 * Add a shape to the body. You can pass a local transform when adding a shape,
	 * so that the shape gets an offset and angle relative to the body center of mass.
	 * Will automatically update the mass properties and bounding radius.
	 *
	 * @method addShape
	 * @param  {Shape}              shape
	 * @param  {Array} [offset] Local body offset of the shape.
	 * @param  {Number}             [angle]  Local body angle.
	 *
	 * @example
	 *     var body = new Body(),
	 *         shape = new Circle({ radius: 1 });
	 *
	 *     // Add the shape to the body, positioned in the center
	 *     body.addShape(shape);
	 *
	 *     // Add another shape to the body, positioned 1 unit length from the body center of mass along the local x-axis.
	 *     body.addShape(shape,[1,0]);
	 *
	 *     // Add another shape to the body, positioned 1 unit length from the body center of mass along the local y-axis, and rotated 90 degrees CCW.
	 *     body.addShape(shape,[0,1],Math.PI/2);
	 */
	Body.prototype.addShape = function(shape, offset, angle){
	    if(shape.body){
	        throw new Error('A shape can only be added to one body.');
	    }
	    shape.body = this;
	
	    // Copy the offset vector
	    if(offset){
	        vec2.copy(shape.position, offset);
	    } else {
	        vec2.set(shape.position, 0, 0);
	    }
	
	    shape.angle = angle || 0;
	
	    this.shapes.push(shape);
	    this.updateMassProperties();
	    this.updateBoundingRadius();
	
	    this.aabbNeedsUpdate = true;
	};
	
	/**
	 * Remove a shape
	 * @method removeShape
	 * @param  {Shape} shape
	 * @return {Boolean} True if the shape was found and removed, else false.
	 */
	Body.prototype.removeShape = function(shape){
	    var idx = this.shapes.indexOf(shape);
	
	    if(idx !== -1){
	        this.shapes.splice(idx,1);
	        this.aabbNeedsUpdate = true;
	        shape.body = null;
	        return true;
	    } else {
	        return false;
	    }
	};
	
	/**
	 * Updates .inertia, .invMass, .invInertia for this Body. Should be called when
	 * changing the structure or mass of the Body.
	 *
	 * @method updateMassProperties
	 *
	 * @example
	 *     body.mass += 1;
	 *     body.updateMassProperties();
	 */
	Body.prototype.updateMassProperties = function(){
	    if(this.type === Body.STATIC || this.type === Body.KINEMATIC){
	
	        this.mass = Number.MAX_VALUE;
	        this.invMass = 0;
	        this.inertia = Number.MAX_VALUE;
	        this.invInertia = 0;
	
	    } else {
	
	        var shapes = this.shapes,
	            N = shapes.length,
	            m = this.mass / N,
	            I = 0;
	
	        if(!this.fixedRotation){
	            for(var i=0; i<N; i++){
	                var shape = shapes[i],
	                    r2 = vec2.squaredLength(shape.position),
	                    Icm = shape.computeMomentOfInertia(m);
	                I += Icm + m*r2;
	            }
	            this.inertia = I;
	            this.invInertia = I>0 ? 1/I : 0;
	
	        } else {
	            this.inertia = Number.MAX_VALUE;
	            this.invInertia = 0;
	        }
	
	        // Inverse mass properties are easy
	        this.invMass = 1 / this.mass;
	
	        vec2.set(
	            this.massMultiplier,
	            this.fixedX ? 0 : 1,
	            this.fixedY ? 0 : 1
	        );
	    }
	};
	
	var Body_applyForce_r = vec2.create();
	
	/**
	 * Apply force to a point relative to the center of mass of the body. This could for example be a point on the RigidBody surface. Applying force this way will add to Body.force and Body.angularForce. If relativePoint is zero, the force will be applied directly on the center of mass, and the torque produced will be zero.
	 * @method applyForce
	 * @param {Array} force The force to add.
	 * @param {Array} [relativePoint] A world point to apply the force on.
	 */
	Body.prototype.applyForce = function(force, relativePoint){
	
	    // Add linear force
	    vec2.add(this.force, this.force, force);
	
	    if(relativePoint){
	
	        // Compute produced rotational force
	        var rotForce = vec2.crossLength(relativePoint,force);
	
	        // Add rotational force
	        this.angularForce += rotForce;
	    }
	};
	
	/**
	 * Apply force to a body-local point.
	 * @method applyForceLocal
	 * @param  {Array} localForce The force vector to add, oriented in local body space.
	 * @param  {Array} [localPoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
	 */
	var Body_applyForce_forceWorld = vec2.create();
	var Body_applyForce_pointWorld = vec2.create();
	var Body_applyForce_pointLocal = vec2.create();
	Body.prototype.applyForceLocal = function(localForce, localPoint){
	    localPoint = localPoint || Body_applyForce_pointLocal;
	    var worldForce = Body_applyForce_forceWorld;
	    var worldPoint = Body_applyForce_pointWorld;
	    this.vectorToWorldFrame(worldForce, localForce);
	    this.vectorToWorldFrame(worldPoint, localPoint);
	    this.applyForce(worldForce, worldPoint);
	};
	
	/**
	 * Apply impulse to a point relative to the body. This could for example be a point on the Body surface. An impulse is a force added to a body during a short period of time (impulse = force * time). Impulses will be added to Body.velocity and Body.angularVelocity.
	 * @method applyImpulse
	 * @param  {Array} impulse The impulse vector to add, oriented in world space.
	 * @param  {Array} [relativePoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
	 */
	var Body_applyImpulse_velo = vec2.create();
	Body.prototype.applyImpulse = function(impulseVector, relativePoint){
	    if(this.type !== Body.DYNAMIC){
	        return;
	    }
	
	    // Compute produced central impulse velocity
	    var velo = Body_applyImpulse_velo;
	    vec2.scale(velo, impulseVector, this.invMass);
	    vec2.multiply(velo, this.massMultiplier, velo);
	
	    // Add linear impulse
	    vec2.add(this.velocity, velo, this.velocity);
	
	    if(relativePoint){
	        // Compute produced rotational impulse velocity
	        var rotVelo = vec2.crossLength(relativePoint, impulseVector);
	        rotVelo *= this.invInertia;
	
	        // Add rotational Impulse
	        this.angularVelocity += rotVelo;
	    }
	};
	
	/**
	 * Apply impulse to a point relative to the body. This could for example be a point on the Body surface. An impulse is a force added to a body during a short period of time (impulse = force * time). Impulses will be added to Body.velocity and Body.angularVelocity.
	 * @method applyImpulseLocal
	 * @param  {Array} impulse The impulse vector to add, oriented in world space.
	 * @param  {Array} [relativePoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
	 */
	var Body_applyImpulse_impulseWorld = vec2.create();
	var Body_applyImpulse_pointWorld = vec2.create();
	var Body_applyImpulse_pointLocal = vec2.create();
	Body.prototype.applyImpulseLocal = function(localImpulse, localPoint){
	    localPoint = localPoint || Body_applyImpulse_pointLocal;
	    var worldImpulse = Body_applyImpulse_impulseWorld;
	    var worldPoint = Body_applyImpulse_pointWorld;
	    this.vectorToWorldFrame(worldImpulse, localImpulse);
	    this.vectorToWorldFrame(worldPoint, localPoint);
	    this.applyImpulse(worldImpulse, worldPoint);
	};
	
	/**
	 * Transform a world point to local body frame.
	 * @method toLocalFrame
	 * @param  {Array} out          The vector to store the result in
	 * @param  {Array} worldPoint   The input world point
	 */
	Body.prototype.toLocalFrame = function(out, worldPoint){
	    vec2.toLocalFrame(out, worldPoint, this.position, this.angle);
	};
	
	/**
	 * Transform a local point to world frame.
	 * @method toWorldFrame
	 * @param  {Array} out          The vector to store the result in
	 * @param  {Array} localPoint   The input local point
	 */
	Body.prototype.toWorldFrame = function(out, localPoint){
	    vec2.toGlobalFrame(out, localPoint, this.position, this.angle);
	};
	
	/**
	 * Transform a world point to local body frame.
	 * @method vectorToLocalFrame
	 * @param  {Array} out          The vector to store the result in
	 * @param  {Array} worldVector  The input world vector
	 */
	Body.prototype.vectorToLocalFrame = function(out, worldVector){
	    vec2.vectorToLocalFrame(out, worldVector, this.angle);
	};
	
	/**
	 * Transform a local point to world frame.
	 * @method vectorToWorldFrame
	 * @param  {Array} out          The vector to store the result in
	 * @param  {Array} localVector  The input local vector
	 */
	Body.prototype.vectorToWorldFrame = function(out, localVector){
	    vec2.vectorToGlobalFrame(out, localVector, this.angle);
	};
	
	/**
	 * Reads a polygon shape path, and assembles convex shapes from that and puts them at proper offset points.
	 * @method fromPolygon
	 * @param {Array} path An array of 2d vectors, e.g. [[0,0],[0,1],...] that resembles a concave or convex polygon. The shape must be simple and without holes.
	 * @param {Object} [options]
	 * @param {Boolean} [options.optimalDecomp=false]   Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
	 * @param {Boolean} [options.skipSimpleCheck=false] Set to true if you already know that the path is not intersecting itself.
	 * @param {Boolean|Number} [options.removeCollinearPoints=false] Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
	 * @return {Boolean} True on success, else false.
	 */
	Body.prototype.fromPolygon = function(path,options){
	    options = options || {};
	
	    // Remove all shapes
	    for(var i=this.shapes.length; i>=0; --i){
	        this.removeShape(this.shapes[i]);
	    }
	
	    var p = new decomp.Polygon();
	    p.vertices = path;
	
	    // Make it counter-clockwise
	    p.makeCCW();
	
	    if(typeof(options.removeCollinearPoints) === "number"){
	        p.removeCollinearPoints(options.removeCollinearPoints);
	    }
	
	    // Check if any line segment intersects the path itself
	    if(typeof(options.skipSimpleCheck) === "undefined"){
	        if(!p.isSimple()){
	            return false;
	        }
	    }
	
	    // Save this path for later
	    this.concavePath = p.vertices.slice(0);
	    for(var i=0; i<this.concavePath.length; i++){
	        var v = [0,0];
	        vec2.copy(v,this.concavePath[i]);
	        this.concavePath[i] = v;
	    }
	
	    // Slow or fast decomp?
	    var convexes;
	    if(options.optimalDecomp){
	        convexes = p.decomp();
	    } else {
	        convexes = p.quickDecomp();
	    }
	
	    var cm = vec2.create();
	
	    // Add convexes
	    for(var i=0; i!==convexes.length; i++){
	        // Create convex
	        var c = new Convex({ vertices: convexes[i].vertices });
	
	        // Move all vertices so its center of mass is in the local center of the convex
	        for(var j=0; j!==c.vertices.length; j++){
	            var v = c.vertices[j];
	            vec2.sub(v,v,c.centerOfMass);
	        }
	
	        vec2.scale(cm,c.centerOfMass,1);
	        c.updateTriangles();
	        c.updateCenterOfMass();
	        c.updateBoundingRadius();
	
	        // Add the shape
	        this.addShape(c,cm);
	    }
	
	    this.adjustCenterOfMass();
	
	    this.aabbNeedsUpdate = true;
	
	    return true;
	};
	
	var adjustCenterOfMass_tmp1 = vec2.fromValues(0,0),
	    adjustCenterOfMass_tmp2 = vec2.fromValues(0,0),
	    adjustCenterOfMass_tmp3 = vec2.fromValues(0,0),
	    adjustCenterOfMass_tmp4 = vec2.fromValues(0,0);
	
	/**
	 * Moves the shape offsets so their center of mass becomes the body center of mass.
	 * @method adjustCenterOfMass
	 */
	Body.prototype.adjustCenterOfMass = function(){
	    var offset_times_area = adjustCenterOfMass_tmp2,
	        sum =               adjustCenterOfMass_tmp3,
	        cm =                adjustCenterOfMass_tmp4,
	        totalArea =         0;
	    vec2.set(sum,0,0);
	
	    for(var i=0; i!==this.shapes.length; i++){
	        var s = this.shapes[i];
	        vec2.scale(offset_times_area, s.position, s.area);
	        vec2.add(sum, sum, offset_times_area);
	        totalArea += s.area;
	    }
	
	    vec2.scale(cm,sum,1/totalArea);
	
	    // Now move all shapes
	    for(var i=0; i!==this.shapes.length; i++){
	        var s = this.shapes[i];
	        vec2.sub(s.position, s.position, cm);
	    }
	
	    // Move the body position too
	    vec2.add(this.position,this.position,cm);
	
	    // And concave path
	    for(var i=0; this.concavePath && i<this.concavePath.length; i++){
	        vec2.sub(this.concavePath[i], this.concavePath[i], cm);
	    }
	
	    this.updateMassProperties();
	    this.updateBoundingRadius();
	};
	
	/**
	 * Sets the force on the body to zero.
	 * @method setZeroForce
	 */
	Body.prototype.setZeroForce = function(){
	    vec2.set(this.force,0.0,0.0);
	    this.angularForce = 0.0;
	};
	
	Body.prototype.resetConstraintVelocity = function(){
	    var b = this,
	        vlambda = b.vlambda;
	    vec2.set(vlambda,0,0);
	    b.wlambda = 0;
	};
	
	Body.prototype.addConstraintVelocity = function(){
	    var b = this,
	        v = b.velocity;
	    vec2.add( v, v, b.vlambda);
	    b.angularVelocity += b.wlambda;
	};
	
	/**
	 * Apply damping, see <a href="http://code.google.com/p/bullet/issues/detail?id=74">this</a> for details.
	 * @method applyDamping
	 * @param  {number} dt Current time step
	 */
	Body.prototype.applyDamping = function(dt){
	    if(this.type === Body.DYNAMIC){ // Only for dynamic bodies
	        var v = this.velocity;
	        vec2.scale(v, v, Math.pow(1.0 - this.damping,dt));
	        this.angularVelocity *= Math.pow(1.0 - this.angularDamping,dt);
	    }
	};
	
	/**
	 * Wake the body up. Normally you should not need this, as the body is automatically awoken at events such as collisions.
	 * Sets the sleepState to {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}} and emits the wakeUp event if the body wasn't awake before.
	 * @method wakeUp
	 */
	Body.prototype.wakeUp = function(){
	    var s = this.sleepState;
	    this.sleepState = Body.AWAKE;
	    this.idleTime = 0;
	    if(s !== Body.AWAKE){
	        this.emit(Body.wakeUpEvent);
	    }
	};
	
	/**
	 * Force body sleep
	 * @method sleep
	 */
	Body.prototype.sleep = function(){
	    this.sleepState = Body.SLEEPING;
	    this.angularVelocity = 0;
	    this.angularForce = 0;
	    vec2.set(this.velocity,0,0);
	    vec2.set(this.force,0,0);
	    this.emit(Body.sleepEvent);
	};
	
	/**
	 * Called every timestep to update internal sleep timer and change sleep state if needed.
	 * @method sleepTick
	 * @param {number} time The world time in seconds
	 * @param {boolean} dontSleep
	 * @param {number} dt
	 */
	Body.prototype.sleepTick = function(time, dontSleep, dt){
	    if(!this.allowSleep || this.type === Body.SLEEPING){
	        return;
	    }
	
	    this.wantsToSleep = false;
	
	    var sleepState = this.sleepState,
	        speedSquared = vec2.squaredLength(this.velocity) + Math.pow(this.angularVelocity,2),
	        speedLimitSquared = Math.pow(this.sleepSpeedLimit,2);
	
	    // Add to idle time
	    if(speedSquared >= speedLimitSquared){
	        this.idleTime = 0;
	        this.sleepState = Body.AWAKE;
	    } else {
	        this.idleTime += dt;
	        this.sleepState = Body.SLEEPY;
	    }
	    if(this.idleTime > this.sleepTimeLimit){
	        if(!dontSleep){
	            this.sleep();
	        } else {
	            this.wantsToSleep = true;
	        }
	    }
	};
	
	/**
	 * Check if the body is overlapping another body. Note that this method only works if the body was added to a World and if at least one step was taken.
	 * @method overlaps
	 * @param  {Body} body
	 * @return {boolean}
	 */
	Body.prototype.overlaps = function(body){
	    return this.world.overlapKeeper.bodiesAreOverlapping(this, body);
	};
	
	var integrate_fhMinv = vec2.create();
	var integrate_velodt = vec2.create();
	
	/**
	 * Move the body forward in time given its current velocity.
	 * @method integrate
	 * @param  {Number} dt
	 */
	Body.prototype.integrate = function(dt){
	    var minv = this.invMass,
	        f = this.force,
	        pos = this.position,
	        velo = this.velocity;
	
	    // Save old position
	    vec2.copy(this.previousPosition, this.position);
	    this.previousAngle = this.angle;
	
	    // Velocity update
	    if(!this.fixedRotation){
	        this.angularVelocity += this.angularForce * this.invInertia * dt;
	    }
	    vec2.scale(integrate_fhMinv, f, dt * minv);
	    vec2.multiply(integrate_fhMinv, this.massMultiplier, integrate_fhMinv);
	    vec2.add(velo, integrate_fhMinv, velo);
	
	    // CCD
	    if(!this.integrateToTimeOfImpact(dt)){
	
	        // Regular position update
	        vec2.scale(integrate_velodt, velo, dt);
	        vec2.add(pos, pos, integrate_velodt);
	        if(!this.fixedRotation){
	            this.angle += this.angularVelocity * dt;
	        }
	    }
	
	    this.aabbNeedsUpdate = true;
	};
	
	var result = new RaycastResult();
	var ray = new Ray({
	    mode: Ray.ALL
	});
	var direction = vec2.create();
	var end = vec2.create();
	var startToEnd = vec2.create();
	var rememberPosition = vec2.create();
	Body.prototype.integrateToTimeOfImpact = function(dt){
	
	    if(this.ccdSpeedThreshold < 0 || vec2.squaredLength(this.velocity) < Math.pow(this.ccdSpeedThreshold, 2)){
	        return false;
	    }
	
	    vec2.normalize(direction, this.velocity);
	
	    vec2.scale(end, this.velocity, dt);
	    vec2.add(end, end, this.position);
	
	    vec2.sub(startToEnd, end, this.position);
	    var startToEndAngle = this.angularVelocity * dt;
	    var len = vec2.length(startToEnd);
	
	    var timeOfImpact = 1;
	
	    var hit;
	    var that = this;
	    result.reset();
	    ray.callback = function (result) {
	        if(result.body === that){
	            return;
	        }
	        hit = result.body;
	        result.getHitPoint(end, ray);
	        vec2.sub(startToEnd, end, that.position);
	        timeOfImpact = vec2.length(startToEnd) / len;
	        result.stop();
	    };
	    vec2.copy(ray.from, this.position);
	    vec2.copy(ray.to, end);
	    ray.update();
	    this.world.raycast(result, ray);
	
	    if(!hit){
	        return false;
	    }
	
	    var rememberAngle = this.angle;
	    vec2.copy(rememberPosition, this.position);
	
	    // Got a start and end point. Approximate time of impact using binary search
	    var iter = 0;
	    var tmin = 0;
	    var tmid = 0;
	    var tmax = timeOfImpact;
	    while (tmax >= tmin && iter < this.ccdIterations) {
	        iter++;
	
	        // calculate the midpoint
	        tmid = (tmax - tmin) / 2;
	
	        // Move the body to that point
	        vec2.scale(integrate_velodt, startToEnd, timeOfImpact);
	        vec2.add(this.position, rememberPosition, integrate_velodt);
	        this.angle = rememberAngle + startToEndAngle * timeOfImpact;
	        this.updateAABB();
	
	        // check overlap
	        var overlaps = this.aabb.overlaps(hit.aabb) && this.world.narrowphase.bodiesOverlap(this, hit);
	
	        if (overlaps) {
	            // change min to search upper interval
	            tmin = tmid;
	        } else {
	            // change max to search lower interval
	            tmax = tmid;
	        }
	    }
	
	    timeOfImpact = tmid;
	
	    vec2.copy(this.position, rememberPosition);
	    this.angle = rememberAngle;
	
	    // move to TOI
	    vec2.scale(integrate_velodt, startToEnd, timeOfImpact);
	    vec2.add(this.position, this.position, integrate_velodt);
	    if(!this.fixedRotation){
	        this.angle += startToEndAngle * timeOfImpact;
	    }
	
	    return true;
	};
	
	/**
	 * Get velocity of a point in the body.
	 * @method getVelocityAtPoint
	 * @param  {Array} result A vector to store the result in
	 * @param  {Array} relativePoint A world oriented vector, indicating the position of the point to get the velocity from
	 * @return {Array} The result vector
	 */
	Body.prototype.getVelocityAtPoint = function(result, relativePoint){
	    vec2.crossVZ(result, relativePoint, this.angularVelocity);
	    vec2.subtract(result, this.velocity, result);
	    return result;
	};
	
	/**
	 * @event sleepy
	 */
	Body.sleepyEvent = {
	    type: "sleepy"
	};
	
	/**
	 * @event sleep
	 */
	Body.sleepEvent = {
	    type: "sleep"
	};
	
	/**
	 * @event wakeup
	 */
	Body.wakeUpEvent = {
	    type: "wakeup"
	};
	
	/**
	 * Dynamic body.
	 * @property DYNAMIC
	 * @type {Number}
	 * @static
	 */
	Body.DYNAMIC = 1;
	
	/**
	 * Static body.
	 * @property STATIC
	 * @type {Number}
	 * @static
	 */
	Body.STATIC = 2;
	
	/**
	 * Kinematic body.
	 * @property KINEMATIC
	 * @type {Number}
	 * @static
	 */
	Body.KINEMATIC = 4;
	
	/**
	 * @property AWAKE
	 * @type {Number}
	 * @static
	 */
	Body.AWAKE = 0;
	
	/**
	 * @property SLEEPY
	 * @type {Number}
	 * @static
	 */
	Body.SLEEPY = 1;
	
	/**
	 * @property SLEEPING
	 * @type {Number}
	 * @static
	 */
	Body.SLEEPING = 2;
	


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    Polygon : __webpack_require__(14),
	    Point : __webpack_require__(17),
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Line = __webpack_require__(15)
	,   Point = __webpack_require__(17)
	,   Scalar = __webpack_require__(16)
	
	module.exports = Polygon;
	
	/**
	 * Polygon class.
	 * @class Polygon
	 * @constructor
	 */
	function Polygon(){
	
	    /**
	     * Vertices that this polygon consists of. An array of array of numbers, example: [[0,0],[1,0],..]
	     * @property vertices
	     * @type {Array}
	     */
	    this.vertices = [];
	}
	
	/**
	 * Get a vertex at position i. It does not matter if i is out of bounds, this function will just cycle.
	 * @method at
	 * @param  {Number} i
	 * @return {Array}
	 */
	Polygon.prototype.at = function(i){
	    var v = this.vertices,
	        s = v.length;
	    return v[i < 0 ? i % s + s : i % s];
	};
	
	/**
	 * Get first vertex
	 * @method first
	 * @return {Array}
	 */
	Polygon.prototype.first = function(){
	    return this.vertices[0];
	};
	
	/**
	 * Get last vertex
	 * @method last
	 * @return {Array}
	 */
	Polygon.prototype.last = function(){
	    return this.vertices[this.vertices.length-1];
	};
	
	/**
	 * Clear the polygon data
	 * @method clear
	 * @return {Array}
	 */
	Polygon.prototype.clear = function(){
	    this.vertices.length = 0;
	};
	
	/**
	 * Append points "from" to "to"-1 from an other polygon "poly" onto this one.
	 * @method append
	 * @param {Polygon} poly The polygon to get points from.
	 * @param {Number}  from The vertex index in "poly".
	 * @param {Number}  to The end vertex index in "poly". Note that this vertex is NOT included when appending.
	 * @return {Array}
	 */
	Polygon.prototype.append = function(poly,from,to){
	    if(typeof(from) == "undefined") throw new Error("From is not given!");
	    if(typeof(to) == "undefined")   throw new Error("To is not given!");
	
	    if(to-1 < from)                 throw new Error("lol1");
	    if(to > poly.vertices.length)   throw new Error("lol2");
	    if(from < 0)                    throw new Error("lol3");
	
	    for(var i=from; i<to; i++){
	        this.vertices.push(poly.vertices[i]);
	    }
	};
	
	/**
	 * Make sure that the polygon vertices are ordered counter-clockwise.
	 * @method makeCCW
	 */
	Polygon.prototype.makeCCW = function(){
	    var br = 0,
	        v = this.vertices;
	
	    // find bottom right point
	    for (var i = 1; i < this.vertices.length; ++i) {
	        if (v[i][1] < v[br][1] || (v[i][1] == v[br][1] && v[i][0] > v[br][0])) {
	            br = i;
	        }
	    }
	
	    // reverse poly if clockwise
	    if (!Point.left(this.at(br - 1), this.at(br), this.at(br + 1))) {
	        this.reverse();
	    }
	};
	
	/**
	 * Reverse the vertices in the polygon
	 * @method reverse
	 */
	Polygon.prototype.reverse = function(){
	    var tmp = [];
	    for(var i=0, N=this.vertices.length; i!==N; i++){
	        tmp.push(this.vertices.pop());
	    }
	    this.vertices = tmp;
	};
	
	/**
	 * Check if a point in the polygon is a reflex point
	 * @method isReflex
	 * @param  {Number}  i
	 * @return {Boolean}
	 */
	Polygon.prototype.isReflex = function(i){
	    return Point.right(this.at(i - 1), this.at(i), this.at(i + 1));
	};
	
	var tmpLine1=[],
	    tmpLine2=[];
	
	/**
	 * Check if two vertices in the polygon can see each other
	 * @method canSee
	 * @param  {Number} a Vertex index 1
	 * @param  {Number} b Vertex index 2
	 * @return {Boolean}
	 */
	Polygon.prototype.canSee = function(a,b) {
	    var p, dist, l1=tmpLine1, l2=tmpLine2;
	
	    if (Point.leftOn(this.at(a + 1), this.at(a), this.at(b)) && Point.rightOn(this.at(a - 1), this.at(a), this.at(b))) {
	        return false;
	    }
	    dist = Point.sqdist(this.at(a), this.at(b));
	    for (var i = 0; i !== this.vertices.length; ++i) { // for each edge
	        if ((i + 1) % this.vertices.length === a || i === a) // ignore incident edges
	            continue;
	        if (Point.leftOn(this.at(a), this.at(b), this.at(i + 1)) && Point.rightOn(this.at(a), this.at(b), this.at(i))) { // if diag intersects an edge
	            l1[0] = this.at(a);
	            l1[1] = this.at(b);
	            l2[0] = this.at(i);
	            l2[1] = this.at(i + 1);
	            p = Line.lineInt(l1,l2);
	            if (Point.sqdist(this.at(a), p) < dist) { // if edge is blocking visibility to b
	                return false;
	            }
	        }
	    }
	
	    return true;
	};
	
	/**
	 * Copy the polygon from vertex i to vertex j.
	 * @method copy
	 * @param  {Number} i
	 * @param  {Number} j
	 * @param  {Polygon} [targetPoly]   Optional target polygon to save in.
	 * @return {Polygon}                The resulting copy.
	 */
	Polygon.prototype.copy = function(i,j,targetPoly){
	    var p = targetPoly || new Polygon();
	    p.clear();
	    if (i < j) {
	        // Insert all vertices from i to j
	        for(var k=i; k<=j; k++)
	            p.vertices.push(this.vertices[k]);
	
	    } else {
	
	        // Insert vertices 0 to j
	        for(var k=0; k<=j; k++)
	            p.vertices.push(this.vertices[k]);
	
	        // Insert vertices i to end
	        for(var k=i; k<this.vertices.length; k++)
	            p.vertices.push(this.vertices[k]);
	    }
	
	    return p;
	};
	
	/**
	 * Decomposes the polygon into convex pieces. Returns a list of edges [[p1,p2],[p2,p3],...] that cuts the polygon.
	 * Note that this algorithm has complexity O(N^4) and will be very slow for polygons with many vertices.
	 * @method getCutEdges
	 * @return {Array}
	 */
	Polygon.prototype.getCutEdges = function() {
	    var min=[], tmp1=[], tmp2=[], tmpPoly = new Polygon();
	    var nDiags = Number.MAX_VALUE;
	
	    for (var i = 0; i < this.vertices.length; ++i) {
	        if (this.isReflex(i)) {
	            for (var j = 0; j < this.vertices.length; ++j) {
	                if (this.canSee(i, j)) {
	                    tmp1 = this.copy(i, j, tmpPoly).getCutEdges();
	                    tmp2 = this.copy(j, i, tmpPoly).getCutEdges();
	
	                    for(var k=0; k<tmp2.length; k++)
	                        tmp1.push(tmp2[k]);
	
	                    if (tmp1.length < nDiags) {
	                        min = tmp1;
	                        nDiags = tmp1.length;
	                        min.push([this.at(i), this.at(j)]);
	                    }
	                }
	            }
	        }
	    }
	
	    return min;
	};
	
	/**
	 * Decomposes the polygon into one or more convex sub-Polygons.
	 * @method decomp
	 * @return {Array} An array or Polygon objects.
	 */
	Polygon.prototype.decomp = function(){
	    var edges = this.getCutEdges();
	    if(edges.length > 0)
	        return this.slice(edges);
	    else
	        return [this];
	};
	
	/**
	 * Slices the polygon given one or more cut edges. If given one, this function will return two polygons (false on failure). If many, an array of polygons.
	 * @method slice
	 * @param {Array} cutEdges A list of edges, as returned by .getCutEdges()
	 * @return {Array}
	 */
	Polygon.prototype.slice = function(cutEdges){
	    if(cutEdges.length == 0) return [this];
	    if(cutEdges instanceof Array && cutEdges.length && cutEdges[0] instanceof Array && cutEdges[0].length==2 && cutEdges[0][0] instanceof Array){
	
	        var polys = [this];
	
	        for(var i=0; i<cutEdges.length; i++){
	            var cutEdge = cutEdges[i];
	            // Cut all polys
	            for(var j=0; j<polys.length; j++){
	                var poly = polys[j];
	                var result = poly.slice(cutEdge);
	                if(result){
	                    // Found poly! Cut and quit
	                    polys.splice(j,1);
	                    polys.push(result[0],result[1]);
	                    break;
	                }
	            }
	        }
	
	        return polys;
	    } else {
	
	        // Was given one edge
	        var cutEdge = cutEdges;
	        var i = this.vertices.indexOf(cutEdge[0]);
	        var j = this.vertices.indexOf(cutEdge[1]);
	
	        if(i != -1 && j != -1){
	            return [this.copy(i,j),
	                    this.copy(j,i)];
	        } else {
	            return false;
	        }
	    }
	};
	
	/**
	 * Checks that the line segments of this polygon do not intersect each other.
	 * @method isSimple
	 * @param  {Array} path An array of vertices e.g. [[0,0],[0,1],...]
	 * @return {Boolean}
	 * @todo Should it check all segments with all others?
	 */
	Polygon.prototype.isSimple = function(){
	    var path = this.vertices;
	    // Check
	    for(var i=0; i<path.length-1; i++){
	        for(var j=0; j<i-1; j++){
	            if(Line.segmentsIntersect(path[i], path[i+1], path[j], path[j+1] )){
	                return false;
	            }
	        }
	    }
	
	    // Check the segment between the last and the first point to all others
	    for(var i=1; i<path.length-2; i++){
	        if(Line.segmentsIntersect(path[0], path[path.length-1], path[i], path[i+1] )){
	            return false;
	        }
	    }
	
	    return true;
	};
	
	function getIntersectionPoint(p1, p2, q1, q2, delta){
	    delta = delta || 0;
	   var a1 = p2[1] - p1[1];
	   var b1 = p1[0] - p2[0];
	   var c1 = (a1 * p1[0]) + (b1 * p1[1]);
	   var a2 = q2[1] - q1[1];
	   var b2 = q1[0] - q2[0];
	   var c2 = (a2 * q1[0]) + (b2 * q1[1]);
	   var det = (a1 * b2) - (a2 * b1);
	
	   if(!Scalar.eq(det,0,delta))
	      return [((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det]
	   else
	      return [0,0]
	}
	
	/**
	 * Quickly decompose the Polygon into convex sub-polygons.
	 * @method quickDecomp
	 * @param  {Array} result
	 * @param  {Array} [reflexVertices]
	 * @param  {Array} [steinerPoints]
	 * @param  {Number} [delta]
	 * @param  {Number} [maxlevel]
	 * @param  {Number} [level]
	 * @return {Array}
	 */
	Polygon.prototype.quickDecomp = function(result,reflexVertices,steinerPoints,delta,maxlevel,level){
	    maxlevel = maxlevel || 100;
	    level = level || 0;
	    delta = delta || 25;
	    result = typeof(result)!="undefined" ? result : [];
	    reflexVertices = reflexVertices || [];
	    steinerPoints = steinerPoints || [];
	
	    var upperInt=[0,0], lowerInt=[0,0], p=[0,0]; // Points
	    var upperDist=0, lowerDist=0, d=0, closestDist=0; // scalars
	    var upperIndex=0, lowerIndex=0, closestIndex=0; // Integers
	    var lowerPoly=new Polygon(), upperPoly=new Polygon(); // polygons
	    var poly = this,
	        v = this.vertices;
	
	    if(v.length < 3) return result;
	
	    level++;
	    if(level > maxlevel){
	        console.warn("quickDecomp: max level ("+maxlevel+") reached.");
	        return result;
	    }
	
	    for (var i = 0; i < this.vertices.length; ++i) {
	        if (poly.isReflex(i)) {
	            reflexVertices.push(poly.vertices[i]);
	            upperDist = lowerDist = Number.MAX_VALUE;
	
	
	            for (var j = 0; j < this.vertices.length; ++j) {
	                if (Point.left(poly.at(i - 1), poly.at(i), poly.at(j))
	                        && Point.rightOn(poly.at(i - 1), poly.at(i), poly.at(j - 1))) { // if line intersects with an edge
	                    p = getIntersectionPoint(poly.at(i - 1), poly.at(i), poly.at(j), poly.at(j - 1)); // find the point of intersection
	                    if (Point.right(poly.at(i + 1), poly.at(i), p)) { // make sure it's inside the poly
	                        d = Point.sqdist(poly.vertices[i], p);
	                        if (d < lowerDist) { // keep only the closest intersection
	                            lowerDist = d;
	                            lowerInt = p;
	                            lowerIndex = j;
	                        }
	                    }
	                }
	                if (Point.left(poly.at(i + 1), poly.at(i), poly.at(j + 1))
	                        && Point.rightOn(poly.at(i + 1), poly.at(i), poly.at(j))) {
	                    p = getIntersectionPoint(poly.at(i + 1), poly.at(i), poly.at(j), poly.at(j + 1));
	                    if (Point.left(poly.at(i - 1), poly.at(i), p)) {
	                        d = Point.sqdist(poly.vertices[i], p);
	                        if (d < upperDist) {
	                            upperDist = d;
	                            upperInt = p;
	                            upperIndex = j;
	                        }
	                    }
	                }
	            }
	
	            // if there are no vertices to connect to, choose a point in the middle
	            if (lowerIndex == (upperIndex + 1) % this.vertices.length) {
	                //console.log("Case 1: Vertex("+i+"), lowerIndex("+lowerIndex+"), upperIndex("+upperIndex+"), poly.size("+this.vertices.length+")");
	                p[0] = (lowerInt[0] + upperInt[0]) / 2;
	                p[1] = (lowerInt[1] + upperInt[1]) / 2;
	                steinerPoints.push(p);
	
	                if (i < upperIndex) {
	                    //lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.begin() + upperIndex + 1);
	                    lowerPoly.append(poly, i, upperIndex+1);
	                    lowerPoly.vertices.push(p);
	                    upperPoly.vertices.push(p);
	                    if (lowerIndex != 0){
	                        //upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.end());
	                        upperPoly.append(poly,lowerIndex,poly.vertices.length);
	                    }
	                    //upperPoly.insert(upperPoly.end(), poly.begin(), poly.begin() + i + 1);
	                    upperPoly.append(poly,0,i+1);
	                } else {
	                    if (i != 0){
	                        //lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.end());
	                        lowerPoly.append(poly,i,poly.vertices.length);
	                    }
	                    //lowerPoly.insert(lowerPoly.end(), poly.begin(), poly.begin() + upperIndex + 1);
	                    lowerPoly.append(poly,0,upperIndex+1);
	                    lowerPoly.vertices.push(p);
	                    upperPoly.vertices.push(p);
	                    //upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.begin() + i + 1);
	                    upperPoly.append(poly,lowerIndex,i+1);
	                }
	            } else {
	                // connect to the closest point within the triangle
	                //console.log("Case 2: Vertex("+i+"), closestIndex("+closestIndex+"), poly.size("+this.vertices.length+")\n");
	
	                if (lowerIndex > upperIndex) {
	                    upperIndex += this.vertices.length;
	                }
	                closestDist = Number.MAX_VALUE;
	
	                if(upperIndex < lowerIndex){
	                    return result;
	                }
	
	                for (var j = lowerIndex; j <= upperIndex; ++j) {
	                    if (Point.leftOn(poly.at(i - 1), poly.at(i), poly.at(j))
	                            && Point.rightOn(poly.at(i + 1), poly.at(i), poly.at(j))) {
	                        d = Point.sqdist(poly.at(i), poly.at(j));
	                        if (d < closestDist) {
	                            closestDist = d;
	                            closestIndex = j % this.vertices.length;
	                        }
	                    }
	                }
	
	                if (i < closestIndex) {
	                    lowerPoly.append(poly,i,closestIndex+1);
	                    if (closestIndex != 0){
	                        upperPoly.append(poly,closestIndex,v.length);
	                    }
	                    upperPoly.append(poly,0,i+1);
	                } else {
	                    if (i != 0){
	                        lowerPoly.append(poly,i,v.length);
	                    }
	                    lowerPoly.append(poly,0,closestIndex+1);
	                    upperPoly.append(poly,closestIndex,i+1);
	                }
	            }
	
	            // solve smallest poly first
	            if (lowerPoly.vertices.length < upperPoly.vertices.length) {
	                lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
	                upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
	            } else {
	                upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
	                lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
	            }
	
	            return result;
	        }
	    }
	    result.push(this);
	
	    return result;
	};
	
	/**
	 * Remove collinear points in the polygon.
	 * @method removeCollinearPoints
	 * @param  {Number} [precision] The threshold angle to use when determining whether two edges are collinear. Use zero for finest precision.
	 * @return {Number}           The number of points removed
	 */
	Polygon.prototype.removeCollinearPoints = function(precision){
	    var num = 0;
	    for(var i=this.vertices.length-1; this.vertices.length>3 && i>=0; --i){
	        if(Point.collinear(this.at(i-1),this.at(i),this.at(i+1),precision)){
	            // Remove the middle point
	            this.vertices.splice(i%this.vertices.length,1);
	            i--; // Jump one point forward. Otherwise we may get a chain removal
	            num++;
	        }
	    }
	    return num;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Scalar = __webpack_require__(16);
	
	module.exports = Line;
	
	/**
	 * Container for line-related functions
	 * @class Line
	 */
	function Line(){};
	
	/**
	 * Compute the intersection between two lines.
	 * @static
	 * @method lineInt
	 * @param  {Array}  l1          Line vector 1
	 * @param  {Array}  l2          Line vector 2
	 * @param  {Number} precision   Precision to use when checking if the lines are parallel
	 * @return {Array}              The intersection point.
	 */
	Line.lineInt = function(l1,l2,precision){
	    precision = precision || 0;
	    var i = [0,0]; // point
	    var a1, b1, c1, a2, b2, c2, det; // scalars
	    a1 = l1[1][1] - l1[0][1];
	    b1 = l1[0][0] - l1[1][0];
	    c1 = a1 * l1[0][0] + b1 * l1[0][1];
	    a2 = l2[1][1] - l2[0][1];
	    b2 = l2[0][0] - l2[1][0];
	    c2 = a2 * l2[0][0] + b2 * l2[0][1];
	    det = a1 * b2 - a2*b1;
	    if (!Scalar.eq(det, 0, precision)) { // lines are not parallel
	        i[0] = (b2 * c1 - b1 * c2) / det;
	        i[1] = (a1 * c2 - a2 * c1) / det;
	    }
	    return i;
	};
	
	/**
	 * Checks if two line segments intersects.
	 * @method segmentsIntersect
	 * @param {Array} p1 The start vertex of the first line segment.
	 * @param {Array} p2 The end vertex of the first line segment.
	 * @param {Array} q1 The start vertex of the second line segment.
	 * @param {Array} q2 The end vertex of the second line segment.
	 * @return {Boolean} True if the two line segments intersect
	 */
	Line.segmentsIntersect = function(p1, p2, q1, q2){
	   var dx = p2[0] - p1[0];
	   var dy = p2[1] - p1[1];
	   var da = q2[0] - q1[0];
	   var db = q2[1] - q1[1];
	
	   // segments are parallel
	   if(da*dy - db*dx == 0)
	      return false;
	
	   var s = (dx * (q1[1] - p1[1]) + dy * (p1[0] - q1[0])) / (da * dy - db * dx)
	   var t = (da * (p1[1] - q1[1]) + db * (q1[0] - p1[0])) / (db * dx - da * dy)
	
	   return (s>=0 && s<=1 && t>=0 && t<=1);
	};
	


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = Scalar;
	
	/**
	 * Scalar functions
	 * @class Scalar
	 */
	function Scalar(){}
	
	/**
	 * Check if two scalars are equal
	 * @static
	 * @method eq
	 * @param  {Number} a
	 * @param  {Number} b
	 * @param  {Number} [precision]
	 * @return {Boolean}
	 */
	Scalar.eq = function(a,b,precision){
	    precision = precision || 0;
	    return Math.abs(a-b) < precision;
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = Point;
	
	/**
	 * Point related functions
	 * @class Point
	 */
	function Point(){};
	
	/**
	 * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
	 * @static
	 * @method area
	 * @param  {Array} a
	 * @param  {Array} b
	 * @param  {Array} c
	 * @return {Number}
	 */
	Point.area = function(a,b,c){
	    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1])));
	};
	
	Point.left = function(a,b,c){
	    return Point.area(a,b,c) > 0;
	};
	
	Point.leftOn = function(a,b,c) {
	    return Point.area(a, b, c) >= 0;
	};
	
	Point.right = function(a,b,c) {
	    return Point.area(a, b, c) < 0;
	};
	
	Point.rightOn = function(a,b,c) {
	    return Point.area(a, b, c) <= 0;
	};
	
	var tmpPoint1 = [],
	    tmpPoint2 = [];
	
	/**
	 * Check if three points are collinear
	 * @method collinear
	 * @param  {Array} a
	 * @param  {Array} b
	 * @param  {Array} c
	 * @param  {Number} [thresholdAngle=0] Threshold angle to use when comparing the vectors. The function will return true if the angle between the resulting vectors is less than this value. Use zero for max precision.
	 * @return {Boolean}
	 */
	Point.collinear = function(a,b,c,thresholdAngle) {
	    if(!thresholdAngle)
	        return Point.area(a, b, c) == 0;
	    else {
	        var ab = tmpPoint1,
	            bc = tmpPoint2;
	
	        ab[0] = b[0]-a[0];
	        ab[1] = b[1]-a[1];
	        bc[0] = c[0]-b[0];
	        bc[1] = c[1]-b[1];
	
	        var dot = ab[0]*bc[0] + ab[1]*bc[1],
	            magA = Math.sqrt(ab[0]*ab[0] + ab[1]*ab[1]),
	            magB = Math.sqrt(bc[0]*bc[0] + bc[1]*bc[1]),
	            angle = Math.acos(dot/(magA*magB));
	        return angle < thresholdAngle;
	    }
	};
	
	Point.sqdist = function(a,b){
	    var dx = b[0] - a[0];
	    var dy = b[1] - a[1];
	    return dx * dx + dy * dy;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(19)
	,   vec2 = __webpack_require__(8)
	,   polyk = __webpack_require__(20)
	,   decomp = __webpack_require__(13);
	
	module.exports = Convex;
	
	/**
	 * Convex shape class.
	 * @class Convex
	 * @constructor
	 * @extends Shape
	 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
	 * @param {Array} [options.vertices] An array of vertices that span this shape. Vertices are given in counter-clockwise (CCW) direction.
	 * @param {Array} [options.axes] An array of unit length vectors, representing the symmetry axes in the convex.
	 * @example
	 *     // Create a box
	 *     var vertices = [[-1,-1], [1,-1], [1,1], [-1,1]];
	 *     var convexShape = new Convex({ vertices: vertices });
	 *     body.addShape(convexShape);
	 */
	function Convex(options){
	    if(Array.isArray(arguments[0])){
	        options = {
	            vertices: arguments[0],
	            axes: arguments[1]
	        };
	        console.warn('The Convex constructor signature has changed. Please use the following format: new Convex({ vertices: [...], ... })');
	    }
	    options = options || {};
	
	    /**
	     * Vertices defined in the local frame.
	     * @property vertices
	     * @type {Array}
	     */
	    this.vertices = [];
	
	    // Copy the verts
	    var vertices = options.vertices !== undefined ? options.vertices : [];
	    for(var i=0; i < vertices.length; i++){
	        var v = vec2.create();
	        vec2.copy(v, vertices[i]);
	        this.vertices.push(v);
	    }
	
	    /**
	     * Axes defined in the local frame.
	     * @property axes
	     * @type {Array}
	     */
	    this.axes = [];
	
	    if(options.axes){
	
	        // Copy the axes
	        for(var i=0; i < options.axes.length; i++){
	            var axis = vec2.create();
	            vec2.copy(axis, options.axes[i]);
	            this.axes.push(axis);
	        }
	
	    } else {
	
	        // Construct axes from the vertex data
	        for(var i = 0; i < this.vertices.length; i++){
	            // Get the world edge
	            var worldPoint0 = this.vertices[i];
	            var worldPoint1 = this.vertices[(i+1) % this.vertices.length];
	
	            var normal = vec2.create();
	            vec2.sub(normal, worldPoint1, worldPoint0);
	
	            // Get normal - just rotate 90 degrees since vertices are given in CCW
	            vec2.rotate90cw(normal, normal);
	            vec2.normalize(normal, normal);
	
	            this.axes.push(normal);
	        }
	
	    }
	
	    /**
	     * The center of mass of the Convex
	     * @property centerOfMass
	     * @type {Array}
	     */
	    this.centerOfMass = vec2.fromValues(0,0);
	
	    /**
	     * Triangulated version of this convex. The structure is Array of 3-Arrays, and each subarray contains 3 integers, referencing the vertices.
	     * @property triangles
	     * @type {Array}
	     */
	    this.triangles = [];
	
	    if(this.vertices.length){
	        this.updateTriangles();
	        this.updateCenterOfMass();
	    }
	
	    /**
	     * The bounding radius of the convex
	     * @property boundingRadius
	     * @type {Number}
	     */
	    this.boundingRadius = 0;
	
	    options.type = Shape.CONVEX;
	    Shape.call(this, options);
	
	    this.updateBoundingRadius();
	    this.updateArea();
	    if(this.area < 0){
	        throw new Error("Convex vertices must be given in conter-clockwise winding.");
	    }
	}
	Convex.prototype = new Shape();
	Convex.prototype.constructor = Convex;
	
	var tmpVec1 = vec2.create();
	var tmpVec2 = vec2.create();
	
	/**
	 * Project a Convex onto a world-oriented axis
	 * @method projectOntoAxis
	 * @static
	 * @param  {Array} offset
	 * @param  {Array} localAxis
	 * @param  {Array} result
	 */
	Convex.prototype.projectOntoLocalAxis = function(localAxis, result){
	    var max=null,
	        min=null,
	        v,
	        value,
	        localAxis = tmpVec1;
	
	    // Get projected position of all vertices
	    for(var i=0; i<this.vertices.length; i++){
	        v = this.vertices[i];
	        value = vec2.dot(v, localAxis);
	        if(max === null || value > max){
	            max = value;
	        }
	        if(min === null || value < min){
	            min = value;
	        }
	    }
	
	    if(min > max){
	        var t = min;
	        min = max;
	        max = t;
	    }
	
	    vec2.set(result, min, max);
	};
	
	Convex.prototype.projectOntoWorldAxis = function(localAxis, shapeOffset, shapeAngle, result){
	    var worldAxis = tmpVec2;
	
	    this.projectOntoLocalAxis(localAxis, result);
	
	    // Project the position of the body onto the axis - need to add this to the result
	    if(shapeAngle !== 0){
	        vec2.rotate(worldAxis, localAxis, shapeAngle);
	    } else {
	        worldAxis = localAxis;
	    }
	    var offset = vec2.dot(shapeOffset, worldAxis);
	
	    vec2.set(result, result[0] + offset, result[1] + offset);
	};
	
	
	/**
	 * Update the .triangles property
	 * @method updateTriangles
	 */
	Convex.prototype.updateTriangles = function(){
	
	    this.triangles.length = 0;
	
	    // Rewrite on polyk notation, array of numbers
	    var polykVerts = [];
	    for(var i=0; i<this.vertices.length; i++){
	        var v = this.vertices[i];
	        polykVerts.push(v[0],v[1]);
	    }
	
	    // Triangulate
	    var triangles = polyk.Triangulate(polykVerts);
	
	    // Loop over all triangles, add their inertia contributions to I
	    for(var i=0; i<triangles.length; i+=3){
	        var id1 = triangles[i],
	            id2 = triangles[i+1],
	            id3 = triangles[i+2];
	
	        // Add to triangles
	        this.triangles.push([id1,id2,id3]);
	    }
	};
	
	var updateCenterOfMass_centroid = vec2.create(),
	    updateCenterOfMass_centroid_times_mass = vec2.create(),
	    updateCenterOfMass_a = vec2.create(),
	    updateCenterOfMass_b = vec2.create(),
	    updateCenterOfMass_c = vec2.create(),
	    updateCenterOfMass_ac = vec2.create(),
	    updateCenterOfMass_ca = vec2.create(),
	    updateCenterOfMass_cb = vec2.create(),
	    updateCenterOfMass_n = vec2.create();
	
	/**
	 * Update the .centerOfMass property.
	 * @method updateCenterOfMass
	 */
	Convex.prototype.updateCenterOfMass = function(){
	    var triangles = this.triangles,
	        verts = this.vertices,
	        cm = this.centerOfMass,
	        centroid = updateCenterOfMass_centroid,
	        n = updateCenterOfMass_n,
	        a = updateCenterOfMass_a,
	        b = updateCenterOfMass_b,
	        c = updateCenterOfMass_c,
	        ac = updateCenterOfMass_ac,
	        ca = updateCenterOfMass_ca,
	        cb = updateCenterOfMass_cb,
	        centroid_times_mass = updateCenterOfMass_centroid_times_mass;
	
	    vec2.set(cm,0,0);
	    var totalArea = 0;
	
	    for(var i=0; i!==triangles.length; i++){
	        var t = triangles[i],
	            a = verts[t[0]],
	            b = verts[t[1]],
	            c = verts[t[2]];
	
	        vec2.centroid(centroid,a,b,c);
	
	        // Get mass for the triangle (density=1 in this case)
	        // http://math.stackexchange.com/questions/80198/area-of-triangle-via-vectors
	        var m = Convex.triangleArea(a,b,c);
	        totalArea += m;
	
	        // Add to center of mass
	        vec2.scale(centroid_times_mass, centroid, m);
	        vec2.add(cm, cm, centroid_times_mass);
	    }
	
	    vec2.scale(cm,cm,1/totalArea);
	};
	
	/**
	 * Compute the mass moment of inertia of the Convex.
	 * @method computeMomentOfInertia
	 * @param  {Number} mass
	 * @return {Number}
	 * @see http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/
	 */
	Convex.prototype.computeMomentOfInertia = function(mass){
	    var denom = 0.0,
	        numer = 0.0,
	        N = this.vertices.length;
	    for(var j = N-1, i = 0; i < N; j = i, i ++){
	        var p0 = this.vertices[j];
	        var p1 = this.vertices[i];
	        var a = Math.abs(vec2.crossLength(p0,p1));
	        var b = vec2.dot(p1,p1) + vec2.dot(p1,p0) + vec2.dot(p0,p0);
	        denom += a * b;
	        numer += a;
	    }
	    return (mass / 6.0) * (denom / numer);
	};
	
	/**
	 * Updates the .boundingRadius property
	 * @method updateBoundingRadius
	 */
	Convex.prototype.updateBoundingRadius = function(){
	    var verts = this.vertices,
	        r2 = 0;
	
	    for(var i=0; i!==verts.length; i++){
	        var l2 = vec2.squaredLength(verts[i]);
	        if(l2 > r2){
	            r2 = l2;
	        }
	    }
	
	    this.boundingRadius = Math.sqrt(r2);
	};
	
	/**
	 * Get the area of the triangle spanned by the three points a, b, c. The area is positive if the points are given in counter-clockwise order, otherwise negative.
	 * @static
	 * @method triangleArea
	 * @param {Array} a
	 * @param {Array} b
	 * @param {Array} c
	 * @return {Number}
	 */
	Convex.triangleArea = function(a,b,c){
	    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1]))) * 0.5;
	};
	
	/**
	 * Update the .area
	 * @method updateArea
	 */
	Convex.prototype.updateArea = function(){
	    this.updateTriangles();
	    this.area = 0;
	
	    var triangles = this.triangles,
	        verts = this.vertices;
	    for(var i=0; i!==triangles.length; i++){
	        var t = triangles[i],
	            a = verts[t[0]],
	            b = verts[t[1]],
	            c = verts[t[2]];
	
	        // Get mass for the triangle (density=1 in this case)
	        var m = Convex.triangleArea(a,b,c);
	        this.area += m;
	    }
	};
	
	/**
	 * @method computeAABB
	 * @param  {AABB}   out
	 * @param  {Array}  position
	 * @param  {Number} angle
	 */
	Convex.prototype.computeAABB = function(out, position, angle){
	    out.setFromPoints(this.vertices, position, angle, 0);
	};
	
	var intersectConvex_rayStart = vec2.create();
	var intersectConvex_rayEnd = vec2.create();
	var intersectConvex_normal = vec2.create();
	
	/**
	 * @method raycast
	 * @param  {RaycastResult} result
	 * @param  {Ray} ray
	 * @param  {array} position
	 * @param  {number} angle
	 */
	Convex.prototype.raycast = function(result, ray, position, angle){
	    var rayStart = intersectConvex_rayStart;
	    var rayEnd = intersectConvex_rayEnd;
	    var normal = intersectConvex_normal;
	    var vertices = this.vertices;
	
	    // Transform to local shape space
	    vec2.toLocalFrame(rayStart, ray.from, position, angle);
	    vec2.toLocalFrame(rayEnd, ray.to, position, angle);
	
	    var n = vertices.length;
	
	    for (var i = 0; i < n && !result.shouldStop(ray); i++) {
	        var q1 = vertices[i];
	        var q2 = vertices[(i+1) % n];
	        var delta = vec2.getLineSegmentsIntersectionFraction(rayStart, rayEnd, q1, q2);
	
	        if(delta >= 0){
	            vec2.sub(normal, q2, q1);
	            vec2.rotate(normal, normal, -Math.PI / 2 + angle);
	            vec2.normalize(normal, normal);
	            ray.reportIntersection(result, delta, normal, i);
	        }
	    }
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Shape;
	
	var vec2 = __webpack_require__(8);
	
	/**
	 * Base class for shapes.
	 * @class Shape
	 * @constructor
	 * @param {object} [options]
	 * @param {array} [options.position]
	 * @param {number} [options.angle=0]
	 * @param {number} [options.collisionGroup=1]
	 * @param {number} [options.collisionMask=1]
	 * @param {boolean} [options.sensor=false]
	 * @param {boolean} [options.collisionResponse=true]
	 * @param {object} [options.type=0]
	 */
	function Shape(options){
	    options = options || {};
	
	    /**
	     * The body this shape is attached to. A shape can only be attached to a single body.
	     * @property {Body} body
	     */
	    this.body = null;
	
	    /**
	     * Body-local position of the shape.
	     * @property {Array} position
	     */
	    this.position = vec2.fromValues(0,0);
	    if(options.position){
	        vec2.copy(this.position, options.position);
	    }
	
	    /**
	     * Body-local angle of the shape.
	     * @property {number} angle
	     */
	    this.angle = options.angle || 0;
	
	    /**
	     * The type of the shape. One of:
	     *
	     * * {{#crossLink "Shape/CIRCLE:property"}}Shape.CIRCLE{{/crossLink}}
	     * * {{#crossLink "Shape/PARTICLE:property"}}Shape.PARTICLE{{/crossLink}}
	     * * {{#crossLink "Shape/PLANE:property"}}Shape.PLANE{{/crossLink}}
	     * * {{#crossLink "Shape/CONVEX:property"}}Shape.CONVEX{{/crossLink}}
	     * * {{#crossLink "Shape/LINE:property"}}Shape.LINE{{/crossLink}}
	     * * {{#crossLink "Shape/BOX:property"}}Shape.BOX{{/crossLink}}
	     * * {{#crossLink "Shape/CAPSULE:property"}}Shape.CAPSULE{{/crossLink}}
	     * * {{#crossLink "Shape/HEIGHTFIELD:property"}}Shape.HEIGHTFIELD{{/crossLink}}
	     *
	     * @property {number} type
	     */
	    this.type = options.type || 0;
	
	    /**
	     * Shape object identifier.
	     * @type {Number}
	     * @property id
	     */
	    this.id = Shape.idCounter++;
	
	    /**
	     * Bounding circle radius of this shape
	     * @property boundingRadius
	     * @type {Number}
	     */
	    this.boundingRadius = 0;
	
	    /**
	     * Collision group that this shape belongs to (bit mask). See <a href="http://www.aurelienribon.com/blog/2011/07/box2d-tutorial-collision-filtering/">this tutorial</a>.
	     * @property collisionGroup
	     * @type {Number}
	     * @example
	     *     // Setup bits for each available group
	     *     var PLAYER = Math.pow(2,0),
	     *         ENEMY =  Math.pow(2,1),
	     *         GROUND = Math.pow(2,2)
	     *
	     *     // Put shapes into their groups
	     *     player1Shape.collisionGroup = PLAYER;
	     *     player2Shape.collisionGroup = PLAYER;
	     *     enemyShape  .collisionGroup = ENEMY;
	     *     groundShape .collisionGroup = GROUND;
	     *
	     *     // Assign groups that each shape collide with.
	     *     // Note that the players can collide with ground and enemies, but not with other players.
	     *     player1Shape.collisionMask = ENEMY | GROUND;
	     *     player2Shape.collisionMask = ENEMY | GROUND;
	     *     enemyShape  .collisionMask = PLAYER | GROUND;
	     *     groundShape .collisionMask = PLAYER | ENEMY;
	     *
	     * @example
	     *     // How collision check is done
	     *     if(shapeA.collisionGroup & shapeB.collisionMask)!=0 && (shapeB.collisionGroup & shapeA.collisionMask)!=0){
	     *         // The shapes will collide
	     *     }
	     */
	    this.collisionGroup = options.collisionGroup !== undefined ? options.collisionGroup : 1;
	
	    /**
	     * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled. That means that this shape will move through other body shapes, but it will still trigger contact events, etc.
	     * @property {Boolean} collisionResponse
	     */
	    this.collisionResponse = options.collisionResponse !== undefined ? options.collisionResponse : true;
	
	    /**
	     * Collision mask of this shape. See .collisionGroup.
	     * @property collisionMask
	     * @type {Number}
	     */
	    this.collisionMask = options.collisionMask !== undefined ? options.collisionMask : 1;
	
	    /**
	     * Material to use in collisions for this Shape. If this is set to null, the world will use default material properties instead.
	     * @property material
	     * @type {Material}
	     */
	    this.material = options.material || null;
	
	    /**
	     * Area of this shape.
	     * @property area
	     * @type {Number}
	     */
	    this.area = 0;
	
	    /**
	     * Set to true if you want this shape to be a sensor. A sensor does not generate contacts, but it still reports contact events. This is good if you want to know if a shape is overlapping another shape, without them generating contacts.
	     * @property {Boolean} sensor
	     */
	    this.sensor = options.sensor !== undefined ? options.sensor : false;
	
	    if(this.type){
	        this.updateBoundingRadius();
	    }
	
	    this.updateArea();
	}
	
	Shape.idCounter = 0;
	
	/**
	 * @static
	 * @property {Number} CIRCLE
	 */
	Shape.CIRCLE =      1;
	
	/**
	 * @static
	 * @property {Number} PARTICLE
	 */
	Shape.PARTICLE =    2;
	
	/**
	 * @static
	 * @property {Number} PLANE
	 */
	Shape.PLANE =       4;
	
	/**
	 * @static
	 * @property {Number} CONVEX
	 */
	Shape.CONVEX =      8;
	
	/**
	 * @static
	 * @property {Number} LINE
	 */
	Shape.LINE =        16;
	
	/**
	 * @static
	 * @property {Number} BOX
	 */
	Shape.BOX =   32;
	
	Object.defineProperty(Shape, 'RECTANGLE', {
	    get: function() {
	        console.warn('Shape.RECTANGLE is deprecated, use Shape.BOX instead.');
	        return Shape.BOX;
	    }
	});
	
	/**
	 * @static
	 * @property {Number} CAPSULE
	 */
	Shape.CAPSULE =     64;
	
	/**
	 * @static
	 * @property {Number} HEIGHTFIELD
	 */
	Shape.HEIGHTFIELD = 128;
	
	/**
	 * Should return the moment of inertia around the Z axis of the body given the total mass. See <a href="http://en.wikipedia.org/wiki/List_of_moments_of_inertia">Wikipedia's list of moments of inertia</a>.
	 * @method computeMomentOfInertia
	 * @param  {Number} mass
	 * @return {Number} If the inertia is infinity or if the object simply isn't possible to rotate, return 0.
	 */
	Shape.prototype.computeMomentOfInertia = function(mass){};
	
	/**
	 * Returns the bounding circle radius of this shape.
	 * @method updateBoundingRadius
	 * @return {Number}
	 */
	Shape.prototype.updateBoundingRadius = function(){};
	
	/**
	 * Update the .area property of the shape.
	 * @method updateArea
	 */
	Shape.prototype.updateArea = function(){
	    // To be implemented in all subclasses
	};
	
	/**
	 * Compute the world axis-aligned bounding box (AABB) of this shape.
	 * @method computeAABB
	 * @param  {AABB} out The resulting AABB.
	 * @param  {Array} position World position of the shape.
	 * @param  {Number} angle World angle of the shape.
	 */
	Shape.prototype.computeAABB = function(out, position, angle){
	    // To be implemented in each subclass
	};
	
	/**
	 * Perform raycasting on this shape.
	 * @method raycast
	 * @param  {RayResult} result Where to store the resulting data.
	 * @param  {Ray} ray The Ray that you want to use for raycasting.
	 * @param  {array} position World position of the shape (the .position property will be ignored).
	 * @param  {number} angle World angle of the shape (the .angle property will be ignored).
	 */
	Shape.prototype.raycast = function(result, ray, position, angle){
	    // To be implemented in each subclass
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	
	    /*
	        PolyK library
	        url: http://polyk.ivank.net
	        Released under MIT licence.
	
	        Copyright (c) 2012 Ivan Kuckir
	
	        Permission is hereby granted, free of charge, to any person
	        obtaining a copy of this software and associated documentation
	        files (the "Software"), to deal in the Software without
	        restriction, including without limitation the rights to use,
	        copy, modify, merge, publish, distribute, sublicense, and/or sell
	        copies of the Software, and to permit persons to whom the
	        Software is furnished to do so, subject to the following
	        conditions:
	
	        The above copyright notice and this permission notice shall be
	        included in all copies or substantial portions of the Software.
	
	        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	        OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	        HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	        WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	        FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	        OTHER DEALINGS IN THE SOFTWARE.
	    */
	
	    var PolyK = {};
	
	    /*
	        Is Polygon self-intersecting?
	
	        O(n^2)
	    */
	    /*
	    PolyK.IsSimple = function(p)
	    {
	        var n = p.length>>1;
	        if(n<4) return true;
	        var a1 = new PolyK._P(), a2 = new PolyK._P();
	        var b1 = new PolyK._P(), b2 = new PolyK._P();
	        var c = new PolyK._P();
	
	        for(var i=0; i<n; i++)
	        {
	            a1.x = p[2*i  ];
	            a1.y = p[2*i+1];
	            if(i==n-1)  { a2.x = p[0    ];  a2.y = p[1    ]; }
	            else        { a2.x = p[2*i+2];  a2.y = p[2*i+3]; }
	
	            for(var j=0; j<n; j++)
	            {
	                if(Math.abs(i-j) < 2) continue;
	                if(j==n-1 && i==0) continue;
	                if(i==n-1 && j==0) continue;
	
	                b1.x = p[2*j  ];
	                b1.y = p[2*j+1];
	                if(j==n-1)  { b2.x = p[0    ];  b2.y = p[1    ]; }
	                else        { b2.x = p[2*j+2];  b2.y = p[2*j+3]; }
	
	                if(PolyK._GetLineIntersection(a1,a2,b1,b2,c) != null) return false;
	            }
	        }
	        return true;
	    }
	
	    PolyK.IsConvex = function(p)
	    {
	        if(p.length<6) return true;
	        var l = p.length - 4;
	        for(var i=0; i<l; i+=2)
	            if(!PolyK._convex(p[i], p[i+1], p[i+2], p[i+3], p[i+4], p[i+5])) return false;
	        if(!PolyK._convex(p[l  ], p[l+1], p[l+2], p[l+3], p[0], p[1])) return false;
	        if(!PolyK._convex(p[l+2], p[l+3], p[0  ], p[1  ], p[2], p[3])) return false;
	        return true;
	    }
	    */
	    PolyK.GetArea = function(p)
	    {
	        if(p.length <6) return 0;
	        var l = p.length - 2;
	        var sum = 0;
	        for(var i=0; i<l; i+=2)
	            sum += (p[i+2]-p[i]) * (p[i+1]+p[i+3]);
	        sum += (p[0]-p[l]) * (p[l+1]+p[1]);
	        return - sum * 0.5;
	    }
	    /*
	    PolyK.GetAABB = function(p)
	    {
	        var minx = Infinity;
	        var miny = Infinity;
	        var maxx = -minx;
	        var maxy = -miny;
	        for(var i=0; i<p.length; i+=2)
	        {
	            minx = Math.min(minx, p[i  ]);
	            maxx = Math.max(maxx, p[i  ]);
	            miny = Math.min(miny, p[i+1]);
	            maxy = Math.max(maxy, p[i+1]);
	        }
	        return {x:minx, y:miny, width:maxx-minx, height:maxy-miny};
	    }
	    */
	
	    PolyK.Triangulate = function(p)
	    {
	        var n = p.length>>1;
	        if(n<3) return [];
	        var tgs = [];
	        var avl = [];
	        for(var i=0; i<n; i++) avl.push(i);
	
	        var i = 0;
	        var al = n;
	        while(al > 3)
	        {
	            var i0 = avl[(i+0)%al];
	            var i1 = avl[(i+1)%al];
	            var i2 = avl[(i+2)%al];
	
	            var ax = p[2*i0],  ay = p[2*i0+1];
	            var bx = p[2*i1],  by = p[2*i1+1];
	            var cx = p[2*i2],  cy = p[2*i2+1];
	
	            var earFound = false;
	            if(PolyK._convex(ax, ay, bx, by, cx, cy))
	            {
	                earFound = true;
	                for(var j=0; j<al; j++)
	                {
	                    var vi = avl[j];
	                    if(vi==i0 || vi==i1 || vi==i2) continue;
	                    if(PolyK._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
	                }
	            }
	            if(earFound)
	            {
	                tgs.push(i0, i1, i2);
	                avl.splice((i+1)%al, 1);
	                al--;
	                i= 0;
	            }
	            else if(i++ > 3*al) break;      // no convex angles :(
	        }
	        tgs.push(avl[0], avl[1], avl[2]);
	        return tgs;
	    }
	    /*
	    PolyK.ContainsPoint = function(p, px, py)
	    {
	        var n = p.length>>1;
	        var ax, ay, bx = p[2*n-2]-px, by = p[2*n-1]-py;
	        var depth = 0;
	        for(var i=0; i<n; i++)
	        {
	            ax = bx;  ay = by;
	            bx = p[2*i  ] - px;
	            by = p[2*i+1] - py;
	            if(ay< 0 && by< 0) continue;    // both "up" or both "donw"
	            if(ay>=0 && by>=0) continue;    // both "up" or both "donw"
	            if(ax< 0 && bx< 0) continue;
	
	            var lx = ax + (bx-ax)*(-ay)/(by-ay);
	            if(lx>0) depth++;
	        }
	        return (depth & 1) == 1;
	    }
	
	    PolyK.Slice = function(p, ax, ay, bx, by)
	    {
	        if(PolyK.ContainsPoint(p, ax, ay) || PolyK.ContainsPoint(p, bx, by)) return [p.slice(0)];
	
	        var a = new PolyK._P(ax, ay);
	        var b = new PolyK._P(bx, by);
	        var iscs = [];  // intersections
	        var ps = [];    // points
	        for(var i=0; i<p.length; i+=2) ps.push(new PolyK._P(p[i], p[i+1]));
	
	        for(var i=0; i<ps.length; i++)
	        {
	            var isc = new PolyK._P(0,0);
	            isc = PolyK._GetLineIntersection(a, b, ps[i], ps[(i+1)%ps.length], isc);
	
	            if(isc)
	            {
	                isc.flag = true;
	                iscs.push(isc);
	                ps.splice(i+1,0,isc);
	                i++;
	            }
	        }
	        if(iscs.length == 0) return [p.slice(0)];
	        var comp = function(u,v) {return PolyK._P.dist(a,u) - PolyK._P.dist(a,v); }
	        iscs.sort(comp);
	
	        var pgs = [];
	        var dir = 0;
	        while(iscs.length > 0)
	        {
	            var n = ps.length;
	            var i0 = iscs[0];
	            var i1 = iscs[1];
	            var ind0 = ps.indexOf(i0);
	            var ind1 = ps.indexOf(i1);
	            var solved = false;
	
	            if(PolyK._firstWithFlag(ps, ind0) == ind1) solved = true;
	            else
	            {
	                i0 = iscs[1];
	                i1 = iscs[0];
	                ind0 = ps.indexOf(i0);
	                ind1 = ps.indexOf(i1);
	                if(PolyK._firstWithFlag(ps, ind0) == ind1) solved = true;
	            }
	            if(solved)
	            {
	                dir--;
	                var pgn = PolyK._getPoints(ps, ind0, ind1);
	                pgs.push(pgn);
	                ps = PolyK._getPoints(ps, ind1, ind0);
	                i0.flag = i1.flag = false;
	                iscs.splice(0,2);
	                if(iscs.length == 0) pgs.push(ps);
	            }
	            else { dir++; iscs.reverse(); }
	            if(dir>1) break;
	        }
	        var result = [];
	        for(var i=0; i<pgs.length; i++)
	        {
	            var pg = pgs[i];
	            var npg = [];
	            for(var j=0; j<pg.length; j++) npg.push(pg[j].x, pg[j].y);
	            result.push(npg);
	        }
	        return result;
	    }
	
	    PolyK.Raycast = function(p, x, y, dx, dy, isc)
	    {
	        var l = p.length - 2;
	        var tp = PolyK._tp;
	        var a1 = tp[0], a2 = tp[1],
	        b1 = tp[2], b2 = tp[3], c = tp[4];
	        a1.x = x; a1.y = y;
	        a2.x = x+dx; a2.y = y+dy;
	
	        if(isc==null) isc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
	        isc.dist = Infinity;
	
	        for(var i=0; i<l; i+=2)
	        {
	            b1.x = p[i  ];  b1.y = p[i+1];
	            b2.x = p[i+2];  b2.y = p[i+3];
	            var nisc = PolyK._RayLineIntersection(a1, a2, b1, b2, c);
	            if(nisc) PolyK._updateISC(dx, dy, a1, b1, b2, c, i/2, isc);
	        }
	        b1.x = b2.x;  b1.y = b2.y;
	        b2.x = p[0];  b2.y = p[1];
	        var nisc = PolyK._RayLineIntersection(a1, a2, b1, b2, c);
	        if(nisc) PolyK._updateISC(dx, dy, a1, b1, b2, c, p.length/2, isc);
	
	        return (isc.dist != Infinity) ? isc : null;
	    }
	
	    PolyK.ClosestEdge = function(p, x, y, isc)
	    {
	        var l = p.length - 2;
	        var tp = PolyK._tp;
	        var a1 = tp[0],
	        b1 = tp[2], b2 = tp[3], c = tp[4];
	        a1.x = x; a1.y = y;
	
	        if(isc==null) isc = {dist:0, edge:0, point:{x:0, y:0}, norm:{x:0, y:0}};
	        isc.dist = Infinity;
	
	        for(var i=0; i<l; i+=2)
	        {
	            b1.x = p[i  ];  b1.y = p[i+1];
	            b2.x = p[i+2];  b2.y = p[i+3];
	            PolyK._pointLineDist(a1, b1, b2, i>>1, isc);
	        }
	        b1.x = b2.x;  b1.y = b2.y;
	        b2.x = p[0];  b2.y = p[1];
	        PolyK._pointLineDist(a1, b1, b2, l>>1, isc);
	
	        var idst = 1/isc.dist;
	        isc.norm.x = (x-isc.point.x)*idst;
	        isc.norm.y = (y-isc.point.y)*idst;
	        return isc;
	    }
	
	    PolyK._pointLineDist = function(p, a, b, edge, isc)
	    {
	        var x = p.x, y = p.y, x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
	
	        var A = x - x1;
	        var B = y - y1;
	        var C = x2 - x1;
	        var D = y2 - y1;
	
	        var dot = A * C + B * D;
	        var len_sq = C * C + D * D;
	        var param = dot / len_sq;
	
	        var xx, yy;
	
	        if (param < 0 || (x1 == x2 && y1 == y2)) {
	            xx = x1;
	            yy = y1;
	        }
	        else if (param > 1) {
	            xx = x2;
	            yy = y2;
	        }
	        else {
	            xx = x1 + param * C;
	            yy = y1 + param * D;
	        }
	
	        var dx = x - xx;
	        var dy = y - yy;
	        var dst = Math.sqrt(dx * dx + dy * dy);
	        if(dst<isc.dist)
	        {
	            isc.dist = dst;
	            isc.edge = edge;
	            isc.point.x = xx;
	            isc.point.y = yy;
	        }
	    }
	
	    PolyK._updateISC = function(dx, dy, a1, b1, b2, c, edge, isc)
	    {
	        var nrl = PolyK._P.dist(a1, c);
	        if(nrl<isc.dist)
	        {
	            var ibl = 1/PolyK._P.dist(b1, b2);
	            var nx = -(b2.y-b1.y)*ibl;
	            var ny =  (b2.x-b1.x)*ibl;
	            var ddot = 2*(dx*nx+dy*ny);
	            isc.dist = nrl;
	            isc.norm.x = nx;
	            isc.norm.y = ny;
	            isc.refl.x = -ddot*nx+dx;
	            isc.refl.y = -ddot*ny+dy;
	            isc.edge = edge;
	        }
	    }
	
	    PolyK._getPoints = function(ps, ind0, ind1)
	    {
	        var n = ps.length;
	        var nps = [];
	        if(ind1<ind0) ind1 += n;
	        for(var i=ind0; i<= ind1; i++) nps.push(ps[i%n]);
	        return nps;
	    }
	
	    PolyK._firstWithFlag = function(ps, ind)
	    {
	        var n = ps.length;
	        while(true)
	        {
	            ind = (ind+1)%n;
	            if(ps[ind].flag) return ind;
	        }
	    }
	    */
	    PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
	    {
	        var v0x = cx-ax;
	        var v0y = cy-ay;
	        var v1x = bx-ax;
	        var v1y = by-ay;
	        var v2x = px-ax;
	        var v2y = py-ay;
	
	        var dot00 = v0x*v0x+v0y*v0y;
	        var dot01 = v0x*v1x+v0y*v1y;
	        var dot02 = v0x*v2x+v0y*v2y;
	        var dot11 = v1x*v1x+v1y*v1y;
	        var dot12 = v1x*v2x+v1y*v2y;
	
	        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
	
	        // Check if point is in triangle
	        return (u >= 0) && (v >= 0) && (u + v < 1);
	    }
	    /*
	    PolyK._RayLineIntersection = function(a1, a2, b1, b2, c)
	    {
	        var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
	        var day = (a1.y-a2.y), dby = (b1.y-b2.y);
	
	        var Den = dax*dby - day*dbx;
	        if (Den == 0) return null;  // parallel
	
	        var A = (a1.x * a2.y - a1.y * a2.x);
	        var B = (b1.x * b2.y - b1.y * b2.x);
	
	        var I = c;
	        var iDen = 1/Den;
	        I.x = ( A*dbx - dax*B ) * iDen;
	        I.y = ( A*dby - day*B ) * iDen;
	
	        if(!PolyK._InRect(I, b1, b2)) return null;
	        if((day>0 && I.y>a1.y) || (day<0 && I.y<a1.y)) return null;
	        if((dax>0 && I.x>a1.x) || (dax<0 && I.x<a1.x)) return null;
	        return I;
	    }
	
	    PolyK._GetLineIntersection = function(a1, a2, b1, b2, c)
	    {
	        var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
	        var day = (a1.y-a2.y), dby = (b1.y-b2.y);
	
	        var Den = dax*dby - day*dbx;
	        if (Den == 0) return null;  // parallel
	
	        var A = (a1.x * a2.y - a1.y * a2.x);
	        var B = (b1.x * b2.y - b1.y * b2.x);
	
	        var I = c;
	        I.x = ( A*dbx - dax*B ) / Den;
	        I.y = ( A*dby - day*B ) / Den;
	
	        if(PolyK._InRect(I, a1, a2) && PolyK._InRect(I, b1, b2)) return I;
	        return null;
	    }
	
	    PolyK._InRect = function(a, b, c)
	    {
	        if  (b.x == c.x) return (a.y>=Math.min(b.y, c.y) && a.y<=Math.max(b.y, c.y));
	        if  (b.y == c.y) return (a.x>=Math.min(b.x, c.x) && a.x<=Math.max(b.x, c.x));
	
	        if(a.x >= Math.min(b.x, c.x) && a.x <= Math.max(b.x, c.x)
	        && a.y >= Math.min(b.y, c.y) && a.y <= Math.max(b.y, c.y))
	        return true;
	        return false;
	    }
	    */
	    PolyK._convex = function(ax, ay, bx, by, cx, cy)
	    {
	        return (ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0;
	    }
	    /*
	    PolyK._P = function(x,y)
	    {
	        this.x = x;
	        this.y = y;
	        this.flag = false;
	    }
	    PolyK._P.prototype.toString = function()
	    {
	        return "Point ["+this.x+", "+this.y+"]";
	    }
	    PolyK._P.dist = function(a,b)
	    {
	        var dx = b.x-a.x;
	        var dy = b.y-a.y;
	        return Math.sqrt(dx*dx + dy*dy);
	    }
	
	    PolyK._tp = [];
	    for(var i=0; i<10; i++) PolyK._tp.push(new PolyK._P(0,0));
	        */
	
	module.exports = PolyK;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8);
	var Ray = __webpack_require__(22);
	
	module.exports = RaycastResult;
	
	/**
	 * Storage for Ray casting hit data.
	 * @class RaycastResult
	 * @constructor
	 */
	function RaycastResult(){
	
		/**
		 * The normal of the hit, oriented in world space.
		 * @property {array} normal
		 */
		this.normal = vec2.create();
	
		/**
		 * The hit shape, or null.
		 * @property {Shape} shape
		 */
		this.shape = null;
	
		/**
		 * The hit body, or null.
		 * @property {Body} body
		 */
		this.body = null;
	
		/**
		 * The index of the hit triangle, if the hit shape was indexable.
		 * @property {number} faceIndex
		 * @default -1
		 */
		this.faceIndex = -1;
	
		/**
		 * Distance to the hit, as a fraction. 0 is at the "from" point, 1 is at the "to" point. Will be set to -1 if there was no hit yet.
		 * @property {number} fraction
		 * @default -1
		 */
		this.fraction = -1;
	
		/**
		 * If the ray should stop traversing.
		 * @readonly
		 * @property {Boolean} isStopped
		 */
		this.isStopped = false;
	}
	
	/**
	 * Reset all result data. Must be done before re-using the result object.
	 * @method reset
	 */
	RaycastResult.prototype.reset = function () {
		vec2.set(this.normal, 0, 0);
		this.shape = null;
		this.body = null;
		this.faceIndex = -1;
		this.fraction = -1;
		this.isStopped = false;
	};
	
	/**
	 * Get the distance to the hit point.
	 * @method getHitDistance
	 * @param {Ray} ray
	 */
	RaycastResult.prototype.getHitDistance = function (ray) {
		return vec2.distance(ray.from, ray.to) * this.fraction;
	};
	
	/**
	 * Returns true if the ray hit something since the last reset().
	 * @method hasHit
	 */
	RaycastResult.prototype.hasHit = function () {
		return this.fraction !== -1;
	};
	
	/**
	 * Get world hit point.
	 * @method getHitPoint
	 * @param {array} out
	 * @param {Ray} ray
	 */
	RaycastResult.prototype.getHitPoint = function (out, ray) {
		vec2.lerp(out, ray.from, ray.to, this.fraction);
	};
	
	/**
	 * Can be called while iterating over hits to stop searching for hit points.
	 * @method stop
	 */
	RaycastResult.prototype.stop = function(){
		this.isStopped = true;
	};
	
	/**
	 * @method shouldStop
	 * @private
	 * @param {Ray} ray
	 * @return {boolean}
	 */
	RaycastResult.prototype.shouldStop = function(ray){
		return this.isStopped || (this.fraction !== -1 && ray.mode === Ray.ANY);
	};
	
	/**
	 * @method set
	 * @private
	 * @param {array} normal
	 * @param {Shape} shape
	 * @param {Body} body
	 * @param {number} fraction
	 */
	RaycastResult.prototype.set = function(
		normal,
		shape,
		body,
		fraction,
		faceIndex
	){
		vec2.copy(this.normal, normal);
		this.shape = shape;
		this.body = body;
		this.fraction = fraction;
		this.faceIndex = faceIndex;
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Ray;
	
	var vec2 = __webpack_require__(8);
	var RaycastResult = __webpack_require__(21);
	var Shape = __webpack_require__(19);
	var AABB = __webpack_require__(7);
	
	/**
	 * A line with a start and end point that is used to intersect shapes. For an example, see {{#crossLink "World/raycast:method"}}World.raycast{{/crossLink}}
	 * @class Ray
	 * @constructor
	 * @param {object} [options]
	 * @param {array} [options.from]
	 * @param {array} [options.to]
	 * @param {boolean} [options.checkCollisionResponse=true]
	 * @param {boolean} [options.skipBackfaces=false]
	 * @param {number} [options.collisionMask=-1]
	 * @param {number} [options.collisionGroup=-1]
	 * @param {number} [options.mode=Ray.ANY]
	 * @param {number} [options.callback]
	 */
	function Ray(options){
	    options = options || {};
	
	    /**
	     * Ray start point.
	     * @property {array} from
	     */
	    this.from = options.from ? vec2.fromValues(options.from[0], options.from[1]) : vec2.create();
	
	    /**
	     * Ray end point
	     * @property {array} to
	     */
	    this.to = options.to ? vec2.fromValues(options.to[0], options.to[1]) : vec2.create();
	
	    /**
	     * Set to true if you want the Ray to take .collisionResponse flags into account on bodies and shapes.
	     * @property {Boolean} checkCollisionResponse
	     */
	    this.checkCollisionResponse = options.checkCollisionResponse !== undefined ? options.checkCollisionResponse : true;
	
	    /**
	     * If set to true, the ray skips any hits with normal.dot(rayDirection) < 0.
	     * @property {Boolean} skipBackfaces
	     */
	    this.skipBackfaces = !!options.skipBackfaces;
	
	    /**
	     * @property {number} collisionMask
	     * @default -1
	     */
	    this.collisionMask = options.collisionMask !== undefined ? options.collisionMask : -1;
	
	    /**
	     * @property {number} collisionGroup
	     * @default -1
	     */
	    this.collisionGroup = options.collisionGroup !== undefined ? options.collisionGroup : -1;
	
	    /**
	     * The intersection mode. Should be {{#crossLink "Ray/ANY:property"}}Ray.ANY{{/crossLink}}, {{#crossLink "Ray/ALL:property"}}Ray.ALL{{/crossLink}} or {{#crossLink "Ray/CLOSEST:property"}}Ray.CLOSEST{{/crossLink}}.
	     * @property {number} mode
	     */
	    this.mode = options.mode !== undefined ? options.mode : Ray.ANY;
	
	    /**
	     * Current, user-provided result callback. Will be used if mode is Ray.ALL.
	     * @property {Function} callback
	     */
	    this.callback = options.callback || function(result){};
	
	    /**
	     * @readOnly
	     * @property {array} direction
	     */
	    this.direction = vec2.create();
	
	    /**
	     * Length of the ray
	     * @readOnly
	     * @property {number} length
	     */
	    this.length = 1;
	
	    this.update();
	}
	Ray.prototype.constructor = Ray;
	
	/**
	 * This raycasting mode will make the Ray traverse through all intersection points and only return the closest one.
	 * @static
	 * @property {Number} CLOSEST
	 */
	Ray.CLOSEST = 1;
	
	/**
	 * This raycasting mode will make the Ray stop when it finds the first intersection point.
	 * @static
	 * @property {Number} ANY
	 */
	Ray.ANY = 2;
	
	/**
	 * This raycasting mode will traverse all intersection points and executes a callback for each one.
	 * @static
	 * @property {Number} ALL
	 */
	Ray.ALL = 4;
	
	/**
	 * Should be called if you change the from or to point.
	 * @method update
	 */
	Ray.prototype.update = function(){
	
	    // Update .direction and .length
	    var d = this.direction;
	    vec2.sub(d, this.to, this.from);
	    this.length = vec2.length(d);
	    vec2.normalize(d, d);
	
	};
	
	/**
	 * @method intersectBodies
	 * @param {Array} bodies An array of Body objects.
	 */
	Ray.prototype.intersectBodies = function (result, bodies) {
	    for (var i = 0, l = bodies.length; !result.shouldStop(this) && i < l; i++) {
	        var body = bodies[i];
	        var aabb = body.getAABB();
	        if(aabb.overlapsRay(this) >= 0 || aabb.containsPoint(this.from)){
	            this.intersectBody(result, body);
	        }
	    }
	};
	
	var intersectBody_worldPosition = vec2.create();
	
	/**
	 * Shoot a ray at a body, get back information about the hit.
	 * @method intersectBody
	 * @private
	 * @param {Body} body
	 */
	Ray.prototype.intersectBody = function (result, body) {
	    var checkCollisionResponse = this.checkCollisionResponse;
	
	    if(checkCollisionResponse && !body.collisionResponse){
	        return;
	    }
	
	    var worldPosition = intersectBody_worldPosition;
	
	    for (var i = 0, N = body.shapes.length; i < N; i++) {
	        var shape = body.shapes[i];
	
	        if(checkCollisionResponse && !shape.collisionResponse){
	            continue; // Skip
	        }
	
	        if((this.collisionGroup & shape.collisionMask) === 0 || (shape.collisionGroup & this.collisionMask) === 0){
	            continue;
	        }
	
	        // Get world angle and position of the shape
	        vec2.rotate(worldPosition, shape.position, body.angle);
	        vec2.add(worldPosition, worldPosition, body.position);
	        var worldAngle = shape.angle + body.angle;
	
	        this.intersectShape(
	            result,
	            shape,
	            worldAngle,
	            worldPosition,
	            body
	        );
	
	        if(result.shouldStop(this)){
	            break;
	        }
	    }
	};
	
	/**
	 * @method intersectShape
	 * @private
	 * @param {Shape} shape
	 * @param {number} angle
	 * @param {array} position
	 * @param {Body} body
	 */
	Ray.prototype.intersectShape = function(result, shape, angle, position, body){
	    var from = this.from;
	
	    // Checking radius
	    var distance = distanceFromIntersectionSquared(from, this.direction, position);
	    if (distance > shape.boundingRadius * shape.boundingRadius) {
	        return;
	    }
	
	    this._currentBody = body;
	    this._currentShape = shape;
	
	    shape.raycast(result, this, position, angle);
	
	    this._currentBody = this._currentShape = null;
	};
	
	/**
	 * Get the AABB of the ray.
	 * @method getAABB
	 * @param  {AABB} aabb
	 */
	Ray.prototype.getAABB = function(result){
	    var to = this.to;
	    var from = this.from;
	    vec2.set(
	        result.lowerBound,
	        Math.min(to[0], from[0]),
	        Math.min(to[1], from[1])
	    );
	    vec2.set(
	        result.upperBound,
	        Math.max(to[0], from[0]),
	        Math.max(to[1], from[1])
	    );
	};
	
	var hitPointWorld = vec2.create();
	
	/**
	 * @method reportIntersection
	 * @private
	 * @param  {number} fraction
	 * @param  {array} normal
	 * @param  {number} [faceIndex=-1]
	 * @return {boolean} True if the intersections should continue
	 */
	Ray.prototype.reportIntersection = function(result, fraction, normal, faceIndex){
	    var from = this.from;
	    var to = this.to;
	    var shape = this._currentShape;
	    var body = this._currentBody;
	
	    // Skip back faces?
	    if(this.skipBackfaces && vec2.dot(normal, this.direction) > 0){
	        return;
	    }
	
	    switch(this.mode){
	
	    case Ray.ALL:
	        result.set(
	            normal,
	            shape,
	            body,
	            fraction,
	            faceIndex
	        );
	        this.callback(result);
	        break;
	
	    case Ray.CLOSEST:
	
	        // Store if closer than current closest
	        if(fraction < result.fraction || !result.hasHit()){
	            result.set(
	                normal,
	                shape,
	                body,
	                fraction,
	                faceIndex
	            );
	        }
	        break;
	
	    case Ray.ANY:
	
	        // Report and stop.
	        result.set(
	            normal,
	            shape,
	            body,
	            fraction,
	            faceIndex
	        );
	        break;
	    }
	};
	
	var v0 = vec2.create(),
	    intersect = vec2.create();
	function distanceFromIntersectionSquared(from, direction, position) {
	
	    // v0 is vector from from to position
	    vec2.sub(v0, position, from);
	    var dot = vec2.dot(v0, direction);
	
	    // intersect = direction * dot + from
	    vec2.scale(intersect, direction, dot);
	    vec2.add(intersect, intersect, from);
	
	    return vec2.squaredDistance(position, intersect);
	}
	


/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * Base class for objects that dispatches events.
	 * @class EventEmitter
	 * @constructor
	 */
	var EventEmitter = function () {};
	
	module.exports = EventEmitter;
	
	EventEmitter.prototype = {
	    constructor: EventEmitter,
	
	    /**
	     * Add an event listener
	     * @method on
	     * @param  {String} type
	     * @param  {Function} listener
	     * @return {EventEmitter} The self object, for chainability.
	     */
	    on: function ( type, listener, context ) {
	        listener.context = context || this;
	        if ( this._listeners === undefined ){
	            this._listeners = {};
	        }
	        var listeners = this._listeners;
	        if ( listeners[ type ] === undefined ) {
	            listeners[ type ] = [];
	        }
	        if ( listeners[ type ].indexOf( listener ) === - 1 ) {
	            listeners[ type ].push( listener );
	        }
	        return this;
	    },
	
	    /**
	     * Check if an event listener is added
	     * @method has
	     * @param  {String} type
	     * @param  {Function} listener
	     * @return {Boolean}
	     */
	    has: function ( type, listener ) {
	        if ( this._listeners === undefined ){
	            return false;
	        }
	        var listeners = this._listeners;
	        if(listener){
	            if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
	                return true;
	            }
	        } else {
	            if ( listeners[ type ] !== undefined ) {
	                return true;
	            }
	        }
	
	        return false;
	    },
	
	    /**
	     * Remove an event listener
	     * @method off
	     * @param  {String} type
	     * @param  {Function} listener
	     * @return {EventEmitter} The self object, for chainability.
	     */
	    off: function ( type, listener ) {
	        if ( this._listeners === undefined ){
	            return this;
	        }
	        var listeners = this._listeners;
	        var index = listeners[ type ].indexOf( listener );
	        if ( index !== - 1 ) {
	            listeners[ type ].splice( index, 1 );
	        }
	        return this;
	    },
	
	    /**
	     * Emit an event.
	     * @method emit
	     * @param  {Object} event
	     * @param  {String} event.type
	     * @return {EventEmitter} The self object, for chainability.
	     */
	    emit: function ( event ) {
	        if ( this._listeners === undefined ){
	            return this;
	        }
	        var listeners = this._listeners;
	        var listenerArray = listeners[ event.type ];
	        if ( listenerArray !== undefined ) {
	            event.target = this;
	            for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {
	                var listener = listenerArray[ i ];
	                listener.call( listener.context, event );
	            }
	        }
	        return this;
	    }
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8);
	var Body = __webpack_require__(12);
	
	module.exports = Broadphase;
	
	/**
	 * Base class for broadphase implementations.
	 * @class Broadphase
	 * @constructor
	 */
	function Broadphase(type){
	
	    this.type = type;
	
	    /**
	     * The resulting overlapping pairs. Will be filled with results during .getCollisionPairs().
	     * @property result
	     * @type {Array}
	     */
	    this.result = [];
	
	    /**
	     * The world to search for collision pairs in. To change it, use .setWorld()
	     * @property world
	     * @type {World}
	     * @readOnly
	     */
	    this.world = null;
	
	    /**
	     * The bounding volume type to use in the broadphase algorithms. Should be set to Broadphase.AABB or Broadphase.BOUNDING_CIRCLE.
	     * @property {Number} boundingVolumeType
	     */
	    this.boundingVolumeType = Broadphase.AABB;
	}
	
	/**
	 * Axis aligned bounding box type.
	 * @static
	 * @property {Number} AABB
	 */
	Broadphase.AABB = 1;
	
	/**
	 * Bounding circle type.
	 * @static
	 * @property {Number} BOUNDING_CIRCLE
	 */
	Broadphase.BOUNDING_CIRCLE = 2;
	
	/**
	 * Set the world that we are searching for collision pairs in.
	 * @method setWorld
	 * @param  {World} world
	 */
	Broadphase.prototype.setWorld = function(world){
	    this.world = world;
	};
	
	/**
	 * Get all potential intersecting body pairs.
	 * @method getCollisionPairs
	 * @param  {World} world The world to search in.
	 * @return {Array} An array of the bodies, ordered in pairs. Example: A result of [a,b,c,d] means that the potential pairs are: (a,b), (c,d).
	 */
	Broadphase.prototype.getCollisionPairs = function(world){};
	
	var dist = vec2.create();
	
	/**
	 * Check whether the bounding radius of two bodies overlap.
	 * @method  boundingRadiusCheck
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {Boolean}
	 */
	Broadphase.boundingRadiusCheck = function(bodyA, bodyB){
	    vec2.sub(dist, bodyA.position, bodyB.position);
	    var d2 = vec2.squaredLength(dist),
	        r = bodyA.boundingRadius + bodyB.boundingRadius;
	    return d2 <= r*r;
	};
	
	/**
	 * Check whether the bounding radius of two bodies overlap.
	 * @method  boundingRadiusCheck
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {Boolean}
	 */
	Broadphase.aabbCheck = function(bodyA, bodyB){
	    return bodyA.getAABB().overlaps(bodyB.getAABB());
	};
	
	/**
	 * Check whether the bounding radius of two bodies overlap.
	 * @method  boundingRadiusCheck
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {Boolean}
	 */
	Broadphase.prototype.boundingVolumeCheck = function(bodyA, bodyB){
	    var result;
	
	    switch(this.boundingVolumeType){
	    case Broadphase.BOUNDING_CIRCLE:
	        result =  Broadphase.boundingRadiusCheck(bodyA,bodyB);
	        break;
	    case Broadphase.AABB:
	        result = Broadphase.aabbCheck(bodyA,bodyB);
	        break;
	    default:
	        throw new Error('Bounding volume type not recognized: '+this.boundingVolumeType);
	    }
	    return result;
	};
	
	/**
	 * Check whether two bodies are allowed to collide at all.
	 * @method  canCollide
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {Boolean}
	 */
	Broadphase.canCollide = function(bodyA, bodyB){
	    var KINEMATIC = Body.KINEMATIC;
	    var STATIC = Body.STATIC;
	
	    // Cannot collide static bodies
	    if(bodyA.type === STATIC && bodyB.type === STATIC){
	        return false;
	    }
	
	    // Cannot collide static vs kinematic bodies
	    if( (bodyA.type === KINEMATIC && bodyB.type === STATIC) ||
	        (bodyA.type === STATIC    && bodyB.type === KINEMATIC)){
	        return false;
	    }
	
	    // Cannot collide kinematic vs kinematic
	    if(bodyA.type === KINEMATIC && bodyB.type === KINEMATIC){
	        return false;
	    }
	
	    // Cannot collide both sleeping bodies
	    if(bodyA.sleepState === Body.SLEEPING && bodyB.sleepState === Body.SLEEPING){
	        return false;
	    }
	
	    // Cannot collide if one is static and the other is sleeping
	    if( (bodyA.sleepState === Body.SLEEPING && bodyB.type === STATIC) ||
	        (bodyB.sleepState === Body.SLEEPING && bodyA.type === STATIC)){
	        return false;
	    }
	
	    return true;
	};
	
	Broadphase.NAIVE = 1;
	Broadphase.SAP = 2;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(19)
	,   vec2 = __webpack_require__(8);
	
	module.exports = Capsule;
	
	/**
	 * Capsule shape class.
	 * @class Capsule
	 * @constructor
	 * @extends Shape
	 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
	 * @param {Number} [options.length=1] The distance between the end points
	 * @param {Number} [options.radius=1] Radius of the capsule
	 * @example
	 *     var capsuleShape = new Capsule({
	 *         length: 1,
	 *         radius: 2
	 *     });
	 *     body.addShape(capsuleShape);
	 */
	function Capsule(options){
	    if(typeof(arguments[0]) === 'number' && typeof(arguments[1]) === 'number'){
	        options = {
	            length: arguments[0],
	            radius: arguments[1]
	        };
	        console.warn('The Capsule constructor signature has changed. Please use the following format: new Capsule({ radius: 1, length: 1 })');
	    }
	    options = options || {};
	
	    /**
	     * The distance between the end points.
	     * @property {Number} length
	     */
	    this.length = options.length || 1;
	
	    /**
	     * The radius of the capsule.
	     * @property {Number} radius
	     */
	    this.radius = options.radius || 1;
	
	    options.type = Shape.CAPSULE;
	    Shape.call(this, options);
	}
	Capsule.prototype = new Shape();
	Capsule.prototype.constructor = Capsule;
	
	/**
	 * Compute the mass moment of inertia of the Capsule.
	 * @method conputeMomentOfInertia
	 * @param  {Number} mass
	 * @return {Number}
	 * @todo
	 */
	Capsule.prototype.computeMomentOfInertia = function(mass){
	    // Approximate with rectangle
	    var r = this.radius,
	        w = this.length + r, // 2*r is too much, 0 is too little
	        h = r*2;
	    return mass * (h*h + w*w) / 12;
	};
	
	/**
	 * @method updateBoundingRadius
	 */
	Capsule.prototype.updateBoundingRadius = function(){
	    this.boundingRadius = this.radius + this.length/2;
	};
	
	/**
	 * @method updateArea
	 */
	Capsule.prototype.updateArea = function(){
	    this.area = Math.PI * this.radius * this.radius + this.radius * 2 * this.length;
	};
	
	var r = vec2.create();
	
	/**
	 * @method computeAABB
	 * @param  {AABB}   out      The resulting AABB.
	 * @param  {Array}  position
	 * @param  {Number} angle
	 */
	Capsule.prototype.computeAABB = function(out, position, angle){
	    var radius = this.radius;
	
	    // Compute center position of one of the the circles, world oriented, but with local offset
	    vec2.set(r,this.length / 2,0);
	    if(angle !== 0){
	        vec2.rotate(r,r,angle);
	    }
	
	    // Get bounds
	    vec2.set(out.upperBound,  Math.max(r[0]+radius, -r[0]+radius),
	                              Math.max(r[1]+radius, -r[1]+radius));
	    vec2.set(out.lowerBound,  Math.min(r[0]-radius, -r[0]-radius),
	                              Math.min(r[1]-radius, -r[1]-radius));
	
	    // Add offset
	    vec2.add(out.lowerBound, out.lowerBound, position);
	    vec2.add(out.upperBound, out.upperBound, position);
	};
	
	var intersectCapsule_hitPointWorld = vec2.create();
	var intersectCapsule_normal = vec2.create();
	var intersectCapsule_l0 = vec2.create();
	var intersectCapsule_l1 = vec2.create();
	var intersectCapsule_unit_y = vec2.fromValues(0,1);
	
	/**
	 * @method raycast
	 * @param  {RaycastResult} result
	 * @param  {Ray} ray
	 * @param  {array} position
	 * @param  {number} angle
	 */
	Capsule.prototype.raycast = function(result, ray, position, angle){
	    var from = ray.from;
	    var to = ray.to;
	    var direction = ray.direction;
	
	    var hitPointWorld = intersectCapsule_hitPointWorld;
	    var normal = intersectCapsule_normal;
	    var l0 = intersectCapsule_l0;
	    var l1 = intersectCapsule_l1;
	
	    // The sides
	    var halfLen = this.length / 2;
	    for(var i=0; i<2; i++){
	
	        // get start and end of the line
	        var y = this.radius * (i*2-1);
	        vec2.set(l0, -halfLen, y);
	        vec2.set(l1, halfLen, y);
	        vec2.toGlobalFrame(l0, l0, position, angle);
	        vec2.toGlobalFrame(l1, l1, position, angle);
	
	        var delta = vec2.getLineSegmentsIntersectionFraction(from, to, l0, l1);
	        if(delta >= 0){
	            vec2.rotate(normal, intersectCapsule_unit_y, angle);
	            vec2.scale(normal, normal, (i*2-1));
	            ray.reportIntersection(result, delta, normal, -1);
	            if(result.shouldStop(ray)){
	                return;
	            }
	        }
	    }
	
	    // Circles
	    var diagonalLengthSquared = Math.pow(this.radius, 2) + Math.pow(halfLen, 2);
	    for(var i=0; i<2; i++){
	        vec2.set(l0, halfLen * (i*2-1), 0);
	        vec2.toGlobalFrame(l0, l0, position, angle);
	
	        var a = Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2);
	        var b = 2 * ((to[0] - from[0]) * (from[0] - l0[0]) + (to[1] - from[1]) * (from[1] - l0[1]));
	        var c = Math.pow(from[0] - l0[0], 2) + Math.pow(from[1] - l0[1], 2) - Math.pow(this.radius, 2);
	        var delta = Math.pow(b, 2) - 4 * a * c;
	
	        if(delta < 0){
	            // No intersection
	            continue;
	
	        } else if(delta === 0){
	            // single intersection point
	            vec2.lerp(hitPointWorld, from, to, delta);
	
	            if(vec2.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
	                vec2.sub(normal, hitPointWorld, l0);
	                vec2.normalize(normal,normal);
	                ray.reportIntersection(result, delta, normal, -1);
	                if(result.shouldStop(ray)){
	                    return;
	                }
	            }
	
	        } else {
	            var sqrtDelta = Math.sqrt(delta);
	            var inv2a = 1 / (2 * a);
	            var d1 = (- b - sqrtDelta) * inv2a;
	            var d2 = (- b + sqrtDelta) * inv2a;
	
	            if(d1 >= 0 && d1 <= 1){
	                vec2.lerp(hitPointWorld, from, to, d1);
	                if(vec2.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
	                    vec2.sub(normal, hitPointWorld, l0);
	                    vec2.normalize(normal,normal);
	                    ray.reportIntersection(result, d1, normal, -1);
	                    if(result.shouldStop(ray)){
	                        return;
	                    }
	                }
	            }
	
	            if(d2 >= 0 && d2 <= 1){
	                vec2.lerp(hitPointWorld, from, to, d2);
	                if(vec2.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
	                    vec2.sub(normal, hitPointWorld, l0);
	                    vec2.normalize(normal,normal);
	                    ray.reportIntersection(result, d2, normal, -1);
	                    if(result.shouldStop(ray)){
	                        return;
	                    }
	                }
	            }
	        }
	    }
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(19)
	,    vec2 = __webpack_require__(8);
	
	module.exports = Circle;
	
	/**
	 * Circle shape class.
	 * @class Circle
	 * @extends Shape
	 * @constructor
	 * @param {options} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
	 * @param {number} [options.radius=1] The radius of this circle
	 *
	 * @example
	 *     var circleShape = new Circle({ radius: 1 });
	 *     body.addShape(circleShape);
	 */
	function Circle(options){
	    if(typeof(arguments[0]) === 'number'){
	        options = {
	            radius: arguments[0]
	        };
	        console.warn('The Circle constructor signature has changed. Please use the following format: new Circle({ radius: 1 })');
	    }
	    options = options || {};
	
	    /**
	     * The radius of the circle.
	     * @property radius
	     * @type {number}
	     */
	    this.radius = options.radius || 1;
	
	    options.type = Shape.CIRCLE;
	    Shape.call(this, options);
	}
	Circle.prototype = new Shape();
	Circle.prototype.constructor = Circle;
	
	/**
	 * @method computeMomentOfInertia
	 * @param  {Number} mass
	 * @return {Number}
	 */
	Circle.prototype.computeMomentOfInertia = function(mass){
	    var r = this.radius;
	    return mass * r * r / 2;
	};
	
	/**
	 * @method updateBoundingRadius
	 * @return {Number}
	 */
	Circle.prototype.updateBoundingRadius = function(){
	    this.boundingRadius = this.radius;
	};
	
	/**
	 * @method updateArea
	 * @return {Number}
	 */
	Circle.prototype.updateArea = function(){
	    this.area = Math.PI * this.radius * this.radius;
	};
	
	/**
	 * @method computeAABB
	 * @param  {AABB}   out      The resulting AABB.
	 * @param  {Array}  position
	 * @param  {Number} angle
	 */
	Circle.prototype.computeAABB = function(out, position, angle){
	    var r = this.radius;
	    vec2.set(out.upperBound,  r,  r);
	    vec2.set(out.lowerBound, -r, -r);
	    if(position){
	        vec2.add(out.lowerBound, out.lowerBound, position);
	        vec2.add(out.upperBound, out.upperBound, position);
	    }
	};
	
	var Ray_intersectSphere_intersectionPoint = vec2.create();
	var Ray_intersectSphere_normal = vec2.create();
	
	/**
	 * @method raycast
	 * @param  {RaycastResult} result
	 * @param  {Ray} ray
	 * @param  {array} position
	 * @param  {number} angle
	 */
	Circle.prototype.raycast = function(result, ray, position, angle){
	    var from = ray.from,
	        to = ray.to,
	        r = this.radius;
	
	    var a = Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2);
	    var b = 2 * ((to[0] - from[0]) * (from[0] - position[0]) + (to[1] - from[1]) * (from[1] - position[1]));
	    var c = Math.pow(from[0] - position[0], 2) + Math.pow(from[1] - position[1], 2) - Math.pow(r, 2);
	    var delta = Math.pow(b, 2) - 4 * a * c;
	
	    var intersectionPoint = Ray_intersectSphere_intersectionPoint;
	    var normal = Ray_intersectSphere_normal;
	
	    if(delta < 0){
	        // No intersection
	        return;
	
	    } else if(delta === 0){
	        // single intersection point
	        vec2.lerp(intersectionPoint, from, to, delta);
	
	        vec2.sub(normal, intersectionPoint, position);
	        vec2.normalize(normal,normal);
	
	        ray.reportIntersection(result, delta, normal, -1);
	
	    } else {
	        var sqrtDelta = Math.sqrt(delta);
	        var inv2a = 1 / (2 * a);
	        var d1 = (- b - sqrtDelta) * inv2a;
	        var d2 = (- b + sqrtDelta) * inv2a;
	
	        if(d1 >= 0 && d1 <= 1){
	            vec2.lerp(intersectionPoint, from, to, d1);
	
	            vec2.sub(normal, intersectionPoint, position);
	            vec2.normalize(normal,normal);
	
	            ray.reportIntersection(result, d1, normal, -1);
	
	            if(result.shouldStop(ray)){
	                return;
	            }
	        }
	
	        if(d2 >= 0 && d2 <= 1){
	            vec2.lerp(intersectionPoint, from, to, d2);
	
	            vec2.sub(normal, intersectionPoint, position);
	            vec2.normalize(normal,normal);
	
	            ray.reportIntersection(result, d2, normal, -1);
	        }
	    }
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Constraint;
	
	var Utils = __webpack_require__(9);
	
	/**
	 * Base constraint class.
	 *
	 * @class Constraint
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Number} type
	 * @param {Object} [options]
	 * @param {Object} [options.collideConnected=true]
	 */
	function Constraint(bodyA, bodyB, type, options){
	
	    /**
	     * The type of constraint. May be one of Constraint.DISTANCE, Constraint.GEAR, Constraint.LOCK, Constraint.PRISMATIC or Constraint.REVOLUTE.
	     * @property {number} type
	     */
	    this.type = type;
	
	    options = Utils.defaults(options,{
	        collideConnected : true,
	        wakeUpBodies : true,
	    });
	
	    /**
	     * Equations to be solved in this constraint
	     *
	     * @property equations
	     * @type {Array}
	     */
	    this.equations = [];
	
	    /**
	     * First body participating in the constraint.
	     * @property bodyA
	     * @type {Body}
	     */
	    this.bodyA = bodyA;
	
	    /**
	     * Second body participating in the constraint.
	     * @property bodyB
	     * @type {Body}
	     */
	    this.bodyB = bodyB;
	
	    /**
	     * Set to true if you want the connected bodies to collide.
	     * @property collideConnected
	     * @type {Boolean}
	     * @default true
	     */
	    this.collideConnected = options.collideConnected;
	
	    // Wake up bodies when connected
	    if(options.wakeUpBodies){
	        if(bodyA){
	            bodyA.wakeUp();
	        }
	        if(bodyB){
	            bodyB.wakeUp();
	        }
	    }
	}
	
	/**
	 * Updates the internal constraint parameters before solve.
	 * @method update
	 */
	Constraint.prototype.update = function(){
	    throw new Error("method update() not implmemented in this Constraint subclass!");
	};
	
	/**
	 * @static
	 * @property {number} DISTANCE
	 */
	Constraint.DISTANCE = 1;
	
	/**
	 * @static
	 * @property {number} GEAR
	 */
	Constraint.GEAR = 2;
	
	/**
	 * @static
	 * @property {number} LOCK
	 */
	Constraint.LOCK = 3;
	
	/**
	 * @static
	 * @property {number} PRISMATIC
	 */
	Constraint.PRISMATIC = 4;
	
	/**
	 * @static
	 * @property {number} REVOLUTE
	 */
	Constraint.REVOLUTE = 5;
	
	/**
	 * Set stiffness for this constraint.
	 * @method setStiffness
	 * @param {Number} stiffness
	 */
	Constraint.prototype.setStiffness = function(stiffness){
	    var eqs = this.equations;
	    for(var i=0; i !== eqs.length; i++){
	        var eq = eqs[i];
	        eq.stiffness = stiffness;
	        eq.needsUpdate = true;
	    }
	};
	
	/**
	 * Set relaxation for this constraint.
	 * @method setRelaxation
	 * @param {Number} relaxation
	 */
	Constraint.prototype.setRelaxation = function(relaxation){
	    var eqs = this.equations;
	    for(var i=0; i !== eqs.length; i++){
	        var eq = eqs[i];
	        eq.relaxation = relaxation;
	        eq.needsUpdate = true;
	    }
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var Equation = __webpack_require__(11),
	    vec2 = __webpack_require__(8);
	
	module.exports = ContactEquation;
	
	/**
	 * Non-penetration constraint equation. Tries to make the contactPointA and contactPointB vectors coincide, while keeping the applied force repulsive.
	 *
	 * @class ContactEquation
	 * @constructor
	 * @extends Equation
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 */
	function ContactEquation(bodyA, bodyB){
	    Equation.call(this, bodyA, bodyB, 0, Number.MAX_VALUE);
	
	    /**
	     * Vector from body i center of mass to the contact point.
	     * @property contactPointA
	     * @type {Array}
	     */
	    this.contactPointA = vec2.create();
	    this.penetrationVec = vec2.create();
	
	    /**
	     * World-oriented vector from body A center of mass to the contact point.
	     * @property contactPointB
	     * @type {Array}
	     */
	    this.contactPointB = vec2.create();
	
	    /**
	     * The normal vector, pointing out of body i
	     * @property normalA
	     * @type {Array}
	     */
	    this.normalA = vec2.create();
	
	    /**
	     * The restitution to use (0=no bounciness, 1=max bounciness).
	     * @property restitution
	     * @type {Number}
	     */
	    this.restitution = 0;
	
	    /**
	     * This property is set to true if this is the first impact between the bodies (not persistant contact).
	     * @property firstImpact
	     * @type {Boolean}
	     * @readOnly
	     */
	    this.firstImpact = false;
	
	    /**
	     * The shape in body i that triggered this contact.
	     * @property shapeA
	     * @type {Shape}
	     */
	    this.shapeA = null;
	
	    /**
	     * The shape in body j that triggered this contact.
	     * @property shapeB
	     * @type {Shape}
	     */
	    this.shapeB = null;
	}
	ContactEquation.prototype = new Equation();
	ContactEquation.prototype.constructor = ContactEquation;
	ContactEquation.prototype.computeB = function(a,b,h){
	    var bi = this.bodyA,
	        bj = this.bodyB,
	        ri = this.contactPointA,
	        rj = this.contactPointB,
	        xi = bi.position,
	        xj = bj.position;
	
	    var penetrationVec = this.penetrationVec,
	        n = this.normalA,
	        G = this.G;
	
	    // Caluclate cross products
	    var rixn = vec2.crossLength(ri,n),
	        rjxn = vec2.crossLength(rj,n);
	
	    // G = [-n -rixn n rjxn]
	    G[0] = -n[0];
	    G[1] = -n[1];
	    G[2] = -rixn;
	    G[3] = n[0];
	    G[4] = n[1];
	    G[5] = rjxn;
	
	    // Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
	    vec2.add(penetrationVec,xj,rj);
	    vec2.sub(penetrationVec,penetrationVec,xi);
	    vec2.sub(penetrationVec,penetrationVec,ri);
	
	    // Compute iteration
	    var GW, Gq;
	    if(this.firstImpact && this.restitution !== 0){
	        Gq = 0;
	        GW = (1/b)*(1+this.restitution) * this.computeGW();
	    } else {
	        Gq = vec2.dot(n,penetrationVec) + this.offset;
	        GW = this.computeGW();
	    }
	
	    var GiMf = this.computeGiMf();
	    var B = - Gq * a - GW * b - h*GiMf;
	
	    return B;
	};
	
	var vi = vec2.create();
	var vj = vec2.create();
	var relVel = vec2.create();
	
	/**
	 * Get the relative velocity along the normal vector.
	 * @return {number}
	 */
	ContactEquation.prototype.getVelocityAlongNormal = function(){
	
	    this.bodyA.getVelocityAtPoint(vi, this.contactPointA);
	    this.bodyB.getVelocityAtPoint(vj, this.contactPointB);
	
	    vec2.subtract(relVel, vi, vj);
	
	    return vec2.dot(this.normalA, relVel);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var ContactEquation = __webpack_require__(28);
	var Pool = __webpack_require__(30);
	
	module.exports = ContactEquationPool;
	
	/**
	 * @class
	 */
	function ContactEquationPool() {
		Pool.apply(this, arguments);
	}
	ContactEquationPool.prototype = new Pool();
	ContactEquationPool.prototype.constructor = ContactEquationPool;
	
	/**
	 * @method create
	 * @return {ContactEquation}
	 */
	ContactEquationPool.prototype.create = function () {
		return new ContactEquation();
	};
	
	/**
	 * @method destroy
	 * @param {ContactEquation} equation
	 * @return {ContactEquationPool}
	 */
	ContactEquationPool.prototype.destroy = function (equation) {
		equation.bodyA = equation.bodyB = null;
		return this;
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = Pool;
	
	/**
	 * @class Object pooling utility.
	 */
	function Pool(options) {
		options = options || {};
	
		/**
		 * @property {Array} objects
		 * @type {Array}
		 */
		this.objects = [];
	
		if(options.size !== undefined){
			this.resize(options.size);
		}
	}
	
	/**
	 * @method resize
	 * @param {number} size
	 * @return {Pool} Self, for chaining
	 */
	Pool.prototype.resize = function (size) {
		var objects = this.objects;
	
		while (objects.length > size) {
			objects.pop();
		}
	
		while (objects.length < size) {
			objects.push(this.create());
		}
	
		return this;
	};
	
	/**
	 * Get an object from the pool or create a new instance.
	 * @method get
	 * @return {Object}
	 */
	Pool.prototype.get = function () {
		var objects = this.objects;
		return objects.length ? objects.pop() : this.create();
	};
	
	/**
	 * Clean up and put the object back into the pool for later use.
	 * @method release
	 * @param {Object} object
	 * @return {Pool} Self for chaining
	 */
	Pool.prototype.release = function (object) {
		this.destroy(object);
		this.objects.push(object);
		return this;
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Material = __webpack_require__(32);
	var Equation = __webpack_require__(11);
	
	module.exports = ContactMaterial;
	
	/**
	 * Defines what happens when two materials meet, such as what friction coefficient to use. You can also set other things such as restitution, surface velocity and constraint parameters.
	 * @class ContactMaterial
	 * @constructor
	 * @param {Material} materialA
	 * @param {Material} materialB
	 * @param {Object}   [options]
	 * @param {Number}   [options.friction=0.3]       Friction coefficient.
	 * @param {Number}   [options.restitution=0]      Restitution coefficient aka "bounciness".
	 * @param {Number}   [options.stiffness]          ContactEquation stiffness.
	 * @param {Number}   [options.relaxation]         ContactEquation relaxation.
	 * @param {Number}   [options.frictionStiffness]  FrictionEquation stiffness.
	 * @param {Number}   [options.frictionRelaxation] FrictionEquation relaxation.
	 * @param {Number}   [options.surfaceVelocity=0]  Surface velocity.
	 * @author schteppe
	 */
	function ContactMaterial(materialA, materialB, options){
	    options = options || {};
	
	    if(!(materialA instanceof Material) || !(materialB instanceof Material)){
	        throw new Error("First two arguments must be Material instances.");
	    }
	
	    /**
	     * The contact material identifier
	     * @property id
	     * @type {Number}
	     */
	    this.id = ContactMaterial.idCounter++;
	
	    /**
	     * First material participating in the contact material
	     * @property materialA
	     * @type {Material}
	     */
	    this.materialA = materialA;
	
	    /**
	     * Second material participating in the contact material
	     * @property materialB
	     * @type {Material}
	     */
	    this.materialB = materialB;
	
	    /**
	     * Friction coefficient to use in the contact of these two materials. Friction = 0 will make the involved objects super slippery, and friction = 1 will make it much less slippery. A friction coefficient larger than 1 will allow for very large friction forces, which can be convenient for preventing car tires not slip on the ground.
	     * @property friction
	     * @type {Number}
	     * @default 0.3
	     */
	    this.friction = typeof(options.friction) !== "undefined" ? Number(options.friction) : 0.3;
	
	    /**
	     * Restitution, or "bounciness" to use in the contact of these two materials. A restitution of 0 will make no bounce, while restitution=1 will approximately bounce back with the same velocity the object came with.
	     * @property restitution
	     * @type {Number}
	     * @default 0
	     */
	    this.restitution = typeof(options.restitution) !== "undefined" ? Number(options.restitution) : 0;
	
	    /**
	     * Hardness of the contact. Less stiffness will make the objects penetrate more, and will make the contact act more like a spring than a contact force. Default value is {{#crossLink "Equation/DEFAULT_STIFFNESS:property"}}Equation.DEFAULT_STIFFNESS{{/crossLink}}.
	     * @property stiffness
	     * @type {Number}
	     */
	    this.stiffness = typeof(options.stiffness) !== "undefined" ? Number(options.stiffness) : Equation.DEFAULT_STIFFNESS;
	
	    /**
	     * Relaxation of the resulting ContactEquation that this ContactMaterial generate. Default value is {{#crossLink "Equation/DEFAULT_RELAXATION:property"}}Equation.DEFAULT_RELAXATION{{/crossLink}}.
	     * @property relaxation
	     * @type {Number}
	     */
	    this.relaxation = typeof(options.relaxation) !== "undefined" ? Number(options.relaxation) : Equation.DEFAULT_RELAXATION;
	
	    /**
	     * Stiffness of the resulting friction force. For most cases, the value of this property should be a large number. I cannot think of any case where you would want less frictionStiffness. Default value is {{#crossLink "Equation/DEFAULT_STIFFNESS:property"}}Equation.DEFAULT_STIFFNESS{{/crossLink}}.
	     * @property frictionStiffness
	     * @type {Number}
	     */
	    this.frictionStiffness = typeof(options.frictionStiffness) !== "undefined" ? Number(options.frictionStiffness) : Equation.DEFAULT_STIFFNESS;
	
	    /**
	     * Relaxation of the resulting friction force. The default value should be good for most simulations. Default value is {{#crossLink "Equation/DEFAULT_RELAXATION:property"}}Equation.DEFAULT_RELAXATION{{/crossLink}}.
	     * @property frictionRelaxation
	     * @type {Number}
	     */
	    this.frictionRelaxation = typeof(options.frictionRelaxation) !== "undefined" ? Number(options.frictionRelaxation)  : Equation.DEFAULT_RELAXATION;
	
	    /**
	     * Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
	     * @property {Number} surfaceVelocity
	     * @default 0
	     */
	    this.surfaceVelocity = typeof(options.surfaceVelocity) !== "undefined" ? Number(options.surfaceVelocity) : 0;
	
	    /**
	     * Offset to be set on ContactEquations. A positive value will make the bodies penetrate more into each other. Can be useful in scenes where contacts need to be more persistent, for example when stacking. Aka "cure for nervous contacts".
	     * @property contactSkinSize
	     * @type {Number}
	     */
	    this.contactSkinSize = 0.005;
	}
	
	ContactMaterial.idCounter = 0;


/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = Material;
	
	/**
	 * Defines a physics material.
	 * @class Material
	 * @constructor
	 * @param {number} id Material identifier
	 * @author schteppe
	 */
	function Material(id){
	    /**
	     * The material identifier
	     * @property id
	     * @type {Number}
	     */
	    this.id = id || Material.idCounter++;
	}
	
	Material.idCounter = 0;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(27)
	,   Equation = __webpack_require__(11)
	,   vec2 = __webpack_require__(8)
	,   Utils = __webpack_require__(9);
	
	module.exports = DistanceConstraint;
	
	/**
	 * Constraint that tries to keep the distance between two bodies constant.
	 *
	 * @class DistanceConstraint
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {object} [options]
	 * @param {number} [options.distance] The distance to keep between the anchor points. Defaults to the current distance between the bodies.
	 * @param {Array} [options.localAnchorA] The anchor point for bodyA, defined locally in bodyA frame. Defaults to [0,0].
	 * @param {Array} [options.localAnchorB] The anchor point for bodyB, defined locally in bodyB frame. Defaults to [0,0].
	 * @param {object} [options.maxForce=Number.MAX_VALUE] Maximum force to apply.
	 * @extends Constraint
	 *
	 * @example
	 *     // If distance is not given as an option, then the current distance between the bodies is used.
	 *     // In this example, the bodies will be constrained to have a distance of 2 between their centers.
	 *     var bodyA = new Body({ mass: 1, position: [-1, 0] });
	 *     var bodyB = new Body({ mass: 1, position: [1, 0] });
	 *     var constraint = new DistanceConstraint(bodyA, bodyB);
	 *     world.addConstraint(constraint);
	 *
	 * @example
	 *     // Manually set the distance and anchors
	 *     var constraint = new DistanceConstraint(bodyA, bodyB, {
	 *         distance: 1,          // Distance to keep between the points
	 *         localAnchorA: [1, 0], // Point on bodyA
	 *         localAnchorB: [-1, 0] // Point on bodyB
	 *     });
	 *     world.addConstraint(constraint);
	 */
	function DistanceConstraint(bodyA,bodyB,options){
	    options = Utils.defaults(options,{
	        localAnchorA:[0,0],
	        localAnchorB:[0,0]
	    });
	
	    Constraint.call(this,bodyA,bodyB,Constraint.DISTANCE,options);
	
	    /**
	     * Local anchor in body A.
	     * @property localAnchorA
	     * @type {Array}
	     */
	    this.localAnchorA = vec2.fromValues(options.localAnchorA[0], options.localAnchorA[1]);
	
	    /**
	     * Local anchor in body B.
	     * @property localAnchorB
	     * @type {Array}
	     */
	    this.localAnchorB = vec2.fromValues(options.localAnchorB[0], options.localAnchorB[1]);
	
	    var localAnchorA = this.localAnchorA;
	    var localAnchorB = this.localAnchorB;
	
	    /**
	     * The distance to keep.
	     * @property distance
	     * @type {Number}
	     */
	    this.distance = 0;
	
	    if(typeof(options.distance) === 'number'){
	        this.distance = options.distance;
	    } else {
	        // Use the current world distance between the world anchor points.
	        var worldAnchorA = vec2.create(),
	            worldAnchorB = vec2.create(),
	            r = vec2.create();
	
	        // Transform local anchors to world
	        vec2.rotate(worldAnchorA, localAnchorA, bodyA.angle);
	        vec2.rotate(worldAnchorB, localAnchorB, bodyB.angle);
	
	        vec2.add(r, bodyB.position, worldAnchorB);
	        vec2.sub(r, r, worldAnchorA);
	        vec2.sub(r, r, bodyA.position);
	
	        this.distance = vec2.length(r);
	    }
	
	    var maxForce;
	    if(typeof(options.maxForce)==="undefined" ){
	        maxForce = Number.MAX_VALUE;
	    } else {
	        maxForce = options.maxForce;
	    }
	
	    var normal = new Equation(bodyA,bodyB,-maxForce,maxForce); // Just in the normal direction
	    this.equations = [ normal ];
	
	    /**
	     * Max force to apply.
	     * @property {number} maxForce
	     */
	    this.maxForce = maxForce;
	
	    // g = (xi - xj).dot(n)
	    // dg/dt = (vi - vj).dot(n) = G*W = [n 0 -n 0] * [vi wi vj wj]'
	
	    // ...and if we were to include offset points:
	    // g =
	    //      (xj + rj - xi - ri).dot(n) - distance
	    //
	    // dg/dt =
	    //      (vj + wj x rj - vi - wi x ri).dot(n) =
	    //      { term 2 is near zero } =
	    //      [-n   -ri x n   n   rj x n] * [vi wi vj wj]' =
	    //      G * W
	    //
	    // => G = [-n -rixn n rjxn]
	
	    var r = vec2.create();
	    var ri = vec2.create(); // worldAnchorA
	    var rj = vec2.create(); // worldAnchorB
	    var that = this;
	    normal.computeGq = function(){
	        var bodyA = this.bodyA,
	            bodyB = this.bodyB,
	            xi = bodyA.position,
	            xj = bodyB.position;
	
	        // Transform local anchors to world
	        vec2.rotate(ri, localAnchorA, bodyA.angle);
	        vec2.rotate(rj, localAnchorB, bodyB.angle);
	
	        vec2.add(r, xj, rj);
	        vec2.sub(r, r, ri);
	        vec2.sub(r, r, xi);
	
	        //vec2.sub(r, bodyB.position, bodyA.position);
	        return vec2.length(r) - that.distance;
	    };
	
	    // Make the contact constraint bilateral
	    this.setMaxForce(maxForce);
	
	    /**
	     * If the upper limit is enabled or not.
	     * @property {Boolean} upperLimitEnabled
	     */
	    this.upperLimitEnabled = false;
	
	    /**
	     * The upper constraint limit.
	     * @property {number} upperLimit
	     */
	    this.upperLimit = 1;
	
	    /**
	     * If the lower limit is enabled or not.
	     * @property {Boolean} lowerLimitEnabled
	     */
	    this.lowerLimitEnabled = false;
	
	    /**
	     * The lower constraint limit.
	     * @property {number} lowerLimit
	     */
	    this.lowerLimit = 0;
	
	    /**
	     * Current constraint position. This is equal to the current distance between the world anchor points.
	     * @property {number} position
	     */
	    this.position = 0;
	}
	DistanceConstraint.prototype = new Constraint();
	DistanceConstraint.prototype.constructor = DistanceConstraint;
	
	/**
	 * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
	 * @method update
	 */
	var n = vec2.create();
	var ri = vec2.create(); // worldAnchorA
	var rj = vec2.create(); // worldAnchorB
	DistanceConstraint.prototype.update = function(){
	    var normal = this.equations[0],
	        bodyA = this.bodyA,
	        bodyB = this.bodyB,
	        distance = this.distance,
	        xi = bodyA.position,
	        xj = bodyB.position,
	        normalEquation = this.equations[0],
	        G = normal.G;
	
	    // Transform local anchors to world
	    vec2.rotate(ri, this.localAnchorA, bodyA.angle);
	    vec2.rotate(rj, this.localAnchorB, bodyB.angle);
	
	    // Get world anchor points and normal
	    vec2.add(n, xj, rj);
	    vec2.sub(n, n, ri);
	    vec2.sub(n, n, xi);
	    this.position = vec2.length(n);
	
	    var violating = false;
	    if(this.upperLimitEnabled){
	        if(this.position > this.upperLimit){
	            normalEquation.maxForce = 0;
	            normalEquation.minForce = -this.maxForce;
	            this.distance = this.upperLimit;
	            violating = true;
	        }
	    }
	
	    if(this.lowerLimitEnabled){
	        if(this.position < this.lowerLimit){
	            normalEquation.maxForce = this.maxForce;
	            normalEquation.minForce = 0;
	            this.distance = this.lowerLimit;
	            violating = true;
	        }
	    }
	
	    if((this.lowerLimitEnabled || this.upperLimitEnabled) && !violating){
	        // No constraint needed.
	        normalEquation.enabled = false;
	        return;
	    }
	
	    normalEquation.enabled = true;
	
	    vec2.normalize(n,n);
	
	    // Caluclate cross products
	    var rixn = vec2.crossLength(ri, n),
	        rjxn = vec2.crossLength(rj, n);
	
	    // G = [-n -rixn n rjxn]
	    G[0] = -n[0];
	    G[1] = -n[1];
	    G[2] = -rixn;
	    G[3] = n[0];
	    G[4] = n[1];
	    G[5] = rjxn;
	};
	
	/**
	 * Set the max force to be used
	 * @method setMaxForce
	 * @param {Number} maxForce
	 */
	DistanceConstraint.prototype.setMaxForce = function(maxForce){
	    var normal = this.equations[0];
	    normal.minForce = -maxForce;
	    normal.maxForce =  maxForce;
	};
	
	/**
	 * Get the max force
	 * @method getMaxForce
	 * @return {Number}
	 */
	DistanceConstraint.prototype.getMaxForce = function(){
	    var normal = this.equations[0];
	    return normal.maxForce;
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8)
	,   Equation = __webpack_require__(11)
	,   Utils = __webpack_require__(9);
	
	module.exports = FrictionEquation;
	
	/**
	 * Constrains the slipping in a contact along a tangent
	 *
	 * @class FrictionEquation
	 * @constructor
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Number} slipForce
	 * @extends Equation
	 */
	function FrictionEquation(bodyA, bodyB, slipForce){
	    Equation.call(this, bodyA, bodyB, -slipForce, slipForce);
	
	    /**
	     * Relative vector from center of body A to the contact point, world oriented.
	     * @property contactPointA
	     * @type {Array}
	     */
	    this.contactPointA = vec2.create();
	
	    /**
	     * Relative vector from center of body B to the contact point, world oriented.
	     * @property contactPointB
	     * @type {Array}
	     */
	    this.contactPointB = vec2.create();
	
	    /**
	     * Tangent vector that the friction force will act along. World oriented.
	     * @property t
	     * @type {Array}
	     */
	    this.t = vec2.create();
	
	    /**
	     * ContactEquations connected to this friction equation. The contact equations can be used to rescale the max force for the friction. If more than one contact equation is given, then the max force can be set to the average.
	     * @property contactEquations
	     * @type {ContactEquation}
	     */
	    this.contactEquations = [];
	
	    /**
	     * The shape in body i that triggered this friction.
	     * @property shapeA
	     * @type {Shape}
	     * @todo Needed? The shape can be looked up via contactEquation.shapeA...
	     */
	    this.shapeA = null;
	
	    /**
	     * The shape in body j that triggered this friction.
	     * @property shapeB
	     * @type {Shape}
	     * @todo Needed? The shape can be looked up via contactEquation.shapeB...
	     */
	    this.shapeB = null;
	
	    /**
	     * The friction coefficient to use.
	     * @property frictionCoefficient
	     * @type {Number}
	     */
	    this.frictionCoefficient = 0.3;
	}
	FrictionEquation.prototype = new Equation();
	FrictionEquation.prototype.constructor = FrictionEquation;
	
	/**
	 * Set the slipping condition for the constraint. The friction force cannot be
	 * larger than this value.
	 * @method setSlipForce
	 * @param  {Number} slipForce
	 */
	FrictionEquation.prototype.setSlipForce = function(slipForce){
	    this.maxForce = slipForce;
	    this.minForce = -slipForce;
	};
	
	/**
	 * Get the max force for the constraint.
	 * @method getSlipForce
	 * @return {Number}
	 */
	FrictionEquation.prototype.getSlipForce = function(){
	    return this.maxForce;
	};
	
	FrictionEquation.prototype.computeB = function(a,b,h){
	    var bi = this.bodyA,
	        bj = this.bodyB,
	        ri = this.contactPointA,
	        rj = this.contactPointB,
	        t = this.t,
	        G = this.G;
	
	    // G = [-t -rixt t rjxt]
	    // And remember, this is a pure velocity constraint, g is always zero!
	    G[0] = -t[0];
	    G[1] = -t[1];
	    G[2] = -vec2.crossLength(ri,t);
	    G[3] = t[0];
	    G[4] = t[1];
	    G[5] = vec2.crossLength(rj,t);
	
	    var GW = this.computeGW(),
	        GiMf = this.computeGiMf();
	
	    var B = /* - g * a  */ - GW * b - h*GiMf;
	
	    return B;
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var FrictionEquation = __webpack_require__(34);
	var Pool = __webpack_require__(30);
	
	module.exports = FrictionEquationPool;
	
	/**
	 * @class
	 */
	function FrictionEquationPool() {
		Pool.apply(this, arguments);
	}
	FrictionEquationPool.prototype = new Pool();
	FrictionEquationPool.prototype.constructor = FrictionEquationPool;
	
	/**
	 * @method create
	 * @return {FrictionEquation}
	 */
	FrictionEquationPool.prototype.create = function () {
		return new FrictionEquation();
	};
	
	/**
	 * @method destroy
	 * @param {FrictionEquation} equation
	 * @return {FrictionEquationPool}
	 */
	FrictionEquationPool.prototype.destroy = function (equation) {
		equation.bodyA = equation.bodyB = null;
		return this;
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(27)
	,   Equation = __webpack_require__(11)
	,   AngleLockEquation = __webpack_require__(10)
	,   vec2 = __webpack_require__(8);
	
	module.exports = GearConstraint;
	
	/**
	 * Constrains the angle of two bodies to each other to be equal. If a gear ratio is not one, the angle of bodyA must be a multiple of the angle of bodyB.
	 * @class GearConstraint
	 * @constructor
	 * @author schteppe
	 * @param {Body}            bodyA
	 * @param {Body}            bodyB
	 * @param {Object}          [options]
	 * @param {Number}          [options.angle=0] Relative angle between the bodies. Will be set to the current angle between the bodies (the gear ratio is accounted for).
	 * @param {Number}          [options.ratio=1] Gear ratio.
	 * @param {Number}          [options.maxTorque] Maximum torque to apply.
	 * @extends Constraint
	 *
	 * @example
	 *     var constraint = new GearConstraint(bodyA, bodyB);
	 *     world.addConstraint(constraint);
	 *
	 * @example
	 *     var constraint = new GearConstraint(bodyA, bodyB, {
	 *         ratio: 2,
	 *         maxTorque: 1000
	 *     });
	 *     world.addConstraint(constraint);
	 */
	function GearConstraint(bodyA, bodyB, options){
	    options = options || {};
	
	    Constraint.call(this, bodyA, bodyB, Constraint.GEAR, options);
	
	    /**
	     * The gear ratio.
	     * @property ratio
	     * @type {Number}
	     */
	    this.ratio = options.ratio !== undefined ? options.ratio : 1;
	
	    /**
	     * The relative angle
	     * @property angle
	     * @type {Number}
	     */
	    this.angle = options.angle !== undefined ? options.angle : bodyB.angle - this.ratio * bodyA.angle;
	
	    // Send same parameters to the equation
	    options.angle = this.angle;
	    options.ratio = this.ratio;
	
	    this.equations = [
	        new AngleLockEquation(bodyA,bodyB,options),
	    ];
	
	    // Set max torque
	    if(options.maxTorque !== undefined){
	        this.setMaxTorque(options.maxTorque);
	    }
	}
	GearConstraint.prototype = new Constraint();
	GearConstraint.prototype.constructor = GearConstraint;
	
	GearConstraint.prototype.update = function(){
	    var eq = this.equations[0];
	    if(eq.ratio !== this.ratio){
	        eq.setRatio(this.ratio);
	    }
	    eq.angle = this.angle;
	};
	
	/**
	 * Set the max torque for the constraint.
	 * @method setMaxTorque
	 * @param {Number} torque
	 */
	GearConstraint.prototype.setMaxTorque = function(torque){
	    this.equations[0].setMaxTorque(torque);
	};
	
	/**
	 * Get the max torque for the constraint.
	 * @method getMaxTorque
	 * @return {Number}
	 */
	GearConstraint.prototype.getMaxTorque = function(torque){
	    return this.equations[0].maxForce;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8)
	,   Solver = __webpack_require__(38)
	,   Utils = __webpack_require__(9)
	,   FrictionEquation = __webpack_require__(34);
	
	module.exports = GSSolver;
	
	/**
	 * Iterative Gauss-Seidel constraint equation solver.
	 *
	 * @class GSSolver
	 * @constructor
	 * @extends Solver
	 * @param {Object} [options]
	 * @param {Number} [options.iterations=10]
	 * @param {Number} [options.tolerance=0]
	 */
	function GSSolver(options){
	    Solver.call(this,options,Solver.GS);
	    options = options || {};
	
	    /**
	     * The max number of iterations to do when solving. More gives better results, but is more expensive.
	     * @property iterations
	     * @type {Number}
	     */
	    this.iterations = options.iterations || 10;
	
	    /**
	     * The error tolerance, per constraint. If the total error is below this limit, the solver will stop iterating. Set to zero for as good solution as possible, but to something larger than zero to make computations faster.
	     * @property tolerance
	     * @type {Number}
	     * @default 1e-7
	     */
	    this.tolerance = options.tolerance || 1e-7;
	
	    this.arrayStep = 30;
	    this.lambda = new Utils.ARRAY_TYPE(this.arrayStep);
	    this.Bs =     new Utils.ARRAY_TYPE(this.arrayStep);
	    this.invCs =  new Utils.ARRAY_TYPE(this.arrayStep);
	
	    /**
	     * Set to true to set all right hand side terms to zero when solving. Can be handy for a few applications.
	     * @property useZeroRHS
	     * @type {Boolean}
	     * @todo Remove, not used
	     */
	    this.useZeroRHS = false;
	
	    /**
	     * Number of solver iterations that are used to approximate normal forces used for friction (F_friction = mu * F_normal). These friction forces will override any other friction forces that are set. If you set frictionIterations = 0, then this feature will be disabled.
	     *
	     * Use only frictionIterations > 0 if the approximated normal force (F_normal = mass * gravity) is not good enough. Examples of where it can happen is in space games where gravity is zero, or in tall stacks where the normal force is large at bottom but small at top.
	     *
	     * @property frictionIterations
	     * @type {Number}
	     * @default 0
	     */
	    this.frictionIterations = options.frictionIterations !== undefined ? 0 : options.frictionIterations;
	
	    /**
	     * The number of iterations that were made during the last solve. If .tolerance is zero, this value will always be equal to .iterations, but if .tolerance is larger than zero, and the solver can quit early, then this number will be somewhere between 1 and .iterations.
	     * @property {Number} usedIterations
	     */
	    this.usedIterations = 0;
	}
	GSSolver.prototype = new Solver();
	GSSolver.prototype.constructor = GSSolver;
	
	function setArrayZero(array){
	    var l = array.length;
	    while(l--){
	        array[l] = +0.0;
	    }
	}
	
	/**
	 * Solve the system of equations
	 * @method solve
	 * @param  {Number}  h       Time step
	 * @param  {World}   world    World to solve
	 */
	GSSolver.prototype.solve = function(h, world){
	
	    this.sortEquations();
	
	    var iter = 0,
	        maxIter = this.iterations,
	        maxFrictionIter = this.frictionIterations,
	        equations = this.equations,
	        Neq = equations.length,
	        tolSquared = Math.pow(this.tolerance*Neq, 2),
	        bodies = world.bodies,
	        Nbodies = world.bodies.length,
	        add = vec2.add,
	        set = vec2.set,
	        useZeroRHS = this.useZeroRHS,
	        lambda = this.lambda;
	
	    this.usedIterations = 0;
	
	    if(Neq){
	        for(var i=0; i!==Nbodies; i++){
	            var b = bodies[i];
	
	            // Update solve mass
	            b.updateSolveMassProperties();
	        }
	    }
	
	    // Things that does not change during iteration can be computed once
	    if(lambda.length < Neq){
	        lambda = this.lambda =  new Utils.ARRAY_TYPE(Neq + this.arrayStep);
	        this.Bs =               new Utils.ARRAY_TYPE(Neq + this.arrayStep);
	        this.invCs =            new Utils.ARRAY_TYPE(Neq + this.arrayStep);
	    }
	    setArrayZero(lambda);
	    var invCs = this.invCs,
	        Bs = this.Bs,
	        lambda = this.lambda;
	
	    for(var i=0; i!==equations.length; i++){
	        var c = equations[i];
	        if(c.timeStep !== h || c.needsUpdate){
	            c.timeStep = h;
	            c.update();
	        }
	        Bs[i] =     c.computeB(c.a,c.b,h);
	        invCs[i] =  c.computeInvC(c.epsilon);
	    }
	
	    var q, B, c, deltalambdaTot,i,j;
	
	    if(Neq !== 0){
	
	        for(i=0; i!==Nbodies; i++){
	            var b = bodies[i];
	
	            // Reset vlambda
	            b.resetConstraintVelocity();
	        }
	
	        if(maxFrictionIter){
	            // Iterate over contact equations to get normal forces
	            for(iter=0; iter!==maxFrictionIter; iter++){
	
	                // Accumulate the total error for each iteration.
	                deltalambdaTot = 0.0;
	
	                for(j=0; j!==Neq; j++){
	                    c = equations[j];
	
	                    var deltalambda = GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);
	                    deltalambdaTot += Math.abs(deltalambda);
	                }
	
	                this.usedIterations++;
	
	                // If the total error is small enough - stop iterate
	                if(deltalambdaTot*deltalambdaTot <= tolSquared){
	                    break;
	                }
	            }
	
	            GSSolver.updateMultipliers(equations, lambda, 1/h);
	
	            // Set computed friction force
	            for(j=0; j!==Neq; j++){
	                var eq = equations[j];
	                if(eq instanceof FrictionEquation){
	                    var f = 0.0;
	                    for(var k=0; k!==eq.contactEquations.length; k++){
	                        f += eq.contactEquations[k].multiplier;
	                    }
	                    f *= eq.frictionCoefficient / eq.contactEquations.length;
	                    eq.maxForce =  f;
	                    eq.minForce = -f;
	                }
	            }
	        }
	
	        // Iterate over all equations
	        for(iter=0; iter!==maxIter; iter++){
	
	            // Accumulate the total error for each iteration.
	            deltalambdaTot = 0.0;
	
	            for(j=0; j!==Neq; j++){
	                c = equations[j];
	
	                var deltalambda = GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);
	                deltalambdaTot += Math.abs(deltalambda);
	            }
	
	            this.usedIterations++;
	
	            // If the total error is small enough - stop iterate
	            if(deltalambdaTot*deltalambdaTot <= tolSquared){
	                break;
	            }
	        }
	
	        // Add result to velocity
	        for(i=0; i!==Nbodies; i++){
	            bodies[i].addConstraintVelocity();
	        }
	
	        GSSolver.updateMultipliers(equations, lambda, 1/h);
	    }
	};
	
	// Sets the .multiplier property of each equation
	GSSolver.updateMultipliers = function(equations, lambda, invDt){
	    // Set the .multiplier property of each equation
	    var l = equations.length;
	    while(l--){
	        equations[l].multiplier = lambda[l] * invDt;
	    }
	};
	
	GSSolver.iterateEquation = function(j,eq,eps,Bs,invCs,lambda,useZeroRHS,dt,iter){
	    // Compute iteration
	    var B = Bs[j],
	        invC = invCs[j],
	        lambdaj = lambda[j],
	        GWlambda = eq.computeGWlambda();
	
	    var maxForce = eq.maxForce,
	        minForce = eq.minForce;
	
	    if(useZeroRHS){
	        B = 0;
	    }
	
	    var deltalambda = invC * ( B - GWlambda - eps * lambdaj );
	
	    // Clamp if we are not within the min/max interval
	    var lambdaj_plus_deltalambda = lambdaj + deltalambda;
	    if(lambdaj_plus_deltalambda < minForce*dt){
	        deltalambda = minForce*dt - lambdaj;
	    } else if(lambdaj_plus_deltalambda > maxForce*dt){
	        deltalambda = maxForce*dt - lambdaj;
	    }
	    lambda[j] += deltalambda;
	    eq.addToWlambda(deltalambda);
	
	    return deltalambda;
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(9)
	,   EventEmitter = __webpack_require__(23);
	
	module.exports = Solver;
	
	/**
	 * Base class for constraint solvers.
	 * @class Solver
	 * @constructor
	 * @extends EventEmitter
	 */
	function Solver(options,type){
	    options = options || {};
	
	    EventEmitter.call(this);
	
	    this.type = type;
	
	    /**
	     * Current equations in the solver.
	     *
	     * @property equations
	     * @type {Array}
	     */
	    this.equations = [];
	
	    /**
	     * Function that is used to sort all equations before each solve.
	     * @property equationSortFunction
	     * @type {function|boolean}
	     */
	    this.equationSortFunction = options.equationSortFunction || false;
	}
	Solver.prototype = new EventEmitter();
	Solver.prototype.constructor = Solver;
	
	/**
	 * Method to be implemented in each subclass
	 * @method solve
	 * @param  {Number} dt
	 * @param  {World} world
	 */
	Solver.prototype.solve = function(dt,world){
	    throw new Error("Solver.solve should be implemented by subclasses!");
	};
	
	var mockWorld = {bodies:[]};
	
	/**
	 * Solves all constraints in an island.
	 * @method solveIsland
	 * @param  {Number} dt
	 * @param  {Island} island
	 */
	Solver.prototype.solveIsland = function(dt,island){
	
	    this.removeAllEquations();
	
	    if(island.equations.length){
	        // Add equations to solver
	        this.addEquations(island.equations);
	        mockWorld.bodies.length = 0;
	        island.getBodies(mockWorld.bodies);
	
	        // Solve
	        if(mockWorld.bodies.length){
	            this.solve(dt,mockWorld);
	        }
	    }
	};
	
	/**
	 * Sort all equations using the .equationSortFunction. Should be called by subclasses before solving.
	 * @method sortEquations
	 */
	Solver.prototype.sortEquations = function(){
	    if(this.equationSortFunction){
	        this.equations.sort(this.equationSortFunction);
	    }
	};
	
	/**
	 * Add an equation to be solved.
	 *
	 * @method addEquation
	 * @param {Equation} eq
	 */
	Solver.prototype.addEquation = function(eq){
	    if(eq.enabled){
	        this.equations.push(eq);
	    }
	};
	
	/**
	 * Add equations. Same as .addEquation, but this time the argument is an array of Equations
	 *
	 * @method addEquations
	 * @param {Array} eqs
	 */
	Solver.prototype.addEquations = function(eqs){
	    //Utils.appendArray(this.equations,eqs);
	    for(var i=0, N=eqs.length; i!==N; i++){
	        var eq = eqs[i];
	        if(eq.enabled){
	            this.equations.push(eq);
	        }
	    }
	};
	
	/**
	 * Remove an equation.
	 *
	 * @method removeEquation
	 * @param {Equation} eq
	 */
	Solver.prototype.removeEquation = function(eq){
	    var i = this.equations.indexOf(eq);
	    if(i !== -1){
	        this.equations.splice(i,1);
	    }
	};
	
	/**
	 * Remove all currently added equations.
	 *
	 * @method removeAllEquations
	 */
	Solver.prototype.removeAllEquations = function(){
	    this.equations.length=0;
	};
	
	Solver.GS = 1;
	Solver.ISLAND = 2;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(19)
	,    vec2 = __webpack_require__(8)
	,    Utils = __webpack_require__(9);
	
	module.exports = Heightfield;
	
	/**
	 * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a distance "elementWidth".
	 * @class Heightfield
	 * @extends Shape
	 * @constructor
	 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
	 * @param {array} [options.heights] An array of Y values that will be used to construct the terrain.
	 * @param {Number} [options.minValue] Minimum value of the data points in the data array. Will be computed automatically if not given.
	 * @param {Number} [options.maxValue] Maximum value.
	 * @param {Number} [options.elementWidth=0.1] World spacing between the data points in X direction.
	 *
	 * @example
	 *     // Generate some height data (y-values).
	 *     var heights = [];
	 *     for(var i = 0; i < 1000; i++){
	 *         var y = 0.5 * Math.cos(0.2 * i);
	 *         heights.push(y);
	 *     }
	 *
	 *     // Create the heightfield shape
	 *     var heightfieldShape = new Heightfield({
	 *         heights: heights,
	 *         elementWidth: 1 // Distance between the data points in X direction
	 *     });
	 *     var heightfieldBody = new Body();
	 *     heightfieldBody.addShape(heightfieldShape);
	 *     world.addBody(heightfieldBody);
	 *
	 * @todo Should use a scale property with X and Y direction instead of just elementWidth
	 */
	function Heightfield(options){
	    if(Array.isArray(arguments[0])){
	        options = {
	            heights: arguments[0]
	        };
	
	        if(typeof(arguments[1]) === 'object'){
	            for(var key in arguments[1]){
	                options[key] = arguments[1][key];
	            }
	        }
	
	        console.warn('The Heightfield constructor signature has changed. Please use the following format: new Heightfield({ heights: [...], ... })');
	    }
	    options = options || {};
	
	    /**
	     * An array of numbers, or height values, that are spread out along the x axis.
	     * @property {array} heights
	     */
	    this.heights = options.heights ? options.heights.slice(0) : [];
	
	    /**
	     * Max value of the heights
	     * @property {number} maxValue
	     */
	    this.maxValue = options.maxValue || null;
	
	    /**
	     * Max value of the heights
	     * @property {number} minValue
	     */
	    this.minValue = options.minValue || null;
	
	    /**
	     * The width of each element
	     * @property {number} elementWidth
	     */
	    this.elementWidth = options.elementWidth || 0.1;
	
	    if(options.maxValue === undefined || options.minValue === undefined){
	        this.updateMaxMinValues();
	    }
	
	    options.type = Shape.HEIGHTFIELD;
	    Shape.call(this, options);
	}
	Heightfield.prototype = new Shape();
	Heightfield.prototype.constructor = Heightfield;
	
	/**
	 * Update the .minValue and the .maxValue
	 * @method updateMaxMinValues
	 */
	Heightfield.prototype.updateMaxMinValues = function(){
	    var data = this.heights;
	    var maxValue = data[0];
	    var minValue = data[0];
	    for(var i=0; i !== data.length; i++){
	        var v = data[i];
	        if(v > maxValue){
	            maxValue = v;
	        }
	        if(v < minValue){
	            minValue = v;
	        }
	    }
	    this.maxValue = maxValue;
	    this.minValue = minValue;
	};
	
	/**
	 * @method computeMomentOfInertia
	 * @param  {Number} mass
	 * @return {Number}
	 */
	Heightfield.prototype.computeMomentOfInertia = function(mass){
	    return Number.MAX_VALUE;
	};
	
	Heightfield.prototype.updateBoundingRadius = function(){
	    this.boundingRadius = Number.MAX_VALUE;
	};
	
	Heightfield.prototype.updateArea = function(){
	    var data = this.heights,
	        area = 0;
	    for(var i=0; i<data.length-1; i++){
	        area += (data[i]+data[i+1]) / 2 * this.elementWidth;
	    }
	    this.area = area;
	};
	
	var points = [
	    vec2.create(),
	    vec2.create(),
	    vec2.create(),
	    vec2.create()
	];
	
	/**
	 * @method computeAABB
	 * @param  {AABB}   out      The resulting AABB.
	 * @param  {Array}  position
	 * @param  {Number} angle
	 */
	Heightfield.prototype.computeAABB = function(out, position, angle){
	    vec2.set(points[0], 0, this.maxValue);
	    vec2.set(points[1], this.elementWidth * this.heights.length, this.maxValue);
	    vec2.set(points[2], this.elementWidth * this.heights.length, this.minValue);
	    vec2.set(points[3], 0, this.minValue);
	    out.setFromPoints(points, position, angle);
	};
	
	/**
	 * Get a line segment in the heightfield
	 * @method getLineSegment
	 * @param  {array} start Where to store the resulting start point
	 * @param  {array} end Where to store the resulting end point
	 * @param  {number} i
	 */
	Heightfield.prototype.getLineSegment = function(start, end, i){
	    var data = this.heights;
	    var width = this.elementWidth;
	    vec2.set(start, i * width, data[i]);
	    vec2.set(end, (i + 1) * width, data[i + 1]);
	};
	
	Heightfield.prototype.getSegmentIndex = function(position){
	    return Math.floor(position[0] / this.elementWidth);
	};
	
	Heightfield.prototype.getClampedSegmentIndex = function(position){
	    var i = this.getSegmentIndex(position);
	    i = Math.min(this.heights.length, Math.max(i, 0)); // clamp
	    return i;
	};
	
	var intersectHeightfield_hitPointWorld = vec2.create();
	var intersectHeightfield_worldNormal = vec2.create();
	var intersectHeightfield_l0 = vec2.create();
	var intersectHeightfield_l1 = vec2.create();
	var intersectHeightfield_localFrom = vec2.create();
	var intersectHeightfield_localTo = vec2.create();
	var intersectHeightfield_unit_y = vec2.fromValues(0,1);
	
	// Returns 1 if the lines intersect, otherwise 0.
	function getLineSegmentsIntersection (out, p0, p1, p2, p3) {
	
	    var s1_x, s1_y, s2_x, s2_y;
	    s1_x = p1[0] - p0[0];
	    s1_y = p1[1] - p0[1];
	    s2_x = p3[0] - p2[0];
	    s2_y = p3[1] - p2[1];
	
	    var s, t;
	    s = (-s1_y * (p0[0] - p2[0]) + s1_x * (p0[1] - p2[1])) / (-s2_x * s1_y + s1_x * s2_y);
	    t = ( s2_x * (p0[1] - p2[1]) - s2_y * (p0[0] - p2[0])) / (-s2_x * s1_y + s1_x * s2_y);
	    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { // Collision detected
	        var intX = p0[0] + (t * s1_x);
	        var intY = p0[1] + (t * s1_y);
	        out[0] = intX;
	        out[1] = intY;
	        return t;
	    }
	    return -1; // No collision
	}
	
	/**
	 * @method raycast
	 * @param  {RayResult} result
	 * @param  {Ray} ray
	 * @param  {array} position
	 * @param  {number} angle
	 */
	Heightfield.prototype.raycast = function(result, ray, position, angle){
	    var from = ray.from;
	    var to = ray.to;
	    var direction = ray.direction;
	
	    var hitPointWorld = intersectHeightfield_hitPointWorld;
	    var worldNormal = intersectHeightfield_worldNormal;
	    var l0 = intersectHeightfield_l0;
	    var l1 = intersectHeightfield_l1;
	    var localFrom = intersectHeightfield_localFrom;
	    var localTo = intersectHeightfield_localTo;
	
	    // get local ray start and end
	    vec2.toLocalFrame(localFrom, from, position, angle);
	    vec2.toLocalFrame(localTo, to, position, angle);
	
	    // Get the segment range
	    var i0 = this.getClampedSegmentIndex(localFrom);
	    var i1 = this.getClampedSegmentIndex(localTo);
	    if(i0 > i1){
	        var tmp = i0;
	        i0 = i1;
	        i1 = tmp;
	    }
	
	    // The segments
	    for(var i=0; i<this.heights.length - 1; i++){
	        this.getLineSegment(l0, l1, i);
	        var t = vec2.getLineSegmentsIntersectionFraction(localFrom, localTo, l0, l1);
	        if(t >= 0){
	            vec2.sub(worldNormal, l1, l0);
	            vec2.rotate(worldNormal, worldNormal, angle + Math.PI / 2);
	            vec2.normalize(worldNormal, worldNormal);
	            ray.reportIntersection(result, t, worldNormal, -1);
	            if(result.shouldStop(ray)){
	                return;
	            }
	        }
	    }
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(19)
	,   vec2 = __webpack_require__(8);
	
	module.exports = Line;
	
	/**
	 * Line shape class. The line shape is along the x direction, and stretches from [-length/2, 0] to [length/2,0].
	 * @class Line
	 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
	 * @param {Number} [options.length=1] The total length of the line
	 * @extends Shape
	 * @constructor
	 */
	function Line(options){
	    if(typeof(arguments[0]) === 'number'){
	        options = {
	            length: arguments[0]
	        };
	        console.warn('The Line constructor signature has changed. Please use the following format: new Line({ length: 1, ... })');
	    }
	    options = options || {};
	
	    /**
	     * Length of this line
	     * @property {Number} length
	     * @default 1
	     */
	    this.length = options.length || 1;
	
	    options.type = Shape.LINE;
	    Shape.call(this, options);
	}
	Line.prototype = new Shape();
	Line.prototype.constructor = Line;
	
	Line.prototype.computeMomentOfInertia = function(mass){
	    return mass * Math.pow(this.length,2) / 12;
	};
	
	Line.prototype.updateBoundingRadius = function(){
	    this.boundingRadius = this.length/2;
	};
	
	var points = [vec2.create(),vec2.create()];
	
	/**
	 * @method computeAABB
	 * @param  {AABB}   out      The resulting AABB.
	 * @param  {Array}  position
	 * @param  {Number} angle
	 */
	Line.prototype.computeAABB = function(out, position, angle){
	    var l2 = this.length / 2;
	    vec2.set(points[0], -l2,  0);
	    vec2.set(points[1],  l2,  0);
	    out.setFromPoints(points,position,angle,0);
	};
	
	var raycast_hitPoint = vec2.create();
	var raycast_normal = vec2.create();
	var raycast_l0 = vec2.create();
	var raycast_l1 = vec2.create();
	var raycast_unit_y = vec2.fromValues(0,1);
	
	/**
	 * @method raycast
	 * @param  {RaycastResult} result
	 * @param  {Ray} ray
	 * @param  {number} angle
	 * @param  {array} position
	 */
	Line.prototype.raycast = function(result, ray, position, angle){
	    var from = ray.from;
	    var to = ray.to;
	
	    var l0 = raycast_l0;
	    var l1 = raycast_l1;
	
	    // get start and end of the line
	    var halfLen = this.length / 2;
	    vec2.set(l0, -halfLen, 0);
	    vec2.set(l1, halfLen, 0);
	    vec2.toGlobalFrame(l0, l0, position, angle);
	    vec2.toGlobalFrame(l1, l1, position, angle);
	
	    var fraction = vec2.getLineSegmentsIntersectionFraction(l0, l1, from, to);
	    if(fraction >= 0){
	        var normal = raycast_normal;
	        vec2.rotate(normal, raycast_unit_y, angle); // todo: this should depend on which side the ray comes from
	        ray.reportIntersection(result, fraction, normal, -1);
	    }
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(27)
	,   vec2 = __webpack_require__(8)
	,   Equation = __webpack_require__(11);
	
	module.exports = LockConstraint;
	
	/**
	 * Locks the relative position and rotation between two bodies.
	 *
	 * @class LockConstraint
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Object} [options]
	 * @param {Array}  [options.localOffsetB] The offset of bodyB in bodyA's frame. If not given the offset is computed from current positions.
	 * @param {number} [options.localAngleB] The angle of bodyB in bodyA's frame. If not given, the angle is computed from current angles.
	 * @param {number} [options.maxForce]
	 * @extends Constraint
	 *
	 * @example
	 *     // Locks the relative position and rotation between bodyA and bodyB
	 *     var constraint = new LockConstraint(bodyA, bodyB);
	 *     world.addConstraint(constraint);
	 */
	function LockConstraint(bodyA, bodyB, options){
	    options = options || {};
	
	    Constraint.call(this,bodyA,bodyB,Constraint.LOCK,options);
	
	    var maxForce = ( typeof(options.maxForce)==="undefined" ? Number.MAX_VALUE : options.maxForce );
	
	    var localAngleB = options.localAngleB || 0;
	
	    // Use 3 equations:
	    // gx =   (xj - xi - l) * xhat = 0
	    // gy =   (xj - xi - l) * yhat = 0
	    // gr =   (xi - xj + r) * that = 0
	    //
	    // ...where:
	    //   l is the localOffsetB vector rotated to world in bodyA frame
	    //   r is the same vector but reversed and rotated from bodyB frame
	    //   xhat, yhat are world axis vectors
	    //   that is the tangent of r
	    //
	    // For the first two constraints, we get
	    // G*W = (vj - vi - ldot  ) * xhat
	    //     = (vj - vi - wi x l) * xhat
	    //
	    // Since (wi x l) * xhat = (l x xhat) * wi, we get
	    // G*W = [ -1   0   (-l x xhat)  1   0   0] * [vi wi vj wj]
	    //
	    // The last constraint gives
	    // GW = (vi - vj + wj x r) * that
	    //    = [  that   0  -that  (r x t) ]
	
	    var x =     new Equation(bodyA,bodyB,-maxForce,maxForce),
	        y =     new Equation(bodyA,bodyB,-maxForce,maxForce),
	        rot =   new Equation(bodyA,bodyB,-maxForce,maxForce);
	
	    var l = vec2.create(),
	        g = vec2.create(),
	        that = this;
	    x.computeGq = function(){
	        vec2.rotate(l, that.localOffsetB, bodyA.angle);
	        vec2.sub(g, bodyB.position, bodyA.position);
	        vec2.sub(g, g, l);
	        return g[0];
	    };
	    y.computeGq = function(){
	        vec2.rotate(l, that.localOffsetB, bodyA.angle);
	        vec2.sub(g, bodyB.position, bodyA.position);
	        vec2.sub(g, g, l);
	        return g[1];
	    };
	    var r = vec2.create(),
	        t = vec2.create();
	    rot.computeGq = function(){
	        vec2.rotate(r, that.localOffsetB, bodyB.angle - that.localAngleB);
	        vec2.scale(r,r,-1);
	        vec2.sub(g,bodyA.position,bodyB.position);
	        vec2.add(g,g,r);
	        vec2.rotate(t,r,-Math.PI/2);
	        vec2.normalize(t,t);
	        return vec2.dot(g,t);
	    };
	
	    /**
	     * The offset of bodyB in bodyA's frame.
	     * @property {Array} localOffsetB
	     */
	    this.localOffsetB = vec2.create();
	    if(options.localOffsetB){
	        vec2.copy(this.localOffsetB, options.localOffsetB);
	    } else {
	        // Construct from current positions
	        vec2.sub(this.localOffsetB, bodyB.position, bodyA.position);
	        vec2.rotate(this.localOffsetB, this.localOffsetB, -bodyA.angle);
	    }
	
	    /**
	     * The offset angle of bodyB in bodyA's frame.
	     * @property {Number} localAngleB
	     */
	    this.localAngleB = 0;
	    if(typeof(options.localAngleB) === 'number'){
	        this.localAngleB = options.localAngleB;
	    } else {
	        // Construct
	        this.localAngleB = bodyB.angle - bodyA.angle;
	    }
	
	    this.equations.push(x, y, rot);
	    this.setMaxForce(maxForce);
	}
	LockConstraint.prototype = new Constraint();
	LockConstraint.prototype.constructor = LockConstraint;
	
	/**
	 * Set the maximum force to be applied.
	 * @method setMaxForce
	 * @param {Number} force
	 */
	LockConstraint.prototype.setMaxForce = function(force){
	    var eqs = this.equations;
	    for(var i=0; i<this.equations.length; i++){
	        eqs[i].maxForce =  force;
	        eqs[i].minForce = -force;
	    }
	};
	
	/**
	 * Get the max force.
	 * @method getMaxForce
	 * @return {Number}
	 */
	LockConstraint.prototype.getMaxForce = function(){
	    return this.equations[0].maxForce;
	};
	
	var l = vec2.create();
	var r = vec2.create();
	var t = vec2.create();
	var xAxis = vec2.fromValues(1,0);
	var yAxis = vec2.fromValues(0,1);
	LockConstraint.prototype.update = function(){
	    var x =   this.equations[0],
	        y =   this.equations[1],
	        rot = this.equations[2],
	        bodyA = this.bodyA,
	        bodyB = this.bodyB;
	
	    vec2.rotate(l,this.localOffsetB,bodyA.angle);
	    vec2.rotate(r,this.localOffsetB,bodyB.angle - this.localAngleB);
	    vec2.scale(r,r,-1);
	
	    vec2.rotate(t,r,Math.PI/2);
	    vec2.normalize(t,t);
	
	    x.G[0] = -1;
	    x.G[1] =  0;
	    x.G[2] = -vec2.crossLength(l,xAxis);
	    x.G[3] =  1;
	
	    y.G[0] =  0;
	    y.G[1] = -1;
	    y.G[2] = -vec2.crossLength(l,yAxis);
	    y.G[4] =  1;
	
	    rot.G[0] =  -t[0];
	    rot.G[1] =  -t[1];
	    rot.G[3] =  t[0];
	    rot.G[4] =  t[1];
	    rot.G[5] =  vec2.crossLength(r,t);
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8)
	,   sub = vec2.sub
	,   add = vec2.add
	,   dot = vec2.dot
	,   Utils = __webpack_require__(9)
	,   ContactEquationPool = __webpack_require__(29)
	,   FrictionEquationPool = __webpack_require__(35)
	,   TupleDictionary = __webpack_require__(43)
	,   Equation = __webpack_require__(11)
	,   ContactEquation = __webpack_require__(28)
	,   FrictionEquation = __webpack_require__(34)
	,   Circle = __webpack_require__(26)
	,   Convex = __webpack_require__(18)
	,   Shape = __webpack_require__(19)
	,   Body = __webpack_require__(12)
	,   Box = __webpack_require__(44);
	
	module.exports = Narrowphase;
	
	// Temp things
	var yAxis = vec2.fromValues(0,1);
	
	var tmp1 = vec2.fromValues(0,0)
	,   tmp2 = vec2.fromValues(0,0)
	,   tmp3 = vec2.fromValues(0,0)
	,   tmp4 = vec2.fromValues(0,0)
	,   tmp5 = vec2.fromValues(0,0)
	,   tmp6 = vec2.fromValues(0,0)
	,   tmp7 = vec2.fromValues(0,0)
	,   tmp8 = vec2.fromValues(0,0)
	,   tmp9 = vec2.fromValues(0,0)
	,   tmp10 = vec2.fromValues(0,0)
	,   tmp11 = vec2.fromValues(0,0)
	,   tmp12 = vec2.fromValues(0,0)
	,   tmp13 = vec2.fromValues(0,0)
	,   tmp14 = vec2.fromValues(0,0)
	,   tmp15 = vec2.fromValues(0,0)
	,   tmp16 = vec2.fromValues(0,0)
	,   tmp17 = vec2.fromValues(0,0)
	,   tmp18 = vec2.fromValues(0,0)
	,   tmpArray = [];
	
	/**
	 * Narrowphase. Creates contacts and friction given shapes and transforms.
	 * @class Narrowphase
	 * @constructor
	 */
	function Narrowphase(){
	
	    /**
	     * @property contactEquations
	     * @type {Array}
	     */
	    this.contactEquations = [];
	
	    /**
	     * @property frictionEquations
	     * @type {Array}
	     */
	    this.frictionEquations = [];
	
	    /**
	     * Whether to make friction equations in the upcoming contacts.
	     * @property enableFriction
	     * @type {Boolean}
	     */
	    this.enableFriction = true;
	
	    /**
	     * Whether to make equations enabled in upcoming contacts.
	     * @property enabledEquations
	     * @type {Boolean}
	     */
	    this.enabledEquations = true;
	
	    /**
	     * The friction slip force to use when creating friction equations.
	     * @property slipForce
	     * @type {Number}
	     */
	    this.slipForce = 10.0;
	
	    /**
	     * The friction value to use in the upcoming friction equations.
	     * @property frictionCoefficient
	     * @type {Number}
	     */
	    this.frictionCoefficient = 0.3;
	
	    /**
	     * Will be the .relativeVelocity in each produced FrictionEquation.
	     * @property {Number} surfaceVelocity
	     */
	    this.surfaceVelocity = 0;
	
	    /**
	     * Keeps track of the allocated ContactEquations.
	     * @property {ContactEquationPool} contactEquationPool
	     *
	     * @example
	     *
	     *     // Allocate a few equations before starting the simulation.
	     *     // This way, no contact objects need to be created on the fly in the game loop.
	     *     world.narrowphase.contactEquationPool.resize(1024);
	     *     world.narrowphase.frictionEquationPool.resize(1024);
	     */
	    this.contactEquationPool = new ContactEquationPool({ size: 32 });
	
	    /**
	     * Keeps track of the allocated ContactEquations.
	     * @property {FrictionEquationPool} frictionEquationPool
	     */
	    this.frictionEquationPool = new FrictionEquationPool({ size: 64 });
	
	    /**
	     * The restitution value to use in the next contact equations.
	     * @property restitution
	     * @type {Number}
	     */
	    this.restitution = 0;
	
	    /**
	     * The stiffness value to use in the next contact equations.
	     * @property {Number} stiffness
	     */
	    this.stiffness = Equation.DEFAULT_STIFFNESS;
	
	    /**
	     * The stiffness value to use in the next contact equations.
	     * @property {Number} stiffness
	     */
	    this.relaxation = Equation.DEFAULT_RELAXATION;
	
	    /**
	     * The stiffness value to use in the next friction equations.
	     * @property frictionStiffness
	     * @type {Number}
	     */
	    this.frictionStiffness = Equation.DEFAULT_STIFFNESS;
	
	    /**
	     * The relaxation value to use in the next friction equations.
	     * @property frictionRelaxation
	     * @type {Number}
	     */
	    this.frictionRelaxation = Equation.DEFAULT_RELAXATION;
	
	    /**
	     * Enable reduction of friction equations. If disabled, a box on a plane will generate 2 contact equations and 2 friction equations. If enabled, there will be only one friction equation. Same kind of simplifications are made  for all collision types.
	     * @property enableFrictionReduction
	     * @type {Boolean}
	     * @deprecated This flag will be removed when the feature is stable enough.
	     * @default true
	     */
	    this.enableFrictionReduction = true;
	
	    /**
	     * Keeps track of the colliding bodies last step.
	     * @private
	     * @property collidingBodiesLastStep
	     * @type {TupleDictionary}
	     */
	    this.collidingBodiesLastStep = new TupleDictionary();
	
	    /**
	     * Contact skin size value to use in the next contact equations.
	     * @property {Number} contactSkinSize
	     * @default 0.01
	     */
	    this.contactSkinSize = 0.01;
	}
	
	var bodiesOverlap_shapePositionA = vec2.create();
	var bodiesOverlap_shapePositionB = vec2.create();
	
	/**
	 * @method bodiesOverlap
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {Boolean}
	 * @todo shape world transforms are wrong
	 */
	Narrowphase.prototype.bodiesOverlap = function(bodyA, bodyB){
	    var shapePositionA = bodiesOverlap_shapePositionA;
	    var shapePositionB = bodiesOverlap_shapePositionB;
	
	    // Loop over all shapes of bodyA
	    for(var k=0, Nshapesi=bodyA.shapes.length; k!==Nshapesi; k++){
	        var shapeA = bodyA.shapes[k];
	
	        bodyA.toWorldFrame(shapePositionA, shapeA.position);
	
	        // All shapes of body j
	        for(var l=0, Nshapesj=bodyB.shapes.length; l!==Nshapesj; l++){
	            var shapeB = bodyB.shapes[l];
	
	            bodyB.toWorldFrame(shapePositionB, shapeB.position);
	
	            if(this[shapeA.type | shapeB.type](
	                bodyA,
	                shapeA,
	                shapePositionA,
	                shapeA.angle + bodyA.angle,
	                bodyB,
	                shapeB,
	                shapePositionB,
	                shapeB.angle + bodyB.angle,
	                true
	            )){
	                return true;
	            }
	        }
	    }
	
	    return false;
	};
	
	/**
	 * Check if the bodies were in contact since the last reset().
	 * @method collidedLastStep
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {Boolean}
	 */
	Narrowphase.prototype.collidedLastStep = function(bodyA, bodyB){
	    var id1 = bodyA.id|0,
	        id2 = bodyB.id|0;
	    return !!this.collidingBodiesLastStep.get(id1, id2);
	};
	
	/**
	 * Throws away the old equations and gets ready to create new
	 * @method reset
	 */
	Narrowphase.prototype.reset = function(){
	    this.collidingBodiesLastStep.reset();
	
	    var eqs = this.contactEquations;
	    var l = eqs.length;
	    while(l--){
	        var eq = eqs[l],
	            id1 = eq.bodyA.id,
	            id2 = eq.bodyB.id;
	        this.collidingBodiesLastStep.set(id1, id2, true);
	    }
	
	    var ce = this.contactEquations,
	        fe = this.frictionEquations;
	    for(var i=0; i<ce.length; i++){
	        this.contactEquationPool.release(ce[i]);
	    }
	    for(var i=0; i<fe.length; i++){
	        this.frictionEquationPool.release(fe[i]);
	    }
	
	    // Reset
	    this.contactEquations.length = this.frictionEquations.length = 0;
	};
	
	/**
	 * Creates a ContactEquation, either by reusing an existing object or creating a new one.
	 * @method createContactEquation
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {ContactEquation}
	 */
	Narrowphase.prototype.createContactEquation = function(bodyA, bodyB, shapeA, shapeB){
	    var c = this.contactEquationPool.get();
	    c.bodyA = bodyA;
	    c.bodyB = bodyB;
	    c.shapeA = shapeA;
	    c.shapeB = shapeB;
	    c.restitution = this.restitution;
	    c.firstImpact = !this.collidedLastStep(bodyA,bodyB);
	    c.stiffness = this.stiffness;
	    c.relaxation = this.relaxation;
	    c.needsUpdate = true;
	    c.enabled = this.enabledEquations;
	    c.offset = this.contactSkinSize;
	
	    return c;
	};
	
	/**
	 * Creates a FrictionEquation, either by reusing an existing object or creating a new one.
	 * @method createFrictionEquation
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {FrictionEquation}
	 */
	Narrowphase.prototype.createFrictionEquation = function(bodyA, bodyB, shapeA, shapeB){
	    var c = this.frictionEquationPool.get();
	    c.bodyA = bodyA;
	    c.bodyB = bodyB;
	    c.shapeA = shapeA;
	    c.shapeB = shapeB;
	    c.setSlipForce(this.slipForce);
	    c.frictionCoefficient = this.frictionCoefficient;
	    c.relativeVelocity = this.surfaceVelocity;
	    c.enabled = this.enabledEquations;
	    c.needsUpdate = true;
	    c.stiffness = this.frictionStiffness;
	    c.relaxation = this.frictionRelaxation;
	    c.contactEquations.length = 0;
	    return c;
	};
	
	/**
	 * Creates a FrictionEquation given the data in the ContactEquation. Uses same offset vectors ri and rj, but the tangent vector will be constructed from the collision normal.
	 * @method createFrictionFromContact
	 * @param  {ContactEquation} contactEquation
	 * @return {FrictionEquation}
	 */
	Narrowphase.prototype.createFrictionFromContact = function(c){
	    var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
	    vec2.copy(eq.contactPointA, c.contactPointA);
	    vec2.copy(eq.contactPointB, c.contactPointB);
	    vec2.rotate90cw(eq.t, c.normalA);
	    eq.contactEquations.push(c);
	    return eq;
	};
	
	// Take the average N latest contact point on the plane.
	Narrowphase.prototype.createFrictionFromAverage = function(numContacts){
	    var c = this.contactEquations[this.contactEquations.length - 1];
	    var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
	    var bodyA = c.bodyA;
	    var bodyB = c.bodyB;
	    vec2.set(eq.contactPointA, 0, 0);
	    vec2.set(eq.contactPointB, 0, 0);
	    vec2.set(eq.t, 0, 0);
	    for(var i=0; i!==numContacts; i++){
	        c = this.contactEquations[this.contactEquations.length - 1 - i];
	        if(c.bodyA === bodyA){
	            vec2.add(eq.t, eq.t, c.normalA);
	            vec2.add(eq.contactPointA, eq.contactPointA, c.contactPointA);
	            vec2.add(eq.contactPointB, eq.contactPointB, c.contactPointB);
	        } else {
	            vec2.sub(eq.t, eq.t, c.normalA);
	            vec2.add(eq.contactPointA, eq.contactPointA, c.contactPointB);
	            vec2.add(eq.contactPointB, eq.contactPointB, c.contactPointA);
	        }
	        eq.contactEquations.push(c);
	    }
	
	    var invNumContacts = 1/numContacts;
	    vec2.scale(eq.contactPointA, eq.contactPointA, invNumContacts);
	    vec2.scale(eq.contactPointB, eq.contactPointB, invNumContacts);
	    vec2.normalize(eq.t, eq.t);
	    vec2.rotate90cw(eq.t, eq.t);
	    return eq;
	};
	
	/**
	 * Convex/line narrowphase
	 * @method convexLine
	 * @param  {Body}       convexBody
	 * @param  {Convex}     convexShape
	 * @param  {Array}      convexOffset
	 * @param  {Number}     convexAngle
	 * @param  {Body}       lineBody
	 * @param  {Line}       lineShape
	 * @param  {Array}      lineOffset
	 * @param  {Number}     lineAngle
	 * @param {boolean}     justTest
	 * @todo Implement me!
	 */
	Narrowphase.prototype[Shape.LINE | Shape.CONVEX] =
	Narrowphase.prototype.convexLine = function(
	    convexBody,
	    convexShape,
	    convexOffset,
	    convexAngle,
	    lineBody,
	    lineShape,
	    lineOffset,
	    lineAngle,
	    justTest
	){
	    // TODO
	    if(justTest){
	        return false;
	    } else {
	        return 0;
	    }
	};
	
	/**
	 * Line/box narrowphase
	 * @method lineBox
	 * @param  {Body}       lineBody
	 * @param  {Line}       lineShape
	 * @param  {Array}      lineOffset
	 * @param  {Number}     lineAngle
	 * @param  {Body}       boxBody
	 * @param  {Box}  boxShape
	 * @param  {Array}      boxOffset
	 * @param  {Number}     boxAngle
	 * @param  {Boolean}    justTest
	 * @todo Implement me!
	 */
	Narrowphase.prototype[Shape.LINE | Shape.BOX] =
	Narrowphase.prototype.lineBox = function(
	    lineBody,
	    lineShape,
	    lineOffset,
	    lineAngle,
	    boxBody,
	    boxShape,
	    boxOffset,
	    boxAngle,
	    justTest
	){
	    // TODO
	    if(justTest){
	        return false;
	    } else {
	        return 0;
	    }
	};
	
	function setConvexToCapsuleShapeMiddle(convexShape, capsuleShape){
	    vec2.set(convexShape.vertices[0], -capsuleShape.length * 0.5, -capsuleShape.radius);
	    vec2.set(convexShape.vertices[1],  capsuleShape.length * 0.5, -capsuleShape.radius);
	    vec2.set(convexShape.vertices[2],  capsuleShape.length * 0.5,  capsuleShape.radius);
	    vec2.set(convexShape.vertices[3], -capsuleShape.length * 0.5,  capsuleShape.radius);
	}
	
	var convexCapsule_tempRect = new Box({ width: 1, height: 1 }),
	    convexCapsule_tempVec = vec2.create();
	
	/**
	 * Convex/capsule narrowphase
	 * @method convexCapsule
	 * @param  {Body}       convexBody
	 * @param  {Convex}     convexShape
	 * @param  {Array}      convexPosition
	 * @param  {Number}     convexAngle
	 * @param  {Body}       capsuleBody
	 * @param  {Capsule}    capsuleShape
	 * @param  {Array}      capsulePosition
	 * @param  {Number}     capsuleAngle
	 */
	Narrowphase.prototype[Shape.CAPSULE | Shape.CONVEX] =
	Narrowphase.prototype[Shape.CAPSULE | Shape.BOX] =
	Narrowphase.prototype.convexCapsule = function(
	    convexBody,
	    convexShape,
	    convexPosition,
	    convexAngle,
	    capsuleBody,
	    capsuleShape,
	    capsulePosition,
	    capsuleAngle,
	    justTest
	){
	
	    // Check the circles
	    // Add offsets!
	    var circlePos = convexCapsule_tempVec;
	    vec2.set(circlePos, capsuleShape.length/2,0);
	    vec2.rotate(circlePos,circlePos,capsuleAngle);
	    vec2.add(circlePos,circlePos,capsulePosition);
	    var result1 = this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle, convexBody,convexShape,convexPosition,convexAngle, justTest, capsuleShape.radius);
	
	    vec2.set(circlePos,-capsuleShape.length/2, 0);
	    vec2.rotate(circlePos,circlePos,capsuleAngle);
	    vec2.add(circlePos,circlePos,capsulePosition);
	    var result2 = this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle, convexBody,convexShape,convexPosition,convexAngle, justTest, capsuleShape.radius);
	
	    if(justTest && (result1 || result2)){
	        return true;
	    }
	
	    // Check center rect
	    var r = convexCapsule_tempRect;
	    setConvexToCapsuleShapeMiddle(r,capsuleShape);
	    var result = this.convexConvex(convexBody,convexShape,convexPosition,convexAngle, capsuleBody,r,capsulePosition,capsuleAngle, justTest);
	
	    return result + result1 + result2;
	};
	
	/**
	 * Capsule/line narrowphase
	 * @method lineCapsule
	 * @param  {Body}       lineBody
	 * @param  {Line}       lineShape
	 * @param  {Array}      linePosition
	 * @param  {Number}     lineAngle
	 * @param  {Body}       capsuleBody
	 * @param  {Capsule}    capsuleShape
	 * @param  {Array}      capsulePosition
	 * @param  {Number}     capsuleAngle
	 * @todo Implement me!
	 */
	Narrowphase.prototype[Shape.CAPSULE | Shape.LINE] =
	Narrowphase.prototype.lineCapsule = function(
	    lineBody,
	    lineShape,
	    linePosition,
	    lineAngle,
	    capsuleBody,
	    capsuleShape,
	    capsulePosition,
	    capsuleAngle,
	    justTest
	){
	    // TODO
	    if(justTest){
	        return false;
	    } else {
	        return 0;
	    }
	};
	
	var capsuleCapsule_tempVec1 = vec2.create();
	var capsuleCapsule_tempVec2 = vec2.create();
	var capsuleCapsule_tempRect1 = new Box({ width: 1, height: 1 });
	
	/**
	 * Capsule/capsule narrowphase
	 * @method capsuleCapsule
	 * @param  {Body}       bi
	 * @param  {Capsule}    si
	 * @param  {Array}      xi
	 * @param  {Number}     ai
	 * @param  {Body}       bj
	 * @param  {Capsule}    sj
	 * @param  {Array}      xj
	 * @param  {Number}     aj
	 */
	Narrowphase.prototype[Shape.CAPSULE | Shape.CAPSULE] =
	Narrowphase.prototype.capsuleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
	
	    var enableFrictionBefore;
	
	    // Check the circles
	    // Add offsets!
	    var circlePosi = capsuleCapsule_tempVec1,
	        circlePosj = capsuleCapsule_tempVec2;
	
	    var numContacts = 0;
	
	
	    // Need 4 circle checks, between all
	    for(var i=0; i<2; i++){
	
	        vec2.set(circlePosi,(i===0?-1:1)*si.length/2,0);
	        vec2.rotate(circlePosi,circlePosi,ai);
	        vec2.add(circlePosi,circlePosi,xi);
	
	        for(var j=0; j<2; j++){
	
	            vec2.set(circlePosj,(j===0?-1:1)*sj.length/2, 0);
	            vec2.rotate(circlePosj,circlePosj,aj);
	            vec2.add(circlePosj,circlePosj,xj);
	
	            // Temporarily turn off friction
	            if(this.enableFrictionReduction){
	                enableFrictionBefore = this.enableFriction;
	                this.enableFriction = false;
	            }
	
	            var result = this.circleCircle(bi,si,circlePosi,ai, bj,sj,circlePosj,aj, justTest, si.radius, sj.radius);
	
	            if(this.enableFrictionReduction){
	                this.enableFriction = enableFrictionBefore;
	            }
	
	            if(justTest && result){
	                return true;
	            }
	
	            numContacts += result;
	        }
	    }
	
	    if(this.enableFrictionReduction){
	        // Temporarily turn off friction
	        enableFrictionBefore = this.enableFriction;
	        this.enableFriction = false;
	    }
	
	    // Check circles against the center boxs
	    var rect = capsuleCapsule_tempRect1;
	    setConvexToCapsuleShapeMiddle(rect,si);
	    var result1 = this.convexCapsule(bi,rect,xi,ai, bj,sj,xj,aj, justTest);
	
	    if(this.enableFrictionReduction){
	        this.enableFriction = enableFrictionBefore;
	    }
	
	    if(justTest && result1){
	        return true;
	    }
	    numContacts += result1;
	
	    if(this.enableFrictionReduction){
	        // Temporarily turn off friction
	        var enableFrictionBefore = this.enableFriction;
	        this.enableFriction = false;
	    }
	
	    setConvexToCapsuleShapeMiddle(rect,sj);
	    var result2 = this.convexCapsule(bj,rect,xj,aj, bi,si,xi,ai, justTest);
	
	    if(this.enableFrictionReduction){
	        this.enableFriction = enableFrictionBefore;
	    }
	
	    if(justTest && result2){
	        return true;
	    }
	    numContacts += result2;
	
	    if(this.enableFrictionReduction){
	        if(numContacts && this.enableFriction){
	            this.frictionEquations.push(this.createFrictionFromAverage(numContacts));
	        }
	    }
	
	    return numContacts;
	};
	
	/**
	 * Line/line narrowphase
	 * @method lineLine
	 * @param  {Body}       bodyA
	 * @param  {Line}       shapeA
	 * @param  {Array}      positionA
	 * @param  {Number}     angleA
	 * @param  {Body}       bodyB
	 * @param  {Line}       shapeB
	 * @param  {Array}      positionB
	 * @param  {Number}     angleB
	 * @todo Implement me!
	 */
	Narrowphase.prototype[Shape.LINE | Shape.LINE] =
	Narrowphase.prototype.lineLine = function(
	    bodyA,
	    shapeA,
	    positionA,
	    angleA,
	    bodyB,
	    shapeB,
	    positionB,
	    angleB,
	    justTest
	){
	    // TODO
	    if(justTest){
	        return false;
	    } else {
	        return 0;
	    }
	};
	
	/**
	 * Plane/line Narrowphase
	 * @method planeLine
	 * @param  {Body}   planeBody
	 * @param  {Plane}  planeShape
	 * @param  {Array}  planeOffset
	 * @param  {Number} planeAngle
	 * @param  {Body}   lineBody
	 * @param  {Line}   lineShape
	 * @param  {Array}  lineOffset
	 * @param  {Number} lineAngle
	 */
	Narrowphase.prototype[Shape.PLANE | Shape.LINE] =
	Narrowphase.prototype.planeLine = function(planeBody, planeShape, planeOffset, planeAngle,
	                                           lineBody,  lineShape,  lineOffset,  lineAngle, justTest){
	    var worldVertex0 = tmp1,
	        worldVertex1 = tmp2,
	        worldVertex01 = tmp3,
	        worldVertex11 = tmp4,
	        worldEdge = tmp5,
	        worldEdgeUnit = tmp6,
	        dist = tmp7,
	        worldNormal = tmp8,
	        worldTangent = tmp9,
	        verts = tmpArray,
	        numContacts = 0;
	
	    // Get start and end points
	    vec2.set(worldVertex0, -lineShape.length/2, 0);
	    vec2.set(worldVertex1,  lineShape.length/2, 0);
	
	    // Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
	    vec2.rotate(worldVertex01, worldVertex0, lineAngle);
	    vec2.rotate(worldVertex11, worldVertex1, lineAngle);
	
	    add(worldVertex01, worldVertex01, lineOffset);
	    add(worldVertex11, worldVertex11, lineOffset);
	
	    vec2.copy(worldVertex0,worldVertex01);
	    vec2.copy(worldVertex1,worldVertex11);
	
	    // Get vector along the line
	    sub(worldEdge, worldVertex1, worldVertex0);
	    vec2.normalize(worldEdgeUnit, worldEdge);
	
	    // Get tangent to the edge.
	    vec2.rotate90cw(worldTangent, worldEdgeUnit);
	
	    vec2.rotate(worldNormal, yAxis, planeAngle);
	
	    // Check line ends
	    verts[0] = worldVertex0;
	    verts[1] = worldVertex1;
	    for(var i=0; i<verts.length; i++){
	        var v = verts[i];
	
	        sub(dist, v, planeOffset);
	
	        var d = dot(dist,worldNormal);
	
	        if(d < 0){
	
	            if(justTest){
	                return true;
	            }
	
	            var c = this.createContactEquation(planeBody,lineBody,planeShape,lineShape);
	            numContacts++;
	
	            vec2.copy(c.normalA, worldNormal);
	            vec2.normalize(c.normalA,c.normalA);
	
	            // distance vector along plane normal
	            vec2.scale(dist, worldNormal, d);
	
	            // Vector from plane center to contact
	            sub(c.contactPointA, v, dist);
	            sub(c.contactPointA, c.contactPointA, planeBody.position);
	
	            // From line center to contact
	            sub(c.contactPointB, v,    lineOffset);
	            add(c.contactPointB, c.contactPointB, lineOffset);
	            sub(c.contactPointB, c.contactPointB, lineBody.position);
	
	            this.contactEquations.push(c);
	
	            if(!this.enableFrictionReduction){
	                if(this.enableFriction){
	                    this.frictionEquations.push(this.createFrictionFromContact(c));
	                }
	            }
	        }
	    }
	
	    if(justTest){
	        return false;
	    }
	
	    if(!this.enableFrictionReduction){
	        if(numContacts && this.enableFriction){
	            this.frictionEquations.push(this.createFrictionFromAverage(numContacts));
	        }
	    }
	
	    return numContacts;
	};
	
	Narrowphase.prototype[Shape.PARTICLE | Shape.CAPSULE] =
	Narrowphase.prototype.particleCapsule = function(
	    particleBody,
	    particleShape,
	    particlePosition,
	    particleAngle,
	    capsuleBody,
	    capsuleShape,
	    capsulePosition,
	    capsuleAngle,
	    justTest
	){
	    return this.circleLine(particleBody,particleShape,particlePosition,particleAngle, capsuleBody,capsuleShape,capsulePosition,capsuleAngle, justTest, capsuleShape.radius, 0);
	};
	
	/**
	 * Circle/line Narrowphase
	 * @method circleLine
	 * @param  {Body} circleBody
	 * @param  {Circle} circleShape
	 * @param  {Array} circleOffset
	 * @param  {Number} circleAngle
	 * @param  {Body} lineBody
	 * @param  {Line} lineShape
	 * @param  {Array} lineOffset
	 * @param  {Number} lineAngle
	 * @param {Boolean} justTest If set to true, this function will return the result (intersection or not) without adding equations.
	 * @param {Number} lineRadius Radius to add to the line. Can be used to test Capsules.
	 * @param {Number} circleRadius If set, this value overrides the circle shape radius.
	 */
	Narrowphase.prototype[Shape.CIRCLE | Shape.LINE] =
	Narrowphase.prototype.circleLine = function(
	    circleBody,
	    circleShape,
	    circleOffset,
	    circleAngle,
	    lineBody,
	    lineShape,
	    lineOffset,
	    lineAngle,
	    justTest,
	    lineRadius,
	    circleRadius
	){
	    var lineRadius = lineRadius || 0,
	        circleRadius = typeof(circleRadius)!=="undefined" ? circleRadius : circleShape.radius,
	
	        orthoDist = tmp1,
	        lineToCircleOrthoUnit = tmp2,
	        projectedPoint = tmp3,
	        centerDist = tmp4,
	        worldTangent = tmp5,
	        worldEdge = tmp6,
	        worldEdgeUnit = tmp7,
	        worldVertex0 = tmp8,
	        worldVertex1 = tmp9,
	        worldVertex01 = tmp10,
	        worldVertex11 = tmp11,
	        dist = tmp12,
	        lineToCircle = tmp13,
	        lineEndToLineRadius = tmp14,
	
	        verts = tmpArray;
	
	    // Get start and end points
	    vec2.set(worldVertex0, -lineShape.length/2, 0);
	    vec2.set(worldVertex1,  lineShape.length/2, 0);
	
	    // Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
	    vec2.rotate(worldVertex01, worldVertex0, lineAngle);
	    vec2.rotate(worldVertex11, worldVertex1, lineAngle);
	
	    add(worldVertex01, worldVertex01, lineOffset);
	    add(worldVertex11, worldVertex11, lineOffset);
	
	    vec2.copy(worldVertex0,worldVertex01);
	    vec2.copy(worldVertex1,worldVertex11);
	
	    // Get vector along the line
	    sub(worldEdge, worldVertex1, worldVertex0);
	    vec2.normalize(worldEdgeUnit, worldEdge);
	
	    // Get tangent to the edge.
	    vec2.rotate90cw(worldTangent, worldEdgeUnit);
	
	    // Check distance from the plane spanned by the edge vs the circle
	    sub(dist, circleOffset, worldVertex0);
	    var d = dot(dist, worldTangent); // Distance from center of line to circle center
	    sub(centerDist, worldVertex0, lineOffset);
	
	    sub(lineToCircle, circleOffset, lineOffset);
	
	    var radiusSum = circleRadius + lineRadius;
	
	    if(Math.abs(d) < radiusSum){
	
	        // Now project the circle onto the edge
	        vec2.scale(orthoDist, worldTangent, d);
	        sub(projectedPoint, circleOffset, orthoDist);
	
	        // Add the missing line radius
	        vec2.scale(lineToCircleOrthoUnit, worldTangent, dot(worldTangent, lineToCircle));
	        vec2.normalize(lineToCircleOrthoUnit,lineToCircleOrthoUnit);
	        vec2.scale(lineToCircleOrthoUnit, lineToCircleOrthoUnit, lineRadius);
	        add(projectedPoint,projectedPoint,lineToCircleOrthoUnit);
	
	        // Check if the point is within the edge span
	        var pos =  dot(worldEdgeUnit, projectedPoint);
	        var pos0 = dot(worldEdgeUnit, worldVertex0);
	        var pos1 = dot(worldEdgeUnit, worldVertex1);
	
	        if(pos > pos0 && pos < pos1){
	            // We got contact!
	
	            if(justTest){
	                return true;
	            }
	
	            var c = this.createContactEquation(circleBody,lineBody,circleShape,lineShape);
	
	            vec2.scale(c.normalA, orthoDist, -1);
	            vec2.normalize(c.normalA, c.normalA);
	
	            vec2.scale( c.contactPointA, c.normalA,  circleRadius);
	            add(c.contactPointA, c.contactPointA, circleOffset);
	            sub(c.contactPointA, c.contactPointA, circleBody.position);
	
	            sub(c.contactPointB, projectedPoint, lineOffset);
	            add(c.contactPointB, c.contactPointB, lineOffset);
	            sub(c.contactPointB, c.contactPointB, lineBody.position);
	
	            this.contactEquations.push(c);
	
	            if(this.enableFriction){
	                this.frictionEquations.push(this.createFrictionFromContact(c));
	            }
	
	            return 1;
	        }
	    }
	
	    // Add corner
	    verts[0] = worldVertex0;
	    verts[1] = worldVertex1;
	
	    for(var i=0; i<verts.length; i++){
	        var v = verts[i];
	
	        sub(dist, v, circleOffset);
	
	        if(vec2.squaredLength(dist) < Math.pow(radiusSum, 2)){
	
	            if(justTest){
	                return true;
	            }
	
	            var c = this.createContactEquation(circleBody,lineBody,circleShape,lineShape);
	
	            vec2.copy(c.normalA, dist);
	            vec2.normalize(c.normalA,c.normalA);
	
	            // Vector from circle to contact point is the normal times the circle radius
	            vec2.scale(c.contactPointA, c.normalA, circleRadius);
	            add(c.contactPointA, c.contactPointA, circleOffset);
	            sub(c.contactPointA, c.contactPointA, circleBody.position);
	
	            sub(c.contactPointB, v, lineOffset);
	            vec2.scale(lineEndToLineRadius, c.normalA, -lineRadius);
	            add(c.contactPointB, c.contactPointB, lineEndToLineRadius);
	            add(c.contactPointB, c.contactPointB, lineOffset);
	            sub(c.contactPointB, c.contactPointB, lineBody.position);
	
	            this.contactEquations.push(c);
	
	            if(this.enableFriction){
	                this.frictionEquations.push(this.createFrictionFromContact(c));
	            }
	
	            return 1;
	        }
	    }
	
	    return 0;
	};
	
	/**
	 * Circle/capsule Narrowphase
	 * @method circleCapsule
	 * @param  {Body}   bi
	 * @param  {Circle} si
	 * @param  {Array}  xi
	 * @param  {Number} ai
	 * @param  {Body}   bj
	 * @param  {Line}   sj
	 * @param  {Array}  xj
	 * @param  {Number} aj
	 */
	Narrowphase.prototype[Shape.CIRCLE | Shape.CAPSULE] =
	Narrowphase.prototype.circleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
	    return this.circleLine(bi,si,xi,ai, bj,sj,xj,aj, justTest, sj.radius);
	};
	
	/**
	 * Circle/convex Narrowphase.
	 * @method circleConvex
	 * @param  {Body} circleBody
	 * @param  {Circle} circleShape
	 * @param  {Array} circleOffset
	 * @param  {Number} circleAngle
	 * @param  {Body} convexBody
	 * @param  {Convex} convexShape
	 * @param  {Array} convexOffset
	 * @param  {Number} convexAngle
	 * @param  {Boolean} justTest
	 * @param  {Number} circleRadius
	 */
	Narrowphase.prototype[Shape.CIRCLE | Shape.CONVEX] =
	Narrowphase.prototype[Shape.CIRCLE | Shape.BOX] =
	Narrowphase.prototype.circleConvex = function(
	    circleBody,
	    circleShape,
	    circleOffset,
	    circleAngle,
	    convexBody,
	    convexShape,
	    convexOffset,
	    convexAngle,
	    justTest,
	    circleRadius
	){
	    var circleRadius = typeof(circleRadius)==="number" ? circleRadius : circleShape.radius;
	
	    var worldVertex0 = tmp1,
	        worldVertex1 = tmp2,
	        worldEdge = tmp3,
	        worldEdgeUnit = tmp4,
	        worldNormal = tmp5,
	        centerDist = tmp6,
	        convexToCircle = tmp7,
	        orthoDist = tmp8,
	        projectedPoint = tmp9,
	        dist = tmp10,
	        worldVertex = tmp11,
	
	        closestEdge = -1,
	        closestEdgeDistance = null,
	        closestEdgeOrthoDist = tmp12,
	        closestEdgeProjectedPoint = tmp13,
	        candidate = tmp14,
	        candidateDist = tmp15,
	        minCandidate = tmp16,
	
	        found = false,
	        minCandidateDistance = Number.MAX_VALUE;
	
	    var numReported = 0;
	
	    // New algorithm:
	    // 1. Check so center of circle is not inside the polygon. If it is, this wont work...
	    // 2. For each edge
	    // 2. 1. Get point on circle that is closest to the edge (scale normal with -radius)
	    // 2. 2. Check if point is inside.
	
	    var verts = convexShape.vertices;
	
	    // Check all edges first
	    for(var i=0; i!==verts.length+1; i++){
	        var v0 = verts[i%verts.length],
	            v1 = verts[(i+1)%verts.length];
	
	        vec2.rotate(worldVertex0, v0, convexAngle);
	        vec2.rotate(worldVertex1, v1, convexAngle);
	        add(worldVertex0, worldVertex0, convexOffset);
	        add(worldVertex1, worldVertex1, convexOffset);
	        sub(worldEdge, worldVertex1, worldVertex0);
	
	        vec2.normalize(worldEdgeUnit, worldEdge);
	
	        // Get tangent to the edge. Points out of the Convex
	        vec2.rotate90cw(worldNormal, worldEdgeUnit);
	
	        // Get point on circle, closest to the polygon
	        vec2.scale(candidate,worldNormal,-circleShape.radius);
	        add(candidate,candidate,circleOffset);
	
	        if(pointInConvex(candidate,convexShape,convexOffset,convexAngle)){
	
	            vec2.sub(candidateDist,worldVertex0,candidate);
	            var candidateDistance = Math.abs(vec2.dot(candidateDist,worldNormal));
	
	            if(candidateDistance < minCandidateDistance){
	                vec2.copy(minCandidate,candidate);
	                minCandidateDistance = candidateDistance;
	                vec2.scale(closestEdgeProjectedPoint,worldNormal,candidateDistance);
	                vec2.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,candidate);
	                found = true;
	            }
	        }
	    }
	
	    if(found){
	
	        if(justTest){
	            return true;
	        }
	
	        var c = this.createContactEquation(circleBody,convexBody,circleShape,convexShape);
	        vec2.sub(c.normalA, minCandidate, circleOffset);
	        vec2.normalize(c.normalA, c.normalA);
	
	        vec2.scale(c.contactPointA,  c.normalA, circleRadius);
	        add(c.contactPointA, c.contactPointA, circleOffset);
	        sub(c.contactPointA, c.contactPointA, circleBody.position);
	
	        sub(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
	        add(c.contactPointB, c.contactPointB, convexOffset);
	        sub(c.contactPointB, c.contactPointB, convexBody.position);
	
	        this.contactEquations.push(c);
	
	        if(this.enableFriction){
	            this.frictionEquations.push( this.createFrictionFromContact(c) );
	        }
	
	        return 1;
	    }
	
	    // Check all vertices
	    if(circleRadius > 0){
	        for(var i=0; i<verts.length; i++){
	            var localVertex = verts[i];
	            vec2.rotate(worldVertex, localVertex, convexAngle);
	            add(worldVertex, worldVertex, convexOffset);
	
	            sub(dist, worldVertex, circleOffset);
	            if(vec2.squaredLength(dist) < Math.pow(circleRadius, 2)){
	
	                if(justTest){
	                    return true;
	                }
	
	                var c = this.createContactEquation(circleBody,convexBody,circleShape,convexShape);
	
	                vec2.copy(c.normalA, dist);
	                vec2.normalize(c.normalA,c.normalA);
	
	                // Vector from circle to contact point is the normal times the circle radius
	                vec2.scale(c.contactPointA, c.normalA, circleRadius);
	                add(c.contactPointA, c.contactPointA, circleOffset);
	                sub(c.contactPointA, c.contactPointA, circleBody.position);
	
	                sub(c.contactPointB, worldVertex, convexOffset);
	                add(c.contactPointB, c.contactPointB, convexOffset);
	                sub(c.contactPointB, c.contactPointB, convexBody.position);
	
	                this.contactEquations.push(c);
	
	                if(this.enableFriction){
	                    this.frictionEquations.push(this.createFrictionFromContact(c));
	                }
	
	                return 1;
	            }
	        }
	    }
	
	    return 0;
	};
	
	var pic_worldVertex0 = vec2.create(),
	    pic_worldVertex1 = vec2.create(),
	    pic_r0 = vec2.create(),
	    pic_r1 = vec2.create();
	
	/*
	 * Check if a point is in a polygon
	 */
	function pointInConvex(worldPoint,convexShape,convexOffset,convexAngle){
	    var worldVertex0 = pic_worldVertex0,
	        worldVertex1 = pic_worldVertex1,
	        r0 = pic_r0,
	        r1 = pic_r1,
	        point = worldPoint,
	        verts = convexShape.vertices,
	        lastCross = null;
	    for(var i=0; i!==verts.length+1; i++){
	        var v0 = verts[i%verts.length],
	            v1 = verts[(i+1)%verts.length];
	
	        // Transform vertices to world
	        // @todo The point should be transformed to local coordinates in the convex, no need to transform each vertex
	        vec2.rotate(worldVertex0, v0, convexAngle);
	        vec2.rotate(worldVertex1, v1, convexAngle);
	        add(worldVertex0, worldVertex0, convexOffset);
	        add(worldVertex1, worldVertex1, convexOffset);
	
	        sub(r0, worldVertex0, point);
	        sub(r1, worldVertex1, point);
	        var cross = vec2.crossLength(r0,r1);
	
	        if(lastCross===null){
	            lastCross = cross;
	        }
	
	        // If we got a different sign of the distance vector, the point is out of the polygon
	        if(cross*lastCross <= 0){
	            return false;
	        }
	        lastCross = cross;
	    }
	    return true;
	}
	
	/**
	 * Particle/convex Narrowphase
	 * @method particleConvex
	 * @param  {Body} particleBody
	 * @param  {Particle} particleShape
	 * @param  {Array} particleOffset
	 * @param  {Number} particleAngle
	 * @param  {Body} convexBody
	 * @param  {Convex} convexShape
	 * @param  {Array} convexOffset
	 * @param  {Number} convexAngle
	 * @param {Boolean} justTest
	 * @todo use pointInConvex and code more similar to circleConvex
	 * @todo don't transform each vertex, but transform the particle position to convex-local instead
	 */
	Narrowphase.prototype[Shape.PARTICLE | Shape.CONVEX] =
	Narrowphase.prototype[Shape.PARTICLE | Shape.BOX] =
	Narrowphase.prototype.particleConvex = function(
	    particleBody,
	    particleShape,
	    particleOffset,
	    particleAngle,
	    convexBody,
	    convexShape,
	    convexOffset,
	    convexAngle,
	    justTest
	){
	    var worldVertex0 = tmp1,
	        worldVertex1 = tmp2,
	        worldEdge = tmp3,
	        worldEdgeUnit = tmp4,
	        worldTangent = tmp5,
	        centerDist = tmp6,
	        convexToparticle = tmp7,
	        orthoDist = tmp8,
	        projectedPoint = tmp9,
	        dist = tmp10,
	        worldVertex = tmp11,
	        closestEdge = -1,
	        closestEdgeDistance = null,
	        closestEdgeOrthoDist = tmp12,
	        closestEdgeProjectedPoint = tmp13,
	        r0 = tmp14, // vector from particle to vertex0
	        r1 = tmp15,
	        localPoint = tmp16,
	        candidateDist = tmp17,
	        minEdgeNormal = tmp18,
	        minCandidateDistance = Number.MAX_VALUE;
	
	    var numReported = 0,
	        found = false,
	        verts = convexShape.vertices;
	
	    // Check if the particle is in the polygon at all
	    if(!pointInConvex(particleOffset,convexShape,convexOffset,convexAngle)){
	        return 0;
	    }
	
	    if(justTest){
	        return true;
	    }
	
	    // Check edges first
	    var lastCross = null;
	    for(var i=0; i!==verts.length+1; i++){
	        var v0 = verts[i%verts.length],
	            v1 = verts[(i+1)%verts.length];
	
	        // Transform vertices to world
	        vec2.rotate(worldVertex0, v0, convexAngle);
	        vec2.rotate(worldVertex1, v1, convexAngle);
	        add(worldVertex0, worldVertex0, convexOffset);
	        add(worldVertex1, worldVertex1, convexOffset);
	
	        // Get world edge
	        sub(worldEdge, worldVertex1, worldVertex0);
	        vec2.normalize(worldEdgeUnit, worldEdge);
	
	        // Get tangent to the edge. Points out of the Convex
	        vec2.rotate90cw(worldTangent, worldEdgeUnit);
	
	        // Check distance from the infinite line (spanned by the edge) to the particle
	        sub(dist, particleOffset, worldVertex0);
	        var d = dot(dist, worldTangent);
	        sub(centerDist, worldVertex0, convexOffset);
	
	        sub(convexToparticle, particleOffset, convexOffset);
	
	        vec2.sub(candidateDist,worldVertex0,particleOffset);
	        var candidateDistance = Math.abs(vec2.dot(candidateDist,worldTangent));
	
	        if(candidateDistance < minCandidateDistance){
	            minCandidateDistance = candidateDistance;
	            vec2.scale(closestEdgeProjectedPoint,worldTangent,candidateDistance);
	            vec2.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,particleOffset);
	            vec2.copy(minEdgeNormal,worldTangent);
	            found = true;
	        }
	    }
	
	    if(found){
	        var c = this.createContactEquation(particleBody,convexBody,particleShape,convexShape);
	
	        vec2.scale(c.normalA, minEdgeNormal, -1);
	        vec2.normalize(c.normalA, c.normalA);
	
	        // Particle has no extent to the contact point
	        vec2.set(c.contactPointA,  0, 0);
	        add(c.contactPointA, c.contactPointA, particleOffset);
	        sub(c.contactPointA, c.contactPointA, particleBody.position);
	
	        // From convex center to point
	        sub(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
	        add(c.contactPointB, c.contactPointB, convexOffset);
	        sub(c.contactPointB, c.contactPointB, convexBody.position);
	
	        this.contactEquations.push(c);
	
	        if(this.enableFriction){
	            this.frictionEquations.push( this.createFrictionFromContact(c) );
	        }
	
	        return 1;
	    }
	
	
	    return 0;
	};
	
	/**
	 * Circle/circle Narrowphase
	 * @method circleCircle
	 * @param  {Body} bodyA
	 * @param  {Circle} shapeA
	 * @param  {Array} offsetA
	 * @param  {Number} angleA
	 * @param  {Body} bodyB
	 * @param  {Circle} shapeB
	 * @param  {Array} offsetB
	 * @param  {Number} angleB
	 * @param {Boolean} justTest
	 * @param {Number} [radiusA] Optional radius to use for shapeA
	 * @param {Number} [radiusB] Optional radius to use for shapeB
	 */
	Narrowphase.prototype[Shape.CIRCLE] =
	Narrowphase.prototype.circleCircle = function(
	    bodyA,
	    shapeA,
	    offsetA,
	    angleA,
	    bodyB,
	    shapeB,
	    offsetB,
	    angleB,
	    justTest,
	    radiusA,
	    radiusB
	){
	
	    var dist = tmp1,
	        radiusA = radiusA || shapeA.radius,
	        radiusB = radiusB || shapeB.radius;
	
	    sub(dist,offsetA,offsetB);
	    var r = radiusA + radiusB;
	    if(vec2.squaredLength(dist) > Math.pow(r,2)){
	        return 0;
	    }
	
	    if(justTest){
	        return true;
	    }
	
	    var c = this.createContactEquation(bodyA,bodyB,shapeA,shapeB);
	    sub(c.normalA, offsetB, offsetA);
	    vec2.normalize(c.normalA,c.normalA);
	
	    vec2.scale( c.contactPointA, c.normalA,  radiusA);
	    vec2.scale( c.contactPointB, c.normalA, -radiusB);
	
	    add(c.contactPointA, c.contactPointA, offsetA);
	    sub(c.contactPointA, c.contactPointA, bodyA.position);
	
	    add(c.contactPointB, c.contactPointB, offsetB);
	    sub(c.contactPointB, c.contactPointB, bodyB.position);
	
	    this.contactEquations.push(c);
	
	    if(this.enableFriction){
	        this.frictionEquations.push(this.createFrictionFromContact(c));
	    }
	    return 1;
	};
	
	/**
	 * Plane/Convex Narrowphase
	 * @method planeConvex
	 * @param  {Body} planeBody
	 * @param  {Plane} planeShape
	 * @param  {Array} planeOffset
	 * @param  {Number} planeAngle
	 * @param  {Body} convexBody
	 * @param  {Convex} convexShape
	 * @param  {Array} convexOffset
	 * @param  {Number} convexAngle
	 * @param {Boolean} justTest
	 */
	Narrowphase.prototype[Shape.PLANE | Shape.CONVEX] =
	Narrowphase.prototype[Shape.PLANE | Shape.BOX] =
	Narrowphase.prototype.planeConvex = function(
	    planeBody,
	    planeShape,
	    planeOffset,
	    planeAngle,
	    convexBody,
	    convexShape,
	    convexOffset,
	    convexAngle,
	    justTest
	){
	    var worldVertex = tmp1,
	        worldNormal = tmp2,
	        dist = tmp3;
	
	    var numReported = 0;
	    vec2.rotate(worldNormal, yAxis, planeAngle);
	
	    for(var i=0; i!==convexShape.vertices.length; i++){
	        var v = convexShape.vertices[i];
	        vec2.rotate(worldVertex, v, convexAngle);
	        add(worldVertex, worldVertex, convexOffset);
	
	        sub(dist, worldVertex, planeOffset);
	
	        if(dot(dist,worldNormal) <= 0){
	
	            if(justTest){
	                return true;
	            }
	
	            // Found vertex
	            numReported++;
	
	            var c = this.createContactEquation(planeBody,convexBody,planeShape,convexShape);
	
	            sub(dist, worldVertex, planeOffset);
	
	            vec2.copy(c.normalA, worldNormal);
	
	            var d = dot(dist, c.normalA);
	            vec2.scale(dist, c.normalA, d);
	
	            // rj is from convex center to contact
	            sub(c.contactPointB, worldVertex, convexBody.position);
	
	
	            // ri is from plane center to contact
	            sub( c.contactPointA, worldVertex, dist);
	            sub( c.contactPointA, c.contactPointA, planeBody.position);
	
	            this.contactEquations.push(c);
	
	            if(!this.enableFrictionReduction){
	                if(this.enableFriction){
	                    this.frictionEquations.push(this.createFrictionFromContact(c));
	                }
	            }
	        }
	    }
	
	    if(this.enableFrictionReduction){
	        if(this.enableFriction && numReported){
	            this.frictionEquations.push(this.createFrictionFromAverage(numReported));
	        }
	    }
	
	    return numReported;
	};
	
	/**
	 * Narrowphase for particle vs plane
	 * @method particlePlane
	 * @param  {Body}       particleBody
	 * @param  {Particle}   particleShape
	 * @param  {Array}      particleOffset
	 * @param  {Number}     particleAngle
	 * @param  {Body}       planeBody
	 * @param  {Plane}      planeShape
	 * @param  {Array}      planeOffset
	 * @param  {Number}     planeAngle
	 * @param {Boolean}     justTest
	 */
	Narrowphase.prototype[Shape.PARTICLE | Shape.PLANE] =
	Narrowphase.prototype.particlePlane = function(
	    particleBody,
	    particleShape,
	    particleOffset,
	    particleAngle,
	    planeBody,
	    planeShape,
	    planeOffset,
	    planeAngle,
	    justTest
	){
	    var dist = tmp1,
	        worldNormal = tmp2;
	
	    planeAngle = planeAngle || 0;
	
	    sub(dist, particleOffset, planeOffset);
	    vec2.rotate(worldNormal, yAxis, planeAngle);
	
	    var d = dot(dist, worldNormal);
	
	    if(d > 0){
	        return 0;
	    }
	    if(justTest){
	        return true;
	    }
	
	    var c = this.createContactEquation(planeBody,particleBody,planeShape,particleShape);
	
	    vec2.copy(c.normalA, worldNormal);
	    vec2.scale( dist, c.normalA, d );
	    // dist is now the distance vector in the normal direction
	
	    // ri is the particle position projected down onto the plane, from the plane center
	    sub( c.contactPointA, particleOffset, dist);
	    sub( c.contactPointA, c.contactPointA, planeBody.position);
	
	    // rj is from the body center to the particle center
	    sub( c.contactPointB, particleOffset, particleBody.position );
	
	    this.contactEquations.push(c);
	
	    if(this.enableFriction){
	        this.frictionEquations.push(this.createFrictionFromContact(c));
	    }
	    return 1;
	};
	
	/**
	 * Circle/Particle Narrowphase
	 * @method circleParticle
	 * @param  {Body} circleBody
	 * @param  {Circle} circleShape
	 * @param  {Array} circleOffset
	 * @param  {Number} circleAngle
	 * @param  {Body} particleBody
	 * @param  {Particle} particleShape
	 * @param  {Array} particleOffset
	 * @param  {Number} particleAngle
	 * @param  {Boolean} justTest
	 */
	Narrowphase.prototype[Shape.CIRCLE | Shape.PARTICLE] =
	Narrowphase.prototype.circleParticle = function(
	    circleBody,
	    circleShape,
	    circleOffset,
	    circleAngle,
	    particleBody,
	    particleShape,
	    particleOffset,
	    particleAngle,
	    justTest
	){
	    var dist = tmp1;
	
	    sub(dist, particleOffset, circleOffset);
	    if(vec2.squaredLength(dist) > Math.pow(circleShape.radius, 2)){
	        return 0;
	    }
	    if(justTest){
	        return true;
	    }
	
	    var c = this.createContactEquation(circleBody,particleBody,circleShape,particleShape);
	    vec2.copy(c.normalA, dist);
	    vec2.normalize(c.normalA,c.normalA);
	
	    // Vector from circle to contact point is the normal times the circle radius
	    vec2.scale(c.contactPointA, c.normalA, circleShape.radius);
	    add(c.contactPointA, c.contactPointA, circleOffset);
	    sub(c.contactPointA, c.contactPointA, circleBody.position);
	
	    // Vector from particle center to contact point is zero
	    sub(c.contactPointB, particleOffset, particleBody.position);
	
	    this.contactEquations.push(c);
	
	    if(this.enableFriction){
	        this.frictionEquations.push(this.createFrictionFromContact(c));
	    }
	
	    return 1;
	};
	
	var planeCapsule_tmpCircle = new Circle({ radius: 1 }),
	    planeCapsule_tmp1 = vec2.create(),
	    planeCapsule_tmp2 = vec2.create(),
	    planeCapsule_tmp3 = vec2.create();
	
	/**
	 * @method planeCapsule
	 * @param  {Body} planeBody
	 * @param  {Circle} planeShape
	 * @param  {Array} planeOffset
	 * @param  {Number} planeAngle
	 * @param  {Body} capsuleBody
	 * @param  {Particle} capsuleShape
	 * @param  {Array} capsuleOffset
	 * @param  {Number} capsuleAngle
	 * @param {Boolean} justTest
	 */
	Narrowphase.prototype[Shape.PLANE | Shape.CAPSULE] =
	Narrowphase.prototype.planeCapsule = function(
	    planeBody,
	    planeShape,
	    planeOffset,
	    planeAngle,
	    capsuleBody,
	    capsuleShape,
	    capsuleOffset,
	    capsuleAngle,
	    justTest
	){
	    var end1 = planeCapsule_tmp1,
	        end2 = planeCapsule_tmp2,
	        circle = planeCapsule_tmpCircle,
	        dst = planeCapsule_tmp3;
	
	    // Compute world end positions
	    vec2.set(end1, -capsuleShape.length/2, 0);
	    vec2.rotate(end1,end1,capsuleAngle);
	    add(end1,end1,capsuleOffset);
	
	    vec2.set(end2,  capsuleShape.length/2, 0);
	    vec2.rotate(end2,end2,capsuleAngle);
	    add(end2,end2,capsuleOffset);
	
	    circle.radius = capsuleShape.radius;
	
	    var enableFrictionBefore;
	
	    // Temporarily turn off friction
	    if(this.enableFrictionReduction){
	        enableFrictionBefore = this.enableFriction;
	        this.enableFriction = false;
	    }
	
	    // Do Narrowphase as two circles
	    var numContacts1 = this.circlePlane(capsuleBody,circle,end1,0, planeBody,planeShape,planeOffset,planeAngle, justTest),
	        numContacts2 = this.circlePlane(capsuleBody,circle,end2,0, planeBody,planeShape,planeOffset,planeAngle, justTest);
	
	    // Restore friction
	    if(this.enableFrictionReduction){
	        this.enableFriction = enableFrictionBefore;
	    }
	
	    if(justTest){
	        return numContacts1 || numContacts2;
	    } else {
	        var numTotal = numContacts1 + numContacts2;
	        if(this.enableFrictionReduction){
	            if(numTotal){
	                this.frictionEquations.push(this.createFrictionFromAverage(numTotal));
	            }
	        }
	        return numTotal;
	    }
	};
	
	/**
	 * Creates ContactEquations and FrictionEquations for a collision.
	 * @method circlePlane
	 * @param  {Body}    bi     The first body that should be connected to the equations.
	 * @param  {Circle}  si     The circle shape participating in the collision.
	 * @param  {Array}   xi     Extra offset to take into account for the Shape, in addition to the one in circleBody.position. Will *not* be rotated by circleBody.angle (maybe it should, for sake of homogenity?). Set to null if none.
	 * @param  {Body}    bj     The second body that should be connected to the equations.
	 * @param  {Plane}   sj     The Plane shape that is participating
	 * @param  {Array}   xj     Extra offset for the plane shape.
	 * @param  {Number}  aj     Extra angle to apply to the plane
	 */
	Narrowphase.prototype[Shape.CIRCLE | Shape.PLANE] =
	Narrowphase.prototype.circlePlane = function(   bi,si,xi,ai, bj,sj,xj,aj, justTest ){
	    var circleBody = bi,
	        circleShape = si,
	        circleOffset = xi, // Offset from body center, rotated!
	        planeBody = bj,
	        shapeB = sj,
	        planeOffset = xj,
	        planeAngle = aj;
	
	    planeAngle = planeAngle || 0;
	
	    // Vector from plane to circle
	    var planeToCircle = tmp1,
	        worldNormal = tmp2,
	        temp = tmp3;
	
	    sub(planeToCircle, circleOffset, planeOffset);
	
	    // World plane normal
	    vec2.rotate(worldNormal, yAxis, planeAngle);
	
	    // Normal direction distance
	    var d = dot(worldNormal, planeToCircle);
	
	    if(d > circleShape.radius){
	        return 0; // No overlap. Abort.
	    }
	
	    if(justTest){
	        return true;
	    }
	
	    // Create contact
	    var contact = this.createContactEquation(planeBody,circleBody,sj,si);
	
	    // ni is the plane world normal
	    vec2.copy(contact.normalA, worldNormal);
	
	    // rj is the vector from circle center to the contact point
	    vec2.scale(contact.contactPointB, contact.normalA, -circleShape.radius);
	    add(contact.contactPointB, contact.contactPointB, circleOffset);
	    sub(contact.contactPointB, contact.contactPointB, circleBody.position);
	
	    // ri is the distance from plane center to contact.
	    vec2.scale(temp, contact.normalA, d);
	    sub(contact.contactPointA, planeToCircle, temp ); // Subtract normal distance vector from the distance vector
	    add(contact.contactPointA, contact.contactPointA, planeOffset);
	    sub(contact.contactPointA, contact.contactPointA, planeBody.position);
	
	    this.contactEquations.push(contact);
	
	    if(this.enableFriction){
	        this.frictionEquations.push( this.createFrictionFromContact(contact) );
	    }
	
	    return 1;
	};
	
	/**
	 * Convex/convex Narrowphase.See <a href="http://www.altdevblogaday.com/2011/05/13/contact-generation-between-3d-convex-meshes/">this article</a> for more info.
	 * @method convexConvex
	 * @param  {Body} bi
	 * @param  {Convex} si
	 * @param  {Array} xi
	 * @param  {Number} ai
	 * @param  {Body} bj
	 * @param  {Convex} sj
	 * @param  {Array} xj
	 * @param  {Number} aj
	 */
	Narrowphase.prototype[Shape.CONVEX] =
	Narrowphase.prototype[Shape.CONVEX | Shape.BOX] =
	Narrowphase.prototype[Shape.BOX] =
	Narrowphase.prototype.convexConvex = function(  bi,si,xi,ai, bj,sj,xj,aj, justTest, precision ){
	    var sepAxis = tmp1,
	        worldPoint = tmp2,
	        worldPoint0 = tmp3,
	        worldPoint1 = tmp4,
	        worldEdge = tmp5,
	        projected = tmp6,
	        penetrationVec = tmp7,
	        dist = tmp8,
	        worldNormal = tmp9,
	        numContacts = 0,
	        precision = typeof(precision) === 'number' ? precision : 0;
	
	    var found = Narrowphase.findSeparatingAxis(si,xi,ai,sj,xj,aj,sepAxis);
	    if(!found){
	        return 0;
	    }
	
	    // Make sure the separating axis is directed from shape i to shape j
	    sub(dist,xj,xi);
	    if(dot(sepAxis,dist) > 0){
	        vec2.scale(sepAxis,sepAxis,-1);
	    }
	
	    // Find edges with normals closest to the separating axis
	    var closestEdge1 = Narrowphase.getClosestEdge(si,ai,sepAxis,true), // Flipped axis
	        closestEdge2 = Narrowphase.getClosestEdge(sj,aj,sepAxis);
	
	    if(closestEdge1 === -1 || closestEdge2 === -1){
	        return 0;
	    }
	
	    // Loop over the shapes
	    for(var k=0; k<2; k++){
	
	        var closestEdgeA = closestEdge1,
	            closestEdgeB = closestEdge2,
	            shapeA =  si, shapeB =  sj,
	            offsetA = xi, offsetB = xj,
	            angleA = ai, angleB = aj,
	            bodyA = bi, bodyB = bj;
	
	        if(k === 0){
	            // Swap!
	            var tmp;
	            tmp = closestEdgeA;
	            closestEdgeA = closestEdgeB;
	            closestEdgeB = tmp;
	
	            tmp = shapeA;
	            shapeA = shapeB;
	            shapeB = tmp;
	
	            tmp = offsetA;
	            offsetA = offsetB;
	            offsetB = tmp;
	
	            tmp = angleA;
	            angleA = angleB;
	            angleB = tmp;
	
	            tmp = bodyA;
	            bodyA = bodyB;
	            bodyB = tmp;
	        }
	
	        // Loop over 2 points in convex B
	        for(var j=closestEdgeB; j<closestEdgeB+2; j++){
	
	            // Get world point
	            var v = shapeB.vertices[(j+shapeB.vertices.length)%shapeB.vertices.length];
	            vec2.rotate(worldPoint, v, angleB);
	            add(worldPoint, worldPoint, offsetB);
	
	            var insideNumEdges = 0;
	
	            // Loop over the 3 closest edges in convex A
	            for(var i=closestEdgeA-1; i<closestEdgeA+2; i++){
	
	                var v0 = shapeA.vertices[(i  +shapeA.vertices.length)%shapeA.vertices.length],
	                    v1 = shapeA.vertices[(i+1+shapeA.vertices.length)%shapeA.vertices.length];
	
	                // Construct the edge
	                vec2.rotate(worldPoint0, v0, angleA);
	                vec2.rotate(worldPoint1, v1, angleA);
	                add(worldPoint0, worldPoint0, offsetA);
	                add(worldPoint1, worldPoint1, offsetA);
	
	                sub(worldEdge, worldPoint1, worldPoint0);
	
	                vec2.rotate90cw(worldNormal, worldEdge); // Normal points out of convex 1
	                vec2.normalize(worldNormal,worldNormal);
	
	                sub(dist, worldPoint, worldPoint0);
	
	                var d = dot(worldNormal,dist);
	
	                if((i === closestEdgeA && d <= precision) || (i !== closestEdgeA && d <= 0)){
	                    insideNumEdges++;
	                }
	            }
	
	            if(insideNumEdges >= 3){
	
	                if(justTest){
	                    return true;
	                }
	
	                // worldPoint was on the "inside" side of each of the 3 checked edges.
	                // Project it to the center edge and use the projection direction as normal
	
	                // Create contact
	                var c = this.createContactEquation(bodyA,bodyB,shapeA,shapeB);
	                numContacts++;
	
	                // Get center edge from body A
	                var v0 = shapeA.vertices[(closestEdgeA)   % shapeA.vertices.length],
	                    v1 = shapeA.vertices[(closestEdgeA+1) % shapeA.vertices.length];
	
	                // Construct the edge
	                vec2.rotate(worldPoint0, v0, angleA);
	                vec2.rotate(worldPoint1, v1, angleA);
	                add(worldPoint0, worldPoint0, offsetA);
	                add(worldPoint1, worldPoint1, offsetA);
	
	                sub(worldEdge, worldPoint1, worldPoint0);
	
	                vec2.rotate90cw(c.normalA, worldEdge); // Normal points out of convex A
	                vec2.normalize(c.normalA,c.normalA);
	
	                sub(dist, worldPoint, worldPoint0); // From edge point to the penetrating point
	                var d = dot(c.normalA,dist);             // Penetration
	                vec2.scale(penetrationVec, c.normalA, d);     // Vector penetration
	
	                sub(c.contactPointA, worldPoint, offsetA);
	                sub(c.contactPointA, c.contactPointA, penetrationVec);
	                add(c.contactPointA, c.contactPointA, offsetA);
	                sub(c.contactPointA, c.contactPointA, bodyA.position);
	
	                sub(c.contactPointB, worldPoint, offsetB);
	                add(c.contactPointB, c.contactPointB, offsetB);
	                sub(c.contactPointB, c.contactPointB, bodyB.position);
	
	                this.contactEquations.push(c);
	
	                // Todo reduce to 1 friction equation if we have 2 contact points
	                if(!this.enableFrictionReduction){
	                    if(this.enableFriction){
	                        this.frictionEquations.push(this.createFrictionFromContact(c));
	                    }
	                }
	            }
	        }
	    }
	
	    if(this.enableFrictionReduction){
	        if(this.enableFriction && numContacts){
	            this.frictionEquations.push(this.createFrictionFromAverage(numContacts));
	        }
	    }
	
	    return numContacts;
	};
	
	// .projectConvex is called by other functions, need local tmp vectors
	var pcoa_tmp1 = vec2.fromValues(0,0);
	
	/**
	 * Project a Convex onto a world-oriented axis
	 * @method projectConvexOntoAxis
	 * @static
	 * @param  {Convex} convexShape
	 * @param  {Array} convexOffset
	 * @param  {Number} convexAngle
	 * @param  {Array} worldAxis
	 * @param  {Array} result
	 */
	Narrowphase.projectConvexOntoAxis = function(convexShape, convexOffset, convexAngle, worldAxis, result){
	    var max=null,
	        min=null,
	        v,
	        value,
	        localAxis = pcoa_tmp1;
	
	    // Convert the axis to local coords of the body
	    vec2.rotate(localAxis, worldAxis, -convexAngle);
	
	    // Get projected position of all vertices
	    for(var i=0; i<convexShape.vertices.length; i++){
	        v = convexShape.vertices[i];
	        value = dot(v,localAxis);
	        if(max === null || value > max){
	            max = value;
	        }
	        if(min === null || value < min){
	            min = value;
	        }
	    }
	
	    if(min > max){
	        var t = min;
	        min = max;
	        max = t;
	    }
	
	    // Project the position of the body onto the axis - need to add this to the result
	    var offset = dot(convexOffset, worldAxis);
	
	    vec2.set( result, min + offset, max + offset);
	};
	
	// .findSeparatingAxis is called by other functions, need local tmp vectors
	var fsa_tmp1 = vec2.fromValues(0,0)
	,   fsa_tmp2 = vec2.fromValues(0,0)
	,   fsa_tmp3 = vec2.fromValues(0,0)
	,   fsa_tmp4 = vec2.fromValues(0,0)
	,   fsa_tmp5 = vec2.fromValues(0,0)
	,   fsa_tmp6 = vec2.fromValues(0,0);
	
	/**
	 * Find a separating axis between the shapes, that maximizes the separating distance between them.
	 * @method findSeparatingAxis
	 * @static
	 * @param  {Convex}     c1
	 * @param  {Array}      offset1
	 * @param  {Number}     angle1
	 * @param  {Convex}     c2
	 * @param  {Array}      offset2
	 * @param  {Number}     angle2
	 * @param  {Array}      sepAxis     The resulting axis
	 * @return {Boolean}                Whether the axis could be found.
	 */
	Narrowphase.findSeparatingAxis = function(c1,offset1,angle1,c2,offset2,angle2,sepAxis){
	    var maxDist = null,
	        overlap = false,
	        found = false,
	        edge = fsa_tmp1,
	        worldPoint0 = fsa_tmp2,
	        worldPoint1 = fsa_tmp3,
	        normal = fsa_tmp4,
	        span1 = fsa_tmp5,
	        span2 = fsa_tmp6;
	
	    if(c1 instanceof Box && c2 instanceof Box){
	
	        for(var j=0; j!==2; j++){
	            var c = c1,
	                angle = angle1;
	            if(j===1){
	                c = c2;
	                angle = angle2;
	            }
	
	            for(var i=0; i!==2; i++){
	
	                // Get the world edge
	                if(i === 0){
	                    vec2.set(normal, 0, 1);
	                } else if(i === 1) {
	                    vec2.set(normal, 1, 0);
	                }
	                if(angle !== 0){
	                    vec2.rotate(normal, normal, angle);
	                }
	
	                // Project hulls onto that normal
	                Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);
	                Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);
	
	                // Order by span position
	                var a=span1,
	                    b=span2,
	                    swapped = false;
	                if(span1[0] > span2[0]){
	                    b=span1;
	                    a=span2;
	                    swapped = true;
	                }
	
	                // Get separating distance
	                var dist = b[0] - a[1];
	                overlap = (dist <= 0);
	
	                if(maxDist===null || dist > maxDist){
	                    vec2.copy(sepAxis, normal);
	                    maxDist = dist;
	                    found = overlap;
	                }
	            }
	        }
	
	    } else {
	
	        for(var j=0; j!==2; j++){
	            var c = c1,
	                angle = angle1;
	            if(j===1){
	                c = c2;
	                angle = angle2;
	            }
	
	            for(var i=0; i!==c.vertices.length; i++){
	                // Get the world edge
	                vec2.rotate(worldPoint0, c.vertices[i], angle);
	                vec2.rotate(worldPoint1, c.vertices[(i+1)%c.vertices.length], angle);
	
	                sub(edge, worldPoint1, worldPoint0);
	
	                // Get normal - just rotate 90 degrees since vertices are given in CCW
	                vec2.rotate90cw(normal, edge);
	                vec2.normalize(normal,normal);
	
	                // Project hulls onto that normal
	                Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);
	                Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);
	
	                // Order by span position
	                var a=span1,
	                    b=span2,
	                    swapped = false;
	                if(span1[0] > span2[0]){
	                    b=span1;
	                    a=span2;
	                    swapped = true;
	                }
	
	                // Get separating distance
	                var dist = b[0] - a[1];
	                overlap = (dist <= 0);
	
	                if(maxDist===null || dist > maxDist){
	                    vec2.copy(sepAxis, normal);
	                    maxDist = dist;
	                    found = overlap;
	                }
	            }
	        }
	    }
	
	
	    /*
	    // Needs to be tested some more
	    for(var j=0; j!==2; j++){
	        var c = c1,
	            angle = angle1;
	        if(j===1){
	            c = c2;
	            angle = angle2;
	        }
	
	        for(var i=0; i!==c.axes.length; i++){
	
	            var normal = c.axes[i];
	
	            // Project hulls onto that normal
	            Narrowphase.projectConvexOntoAxis(c1, offset1, angle1, normal, span1);
	            Narrowphase.projectConvexOntoAxis(c2, offset2, angle2, normal, span2);
	
	            // Order by span position
	            var a=span1,
	                b=span2,
	                swapped = false;
	            if(span1[0] > span2[0]){
	                b=span1;
	                a=span2;
	                swapped = true;
	            }
	
	            // Get separating distance
	            var dist = b[0] - a[1];
	            overlap = (dist <= Narrowphase.convexPrecision);
	
	            if(maxDist===null || dist > maxDist){
	                vec2.copy(sepAxis, normal);
	                maxDist = dist;
	                found = overlap;
	            }
	        }
	    }
	    */
	
	    return found;
	};
	
	// .getClosestEdge is called by other functions, need local tmp vectors
	var gce_tmp1 = vec2.fromValues(0,0)
	,   gce_tmp2 = vec2.fromValues(0,0)
	,   gce_tmp3 = vec2.fromValues(0,0);
	
	/**
	 * Get the edge that has a normal closest to an axis.
	 * @method getClosestEdge
	 * @static
	 * @param  {Convex}     c
	 * @param  {Number}     angle
	 * @param  {Array}      axis
	 * @param  {Boolean}    flip
	 * @return {Number}             Index of the edge that is closest. This index and the next spans the resulting edge. Returns -1 if failed.
	 */
	Narrowphase.getClosestEdge = function(c,angle,axis,flip){
	    var localAxis = gce_tmp1,
	        edge = gce_tmp2,
	        normal = gce_tmp3;
	
	    // Convert the axis to local coords of the body
	    vec2.rotate(localAxis, axis, -angle);
	    if(flip){
	        vec2.scale(localAxis,localAxis,-1);
	    }
	
	    var closestEdge = -1,
	        N = c.vertices.length,
	        maxDot = -1;
	    for(var i=0; i!==N; i++){
	        // Get the edge
	        sub(edge, c.vertices[(i+1)%N], c.vertices[i%N]);
	
	        // Get normal - just rotate 90 degrees since vertices are given in CCW
	        vec2.rotate90cw(normal, edge);
	        vec2.normalize(normal,normal);
	
	        var d = dot(normal,localAxis);
	        if(closestEdge === -1 || d > maxDot){
	            closestEdge = i % N;
	            maxDot = d;
	        }
	    }
	
	    return closestEdge;
	};
	
	var circleHeightfield_candidate = vec2.create(),
	    circleHeightfield_dist = vec2.create(),
	    circleHeightfield_v0 = vec2.create(),
	    circleHeightfield_v1 = vec2.create(),
	    circleHeightfield_minCandidate = vec2.create(),
	    circleHeightfield_worldNormal = vec2.create(),
	    circleHeightfield_minCandidateNormal = vec2.create();
	
	/**
	 * @method circleHeightfield
	 * @param  {Body}           bi
	 * @param  {Circle}         si
	 * @param  {Array}          xi
	 * @param  {Body}           bj
	 * @param  {Heightfield}    sj
	 * @param  {Array}          xj
	 * @param  {Number}         aj
	 */
	Narrowphase.prototype[Shape.CIRCLE | Shape.HEIGHTFIELD] =
	Narrowphase.prototype.circleHeightfield = function( circleBody,circleShape,circlePos,circleAngle,
	                                                    hfBody,hfShape,hfPos,hfAngle, justTest, radius ){
	    var data = hfShape.heights,
	        radius = radius || circleShape.radius,
	        w = hfShape.elementWidth,
	        dist = circleHeightfield_dist,
	        candidate = circleHeightfield_candidate,
	        minCandidate = circleHeightfield_minCandidate,
	        minCandidateNormal = circleHeightfield_minCandidateNormal,
	        worldNormal = circleHeightfield_worldNormal,
	        v0 = circleHeightfield_v0,
	        v1 = circleHeightfield_v1;
	
	    // Get the index of the points to test against
	    var idxA = Math.floor( (circlePos[0] - radius - hfPos[0]) / w ),
	        idxB = Math.ceil(  (circlePos[0] + radius - hfPos[0]) / w );
	
	    /*if(idxB < 0 || idxA >= data.length)
	        return justTest ? false : 0;*/
	
	    if(idxA < 0){
	        idxA = 0;
	    }
	    if(idxB >= data.length){
	        idxB = data.length-1;
	    }
	
	    // Get max and min
	    var max = data[idxA],
	        min = data[idxB];
	    for(var i=idxA; i<idxB; i++){
	        if(data[i] < min){
	            min = data[i];
	        }
	        if(data[i] > max){
	            max = data[i];
	        }
	    }
	
	    if(circlePos[1]-radius > max){
	        return justTest ? false : 0;
	    }
	
	    /*
	    if(circlePos[1]+radius < min){
	        // Below the minimum point... We can just guess.
	        // TODO
	    }
	    */
	
	    // 1. Check so center of circle is not inside the field. If it is, this wont work...
	    // 2. For each edge
	    // 2. 1. Get point on circle that is closest to the edge (scale normal with -radius)
	    // 2. 2. Check if point is inside.
	
	    var found = false;
	
	    // Check all edges first
	    for(var i=idxA; i<idxB; i++){
	
	        // Get points
	        vec2.set(v0,     i*w, data[i]  );
	        vec2.set(v1, (i+1)*w, data[i+1]);
	        vec2.add(v0,v0,hfPos);
	        vec2.add(v1,v1,hfPos);
	
	        // Get normal
	        vec2.sub(worldNormal, v1, v0);
	        vec2.rotate(worldNormal, worldNormal, Math.PI/2);
	        vec2.normalize(worldNormal,worldNormal);
	
	        // Get point on circle, closest to the edge
	        vec2.scale(candidate,worldNormal,-radius);
	        vec2.add(candidate,candidate,circlePos);
	
	        // Distance from v0 to the candidate point
	        vec2.sub(dist,candidate,v0);
	
	        // Check if it is in the element "stick"
	        var d = vec2.dot(dist,worldNormal);
	        if(candidate[0] >= v0[0] && candidate[0] < v1[0] && d <= 0){
	
	            if(justTest){
	                return true;
	            }
	
	            found = true;
	
	            // Store the candidate point, projected to the edge
	            vec2.scale(dist,worldNormal,-d);
	            vec2.add(minCandidate,candidate,dist);
	            vec2.copy(minCandidateNormal,worldNormal);
	
	            var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);
	
	            // Normal is out of the heightfield
	            vec2.copy(c.normalA, minCandidateNormal);
	
	            // Vector from circle to heightfield
	            vec2.scale(c.contactPointB,  c.normalA, -radius);
	            add(c.contactPointB, c.contactPointB, circlePos);
	            sub(c.contactPointB, c.contactPointB, circleBody.position);
	
	            vec2.copy(c.contactPointA, minCandidate);
	            vec2.sub(c.contactPointA, c.contactPointA, hfBody.position);
	
	            this.contactEquations.push(c);
	
	            if(this.enableFriction){
	                this.frictionEquations.push( this.createFrictionFromContact(c) );
	            }
	        }
	    }
	
	    // Check all vertices
	    found = false;
	    if(radius > 0){
	        for(var i=idxA; i<=idxB; i++){
	
	            // Get point
	            vec2.set(v0, i*w, data[i]);
	            vec2.add(v0,v0,hfPos);
	
	            vec2.sub(dist, circlePos, v0);
	
	            if(vec2.squaredLength(dist) < Math.pow(radius, 2)){
	
	                if(justTest){
	                    return true;
	                }
	
	                found = true;
	
	                var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);
	
	                // Construct normal - out of heightfield
	                vec2.copy(c.normalA, dist);
	                vec2.normalize(c.normalA,c.normalA);
	
	                vec2.scale(c.contactPointB, c.normalA, -radius);
	                add(c.contactPointB, c.contactPointB, circlePos);
	                sub(c.contactPointB, c.contactPointB, circleBody.position);
	
	                sub(c.contactPointA, v0, hfPos);
	                add(c.contactPointA, c.contactPointA, hfPos);
	                sub(c.contactPointA, c.contactPointA, hfBody.position);
	
	                this.contactEquations.push(c);
	
	                if(this.enableFriction){
	                    this.frictionEquations.push(this.createFrictionFromContact(c));
	                }
	            }
	        }
	    }
	
	    if(found){
	        return 1;
	    }
	
	    return 0;
	
	};
	
	var convexHeightfield_v0 = vec2.create(),
	    convexHeightfield_v1 = vec2.create(),
	    convexHeightfield_tilePos = vec2.create(),
	    convexHeightfield_tempConvexShape = new Convex({ vertices: [vec2.create(),vec2.create(),vec2.create(),vec2.create()] });
	/**
	 * @method circleHeightfield
	 * @param  {Body}           bi
	 * @param  {Circle}         si
	 * @param  {Array}          xi
	 * @param  {Body}           bj
	 * @param  {Heightfield}    sj
	 * @param  {Array}          xj
	 * @param  {Number}         aj
	 */
	Narrowphase.prototype[Shape.BOX | Shape.HEIGHTFIELD] =
	Narrowphase.prototype[Shape.CONVEX | Shape.HEIGHTFIELD] =
	Narrowphase.prototype.convexHeightfield = function( convexBody,convexShape,convexPos,convexAngle,
	                                                    hfBody,hfShape,hfPos,hfAngle, justTest ){
	    var data = hfShape.heights,
	        w = hfShape.elementWidth,
	        v0 = convexHeightfield_v0,
	        v1 = convexHeightfield_v1,
	        tilePos = convexHeightfield_tilePos,
	        tileConvex = convexHeightfield_tempConvexShape;
	
	    // Get the index of the points to test against
	    var idxA = Math.floor( (convexBody.aabb.lowerBound[0] - hfPos[0]) / w ),
	        idxB = Math.ceil(  (convexBody.aabb.upperBound[0] - hfPos[0]) / w );
	
	    if(idxA < 0){
	        idxA = 0;
	    }
	    if(idxB >= data.length){
	        idxB = data.length-1;
	    }
	
	    // Get max and min
	    var max = data[idxA],
	        min = data[idxB];
	    for(var i=idxA; i<idxB; i++){
	        if(data[i] < min){
	            min = data[i];
	        }
	        if(data[i] > max){
	            max = data[i];
	        }
	    }
	
	    if(convexBody.aabb.lowerBound[1] > max){
	        return justTest ? false : 0;
	    }
	
	    var found = false;
	    var numContacts = 0;
	
	    // Loop over all edges
	    // TODO: If possible, construct a convex from several data points (need o check if the points make a convex shape)
	    for(var i=idxA; i<idxB; i++){
	
	        // Get points
	        vec2.set(v0,     i*w, data[i]  );
	        vec2.set(v1, (i+1)*w, data[i+1]);
	        vec2.add(v0,v0,hfPos);
	        vec2.add(v1,v1,hfPos);
	
	        // Construct a convex
	        var tileHeight = 100; // todo
	        vec2.set(tilePos, (v1[0] + v0[0])*0.5, (v1[1] + v0[1] - tileHeight)*0.5);
	
	        vec2.sub(tileConvex.vertices[0], v1, tilePos);
	        vec2.sub(tileConvex.vertices[1], v0, tilePos);
	        vec2.copy(tileConvex.vertices[2], tileConvex.vertices[1]);
	        vec2.copy(tileConvex.vertices[3], tileConvex.vertices[0]);
	        tileConvex.vertices[2][1] -= tileHeight;
	        tileConvex.vertices[3][1] -= tileHeight;
	
	        // Do convex collision
	        numContacts += this.convexConvex(   convexBody, convexShape, convexPos, convexAngle,
	                                            hfBody, tileConvex, tilePos, 0, justTest);
	    }
	
	    return numContacts;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(9);
	
	module.exports = TupleDictionary;
	
	/**
	 * @class TupleDictionary
	 * @constructor
	 */
	function TupleDictionary() {
	
	    /**
	     * The data storage
	     * @property data
	     * @type {Object}
	     */
	    this.data = {};
	
	    /**
	     * Keys that are currently used.
	     * @property {Array} keys
	     */
	    this.keys = [];
	}
	
	/**
	 * Generate a key given two integers
	 * @method getKey
	 * @param  {number} i
	 * @param  {number} j
	 * @return {string}
	 */
	TupleDictionary.prototype.getKey = function(id1, id2) {
	    id1 = id1|0;
	    id2 = id2|0;
	
	    if ( (id1|0) === (id2|0) ){
	        return -1;
	    }
	
	    // valid for values < 2^16
	    return ((id1|0) > (id2|0) ?
	        (id1 << 16) | (id2 & 0xFFFF) :
	        (id2 << 16) | (id1 & 0xFFFF))|0
	        ;
	};
	
	/**
	 * @method getByKey
	 * @param  {Number} key
	 * @return {Object}
	 */
	TupleDictionary.prototype.getByKey = function(key) {
	    key = key|0;
	    return this.data[key];
	};
	
	/**
	 * @method get
	 * @param  {Number} i
	 * @param  {Number} j
	 * @return {Number}
	 */
	TupleDictionary.prototype.get = function(i, j) {
	    return this.data[this.getKey(i, j)];
	};
	
	/**
	 * Set a value.
	 * @method set
	 * @param  {Number} i
	 * @param  {Number} j
	 * @param {Number} value
	 */
	TupleDictionary.prototype.set = function(i, j, value) {
	    if(!value){
	        throw new Error("No data!");
	    }
	
	    var key = this.getKey(i, j);
	
	    // Check if key already exists
	    if(!this.data[key]){
	        this.keys.push(key);
	    }
	
	    this.data[key] = value;
	
	    return key;
	};
	
	/**
	 * Remove all data.
	 * @method reset
	 */
	TupleDictionary.prototype.reset = function() {
	    var data = this.data,
	        keys = this.keys;
	
	    var l = keys.length;
	    while(l--) {
	        delete data[keys[l]];
	    }
	
	    keys.length = 0;
	};
	
	/**
	 * Copy another TupleDictionary. Note that all data in this dictionary will be removed.
	 * @method copy
	 * @param {TupleDictionary} dict The TupleDictionary to copy into this one.
	 */
	TupleDictionary.prototype.copy = function(dict) {
	    this.reset();
	    Utils.appendArray(this.keys, dict.keys);
	    var l = dict.keys.length;
	    while(l--){
	        var key = dict.keys[l];
	        this.data[key] = dict.data[key];
	    }
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8)
	,   Shape = __webpack_require__(19)
	,   Convex = __webpack_require__(18);
	
	module.exports = Box;
	
	/**
	 * Box shape class.
	 * @class Box
	 * @constructor
	 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
	 * @param {Number} [options.width=1] Total width of the box
	 * @param {Number} [options.height=1] Total height of the box
	 * @extends Convex
	 */
	function Box(options){
	    if(typeof(arguments[0]) === 'number' && typeof(arguments[1]) === 'number'){
	        options = {
	            width: arguments[0],
	            height: arguments[1]
	        };
	        console.warn('The Rectangle has been renamed to Box and its constructor signature has changed. Please use the following format: new Box({ width: 1, height: 1, ... })');
	    }
	    options = options || {};
	
	    /**
	     * Total width of the box
	     * @property width
	     * @type {Number}
	     */
	    var width = this.width = options.width || 1;
	
	    /**
	     * Total height of the box
	     * @property height
	     * @type {Number}
	     */
	    var height = this.height = options.height || 1;
	
	    var verts = [
	        vec2.fromValues(-width/2, -height/2),
	        vec2.fromValues( width/2, -height/2),
	        vec2.fromValues( width/2,  height/2),
	        vec2.fromValues(-width/2,  height/2)
	    ];
	    var axes = [
	        vec2.fromValues(1, 0),
	        vec2.fromValues(0, 1)
	    ];
	
	    options.vertices = verts;
	    options.axes = axes;
	    options.type = Shape.BOX;
	    Convex.call(this, options);
	}
	Box.prototype = new Convex();
	Box.prototype.constructor = Box;
	
	/**
	 * Compute moment of inertia
	 * @method computeMomentOfInertia
	 * @param  {Number} mass
	 * @return {Number}
	 */
	Box.prototype.computeMomentOfInertia = function(mass){
	    var w = this.width,
	        h = this.height;
	    return mass * (h*h + w*w) / 12;
	};
	
	/**
	 * Update the bounding radius
	 * @method updateBoundingRadius
	 */
	Box.prototype.updateBoundingRadius = function(){
	    var w = this.width,
	        h = this.height;
	    this.boundingRadius = Math.sqrt(w*w + h*h) / 2;
	};
	
	var corner1 = vec2.create(),
	    corner2 = vec2.create(),
	    corner3 = vec2.create(),
	    corner4 = vec2.create();
	
	/**
	 * @method computeAABB
	 * @param  {AABB}   out      The resulting AABB.
	 * @param  {Array}  position
	 * @param  {Number} angle
	 */
	Box.prototype.computeAABB = function(out, position, angle){
	    out.setFromPoints(this.vertices,position,angle,0);
	};
	
	Box.prototype.updateArea = function(){
	    this.area = this.width * this.height;
	};
	


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var Circle = __webpack_require__(26),
	    Plane = __webpack_require__(46),
	    Shape = __webpack_require__(19),
	    Particle = __webpack_require__(47),
	    Broadphase = __webpack_require__(24),
	    vec2 = __webpack_require__(8);
	
	module.exports = NaiveBroadphase;
	
	/**
	 * Naive broadphase implementation. Does N^2 tests.
	 *
	 * @class NaiveBroadphase
	 * @constructor
	 * @extends Broadphase
	 */
	function NaiveBroadphase(){
	    Broadphase.call(this, Broadphase.NAIVE);
	}
	NaiveBroadphase.prototype = new Broadphase();
	NaiveBroadphase.prototype.constructor = NaiveBroadphase;
	
	/**
	 * Get the colliding pairs
	 * @method getCollisionPairs
	 * @param  {World} world
	 * @return {Array}
	 */
	NaiveBroadphase.prototype.getCollisionPairs = function(world){
	    var bodies = world.bodies,
	        result = this.result;
	
	    result.length = 0;
	
	    for(var i=0, Ncolliding=bodies.length; i!==Ncolliding; i++){
	        var bi = bodies[i];
	
	        for(var j=0; j<i; j++){
	            var bj = bodies[j];
	
	            if(Broadphase.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
	                result.push(bi,bj);
	            }
	        }
	    }
	
	    return result;
	};
	
	/**
	 * Returns all the bodies within an AABB.
	 * @method aabbQuery
	 * @param  {World} world
	 * @param  {AABB} aabb
	 * @param {array} result An array to store resulting bodies in.
	 * @return {array}
	 */
	NaiveBroadphase.prototype.aabbQuery = function(world, aabb, result){
	    result = result || [];
	
	    var bodies = world.bodies;
	    for(var i = 0; i < bodies.length; i++){
	        var b = bodies[i];
	
	        if(b.aabbNeedsUpdate){
	            b.updateAABB();
	        }
	
	        if(b.aabb.overlaps(aabb)){
	            result.push(b);
	        }
	    }
	
	    return result;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var Shape =  __webpack_require__(19)
	,    vec2 =  __webpack_require__(8)
	,    Utils = __webpack_require__(9);
	
	module.exports = Plane;
	
	/**
	 * Plane shape class. The plane is facing in the Y direction.
	 * @class Plane
	 * @extends Shape
	 * @constructor
	 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
	 */
	function Plane(options){
	    options = options || {};
	    options.type = Shape.PLANE;
	    Shape.call(this, options);
	}
	Plane.prototype = new Shape();
	Plane.prototype.constructor = Plane;
	
	/**
	 * Compute moment of inertia
	 * @method computeMomentOfInertia
	 */
	Plane.prototype.computeMomentOfInertia = function(mass){
	    return 0; // Plane is infinite. The inertia should therefore be infinty but by convention we set 0 here
	};
	
	/**
	 * Update the bounding radius
	 * @method updateBoundingRadius
	 */
	Plane.prototype.updateBoundingRadius = function(){
	    this.boundingRadius = Number.MAX_VALUE;
	};
	
	/**
	 * @method computeAABB
	 * @param  {AABB}   out
	 * @param  {Array}  position
	 * @param  {Number} angle
	 */
	Plane.prototype.computeAABB = function(out, position, angle){
	    var a = angle % (2 * Math.PI);
	    var set = vec2.set;
	    var max = 1e7;
	    var lowerBound = out.lowerBound;
	    var upperBound = out.upperBound;
	
	    // Set max bounds
	    set(lowerBound, -max, -max);
	    set(upperBound,  max,  max);
	
	    if(a === 0){
	        // y goes from -inf to 0
	        upperBound[1] = 0;
	        // set(lowerBound, -max, -max);
	        // set(upperBound,  max,  0);
	
	    } else if(a === Math.PI / 2){
	
	        // x goes from 0 to inf
	        lowerBound[0] = 0;
	        // set(lowerBound, 0, -max);
	        // set(upperBound,      max,  max);
	
	    } else if(a === Math.PI){
	
	        // y goes from 0 to inf
	        lowerBound[1] = 0;
	        // set(lowerBound, -max, 0);
	        // set(upperBound,  max, max);
	
	    } else if(a === 3*Math.PI/2){
	
	        // x goes from -inf to 0
	        upperBound[0] = 0;
	        // set(lowerBound, -max,     -max);
	        // set(upperBound,  0,  max);
	
	    }
	};
	
	Plane.prototype.updateArea = function(){
	    this.area = Number.MAX_VALUE;
	};
	
	var intersectPlane_planePointToFrom = vec2.create();
	var intersectPlane_dir_scaled_with_t = vec2.create();
	var intersectPlane_hitPoint = vec2.create();
	var intersectPlane_normal = vec2.create();
	var intersectPlane_len = vec2.create();
	
	/**
	 * @method raycast
	 * @param  {RayResult} result
	 * @param  {Ray} ray
	 * @param  {array} position
	 * @param  {number} angle
	 */
	Plane.prototype.raycast = function(result, ray, position, angle){
	    var from = ray.from;
	    var to = ray.to;
	    var direction = ray.direction;
	    var planePointToFrom = intersectPlane_planePointToFrom;
	    var dir_scaled_with_t = intersectPlane_dir_scaled_with_t;
	    var hitPoint = intersectPlane_hitPoint;
	    var normal = intersectPlane_normal;
	    var len = intersectPlane_len;
	
	    // Get plane normal
	    vec2.set(normal, 0, 1);
	    vec2.rotate(normal, normal, angle);
	
	    vec2.sub(len, from, position);
	    var planeToFrom = vec2.dot(len, normal);
	    vec2.sub(len, to, position);
	    var planeToTo = vec2.dot(len, normal);
	
	    if(planeToFrom * planeToTo > 0){
	        // "from" and "to" are on the same side of the plane... bail out
	        return;
	    }
	
	    if(vec2.squaredDistance(from, to) < planeToFrom * planeToFrom){
	        return;
	    }
	
	    var n_dot_dir = vec2.dot(normal, direction);
	
	    vec2.sub(planePointToFrom, from, position);
	    var t = -vec2.dot(normal, planePointToFrom) / n_dot_dir / ray.length;
	
	    ray.reportIntersection(result, t, normal, -1);
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(19)
	,   vec2 = __webpack_require__(8);
	
	module.exports = Particle;
	
	/**
	 * Particle shape class.
	 * @class Particle
	 * @constructor
	 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
	 * @extends Shape
	 */
	function Particle(options){
	    options = options || {};
		options.type = Shape.PARTICLE;
	    Shape.call(this, options);
	}
	Particle.prototype = new Shape();
	Particle.prototype.constructor = Particle;
	
	Particle.prototype.computeMomentOfInertia = function(mass){
	    return 0; // Can't rotate a particle
	};
	
	Particle.prototype.updateBoundingRadius = function(){
	    this.boundingRadius = 0;
	};
	
	/**
	 * @method computeAABB
	 * @param  {AABB}   out
	 * @param  {Array}  position
	 * @param  {Number} angle
	 */
	Particle.prototype.computeAABB = function(out, position, angle){
	    vec2.copy(out.lowerBound, position);
	    vec2.copy(out.upperBound, position);
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(27)
	,   Equation = __webpack_require__(11)
	,   RotationalVelocityEquation = __webpack_require__(49)
	,   RotationalLockEquation = __webpack_require__(50)
	,   vec2 = __webpack_require__(8);
	
	module.exports = RevoluteConstraint;
	
	var worldPivotA = vec2.create(),
	    worldPivotB = vec2.create(),
	    xAxis = vec2.fromValues(1,0),
	    yAxis = vec2.fromValues(0,1),
	    g = vec2.create();
	
	/**
	 * Connects two bodies at given offset points, letting them rotate relative to each other around this point.
	 * @class RevoluteConstraint
	 * @constructor
	 * @author schteppe
	 * @param {Body}    bodyA
	 * @param {Body}    bodyB
	 * @param {Object}  [options]
	 * @param {Array}   [options.worldPivot] A pivot point given in world coordinates. If specified, localPivotA and localPivotB are automatically computed from this value.
	 * @param {Array}   [options.localPivotA] The point relative to the center of mass of bodyA which bodyA is constrained to.
	 * @param {Array}   [options.localPivotB] See localPivotA.
	 * @param {Number}  [options.maxForce] The maximum force that should be applied to constrain the bodies.
	 * @extends Constraint
	 *
	 * @example
	 *     // This will create a revolute constraint between two bodies with pivot point in between them.
	 *     var bodyA = new Body({ mass: 1, position: [-1, 0] });
	 *     var bodyB = new Body({ mass: 1, position: [1, 0] });
	 *     var constraint = new RevoluteConstraint(bodyA, bodyB, {
	 *         worldPivot: [0, 0]
	 *     });
	 *     world.addConstraint(constraint);
	 *
	 *     // Using body-local pivot points, the constraint could have been constructed like this:
	 *     var constraint = new RevoluteConstraint(bodyA, bodyB, {
	 *         localPivotA: [1, 0],
	 *         localPivotB: [-1, 0]
	 *     });
	 */
	function RevoluteConstraint(bodyA, bodyB, options){
	    options = options || {};
	    Constraint.call(this,bodyA,bodyB,Constraint.REVOLUTE,options);
	
	    var maxForce = this.maxForce = typeof(options.maxForce) !== "undefined" ? options.maxForce : Number.MAX_VALUE;
	
	    /**
	     * @property {Array} pivotA
	     */
	    this.pivotA = vec2.create();
	
	    /**
	     * @property {Array} pivotB
	     */
	    this.pivotB = vec2.create();
	
	    if(options.worldPivot){
	        // Compute pivotA and pivotB
	        vec2.sub(this.pivotA, options.worldPivot, bodyA.position);
	        vec2.sub(this.pivotB, options.worldPivot, bodyB.position);
	        // Rotate to local coordinate system
	        vec2.rotate(this.pivotA, this.pivotA, -bodyA.angle);
	        vec2.rotate(this.pivotB, this.pivotB, -bodyB.angle);
	    } else {
	        // Get pivotA and pivotB
	        vec2.copy(this.pivotA, options.localPivotA);
	        vec2.copy(this.pivotB, options.localPivotB);
	    }
	
	    // Equations to be fed to the solver
	    var eqs = this.equations = [
	        new Equation(bodyA,bodyB,-maxForce,maxForce),
	        new Equation(bodyA,bodyB,-maxForce,maxForce),
	    ];
	
	    var x = eqs[0];
	    var y = eqs[1];
	    var that = this;
	
	    x.computeGq = function(){
	        vec2.rotate(worldPivotA, that.pivotA, bodyA.angle);
	        vec2.rotate(worldPivotB, that.pivotB, bodyB.angle);
	        vec2.add(g, bodyB.position, worldPivotB);
	        vec2.sub(g, g, bodyA.position);
	        vec2.sub(g, g, worldPivotA);
	        return vec2.dot(g,xAxis);
	    };
	
	    y.computeGq = function(){
	        vec2.rotate(worldPivotA, that.pivotA, bodyA.angle);
	        vec2.rotate(worldPivotB, that.pivotB, bodyB.angle);
	        vec2.add(g, bodyB.position, worldPivotB);
	        vec2.sub(g, g, bodyA.position);
	        vec2.sub(g, g, worldPivotA);
	        return vec2.dot(g,yAxis);
	    };
	
	    y.minForce = x.minForce = -maxForce;
	    y.maxForce = x.maxForce =  maxForce;
	
	    this.motorEquation = new RotationalVelocityEquation(bodyA,bodyB);
	
	    /**
	     * Indicates whether the motor is enabled. Use .enableMotor() to enable the constraint motor.
	     * @property {Boolean} motorEnabled
	     * @readOnly
	     */
	    this.motorEnabled = false;
	
	    /**
	     * The constraint position.
	     * @property angle
	     * @type {Number}
	     * @readOnly
	     */
	    this.angle = 0;
	
	    /**
	     * Set to true to enable lower limit
	     * @property lowerLimitEnabled
	     * @type {Boolean}
	     */
	    this.lowerLimitEnabled = false;
	
	    /**
	     * Set to true to enable upper limit
	     * @property upperLimitEnabled
	     * @type {Boolean}
	     */
	    this.upperLimitEnabled = false;
	
	    /**
	     * The lower limit on the constraint angle.
	     * @property lowerLimit
	     * @type {Boolean}
	     */
	    this.lowerLimit = 0;
	
	    /**
	     * The upper limit on the constraint angle.
	     * @property upperLimit
	     * @type {Boolean}
	     */
	    this.upperLimit = 0;
	
	    this.upperLimitEquation = new RotationalLockEquation(bodyA,bodyB);
	    this.lowerLimitEquation = new RotationalLockEquation(bodyA,bodyB);
	    this.upperLimitEquation.minForce = 0;
	    this.lowerLimitEquation.maxForce = 0;
	}
	RevoluteConstraint.prototype = new Constraint();
	RevoluteConstraint.prototype.constructor = RevoluteConstraint;
	
	/**
	 * Set the constraint angle limits.
	 * @method setLimits
	 * @param {number} lower Lower angle limit.
	 * @param {number} upper Upper angle limit.
	 */
	RevoluteConstraint.prototype.setLimits = function (lower, upper) {
	    if(typeof(lower) === 'number'){
	        this.lowerLimit = lower;
	        this.lowerLimitEnabled = true;
	    } else {
	        this.lowerLimit = lower;
	        this.lowerLimitEnabled = false;
	    }
	
	    if(typeof(upper) === 'number'){
	        this.upperLimit = upper;
	        this.upperLimitEnabled = true;
	    } else {
	        this.upperLimit = upper;
	        this.upperLimitEnabled = false;
	    }
	};
	
	RevoluteConstraint.prototype.update = function(){
	    var bodyA =  this.bodyA,
	        bodyB =  this.bodyB,
	        pivotA = this.pivotA,
	        pivotB = this.pivotB,
	        eqs =    this.equations,
	        normal = eqs[0],
	        tangent= eqs[1],
	        x = eqs[0],
	        y = eqs[1],
	        upperLimit = this.upperLimit,
	        lowerLimit = this.lowerLimit,
	        upperLimitEquation = this.upperLimitEquation,
	        lowerLimitEquation = this.lowerLimitEquation;
	
	    var relAngle = this.angle = bodyB.angle - bodyA.angle;
	
	    if(this.upperLimitEnabled && relAngle > upperLimit){
	        upperLimitEquation.angle = upperLimit;
	        if(eqs.indexOf(upperLimitEquation) === -1){
	            eqs.push(upperLimitEquation);
	        }
	    } else {
	        var idx = eqs.indexOf(upperLimitEquation);
	        if(idx !== -1){
	            eqs.splice(idx,1);
	        }
	    }
	
	    if(this.lowerLimitEnabled && relAngle < lowerLimit){
	        lowerLimitEquation.angle = lowerLimit;
	        if(eqs.indexOf(lowerLimitEquation) === -1){
	            eqs.push(lowerLimitEquation);
	        }
	    } else {
	        var idx = eqs.indexOf(lowerLimitEquation);
	        if(idx !== -1){
	            eqs.splice(idx,1);
	        }
	    }
	
	    /*
	
	    The constraint violation is
	
	        g = xj + rj - xi - ri
	
	    ...where xi and xj are the body positions and ri and rj world-oriented offset vectors. Differentiate:
	
	        gdot = vj + wj x rj - vi - wi x ri
	
	    We split this into x and y directions. (let x and y be unit vectors along the respective axes)
	
	        gdot * x = ( vj + wj x rj - vi - wi x ri ) * x
	                 = ( vj*x + (wj x rj)*x -vi*x -(wi x ri)*x
	                 = ( vj*x + (rj x x)*wj -vi*x -(ri x x)*wi
	                 = [ -x   -(ri x x)   x   (rj x x)] * [vi wi vj wj]
	                 = G*W
	
	    ...and similar for y. We have then identified the jacobian entries for x and y directions:
	
	        Gx = [ x   (rj x x)   -x   -(ri x x)]
	        Gy = [ y   (rj x y)   -y   -(ri x y)]
	
	     */
	
	    vec2.rotate(worldPivotA, pivotA, bodyA.angle);
	    vec2.rotate(worldPivotB, pivotB, bodyB.angle);
	
	    // todo: these are a bit sparse. We could save some computations on making custom eq.computeGW functions, etc
	
	    x.G[0] = -1;
	    x.G[1] =  0;
	    x.G[2] = -vec2.crossLength(worldPivotA,xAxis);
	    x.G[3] =  1;
	    x.G[4] =  0;
	    x.G[5] =  vec2.crossLength(worldPivotB,xAxis);
	
	    y.G[0] =  0;
	    y.G[1] = -1;
	    y.G[2] = -vec2.crossLength(worldPivotA,yAxis);
	    y.G[3] =  0;
	    y.G[4] =  1;
	    y.G[5] =  vec2.crossLength(worldPivotB,yAxis);
	};
	
	/**
	 * Enable the rotational motor
	 * @method enableMotor
	 */
	RevoluteConstraint.prototype.enableMotor = function(){
	    if(this.motorEnabled){
	        return;
	    }
	    this.equations.push(this.motorEquation);
	    this.motorEnabled = true;
	};
	
	/**
	 * Disable the rotational motor
	 * @method disableMotor
	 */
	RevoluteConstraint.prototype.disableMotor = function(){
	    if(!this.motorEnabled){
	        return;
	    }
	    var i = this.equations.indexOf(this.motorEquation);
	    this.equations.splice(i,1);
	    this.motorEnabled = false;
	};
	
	/**
	 * Check if the motor is enabled.
	 * @method motorIsEnabled
	 * @deprecated use property motorEnabled instead.
	 * @return {Boolean}
	 */
	RevoluteConstraint.prototype.motorIsEnabled = function(){
	    return !!this.motorEnabled;
	};
	
	/**
	 * Set the speed of the rotational constraint motor
	 * @method setMotorSpeed
	 * @param  {Number} speed
	 */
	RevoluteConstraint.prototype.setMotorSpeed = function(speed){
	    if(!this.motorEnabled){
	        return;
	    }
	    var i = this.equations.indexOf(this.motorEquation);
	    this.equations[i].relativeVelocity = speed;
	};
	
	/**
	 * Get the speed of the rotational constraint motor
	 * @method getMotorSpeed
	 * @return {Number} The current speed, or false if the motor is not enabled.
	 */
	RevoluteConstraint.prototype.getMotorSpeed = function(){
	    if(!this.motorEnabled){
	        return false;
	    }
	    return this.motorEquation.relativeVelocity;
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var Equation = __webpack_require__(11),
	    vec2 = __webpack_require__(8);
	
	module.exports = RotationalVelocityEquation;
	
	/**
	 * Syncs rotational velocity of two bodies, or sets a relative velocity (motor).
	 *
	 * @class RotationalVelocityEquation
	 * @constructor
	 * @extends Equation
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 */
	function RotationalVelocityEquation(bodyA, bodyB){
	    Equation.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
	    this.relativeVelocity = 1;
	    this.ratio = 1;
	}
	RotationalVelocityEquation.prototype = new Equation();
	RotationalVelocityEquation.prototype.constructor = RotationalVelocityEquation;
	RotationalVelocityEquation.prototype.computeB = function(a,b,h){
	    var G = this.G;
	    G[2] = -1;
	    G[5] = this.ratio;
	
	    var GiMf = this.computeGiMf();
	    var GW = this.computeGW();
	    var B = - GW * b - h*GiMf;
	
	    return B;
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var Equation = __webpack_require__(11),
	    vec2 = __webpack_require__(8);
	
	module.exports = RotationalLockEquation;
	
	/**
	 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
	 *
	 * @class RotationalLockEquation
	 * @constructor
	 * @extends Equation
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Object} [options]
	 * @param {Number} [options.angle] Angle to add to the local vector in bodyA.
	 */
	function RotationalLockEquation(bodyA, bodyB, options){
	    options = options || {};
	    Equation.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
	
	    /**
	     * @property {number} angle
	     */
	    this.angle = options.angle || 0;
	
	    var G = this.G;
	    G[2] =  1;
	    G[5] = -1;
	}
	RotationalLockEquation.prototype = new Equation();
	RotationalLockEquation.prototype.constructor = RotationalLockEquation;
	
	var worldVectorA = vec2.create(),
	    worldVectorB = vec2.create(),
	    xAxis = vec2.fromValues(1,0),
	    yAxis = vec2.fromValues(0,1);
	RotationalLockEquation.prototype.computeGq = function(){
	    vec2.rotate(worldVectorA,xAxis,this.bodyA.angle+this.angle);
	    vec2.rotate(worldVectorB,yAxis,this.bodyB.angle);
	    return vec2.dot(worldVectorA,worldVectorB);
	};


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(27)
	,   ContactEquation = __webpack_require__(28)
	,   Equation = __webpack_require__(11)
	,   vec2 = __webpack_require__(8)
	,   RotationalLockEquation = __webpack_require__(50);
	
	module.exports = PrismaticConstraint;
	
	/**
	 * Constraint that only allows bodies to move along a line, relative to each other. See <a href="http://www.iforce2d.net/b2dtut/joints-prismatic">this tutorial</a>. Also called "slider constraint".
	 *
	 * @class PrismaticConstraint
	 * @constructor
	 * @extends Constraint
	 * @author schteppe
	 * @param {Body}    bodyA
	 * @param {Body}    bodyB
	 * @param {Object}  [options]
	 * @param {Number}  [options.maxForce]                Max force to be applied by the constraint
	 * @param {Array}   [options.localAnchorA]            Body A's anchor point, defined in its own local frame.
	 * @param {Array}   [options.localAnchorB]            Body B's anchor point, defined in its own local frame.
	 * @param {Array}   [options.localAxisA]              An axis, defined in body A frame, that body B's anchor point may slide along.
	 * @param {Boolean} [options.disableRotationalLock]   If set to true, bodyB will be free to rotate around its anchor point.
	 * @param {Number}  [options.upperLimit]
	 * @param {Number}  [options.lowerLimit]
	 * @todo Ability to create using only a point and a worldAxis
	 */
	function PrismaticConstraint(bodyA, bodyB, options){
	    options = options || {};
	    Constraint.call(this,bodyA,bodyB,Constraint.PRISMATIC,options);
	
	    // Get anchors
	    var localAnchorA = vec2.fromValues(0,0),
	        localAxisA = vec2.fromValues(1,0),
	        localAnchorB = vec2.fromValues(0,0);
	    if(options.localAnchorA){ vec2.copy(localAnchorA, options.localAnchorA); }
	    if(options.localAxisA){ vec2.copy(localAxisA,   options.localAxisA); }
	    if(options.localAnchorB){ vec2.copy(localAnchorB, options.localAnchorB); }
	
	    /**
	     * @property localAnchorA
	     * @type {Array}
	     */
	    this.localAnchorA = localAnchorA;
	
	    /**
	     * @property localAnchorB
	     * @type {Array}
	     */
	    this.localAnchorB = localAnchorB;
	
	    /**
	     * @property localAxisA
	     * @type {Array}
	     */
	    this.localAxisA = localAxisA;
	
	    /*
	
	    The constraint violation for the common axis point is
	
	        g = ( xj + rj - xi - ri ) * t   :=  gg*t
	
	    where r are body-local anchor points, and t is a tangent to the constraint axis defined in body i frame.
	
	        gdot =  ( vj + wj x rj - vi - wi x ri ) * t + ( xj + rj - xi - ri ) * ( wi x t )
	
	    Note the use of the chain rule. Now we identify the jacobian
	
	        G*W = [ -t      -ri x t + t x gg     t    rj x t ] * [vi wi vj wj]
	
	    The rotational part is just a rotation lock.
	
	     */
	
	    var maxForce = this.maxForce = typeof(options.maxForce)!=="undefined" ? options.maxForce : Number.MAX_VALUE;
	
	    // Translational part
	    var trans = new Equation(bodyA,bodyB,-maxForce,maxForce);
	    var ri = new vec2.create(),
	        rj = new vec2.create(),
	        gg = new vec2.create(),
	        t =  new vec2.create();
	    trans.computeGq = function(){
	        // g = ( xj + rj - xi - ri ) * t
	        return vec2.dot(gg,t);
	    };
	    trans.updateJacobian = function(){
	        var G = this.G,
	            xi = bodyA.position,
	            xj = bodyB.position;
	        vec2.rotate(ri,localAnchorA,bodyA.angle);
	        vec2.rotate(rj,localAnchorB,bodyB.angle);
	        vec2.add(gg,xj,rj);
	        vec2.sub(gg,gg,xi);
	        vec2.sub(gg,gg,ri);
	        vec2.rotate(t,localAxisA,bodyA.angle+Math.PI/2);
	
	        G[0] = -t[0];
	        G[1] = -t[1];
	        G[2] = -vec2.crossLength(ri,t) + vec2.crossLength(t,gg);
	        G[3] = t[0];
	        G[4] = t[1];
	        G[5] = vec2.crossLength(rj,t);
	    };
	    this.equations.push(trans);
	
	    // Rotational part
	    if(!options.disableRotationalLock){
	        var rot = new RotationalLockEquation(bodyA,bodyB,-maxForce,maxForce);
	        this.equations.push(rot);
	    }
	
	    /**
	     * The position of anchor A relative to anchor B, along the constraint axis.
	     * @property position
	     * @type {Number}
	     */
	    this.position = 0;
	
	    // Is this one used at all?
	    this.velocity = 0;
	
	    /**
	     * Set to true to enable lower limit.
	     * @property lowerLimitEnabled
	     * @type {Boolean}
	     */
	    this.lowerLimitEnabled = typeof(options.lowerLimit)!=="undefined" ? true : false;
	
	    /**
	     * Set to true to enable upper limit.
	     * @property upperLimitEnabled
	     * @type {Boolean}
	     */
	    this.upperLimitEnabled = typeof(options.upperLimit)!=="undefined" ? true : false;
	
	    /**
	     * Lower constraint limit. The constraint position is forced to be larger than this value.
	     * @property lowerLimit
	     * @type {Number}
	     */
	    this.lowerLimit = typeof(options.lowerLimit)!=="undefined" ? options.lowerLimit : 0;
	
	    /**
	     * Upper constraint limit. The constraint position is forced to be smaller than this value.
	     * @property upperLimit
	     * @type {Number}
	     */
	    this.upperLimit = typeof(options.upperLimit)!=="undefined" ? options.upperLimit : 1;
	
	    // Equations used for limits
	    this.upperLimitEquation = new ContactEquation(bodyA,bodyB);
	    this.lowerLimitEquation = new ContactEquation(bodyA,bodyB);
	
	    // Set max/min forces
	    this.upperLimitEquation.minForce = this.lowerLimitEquation.minForce = 0;
	    this.upperLimitEquation.maxForce = this.lowerLimitEquation.maxForce = maxForce;
	
	    /**
	     * Equation used for the motor.
	     * @property motorEquation
	     * @type {Equation}
	     */
	    this.motorEquation = new Equation(bodyA,bodyB);
	
	    /**
	     * The current motor state. Enable or disable the motor using .enableMotor
	     * @property motorEnabled
	     * @type {Boolean}
	     */
	    this.motorEnabled = false;
	
	    /**
	     * Set the target speed for the motor.
	     * @property motorSpeed
	     * @type {Number}
	     */
	    this.motorSpeed = 0;
	
	    var that = this;
	    var motorEquation = this.motorEquation;
	    var old = motorEquation.computeGW;
	    motorEquation.computeGq = function(){ return 0; };
	    motorEquation.computeGW = function(){
	        var G = this.G,
	            bi = this.bodyA,
	            bj = this.bodyB,
	            vi = bi.velocity,
	            vj = bj.velocity,
	            wi = bi.angularVelocity,
	            wj = bj.angularVelocity;
	        return this.gmult(G,vi,wi,vj,wj) + that.motorSpeed;
	    };
	}
	
	PrismaticConstraint.prototype = new Constraint();
	PrismaticConstraint.prototype.constructor = PrismaticConstraint;
	
	var worldAxisA = vec2.create(),
	    worldAnchorA = vec2.create(),
	    worldAnchorB = vec2.create(),
	    orientedAnchorA = vec2.create(),
	    orientedAnchorB = vec2.create(),
	    tmp = vec2.create();
	
	/**
	 * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
	 * @method update
	 */
	PrismaticConstraint.prototype.update = function(){
	    var eqs = this.equations,
	        trans = eqs[0],
	        upperLimit = this.upperLimit,
	        lowerLimit = this.lowerLimit,
	        upperLimitEquation = this.upperLimitEquation,
	        lowerLimitEquation = this.lowerLimitEquation,
	        bodyA = this.bodyA,
	        bodyB = this.bodyB,
	        localAxisA = this.localAxisA,
	        localAnchorA = this.localAnchorA,
	        localAnchorB = this.localAnchorB;
	
	    trans.updateJacobian();
	
	    // Transform local things to world
	    vec2.rotate(worldAxisA,      localAxisA,      bodyA.angle);
	    vec2.rotate(orientedAnchorA, localAnchorA,    bodyA.angle);
	    vec2.add(worldAnchorA,       orientedAnchorA, bodyA.position);
	    vec2.rotate(orientedAnchorB, localAnchorB,    bodyB.angle);
	    vec2.add(worldAnchorB,       orientedAnchorB, bodyB.position);
	
	    var relPosition = this.position = vec2.dot(worldAnchorB,worldAxisA) - vec2.dot(worldAnchorA,worldAxisA);
	
	    // Motor
	    if(this.motorEnabled){
	        // G = [ a     a x ri   -a   -a x rj ]
	        var G = this.motorEquation.G;
	        G[0] = worldAxisA[0];
	        G[1] = worldAxisA[1];
	        G[2] = vec2.crossLength(worldAxisA,orientedAnchorB);
	        G[3] = -worldAxisA[0];
	        G[4] = -worldAxisA[1];
	        G[5] = -vec2.crossLength(worldAxisA,orientedAnchorA);
	    }
	
	    /*
	        Limits strategy:
	        Add contact equation, with normal along the constraint axis.
	        min/maxForce is set so the constraint is repulsive in the correct direction.
	        Some offset is added to either equation.contactPointA or .contactPointB to get the correct upper/lower limit.
	
	                 ^
	                 |
	      upperLimit x
	                 |    ------
	         anchorB x<---|  B |
	                 |    |    |
	        ------   |    ------
	        |    |   |
	        |  A |-->x anchorA
	        ------   |
	                 x lowerLimit
	                 |
	                axis
	     */
	
	
	    if(this.upperLimitEnabled && relPosition > upperLimit){
	        // Update contact constraint normal, etc
	        vec2.scale(upperLimitEquation.normalA, worldAxisA, -1);
	        vec2.sub(upperLimitEquation.contactPointA, worldAnchorA, bodyA.position);
	        vec2.sub(upperLimitEquation.contactPointB, worldAnchorB, bodyB.position);
	        vec2.scale(tmp,worldAxisA,upperLimit);
	        vec2.add(upperLimitEquation.contactPointA,upperLimitEquation.contactPointA,tmp);
	        if(eqs.indexOf(upperLimitEquation) === -1){
	            eqs.push(upperLimitEquation);
	        }
	    } else {
	        var idx = eqs.indexOf(upperLimitEquation);
	        if(idx !== -1){
	            eqs.splice(idx,1);
	        }
	    }
	
	    if(this.lowerLimitEnabled && relPosition < lowerLimit){
	        // Update contact constraint normal, etc
	        vec2.scale(lowerLimitEquation.normalA, worldAxisA, 1);
	        vec2.sub(lowerLimitEquation.contactPointA, worldAnchorA, bodyA.position);
	        vec2.sub(lowerLimitEquation.contactPointB, worldAnchorB, bodyB.position);
	        vec2.scale(tmp,worldAxisA,lowerLimit);
	        vec2.sub(lowerLimitEquation.contactPointB,lowerLimitEquation.contactPointB,tmp);
	        if(eqs.indexOf(lowerLimitEquation) === -1){
	            eqs.push(lowerLimitEquation);
	        }
	    } else {
	        var idx = eqs.indexOf(lowerLimitEquation);
	        if(idx !== -1){
	            eqs.splice(idx,1);
	        }
	    }
	};
	
	/**
	 * Enable the motor
	 * @method enableMotor
	 */
	PrismaticConstraint.prototype.enableMotor = function(){
	    if(this.motorEnabled){
	        return;
	    }
	    this.equations.push(this.motorEquation);
	    this.motorEnabled = true;
	};
	
	/**
	 * Disable the rotational motor
	 * @method disableMotor
	 */
	PrismaticConstraint.prototype.disableMotor = function(){
	    if(!this.motorEnabled){
	        return;
	    }
	    var i = this.equations.indexOf(this.motorEquation);
	    this.equations.splice(i,1);
	    this.motorEnabled = false;
	};
	
	/**
	 * Set the constraint limits.
	 * @method setLimits
	 * @param {number} lower Lower limit.
	 * @param {number} upper Upper limit.
	 */
	PrismaticConstraint.prototype.setLimits = function (lower, upper) {
	    if(typeof(lower) === 'number'){
	        this.lowerLimit = lower;
	        this.lowerLimitEnabled = true;
	    } else {
	        this.lowerLimit = lower;
	        this.lowerLimitEnabled = false;
	    }
	
	    if(typeof(upper) === 'number'){
	        this.upperLimit = upper;
	        this.upperLimitEnabled = true;
	    } else {
	        this.upperLimit = upper;
	        this.upperLimitEnabled = false;
	    }
	};
	


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(9)
	,   Broadphase = __webpack_require__(24);
	
	module.exports = SAPBroadphase;
	
	/**
	 * Sweep and prune broadphase along one axis.
	 *
	 * @class SAPBroadphase
	 * @constructor
	 * @extends Broadphase
	 */
	function SAPBroadphase(){
	    Broadphase.call(this,Broadphase.SAP);
	
	    /**
	     * List of bodies currently in the broadphase.
	     * @property axisList
	     * @type {Array}
	     */
	    this.axisList = [];
	
	    /**
	     * The axis to sort along. 0 means x-axis and 1 y-axis. If your bodies are more spread out over the X axis, set axisIndex to 0, and you will gain some performance.
	     * @property axisIndex
	     * @type {Number}
	     */
	    this.axisIndex = 0;
	
	    var that = this;
	    this._addBodyHandler = function(e){
	        that.axisList.push(e.body);
	    };
	
	    this._removeBodyHandler = function(e){
	        // Remove from list
	        var idx = that.axisList.indexOf(e.body);
	        if(idx !== -1){
	            that.axisList.splice(idx,1);
	        }
	    };
	}
	SAPBroadphase.prototype = new Broadphase();
	SAPBroadphase.prototype.constructor = SAPBroadphase;
	
	/**
	 * Change the world
	 * @method setWorld
	 * @param {World} world
	 */
	SAPBroadphase.prototype.setWorld = function(world){
	    // Clear the old axis array
	    this.axisList.length = 0;
	
	    // Add all bodies from the new world
	    Utils.appendArray(this.axisList, world.bodies);
	
	    // Remove old handlers, if any
	    world
	        .off("addBody",this._addBodyHandler)
	        .off("removeBody",this._removeBodyHandler);
	
	    // Add handlers to update the list of bodies.
	    world.on("addBody",this._addBodyHandler).on("removeBody",this._removeBodyHandler);
	
	    this.world = world;
	};
	
	/**
	 * Sorts bodies along an axis.
	 * @method sortAxisList
	 * @param {Array} a
	 * @param {number} axisIndex
	 * @return {Array}
	 */
	SAPBroadphase.sortAxisList = function(a, axisIndex){
	    axisIndex = axisIndex|0;
	    for(var i=1,l=a.length; i<l; i++) {
	        var v = a[i];
	        for(var j=i - 1;j>=0;j--) {
	            if(a[j].aabb.lowerBound[axisIndex] <= v.aabb.lowerBound[axisIndex]){
	                break;
	            }
	            a[j+1] = a[j];
	        }
	        a[j+1] = v;
	    }
	    return a;
	};
	
	SAPBroadphase.prototype.sortList = function(){
	    var bodies = this.axisList,
	    axisIndex = this.axisIndex;
	
	    // Sort the lists
	    SAPBroadphase.sortAxisList(bodies, axisIndex);
	};
	
	/**
	 * Get the colliding pairs
	 * @method getCollisionPairs
	 * @param  {World} world
	 * @return {Array}
	 */
	SAPBroadphase.prototype.getCollisionPairs = function(world){
	    var bodies = this.axisList,
	        result = this.result,
	        axisIndex = this.axisIndex;
	
	    result.length = 0;
	
	    // Update all AABBs if needed
	    var l = bodies.length;
	    while(l--){
	        var b = bodies[l];
	        if(b.aabbNeedsUpdate){
	            b.updateAABB();
	        }
	    }
	
	    // Sort the lists
	    this.sortList();
	
	    // Look through the X list
	    for(var i=0, N=bodies.length|0; i!==N; i++){
	        var bi = bodies[i];
	
	        for(var j=i+1; j<N; j++){
	            var bj = bodies[j];
	
	            // Bounds overlap?
	            var overlaps = (bj.aabb.lowerBound[axisIndex] <= bi.aabb.upperBound[axisIndex]);
	            if(!overlaps){
	                break;
	            }
	
	            if(Broadphase.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
	                result.push(bi,bj);
	            }
	        }
	    }
	
	    return result;
	};
	
	/**
	 * Returns all the bodies within an AABB.
	 * @method aabbQuery
	 * @param  {World} world
	 * @param  {AABB} aabb
	 * @param {array} result An array to store resulting bodies in.
	 * @return {array}
	 */
	SAPBroadphase.prototype.aabbQuery = function(world, aabb, result){
	    result = result || [];
	
	    this.sortList();
	
	    var axisIndex = this.axisIndex;
	    var axis = 'x';
	    if(axisIndex === 1){ axis = 'y'; }
	    if(axisIndex === 2){ axis = 'z'; }
	
	    var axisList = this.axisList;
	    var lower = aabb.lowerBound[axis];
	    var upper = aabb.upperBound[axis];
	    for(var i = 0; i < axisList.length; i++){
	        var b = axisList[i];
	
	        if(b.aabbNeedsUpdate){
	            b.updateAABB();
	        }
	
	        if(b.aabb.overlaps(aabb)){
	            result.push(b);
	        }
	    }
	
	    return result;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8);
	var Utils = __webpack_require__(9);
	
	module.exports = Spring;
	
	/**
	 * A spring, connecting two bodies. The Spring explicitly adds force and angularForce to the bodies and does therefore not put load on the constraint solver.
	 *
	 * @class Spring
	 * @constructor
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Object} [options]
	 * @param {number} [options.stiffness=100]  Spring constant (see Hookes Law). A number >= 0.
	 * @param {number} [options.damping=1]      A number >= 0. Default: 1
	 * @param {Array}  [options.localAnchorA]   Where to hook the spring to body A, in local body coordinates. Defaults to the body center.
	 * @param {Array}  [options.localAnchorB]
	 * @param {Array}  [options.worldAnchorA]   Where to hook the spring to body A, in world coordinates. Overrides the option "localAnchorA" if given.
	 * @param {Array}  [options.worldAnchorB]
	 */
	function Spring(bodyA, bodyB, options){
	    options = Utils.defaults(options,{
	        stiffness: 100,
	        damping: 1,
	    });
	
	    /**
	     * Stiffness of the spring.
	     * @property stiffness
	     * @type {number}
	     */
	    this.stiffness = options.stiffness;
	
	    /**
	     * Damping of the spring.
	     * @property damping
	     * @type {number}
	     */
	    this.damping = options.damping;
	
	    /**
	     * First connected body.
	     * @property bodyA
	     * @type {Body}
	     */
	    this.bodyA = bodyA;
	
	    /**
	     * Second connected body.
	     * @property bodyB
	     * @type {Body}
	     */
	    this.bodyB = bodyB;
	}
	
	/**
	 * Apply the spring force to the connected bodies.
	 * @method applyForce
	 */
	Spring.prototype.applyForce = function(){
	    // To be implemented by subclasses
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8);
	var Utils = __webpack_require__(9);
	var Constraint = __webpack_require__(27);
	var FrictionEquation = __webpack_require__(34);
	var Body = __webpack_require__(12);
	
	module.exports = TopDownVehicle;
	
	/**
	 * @class TopDownVehicle
	 * @constructor
	 * @param {Body} chassisBody A dynamic body, already added to the world.
	 * @param {Object} [options]
	 *
	 * @example
	 *
	 *     // Create a dynamic body for the chassis
	 *     var chassisBody = new Body({
	 *         mass: 1
	 *     });
	 *     var boxShape = new Box({ width: 0.5, height: 1 });
	 *     chassisBody.addShape(boxShape);
	 *     world.addBody(chassisBody);
	 *
	 *     // Create the vehicle
	 *     var vehicle = new TopDownVehicle(chassisBody);
	 *
	 *     // Add one front wheel and one back wheel - we don't actually need four :)
	 *     var frontWheel = vehicle.addWheel({
	 *         localPosition: [0, 0.5] // front
	 *     });
	 *     frontWheel.setSideFriction(4);
	 *
	 *     // Back wheel
	 *     var backWheel = vehicle.addWheel({
	 *         localPosition: [0, -0.5] // back
	 *     });
	 *     backWheel.setSideFriction(3); // Less side friction on back wheel makes it easier to drift
	 *     vehicle.addToWorld(world);
	 *
	 *     // Steer value zero means straight forward. Positive is left and negative right.
	 *     frontWheel.steerValue = Math.PI / 16;
	 *
	 *     // Engine force forward
	 *     backWheel.engineForce = 10;
	 *     backWheel.setBrakeForce(0);
	 */
	function TopDownVehicle(chassisBody, options){
	    options = options || {};
	
	    /**
	     * @property {Body} chassisBody
	     */
	    this.chassisBody = chassisBody;
	
	    /**
	     * @property {Array} wheels
	     */
	    this.wheels = [];
	
	    // A dummy body to constrain the chassis to
	    this.groundBody = new Body({ mass: 0 });
	
	    this.world = null;
	
	    var that = this;
	    this.preStepCallback = function(){
	        that.update();
	    };
	}
	
	/**
	 * @method addToWorld
	 * @param {World} world
	 */
	TopDownVehicle.prototype.addToWorld = function(world){
	    this.world = world;
	    world.addBody(this.groundBody);
	    world.on('preStep', this.preStepCallback);
	    for (var i = 0; i < this.wheels.length; i++) {
	        var wheel = this.wheels[i];
	        world.addConstraint(wheel);
	    }
	};
	
	/**
	 * @method removeFromWorld
	 * @param {World} world
	 */
	TopDownVehicle.prototype.removeFromWorld = function(){
	    var world = this.world;
	    world.removeBody(this.groundBody);
	    world.off('preStep', this.preStepCallback);
	    for (var i = 0; i < this.wheels.length; i++) {
	        var wheel = this.wheels[i];
	        world.removeConstraint(wheel);
	    }
	    this.world = null;
	};
	
	/**
	 * @method addWheel
	 * @param {object} [wheelOptions]
	 * @return {WheelConstraint}
	 */
	TopDownVehicle.prototype.addWheel = function(wheelOptions){
	    var wheel = new WheelConstraint(this,wheelOptions);
	    this.wheels.push(wheel);
	    return wheel;
	};
	
	/**
	 * @method update
	 */
	TopDownVehicle.prototype.update = function(){
	    for (var i = 0; i < this.wheels.length; i++) {
	        this.wheels[i].update();
	    }
	};
	
	/**
	 * @class WheelConstraint
	 * @constructor
	 * @extends {Constraint}
	 * @param {Vehicle} vehicle
	 * @param {object} [options]
	 * @param {Array} [options.localForwardVector]The local wheel forward vector in local body space. Default is zero.
	 * @param {Array} [options.localPosition] The local position of the wheen in the chassis body. Default is zero - the center of the body.
	 * @param {Array} [options.sideFriction=5] The max friction force in the sideways direction.
	 */
	function WheelConstraint(vehicle, options){
	    options = options || {};
	
	    this.vehicle = vehicle;
	
	    this.forwardEquation = new FrictionEquation(vehicle.chassisBody, vehicle.groundBody);
	
	    this.sideEquation = new FrictionEquation(vehicle.chassisBody, vehicle.groundBody);
	
	    /**
	     * @property {number} steerValue
	     */
	    this.steerValue = 0;
	
	    /**
	     * @property {number} engineForce
	     */
	    this.engineForce = 0;
	
	    this.setSideFriction(options.sideFriction !== undefined ? options.sideFriction : 5);
	
	    /**
	     * @property {Array} localForwardVector
	     */
	    this.localForwardVector = vec2.fromValues(0, 1);
	    if(options.localForwardVector){
	        vec2.copy(this.localForwardVector, options.localForwardVector);
	    }
	
	    /**
	     * @property {Array} localPosition
	     */
	    this.localPosition = vec2.fromValues(0, 0);
	    if(options.localPosition){
	        vec2.copy(this.localPosition, options.localPosition);
	    }
	
	    Constraint.apply(this, vehicle.chassisBody, vehicle.groundBody);
	
	    this.equations.push(
	        this.forwardEquation,
	        this.sideEquation
	    );
	
	    this.setBrakeForce(0);
	}
	WheelConstraint.prototype = new Constraint();
	
	/**
	 * @method setForwardFriction
	 */
	WheelConstraint.prototype.setBrakeForce = function(force){
	    this.forwardEquation.setSlipForce(force);
	};
	
	/**
	 * @method setSideFriction
	 */
	WheelConstraint.prototype.setSideFriction = function(force){
	    this.sideEquation.setSlipForce(force);
	};
	
	var worldVelocity = vec2.create();
	var relativePoint = vec2.create();
	
	/**
	 * @method getSpeed
	 */
	WheelConstraint.prototype.getSpeed = function(){
	    this.vehicle.chassisBody.vectorToWorldFrame(relativePoint, this.localForwardVector);
	    this.vehicle.chassisBody.getVelocityAtPoint(worldVelocity, relativePoint);
	    return vec2.dot(worldVelocity, relativePoint);
	};
	
	var tmpVec = vec2.create();
	
	/**
	 * @method update
	 */
	WheelConstraint.prototype.update = function(){
	
	    // Directional
	    this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.t, this.localForwardVector);
	    vec2.rotate(this.sideEquation.t, this.localForwardVector, Math.PI / 2);
	    this.vehicle.chassisBody.vectorToWorldFrame(this.sideEquation.t, this.sideEquation.t);
	
	    vec2.rotate(this.forwardEquation.t, this.forwardEquation.t, this.steerValue);
	    vec2.rotate(this.sideEquation.t, this.sideEquation.t, this.steerValue);
	
	    // Attachment point
	    this.vehicle.chassisBody.toWorldFrame(this.forwardEquation.contactPointB, this.localPosition);
	    vec2.copy(this.sideEquation.contactPointB, this.forwardEquation.contactPointB);
	
	    this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.contactPointA, this.localPosition);
	    vec2.copy(this.sideEquation.contactPointA, this.forwardEquation.contactPointA);
	
	    // Add engine force
	    vec2.normalize(tmpVec, this.forwardEquation.t);
	    vec2.scale(tmpVec, tmpVec, this.engineForce);
	
	    this.vehicle.chassisBody.applyForce(tmpVec, this.forwardEquation.contactPointA);
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8);
	var Spring = __webpack_require__(53);
	var Utils = __webpack_require__(9);
	
	module.exports = LinearSpring;
	
	/**
	 * A spring, connecting two bodies.
	 *
	 * The Spring explicitly adds force and angularForce to the bodies.
	 *
	 * @class LinearSpring
	 * @extends Spring
	 * @constructor
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Object} [options]
	 * @param {number} [options.restLength]   A number > 0. Default is the current distance between the world anchor points.
	 * @param {number} [options.stiffness=100]  Spring constant (see Hookes Law). A number >= 0.
	 * @param {number} [options.damping=1]      A number >= 0. Default: 1
	 * @param {Array}  [options.worldAnchorA]   Where to hook the spring to body A, in world coordinates. Overrides the option "localAnchorA" if given.
	 * @param {Array}  [options.worldAnchorB]
	 * @param {Array}  [options.localAnchorA]   Where to hook the spring to body A, in local body coordinates. Defaults to the body center.
	 * @param {Array}  [options.localAnchorB]
	 */
	function LinearSpring(bodyA,bodyB,options){
	    options = options || {};
	
	    Spring.call(this, bodyA, bodyB, options);
	
	    /**
	     * Anchor for bodyA in local bodyA coordinates.
	     * @property localAnchorA
	     * @type {Array}
	     */
	    this.localAnchorA = vec2.fromValues(0,0);
	
	    /**
	     * Anchor for bodyB in local bodyB coordinates.
	     * @property localAnchorB
	     * @type {Array}
	     */
	    this.localAnchorB = vec2.fromValues(0,0);
	
	    if(options.localAnchorA){ vec2.copy(this.localAnchorA, options.localAnchorA); }
	    if(options.localAnchorB){ vec2.copy(this.localAnchorB, options.localAnchorB); }
	    if(options.worldAnchorA){ this.setWorldAnchorA(options.worldAnchorA); }
	    if(options.worldAnchorB){ this.setWorldAnchorB(options.worldAnchorB); }
	
	    var worldAnchorA = vec2.create();
	    var worldAnchorB = vec2.create();
	    this.getWorldAnchorA(worldAnchorA);
	    this.getWorldAnchorB(worldAnchorB);
	    var worldDistance = vec2.distance(worldAnchorA, worldAnchorB);
	
	    /**
	     * Rest length of the spring.
	     * @property restLength
	     * @type {number}
	     */
	    this.restLength = typeof(options.restLength) === "number" ? options.restLength : worldDistance;
	}
	LinearSpring.prototype = new Spring();
	LinearSpring.prototype.constructor = LinearSpring;
	
	/**
	 * Set the anchor point on body A, using world coordinates.
	 * @method setWorldAnchorA
	 * @param {Array} worldAnchorA
	 */
	LinearSpring.prototype.setWorldAnchorA = function(worldAnchorA){
	    this.bodyA.toLocalFrame(this.localAnchorA, worldAnchorA);
	};
	
	/**
	 * Set the anchor point on body B, using world coordinates.
	 * @method setWorldAnchorB
	 * @param {Array} worldAnchorB
	 */
	LinearSpring.prototype.setWorldAnchorB = function(worldAnchorB){
	    this.bodyB.toLocalFrame(this.localAnchorB, worldAnchorB);
	};
	
	/**
	 * Get the anchor point on body A, in world coordinates.
	 * @method getWorldAnchorA
	 * @param {Array} result The vector to store the result in.
	 */
	LinearSpring.prototype.getWorldAnchorA = function(result){
	    this.bodyA.toWorldFrame(result, this.localAnchorA);
	};
	
	/**
	 * Get the anchor point on body B, in world coordinates.
	 * @method getWorldAnchorB
	 * @param {Array} result The vector to store the result in.
	 */
	LinearSpring.prototype.getWorldAnchorB = function(result){
	    this.bodyB.toWorldFrame(result, this.localAnchorB);
	};
	
	var applyForce_r =              vec2.create(),
	    applyForce_r_unit =         vec2.create(),
	    applyForce_u =              vec2.create(),
	    applyForce_f =              vec2.create(),
	    applyForce_worldAnchorA =   vec2.create(),
	    applyForce_worldAnchorB =   vec2.create(),
	    applyForce_ri =             vec2.create(),
	    applyForce_rj =             vec2.create(),
	    applyForce_tmp =            vec2.create();
	
	/**
	 * Apply the spring force to the connected bodies.
	 * @method applyForce
	 */
	LinearSpring.prototype.applyForce = function(){
	    var k = this.stiffness,
	        d = this.damping,
	        l = this.restLength,
	        bodyA = this.bodyA,
	        bodyB = this.bodyB,
	        r = applyForce_r,
	        r_unit = applyForce_r_unit,
	        u = applyForce_u,
	        f = applyForce_f,
	        tmp = applyForce_tmp;
	
	    var worldAnchorA = applyForce_worldAnchorA,
	        worldAnchorB = applyForce_worldAnchorB,
	        ri = applyForce_ri,
	        rj = applyForce_rj;
	
	    // Get world anchors
	    this.getWorldAnchorA(worldAnchorA);
	    this.getWorldAnchorB(worldAnchorB);
	
	    // Get offset points
	    vec2.sub(ri, worldAnchorA, bodyA.position);
	    vec2.sub(rj, worldAnchorB, bodyB.position);
	
	    // Compute distance vector between world anchor points
	    vec2.sub(r, worldAnchorB, worldAnchorA);
	    var rlen = vec2.len(r);
	    vec2.normalize(r_unit,r);
	
	    //console.log(rlen)
	    //console.log("A",vec2.str(worldAnchorA),"B",vec2.str(worldAnchorB))
	
	    // Compute relative velocity of the anchor points, u
	    vec2.sub(u, bodyB.velocity, bodyA.velocity);
	    vec2.crossZV(tmp, bodyB.angularVelocity, rj);
	    vec2.add(u, u, tmp);
	    vec2.crossZV(tmp, bodyA.angularVelocity, ri);
	    vec2.sub(u, u, tmp);
	
	    // F = - k * ( x - L ) - D * ( u )
	    vec2.scale(f, r_unit, -k*(rlen-l) - d*vec2.dot(u,r_unit));
	
	    // Add forces to bodies
	    vec2.sub( bodyA.force, bodyA.force, f);
	    vec2.add( bodyB.force, bodyB.force, f);
	
	    // Angular force
	    var ri_x_f = vec2.crossLength(ri, f);
	    var rj_x_f = vec2.crossLength(rj, f);
	    bodyA.angularForce -= ri_x_f;
	    bodyB.angularForce += rj_x_f;
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8);
	var Spring = __webpack_require__(53);
	
	module.exports = RotationalSpring;
	
	/**
	 * A rotational spring, connecting two bodies rotation. This spring explicitly adds angularForce (torque) to the bodies.
	 *
	 * The spring can be combined with a {{#crossLink "RevoluteConstraint"}}{{/crossLink}} to make, for example, a mouse trap.
	 *
	 * @class RotationalSpring
	 * @extends Spring
	 * @constructor
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Object} [options]
	 * @param {number} [options.restAngle] The relative angle of bodies at which the spring is at rest. If not given, it's set to the current relative angle between the bodies.
	 * @param {number} [options.stiffness=100] Spring constant (see Hookes Law). A number >= 0.
	 * @param {number} [options.damping=1] A number >= 0.
	 */
	function RotationalSpring(bodyA, bodyB, options){
	    options = options || {};
	
	    Spring.call(this, bodyA, bodyB, options);
	
	    /**
	     * Rest angle of the spring.
	     * @property restAngle
	     * @type {number}
	     */
	    this.restAngle = typeof(options.restAngle) === "number" ? options.restAngle : bodyB.angle - bodyA.angle;
	}
	RotationalSpring.prototype = new Spring();
	RotationalSpring.prototype.constructor = RotationalSpring;
	
	/**
	 * Apply the spring force to the connected bodies.
	 * @method applyForce
	 */
	RotationalSpring.prototype.applyForce = function(){
	    var k = this.stiffness,
	        d = this.damping,
	        l = this.restAngle,
	        bodyA = this.bodyA,
	        bodyB = this.bodyB,
	        x = bodyB.angle - bodyA.angle,
	        u = bodyB.angularVelocity - bodyA.angularVelocity;
	
	    var torque = - k * (x - l) - d * u * 0;
	
	    bodyA.angularForce -= torque;
	    bodyB.angularForce += torque;
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var  GSSolver = __webpack_require__(37)
	,    Solver = __webpack_require__(38)
	,    Ray = __webpack_require__(22)
	,    vec2 = __webpack_require__(8)
	,    Circle = __webpack_require__(26)
	,    Convex = __webpack_require__(18)
	,    Line = __webpack_require__(40)
	,    Plane = __webpack_require__(46)
	,    Capsule = __webpack_require__(25)
	,    Particle = __webpack_require__(47)
	,    EventEmitter = __webpack_require__(23)
	,    Body = __webpack_require__(12)
	,    Shape = __webpack_require__(19)
	,    LinearSpring = __webpack_require__(55)
	,    Material = __webpack_require__(32)
	,    ContactMaterial = __webpack_require__(31)
	,    DistanceConstraint = __webpack_require__(33)
	,    Constraint = __webpack_require__(27)
	,    LockConstraint = __webpack_require__(41)
	,    RevoluteConstraint = __webpack_require__(48)
	,    PrismaticConstraint = __webpack_require__(51)
	,    GearConstraint = __webpack_require__(36)
	,    pkg = __webpack_require__(58)
	,    Broadphase = __webpack_require__(24)
	,    AABB = __webpack_require__(7)
	,    SAPBroadphase = __webpack_require__(52)
	,    Narrowphase = __webpack_require__(42)
	,    Utils = __webpack_require__(9)
	,    OverlapKeeper = __webpack_require__(59)
	,    IslandManager = __webpack_require__(62)
	,    RotationalSpring = __webpack_require__(56);
	
	module.exports = World;
	
	/**
	 * The dynamics world, where all bodies and constraints live.
	 *
	 * @class World
	 * @constructor
	 * @param {Object} [options]
	 * @param {Solver} [options.solver] Defaults to GSSolver.
	 * @param {Array} [options.gravity] Defaults to y=-9.78.
	 * @param {Broadphase} [options.broadphase] Defaults to SAPBroadphase
	 * @param {Boolean} [options.islandSplit=true]
	 * @extends EventEmitter
	 *
	 * @example
	 *     var world = new World({
	 *         gravity: [0, -10],
	 *         broadphase: new SAPBroadphase()
	 *     });
	 *     world.addBody(new Body());
	 */
	function World(options){
	    EventEmitter.apply(this);
	
	    options = options || {};
	
	    /**
	     * All springs in the world. To add a spring to the world, use {{#crossLink "World/addSpring:method"}}{{/crossLink}}.
	     *
	     * @property springs
	     * @type {Array}
	     */
	    this.springs = [];
	
	    /**
	     * All bodies in the world. To add a body to the world, use {{#crossLink "World/addBody:method"}}{{/crossLink}}.
	     * @property {Array} bodies
	     */
	    this.bodies = [];
	
	    /**
	     * Disabled body collision pairs. See {{#crossLink "World/disableBodyCollision:method"}}.
	     * @private
	     * @property {Array} disabledBodyCollisionPairs
	     */
	    this.disabledBodyCollisionPairs = [];
	
	    /**
	     * The solver used to satisfy constraints and contacts. Default is {{#crossLink "GSSolver"}}{{/crossLink}}.
	     * @property {Solver} solver
	     */
	    this.solver = options.solver || new GSSolver();
	
	    /**
	     * The narrowphase to use to generate contacts.
	     *
	     * @property narrowphase
	     * @type {Narrowphase}
	     */
	    this.narrowphase = new Narrowphase(this);
	
	    /**
	     * The island manager of this world.
	     * @property {IslandManager} islandManager
	     */
	    this.islandManager = new IslandManager();
	
	    /**
	     * Gravity in the world. This is applied on all bodies in the beginning of each step().
	     *
	     * @property gravity
	     * @type {Array}
	     */
	    this.gravity = vec2.fromValues(0, -9.78);
	    if(options.gravity){
	        vec2.copy(this.gravity, options.gravity);
	    }
	
	    /**
	     * Gravity to use when approximating the friction max force (mu*mass*gravity).
	     * @property {Number} frictionGravity
	     */
	    this.frictionGravity = vec2.length(this.gravity) || 10;
	
	    /**
	     * Set to true if you want .frictionGravity to be automatically set to the length of .gravity.
	     * @property {Boolean} useWorldGravityAsFrictionGravity
	     * @default true
	     */
	    this.useWorldGravityAsFrictionGravity = true;
	
	    /**
	     * If the length of .gravity is zero, and .useWorldGravityAsFrictionGravity=true, then switch to using .frictionGravity for friction instead. This fallback is useful for gravityless games.
	     * @property {Boolean} useFrictionGravityOnZeroGravity
	     * @default true
	     */
	    this.useFrictionGravityOnZeroGravity = true;
	
	    /**
	     * The broadphase algorithm to use.
	     *
	     * @property broadphase
	     * @type {Broadphase}
	     */
	    this.broadphase = options.broadphase || new SAPBroadphase();
	    this.broadphase.setWorld(this);
	
	    /**
	     * User-added constraints.
	     *
	     * @property constraints
	     * @type {Array}
	     */
	    this.constraints = [];
	
	    /**
	     * Dummy default material in the world, used in .defaultContactMaterial
	     * @property {Material} defaultMaterial
	     */
	    this.defaultMaterial = new Material();
	
	    /**
	     * The default contact material to use, if no contact material was set for the colliding materials.
	     * @property {ContactMaterial} defaultContactMaterial
	     */
	    this.defaultContactMaterial = new ContactMaterial(this.defaultMaterial,this.defaultMaterial);
	
	    /**
	     * For keeping track of what time step size we used last step
	     * @property lastTimeStep
	     * @type {Number}
	     */
	    this.lastTimeStep = 1/60;
	
	    /**
	     * Enable to automatically apply spring forces each step.
	     * @property applySpringForces
	     * @type {Boolean}
	     * @default true
	     */
	    this.applySpringForces = true;
	
	    /**
	     * Enable to automatically apply body damping each step.
	     * @property applyDamping
	     * @type {Boolean}
	     * @default true
	     */
	    this.applyDamping = true;
	
	    /**
	     * Enable to automatically apply gravity each step.
	     * @property applyGravity
	     * @type {Boolean}
	     * @default true
	     */
	    this.applyGravity = true;
	
	    /**
	     * Enable/disable constraint solving in each step.
	     * @property solveConstraints
	     * @type {Boolean}
	     * @default true
	     */
	    this.solveConstraints = true;
	
	    /**
	     * The ContactMaterials added to the World.
	     * @property contactMaterials
	     * @type {Array}
	     */
	    this.contactMaterials = [];
	
	    /**
	     * World time.
	     * @property time
	     * @type {Number}
	     */
	    this.time = 0.0;
	    this.accumulator = 0;
	
	    /**
	     * Is true during step().
	     * @property {Boolean} stepping
	     */
	    this.stepping = false;
	
	    /**
	     * Bodies that are scheduled to be removed at the end of the step.
	     * @property {Array} bodiesToBeRemoved
	     * @private
	     */
	    this.bodiesToBeRemoved = [];
	
	    /**
	     * Whether to enable island splitting. Island splitting can be an advantage for both precision and performance. See {{#crossLink "IslandManager"}}{{/crossLink}}.
	     * @property {Boolean} islandSplit
	     * @default true
	     */
	    this.islandSplit = typeof(options.islandSplit)!=="undefined" ? !!options.islandSplit : true;
	
	    /**
	     * Set to true if you want to the world to emit the "impact" event. Turning this off could improve performance.
	     * @property emitImpactEvent
	     * @type {Boolean}
	     * @default true
	     */
	    this.emitImpactEvent = true;
	
	    // Id counters
	    this._constraintIdCounter = 0;
	    this._bodyIdCounter = 0;
	
	    /**
	     * Fired after the step().
	     * @event postStep
	     */
	    this.postStepEvent = {
	        type : "postStep"
	    };
	
	    /**
	     * Fired when a body is added to the world.
	     * @event addBody
	     * @param {Body} body
	     */
	    this.addBodyEvent = {
	        type : "addBody",
	        body : null
	    };
	
	    /**
	     * Fired when a body is removed from the world.
	     * @event removeBody
	     * @param {Body} body
	     */
	    this.removeBodyEvent = {
	        type : "removeBody",
	        body : null
	    };
	
	    /**
	     * Fired when a spring is added to the world.
	     * @event addSpring
	     * @param {Spring} spring
	     */
	    this.addSpringEvent = {
	        type : "addSpring",
	        spring : null
	    };
	
	    /**
	     * Fired when a first contact is created between two bodies. This event is fired after the step has been done.
	     * @event impact
	     * @param {Body} bodyA
	     * @param {Body} bodyB
	     */
	    this.impactEvent = {
	        type: "impact",
	        bodyA : null,
	        bodyB : null,
	        shapeA : null,
	        shapeB : null,
	        contactEquation : null
	    };
	
	    /**
	     * Fired after the Broadphase has collected collision pairs in the world.
	     * Inside the event handler, you can modify the pairs array as you like, to
	     * prevent collisions between objects that you don't want.
	     * @event postBroadphase
	     * @param {Array} pairs An array of collision pairs. If this array is [body1,body2,body3,body4], then the body pairs 1,2 and 3,4 would advance to narrowphase.
	     */
	    this.postBroadphaseEvent = {
	        type: "postBroadphase",
	        pairs: null
	    };
	
	    /**
	     * How to deactivate bodies during simulation. Possible modes are: {{#crossLink "World/NO_SLEEPING:property"}}World.NO_SLEEPING{{/crossLink}}, {{#crossLink "World/BODY_SLEEPING:property"}}World.BODY_SLEEPING{{/crossLink}} and {{#crossLink "World/ISLAND_SLEEPING:property"}}World.ISLAND_SLEEPING{{/crossLink}}.
	     * If sleeping is enabled, you might need to {{#crossLink "Body/wakeUp:method"}}wake up{{/crossLink}} the bodies if they fall asleep when they shouldn't. If you want to enable sleeping in the world, but want to disable it for a particular body, see {{#crossLink "Body/allowSleep:property"}}Body.allowSleep{{/crossLink}}.
	     * @property sleepMode
	     * @type {number}
	     * @default World.NO_SLEEPING
	     */
	    this.sleepMode = World.NO_SLEEPING;
	
	    /**
	     * Fired when two shapes starts start to overlap. Fired in the narrowphase, during step.
	     * @event beginContact
	     * @param {Shape} shapeA
	     * @param {Shape} shapeB
	     * @param {Body}  bodyA
	     * @param {Body}  bodyB
	     * @param {Array} contactEquations
	     */
	    this.beginContactEvent = {
	        type: "beginContact",
	        shapeA: null,
	        shapeB: null,
	        bodyA: null,
	        bodyB: null,
	        contactEquations: []
	    };
	
	    /**
	     * Fired when two shapes stop overlapping, after the narrowphase (during step).
	     * @event endContact
	     * @param {Shape} shapeA
	     * @param {Shape} shapeB
	     * @param {Body}  bodyA
	     * @param {Body}  bodyB
	     */
	    this.endContactEvent = {
	        type: "endContact",
	        shapeA: null,
	        shapeB: null,
	        bodyA: null,
	        bodyB: null
	    };
	
	    /**
	     * Fired just before equations are added to the solver to be solved. Can be used to control what equations goes into the solver.
	     * @event preSolve
	     * @param {Array} contactEquations  An array of contacts to be solved.
	     * @param {Array} frictionEquations An array of friction equations to be solved.
	     */
	    this.preSolveEvent = {
	        type: "preSolve",
	        contactEquations: null,
	        frictionEquations: null
	    };
	
	    // For keeping track of overlapping shapes
	    this.overlappingShapesLastState = { keys:[] };
	    this.overlappingShapesCurrentState = { keys:[] };
	
	    /**
	     * @property {OverlapKeeper} overlapKeeper
	     */
	    this.overlapKeeper = new OverlapKeeper();
	}
	World.prototype = new Object(EventEmitter.prototype);
	World.prototype.constructor = World;
	
	/**
	 * Never deactivate bodies.
	 * @static
	 * @property {number} NO_SLEEPING
	 */
	World.NO_SLEEPING = 1;
	
	/**
	 * Deactivate individual bodies if they are sleepy.
	 * @static
	 * @property {number} BODY_SLEEPING
	 */
	World.BODY_SLEEPING = 2;
	
	/**
	 * Deactivates bodies that are in contact, if all of them are sleepy. Note that you must enable {{#crossLink "World/islandSplit:property"}}.islandSplit{{/crossLink}} for this to work.
	 * @static
	 * @property {number} ISLAND_SLEEPING
	 */
	World.ISLAND_SLEEPING = 4;
	
	/**
	 * Add a constraint to the simulation.
	 *
	 * @method addConstraint
	 * @param {Constraint} constraint
	 * @example
	 *     var constraint = new LockConstraint(bodyA, bodyB);
	 *     world.addConstraint(constraint);
	 */
	World.prototype.addConstraint = function(constraint){
	    this.constraints.push(constraint);
	};
	
	/**
	 * Add a ContactMaterial to the simulation.
	 * @method addContactMaterial
	 * @param {ContactMaterial} contactMaterial
	 */
	World.prototype.addContactMaterial = function(contactMaterial){
	    this.contactMaterials.push(contactMaterial);
	};
	
	/**
	 * Removes a contact material
	 *
	 * @method removeContactMaterial
	 * @param {ContactMaterial} cm
	 */
	World.prototype.removeContactMaterial = function(cm){
	    var idx = this.contactMaterials.indexOf(cm);
	    if(idx!==-1){
	        Utils.splice(this.contactMaterials,idx,1);
	    }
	};
	
	/**
	 * Get a contact material given two materials
	 * @method getContactMaterial
	 * @param {Material} materialA
	 * @param {Material} materialB
	 * @return {ContactMaterial} The matching ContactMaterial, or false on fail.
	 * @todo Use faster hash map to lookup from material id's
	 */
	World.prototype.getContactMaterial = function(materialA,materialB){
	    var cmats = this.contactMaterials;
	    for(var i=0, N=cmats.length; i!==N; i++){
	        var cm = cmats[i];
	        if( (cm.materialA.id === materialA.id) && (cm.materialB.id === materialB.id) ||
	            (cm.materialA.id === materialB.id) && (cm.materialB.id === materialA.id) ){
	            return cm;
	        }
	    }
	    return false;
	};
	
	/**
	 * Removes a constraint
	 *
	 * @method removeConstraint
	 * @param {Constraint} constraint
	 */
	World.prototype.removeConstraint = function(constraint){
	    var idx = this.constraints.indexOf(constraint);
	    if(idx!==-1){
	        Utils.splice(this.constraints,idx,1);
	    }
	};
	
	var step_r = vec2.create(),
	    step_runit = vec2.create(),
	    step_u = vec2.create(),
	    step_f = vec2.create(),
	    step_fhMinv = vec2.create(),
	    step_velodt = vec2.create(),
	    step_mg = vec2.create(),
	    xiw = vec2.fromValues(0,0),
	    xjw = vec2.fromValues(0,0),
	    zero = vec2.fromValues(0,0),
	    interpvelo = vec2.fromValues(0,0);
	
	/**
	 * Step the physics world forward in time.
	 *
	 * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
	 *
	 * @method step
	 * @param {Number} dt                       The fixed time step size to use.
	 * @param {Number} [timeSinceLastCalled=0]  The time elapsed since the function was last called.
	 * @param {Number} [maxSubSteps=10]         Maximum number of fixed steps to take per function call.
	 *
	 * @example
	 *     // Simple fixed timestepping without interpolation
	 *     var fixedTimeStep = 1 / 60;
	 *     var world = new World();
	 *     var body = new Body({ mass: 1 });
	 *     world.addBody(body);
	 *
	 *     function animate(){
	 *         requestAnimationFrame(animate);
	 *         world.step(fixedTimeStep);
	 *         renderBody(body.position, body.angle);
	 *     }
	 *
	 *     // Start animation loop
	 *     requestAnimationFrame(animate);
	 *
	 * @example
	 *     // Fixed timestepping with interpolation
	 *     var maxSubSteps = 10;
	 *     var lastTimeSeconds;
	 *
	 *     function animate(t){
	 *         requestAnimationFrame(animate);
	 *         timeSeconds = t / 1000;
	 *         lastTimeSeconds = lastTimeSeconds || timeSeconds;
	 *
	 *         deltaTime = timeSeconds - lastTimeSeconds;
	 *         world.step(fixedTimeStep, deltaTime, maxSubSteps);
	 *
	 *         renderBody(body.interpolatedPosition, body.interpolatedAngle);
	 *     }
	 *
	 *     // Start animation loop
	 *     requestAnimationFrame(animate);
	 *
	 * @see http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World
	 */
	World.prototype.step = function(dt,timeSinceLastCalled,maxSubSteps){
	    maxSubSteps = maxSubSteps || 10;
	    timeSinceLastCalled = timeSinceLastCalled || 0;
	
	    if(timeSinceLastCalled === 0){ // Fixed, simple stepping
	
	        this.internalStep(dt);
	
	        // Increment time
	        this.time += dt;
	
	    } else {
	
	        this.accumulator += timeSinceLastCalled;
	        var substeps = 0;
	        while (this.accumulator >= dt && substeps < maxSubSteps) {
	            // Do fixed steps to catch up
	            this.internalStep(dt);
	            this.time += dt;
	            this.accumulator -= dt;
	            substeps++;
	        }
	
	        var t = (this.accumulator % dt) / dt;
	        for(var j=0; j!==this.bodies.length; j++){
	            var b = this.bodies[j];
	            vec2.lerp(b.interpolatedPosition, b.previousPosition, b.position, t);
	            b.interpolatedAngle = b.previousAngle + t * (b.angle - b.previousAngle);
	        }
	    }
	};
	
	var endOverlaps = [];
	
	/**
	 * Make a fixed step.
	 * @method internalStep
	 * @param  {number} dt
	 * @private
	 */
	World.prototype.internalStep = function(dt){
	    this.stepping = true;
	
	    var that = this,
	        Nsprings = this.springs.length,
	        springs = this.springs,
	        bodies = this.bodies,
	        g = this.gravity,
	        solver = this.solver,
	        Nbodies = this.bodies.length,
	        broadphase = this.broadphase,
	        np = this.narrowphase,
	        constraints = this.constraints,
	        t0, t1,
	        fhMinv = step_fhMinv,
	        velodt = step_velodt,
	        mg = step_mg,
	        scale = vec2.scale,
	        add = vec2.add,
	        rotate = vec2.rotate,
	        islandManager = this.islandManager;
	
	    this.overlapKeeper.tick();
	
	    this.lastTimeStep = dt;
	
	    // Update approximate friction gravity.
	    if(this.useWorldGravityAsFrictionGravity){
	        var gravityLen = vec2.length(this.gravity);
	        if(!(gravityLen === 0 && this.useFrictionGravityOnZeroGravity)){
	            // Nonzero gravity. Use it.
	            this.frictionGravity = gravityLen;
	        }
	    }
	
	    // Add gravity to bodies
	    if(this.applyGravity){
	        for(var i=0; i!==Nbodies; i++){
	            var b = bodies[i],
	                fi = b.force;
	            if(b.type !== Body.DYNAMIC || b.sleepState === Body.SLEEPING){
	                continue;
	            }
	            vec2.scale(mg,g,b.mass*b.gravityScale); // F=m*g
	            add(fi,fi,mg);
	        }
	    }
	
	    // Add spring forces
	    if(this.applySpringForces){
	        for(var i=0; i!==Nsprings; i++){
	            var s = springs[i];
	            s.applyForce();
	        }
	    }
	
	    if(this.applyDamping){
	        for(var i=0; i!==Nbodies; i++){
	            var b = bodies[i];
	            if(b.type === Body.DYNAMIC){
	                b.applyDamping(dt);
	            }
	        }
	    }
	
	    // Broadphase
	    var result = broadphase.getCollisionPairs(this);
	
	    // Remove ignored collision pairs
	    var ignoredPairs = this.disabledBodyCollisionPairs;
	    for(var i=ignoredPairs.length-2; i>=0; i-=2){
	        for(var j=result.length-2; j>=0; j-=2){
	            if( (ignoredPairs[i]   === result[j] && ignoredPairs[i+1] === result[j+1]) ||
	                (ignoredPairs[i+1] === result[j] && ignoredPairs[i]   === result[j+1])){
	                result.splice(j,2);
	            }
	        }
	    }
	
	    // Remove constrained pairs with collideConnected == false
	    var Nconstraints = constraints.length;
	    for(i=0; i!==Nconstraints; i++){
	        var c = constraints[i];
	        if(!c.collideConnected){
	            for(var j=result.length-2; j>=0; j-=2){
	                if( (c.bodyA === result[j] && c.bodyB === result[j+1]) ||
	                    (c.bodyB === result[j] && c.bodyA === result[j+1])){
	                    result.splice(j,2);
	                }
	            }
	        }
	    }
	
	    // postBroadphase event
	    this.postBroadphaseEvent.pairs = result;
	    this.emit(this.postBroadphaseEvent);
	    this.postBroadphaseEvent.pairs = null;
	
	    // Narrowphase
	    np.reset(this);
	    for(var i=0, Nresults=result.length; i!==Nresults; i+=2){
	        var bi = result[i],
	            bj = result[i+1];
	
	        // Loop over all shapes of body i
	        for(var k=0, Nshapesi=bi.shapes.length; k!==Nshapesi; k++){
	            var si = bi.shapes[k],
	                xi = si.position,
	                ai = si.angle;
	
	            // All shapes of body j
	            for(var l=0, Nshapesj=bj.shapes.length; l!==Nshapesj; l++){
	                var sj = bj.shapes[l],
	                    xj = sj.position,
	                    aj = sj.angle;
	
	                var cm = this.defaultContactMaterial;
	                if(si.material && sj.material){
	                    var tmp = this.getContactMaterial(si.material,sj.material);
	                    if(tmp){
	                        cm = tmp;
	                    }
	                }
	
	                this.runNarrowphase(np,bi,si,xi,ai,bj,sj,xj,aj,cm,this.frictionGravity);
	            }
	        }
	    }
	
	    // Wake up bodies
	    for(var i=0; i!==Nbodies; i++){
	        var body = bodies[i];
	        if(body._wakeUpAfterNarrowphase){
	            body.wakeUp();
	            body._wakeUpAfterNarrowphase = false;
	        }
	    }
	
	    // Emit end overlap events
	    if(this.has('endContact')){
	        this.overlapKeeper.getEndOverlaps(endOverlaps);
	        var e = this.endContactEvent;
	        var l = endOverlaps.length;
	        while(l--){
	            var data = endOverlaps[l];
	            e.shapeA = data.shapeA;
	            e.shapeB = data.shapeB;
	            e.bodyA = data.bodyA;
	            e.bodyB = data.bodyB;
	            this.emit(e);
	        }
	        endOverlaps.length = 0;
	    }
	
	    var preSolveEvent = this.preSolveEvent;
	    preSolveEvent.contactEquations = np.contactEquations;
	    preSolveEvent.frictionEquations = np.frictionEquations;
	    this.emit(preSolveEvent);
	    preSolveEvent.contactEquations = preSolveEvent.frictionEquations = null;
	
	    // update constraint equations
	    var Nconstraints = constraints.length;
	    for(i=0; i!==Nconstraints; i++){
	        constraints[i].update();
	    }
	
	    if(np.contactEquations.length || np.frictionEquations.length || Nconstraints){
	        if(this.islandSplit){
	            // Split into islands
	            islandManager.equations.length = 0;
	            Utils.appendArray(islandManager.equations, np.contactEquations);
	            Utils.appendArray(islandManager.equations, np.frictionEquations);
	            for(i=0; i!==Nconstraints; i++){
	                Utils.appendArray(islandManager.equations, constraints[i].equations);
	            }
	            islandManager.split(this);
	
	            for(var i=0; i!==islandManager.islands.length; i++){
	                var island = islandManager.islands[i];
	                if(island.equations.length){
	                    solver.solveIsland(dt,island);
	                }
	            }
	
	        } else {
	
	            // Add contact equations to solver
	            solver.addEquations(np.contactEquations);
	            solver.addEquations(np.frictionEquations);
	
	            // Add user-defined constraint equations
	            for(i=0; i!==Nconstraints; i++){
	                solver.addEquations(constraints[i].equations);
	            }
	
	            if(this.solveConstraints){
	                solver.solve(dt,this);
	            }
	
	            solver.removeAllEquations();
	        }
	    }
	
	    // Step forward
	    for(var i=0; i!==Nbodies; i++){
	        var body = bodies[i];
	
	        // if(body.sleepState !== Body.SLEEPING && body.type !== Body.STATIC){
	        body.integrate(dt);
	        // }
	    }
	
	    // Reset force
	    for(var i=0; i!==Nbodies; i++){
	        bodies[i].setZeroForce();
	    }
	
	    // Emit impact event
	    if(this.emitImpactEvent && this.has('impact')){
	        var ev = this.impactEvent;
	        for(var i=0; i!==np.contactEquations.length; i++){
	            var eq = np.contactEquations[i];
	            if(eq.firstImpact){
	                ev.bodyA = eq.bodyA;
	                ev.bodyB = eq.bodyB;
	                ev.shapeA = eq.shapeA;
	                ev.shapeB = eq.shapeB;
	                ev.contactEquation = eq;
	                this.emit(ev);
	            }
	        }
	    }
	
	    // Sleeping update
	    if(this.sleepMode === World.BODY_SLEEPING){
	        for(i=0; i!==Nbodies; i++){
	            bodies[i].sleepTick(this.time, false, dt);
	        }
	    } else if(this.sleepMode === World.ISLAND_SLEEPING && this.islandSplit){
	
	        // Tell all bodies to sleep tick but dont sleep yet
	        for(i=0; i!==Nbodies; i++){
	            bodies[i].sleepTick(this.time, true, dt);
	        }
	
	        // Sleep islands
	        for(var i=0; i<this.islandManager.islands.length; i++){
	            var island = this.islandManager.islands[i];
	            if(island.wantsToSleep()){
	                island.sleep();
	            }
	        }
	    }
	
	    this.stepping = false;
	
	    // Remove bodies that are scheduled for removal
	    var bodiesToBeRemoved = this.bodiesToBeRemoved;
	    for(var i=0; i!==bodiesToBeRemoved.length; i++){
	        this.removeBody(bodiesToBeRemoved[i]);
	    }
	    bodiesToBeRemoved.length = 0;
	
	    this.emit(this.postStepEvent);
	};
	
	/**
	 * Runs narrowphase for the shape pair i and j.
	 * @method runNarrowphase
	 * @param  {Narrowphase} np
	 * @param  {Body} bi
	 * @param  {Shape} si
	 * @param  {Array} xi
	 * @param  {Number} ai
	 * @param  {Body} bj
	 * @param  {Shape} sj
	 * @param  {Array} xj
	 * @param  {Number} aj
	 * @param  {Number} mu
	 */
	World.prototype.runNarrowphase = function(np,bi,si,xi,ai,bj,sj,xj,aj,cm,glen){
	
	    // Check collision groups and masks
	    if(!((si.collisionGroup & sj.collisionMask) !== 0 && (sj.collisionGroup & si.collisionMask) !== 0)){
	        return;
	    }
	
	    // Get world position and angle of each shape
	    vec2.rotate(xiw, xi, bi.angle);
	    vec2.rotate(xjw, xj, bj.angle);
	    vec2.add(xiw, xiw, bi.position);
	    vec2.add(xjw, xjw, bj.position);
	    var aiw = ai + bi.angle;
	    var ajw = aj + bj.angle;
	
	    np.enableFriction = cm.friction > 0;
	    np.frictionCoefficient = cm.friction;
	    var reducedMass;
	    if(bi.type === Body.STATIC || bi.type === Body.KINEMATIC){
	        reducedMass = bj.mass;
	    } else if(bj.type === Body.STATIC || bj.type === Body.KINEMATIC){
	        reducedMass = bi.mass;
	    } else {
	        reducedMass = (bi.mass*bj.mass)/(bi.mass+bj.mass);
	    }
	    np.slipForce = cm.friction*glen*reducedMass;
	    np.restitution = cm.restitution;
	    np.surfaceVelocity = cm.surfaceVelocity;
	    np.frictionStiffness = cm.frictionStiffness;
	    np.frictionRelaxation = cm.frictionRelaxation;
	    np.stiffness = cm.stiffness;
	    np.relaxation = cm.relaxation;
	    np.contactSkinSize = cm.contactSkinSize;
	    np.enabledEquations = bi.collisionResponse && bj.collisionResponse && si.collisionResponse && sj.collisionResponse;
	
	    var resolver = np[si.type | sj.type],
	        numContacts = 0;
	    if (resolver) {
	        var sensor = si.sensor || sj.sensor;
	        var numFrictionBefore = np.frictionEquations.length;
	        if (si.type < sj.type) {
	            numContacts = resolver.call(np, bi,si,xiw,aiw, bj,sj,xjw,ajw, sensor);
	        } else {
	            numContacts = resolver.call(np, bj,sj,xjw,ajw, bi,si,xiw,aiw, sensor);
	        }
	        var numFrictionEquations = np.frictionEquations.length - numFrictionBefore;
	
	        if(numContacts){
	
	            if( bi.allowSleep &&
	                bi.type === Body.DYNAMIC &&
	                bi.sleepState  === Body.SLEEPING &&
	                bj.sleepState  === Body.AWAKE &&
	                bj.type !== Body.STATIC
	            ){
	                var speedSquaredB = vec2.squaredLength(bj.velocity) + Math.pow(bj.angularVelocity,2);
	                var speedLimitSquaredB = Math.pow(bj.sleepSpeedLimit,2);
	                if(speedSquaredB >= speedLimitSquaredB*2){
	                    bi._wakeUpAfterNarrowphase = true;
	                }
	            }
	
	            if( bj.allowSleep &&
	                bj.type === Body.DYNAMIC &&
	                bj.sleepState  === Body.SLEEPING &&
	                bi.sleepState  === Body.AWAKE &&
	                bi.type !== Body.STATIC
	            ){
	                var speedSquaredA = vec2.squaredLength(bi.velocity) + Math.pow(bi.angularVelocity,2);
	                var speedLimitSquaredA = Math.pow(bi.sleepSpeedLimit,2);
	                if(speedSquaredA >= speedLimitSquaredA*2){
	                    bj._wakeUpAfterNarrowphase = true;
	                }
	            }
	
	            this.overlapKeeper.setOverlapping(bi, si, bj, sj);
	            if(this.has('beginContact') && this.overlapKeeper.isNewOverlap(si, sj)){
	
	                // Report new shape overlap
	                var e = this.beginContactEvent;
	                e.shapeA = si;
	                e.shapeB = sj;
	                e.bodyA = bi;
	                e.bodyB = bj;
	
	                // Reset contact equations
	                e.contactEquations.length = 0;
	
	                if(typeof(numContacts)==="number"){
	                    for(var i=np.contactEquations.length-numContacts; i<np.contactEquations.length; i++){
	                        e.contactEquations.push(np.contactEquations[i]);
	                    }
	                }
	
	                this.emit(e);
	            }
	
	            // divide the max friction force by the number of contacts
	            if(typeof(numContacts)==="number" && numFrictionEquations > 1){ // Why divide by 1?
	                for(var i=np.frictionEquations.length-numFrictionEquations; i<np.frictionEquations.length; i++){
	                    var f = np.frictionEquations[i];
	                    f.setSlipForce(f.getSlipForce() / numFrictionEquations);
	                }
	            }
	        }
	    }
	
	};
	
	/**
	 * Add a spring to the simulation
	 *
	 * @method addSpring
	 * @param {Spring} spring
	 */
	World.prototype.addSpring = function(spring){
	    this.springs.push(spring);
	    var evt = this.addSpringEvent;
	    evt.spring = spring;
	    this.emit(evt);
	    evt.spring = null;
	};
	
	/**
	 * Remove a spring
	 *
	 * @method removeSpring
	 * @param {Spring} spring
	 */
	World.prototype.removeSpring = function(spring){
	    var idx = this.springs.indexOf(spring);
	    if(idx !== -1){
	        Utils.splice(this.springs,idx,1);
	    }
	};
	
	/**
	 * Add a body to the simulation
	 *
	 * @method addBody
	 * @param {Body} body
	 *
	 * @example
	 *     var world = new World(),
	 *         body = new Body();
	 *     world.addBody(body);
	 * @todo What if this is done during step?
	 */
	World.prototype.addBody = function(body){
	    if(this.bodies.indexOf(body) === -1){
	        this.bodies.push(body);
	        body.world = this;
	        var evt = this.addBodyEvent;
	        evt.body = body;
	        this.emit(evt);
	        evt.body = null;
	    }
	};
	
	/**
	 * Remove a body from the simulation. If this method is called during step(), the body removal is scheduled to after the step.
	 *
	 * @method removeBody
	 * @param {Body} body
	 */
	World.prototype.removeBody = function(body){
	    if(this.stepping){
	        this.bodiesToBeRemoved.push(body);
	    } else {
	        body.world = null;
	        var idx = this.bodies.indexOf(body);
	        if(idx!==-1){
	            Utils.splice(this.bodies,idx,1);
	            this.removeBodyEvent.body = body;
	            body.resetConstraintVelocity();
	            this.emit(this.removeBodyEvent);
	            this.removeBodyEvent.body = null;
	        }
	    }
	};
	
	/**
	 * Get a body by its id.
	 * @method getBodyById
	 * @param {number} id
	 * @return {Body} The body, or false if it was not found.
	 */
	World.prototype.getBodyById = function(id){
	    var bodies = this.bodies;
	    for(var i=0; i<bodies.length; i++){
	        var b = bodies[i];
	        if(b.id === id){
	            return b;
	        }
	    }
	    return false;
	};
	
	/**
	 * Disable collision between two bodies
	 * @method disableBodyCollision
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 */
	World.prototype.disableBodyCollision = function(bodyA,bodyB){
	    this.disabledBodyCollisionPairs.push(bodyA,bodyB);
	};
	
	/**
	 * Enable collisions between the given two bodies
	 * @method enableBodyCollision
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 */
	World.prototype.enableBodyCollision = function(bodyA,bodyB){
	    var pairs = this.disabledBodyCollisionPairs;
	    for(var i=0; i<pairs.length; i+=2){
	        if((pairs[i] === bodyA && pairs[i+1] === bodyB) || (pairs[i+1] === bodyA && pairs[i] === bodyB)){
	            pairs.splice(i,2);
	            return;
	        }
	    }
	};
	
	/**
	 * Resets the World, removes all bodies, constraints and springs.
	 *
	 * @method clear
	 */
	World.prototype.clear = function(){
	
	    this.time = 0;
	
	    // Remove all solver equations
	    if(this.solver && this.solver.equations.length){
	        this.solver.removeAllEquations();
	    }
	
	    // Remove all constraints
	    var cs = this.constraints;
	    for(var i=cs.length-1; i>=0; i--){
	        this.removeConstraint(cs[i]);
	    }
	
	    // Remove all bodies
	    var bodies = this.bodies;
	    for(var i=bodies.length-1; i>=0; i--){
	        this.removeBody(bodies[i]);
	    }
	
	    // Remove all springs
	    var springs = this.springs;
	    for(var i=springs.length-1; i>=0; i--){
	        this.removeSpring(springs[i]);
	    }
	
	    // Remove all contact materials
	    var cms = this.contactMaterials;
	    for(var i=cms.length-1; i>=0; i--){
	        this.removeContactMaterial(cms[i]);
	    }
	
	    World.apply(this);
	};
	
	var hitTest_tmp1 = vec2.create(),
	    hitTest_zero = vec2.fromValues(0,0),
	    hitTest_tmp2 = vec2.fromValues(0,0);
	
	/**
	 * Test if a world point overlaps bodies
	 * @method hitTest
	 * @param  {Array}  worldPoint  Point to use for intersection tests
	 * @param  {Array}  bodies      A list of objects to check for intersection
	 * @param  {Number} precision   Used for matching against particles and lines. Adds some margin to these infinitesimal objects.
	 * @return {Array}              Array of bodies that overlap the point
	 * @todo Should use an api similar to the raycast function
	 * @todo Should probably implement a .containsPoint method for all shapes. Would be more efficient
	 * @todo Should use the broadphase
	 */
	World.prototype.hitTest = function(worldPoint,bodies,precision){
	    precision = precision || 0;
	
	    // Create a dummy particle body with a particle shape to test against the bodies
	    var pb = new Body({ position:worldPoint }),
	        ps = new Particle(),
	        px = worldPoint,
	        pa = 0,
	        x = hitTest_tmp1,
	        zero = hitTest_zero,
	        tmp = hitTest_tmp2;
	    pb.addShape(ps);
	
	    var n = this.narrowphase,
	        result = [];
	
	    // Check bodies
	    for(var i=0, N=bodies.length; i!==N; i++){
	        var b = bodies[i];
	
	        for(var j=0, NS=b.shapes.length; j!==NS; j++){
	            var s = b.shapes[j];
	
	            // Get shape world position + angle
	            vec2.rotate(x, s.position, b.angle);
	            vec2.add(x, x, b.position);
	            var a = s.angle + b.angle;
	
	            if( (s instanceof Circle    && n.circleParticle  (b,s,x,a,     pb,ps,px,pa, true)) ||
	                (s instanceof Convex    && n.particleConvex  (pb,ps,px,pa, b,s,x,a,     true)) ||
	                (s instanceof Plane     && n.particlePlane   (pb,ps,px,pa, b,s,x,a,     true)) ||
	                (s instanceof Capsule   && n.particleCapsule (pb,ps,px,pa, b,s,x,a,     true)) ||
	                (s instanceof Particle  && vec2.squaredLength(vec2.sub(tmp,x,worldPoint)) < precision*precision)
	                ){
	                result.push(b);
	            }
	        }
	    }
	
	    return result;
	};
	
	/**
	 * Set the stiffness for all equations and contact materials.
	 * @method setGlobalStiffness
	 * @param {Number} stiffness
	 */
	World.prototype.setGlobalStiffness = function(stiffness){
	
	    // Set for all constraints
	    var constraints = this.constraints;
	    for(var i=0; i !== constraints.length; i++){
	        var c = constraints[i];
	        for(var j=0; j !== c.equations.length; j++){
	            var eq = c.equations[j];
	            eq.stiffness = stiffness;
	            eq.needsUpdate = true;
	        }
	    }
	
	    // Set for all contact materials
	    var contactMaterials = this.contactMaterials;
	    for(var i=0; i !== contactMaterials.length; i++){
	        var c = contactMaterials[i];
	        c.stiffness = c.frictionStiffness = stiffness;
	    }
	
	    // Set for default contact material
	    var c = this.defaultContactMaterial;
	    c.stiffness = c.frictionStiffness = stiffness;
	};
	
	/**
	 * Set the relaxation for all equations and contact materials.
	 * @method setGlobalRelaxation
	 * @param {Number} relaxation
	 */
	World.prototype.setGlobalRelaxation = function(relaxation){
	
	    // Set for all constraints
	    for(var i=0; i !== this.constraints.length; i++){
	        var c = this.constraints[i];
	        for(var j=0; j !== c.equations.length; j++){
	            var eq = c.equations[j];
	            eq.relaxation = relaxation;
	            eq.needsUpdate = true;
	        }
	    }
	
	    // Set for all contact materials
	    for(var i=0; i !== this.contactMaterials.length; i++){
	        var c = this.contactMaterials[i];
	        c.relaxation = c.frictionRelaxation = relaxation;
	    }
	
	    // Set for default contact material
	    var c = this.defaultContactMaterial;
	    c.relaxation = c.frictionRelaxation = relaxation;
	};
	
	var tmpAABB = new AABB();
	var tmpArray = [];
	
	/**
	 * Ray cast against all bodies in the world.
	 * @method raycast
	 * @param  {RaycastResult} result
	 * @param  {Ray} ray
	 * @return {boolean} True if any body was hit.
	 *
	 * @example
	 *     var ray = new Ray({
	 *         mode: Ray.CLOSEST, // or ANY
	 *         from: [0, 0],
	 *         to: [10, 0],
	 *     });
	 *     var result = new RaycastResult();
	 *     world.raycast(result, ray);
	 *
	 *     // Get the hit point
	 *     var hitPoint = vec2.create();
	 *     result.getHitPoint(hitPoint, ray);
	 *     console.log('Hit point: ', hitPoint[0], hitPoint[1], ' at distance ' + result.getHitDistance(ray));
	 *
	 * @example
	 *     var ray = new Ray({
	 *         mode: Ray.ALL,
	 *         from: [0, 0],
	 *         to: [10, 0],
	 *         callback: function(result){
	 *
	 *             // Print some info about the hit
	 *             console.log('Hit body and shape: ', result.body, result.shape);
	 *
	 *             // Get the hit point
	 *             var hitPoint = vec2.create();
	 *             result.getHitPoint(hitPoint, ray);
	 *             console.log('Hit point: ', hitPoint[0], hitPoint[1], ' at distance ' + result.getHitDistance(ray));
	 *
	 *             // If you are happy with the hits you got this far, you can stop the traversal here:
	 *             result.stop();
	 *         }
	 *     });
	 *     var result = new RaycastResult();
	 *     world.raycast(result, ray);
	 */
	World.prototype.raycast = function(result, ray){
	
	    // Get all bodies within the ray AABB
	    ray.getAABB(tmpAABB);
	    this.broadphase.aabbQuery(this, tmpAABB, tmpArray);
	    ray.intersectBodies(result, tmpArray);
	    tmpArray.length = 0;
	
	    return result.hasHit();
	};


/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = {
		"name": "p2",
		"version": "0.7.1",
		"description": "A JavaScript 2D physics engine.",
		"author": {
			"name": "Stefan Hedman",
			"email": "schteppe@gmail.com",
			"url": "http://steffe.se"
		},
		"keywords": [
			"p2.js",
			"p2",
			"physics",
			"engine",
			"2d"
		],
		"main": "./src/p2.js",
		"engines": {
			"node": "*"
		},
		"repository": {
			"type": "git",
			"url": "git+https://github.com/schteppe/p2.js.git"
		},
		"bugs": {
			"url": "https://github.com/schteppe/p2.js/issues"
		},
		"licenses": [
			{
				"type": "MIT"
			}
		],
		"devDependencies": {
			"grunt": "^0.4.5",
			"grunt-contrib-jshint": "^0.11.2",
			"grunt-contrib-nodeunit": "^0.4.1",
			"grunt-contrib-uglify": "~0.4.0",
			"grunt-contrib-watch": "~0.5.0",
			"grunt-browserify": "~2.0.1",
			"grunt-contrib-concat": "^0.4.0"
		},
		"dependencies": {
			"poly-decomp": "0.1.1"
		},
		"gitHead": "d83c483f912362fd6e57c74b0634ea3f1f3e0c82",
		"homepage": "https://github.com/schteppe/p2.js#readme",
		"_id": "p2@0.7.1",
		"scripts": {},
		"_shasum": "25f2474d9bc3a6d3140a1da26a67c9e118ac9543",
		"_from": "p2@latest",
		"_npmVersion": "2.14.7",
		"_nodeVersion": "4.2.2",
		"_npmUser": {
			"name": "schteppe",
			"email": "schteppe@gmail.com"
		},
		"maintainers": [
			{
				"name": "schteppe",
				"email": "schteppe@gmail.com"
			}
		],
		"dist": {
			"shasum": "25f2474d9bc3a6d3140a1da26a67c9e118ac9543",
			"tarball": "https://registry.npmjs.org/p2/-/p2-0.7.1.tgz"
		},
		"directories": {},
		"_resolved": "https://registry.npmjs.org/p2/-/p2-0.7.1.tgz"
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var TupleDictionary = __webpack_require__(43);
	var OverlapKeeperRecord = __webpack_require__(60);
	var OverlapKeeperRecordPool = __webpack_require__(61);
	var Utils = __webpack_require__(9);
	
	module.exports = OverlapKeeper;
	
	/**
	 * Keeps track of overlaps in the current state and the last step state.
	 * @class OverlapKeeper
	 * @constructor
	 */
	function OverlapKeeper() {
	    this.overlappingShapesLastState = new TupleDictionary();
	    this.overlappingShapesCurrentState = new TupleDictionary();
	    this.recordPool = new OverlapKeeperRecordPool({ size: 16 });
	    this.tmpDict = new TupleDictionary();
	    this.tmpArray1 = [];
	}
	
	/**
	 * Ticks one step forward in time. This will move the current overlap state to the "old" overlap state, and create a new one as current.
	 * @method tick
	 */
	OverlapKeeper.prototype.tick = function() {
	    var last = this.overlappingShapesLastState;
	    var current = this.overlappingShapesCurrentState;
	
	    // Save old objects into pool
	    var l = last.keys.length;
	    while(l--){
	        var key = last.keys[l];
	        var lastObject = last.getByKey(key);
	        var currentObject = current.getByKey(key);
	        if(lastObject){
	            // The record is only used in the "last" dict, and will be removed. We might as well pool it.
	            this.recordPool.release(lastObject);
	        }
	    }
	
	    // Clear last object
	    last.reset();
	
	    // Transfer from new object to old
	    last.copy(current);
	
	    // Clear current object
	    current.reset();
	};
	
	/**
	 * @method setOverlapping
	 * @param {Body} bodyA
	 * @param {Body} shapeA
	 * @param {Body} bodyB
	 * @param {Body} shapeB
	 */
	OverlapKeeper.prototype.setOverlapping = function(bodyA, shapeA, bodyB, shapeB) {
	    var last = this.overlappingShapesLastState;
	    var current = this.overlappingShapesCurrentState;
	
	    // Store current contact state
	    if(!current.get(shapeA.id, shapeB.id)){
	        var data = this.recordPool.get();
	        data.set(bodyA, shapeA, bodyB, shapeB);
	        current.set(shapeA.id, shapeB.id, data);
	    }
	};
	
	OverlapKeeper.prototype.getNewOverlaps = function(result){
	    return this.getDiff(this.overlappingShapesLastState, this.overlappingShapesCurrentState, result);
	};
	
	OverlapKeeper.prototype.getEndOverlaps = function(result){
	    return this.getDiff(this.overlappingShapesCurrentState, this.overlappingShapesLastState, result);
	};
	
	/**
	 * Checks if two bodies are currently overlapping.
	 * @method bodiesAreOverlapping
	 * @param  {Body} bodyA
	 * @param  {Body} bodyB
	 * @return {boolean}
	 */
	OverlapKeeper.prototype.bodiesAreOverlapping = function(bodyA, bodyB){
	    var current = this.overlappingShapesCurrentState;
	    var l = current.keys.length;
	    while(l--){
	        var key = current.keys[l];
	        var data = current.data[key];
	        if((data.bodyA === bodyA && data.bodyB === bodyB) || data.bodyA === bodyB && data.bodyB === bodyA){
	            return true;
	        }
	    }
	    return false;
	};
	
	OverlapKeeper.prototype.getDiff = function(dictA, dictB, result){
	    var result = result || [];
	    var last = dictA;
	    var current = dictB;
	
	    result.length = 0;
	
	    var l = current.keys.length;
	    while(l--){
	        var key = current.keys[l];
	        var data = current.data[key];
	
	        if(!data){
	            throw new Error('Key '+key+' had no data!');
	        }
	
	        var lastData = last.data[key];
	        if(!lastData){
	            // Not overlapping in last state, but in current.
	            result.push(data);
	        }
	    }
	
	    return result;
	};
	
	OverlapKeeper.prototype.isNewOverlap = function(shapeA, shapeB){
	    var idA = shapeA.id|0,
	        idB = shapeB.id|0;
	    var last = this.overlappingShapesLastState;
	    var current = this.overlappingShapesCurrentState;
	    // Not in last but in new
	    return !!!last.get(idA, idB) && !!current.get(idA, idB);
	};
	
	OverlapKeeper.prototype.getNewBodyOverlaps = function(result){
	    this.tmpArray1.length = 0;
	    var overlaps = this.getNewOverlaps(this.tmpArray1);
	    return this.getBodyDiff(overlaps, result);
	};
	
	OverlapKeeper.prototype.getEndBodyOverlaps = function(result){
	    this.tmpArray1.length = 0;
	    var overlaps = this.getEndOverlaps(this.tmpArray1);
	    return this.getBodyDiff(overlaps, result);
	};
	
	OverlapKeeper.prototype.getBodyDiff = function(overlaps, result){
	    result = result || [];
	    var accumulator = this.tmpDict;
	
	    var l = overlaps.length;
	
	    while(l--){
	        var data = overlaps[l];
	
	        // Since we use body id's for the accumulator, these will be a subset of the original one
	        accumulator.set(data.bodyA.id|0, data.bodyB.id|0, data);
	    }
	
	    l = accumulator.keys.length;
	    while(l--){
	        var data = accumulator.getByKey(accumulator.keys[l]);
	        if(data){
	            result.push(data.bodyA, data.bodyB);
	        }
	    }
	
	    accumulator.reset();
	
	    return result;
	};


/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = OverlapKeeperRecord;
	
	/**
	 * Overlap data container for the OverlapKeeper
	 * @class OverlapKeeperRecord
	 * @constructor
	 * @param {Body} bodyA
	 * @param {Shape} shapeA
	 * @param {Body} bodyB
	 * @param {Shape} shapeB
	 */
	function OverlapKeeperRecord(bodyA, shapeA, bodyB, shapeB){
	    /**
	     * @property {Shape} shapeA
	     */
	    this.shapeA = shapeA;
	    /**
	     * @property {Shape} shapeB
	     */
	    this.shapeB = shapeB;
	    /**
	     * @property {Body} bodyA
	     */
	    this.bodyA = bodyA;
	    /**
	     * @property {Body} bodyB
	     */
	    this.bodyB = bodyB;
	}
	
	/**
	 * Set the data for the record
	 * @method set
	 * @param {Body} bodyA
	 * @param {Shape} shapeA
	 * @param {Body} bodyB
	 * @param {Shape} shapeB
	 */
	OverlapKeeperRecord.prototype.set = function(bodyA, shapeA, bodyB, shapeB){
	    OverlapKeeperRecord.call(this, bodyA, shapeA, bodyB, shapeB);
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var OverlapKeeperRecord = __webpack_require__(60);
	var Pool = __webpack_require__(30);
	
	module.exports = OverlapKeeperRecordPool;
	
	/**
	 * @class
	 */
	function OverlapKeeperRecordPool() {
		Pool.apply(this, arguments);
	}
	OverlapKeeperRecordPool.prototype = new Pool();
	OverlapKeeperRecordPool.prototype.constructor = OverlapKeeperRecordPool;
	
	/**
	 * @method create
	 * @return {OverlapKeeperRecord}
	 */
	OverlapKeeperRecordPool.prototype.create = function () {
		return new OverlapKeeperRecord();
	};
	
	/**
	 * @method destroy
	 * @param {OverlapKeeperRecord} record
	 * @return {OverlapKeeperRecordPool}
	 */
	OverlapKeeperRecordPool.prototype.destroy = function (record) {
		record.bodyA = record.bodyB = record.shapeA = record.shapeB = null;
		return this;
	};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(8)
	,   Island = __webpack_require__(63)
	,   IslandNode = __webpack_require__(64)
	,   IslandNodePool = __webpack_require__(65)
	,   IslandPool = __webpack_require__(66)
	,   Body = __webpack_require__(12);
	
	module.exports = IslandManager;
	
	/**
	 * Splits the system of bodies and equations into independent islands
	 *
	 * @class IslandManager
	 * @constructor
	 * @param {Object} [options]
	 * @extends Solver
	 */
	function IslandManager(options){
	
	    /**
	     * @property nodePool
	     * @type {IslandNodePool}
	     */
	    this.nodePool = new IslandNodePool({ size: 16 });
	
	    /**
	     * @property islandPool
	     * @type {IslandPool}
	     */
	    this.islandPool = new IslandPool({ size: 8 });
	
	    /**
	     * The equations to split. Manually fill this array before running .split().
	     * @property {Array} equations
	     */
	    this.equations = [];
	
	    /**
	     * The resulting {{#crossLink "Island"}}{{/crossLink}}s.
	     * @property {Array} islands
	     */
	    this.islands = [];
	
	    /**
	     * The resulting graph nodes.
	     * @property {Array} nodes
	     */
	    this.nodes = [];
	
	    /**
	     * The node queue, used when traversing the graph of nodes.
	     * @private
	     * @property {Array} queue
	     */
	    this.queue = [];
	}
	
	/**
	 * Get an unvisited node from a list of nodes.
	 * @static
	 * @method getUnvisitedNode
	 * @param  {Array} nodes
	 * @return {IslandNode|boolean} The node if found, else false.
	 */
	IslandManager.getUnvisitedNode = function(nodes){
	    var Nnodes = nodes.length;
	    for(var i=0; i!==Nnodes; i++){
	        var node = nodes[i];
	        if(!node.visited && node.body.type === Body.DYNAMIC){
	            return node;
	        }
	    }
	    return false;
	};
	
	/**
	 * Visit a node.
	 * @method visit
	 * @param  {IslandNode} node
	 * @param  {Array} bds
	 * @param  {Array} eqs
	 */
	IslandManager.prototype.visit = function (node,bds,eqs){
	    bds.push(node.body);
	    var Neqs = node.equations.length;
	    for(var i=0; i!==Neqs; i++){
	        var eq = node.equations[i];
	        if(eqs.indexOf(eq) === -1){ // Already added?
	            eqs.push(eq);
	        }
	    }
	};
	
	/**
	 * Runs the search algorithm, starting at a root node. The resulting bodies and equations will be stored in the provided arrays.
	 * @method bfs
	 * @param  {IslandNode} root The node to start from
	 * @param  {Array} bds  An array to append resulting Bodies to.
	 * @param  {Array} eqs  An array to append resulting Equations to.
	 */
	IslandManager.prototype.bfs = function(root,bds,eqs){
	
	    // Reset the visit queue
	    var queue = this.queue;
	    queue.length = 0;
	
	    // Add root node to queue
	    queue.push(root);
	    root.visited = true;
	    this.visit(root,bds,eqs);
	
	    // Process all queued nodes
	    while(queue.length) {
	
	        // Get next node in the queue
	        var node = queue.pop();
	
	        // Visit unvisited neighboring nodes
	        var child;
	        while((child = IslandManager.getUnvisitedNode(node.neighbors))) {
	            child.visited = true;
	            this.visit(child,bds,eqs);
	
	            // Only visit the children of this node if it's dynamic
	            if(child.body.type === Body.DYNAMIC){
	                queue.push(child);
	            }
	        }
	    }
	};
	
	/**
	 * Split the world into independent islands. The result is stored in .islands.
	 * @method split
	 * @param  {World} world
	 * @return {Array} The generated islands
	 */
	IslandManager.prototype.split = function(world){
	    var bodies = world.bodies,
	        nodes = this.nodes,
	        equations = this.equations;
	
	    // Move old nodes to the node pool
	    while(nodes.length){
	        this.nodePool.release(nodes.pop());
	    }
	
	    // Create needed nodes, reuse if possible
	    for(var i=0; i!==bodies.length; i++){
	        var node = this.nodePool.get();
	        node.body = bodies[i];
	        nodes.push(node);
	        // if(this.nodePool.length){
	        //     var node = this.nodePool.pop();
	        //     node.reset();
	        //     node.body = bodies[i];
	        //     nodes.push(node);
	        // } else {
	        //     nodes.push(new IslandNode(bodies[i]));
	        // }
	    }
	
	    // Add connectivity data. Each equation connects 2 bodies.
	    for(var k=0; k!==equations.length; k++){
	        var eq=equations[k],
	            i=bodies.indexOf(eq.bodyA),
	            j=bodies.indexOf(eq.bodyB),
	            ni=nodes[i],
	            nj=nodes[j];
	        ni.neighbors.push(nj);
	        nj.neighbors.push(ni);
	        ni.equations.push(eq);
	        nj.equations.push(eq);
	    }
	
	    // Move old islands to the island pool
	    var islands = this.islands;
	    for(var i=0; i<islands.length; i++){
	        this.islandPool.release(islands[i]);
	    }
	    islands.length = 0;
	
	    // Get islands
	    var child;
	    while((child = IslandManager.getUnvisitedNode(nodes))){
	
	        // Create new island
	        var island = this.islandPool.get();
	
	        // Get all equations and bodies in this island
	        this.bfs(child, island.bodies, island.equations);
	
	        islands.push(island);
	    }
	
	    return islands;
	};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var Body = __webpack_require__(12);
	
	module.exports = Island;
	
	/**
	 * An island of bodies connected with equations.
	 * @class Island
	 * @constructor
	 */
	function Island(){
	
	    /**
	     * Current equations in this island.
	     * @property equations
	     * @type {Array}
	     */
	    this.equations = [];
	
	    /**
	     * Current bodies in this island.
	     * @property bodies
	     * @type {Array}
	     */
	    this.bodies = [];
	}
	
	/**
	 * Clean this island from bodies and equations.
	 * @method reset
	 */
	Island.prototype.reset = function(){
	    this.equations.length = this.bodies.length = 0;
	};
	
	var bodyIds = [];
	
	/**
	 * Get all unique bodies in this island.
	 * @method getBodies
	 * @return {Array} An array of Body
	 */
	Island.prototype.getBodies = function(result){
	    var bodies = result || [],
	        eqs = this.equations;
	    bodyIds.length = 0;
	    for(var i=0; i!==eqs.length; i++){
	        var eq = eqs[i];
	        if(bodyIds.indexOf(eq.bodyA.id)===-1){
	            bodies.push(eq.bodyA);
	            bodyIds.push(eq.bodyA.id);
	        }
	        if(bodyIds.indexOf(eq.bodyB.id)===-1){
	            bodies.push(eq.bodyB);
	            bodyIds.push(eq.bodyB.id);
	        }
	    }
	    return bodies;
	};
	
	/**
	 * Check if the entire island wants to sleep.
	 * @method wantsToSleep
	 * @return {Boolean}
	 */
	Island.prototype.wantsToSleep = function(){
	    for(var i=0; i<this.bodies.length; i++){
	        var b = this.bodies[i];
	        if(b.type === Body.DYNAMIC && !b.wantsToSleep){
	            return false;
	        }
	    }
	    return true;
	};
	
	/**
	 * Make all bodies in the island sleep.
	 * @method sleep
	 */
	Island.prototype.sleep = function(){
	    for(var i=0; i<this.bodies.length; i++){
	        var b = this.bodies[i];
	        b.sleep();
	    }
	    return true;
	};


/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = IslandNode;
	
	/**
	 * Holds a body and keeps track of some additional properties needed for graph traversal.
	 * @class IslandNode
	 * @constructor
	 * @param {Body} body
	 */
	function IslandNode(body){
	
		/**
		 * The body that is contained in this node.
		 * @property {Body} body
		 */
	    this.body = body;
	
	    /**
	     * Neighboring IslandNodes
	     * @property {Array} neighbors
	     */
	    this.neighbors = [];
	
	    /**
	     * Equations connected to this node.
	     * @property {Array} equations
	     */
	    this.equations = [];
	
	    /**
	     * If this node was visiting during the graph traversal.
	     * @property visited
	     * @type {Boolean}
	     */
	    this.visited = false;
	}
	
	/**
	 * Clean this node from bodies and equations.
	 * @method reset
	 */
	IslandNode.prototype.reset = function(){
	    this.equations.length = 0;
	    this.neighbors.length = 0;
	    this.visited = false;
	    this.body = null;
	};


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var IslandNode = __webpack_require__(64);
	var Pool = __webpack_require__(30);
	
	module.exports = IslandNodePool;
	
	/**
	 * @class
	 */
	function IslandNodePool() {
		Pool.apply(this, arguments);
	}
	IslandNodePool.prototype = new Pool();
	IslandNodePool.prototype.constructor = IslandNodePool;
	
	/**
	 * @method create
	 * @return {IslandNode}
	 */
	IslandNodePool.prototype.create = function () {
		return new IslandNode();
	};
	
	/**
	 * @method destroy
	 * @param {IslandNode} node
	 * @return {IslandNodePool}
	 */
	IslandNodePool.prototype.destroy = function (node) {
		node.reset();
		return this;
	};


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var Island = __webpack_require__(63);
	var Pool = __webpack_require__(30);
	
	module.exports = IslandPool;
	
	/**
	 * @class
	 */
	function IslandPool() {
		Pool.apply(this, arguments);
	}
	IslandPool.prototype = new Pool();
	IslandPool.prototype.constructor = IslandPool;
	
	/**
	 * @method create
	 * @return {Island}
	 */
	IslandPool.prototype.create = function () {
		return new Island();
	};
	
	/**
	 * @method destroy
	 * @param {Island} island
	 * @return {IslandPool}
	 */
	IslandPool.prototype.destroy = function (island) {
		island.reset();
		return this;
	};


/***/ },
/* 67 */
/***/ function(module, exports) {

	var fpUtil = {
	};
	
	fpUtil.addEventListener = function(target, name, callback) {
	    var events = target._fpUtil_events;
	    if (!events)
	        events = target._fpUtil_events = {};
	    var listeners = events[name];
	    if (!listeners)
	        listeners = events[name] = [];
	    listeners.push(callback);
	},
	
	fpUtil.removeEventListener = function(target, name, callback) {
	    var events = target._fpUtil_events;
	    var listeners = events[name];
	    if (!listeners)
	        return;
	    for (var i = 0; i < listeners.length; i ++)
	        if (listeners[i] === callback) {
	            listeners.splice(i, 1);
	            break;
	        }
	    if (!listeners[i].length)
	        delete events[name];
	};
	
	fpUtil.hasEvent = function(target, name) {
	    var events = target._fpUtil_events;
	    if (!events)
	        return false;
	    var listeners = events[name];
	    if (!listeners)
	        return false;
	    return true;
	};
	
	fpUtil.fireEvent = function(target, name, args) {
	    var events = target._fpUtil_events;
	    if (!events)
	        return;
	    var listeners = events[name];
	    if (listeners)
	        listeners.forEach(function(callback) { callback.apply(null, args); });
	};
	
	module.exports = fpUtil;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// Mr. Floppypants View
	var fpUtil = __webpack_require__(67);
	
	var fpView = {
	};
	
	var SCREEN_CENTER = [0.5, 0.6];
	
	var position = [0, 0];
	var offset = [0, 0];
	var zoom = 1;
	var angle = 0;
	var flip = false;
	
	var elem = document.createElement('canvas');
	
	function resize() {
	    elem.width = document.body.clientWidth;
	    elem.height = document.body.clientHeight;
	}
	
	resize();
	window.addEventListener('load', resize);
	window.addEventListener('resize', resize);
	document.body.appendChild(elem);
	
	fpView.screenWidth = function () {
	    return elem.width;
	};
	
	fpView.screenHeight = function () {
	    return elem.height;
	};
	
	var context = elem.getContext('2d', {alpha: false});
	
	fpView.context = function () {
	    return context;
	};
	
	fpView.position = function (v) {
	    if (v != null) {
	        position = v.slice();
	        return fpView;
	    }
	    return position.slice();
	};
	
	fpView.offset = function (v) {
	    if (v != null) {
	        offset = v.slice();
	        return fpView;
	    }
	    return offset.slice();
	};
	
	fpView.zoom = function (v) {
	    if (v != null) {
	        zoom = v;
	        return fpView;
	    }
	    return zoom;
	};
	
	fpView.angle = function (v) {
	    if (v != null) {
	        angle = v;
	        return fpView;
	    }
	    return angle;
	};
	
	fpView.flip = function (v) {
	    if (v != null) {
	        flip = v;
	        return fpView;
	    }
	    return flip;
	};
	
	fpView.getWorldTransform = function() {
	    return {
	        position: fpView.worldToScreen([0, 0]),
	        angle: angle,
	        scale: zoom,
	        flip: flip
	    };
	};
	
	fpView.worldToScreenX = function(x) {
	    return fpView.screenWidth() * SCREEN_CENTER[0] + (x - position[0]) * zoom + offset[0];
	};
	
	fpView.worldToScreenY = function(y) {
	    return fpView.screenHeight() * SCREEN_CENTER[1] + (y - position[1]) * zoom + offset[1];
	};
	
	fpView.worldToScreen = function(pos) {
	    if (pos == null)
	        return null;
	    return [fpView.worldToScreenX(pos[0]), fpView.worldToScreenY(pos[1])];
	};
	
	fpView.screenToWorldX = function(x) {
	    return (x - fpView.screenWidth() * SCREEN_CENTER[0] - offset[0]) / zoom + position[0];
	};
	
	fpView.screenToWorldY = function(y) {
	    return (y - fpView.screenHeight() * SCREEN_CENTER[1] - offset[1]) / zoom + position[1];
	};
	
	fpView.screenToWorld = function(pos) {
	    if (pos == null)
	        return null;
	    return [fpView.screenToWorldX(pos[0]), fpView.screenToWorldY(pos[1])];
	};
	
	function screenClip(position) {
	    if (position == null)
	        return null;
	    return [
	        Math.max(0, Math.min(fpView.screenWidth(), position[0])),
	        Math.max(0, Math.min(fpView.screenHeight(), position[1]))
	    ];
	}
	
	var clientMousePosition = null;
	var mouseIsDown = false;
	
	fpView.screenMousePosition = function () {
	    return screenClip(clientMousePosition);
	};
	
	fpView.mousePosition = function () {
	    return fpView.screenToWorld(fpView.screenMousePosition());
	};
	
	fpView.mouseIsDown = function() {
	    return mouseIsDown;
	};
	
	function mouseDown(event) {
	    mouseIsDown = true;
	    clientMousePosition = [event.clientX, event.clientY];
	    fpUtil.fireEvent(fpView, 'mousedown', [event]);
	}
	
	function mouseMove(event) {
	    clientMousePosition = [event.clientX, event.clientY];
	    fpUtil.fireEvent(fpView, 'mousemove', [event]);
	}
	
	function mouseUp(event) {
	    if (mouseIsDown) {
	        fpUtil.fireEvent(fpView, 'mouseup', [event]);
	        mouseIsDown = false;
	        var client = clientMousePosition;
	        var screen = fpView.screenMousePosition();
	        if (client[0] != screen[0] || client[1] != screen[1])
	            clientMousePosition = null;
	    }
	}
	
	function mouseOut(event) {
	    if (!mouseIsDown)
	        clientMousePosition = null;
	}
	
	document.addEventListener('mousedown', mouseDown);
	document.addEventListener('mousemove', mouseMove, true);
	document.addEventListener('mouseup', mouseUp, true);
	document.addEventListener('mouseout', mouseOut);
	
	var MOVE_TOWARD_CONST = 30;
	
	fpView.moveToward = function(target) {
	    function step(from, to, limits) {
	        if (to - from > limits[1])
	            from = to - limits[1];
	        else if (to - from < limits[0])
	            from = to - limits[0];
	        return (from * (MOVE_TOWARD_CONST - 1) + to) / MOVE_TOWARD_CONST;
	    }
	    var xLimits = [150 - fpView.screenWidth() * SCREEN_CENTER[0], fpView.screenWidth() - 150 - fpView.screenWidth() * SCREEN_CENTER[0]];
	    var yLimits = [150 - fpView.screenHeight() * SCREEN_CENTER[1], fpView.screenHeight() - 150 - fpView.screenHeight() * SCREEN_CENTER[1]];
	    this.position([step(position[0], target[0], xLimits), step(position[1], target[1], yLimits)]);
	};
	
	module.exports = fpView;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// Mr. Floppypants Context
	
	var fpContext = {
	};
	
	var imageCache = {};
	
	fpContext.transform = function(context, param) {
	    if (!param)
	        return;
	    if (param.position)
	        context.translate(param.position[0], param.position[1]);
	    if (param.angle)
	        context.rotate(param.angle * Math.PI / 180);
	    if (param.scale)
	        context.scale(param.scale, param.scale);
	    if (param.offset)
	        context.translate(-param.offset[0], -param.offset[1]);
	    if (param.flip)
	        context.scale(-1, 1);
	};
	
	fpContext.setTransform = function(context, param) {
	    context.setTransform(1,0,0,1,0,0);
	    fpContext.transform(context, param);
	};
	
	fpContext.image = function(context, image, param) {
	    var img = imageCache[image];
	    if (!img) {
	        img = imageCache[image] = new Image();
	        img.src = __webpack_require__(70)("./" + image + '.png');
	    }
	    context.save();
	    fpContext.transform(context, param);
	    context.drawImage(img, 0, 0);
	    context.restore();
	};
	
	fpContext.polypolygon = function(context, polypolygon, param) {
	    context.save();
	    fpContext.transform(context, param);
	    context.beginPath();
	    polypolygon.forEach(function(polygon) {
	        polygon.forEach(function(point, i) {
	            if (i == 0)
	                context.moveTo(point[0], point[1]);
	            else
	                context.lineTo(point[0], point[1]);
	        });
	        if (polygon.length)
	            context.lineTo(polygon[0][0], polygon[0][1]);
	    });
	    context.restore();
	};
	
	module.exports = fpContext;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./arm-left-lower.png": 71,
		"./arm-left-upper.png": 72,
		"./ball.png": 73,
		"./bathtub1.png": 74,
		"./bathtub2.png": 75,
		"./bed.png": 76,
		"./chair.png": 77,
		"./chimney.png": 78,
		"./cursor-grab.png": 79,
		"./cursor-grabbing.png": 80,
		"./cursor-point.png": 81,
		"./doorwall.png": 82,
		"./floor1.png": 83,
		"./floor15.png": 84,
		"./floor4.png": 85,
		"./floor9.png": 86,
		"./glass.png": 87,
		"./grass1.png": 88,
		"./grass2.png": 89,
		"./hand-left.png": 90,
		"./hatch.png": 91,
		"./head-ouch.png": 92,
		"./head.png": 93,
		"./pants-left-lower.png": 94,
		"./pants-left-upper.png": 95,
		"./pants-top.png": 96,
		"./pillow.png": 97,
		"./plate.png": 98,
		"./redblock.png": 99,
		"./roof.png": 100,
		"./shirt-middle.png": 101,
		"./shoe-left.png": 102,
		"./sink1.png": 103,
		"./sink2.png": 104,
		"./stairs.png": 105,
		"./sun.png": 106,
		"./table.png": 107,
		"./wall3.png": 108,
		"./wall5.png": 109,
		"./window.png": 110,
		"./windowwall.png": 111
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 70;


/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAYAAACcuBHKAAAEHUlEQVRYw+WXb2iVdRTHP+f3e+6/3bvrWFvZplablcsNzQ3SnMFg9CqmSQyXUauWI+mNL6sXCRFULwwbA1lKKIoVUkIpTGJEGVTUNhtROSu1onXV3H30bt7tPs+vF/fZdm93021uGXTg4Xnx/HjO93zPOd9zfvAfMD3P/1fAdqAc6JnqkDWPAALAPqCx4C7r3fteKHwfWO49nZ3NsdNjB2WeABQBR4GaOx4KSem6kBMq0lrpcXdfA7WdzbHkGF1zbUuA4yiql22OSGltCKVEpxIm80wN0D5fNbES4VPlY9HyJ/N14T1+lBbEApQgAhlsrFq6IXzmp8OJ3rlMxwPAh76IhCufjupIqYVoEJV2LBpEgw4IIuNufwVun6vCbAT2B29SqqolqoNFGuUBEEvSby0oDZisSnylsznmzgWIp4COvIWaypaoDi5QiAWi0tErnQaQBkImCyeA3XPRoi8CLxeUW1Q8kS++sMqhX5SgPFAZZpwRd+fHW86b62lRDbwJbC1a4TN3b8oX7ZfsqC1BqQkgmZYYSNG9Iz40FHMOAFtmw0QQOABsLF0XoKwhLOnIr0k/ALGeJN/ush1n1NhAx2zSUeyJUPXSR8KUrAlm0+8VYBpMtnM3Zfh+/yV+++QKCF0YmoALM03HUuAYmtsqNuer4hX+nKgnwGT/Njno0Ntum8H+UYDngde9PpnR7LgXoVMHKKxqiaoFZb6JvOuJTpiM/ov9I/S22c7IJTcBPAocmc0AexD4wB8Rf1XrmAiJl4ap6Qf4+UiC/kMJI8JJDA3AqckcXCsdm4B9ebcoVdUa1aFCPRH1VarfSRq+e9vmjy+SIOzF8CwwPJWTq4F4BtgVKdVUbomqtAhJrg78g/7hCw69bXHHPp0ST0dey8z/TPaJl4DtRZV+t+LxiNIBld1+U9D/5zdJ+jps102Zi8DDwPHpFJxMIkLtQOvN1QGWNYVRfjU+B5QloHIBGGP45egQ/YcSBujGsBE4O922y2QiBBwE1i+uC1LWkIfyKUQyuyA3/6lhl763bDfWPaKAPcBzQHIm4jMGohD4CFhdviGPxXV5E2PYmlr9Lv+eontnPDV8znGBrR6IGdsYiB3Amjsbw5TWhqbVfgNfXaFvt+2aFDEM672V7bq27fNAUzLuqoU1AWWFBGWlp1+O/DqGk+9d5seDCYxLF4b6qfp/piDOAp+N2qbprx9G1K2rg8oKSa782i49b8SdgS+TArzq7RKJ611IZJIVrbN4hT+waltB1rfBU6P0tsWdpO1ewfAYcHi+Lj9ngOjwOWftkvqQaH8ax9muIU60225qxPRjqAM+n+9b2f2AqWqNmvqOYlOyNuh6ivcOEPm3roYKxfnCCp+JLNIpIAVsuxF31D2AEcU5r05uiK0E9gIl/F/sbzDvLmhkcMYNAAAAAElFTkSuQmCC"

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAgCAYAAAB3j6rJAAAEBElEQVRYw+WXXUwcVRTHf+fe3YVddsG2oItapNQKrfbFaoJNE4uxUdvqgxWtgpb4FTUxMWlMakwTX41vrZoWE2oTDMbIo6ZNfKhJpW2wxlIxIFGrIBEole5SmP2YuT7sLOxut7AU0IeeZDKTzE3Ob87//M/cCzdohIHt/yeAAl4DImgmAJ27QP4DiHqgFdh4870+U/tscDxQ4fkK6HevM8dbRv/yLCOAH3gP2OspgdrdIW59oFhEUw7syVh3BHhxuUC2IHyKYW3l5iLuagziCylEg8hVItyzHNKsBA4Bjf4KZW/YE9Ir1vlSAApE5U03BYSWEuRJhEMYyqse9kvNzgDar1BzQ6TjzqWQpgL4GHiqpFLb658PSmmVF/EIShUEAXD3YkFeBT5AEVyzw0/VQwGtfYJoUhC6IAiAjbKIXvgI2B0IK6euKaTKqr2pr3eTK0/BENPA/ddTkZ0IbQirqh/zU9XgV8qnsiAWUAmAvcdbRnsXAlLu9kJj6A6PU/dcUAUqNEpLlitEg9IFQ0y4LqNQkAaEdgyVtzcUU/1oQKV6IQNCLxiC4VPWTf0dk53ArvlANLAf2O8rFbO+KSRlNd5ZCTJcIapwiPikw89Ho4x0xxDFLYDMBVIDfAFsqtxcxJrtJXiKJKsPVFZPFFaFke8teo9E7cSUcYC3jcMBwFwL5BGEDtGUrX08QLi+GKUE8WQnzn2eK5KWQ//nkwydsED4FUMz0J1+nw/kDeCAf5WSuuaQKgnrFIQGEWbl0NnSzBX/DMQ5fzhiT190FHAQwz7XtuQD8bqueHllnYd1z4Tw+vM0pHsvZGAlY4b+jmiqCoo/gCbgdL61krFxOQo0h+uLqNkRQHllJrHSGRAeQYR5B1Z0MElPa8SZHEwqoB1407Vr3khX5HWguWpbMau3BlJfmg9CufLMUQnjGC4cm2Kg84pjDJeBV4DO+Zo4DbIrENZm9daAXMuahYzuqTGb860RZ2IgoYBjwEvA34W4KQ2idJFI9kwAlIDKdUh+iKFvp+n7LOrYCSzgLeCThfw30iC/WxeTW0SjZ2aCyi9NbsQuO/S2RczYubgAp4AXgN+uZ3cN0J24gp6+ZGe5Q+kcaXK2eSNnY5x8Zzw5di6eAPYBD14PRGZFvgbM+E9xCVZ6syH01RCJKYe+9kmGuywQ+lxb9iz2vAFwATgxfNKyjWOym1TNQhhjGP0xxnfvXrKHuywHeB/DfYuFIOegM2hbtOhiYUWtL2tgxaMOw10WPYcj9uA308qOmT+BJ4A2wF6KDW+uBToQnt7QElSh2zxEh2xGz8bMeG8c4yAIpzF8CHwJxJbzVFaKcAYwM5diDDgIbFrOxPmGgg/YBpQCPwC/uFA3RvwLUtUglL2O4ewAAAAASUVORK5CYII="

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAP30lEQVRo3s2ae3AU1Z7HPzPdPZOZJBPzIA8IyZAHxITwSHilkmzdFbHqBr2uaGkprKAu4mJpeXXVWne33KW21LLq4mpRULoqqAHUFe6uUNcVFAiEPCABAiSRPMiDTCSBxGQyj8xMT/f+Y3f15AG4eq17qrq6p6fP6d/39/29zjlt4pdvGcDtQDKQBEQBfsAH9ALfAT2Ayl9YSwLWOhyO/5EkyfujgDc87Ha7Py8vrzYvL+/5HwH/7Gb6GX1/Y7PZng0EAr9TFEUQRRGn00lGRgYzZ87EbrcTGxuLKIqEw2FaW1vx+XyYTCZ6enro6elBlmUEQVBzc3NbTSbTv7S2tu7/NYEssdls7/j9/hJBECgsLKSoqIicnBysVismkyniADCbzdTU1GC321mwYAGKojA+Pk5bWxuNjY00NzcTDofJzs6+OnPmzBdOnDix588JxA5sMZlMz4uiaCopKeHOO+8kLi4Os9k8CcBEMMeOHSMhIYGCggIAVFUlFAohyzJut5uqqipqamoIBoMUFxdfaGxsXAUM/NJAsm022yG/35+Vn5/PQw89RHJyMoIg6BrXzhMBaO3rr78mPT2d22+/XQcSDoeRZRlZlgmFQrjdbr788kvOnDmDw+GQV61a9ft9+/Zt+6WA/JXFYvmToijRDzzwAOXl5VgsFiwWiy6sIAgRADRgxrZ//34yMzNZuHChDkRRFBRF0ZnRALW0tPDpp5/i9XpZuXLlvsOHDz/wc4GsFEXxK5vNJm3atIns7GysVitWqxVJkqYFoQHxeDzU1dVRXV3Nd999h8lkoqKigvvuuw9JklAUBVVVdQDhcFg/Dw0NsWvXLjo7OykrK6uprq4uB5T/D5CloiietNvtUkpKCmvXriUjIwOLxYLNZkMURR2EUXhBEOjq6uLgwYNUVVURCoUmDTxjxgw2b95MQUGBbl7aORgM6udAIMDOnTtpampi6dKlDadPn142Xf4RpktqUVFRtaIo2pOTk3G5XLrQmsZEUSQqKgqbzYYkSVgsFvr6+njrrbfYuXMnly9fRlGmVqDP5+PEiROYTCYKCwsRBEH3L+O1yWRi4cKFDA4O0tDQMLO0tLT4ypUre2+VEcHhcDR6vd6FaWlpXL9+HZPJREJCAqtXr2Z8fJzx8XHGxsbwer1YLBYcDgeKonDkyJFphdeaqkYqdMmSJbz88ssIgqD7iSzLBAIBQqEQwWAQv9/Pjh07aG1tpby8/F9PnDjxb7cC5J+Af09MTMTr9eoOff/99/Pwww8TFRWlm5UkSQQCATweDyMjI2zevBlZln9yYiooKGDdunVkZWVhNpt1XwmFQoyPjxMMBvn+++/Ztm0bo6Ojyvj4+ELg4o1MK0sQhP1Wq9UcDAZ1u58/fz5PPfUUMTExREVF6SBEUcRutxMfH09KSgr19fUMDAz8ZCBjY2OYzWYOHz5MZ2cnbrcbk8lETEwMgiDg8/n4wx/+wJo1a2hoaDClpKSs8Xg8/2H0lwggDofjk0AgMM9sNus5Ij4+nldeeYX4+Hg9WgmCgCAIOjOaTQ8ODtLY2PiTgTzzzDNs3LiRsrIy4uPjGR4e5ty5cxw5coTe3l7a29u5ePEiPT09LFu2jKamphin08nIyMixqUwrF7iUlJRk8ng8ukm9+OKLLF++HLvdjt1u1wWXJEmPVtqzzc3NbNiw4Sf5SE5ODp988gnApKjl9Xrp6uqisrKSCxcuoKoqsbGxqKqK1+sN+Hy+GcAYgJ65oqOj/xEwaYUdwKJFiygqKtKjkiiKiKKom5UGRGNo/vz5OByOGyeuCeXLs88+iyiKehg3sh0dHU1eXh4Wi0XvOzY2RjgcxufzWRMTE5/XxtWARMmy/HBycrIedQRBYN26dYiiGAFCe4kxf2jXkiSxbNmyWzap0tJSysvLdQATFaNdr1y5MkIRPp8Pi8VCMBj8vYZBA7I6EAhEqaqq54rMzExmzZqFxWJBEASsVmuEXxhfZtRmbm7uLYGQJImXXnopQhna+NpYGmsrVqwgKSlJ76v1GRsbiwN+AyAC3HbbbQ+53W6efPJJ4uLiaGtrw+12I0mSblZapNIimSa80Uza2tpob2/njTfewGKx4PF4GBgY0I/+/n5cLhcej4cHH3yQ7OxswuGwPqamSO23JEmoqookSaxatYq9e/dOMtH4+Pi/Gx4ePiICBIPBlbNmzSIxMRG73c6KFSvYuXOnnsE1UzJqxFhbmUwm/H4/77//Pk8//TT5+fnTOrqqqmzfvp1Zs2bp/cPhsM6IoiiYzWZEUSQUCun3ysrK+PTTT/VgYTKZcDqdXLt2bZVmWsk+ny8hMzNTH9hut5Oenk5HR4duQkYgmkDaAbB3716Ki4vJz8/XqZ94aKazevVqamtrUVV1EqtGkzX6TkZGBunp6ZFJLysLj8eTBKSZgXyA1NTUCA0XFhbS3Nysg9DKbqPwGqjGxkY6Ojq4//77pwyxE1tWVhYWi4WOjg7dnIxAJoLQjqKiogiFGvxmnhnI0ipSDYQoiuTl5dHd3U0wGIwQ3nhWVRW3201lZSVPPPEEFotlEtDpzKu0tJTjx49HKMfY1zin0UDm5eVFjBUTE6NdZpqBRO2msRyPjo4mIyOD1tbWKQXRXvjZZ5+xbNkysrKybsqE1k9RFJYvX87Zs2fx+/0RbGvh3ziWce6v1XIT/DZaBBwANptN76TRvXjxYs6cOcOSJUswm80RbJhMJurr63G5XDz22GP6Pc1ZtfNEINqsMCYmhry8POrr6ykvL58EZqJSZFmmrq6Oxx9/nBUrViBJEp2dnXqpZQYC2oOaP4iiCEBeXh6dnZ34/X5kWWZ0dBS3201/fz/t7e1UVlby6KOPIgjCJKYmanWikKqqUlJSwsmTJyPuTQVCVVWqqqpISEigoqKC6OhoVFUlEAhoj/hFwA3oNzVGVFUlKiqK3t5eVq1aNclmAQoLC8nMzIwwGyOjE0GEw+GI3wUFBVRWVtLX10daWtqUIAD6+vqoq6tj06ZN+nvC4TBer1d7ZMQMXAYYGhqaNEA4HCYqKmrKxQSA1tZWRkZGJgUAzXyMNm8EYwRdUlJCdXV1BKNaf4Dx8XH27NnD3XffrTNhDDQ/tmvmH9diuXr16iQNTheBtHuyLHPgwIEpo442jhHUVMIWFxezY8cOtmzZwqFDhxgaGoowsUOHDpGamqov7CmKojNrmPt0ikBnTEyMv6ury2YUVlGUW5rt7du3j7Vr1+rzl6lAaeep/OSbb77B7XZz8OBBDh48iNlsJjc3l+LiYlJTU2lsbOS5556bkvWrV68iSZIcCoVcIqCmpqY2d3V1LQmFQhF2rigKoihOsnlj5Orp6aG2tpaysrIINjStTZV7NFBXrlzh3XffneRPly5d4tKlSwSDQbZu3YrdbicQCOimqZnn5cuXSUxMvHz16lXVDGC1WncHg0Gam5v1wbQO0dHRN2WlsrJyEoiJZmVkQfv/9ddfZ3x8fNpxY2JiKCoqmpLpwcFBhoeHUVX1W72Mb25u/tBisSjV1dV0dnYyNDSko74REE34uro6PXFO5QdGB9eO/fv3c+rUqRsqaPbs2REsyLKsK6SpqUnzkz/qZTzgLiwsPHvmzJni1NRUfQUjOTmZ69evT2laE9tHH33E66+/HmF2ExOhxva1a9fYsWPHTZnOycnRlTCR4cbGRmw2m9fv9x81AkEQhJdVVf1GlmU2btyIqqqMjo7S0tLClStXMM7jp/KVr776CrfbTWZmJomJicTHx0ccCQkJ2Gw2VFVl69atjI6O3rScmTt3rs6E0b9cLhft7e3Y7fb/AuRJ61oLFizobm5uznzjjTeYPXs2kiRhtVoZGRnhzTff5PLly9POwzds2MCaNWtwu90MDw8zPDzMDz/8wA8//KD/NpvNxMXFcfjwYWNWntZkd+3aRWJiIoFAAFmWGR8fx+/38+GHH3Ls2DGAQm19SzQOMHfu3E0XL1783927d/PSSy/pVCYlJfHmm2+yY8cOvv3224iXxsbG8uqrr+r1UnJycsTkxxixfD4fw8PDABw8ePCGIDIyMkhKSopYFw6HwwwMDFBdXY3dbq/y+XwXp1zXamlp6bzjjjt+W1tbm56cnIzT6dRLe6vVSllZGenp6Zw+fZpwOEx+fj7bt2+P2POYrtZSVRVRFImNjSUjI4P9+/ffkJGcnBxKS0sjHF2WZd577z36+/vVUCj0N8aNoEmL2F1dXXvT0tJeqK2tFZcuXYrD4YhYbMjNzcXpdNLb28v27duJi4ubshqYLjGqqorD4eDUqVNcu3ZtSjays7PJycnhwoUL5Obm6pHr+PHjfPnllwD/Cbxv7DtVEeW99957NymKwtatWxkZGdEXkzV6S0pKSElJmZRpJ4ZcYz7S+mrP3XvvvREvtVqtVFRUsG3bNt555x02bNiAw+Hg448/xuv10tfXx65du7BarX3AP9zStkJDQ0PTmjVr5tTV1S3q6OhgxYoVeobXTK2jo4O4uDgSExOnrKOmSmLG/8+fP8+5c+dIT09nw4YNvPDCC5SWlhIXF6eH3OzsbIaHh2loaGD37t243e6QLMu/1QrdW9kfoaWl5b8rKirKampqsjo7OykuLo6Yv4+MjDAwMEB2draeqKZKfBOzuqqqnD9/npMnT/LMM8+wfv16cnNzI+Y0Rhajo6PZs2cP/f39qqqqjwCHfspGDwDt7e2frFy58q9ra2udTU1NLFq0CKvVqv9/6tQplixZMsl0jKZlzMaqqtLX10dlZSUbN24kIyMjItFpa74akJ6eHrZs2YLL5VKBvwc+nk5W4WbZtaura9c999wz79SpU4VVVVWkpaUxY8YMbDYbR48eZcGCBfpcOhwOEwwG9c1NbXdLux4bG+ODDz7grrvuYvbs2Xof7TA+f+LECV577TVGR0dl4G+BXTeS86ZAANra2vbdd999I93d3XcePXrUPDQ0hNPpZGBggMHBQY4fP47ZbNbn/UaGNFDBYJDPP/+ctLQ0li9fPik/aEnP5XLx9ttv88UXXyAIgkuW5buAr3/pLx9mLl68+NDZs2cL7HY7ixcvpru7W09ykiThdDrJzs5mzpw5ZGZmkpKSgtlspr6+nvb2dh555JGIrQgtKHR3d3PgwAFqampQFEVRVXU78M/A6J/tW5SSkpJ1Lpdra29v7wyr1cqcOXMAuHLlyqQ9RG1P3ul0sn79emJjY/XVlv7+fhobG6mrq8PlcgGoMTExhzwez/NAy6/1UQ25ubkPqqq6paura244HDZJkoTD4cDhcOgbQzabDUVR9I9sBgcHuX79ul6I/rhTNgJUut3ubcClX/vrIGNLnDdv3hOCIPxueHg4f2BgIH66xTqz2azGxcV5brvttk5FUf7U09PzR6Dx536/9UsBmdgSACcwE7ABIcADdP340Zn8S7/w/wAQmB3hr3fTfgAAAABJRU5ErkJggg=="

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAABoCAYAAADYQu11AAAMBUlEQVR42u3cfXAU5R0H8O+zt7d3uUtylxd5qZBEixh5SWxqpZpSYwAthYJJKzAgiMWq0JlOtdOxjO348ofttIN02lJnGB2GqTo6Y2lRsVqsqCNiMTpciKggBpDwEghJ7pLL3d7u8/SP3J2XZAM4VMhx38/MTnafvd273fv99nn2efYCENFFT5zDtuMAXJGcipJlCsAhAB8BCPH0EmVfoo8F8H1d1+tcuj4jHouNdbl0e/SYMWZRSSkAQNfd6uSJ4+rI4c99Lpf+lGUllvEUE438RBcAGnS3+6dWIlE3avSY2LXXfcczpfobrsqrpmDUmLEQYuguDrbux6oVS2xp23MBvMLTTDRyE73WMIw/K6Wmzv5Bo5g1e65rwsTKs97xX//4e/nqls17TNOsSjbpiWgkJbrL5bpXSvmHm+fMx9If3+0qTjbNv4xTHSex9EdzpJSyFsC7PNVEF47LqSYXmvbMw799zNW4cImW5/Oddgc9kUj/jnR9QHmez4cPd+8yjx890gfgVZ5qogtHH1zgdrtXf7f+JvWtb9cOeXF3Vxd2vP0GQh80Wbs+eM8Kh7sNadsaAFw+YWL8lw887Km4fEL69TfOmu1pCe1akkiY9/JUE42cprumaVrs0TXr3NU116QLzXgcTzz+J/vlFzYpXdcPmWZ8i1LqdQAHAXQD8Ltcrl+XXjJ6/oZn/+lJddCd6jiJJY2zAeAqAB9/xResgmHWBYe5RfEDMBzKjeQ6p3MVHOY9Cpwuml/hMZ2LfADujOXOERyfPQASw6yzAYRPs20UQPws3sPp+PsAxM5ym7N9nxFVo39NSukeX17xxdm0bdz/83vMT/d9cty2rftt2/owGSx+ABNSgWPb9s7jx44saDt8COPGlwMAiktKMWrMWKv92NHHAex1SDAfAM/geSGEXwjhTc77pJQeAFBKeTNeTzTSSCFEJF0zCBFOXpAAIC6l7EnOKwBdGdv1AjCT8xaASMa6cPKi05Oc4snKNXUx6gRwHEB7xj7OmOgaAGiuL27d33p9K/Z98rFh29Z4AM+c6Ug1oeHokcN4+43XsfWVF9F+7KgOoC45wePxSI+nP1e9Xq/yer0CAPLy8kTGPFKvyZz3er3wer1DOxpcLhQUOFd+hYWF0DRtSHnmfgdU54YBn0O/hBACgUDAuYrMz4eu/38r9NMd07nw+/1wu7+o0Lu6ukZudd7TA8uynKtz20YkEhl2297eXiQSiTO+h9Px9/X1IR6Pn9U2ma+1LEvr6elJB0kkEgnYdn+ex+Nx9PX1IVlhoaurS2Ycp7IsSwBAIpFAX1+f9qWb5kJElVI7APwMwJ7TJboPwG8AoDcSQTDY/7Dbvr0foaKiHHPnzkUgEIDf709PwWAQPp8PhmFg27ZteOSRR/Dog7/C/k/3YvLkyVi8aCHmzJmDiRMnZiaVBhoxgsEgT8KFcVZ50N3djXg8jmg0ikgkAtM0EYlEEI1GYZomTpw4gY6ODrS2tvpeeumlG6PR6PsAGjDo+ZVUol+iadpbUspKrzcPnx86gEvHl/U3v4tLUBgI4KGHHjrtB1q9ejWqq6vR0NCAW265BeXl5fwqic7RcK1IJ62trdrcuXPdR48efU4pNS7zFmBAJ9XatWvV88//HZdNnIQly38CAGj7/BDuvO2HCIVCKCsrc3yDWCyGY8eOoaKigt8M0QW0adMmrFixQpy2+bB8+XLU1l6PPbt3pcsuHV+Gqqu/ifXr1w+7c6/XyyQnGgFcLteZ7xO2b9+OqqoqtDTvGtCRceviZXjiySdx6tQpnkmiEca2bezcuROrVq2qW758uePTrk6FeUKI8Jp1T+pXTZ4KoL+XcMXiBjNQWPDfhoaGEsMwxgFAQUFBYeoKEggEIIQY0Dut6zry8/MH7NypzO12w+8fOHQ9XO83US6Kx+Po6OhAR0cHDh06hM8++wz79++/bePGjU+fzfaO2e/NywstW3FPVcOti9Nl/375Bfzlsd+dSiQS49H/kABdhObPnz+kG94wjHE+n6/a6fWBQOBmIYTucDs30ev1XjEk4IRwBwKBPKd9DTfkCSA9uvNl133VEokEent7h5SHw2FIKQeUxWIxxGKx1NBfOBwOb7NtO9zd3f2qZVkdPT09727evPn8jXcKIdbVzbg58a8331Op6cX/7FAlpZfEhRC/YDoQZRfHsTylVNNHe3YnBje5F99+p6Hr+gMA8njqiLI80QE8dfuKlZcCKAHwdQBTAFxz/fS675VVXLYW/Y/pERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERETkRWfq5R1dVVa286667mmpra/dqmtZeXV3dxa+TzlUoFApKKUdt37594vr1669pbm5+HMDxbD8uPUs/97XNzc0PhsNh2LYN27bR1NSU0DStUynVKYQ4JYQ4BeCkEOKkEOLkhg0bSl977bXdLS0tzwBIMKRzinvKlCmLZ86cOfWOO+44qZQqVUqVAihVShUrpYqFEEVSyqJEIuEGgHA4jObmZgB4H8CLTPQLYwcAFQqFRH19PYQQAOCWUo5SSo1KLqfKAQC7du1CS0tLL4CnGPc5R7a0tKwrLS31m6aZLlRKpf8KIQYsh0IhAFDJWAMT/cI4CSDS3t5eaNv2gKTOTO7M5VAoJJNfms24zzk2gB2hUKjetm0tM8mdkh4A2tvbASCSjDUm+gWkCSEwONEHJ71SCqZporOzUwOwhzGfs/Z0dnbOjEajMAxjSA0+OOGTMaRdLAefrYleBMAXDAYhpRw20VMymmsW4z1nWalY0HXdsTbPnA8GgwDgS8ZaJxP9wqgDoFVWVg5bo6fuu4QQ0DQNQgillCpkvOesQiGE0jRNSCmhlBpyb56Z6JWVlakavQ7AP7L94LOyaSKEuNswDFVTUwPLsmDbNizLSs8PnjRNQ1lZGQBczXjPWVeXlZVB0zTHGMmMH8uyUFNTA8MwlBDi7ovh4LMx0acppW6aMWOG8Pv9kFIOSfDM5dR8ZWWlAFADYDRjPueMBlBTWVkphouPzGUpJfx+P2bMmCGUUjcBmMZEP//WGIahFixYkL4KSylh2/aApE/Np5anT5+eOt5FjPucswiANn369AG1dypunGLIsiwsWLAAhmEoAGuY6OdXA4DaxsZGrbi4GFLKAZNt21BKDfjSUvNVVVUoKSmRQoiVjPvcIoRYWVJSIquqqobERep+PbM8NRUXF6OxsVEDUJuMPSb6eXKf3++X8+bNG/Z+3OlePdUzP2vWLE0pdSWAGxj+OeMGpdSVs2bN0gCkE/x08ZK5bt68efD7/RLAfUz08yMPQO20adM0XdcH3F85JbbTl1ZfXw/0P+20lPGfM5YCUPX19Y4J7ZT4mX91Xce0adNStXpetp6EbBpeKwEggsFgekgto2mW/psaMhlcDgBFRUWoqKjAwYMHrxv8ZBRdtM3268rLy1FUVJSOm8EPyjg9ApspOaYukjF4mIn+1ToOIN7W1ubJTPTBY+ZOiZ45n5+fLwAUMAVyRkF+fr4YnOTDJbrT2HpbWxsAxJHFv2LLpqZ7AsCWpqYm1dra6tgB59Q5lznFYjEcOHBAKaX2M/5zg1Jq/4EDB1QsFnNstg+eBnfMtba2oqmpSQHYgiz+1aMryz7vbqXUsnfeeccwTVPk5+fD5/Mh1cmSuiJnTql18XgcGzduxL59+wSABwGEmAa5keumaTZ0dnZi0qRJ6ZZdZrwMTnTLstDW1oatW7diw4YNKpFIRAAsRhb/wCUb//HEVCHE35RS1QCgaZryeDzw+XzQdV14vV54PB64XK50k900TRw+fFjFYjEB4FkASwBI5kBO0AA8DWCR1+tV48aNE4ZhpCsB27YRj8cRi8VgWZaKRqOIx+OQUopk/ISUUksB7M7qvoos/tzXon+YbAqAYHIqEkI43X8nlFIfAnguOTHJcy/ZFwJYKISYDMDt0MSPoP/HK13JqQXAmwB2on+khohoZPsfVJU/XySu6dcAAAAASUVORK5CYII="

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAACMCAYAAAAp3Wp9AAAIk0lEQVR42u1dz28kxRX+XvUPe2yvd9demwXEQmIuqxwSaw+REKdcyCFRggCBhMQNCS5RlPwDOXDOOfcoV5CiHJIDgksgyQGxUoS0ikQklpCEZdk19no9PV31cpju6eqaqupqOyQ9NVuncauqpr9+3/vej+4eA0s4vg3gNwDeAfBTACImcK8BGBORWlvNJQAG8AcA5xYVUKJ9fhbAr3cubtDzz1wTT+3vkWLGZ5/f3QOwDeB3iwhQp9/rK1mqnnvmmriwuQYiwlP7e3ji0W0AeAUALTrAf4wnpbh996g14fh+wQD+XdF1oQG+CQAn40lrwpcH9xjAnxbVBy0K2TBRKoVSKgHgdgwA53ysKGT98TAagKTBlGoG8DgiijZDqZmuTKKkqIwMIEyKKqVitCAtD0VVlBSNXmR0H2S1NBQto4yDjMUfXgvGgNUiMhSVCb0igwcUXfA4yBFwNJSiHDtFERFFKVqAyyEysaUy3p5M9CITWy4a5fC2LJYgDnJ8FF0ukYksTCyHyNByiUyMFI1dZChikVlqisZpQS3oi3gsqOGkBqGIxoJktyBFSdEYMh6vyCwTRUWUFNXyUoqHoi0VjdyC2qF4RIZomXwwRhVFxIHeAiXKOLhEKkoxqmjM5ZJPReMRGUdnO/ow8SDQLw5F9TARYxxsF4SRtyyi7KpRxIF+qfuiD9qGiwBQzFf0FCNAirbgTeYsiOWxYJw+CESoojG3LIRpqxhUNJ0XGasFXwHwvYD9FICDHt9/p8fcg2r/0PEzAPfSOR/UTCiIcOniBhdFuQNgp+/VK6XiUspT+W8pFSnFZ/H9n5sWFAAgNDKmaYKXf/hdWiSReffPN3D9xqcAUNh9cMEfs5DT944Z1TuPHWECKEupv6y8AAAZmL7vyFaKkoHw/Q8/xgcffdJfngVxIuxsIBKO40CeNr8AQ4KCKJVnKV74/jXkWVobY+JR0fZibp7nehuA7PiuUb2PUqy/QWqK7cgVesZFad3PMy4BOD+zoOSZ/5kArY9Tqgbgr/SFlsGWq81fo1PXe78K4AeiYotUCkSY1KftjYNTCzbuGBCHOPDYfxvk7LyVUmDG2GZB0UFRWQEk7aR9n0OsaK4lYw072g1srqmZJxWDgILdAK0UZdhfNSeLlchzIchh2dCLpiyfq/hdW5CdIiNsV1uzIPekJHccc+3T93Pr4ilWYBdAstx5qQDKnnng/7RgENp5s8+CtjtL1Y8hqAEDJN0wlUuVdoAWLaje42UHRVzCgg7/swpFD9XU1wj91NQUobQHepr/suqKqGqRubkyPsMzR3lESnUIEBzqSgCEEELzQY8FbRzVKModAhIiMqHigoD9Z4D1864sWIb74NlFhgKCfcgcp8iQmBOZcB/UKKoCAzcF+FCov4Uk2y3DeCkKvwVd1PMFY1gyFB9QGyjl8EdreOugKLEDoGnBkPSJOxSXT2E5255tH/SHCZsFZ3mo7EjPOMC/QkFSYOaiTAvytI9jBZiQJZXRfDA03aIzpFshFYg5T4QHegIPPFWz+W6rcaC8KmqxIDdXZCipGlvCBGnnSz6ALh9UFgXkDnXrzPwD0zb2CNpcgqL8AOGKgwCwXm060tZl1d/1l29qS9cc82CZl1Unbe53TgO+XnUdyJj3jRqhUZz3Kpf2ALz3/ysXwFmazM4+TROkWod6+/yG7n9wq6hl86vffBiPXd5qJiWETGvtZWkCIZr7Nit5qs0VSJNmbp4ns46BIEKeNXPTRCBJmpNeyVPzIYjODEhjW7gPfufqYwvT9LVRVHSp6IIOdgBccFQ8D9BL0Y9v3sLfP/1i8MD2r17B1oV1qwW9gf7mP+/gr3/7bPAAn3h0uwLIXQDbC8eTsu5Q7Z0yjcIZ1rEjsOvjGoC3xtXPZXdRNDEL3mJ6I+SoR5rGZxWFni2NAwAoJqVznVFNWC144Gko+azgqg99bX1f+962x6EO0PbDBjrAVBgV4biYMIC7Rh7KPes9dnTQQvs0vir/aApQdluQgFyI9i278bhkAF91UJQDKcU9qcwBND4CgFJKc8o8QAayOQtOTf8VhtvVPgGgylIJ1xXQKZrrlSMzo5iUVFG0r8hQRxkU2tUOUeaTSSnXjDAgbAAzod07n5QSzKDKgtxDum10ZLhvn3EHMOURGQA4rgFqYTyxWlBo9YQmvXfQtO1hnKxyNKEQWNT6imezXWi7NwgA92sf1KKAFWCaaBbUHgY4gLttH9JFQ0f3TPXYB5b598pSmZlKaqeoZkEN4N1AcAT3XagQn7XFzZDvPZqUkgGQ1sKfsyBNu1OaDzax5Uirr0KcPrTlfpYnMPS1Yzl9+oe0TGwOYGb232TzdNN9gxbcU1G/jtROX1vW/xdDeCyYA4BOUSmVHmu6VLRLXV0KSj0s7hKyklmZc+wW1ClaqhZA6Wj9saO1F5qOda3p+hsAJvoTVUIQlOLUDlBYLTjG6Z6Y4FPQrSs9s+0p9SQ7TQQXahoX5yja8kE5W3U84FRtWgVp551nKYqJPGemNJUFhU1kioEX9Kle52VZUjeMWwDXpg1V4RKZIY9WkZBnaavDXiNaB9Bq6C7Qv0NZSTTfyrMENgtumADTpss8GjI6Ah4areYNwDRFkAU1ug4aIAO7o9Vs9vfqSlYDTHWAuwAwWslbalSNCwPGdxHA+vpoZXZgc2O1zmSu6AD3AeD8ucZY200j9bkBA3wJAC5fau7G7WzN3O9lHeCPdrY2eG3UWHB3e7Oe/MKAAb5xYXNNPfn47uzA449s4aHtTQXgFwAu1wCvf3HnCO/+5QY+v32I45MCH3z0CW59ecgA/jhggTkYFxP861bzNtHB4f26WD8BcK8+fhnA7432AhNwvfbPgY6nq94oP7xznp+8ssOJIFWB+7FtwT6AnwB4A8CLdYYz8LEL4JcAblZ5828BfAvLMv4DaBGC+ahosFsAAAAASUVORK5CYII="

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtElEQVQ4y5WTsQ0DIQwAD4pskDo7vF76KgOkzKQpM0CqSFF2oGYDGtLglx9hIJa+efD5bGHoRy6fGa6RIP9zDAmA8+Vk5nidHEPi+XhpEJ/vG4AYEgWYLQAA67KZugLTthrgRLVYdGcjpr512rOQduoWZNq7hVxal+2QUIe3hmeZ1TCvDyd634d5u18BnNfa/0BqgwNkVL37DmZC9M13MFu9ZTCE6OpWC01Iq3prG+utHG7xD/1dS/lhX4E+AAAAAElFTkSuQmCC"

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAd0lEQVQ4y2NgGAU0Af+hGB8bDpjQNb96+Ith2/rDeNnIBjFhc4KJkTnDq4e/MNgwgGQQhgGMYvJsOP2GzTAmLP4nCbCg+//MuZN4NaDLM2FzJiHgFWjLwMDAwIhuAF7/Y7Od5EBEtx1XNGI1BFfYMOJJjfgAXB8A7tw5rVp0ldAAAAAASUVORK5CYII="

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAWCAYAAAAmaHdCAAAAzElEQVQ4y72UsQnDMBBFn0TwCK69gzG4ygIpXWaBLBMC2SNlFkgVCNnBtUdwozQ+IxvJkizIB4GQxOPu353ALTOtKCkXYOhHAMqq8L1ZSPsuPt93bCB+SIr+BgmafAgRLJONryBR6YjJQz8KdBFdsic2UEDaoppU4PPxAjBaqHIgD5q6nf2w95vVaepWQJtyATWgpvbeLSmxKqvCDP3IubvkN9vtes+CJKVlD2jW7Jy6I4BaQ3aZvCuS9V/jgkRFI6lkzU7ojyVhjhTADziXSRtNItC+AAAAAElFTkSuQmCC"

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAZCAYAAADqrKTxAAAClUlEQVQ4y52UP28cRRiHn5nZXf+5PUIc2zrsxE5klDKRkvAZQHwBRENBT4MEDQUNDQUggajyLZBoknQRBUpLQ5TkfHHOZ5P4Lmff+XZnd96X4pS9PQ4aphzNs89v3/edgf+xDMBHn3z6ea978LF1Tq214pxTa12I4vhURIyKGFE1iHDv11/ejwAG/VcffPH1N3curW+w2khppGn11aIoyCYTfJ7x83ffCoAFUFGcdajqQpT6nojUIFWHMRhjFvPX9lRF65DhXwCAyfk5rwf9qSnUTai1dhEaj0YcdNpTmzGITLNGb0yGeWj4esDRYZftnV2cdXifoxKkDtl69kH/hJfHR1zZvUacJORZNo2nMoNQKuh0OGR0NmT32h6D/gnG2GkLVFGRWbx6ldJmk0sbG/x11KPwntb2ZUJZgjEEma+erfWC7vMOAFf33iWKovqvypxJVfE+p9ft0traYrP1zmKf6iZjTaGqHPd6XFxbq4B/rjKURWWKotiXRcH2lR3S5lv/Od1ShrIyxVGc+6LAWrtwsCgKnu+3KbxHVGeQi1wWQrEA5HnO/tMnpGlKsrSEhOCreM5FWennofPxmINOm81Wi+XlFbJsgqK+Mlln86Is54b0oNOmtbXNhbcvzqqozExRHE9CWaKqqCpxknB55yqNNCWEUL/neWWKXDwcnZ0SQkBVAFheWSGEgIggIuR5ThTHZ5VptbHaOe712Ls+rqbiTVNFBJ/nvOjs02xe2K8gY2ynd/iCQf+ELJswHo0wxlRxvc959vhPkiRpV9CNW7fv3/3x+8I5F69vbJIkS/UrzqB/wu+/PeTm7fceVE8YwGdffrX+8vjow7Isd0RkTVUia2ywUfQqjuPDRqPx6O5PP/wB8Dc9F2ahYQBFYwAAAABJRU5ErkJggg=="

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAEdklEQVRIx82Wa2wUVRTH//fOY2dnd3baXVpooZRSKFq0Fk0BBYtSUENE/CCB+KBgDDGxEoUIxkQ/+EgMUcSg0ZiQYIRoRA0+EhLTiBhAC7TYUizvIq+yCwtpuzvbmbkPP7RsKRFaCCbeT3fm5vzOuf9zzz0X+A+HMsi6EQnpG4KGslJT6Z2eLxIAOm6V8+dqpozOrH9jtqxbWCmKhltdlqkdATBnKMbqIOvnXY+744tzjZJRNnlsRql14NgF69PNzV+eSaQPpzL+UwAO36ws7Rc7e56vKMuL5EdNQErE7CBmTSkODI+aBa3Hk4sUSmI+EzsAsBuFc4+J+l3NZxfOuHtUMGzqkEICAEbmW+The4uNVMavPB3vftZnoh5A4kbgAJDwmNjzy55T86ZVFhqRkA4pJSQASggqxg/TCvPCdvPhxEyfiY9vFA4p0e56LL51Z/uc+bPLFEII0OdAACiIhdDYlghc6nLbJHDwsh0dClzX6JNhU1+7cnGVGtAVEAIQSkAIQPvmtXPLLTOorruSOVjkViiobSwabr24btWDORXj84iU2d1AZOcStmWgrT1JE0mnXQKtg8Grw6a2fcFDZZWvL50atkKBK2Xq1V3KvjkghIQd1vWmg4kKzxfrrnXOiyMhfWN+1Jy4anFV7m0l0QGLlBJQQUAJAaUEREgQAvhMYEyBjbCpj0g5/hQADQMiNw315VBQ+6puwaRxK565x8zLNf89wehNppQAFxKuz+H6HJ7PIYXUT3R0wmfix2zklql9MXZUzry3X5hm5Vj9EgghsWPfGUyfNBKUkt7oCQFBr+CMCzAuwYUAFxKjCyyiKPT+rCxGQFk2YUx03nvLqy2F9h+gprY4PtjU5MRsQ7/vrkL1MpwQkgVzLsEYB2MCjAscOnGJQ6IlC1cVuvLVJVVZcMuR8/hkc3Nn69GkPbE0xle/VK2qKh2wG8YFfCbgMQG/L/qmtrisbzh5KeOyuixcoeTYZ9/tz9VUKhv2dwjO5dGutPd3SWGkZs3yGZau9afG8zg8xnsdMAHOBTxf4PeWs/Lb+iMXejw+FcB5ACB9NjaA2X2XTwOAkphtbP38rUcidrhf//hFByvWbHdrHy0PTJqQj1TGR2fKxdc/H3Ib2xIn0xl/JoDTV1+5nQC+uVyQYVPb/U7dtAHgxr/ieO2jHemApqB8bDTQ7Xhwenys3dTkJC6mf0pn/EUA3Ove55Rg/uQ7RtgTS4dlk7Z+S6u7ZdvRc4yLjtq55ZN7PA6nh+G3xlMynkw3dTv+giE1CzsceLxm8mgLAPYdTGD1ht1d3Y7/fcrx37TDgb2VZfk07fjoSKbxw/bjKaeHPT3kvqartDZmG11R2+jMsQKNAKb2Fpjy/hOzxvkfvvKAfHfZdDmuyE6pCll6PRa5xv8RALoBpK+o3uSqJVVRVaHYtueUv6vl7B9OhlXfTA89d9X37dGIoRIQ7D0Qlzv/PJPMuHzurXoF1JQW2emZVUUsGFDjAEpu5fsmJxzUfo2E9I0AcvF/GP8A+yv0jSEPByoAAAAASUVORK5CYII="

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAwCAYAAACbm8NsAAAHFUlEQVRYw8WYXWhkZxnHf897zpmT+UpmJh9kMtlkGzfZbrLdtrBYrLSFwrZsbaFdRLGwqBe92UJBvFi8E3qhBRXvBemFIogU9MKLIl71RkGqogt+bAmtGLtdsxt3xWbmvO/jxfueMzPZbDK7GfTAcGYyZ3J+5///P8/7IYx2mHB2X3pj69PAOnATuAXcDq9/ATvA7Tcvt3e5j0NGvO5Hlal284XX3v5euTbzA2DikOv/Bhx/83Lb3gtMPBqyeXpyZmVu++9/eDYuVUjLUyQTk8RJmSguYaIEkQgxuYAsAueAt3NFxwXTQN1crbGIiEHE4JzFZV2sGFQdYnsYE6GqoAqAqvv21Nzazs61P18FLo4LZgOg1lxETIRIhDFReG8wJvbvjQFnPajLcLa3PlFpsYMkoIwXprWMiPibBoXyzyaKAUFFQQQBRAxRMgFIfVQYM8I16yaZcOXaDMYkiImCGqZQR0zswUQQ6cPGpTKI1LjHkj3oOF2b6oiYyD+1mMIukQjEYEw0oJb/HiBKyqCuPD4YMWeqDQ9T5CVYlMMRbIHwt9Ax4qQMaGVcMC3Uzdaai0U+pAhsH8zD9G3yuRLiUgUgHdGBQy86CVBtLCImHqgcbwsDlgQVvWJBm7hUzhtreWwwXploqLSH7MpZBqoMEeIkzb+qjgNmDYlcZWoeY8ydFTOoSrDK58aEAFfGCrNars9qFCXBnriwKFfhjryLIe8rITMA9THAmI1aoxPlZbw3uIMW9WPjq0rEUJooGKaOCmPArVQbHd9LorjIC3dRZVgdIUlrY4NZAtJqo4OJfDb6ityZl+FDASUZozJreSWBICYGkTBd2N+ivdOkJB0zTLWxWPQXY+J9q2g/ZUSisWZmLQoDZH8skrtWUYGhiqpDUUyUgERuHDCrlamFYnQ2JkKiJOTmAItUh/pOKa0q0DgajESna41FMxhYY6JDp81KmO0FqLQ6A7BwFJgUtQu1xgLGJP0xaZS8qAstTwGhUp+LQDpHgTkJmPr08RBYMzCPOUQZVQ+kvrzT2jSIHDsKzCMAk7MnAkhUDAejH4qqUqnPgbqZUaa4d4M5a6LUVRsLQ3k5qIoKVVDUuWKlUGl08sazfp8w5plm+1RhiBSrgUPWfOrV0GICrrRXPgWIAi/fD8w8uLXWwoYM3uQwVfqV5IbA0kqT9oknBOTVw/rNfnd4HpDWwmmcc6izqLoRYxIqSV34jW+Aa598GdAa8Oo9wsiFtDrt6q2lYsAD/OLMZiMAaT87nozG3BqzS2cV5DLQHBWmAXpu9tijRp31qjiH+hUizvUOBNIhRbQ4qzrWn3hFwiTr66PCnAfi6c6Z8IS2uIHaHi67O5Dmigyvt4N1Sq1xjMVT5wS4BKyOAvNSXKq5emsZLZ5qYP3sApDt4mxvnzFJhxpfMU4FtU6c/TxRnBrgm4fBpMBzzfkHDShqs6COw9keNuthsy7OdrG2h7W9IaB8TNJBoCI3XqW03GBp47wBXgIeOwjmHFBttdcLn53t+czYDA32WNvzlg0A5fbcWUn93OTKLT/0PElaV5DvHATzuSgpu/rMAwNZsUVw7YA9OYRXrIu6LOQjB6CopAIsKBcnE6w8esGAPg58dj+YEsiLU7MrRoCiklSLkvYgWQHhsm4AzYJ9vaHeMqSIDls4v/I45fqcItEbQLIX5hnQ+tTcGs7ZQhnnssIS/9oN524fKM9R9jE22y2UGa6qEO5wFmN44JELgtoV4JW9MJ8xJnHVRieo4hVRZ4cscTbYZkNlhf7jlcl8P8q6/n+ghUp5Br2NYUdhYZ3JmRUFeR2oDMCY5ypTbW+RBmWcDQHOCjuGlMl62Gy3gLHZbmGXs3mOGOriOvAeYGnjvIC2gC/nMBVwSxPV6SIrzmWhv+zNSBYs8aHWoJCvtNyu3RD2LDyY9oM9oBBAfXqZWvOYgnkt39Prgtnc3vrjclptyXTnIdQ5nM0wJsOZDKwUT6bOcvvme9zYusLNa3/h439fJylVWdo4T3v1SWRwWFDnozPYgwJYvqFUay3J7RsfrAKVfJpwAuQnoA9P1Oe0s/qUtNobxKUyUZxi4pRb/9zk+gfv8uHmr2z3PzthImy2wP0JzCq4zuTMJ9zppy6Z5vyDAxnJiyFs11of+qy3yz+uvsN7776lqu4d0CdlT5lfBPMNcO04qbjpxYdNrdnhw81f6+3t9wXoAT8H3gJ+GXbC899+EeRboK3OyadZe+wiaXnSh7doFRabddn56CpXf/Nj3fnorwLyC9AvANf3m7qVfKlzEXgxfL4GvA78ELhx4Aa2v+5SFKcsn3nBLK0/S5xMoKpsb11h8/c/0xtbVwTkFuhXgO8z4t5sBTg+6p7c4A4pyE8BNVFiG/OnXK15zHdCZBv4GjDJ//g4A3wX5HcgvwW+Ouou1v/9+C8llxxsknjv4AAAAABJRU5ErkJggg=="

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAtCAYAAABbAsDYAAAFYklEQVRYw82YT2hcVRTGf+dO/sxMMpNWmn8tpGloreDCZUHcCRUUFBG3UnGnoLgqIu4EyarqwpVgFyLoXkQQEdwobVpaWm1rGptJ0tgmM0lnJslk5t17XLw/82bmvWnrygeX+3jvzf3uOd/5vnvvCI9wnZlffwOYBRaAi+fPTt/jMS5JeFYAngV+PDO/PgZ8Bbza9c0D4FoAugAsnD87ff1xQN4Dzr34zvdfHJw8+cLAUP64iDzKhO8AH54/O/1N9wuT8PGJzFBeBXmnvrVyvF4p0dgp02ruYr0mqpoGMgu8m/QiCeRYvjBJNHkxqHM4r4lzHs62Oj7uAj11Zn795MNBJHMiX5wyiCDivxYREEEgehYCqLNYbx+vtYfXauA19z5/5vn33wT5MqRjoIcjtTO54mREVxiR0J8XH9BDnT1tvf3ToAq8DTS7I5kChvPFSUQEMcYHk7CZNqo/clLKqJdXQDJ3gWZSuuYARopTsUhM0CRosZ+IAOo39Zuqo7a1rKi7lcbJMYDc2HQwmMRmLj0Vr+oSq61WKTnQxX4gmi9MRFFEAFEkadwoiuI1d2jubWeA26kgQ/mDLjMw3FFZIiZMXjfbnT1Q21oNb5fSQObyhUkT56OTeEmMICJflfpWKXyREolknswXp/yMRJGYdjRdGolKN4pGqVdW+oIMonYiV5gI8k+sZNN56NZKfWsVkAeBifaAzACZfHGiQ4gS3IQRxSsrAlKfdIB6pQTwV5qtzAHkx6YDG2nzIX1U3hmRUqssW9BUkFmAfIelxInv4kNjIgw4cdayW/3HxCurG+QYktHsyHinKQac9PMuDQB3ttdAnQCLaSBHsyMHnZg22RLve8pX25UVkV7q0UgPSK4waULHjcq1A5Ae8XV4VqVXI50gkpnLFcZF4k4bmaNJTVFkKOqob60QOO96EsggaidzoxPBrE1QVZLCgeuoKHUW1FErLwNmEXBJIEcAkyscQox0LFJpkYSpUucg0Eyt/LcF92fa8nsUIFuIR2ISvSpMU0i6ojh12FaT+vZdA9zqC5IvjEcES7SmhytkGunON8YHa6BWutXeAxJy0ia+U4QhyW2VK85Zv7LKd8JPUiOZGcoWXWZgOLaGpBtjqHhnvYAXS728/FCQo9nRcYnrItRGD+mRxTtUbVRpvhClCmwkg0jmeK4wLsT4oG8kDuesf+8sqkqtUlLgZtoOUlB7JBdWFpLgXcHgLtBHQHbIh8/JsgO9kQYyAQzlRsfb6QmaJO5QNBrYtxN/89DY2TRJlRWCzABkRw/F1o8gGmMSU6XOBb0N+FgLdxmpIH75FiYCSuJAne4belQYRWgp1Y3I2a+lgRQABgazMU0k707UeRCAxFt1cwnASyrfEOQKwObaVf9YEC9Nba98foriXqVRITzYXALMUrj3TQK5BGZx9cZP6mwLa/f9s4jXxNkm1tvHek2s14ieOXU46/mTcZbqxpIDdzlt5Qzy4z6pbtyWjdIlnPUPOs55WNvyQVoN/+zhNXzAVgPrNbBei93qffZq94LJ9gXhazDrtxe+U3VedKKyrX2cbfmDtxrtwYMDj/Ua3F++EI71axpIJugt6F5jp/zSyNhhCk/MBpohUrWzTR/Y83tnPe4vX+Dqz585Z72boB91L1ZJp98BkEuD2cLTz73+qRk5cBiTGcSYDIjB2RbqPJy1VNavs3jxW90oXRQwf4B7uXtd73fEfgrkcvHQ3PCpVz6W4dwYYjI0GzUqd6+xuXqFe0u/2d3qegZkG3QeOAfs85jXa0BrYGjUHpg4qSNjh22QBgV2QX4A3gr19V//kQA4BXwAjADlQMm/AL8DLf6P17+7Phcxl38UcwAAAABJRU5ErkJggg=="

/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAkCAYAAAApbHJOAAAIG0lEQVRYw72Za2wcVxXHf+fOvuxd73qzThzbaZq4eZC6j9A25AGlHyoaAkIqFBAqQlQUBSSEKoTE4wOIL1SqhHh/Q/ChUlWhFmgJCKUoIaKFolRJ2kZqaZo47zpJ8SO1Y3t35t7Dh5nZnV0/k8a51mrGszv33v/9n/M/95wrLE0rR9c2IAekgQIgQGf0XRHwgHYgG32nwBgwAUwCg8CZqx1cFvGbHPBJ4G7gNmB5OElpB9pETFpxBUFE1RWXYIEmQf4LegTYCzwH+NcKygO+D3wPyCOeFrv6XS5f9kQMXipLOpPHpNKksx0AZNqKgJBtD8nwUlm8dA5jUqSzheg3JQDS2QJiPFLpHF4qB4CiVCdH8asT1KbeY3z4FO8Nn2R8+BTvnjnsrD9lQIZAHwFeuFpQaWAPsLN7zVb6P/gQK9ZsIZXJ46UyGC8dXTN4qcx1pUVVUWdxLkDVoc6iLsCfnuCdEy/x+r6f24nRMzXgTuDtudiYrT0OfPmO+7/FrR/5Kh3LVocgjId4KYxJNa7GXH+DUw3dSxVVBXWoOgqlXnrWfdgMvvacUWfLkSnOaLPNqAg81rPuXlZtvB8RQUQAQcQgCIiEFItcdzzS0mf8v0g4bi5f4eaBj3vAw8CqxYL6DJC7adMDUUcm7j0CJhGwCOBStGisudrazZ8GSAFfWCyoj2XaOl25Z1MIIglAGh8RWRrTi0adCa4BMt/ZR2nFeoeYRYESkJ3LegYMCGIaABCDiGmYoSwNoAV1LDLHlf07DOruAlYvBOoDoJVy70D0riSAxADNguZxHRUjAmKaQArCyv7t8YNdC4G6B6BzxbqIDUkAY8lFYqZAyAySRARFKZRvIttedsD9C4HaYrysyxd7ow4lIiXB1FKLROuCJe5Vm32usmqzAXmgFUcLKNnaUblZxJiEqZkGkEgcllIkWv1JZgMatUrf7YCWQreZHVQKdHOpa60kO5CE2jXYMzfA9OYBG82lvHJT/HD7XKBuAzIdlf6oY68pNtXV74aJRCLwxn8Sm6EDlHxpJelswc0H6h6AYtfaiAmNOpJEvGr41g1A1HTVWAmjecUL27lio0G8e+cCdZeXyrlcx/JmmiOG6juJGOCSe1SzRUgyCEvjvtS9HtSuT+RpSVByZ77cJyYBIslQcidxQ5hq9a3WPaEJc8rO7g2xnmyd1afypT6hddIz4pUs4MhLoIIiDT2PWVMFhGLXLXGU3t4Kqge0mO/sTbwcy3cCmLw/5bNB7dpileqcApXKtFFYthpgRyuoAYBCeVW0JUmqujTFqWsxPXUOZ32c9bFB9er3fguMWVq+TkC2xS+YhJyTL/U2rC8Wh1aRuAqmVBVnA5zzsdbH2RrOBtigijq3aL9K5lTxNinJYnH5OkA7gI1NTKWzBZfOdUQvm9YNV321FutPztmQHefjbIDaIAEsfD4fsKRVqGrd8FR1xsKWuvrj260JUHJHe6lXGjtiaUoz4qsx3uLZsT7qgvq9cwEuqGGtjw1CYNbWFsWYJMElk9bok+/sw6RyLgaViuzwtnypR6QlBskMGZcF2YkLJWHRJPSl1//xC6qTY2zY8jD5ch94ofkYL6xFGDKzLpggKBIWY+rgtMnX451GsXKzjF08djcoqbCYqO3ptmJzFE+CEDNvuqHOoWoboKIqkF+b4OU/fpfzb+0HsCdfe14G7t1t1m/5ImERShtqq2mMl2rJprThSwtU9NpLPTJ28diG2PyugDk3MXK22XcSGe586UYoBAlzcwHO1qhOjbH/ya+482/td8BjwFpna3uOHvg1B57abSdGzoZm6Hxc0BCRVqZm+nBjsTXBWibbAWgxkVK6PaNDbzpng6aKUb0LM1POnbONSSV8R62PX73CP5/+hhs5f9QBDwG/BM4CDwKfG3nn6NS+Jx+xYxfewgY1rK01iciccas+viay4vD59OQIIGOAxjLyZ2erZvjcq7NuJhsph0RCELLSLAShygVBlX89+23939nDRNWe1trcs8CHqldGLx54arcdHz5dXwxrY+n3Z49XiY1BUqX96XEunTnkQP+alPS/gzk1+Opz6pxtOGECnIg0K5n1m9iJJfzogV9x4cRLAnwN+MMcLvAmuI/61YmJl//0HRv403VFTCpk3a/jbVJduCJAqgTVSV7b9zN1/nQAPJGs0CrooF8df9j603Sv2YpJZfBSaUwqW1cm1UgEbBAJQhAqnAvAWS6eOsjhvz0O8FvgRwso9SgwWL0y8vm2QoXO7o0tBZc4wpi6oqLhWBoJ0sjQmxz8yw/dxOgZC3wJONBadj4GlC9fenvb5OUhlvUNkMmVwlJz7HoaSrRqss7to2qpTY/z4u+/aYPa1CnQTwHBImL0GyAPjAy90bt6YJfxUpmEykXA1IZlZxepqw1wznL88DMceeEJF9SmzoF+Inlg0Boc9gJufPjkjhOHnvHePf0K1Ssjks7myRYq9RVy6uo+peqYHL/EwT0/0MuXjinog9G50mLbIetPPzp0/EUp994quXylDin2IXVBfVH96XFe3fdTjr/yNMDzoDuBE4s59VgJPArms+DuBCTTVrKVvtu9Qnk12fZlgGKDKpffPc6FE/92ztYc8PXI9K627QKeBKl0r91G74b7pHPFeopd/RgvjfWrvDc8yIXB/3D66B47NX7JAD+JjpncNYzHKmA38Dswr0cnfLGmOjAngd8At7zPxKkb+DHIuUT/rR8fZO9stb6rPUmcrXVG704B00uQGfZHJ5fxMasPnAaORAIzb/s/YImjI6ZiEuAAAAAASUVORK5CYII="

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAOCAYAAABpcp9aAAADg0lEQVRIx91WzWsjZRj/zTsf+ZrMpAn9SNdmEjONkIMIakCkJ8WL14XuqUVzKlhaT9JD7f4JtVeRHr1ILqW4l+LVQtEQqoEusVlCu2nJbJImnWTmneT14CRk27qUulT0B8PzzPO8M/M8P56PAf7j4O7wDA9ABhB0ZcC1CwB8ru4BIN7yfTaALoBLV3YBmAA6ACxX3joBGYAGIAogGolEkqFQKMXzfASAwhgLMsZ8wWCQqarKVFUloVCIBwBJkogsyzwA+P1+wePx8AAgCIKX4zjydwGYpknb7bbdarUc96KXl5es3W4z0zRh27ZNCDH6/f6ZYRi/NhqNIoA8gD+GCQiC8L6u619JkvR2MpkUEomET9f10MzMjHdqagpjY2MIBoOQZRmiKIJSCtu2QSlFv9//i0bbBgAwxuA4DgDAcZyh/yaIogiO4yAIAjiOg6IoUFX1pTOdTgeGYaBWq+H4+BiFQqG+u7vbqFarP1cqlc85AIhGo48zmcyXm5ubSjwev/Fje3t7aDabcNmGJEkQRRGEkKENwDAgl5ih/yZQSocJM8agaRqmp6dfWW+WZSGXy/XW19cLpVLpk4GdqKr6WTqdzi8vL9d3dnZYvV5no7i4uGC2bbN/A47jsHw+z7a2tjqZTOZY07RvAcRu6gEJwEezs7MPBUH4MJVK+ebm5sLpdFrWdR2JRAKmaUIQBPj9/tc+UZrNJs7Pz3FycoLT01OUy+VOPp9/USwWO5TS38rl8o+WZT0B8Ow2U4gH8CaAt2Kx2LuKorzX6/VSHMf5NE2LrKys+BVFgdfrhcfjuVYqjuOAUgpKKcLhMJLJ5LBHGGMv6blcrrexsfGcENLief683++XDMP4/ezs7CmAEoCn7rR6LWPUPzk5+U02m32UzWblbreLbrc7DGrQtIQQiKIIURQRCAQQiUSuBc4YQ7FYxOLi4i9HR0efAqjexx4AAH88Hv9hbW3t4/n5eXE0oAEGiVxlfNRWrVaxtLT0bH9//yGAA9xxKd0FtNFoPCkUCh+Mj4+/oWkaGYxVSiksyxrqtm1j1De4r9VqWF1dPTk4OPii1+v9dJ+beBQPdF3fWVhYeCeRSHDhcBgcx8Hr9YLn+WtlBQCtVguGYWB7e/v08PDw63q9/t19/0pcRWxiYuJRIBCYJYQ8AEDcjS5cPUgI6RFCXliW9bxSqXz/T5j/3+BPpWs6yqkZkUcAAAAASUVORK5CYII="

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFLklEQVRo3s2ay3LbNhSGvwNCN8uxYmfsOM00afMwXXfdme6666v0LTp9iG77DOk02bZNU8d2GsuWJVIiTheEJJCyaFKmFWMGQxIkgf/854IDkAJ8CfwA/Au8C44nwIz6pQccAcfAoa/HwAXwFvgD+KdGfx3ghcf5Anjpjy+A34CfgLEA3wC/3tCBGjhXeK/wpxfsb+ADYAKARwJPBZ4pHGkmSGkRuALeKPwOvPEVD/KlB/1S4CvNxsmVrpF014qeJc4KvFP4VoDvgF9+/PoRHSMMZ47h1DGcOS5nysXUcTlz7tPUuatUTaoYgEhw/UjcnjXyyJqob4VH1tC3Qt9k57vW0I+EvhWuU+UkTjlNHGdJyskk5UOczi5makOQLSEdtIzut40dWMOgZRhYw14rq49bhrYRAN5eTvn5ryuA761nlsOOYScyHBPdRKLxlbGXpBPJok21oEpWr/tWeGUNr/q5Z2zilI+JA2DQMnQjiW7rS/3JoGXmzbEF9ry6qjlAlD1XBXzZ9UIDRnjajaq9p/m22RJEbIEYIFUok6Uu8Lu0FcGvIyFd3phYYAwwdUqrIEkZ+HWd1wZ6C+tlfU2XF/FSEG2O9U3Aa4k5r3t3VhBkApCkCnZzW6+iMa3I+m19LQRxuqqRRIOIcE+sN9bXqo/EOR/Rmqw3aTKbmHExanmN6EaOWsdktAEthO1JIWqdA1wHetqWyWxkxsF48dJHLixwBjBKy01L79HW64APS5wlBA4YzQXRUepEt+SolfxGb9Jgfp5LUkVgpKAWSARG1zPd3TQ8NmHv68Ysgg+fiVURuFTA+rT6fJSyWxZlmjKZKpougl+HKc7c4YJF9gon1zO3NtPUG661wv2VfvyJzuvinuQqa/optvu57xNzjSicXDlNFaJtOWqZyVSdbyZOnV95Ml/UnI38fN+UozYFvOw6dqrAMCfI2GH0gbBeM0WJQ0FOU8UkQSrfFPhGg0eh0YqI3+xYagRgNFMGbXlQrKuu78uTnhPkFGDklEGDrG+Uomj1flqCAXZCQaZzm9MKM+o2WS+7tiII9DUQ5AlAz0gwJ9w9PDYNfEWQzLRyGnkiIvQiqWQ222S97NoaVjUioG0jct8m0xQxABGrzn7QNuJElptjGw2oDZJQgVBrQKGbM63QPz6HyVT2Qc07+4pGer71vljfKLW/ZX8tElBoEaTxR73IrE9Rtsx6ccx17yQOBMbheuSwG4beB8R6WVuSLayGGqTx+71IKkWZ+2K9fqYtJC6/HhGFfjvY92185+MOrJelRUm2F7cQxAAihZXeQ2G97Fm/HskJgkj9VKNp8HWzisSRWyFGmcPLVh21Kngt3WlUwhXiQiObTEp3BV8r8hVuTB0m1Iip5OR6l1C7Oevore+lBdPanq1X3e+67d1eJG6SfSIPNCIPg/U6c9dOJOY/eJb3kS04alXWq85dO5ERgee6LvxWBV4LfAOfs4ttvUgQ+EJDH+GG8Pu5TKbq3NWNBAf7gF0xrTuZzD2wXtbuf14Q4CgnSLiBzAMFnxNkmR8+W5jW+zilG03pR4YdK/Qisxa4Q4lTZexg4hzjFCapY+KUSZq1TVIYO6czhZZA1xhpG6FjoGOEjhHakT8aoe2Hm+90zpPYtoD42XrqlMTNj8pw+aH9eL5CnLz+eN19/ZE7F4GhZL9HnWr2S9QY6AscCBwA+wp7mv2H1VQ5Dp3hAHhO9kPXczInKvO1c1/PgvPz+UxboXT8GI993fXWsefvz8cfBNnHyGe7xXr6P+gDiXwOJAZ0AAAAAElFTkSuQmCC"

/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAATCAYAAAATSBSOAAAC6UlEQVRIx+WWv4sUSRTHP6+q5/fsrO64u6z4A/ZkFVnl4NTjQEQRNBAzUQw0MRAuMBEM/UcMjU0EE/NdAzU48TgOVITjOI4LbnTdHzNdVc+gu2bbcVZXHBGxoajX1VD96fd931cN39k1BpwexUbJF4C7LnDz7I+Nh87zZ8/pb2nQBed5tPBs1X3KRjJisGmB33dOJO2LP7feeeC8srQWum+6vrPS1X9WnT7rOX2ael3spiw+fLm2nGd8EVgaNdxegbvGMHf5lxZTreGi+KD4AEHjDL000Fn17s7jZatwC7gKYEYAVQJuCDwpJzJ37qexDcFUFVVQyGbN1xDqFZvsmSoJcAXYBmA/A8oCZ4xwT+H83HTJnjs0xnRr4zJWBZ8DhRwyKHhVnIeSFV78lxrgKfBkM4aoA3OFsU/gALBPodysGE7N1/lhsvzBTSJQhCyuhZDFW+oGa1AfOALcHgY3C5wAjgscVdhdrM1KIky1LDPjCTu2JsxOlrDm46WrceTShlzWELJsxvuxqpHOSpgfbCUngZvAMYBGRXSyaWWqldBuWCaahnbDUit/epmqap6dImSM12GDQr0sdFaYLcIdAe43K5iDO6rs316m3UxG3Wb6JsjqLZPUhyhvBlm2QjREhLtkBblwuEWtbEis4INuSq7NXGEASAuSrpskM4aI9Lki3EyjKoIIzsdqFWBjQI1VXagpcqneKfpCb4v9zQUIQUk99LzivJL6zLGhsG+Ee760qqx0A5WSkASwRkmCkBjFiPRfGil0QK5hgDFrg403G4oLSs+By2Pns2eDcA8U+Ot/x/bxhMRmGbMmmyPghlD6vjPjevEkCEEzZ+ZwaQ7kfBb7QFSuVzy+KsDfW2rS3jVRQgwYEYyAEaiWTD+OL7aGTPKBTBVBtdjLdB02GiHty5lJ7ILy7yvHmuMPYH/xg38FQrElfaXxCrg27OCfAWoDawYYH+KJGlD9TCN3gWWgA7wG3gBr38Rf61szUdrcfhAs5gAAAABJRU5ErkJggg=="

/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAACPCAYAAACYh9fnAAAD8UlEQVR42u3Zb2hVdRzH8c+5f845u7uzsbt/pa0lFhpYj7K/I6II0ZiohVD0JOhJIUn1IBGiUWph0J9BDQvTggif1wNBEEEYTpwoJZLTDR+U+kTZvds9v/M75/SgPbl3W3duHQt6v54Mfvece+DNl98590zCbecs4dxlkh6T1COpJCmRVJE0LumcpAny/nPR+4rFlo+CoPrwqvtXT3fftTzXVupwMxknF1QDMzF+qTp+6WImCKpTkY2GwtB8KukGqRcXPV8oNO/P5fPbXnt9R1Pf08/I8/x5Dx777YIO/3BoavjEcWOCYJOk4+S+tei5pkLhyJoH1j6y64OPC4VC84IvMDJ8Qrvfe7cSBNV1kn4luZRdyEG+7+9Zdd/qzbs/GWz+u+mey/IVPWrv6MyfOT2y0Ybh4Mze/7+WWcAxXZKzfef7e5qzudyiLvLs+uedUntHSdJ65nwB0YvFloEN/VtybaX2JV1oY//WYqHQ/ALJpUajmwtM8MqWbS+79R9cv3ZVB7/+snJ29JS9efOG7zhO0tV9p3luQ39x84svZbLZ2p1rRc89TjaXW0PyxtEf7+jssqX2jprFy2MX9dYbr05HUbQvNOZ7Sdcl5a5MjD/043cH9o6eOvngh/u+KDiOoyiKdPTIz8mBocGKteEZkjeI7jhO37pHnyjUr+8d2DkZVIM3kyT+tu6jY5VK+anzv5y9cHpkuLdSLuubrz4vT1Uq5yqV8g5JJ0neIHqhubi2p3dlzTFXJsZ17eofJkniQ/OcZkJjDg/seudtz/XOl8uT2yUdI/UCo2cymbtL7Z01a+OXx+S63mhQrcbznWetHZO0KTTmJxLf8vYiP+/ma9aCalVJkkw2+N79pF3CI6Pj1P5oXXZHqxzH6SZdatEdExpTs9LS0iJJraRLLXoSRNbWrORdV0kSe6RLKXqSKAjronueryROfNKlOOk2DGtWXM9THDPpaU66sbYuuusqiqM86dKa9CQJwrkmPYpc0qUUPU7iahTN3tOjiElPL3ocV8OwNnrur3fqjhq/LMNiokfWTtffSGfCR5J4gkkjurV2uv5GKklZoqf59JIYa+2s/2nm8/lIUhP5UnlOV2iMiWZHd2OipxfdhMbMeoXruh7R04xubTgret51E/b0FKObOSbd8zwx6bd5e/F8n+hp3kjD0CRzTLrD9pLmpM8R3febMkx6qtEt0f8Tk97UlCV6mo+Mc7x78Tw/y56+eI3eFB79bOjgSkm9ku6d+dvb2tb2pKTfyQcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIB/x5/bX2k+CzSlKwAAAABJRU5ErkJggg=="

/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "dist/png/stairs.png?b6e019e6c636c0e63db58b857571b197";

/***/ },
/* 106 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 108 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 111 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	var fpWorld = __webpack_require__(5);
	var fpView = __webpack_require__(68);
	var fpContext = __webpack_require__(69);
	var p2 = __webpack_require__(6);
	
	var SUN_POSITION = [1 / 4, 1 / 4];
	var SUN_IMAGE_OFFSET = [98, 108];
	
	var context = fpView.context();
	
	var skyBg = context.createLinearGradient(0, 0, 0, fpView.screenHeight());
	skyBg.addColorStop(0, '#abd1f9');
	skyBg.addColorStop(1, '#71ace8');
	
	function fpWorldRender(time) {
	    fpContext.setTransform(context);
	    context.fillStyle = skyBg;
	    context.fillRect(0, 0, fpView.screenWidth(), fpView.screenHeight());
	
	    fpContext.setTransform(context, fpView.getWorldTransform());
	    fpContext.image(context, 'sun', {
	        position: fpView.screenToWorld([SUN_POSITION[0] * fpView.screenWidth() + fpView.offset()[0], SUN_POSITION[1] * fpView.screenHeight() + fpView.offset()[1]]),
	        offset: SUN_IMAGE_OFFSET
	    });
	
	    fpWorld.backdrops().forEach(function(backdrop) {
	        fpContext.polypolygon(context, backdrop.polypolygon());
	        context.fillStyle = backdrop.fill();
	        context.fill('evenodd');
	    });
	
	    function renderBody(body, layer) {
	        var image = body.images()[layer];
	        if (!image)
	            return;
	        fpContext.image(context, image, {
	            position: body.position(),
	            angle: body.angle() * 180 / Math.PI,
	            flip: body.flip(),
	            offset: body.offset()
	        });
	    }
	
	    function renderBodyFrame(body) {
	        context.beginPath();
	        body.body().shapes.forEach(function(shape) {
	            if (shape.vertices) {
	                var start;
	                shape.vertices.forEach(function(vertex, index) {
	                    var bpos = [];
	                    p2.vec2.toGlobalFrame(bpos, vertex, shape.position, shape.angle);
	                    var wpos = [];
	                    p2.vec2.toGlobalFrame(wpos, bpos, body.body().interpolatedPosition, body.body().interpolatedAngle);
	                    if (index == 0) {
	                        context.moveTo(wpos[0], wpos[1]);
	                        start = wpos;
	                    } else
	                        context.lineTo(wpos[0], wpos[1]);
	                });
	                context.lineTo(start[0], start[1]);
	            } else if (shape.radius) {
	                var wpos = [];
	                p2.vec2.toGlobalFrame(wpos, shape.position, body.body().interpolatedPosition, body.body().interpolatedAngle);
	                context.moveTo(wpos[0], wpos[1]);
	                context.arc(wpos[0], wpos[1], shape.radius, body.body().interpolatedAngle, body.body().interpolatedAngle + Math.PI * 2);
	            }
	        });
	        context.strokeStyle = 'red';
	        context.lineWidth = 1;
	        context.stroke();
	    }
	
	    for (var layer = 0; layer <= 2; layer ++) {
	        fpWorld.bodies().forEach(function(body) {
	            renderBody(body, layer);
	        });
	        fpWorld.actors().forEach(function(actor) {
	            actor.bodies().forEach(function(body) {
	                renderBody(body, layer);
	            });
	        });
	    }
	    fpWorld.bodies().forEach(function(body) {
	        renderBodyFrame(body);
	    });
	    fpWorld.actors().forEach(function(actor) {
	        actor.bodies().forEach(function(body) {
	            renderBodyFrame(body);
	        });
	    });
	}
	
	module.exports = fpWorldRender;


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	// Mr. Floppypants World
	
	var fpWorld = __webpack_require__(5);
	var fpView = __webpack_require__(68);
	
	var fpBackdrop = __webpack_require__(114);
	
	var fpHomeSetup = __webpack_require__(115);
	
	var context = fpView.context();
	
	// ---
	
	var groundBg = context.createLinearGradient(0, 0, 0, fpWorld.BOTTOM);
	groundBg.addColorStop(0, '#8a4425');
	groundBg.addColorStop(1, '#421a09');
	
	fpWorld.addBackdrop(new fpBackdrop({
	    polygon: [
	        [fpWorld.LEFT, fpWorld.GROUND],
	        [fpWorld.RIGHT, fpWorld.GROUND],
	        [fpWorld.RIGHT, fpWorld.BOTTOM],
	        [fpWorld.LEFT, fpWorld.BOTTOM]
	    ],
	    fill: groundBg
	}));
	
	// ---
	
	fpHomeSetup([0, 0]);
	
	// ---
	
	if (fpWorld.currentActor())
	    fpView.position(fpWorld.currentActor().head().body().position);


/***/ },
/* 114 */
/***/ function(module, exports) {

	// Mr. Floppypants Backdrop
	
	function fpBackdrop(param) {
	    this._polypolygon = param.polypolygon || [param.polygon];
	    this._fill = param.fill;
	}
	
	fpBackdrop.prototype.polypolygon = function() {
	    return this._polypolygon;
	};
	
	fpBackdrop.prototype.fill = function() {
	    return this._fill;
	};
	
	fpBackdrop.prototype.addPolygon = function(polygon) {
	    this._polypolygon.push(polygon);
	};
	
	module.exports = fpBackdrop;


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	// Mr. Floppypants Home setup
	
	var fpWorld = __webpack_require__(5);
	var fpView = __webpack_require__(68);
	var fpBackdrop = __webpack_require__(114);
	var fpThings = __webpack_require__(116);
	var fpActors = __webpack_require__(118);
	
	var context = fpView.context();
	
	function fpHomeSetup(position) {
	    var houseBg = context.createLinearGradient(position[0] + 500, position[1] - 1650, position[0] + 1900, position[1]);
	    houseBg.addColorStop(0, '#e0f4ca');
	    houseBg.addColorStop(1, '#a9cb84');
	
	    var homeBackdrop = new fpBackdrop({
	        polygon: [
	            [position[0], position[1]],
	            [position[0], position[1] - 1650],
	            [position[0] + 2400, position[1] - 1650],
	            [position[0] + 2400, position[1]]
	        ],
	        fill: houseBg
	    });
	    fpWorld.addBackdrop(homeBackdrop);
	
	    var atticPeak = [position[0] + 1200, position[1] - 1650 - 1300/2];
	    var atticBg = context.createLinearGradient(atticPeak[0], atticPeak[1], atticPeak[0], position[1] - 1650);
	    atticBg.addColorStop(0, '#5c3611');
	    atticBg.addColorStop(1, '#835323');
	
	    var atticBackdrop = new fpBackdrop({
	        polygon: [
	            [position[0] - 100, position[1] - 1650],
	            atticPeak,
	            [position[0] + 2500, position[1] - 1650]
	        ],
	        fill: atticBg
	    });
	    fpWorld.addBackdrop(atticBackdrop);
	
	    function pos(blockOffset) {
	        return [position[0] - 25 + 50 * blockOffset[0], position[1] - 25 + 50 * blockOffset[1]];
	    }
	
	    function addThing(thing, blockOffset, flip, angle) {
	        return fpThings[thing](pos(blockOffset), flip, angle);
	    }
	
	    function addActor(actor, blockOffset) {
	        return fpActors[actor](pos(blockOffset));
	    }
	
	    // underneath
	
	    addThing('stairs',  [ 1, 11]);
	
	    // first floor
	
	    addThing('floor1',  [ 0, 0]);
	    addThing('stairs',  [ 1, 0]);
	    addThing('floor4',  [12, 0]);
	    addThing('floor1',  [16, 0]);
	    addThing('floor15', [17, 0]);
	    addThing('floor1',  [32, 0]);
	    addThing('floor15', [33, 0]);
	    addThing('floor1',  [48, 0]);
	
	    addThing('wall3',  [ 0, -5]);
	    addThing('wall5',  [ 0, -10]);
	    addThing('wall5',  [16, -10]);
	    addThing('wall5',  [32, -10]);
	    addThing('wall5',  [48, -10]);
	
	    // second floor
	
	    addThing('floor1',  [ 0, -11]);
	    addThing('floor4',  [12, -11]);
	    addThing('floor1',  [16, -11]);
	    addThing('floor15', [17, -11]);
	    addThing('floor1',  [32, -11]);
	    addThing('floor4',  [33, -11]);
	    addThing('stairs',  [48, -11], true);
	    addThing('floor1',  [48, -11]);
	
	    addThing('wall3',  [ 0, -14]);
	    addThing('wall5',  [ 0, -21]);
	    addThing('wall5',  [16, -21]);
	    addThing('wall5',  [32, -21]);
	    addThing('wall5',  [48, -21]);
	    addThing('wall5',  [48, -16]);
	
	    addThing('table',  [23, -11]);
	    addThing('plate',  [23, -12.95]);
	    addThing('glass',  [24, -12.95]);
	    addThing('glass',  [25.7, -12.95]);
	    addThing('plate',  [26, -12.95]);
	    addThing('chair',  [22.5, -11]);
	    addThing('chair',  [27.5, -11], true);
	
	    // third floor
	
	    addThing('floor1',  [ 0, -22]);
	    addThing('floor15', [ 1, -22]);
	    addThing('floor1',  [16, -22]);
	    addThing('floor15', [17, -22]);
	    addThing('floor1',  [32, -22]);
	    addThing('floor4',  [33, -22]);
	    addThing('floor1',  [48, -22]);
	
	    addThing('wall3',  [ 0, -25]);
	    addThing('wall5',  [ 0, -32]);
	    addThing('wall5',  [16, -32]);
	    addThing('wall5',  [32, -32]);
	    addThing('wall5',  [48, -32]);
	    addThing('wall3',  [48, -25]);
	
	    addThing('sink', [0.9, -22]);
	    addThing('bathtub', [6, -22]);
	
	    addThing('ball', [21, -22]);
	    addThing('bed', [22, -22]);
	    addThing('pillow', [22.25, -23.5]);
	
	    // attic
	
	    addThing('floor1',  [ 0, -33]);
	    addThing('floor4',  [ 1, -33]);
	    addThing('floor1',  [ 5, -33]);
	    addThing('floor1',  [11, -33]);
	    addThing('floor4',  [12, -33]);
	    addThing('floor1',  [16, -33]);
	    addThing('floor15', [17, -33]);
	    addThing('floor1',  [32, -33]);
	    addThing('floor15', [33, -33]);
	    addThing('floor1',  [48, -33]);
	
	    addThing('hatch', [6.25, -32.5]);
	
	    // roof
	
	    for (var i = 0; i < 13; i ++) {
	        addThing('roof', [-1.5 + i * 2, -33 - i]);
	        if (i != 6)
	            addThing('roof', [50.5 - i * 2, -33 - i], true);
	        else {
	            addThing('chimney', [50.5 - i * 2, -33 - i], true);
	            addThing('chimney2', [50.5 - i * 2, -33 - i], true);
	        }
	    }
	
	    fpWorld.currentActor(addActor('MrFloppyPants', [30, -37]));
	}
	
	module.exports = fpHomeSetup;


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// Mr. Floppypants Things
	
	var fpWorld = __webpack_require__(5);
	var fpBody = __webpack_require__(117);
	var p2 = __webpack_require__(6);
	
	var fpThings = {
	};
	
	function addBody(param) {
	    return function(position, flip, angle) {
	        var nparam = {
	        };
	        for (var x in param)
	            nparam[x] = param[x];
	        nparam.offset = param.offset || [0, 0];
	        nparam.position = position;
	        nparam.flip = flip;
	        nparam.angle = angle;
	        if (param.more) {
	            nparam.more = function(thing, position) {
	                param.more(thing, position);
	            };
	        }
	        var body = new fpBody(nparam);
	        fpWorld.addBody(body);
	        body.body().sleep();
	        return body;
	    };
	}
	
	fpThings.floor1 = addBody({
	    polygon: [[0, 0], [0, 50], [50, 50], [50, 0]],
	    image: 'floor1'
	});
	fpThings.floor4 = addBody({
	    polygon: [[0, 0], [200, 0], [200, 50], [0, 50]],
	    image: 'floor4'
	});
	fpThings.floor9 = addBody({
	    polygon: [[0, 0], [450, 0], [450, 50], [0, 50]],
	    image: 'floor9'
	});
	fpThings.floor15 = addBody({
	    polygon: [[0, 0], [750, 0], [750, 50], [0, 50]],
	    image: 'floor15'
	});
	fpThings.wall3 = addBody({
	    polygon: [[1, 2], [28, 2], [28, 146], [1, 146]],
	    image: 'wall3',
	    position: [10, 0]
	});
	fpThings.wall5 = addBody({
	    polygon: [[1, 2], [28, 2], [28, 242], [1, 242]],
	    image: 'wall5',
	    position: [10, 0]
	});
	fpThings.stairs = addBody({
	    polygon: [
	        [1, 1], [51, 1],
	        [51, 51], [101, 51],
	        [101, 101], [151, 101],
	        [151, 151], [201, 151],
	        [201, 201], [251, 201],
	        [251, 251], [301, 251],
	        [301, 301], [351, 301],
	        [351, 351], [401, 351],
	        [401, 401], [451, 401],
	        [451, 451], [501, 451],
	        [501, 501], [551, 501],
	        [551, 550], [501, 550], [1, 55]
	    ],
	    image: 'stairs',
	    offset: [0, 0],
	    position: [-1, -501]
	});
	fpThings.ball = addBody({
	    circle: [25, -25, 24],
	    image: 'ball',
	    offset: [0, 50],
	    mass: 0.3,
	    material: fpWorld.BOUNCY_MATERIAL
	});
	fpThings.bed = addBody({
	    polygon: [
	        [0, 0], [0, -105], [13, -105], [13, -76], [283, -76], [283, -79],
	        [292, -79], [292, 0], [283, 0], [283, -31], [9, -31], [9, 0]
	    ],
	    image: 'bed',
	    offset: [0, 104],
	    mass: 120
	});
	fpThings.pillow = addBody({
	    polygon: [[2, -6], [25, -2], [48, -6], [48, -14], [25, -18], [2, -14]],
	    image: 'pillow',
	    offset: [0, 20],
	    mass: 0.1
	});
	fpThings.table = addBody({
	    polygon: [
	        [3, -97], [197, -97], [197, -90], [153, -90], [153, -1], [144, -1], [144, -76],
	        [55, -76], [55, -1], [46, -1], [46, -90], [3, -90]
	    ],
	    image: 'table',
	    offset: [0, 100],
	    mass: 100
	});
	fpThings.glass = addBody({
	    polygon: [[2, -22], [11, -22], [11, -1], [2, -1]],
	    image: 'glass',
	    offset: [0, 24],
	    mass: 1
	});
	fpThings.plate = addBody({
	    polygon: [[3, -10], [44, -10], [29, -1], [17, -1]],
	    image: 'plate',
	    offset: [0, 13],
	    mass: 1
	});
	fpThings.chair = addBody({
	    polygon: [[1, -1], [1, -137], [8, -137], [8, -61], [52, -61], [52, -1], [45, -1], [45, -27], [8, -27], [8, -1]],
	    image: 'chair',
	    offset: [1, 138],
	    mass: 30
	});
	fpThings.bathtub = addBody({
	    polygon: [
	        [5, -97], [20, -98], [45, -30], [199, -30], [237, -91], [250, -91],
	        [205, -2], [182, -2], [182, -14], [61, -14], [61, -2], [41, -2], [0, -84]
	    ],
	    images: ['bathtub1', 'bathtub2'],
	    offset: [1, 102],
	    mass: 300
	});
	fpThings.sink = addBody({
	    polygon: [
	        [2, -111], [10, -139], [26, -137], [17, -112], [20, -84], [59, -84], [83, -111], [91, -109],
	        [77, -81], [50, -72], [79, -2], [0, -2]
	    ],
	    images: ['sink1', 'sink2'],
	    offset: [1, 142],
	    mass: 250
	});
	fpThings.hatch = addBody({
	    polygon: [
	        [-8, -10], [190, -10], [195, -16], [213, -16], [218, -10], [234, -10],
	        [234, 10], [218, 10], [213, 16], [195, 16], [190, 10], [-8, 10]
	    ],
	    image: 'hatch',
	    offset: [12, 20],
	    mass: 50,
	    more: function(hatch, position) {
	        hatch.body().gravityScale = 0;
	        var joi = new p2.RevoluteConstraint(fpWorld.NULL_BODY, hatch.body(), {
	            worldPivot: position
	        });
	        joi.setLimits(0, 0);
	        fpWorld.world().addConstraint(joi);
	    }
	});
	fpThings.roof = addBody({
	    polygon: [[0, 21], [99, -30], [115, -17], [17, 33]],
	    image: 'roof',
	    offset: [0, 30]
	});
	fpThings.chimney = addBody({
	    polygon: [
	        [4, -159], [24, -159], [24, 27], [4, 39],
	    ],
	    images: [null, 'chimney'],
	    offset: [0, 164]
	});
	fpThings.chimney2 = addBody({
	    polygon: [
	        [97, -159], [117, -159], [117, -17], [97, -12]
	    ],
	    image: null,
	    offset: [0, 164]
	});
	// createGrass: function(world, offx, offy, angle) {
	//     return [createThing(world, {
	//         position: [offx, offy],
	//         polygon: [[0, 75], [0, 0], [500, 0], [500, 75]],
	//         image: ['grass1', 'grass2'],
	//         offset: [250, 65],
	//         angle: angle
	//     })];
	// },
	// createRedBlock: function(world, offx, offy) {
	//     return [createThing(world, {
	//         position: [offx + 25, offy + 25],
	//         polygon: [[-25, -25], [25, -25], [25, 25], [-25, 25]],
	//         image: 'redblock',
	//         offset: [25, 25]
	//     })];
	// }
	
	module.exports = fpThings;


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var p2 = __webpack_require__(6);
	var fpWorld = __webpack_require__(5);
	
	function fpBody(param) {
	    var mass = param.mass || 0;
	    this._body = new p2.Body({
	        mass: mass,
	        position: param.position.slice(),
	        angle: (param.flip ? -param.angle : param.angle) * Math.PI / 180
	    });
	    var offset = param.offset.slice() || [0, 0];
	    if (param.polygon) {
	        var polygon = param.polygon;
	        if (param.flip)
	            polygon = polygon.map(function(coord) {
	                return [-coord[0], coord[1]];
	            });
	        this._body.fromPolygon(polygon.slice());
	        offset[0] += this._body.position[0] - param.position[0];
	        offset[1] += this._body.position[1] - param.position[1];
	    } else if (param.circle) {
	        this._body.position[0] += param.circle[0];
	        this._body.position[1] += param.circle[1];
	        offset[0] += param.circle[0];
	        offset[1] += param.circle[1];
	        this._body.addShape(new p2.Circle({radius: param.circle[2]}));
	    }
	    var collisionGroup = param.collisionGroup || (mass == 0 ? fpWorld.GROUP_GROUND : fpWorld.GROUP_OTHER);
	    var collisionMask;
	    if (collisionGroup == fpWorld.GROUP_OTHER)
	        collisionMask = ~0;
	    else
	        collisionMask = ~collisionGroup;
	    this._body.shapes.forEach(function(s) {
	        s.material = param.material || fpWorld.STANDARD_MATERIAL;
	        s.collisionGroup = collisionGroup;
	        s.collisionMask = collisionMask;
	    });
	    this._images = [null, null, null];
	    if (param.image)
	        this._images[mass == 0 ? 0 : 1] = param.image;
	    else if (param.images) {
	        this._images[1] = param.images[0];
	        this._images[2] = param.images[1];
	    }
	    this._offset = offset;
	    this._flip = param.flip;
	    if (param.more)
	        param.more(this, param.position);
	}
	
	fpBody.prototype.body = function () {
	    return this._body;
	};
	
	fpBody.prototype.position = function () {
	    return this._body.interpolatedPosition.slice();
	};
	
	fpBody.prototype.angle = function () {
	    return this._body.interpolatedAngle;
	};
	
	fpBody.prototype.flip = function () {
	    return this._flip;
	};
	
	fpBody.prototype.images = function () {
	    return this._images;
	};
	
	fpBody.prototype.offset = function () {
	    return this._offset.slice();
	};
	
	module.exports = fpBody;


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	// Mr. Floppypants Actors
	
	var fpWorld = __webpack_require__(5);
	var fpBody = __webpack_require__(117);
	var fpActor = __webpack_require__(119);
	var fpUtil = __webpack_require__(67);
	var p2 = __webpack_require__(6);
	
	var fpActors = {
	};
	
	function getBodyFunc(position0, collisionGroup) {
	    return function(param) {
	        var nparam = {};
	        for (var x in param)
	            nparam[x] = param[x];
	        nparam.offset = param.offset || [0, 0];
	        nparam.position[0] += position0[0];
	        nparam.position[1] += position0[1];
	        nparam.collisionGroup = collisionGroup;
	        return new fpBody(nparam);
	    };
	}
	
	function joinFunc(position0) {
	    return function(body1, body2, position, param) {
	        var constraint = new p2.RevoluteConstraint(body1.body(), body2.body(), {
	            worldPivot: [position0[0] + position[0], position0[1] + position[1]]
	        });
	        if (param.limits)
	            constraint.setLimits(param.limits[0] * Math.PI / 180, param.limits[1] * Math.PI / 180);
	        fpWorld.world().addConstraint(constraint);
	        return constraint;
	    };
	}
	
	fpActors.MrFloppyPants = function(position) {
	    position = [position[0] - 24, position[1] - 33];
	    var collisionGroup = fpWorld.newCollisionGroup();
	    var getBody = getBodyFunc(position, collisionGroup);
	    var join = joinFunc(position);
	    var mass = 0.5;
	
	    var head = getBody({
	        position: [0, 0],
	        polygon: [[2, 33], [10, 12], [24, 5], [40, 12], [46, 33], [34, 57], [15, 57]],
	        image: 'head',
	        mass: 4 * mass
	    });
	
	    var chest = getBody({
	        position: [-5, 59],
	        polygon: [[8, 2], [53, 2], [53, 58], [8, 58]],
	        image: 'shirt-middle',
	        mass: 15 * mass
	    });
	    join(head, chest, [24, 55], {
	        limits: [-30, 30]
	    });
	
	    var armL1 = getBody({
	        position: [-31, 60],
	        polygon: [[28, 3], [31, 13], [7, 28], [2, 21]],
	        image: 'arm-left-upper',
	        mass: 4 * mass
	    });
	    join(chest, armL1, [2, 67], {
	        limits: [-45, 75]
	    });
	
	    var armR1 = getBody({
	        position: [80, 60],
	        polygon: [[28, 3], [31, 13], [7, 28], [2, 21]],
	        image: 'arm-left-upper',
	        flip: true,
	        mass: 4 * mass
	    });
	    join(chest, armR1, [51, 67], {
	        limits: [-75, 45]
	    });
	
	    var armL2 = getBody({
	        position: [-55, 79],
	        polygon: [[25, 3], [29, 10], [7, 27], [3, 22]],
	        image: 'arm-left-lower',
	        mass: 3 * mass
	    });
	    join(armL1, armL2, [-24, 83], {
	        limits: [-20, 45]
	    });
	
	    var armR2 = getBody({
	        position: [104, 79],
	        polygon: [[25, 3], [29, 10], [7, 27], [3, 22]],
	        image: 'arm-left-lower',
	        flip: true,
	        mass: 3 * mass
	    });
	    join(armR1, armR2, [77, 83], {
	        limits: [-45, 20]
	    });
	
	    var handL = getBody({
	        position: [-70, 96],
	        polygon: [[11, 3], [21, 14], [10, 25], [1, 15]],
	        image: 'hand-left',
	        mass: 3 * mass
	    });
	    join(armL2, handL, [-50, 105], {
	        limits: [-30, 30]
	    });
	
	    var handR = getBody({
	        position: [119, 96],
	        polygon: [[11, 3], [21, 14], [10, 25], [1, 15]],
	        image: 'hand-left',
	        flip: true,
	        mass: 3 * mass
	    });
	    join(armR2, handR, [99, 105], {
	        limits: [-30, 30]
	    });
	
	    var seat = getBody({
	        position: [0, 115],
	        polygon: [[9, 2], [42, 2], [50, 29], [3, 29]],
	        image: 'pants-top',
	        mass: 10 * mass
	    });
	    join(chest, seat, [24, 114], {
	        limits: [-25, 25]
	    });
	
	    var legL1 = getBody({
	        position: [-3, 140],
	        polygon: [[6, 2], [21, 5], [16, 40], [2, 37]],
	        image: 'pants-left-upper',
	        mass: 4 * mass
	    });
	    join(seat, legL1, [9, 145], {
	        limits: [-30, 30]
	    });
	
	    var legR1 = getBody({
	        position: [56, 140],
	        polygon: [[6, 2], [21, 5], [16, 40], [2, 37]],
	        image: 'pants-left-upper',
	        flip: true,
	        mass: 4 * mass
	    });
	    join(seat, legR1, [39, 145], {
	        limits: [-30, 30]
	    });
	
	    var legL2 = getBody({
	        position: [-11, 176],
	        polygon: [[10, 2], [24, 4], [24, 41], [8, 40]],
	        image: 'pants-left-lower',
	        mass: 4 * mass
	    });
	    join(legL1, legL2, [5, 180], {
	        limits: [-25, 25]
	    });
	
	    var legR2 = getBody({
	        position: [64, 176],
	        polygon: [[10, 2], [24, 4], [24, 41], [8, 40]],
	        image: 'pants-left-lower',
	        flip: true,
	        mass: 4 * mass
	    });
	    join(legR1, legR2, [43, 180], {
	        limits: [-25, 25]
	    });
	
	    var footL = getBody({
	        position: [-20, 214],
	        polygon: [[21, 3], [35, 4], [36, 15], [3, 15], [5, 10]],
	        image: 'shoe-left',
	        mass: 1 * mass
	    });
	    join(legL2, footL, [2, 218], {
	        limits: [-25, 25]
	    });
	
	    var footR = getBody({
	        position: [73, 214],
	        polygon: [[21, 3], [35, 4], [36, 15], [3, 15], [5, 10]],
	        image: 'shoe-left',
	        flip: true,
	        mass: 1 * mass
	    });
	    join(legR2, footR, [46, 218], {
	        limits: [-25, 25]
	    });
	
	    var painTimer = null;
	
	    var actor = new fpActor({
	        bodies: [seat, legL1, legR1, footL, footR, legL2, legR2, chest, head, armL1, armR1, armL2, armR2, handL, handR],
	        head: head,
	        hands: [handL, handR],
	        painPoints: [head, handL, handR, footL, footR]
	    });
	    fpUtil.addEventListener(actor, 'pain', function(pain) {
	        if (pain > 900*900) {
	            clearTimeout(painTimer);
	            head.images()[1] = 'head-ouch';
	            painTimer = setTimeout(function() {
	                head.images()[1] = 'head';
	            }, 1500);
	        }
	    });
	    fpWorld.addActor(actor);
	    return actor;
	};
	
	module.exports = fpActors;


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var fpUtil = __webpack_require__(67);
	var fpWorld = __webpack_require__(5);
	var p2 = __webpack_require__(6);
	
	function fpActor(param) {
	    this._bodies = param.bodies;
	    this._head = param.head;
	    this._hands = param.hands;
	    this._holding = this._hands.map(function() { return null; });
	
	    param.painPoints.forEach(function(body) {
	        fpUtil.addEventListener(body.body(), 'contact', function(otherBody) {
	            var rx = Math.abs(body.body().velocity[0] - otherBody.velocity[0]);
	            var ry = Math.abs(body.body().velocity[1] - otherBody.velocity[1]);
	            fpUtil.fireEvent(this, 'pain', [rx*rx + ry*ry]);
	        }.bind(this));
	    }.bind(this));
	    this._hands.forEach(function(body, handIndex) {
	        fpUtil.addEventListener(body.body(), 'contact', function(otherBody) {
	            if (!this._dragBody || body !== this._dragBody)
	                return;
	            if (this._holding[handIndex] != null)
	                return;
	            if (otherBody.type == p2.Body.STATIC)
	                return;
	            var constraint = new p2.LockConstraint(body.body(), otherBody);
	            constraint.setRelaxation(1);
	            this._holding[handIndex] = {
	                constraint: constraint
	            };
	            fpWorld.world().addConstraint(constraint);
	        }.bind(this));
	    }.bind(this));
	}
	
	fpActor.prototype.bodies = function () {
	    return this._bodies;
	};
	
	fpActor.prototype.head = function () {
	    return this._head;
	};
	
	fpActor.prototype.startDrag = function (dragBody) {
	    this._dragBody = dragBody;
	    this._hands.forEach(function(body, handIndex) {
	        if (body === dragBody && this._holding[handIndex]) {
	            this._releasing = handIndex;
	        }
	    }.bind(this));
	};
	
	fpActor.prototype.endDrag = function () {
	    if (this._releasing != null) {
	        fpWorld.world().removeConstraint(this._holding[this._releasing].constraint);
	        this._holding[this._releasing] = null;
	        this._releasing = null;
	    }
	    this._dragBody = null;
	};
	
	module.exports = fpActor;


/***/ }
/******/ ]);
//# sourceMappingURL=fp.js.map