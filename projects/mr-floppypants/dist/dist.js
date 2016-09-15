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
	var p2 = __webpack_require__(5);
	var view = __webpack_require__(66);
	var constants = __webpack_require__(67);
	var me = __webpack_require__(68);
	var world = __webpack_require__(84);
	
	var theWorld = new p2.World({
	    gravity:[0, constants.GRAVITY]
	});
	__webpack_require__(69).setup(theWorld);
	
	var nullBody = new p2.Body();
	var dragConstraint = null;
	
	var myBodies;
	
	function onMouseDown(position) {
	    var result = theWorld.hitTest(position, myBodies, 3);
	    var body = null;
	    for (var i = 0; i < result.length; i ++) {
	        if (result[i].type != p2.Body.STATIC)
	            body = result[i];
	    }
	    if (body) {
	        theWorld.addBody(nullBody);
	        dragConstraint = new p2.RevoluteConstraint(nullBody, body, {
	            worldPivot: position
	        });
	        dragConstraint.setStiffness(10000);
	        theWorld.addConstraint(dragConstraint);
	    }
	}
	
	function onMouseMove(position) {
	    if (dragConstraint) {
	        // setDragSpring(position);
	        // p2.vec2.copy(dragBody.position, position);
	        p2.vec2.copy(dragConstraint.pivotA, position);
	        dragConstraint.bodyA.wakeUp();
	        dragConstraint.bodyB.wakeUp();
	    }
	}
	
	function onMouseUp() {
	    if (dragConstraint) {
	        theWorld.removeConstraint(dragConstraint);
	        dragConstraint = null;
	        theWorld.removeBody(nullBody);
	    }
	}
	
	var theView = new view.View({
	    onMouseDown: onMouseDown,
	    onMouseMove: onMouseMove,
	    onMouseUp: onMouseUp
	});
	
	var things = [];
	
	things = things.concat(world.createFloor1(theWorld, -1300, -475));
	things = things.concat(world.createWall5(theWorld, -1300, -425));
	things = things.concat(world.createFloor15(theWorld, -1250, -475));
	things = things.concat(world.createFloor1(theWorld, -500, -475));
	things = things.concat(world.createWall5(theWorld, -500, -425));
	things = things.concat(world.createFloor15(theWorld, -450, -475));
	things = things.concat(world.createFloor1(theWorld, 300, -475));
	things = things.concat(world.createWall5(theWorld, 300, -425));
	things = things.concat(world.createFloor15(theWorld, 350, -475));
	things = things.concat(world.createFloor1(theWorld, 1100, -475));
	things = things.concat(world.createWall5(theWorld, 1100, -425));
	
	things = things.concat(world.createFloor1(theWorld, -1300, 75));
	things = things.concat(world.createWall5(theWorld, -1300, 125));
	things = things.concat(world.createWall3(theWorld, -1300, -75));
	things = things.concat(world.createFloor15(theWorld, -1250, 75));
	things = things.concat(world.createFloor1(theWorld, -500, 75));
	things = things.concat(world.createWall5(theWorld, -500, 125));
	things = things.concat(world.createFloor15(theWorld, -450, 75));
	things = things.concat(world.createFloor1(theWorld, 300, 75));
	things = things.concat(world.createWall5(theWorld, 300, 125));
	things = things.concat(world.createFloor9(theWorld, 350, 75));
	things = things.concat(world.createFloor1(theWorld, 1100, 75));
	things = things.concat(world.createWall5(theWorld, 1100, 125));
	things = things.concat(world.createWall3(theWorld, 1100, -75));
	things = things.concat(world.createBed(theWorld, -150, 75));
	things = things.concat(world.createPillow(theWorld, -135, 1));
	things = things.concat(world.createBall(theWorld, -200, 50));
	
	things = things.concat(world.createFloor1(theWorld, -1300, 625));
	things = things.concat(world.createWall3(theWorld, -1300, 475));
	things = things.concat(world.createFloor9(theWorld, -900, 625));
	things = things.concat(world.createFloor15(theWorld, -450, 625));
	things = things.concat(world.createFloor1(theWorld, 300, 625));
	things = things.concat(world.createFloor4(theWorld, 350, 625));
	things = things.concat(world.createStairs(theWorld, 550, 625));
	
	things = things.concat(world.createStairs(theWorld, -700, 1175, true));
	
	
	var myThings = me.createMe(theWorld, 0, 0);
	myBodies = myThings.map(function(thing) { return thing.body(); });
	things = things.concat(myThings);
	
	// To animate the bodies, we must step the world forward in time, using a fixed time step size.
	// The World will run substeps and interpolate automatically for us, to get smooth animation.
	var fixedTimeStep = 1 / 60; // seconds
	var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
	var lastTime;
	
	// Animation loop
	function animate(time){
	    requestAnimationFrame(animate);
	
	    // Compute elapsed time since last render frame
	    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
	
	    // Move bodies forward in time
	    theWorld.step(fixedTimeStep, deltaTime, maxSubSteps);
	
	    if (!dragConstraint) {
	        var position = myThings[0].body().position;
	        theView.cx((theView.cx() * (constants.CATCH_UP - 1) + position[0]) / constants.CATCH_UP);
	        theView.cy((theView.cy() * (constants.CATCH_UP - 1) + position[1]) / constants.CATCH_UP);
	    }
	    // Render the circle at the current interpolated position
	    //console.info(circleBody.position[0], circleBody.position[1]);
	    theView.clear('#eee');
	    things.forEach(function(t) { theView.render(t); });
	
	    lastTime = time;
	}
	
	// Start the animation loop
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
	exports.push([module.id, "html, body {\r\n    margin: 0;\r\n    height: 100%;\r\n    overflow: hidden;\r\n}\r\n", ""]);
	
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

	// Export p2 classes
	var p2 = module.exports = {
	    AABB :                          __webpack_require__(6),
	    AngleLockEquation :             __webpack_require__(9),
	    Body :                          __webpack_require__(11),
	    Broadphase :                    __webpack_require__(23),
	    Capsule :                       __webpack_require__(24),
	    Circle :                        __webpack_require__(25),
	    Constraint :                    __webpack_require__(26),
	    ContactEquation :               __webpack_require__(27),
	    ContactEquationPool :           __webpack_require__(28),
	    ContactMaterial :               __webpack_require__(30),
	    Convex :                        __webpack_require__(17),
	    DistanceConstraint :            __webpack_require__(32),
	    Equation :                      __webpack_require__(10),
	    EventEmitter :                  __webpack_require__(22),
	    FrictionEquation :              __webpack_require__(33),
	    FrictionEquationPool :          __webpack_require__(34),
	    GearConstraint :                __webpack_require__(35),
	    GSSolver :                      __webpack_require__(36),
	    Heightfield :                   __webpack_require__(38),
	    Line :                          __webpack_require__(39),
	    LockConstraint :                __webpack_require__(40),
	    Material :                      __webpack_require__(31),
	    Narrowphase :                   __webpack_require__(41),
	    NaiveBroadphase :               __webpack_require__(44),
	    Particle :                      __webpack_require__(46),
	    Plane :                         __webpack_require__(45),
	    Pool :                          __webpack_require__(29),
	    RevoluteConstraint :            __webpack_require__(47),
	    PrismaticConstraint :           __webpack_require__(50),
	    Ray :                           __webpack_require__(21),
	    RaycastResult :                 __webpack_require__(20),
	    Box :                           __webpack_require__(43),
	    RotationalVelocityEquation :    __webpack_require__(48),
	    SAPBroadphase :                 __webpack_require__(51),
	    Shape :                         __webpack_require__(18),
	    Solver :                        __webpack_require__(37),
	    Spring :                        __webpack_require__(52),
	    TopDownVehicle :                __webpack_require__(53),
	    LinearSpring :                  __webpack_require__(54),
	    RotationalSpring :              __webpack_require__(55),
	    Utils :                         __webpack_require__(8),
	    World :                         __webpack_require__(56),
	    vec2 :                          __webpack_require__(7),
	    version :                       __webpack_require__(57).version,
	};
	
	Object.defineProperty(p2, 'Rectangle', {
	    get: function() {
	        console.warn('The Rectangle class has been renamed to Box.');
	        return this.Box;
	    }
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7)
	,   Utils = __webpack_require__(8);
	
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
/* 7 */
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
	
	var Utils = __webpack_require__(8);
	
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
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Equation = __webpack_require__(10),
	    vec2 = __webpack_require__(7);
	
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Equation;
	
	var vec2 = __webpack_require__(7),
	    Utils = __webpack_require__(8),
	    Body = __webpack_require__(11);
	
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7)
	,   decomp = __webpack_require__(12)
	,   Convex = __webpack_require__(17)
	,   RaycastResult = __webpack_require__(20)
	,   Ray = __webpack_require__(21)
	,   AABB = __webpack_require__(6)
	,   EventEmitter = __webpack_require__(22);
	
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    Polygon : __webpack_require__(13),
	    Point : __webpack_require__(16),
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Line = __webpack_require__(14)
	,   Point = __webpack_require__(16)
	,   Scalar = __webpack_require__(15)
	
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Scalar = __webpack_require__(15);
	
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
/* 15 */
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
/* 16 */
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(18)
	,   vec2 = __webpack_require__(7)
	,   polyk = __webpack_require__(19)
	,   decomp = __webpack_require__(12);
	
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Shape;
	
	var vec2 = __webpack_require__(7);
	
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
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7);
	var Ray = __webpack_require__(21);
	
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Ray;
	
	var vec2 = __webpack_require__(7);
	var RaycastResult = __webpack_require__(20);
	var Shape = __webpack_require__(18);
	var AABB = __webpack_require__(6);
	
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
/* 22 */
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7);
	var Body = __webpack_require__(11);
	
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(18)
	,   vec2 = __webpack_require__(7);
	
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(18)
	,    vec2 = __webpack_require__(7);
	
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Constraint;
	
	var Utils = __webpack_require__(8);
	
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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var Equation = __webpack_require__(10),
	    vec2 = __webpack_require__(7);
	
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var ContactEquation = __webpack_require__(27);
	var Pool = __webpack_require__(29);
	
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
/* 29 */
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var Material = __webpack_require__(31);
	var Equation = __webpack_require__(10);
	
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
/* 31 */
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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(26)
	,   Equation = __webpack_require__(10)
	,   vec2 = __webpack_require__(7)
	,   Utils = __webpack_require__(8);
	
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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7)
	,   Equation = __webpack_require__(10)
	,   Utils = __webpack_require__(8);
	
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var FrictionEquation = __webpack_require__(33);
	var Pool = __webpack_require__(29);
	
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
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(26)
	,   Equation = __webpack_require__(10)
	,   AngleLockEquation = __webpack_require__(9)
	,   vec2 = __webpack_require__(7);
	
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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7)
	,   Solver = __webpack_require__(37)
	,   Utils = __webpack_require__(8)
	,   FrictionEquation = __webpack_require__(33);
	
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(8)
	,   EventEmitter = __webpack_require__(22);
	
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(18)
	,    vec2 = __webpack_require__(7)
	,    Utils = __webpack_require__(8);
	
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
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(18)
	,   vec2 = __webpack_require__(7);
	
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(26)
	,   vec2 = __webpack_require__(7)
	,   Equation = __webpack_require__(10);
	
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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7)
	,   sub = vec2.sub
	,   add = vec2.add
	,   dot = vec2.dot
	,   Utils = __webpack_require__(8)
	,   ContactEquationPool = __webpack_require__(28)
	,   FrictionEquationPool = __webpack_require__(34)
	,   TupleDictionary = __webpack_require__(42)
	,   Equation = __webpack_require__(10)
	,   ContactEquation = __webpack_require__(27)
	,   FrictionEquation = __webpack_require__(33)
	,   Circle = __webpack_require__(25)
	,   Convex = __webpack_require__(17)
	,   Shape = __webpack_require__(18)
	,   Body = __webpack_require__(11)
	,   Box = __webpack_require__(43);
	
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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(8);
	
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
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7)
	,   Shape = __webpack_require__(18)
	,   Convex = __webpack_require__(17);
	
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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var Circle = __webpack_require__(25),
	    Plane = __webpack_require__(45),
	    Shape = __webpack_require__(18),
	    Particle = __webpack_require__(46),
	    Broadphase = __webpack_require__(23),
	    vec2 = __webpack_require__(7);
	
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
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var Shape =  __webpack_require__(18)
	,    vec2 =  __webpack_require__(7)
	,    Utils = __webpack_require__(8);
	
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
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var Shape = __webpack_require__(18)
	,   vec2 = __webpack_require__(7);
	
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
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(26)
	,   Equation = __webpack_require__(10)
	,   RotationalVelocityEquation = __webpack_require__(48)
	,   RotationalLockEquation = __webpack_require__(49)
	,   vec2 = __webpack_require__(7);
	
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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var Equation = __webpack_require__(10),
	    vec2 = __webpack_require__(7);
	
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
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var Equation = __webpack_require__(10),
	    vec2 = __webpack_require__(7);
	
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
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var Constraint = __webpack_require__(26)
	,   ContactEquation = __webpack_require__(27)
	,   Equation = __webpack_require__(10)
	,   vec2 = __webpack_require__(7)
	,   RotationalLockEquation = __webpack_require__(49);
	
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
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(8)
	,   Broadphase = __webpack_require__(23);
	
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
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7);
	var Utils = __webpack_require__(8);
	
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
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7);
	var Utils = __webpack_require__(8);
	var Constraint = __webpack_require__(26);
	var FrictionEquation = __webpack_require__(33);
	var Body = __webpack_require__(11);
	
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
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7);
	var Spring = __webpack_require__(52);
	var Utils = __webpack_require__(8);
	
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
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7);
	var Spring = __webpack_require__(52);
	
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
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var  GSSolver = __webpack_require__(36)
	,    Solver = __webpack_require__(37)
	,    Ray = __webpack_require__(21)
	,    vec2 = __webpack_require__(7)
	,    Circle = __webpack_require__(25)
	,    Convex = __webpack_require__(17)
	,    Line = __webpack_require__(39)
	,    Plane = __webpack_require__(45)
	,    Capsule = __webpack_require__(24)
	,    Particle = __webpack_require__(46)
	,    EventEmitter = __webpack_require__(22)
	,    Body = __webpack_require__(11)
	,    Shape = __webpack_require__(18)
	,    LinearSpring = __webpack_require__(54)
	,    Material = __webpack_require__(31)
	,    ContactMaterial = __webpack_require__(30)
	,    DistanceConstraint = __webpack_require__(32)
	,    Constraint = __webpack_require__(26)
	,    LockConstraint = __webpack_require__(40)
	,    RevoluteConstraint = __webpack_require__(47)
	,    PrismaticConstraint = __webpack_require__(50)
	,    GearConstraint = __webpack_require__(35)
	,    pkg = __webpack_require__(57)
	,    Broadphase = __webpack_require__(23)
	,    AABB = __webpack_require__(6)
	,    SAPBroadphase = __webpack_require__(51)
	,    Narrowphase = __webpack_require__(41)
	,    Utils = __webpack_require__(8)
	,    OverlapKeeper = __webpack_require__(58)
	,    IslandManager = __webpack_require__(61)
	,    RotationalSpring = __webpack_require__(55);
	
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
/* 57 */
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
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var TupleDictionary = __webpack_require__(42);
	var OverlapKeeperRecord = __webpack_require__(59);
	var OverlapKeeperRecordPool = __webpack_require__(60);
	var Utils = __webpack_require__(8);
	
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
/* 59 */
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
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var OverlapKeeperRecord = __webpack_require__(59);
	var Pool = __webpack_require__(29);
	
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
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var vec2 = __webpack_require__(7)
	,   Island = __webpack_require__(62)
	,   IslandNode = __webpack_require__(63)
	,   IslandNodePool = __webpack_require__(64)
	,   IslandPool = __webpack_require__(65)
	,   Body = __webpack_require__(11);
	
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
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var Body = __webpack_require__(11);
	
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
/* 63 */
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
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var IslandNode = __webpack_require__(63);
	var Pool = __webpack_require__(29);
	
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
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var Island = __webpack_require__(62);
	var Pool = __webpack_require__(29);
	
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
/* 66 */
/***/ function(module, exports) {

	function View(param) {
	    this._elem = document.createElement('canvas');
	    this._ctx = this._elem.getContext('2d', {alpha: false});
	    this._elem.width = document.body.clientWidth;
	    this._elem.height = document.body.clientHeight;
	    document.body.appendChild(this._elem);
	    window.addEventListener('load', this._onResize.bind(this));
	    window.addEventListener('resize', this._onResize.bind(this));
	    this._cx = 0;
	    this._cy = 0;
	    this._elem.addEventListener('mousedown', this._onMouseDown.bind(this));
	    this._elem.addEventListener('mousemove', this._onMouseMove.bind(this));
	    this._elem.addEventListener('mouseup', this._onMouseUp.bind(this));
	    this._elem.addEventListener('mouseout', this._onMouseOut.bind(this));
	    this._param = param;
	}
	
	View.prototype.width = function () {
	    return this._elem.width;
	};
	
	View.prototype.height = function () {
	    return this._elem.height;
	};
	
	View.prototype.cx = function (v) {
	    if (v != null)
	        this._cx = v;
	    else
	        return this._cx;
	};
	
	View.prototype.cy = function (v) {
	    if (v != null)
	        this._cy = v;
	    else
	        return this._cy;
	};
	
	View.prototype._onResize = function () {
	    this._elem.width = document.body.clientWidth;
	    this._elem.height = document.body.clientHeight;
	};
	
	View.prototype.clear = function(color) {
	    var ctx = this._ctx;
	    ctx.fillStyle = color;
	    ctx.fillRect(0, 0, this.width(), this.height());
	};
	
	View.prototype.render = function(thing) {
	    var ctx = this._ctx;
	    ctx.save();
	    ctx.translate(this.width() / 2 - this._cx + thing.x(), this.height() * 2 / 3 - this._cy + thing.y());
	    ctx.rotate(thing.a());
	    thing._render(ctx);
	    ctx.restore();
	};
	
	View.prototype.mousePosition = function () {
	    if (this._mx == null)
	        return null;
	    var x = this._mx + this._cx - this.width() / 2;
	    var y = this._my + this._cy - this.height() * 2 / 3;
	    return [x, y];
	};
	
	View.prototype._onMouseDown = function (event) {
	    this._mx = event.clientX;
	    this._my = event.clientY;
	    this._param.onMouseDown(this.mousePosition());
	};
	
	View.prototype._onMouseMove = function (event) {
	    this._mx = event.clientX;
	    this._my = event.clientY;
	    this._param.onMouseMove(this.mousePosition());
	};
	
	View.prototype._onMouseUp = function (event) {
	    this._param.onMouseUp();
	};
	
	View.prototype._onMouseOut = function (event) {
	    this._mx = this._my = null;
	};
	
	module.exports = {
	    View: View
	};


/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = {
	
	    GRAVITY: 600,
	    CATCH_UP: 50,
	
	    GROUP_ME: 1,
	    GROUP_GROUND: 2,
	    GROUP_OTHER: 4
	};


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var thing = __webpack_require__(69);
	var constants = __webpack_require__(67);
	
	function createThing(world, param) {
	    var t = thing.createThing(world, param);
	    t.body().shapes.forEach(function(s) {
	        s.collisionGroup = constants.GROUP_ME;
	        s.collisionMask = constants.GROUP_OTHER | constants.GROUP_GROUND;
	    });
	    return t;
	}
	
	function join(world, thingA, thingB, param) {
	    return thing.join(world, thingA, thingB, param);
	}
	
	module.exports = {
	    createMe: function(world, offx, offy) {
	
	        var myShirtMid = createThing(world, {
	            mass: 15,
	            position: [offx + 0, offy + -141],
	            polygon: [[-22, -29], [23, -29], [23, 23], [-22, 23]],
	            image: 'shirt-middle',
	            offset: [30, 31]
	        });
	
	        var myArmLeftUpper = createThing(world, {
	            mass: 4,
	            position: [offx + -37, offy + -156],
	            polygon: [[9, -12], [15, -3], [-9, 12], [-15, 3]],
	            image: 'arm-left-upper',
	            offset: [16, 18]
	        });
	
	        join(world, myShirtMid, myArmLeftUpper, {
	            pivot: [offx + -22, offy + -165],
	            limits: [-Math.PI / 4, Math.PI / 2.5]
	        });
	
	        var myArmRightUpper = createThing(world, {
	            mass: 4,
	            position: [offx + 37, offy + -156],
	            polygon: [[9, -12], [15, -3], [-9, 12], [-15, 3]],
	            image: 'arm-left-upper',
	            offset: [16, 18],
	            flip: true
	        });
	
	        join(world, myShirtMid, myArmRightUpper, {
	            pivot: [offx + 22, offy + -165],
	            limits: [-Math.PI / 2.5, Math.PI / 4]
	        });
	
	        var myArmLeftLower = createThing(world, {
	            mass: 3,
	            position: [offx + -59, offy + -140],
	            polygon: [[8, -13], [13, -5], [-8, 13], [-13, 5]],
	            image: 'arm-left-lower',
	            offset: [16, 16]
	        });
	
	        join(world, myArmLeftUpper, myArmLeftLower, {
	            pivot: [offx + -48, offy + -148],
	            limits: [-Math.PI / 16, Math.PI / 8]
	        });
	
	        var myArmRightLower = createThing(world, {
	            mass: 3,
	            position: [offx + 59, offy + -140],
	            polygon: [[8, -13], [13, -5], [-8, 13], [-13, 5]],
	            image: 'arm-left-lower',
	            offset: [16, 16],
	            flip: true
	        });
	
	        join(world, myArmRightUpper, myArmRightLower, {
	            pivot: [offx + 48, offy + -148],
	            limits: [-Math.PI / 8, Math.PI / 16]
	        });
	
	        var myPantsTop = createThing(world, {
	            mass: 10,
	            position: [offx + 0, offy + -104],
	            polygon: [[-21, -14], [21, -14], [21, 14], [-21, 14]],
	            image: 'pants-top',
	            offset: [26, 18]
	        });
	
	        join(world, myShirtMid, myPantsTop, {
	            pivot: [offx + 0, offy + -110],
	            limits: [-Math.PI / 8, Math.PI / 8]
	        });
	
	        var myPantsLeftUpper = createThing(world, {
	            mass: 4,
	            position: [offx + -18, offy + -75],
	            polygon: [[-6, -18], [10, -15], [5, 20], [-9, 17]],
	            image: 'pants-left-upper',
	            offset: [11, 21]
	        });
	
	        join(world, myPantsTop, myPantsLeftUpper, {
	            pivot: [offx + -15, offy + -92],
	            limits: [-Math.PI / 8, Math.PI / 6]
	        });
	
	        var myPantsRightUpper = createThing(world, {
	            mass: 4,
	            position: [offx + 18, offy + -75],
	            polygon: [[-6, -18], [10, -15], [5, 20], [-9, 17]],
	            image: 'pants-left-upper',
	            offset: [11, 21],
	            flip: true
	        });
	
	        join(world, myPantsTop, myPantsRightUpper, {
	            pivot: [offx + 15, offy + -92],
	            limits: [-Math.PI / 6, Math.PI / 8]
	        });
	
	        var myPantsLeftLower = createThing(world, {
	            mass: 3,
	            position: [offx + -21, offy + -35],
	            polygon: [[-6, -22], [8, -20], [8, 19], [-9, 18]],
	            image: 'pants-left-lower',
	            offset: [16, 24]
	        });
	
	        join(world, myPantsLeftUpper, myPantsLeftLower, {
	            pivot: [offx + -20, offy + -56],
	            limits: [-Math.PI / 8, Math.PI / 8]
	        });
	
	        var myPantsRightLower = createThing(world, {
	            mass: 3,
	            position: [offx + 21, offy + -35],
	            polygon: [[-6, -22], [8, -20], [8, 19], [-9, 18]],
	            image: 'pants-left-lower',
	            offset: [16, 24],
	            flip: true
	        });
	
	        join(world, myPantsRightUpper, myPantsRightLower, {
	            pivot: [offx + 20, offy + -56],
	            limits: [-Math.PI / 8, Math.PI / 8]
	        });
	
	        var myShoeLeft = createThing(world, {
	            mass: 1,
	            position: [offx + -31, offy + -12],
	            polygon: [[0, -7], [15, -6], [15, 6], [-18, 6], [-14, 0]],
	            image: 'shoe-left',
	            offset: [21, 10]
	        });
	
	        join(world, myPantsLeftLower, myShoeLeft, {
	            pivot: [offx + -23, offy + -18],
	            limits: [-Math.PI / 8, Math.PI / 8]
	        });
	
	        var myShoeRight = createThing(world, {
	            mass: 1,
	            position: [offx + 31, offy + -12],
	            polygon: [[0, -7], [15, -6], [15, 6], [-18, 6], [-14, 0]],
	            image: 'shoe-left',
	            offset: [21, 10],
	            flip: true
	        });
	
	        join(world, myPantsRightLower, myShoeRight, {
	            pivot: [offx + 23, offy + -18],
	            limits: [-Math.PI / 8, Math.PI / 8]
	        });
	
	        var myHandLeft = createThing(world, {
	            mass: 3,
	            position: [offx + -77, offy + -128],
	            polygon: [[-1, -8], [8, 2], [1, 9], [-8, 0]],
	            image: 'hand-left',
	            offset: [13, 12]
	        });
	
	        join(world, myArmLeftLower, myHandLeft, {
	            pivot: [offx + -71, offy + -131],
	            limits: [-Math.PI / 6, Math.PI / 6]
	        });
	
	        var myHandRight = createThing(world, {
	            mass: 3,
	            position: [offx + 77, offy + -128],
	            polygon: [[-1, -8], [8, 2], [1, 9], [-8, 0]],
	            image: 'hand-left',
	            offset: [13, 12],
	            flip: true
	        });
	
	        join(world, myArmRightLower, myHandRight, {
	            pivot: [offx + 71, offy + -131],
	            limits: [-Math.PI / 6, Math.PI / 6]
	        });
	
	        var myHead = createThing(world, {
	            mass: 4,
	            position: [offx + 0, offy + -200],
	            polygon: [[0, -28], [18, -22], [21, 0], [8, 28], [-7, 28], [-20, 0], [-13, -22]],
	            image: 'head',
	            offset: [24, 32]
	        });
	
	        join(world, myHead, myShirtMid, {
	            pivot: [offx + 0, offy + -172],
	            limits: [-Math.PI / 6, Math.PI / 6]
	        });
	
	        return [
	            myPantsTop,
	            myShoeLeft,
	            myShoeRight,
	            myPantsLeftUpper,
	            myPantsRightUpper,
	            myPantsLeftLower,
	            myPantsRightLower,
	            myShirtMid,
	            myHandLeft,
	            myHandRight,
	            myArmLeftUpper,
	            myArmRightUpper,
	            myArmLeftLower,
	            myArmRightLower,
	            myHead
	        ];
	    }
	};


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var p2 = __webpack_require__(5);
	var constants = __webpack_require__(67);
	
	function Thing(body, image, offx, offy, flip) {
	    this._body = body;
	    this._image = image;
	    this._offx = offx;
	    this._offy = offy;
	    this._flip = flip;
	}
	
	Thing.prototype.body = function () {
	    return this._body;
	};
	
	Thing.prototype.x = function () {
	    return this._body.position[0];
	};
	
	Thing.prototype.y = function () {
	    return this._body.position[1];
	};
	
	Thing.prototype.a = function () {
	    return this._body.angle;
	};
	
	Thing.prototype._render = function(ctx) {
	    if (this._flip) ctx.scale(-1, 1);
	    ctx.drawImage(this._image, -this._offx, -this._offy);
	};
	
	var standardMaterial = new p2.Material();
	var bouncyMaterial = new p2.Material();
	
	function setup(world) {
	    world.addContactMaterial(new p2.ContactMaterial(standardMaterial, standardMaterial, {
	        friction: 1,
	        restitution: 0.1
	    }));
	    world.addContactMaterial(new p2.ContactMaterial(standardMaterial, bouncyMaterial, {
	        friction: 10,
	        restitution: 0.75
	    }));
	    world.addContactMaterial(new p2.ContactMaterial(bouncyMaterial, bouncyMaterial, {
	        friction: 10,
	        restitution: 0.85
	    }));
	}
	
	function createThing(world, param) {
	    param.mass = param.mass || 0;
	    var bod = new p2.Body({
	        mass: param.mass,
	        position: param.position
	    });
	    if (param.polygon) {
	        var polygon = param.polygon.map(function(coord) {
	            if (param.flip)
	                return [-coord[0], coord[1]];
	            return coord;
	        });
	        bod.fromPolygon(polygon);
	    } else if (param.circle) {
	        bod.addShape(new p2.Circle({radius: param.circle[0]}));
	    }
	    if (param.mass == 0) {
	        bod.shapes.forEach(function(s) {
	            s.material = param.material || standardMaterial;
	            s.collisionGroup = constants.GROUP_GROUND;
	            s.collisionMask = constants.GROUP_OTHER | constants.GROUP_ME;
	        });
	    } else {
	        bod.shapes.forEach(function(s) {
	            s.material = param.material || standardMaterial;
	            s.collisionGroup = constants.GROUP_OTHER;
	            s.collisionMask = constants.GROUP_OTHER | constants.GROUP_ME | constants.GROUP_GROUND;
	        });
	    }
	    world.addBody(bod);
	    var img = new Image();
	    img.src = __webpack_require__(70)("./" + param.image + '.png');
	    return new Thing(bod, img, param.offset[0], param.offset[1], param.flip);
	}
	
	function join(world, thingA, thingB, param) {
	    var joi = new p2.RevoluteConstraint(thingA.body(), thingB.body(), {
	        worldPivot: param.pivot
	    });
	    joi.setLimits(param.limits[0], param.limits[1]);
	    world.addConstraint(joi);
	    return joi;
	}
	
	module.exports = {
	    Thing: Thing,
	    setup: setup,
	    standardMaterial: standardMaterial,
	    bouncyMaterial: bouncyMaterial,
	    createThing: createThing,
	    join: join
	};


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./arm-left-lower.png": 71,
		"./arm-left-upper.png": 72,
		"./ball.png": 93,
		"./bed.png": 73,
		"./doorwall.png": 88,
		"./floor1.png": 86,
		"./floor15.png": 85,
		"./floor4.png": 87,
		"./floor9.png": 89,
		"./hand-left.png": 74,
		"./head.png": 75,
		"./pants-left-lower.png": 76,
		"./pants-left-upper.png": 77,
		"./pants-top.png": 78,
		"./pillow.png": 79,
		"./redblock.png": 80,
		"./shirt-middle.png": 81,
		"./shoe-left.png": 82,
		"./stairs.png": 83,
		"./wall3.png": 91,
		"./wall5.png": 92,
		"./windowwall.png": 90
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

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAYAAACcuBHKAAAEBUlEQVRYw+WXb0hddRjHP8/vnPtPr1dx17W0LaZWE3Su2QvXTBCk3oSrEWO2qFg2cQQx6E30okFvVsSiRBjWaIutrRgU1AYukqAFbZVaEq05+iNFpq55z7xer55zfr241z9XvaJTZ9Dz5sA93N/zeb7P8/ue3w/+A2Gs8PoKOAgUAZ2rUaAP+ADQOXebp1cDIAxcAtyNDwd01aHcSPXrazbOJ9dyxwbgAoqKTXuCUlAVQBkSEsWxh46tlVsBsQXhG+WhuHRvlgpv9qIMQUwQU6rHht3n5/qTLCNANfCJJyiZpc+EjGCBiRggigSIAWIwokyp+Kxh4PJKQOwCTvjXKFXWEDL8YQOVBBBTEk9DJn7rECWVbU/3jy9nO/YC72esM9TmpmwjEDZQZiKpmInEKvlMKCNbgReWU4mXgFdyikxKnsoST6aaKT+iJAGlUlLZdsyt/rxp8CLgyhJM7i1gf7jco+/ZnSWGd6JamWyDUlMg0yPaZ9NxODIy0u+cBPaZNwHgB04COwse8FFYlymJyhPVp4AYIJIK0N8Z54cjluOMawtoBVgsRB5wDqgofiyT/G3+VPmTA5iASU3u2pqfTtzgjy9GQWhHUw9cW+xMFAPnMbizZE+Wyiv3zqp6CiZ12fiQQ1eLpYd6xgFeBF4D9MT7hSpxL0Kb4SO3rCGksgs9U31PJp0cxBnyX+8Zo6vZcsZuuFHgceDszMUXAvEg8JE3KN6yxgkTkmQb0ssP8MvZKD1nolqEK2jqgKs345i7gfcyblOqrDFkBHKNqarnmX4nrvnxXYu/vo6DcBxNExBLl2Q+iGeBI8ECg9J9IeXPVpPul+IDM+SPXXPoao441m+2JH3k1en9nyvSteNl4GC41OuWPBlUhk+lbr808v/9XZzuVst1bX0deBS4sJCBkzlMqAVoXFvhY1N9JsqrJr8DyhRQswG01vx6boSeM1ENdKDZCfQudNtNVyIAnAJ2rK/xU1iXgfIoRKbvgtn9t2Mu3W9bbn/HmAKOAs8B8cWYzwRELvApUFn0SAbrazKmPsNmevcb/tOm482IHRtwXGB/EmLRMQFxGNh2165MCqoCC9p+fZdG6X7HcrVNP5odwLdLPW0PAvXxiKvW3edTZkASn19zDvt1NFc+HObnU1G0Szua2nT7f7EQvcCX45au/+fymLq90q/MgMy2X8ul842I03cxLsCh5FkiutQDicxxRGvLK/f6th7ISXk3dHWcruaIE7fcUTRPAB+v1OXndyAUG3C2b6gNiOFNcPS2j/B9i+XaY7oHTQ3w1UrfGe4HdFljSNe25un87X436XingeCturgoFIO5JR4dvMOwARs4sBo3qKOAFsVAck5WJbYAx4F8/i/xLyFTJ8+zOjI/AAAAAElFTkSuQmCC"

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAgCAYAAAB3j6rJAAAEDElEQVRYw+WXTWhcVRTHf+femUlmkpm0SaqJtmmbUJt2oWArxBKwgRaxti5q2lQSNeAHVhAEKUSk4EoRXKUqbYVooRIR60aQBlxUqEklVkxqJDVqowmhSZqaZtJkvt67LmYmmTedTL7pogeGeYsL5/f+/3POOxfu0SgB9t1NAAW8BkygGQf03YCoAroBc9+jHrv6/cKOTIdkFQG8wLvAW6482HrErx94PBfRWCKyvq1x5HrqYdcqQVQjfI6honRXDg8dysfjV4gGEdHAYaB5NUEKgZPAIW+xsra/6GftFk8cQIHIjAF16SArac1BhJMYisv2eKV8vw/tVagkhHKkMkB5W+NI/0oqsg74BKjNK9XWtufzJVDmRlyCUhkhkgLUAh+mttVy4lXgTxQHNx/wsvPYGh0ocyOaOITOCJFqz7KtKQQ+Bo74SpRdWe9XBZvc8bdPJFeurBBJeyraGkeuLdWa/QgtCEWbnvJSVuNVyqMcEPMokSrCc8B7i7WmGPgK+Na/0VX0WNMatXGPD+1xFqRoUHrBQtcttkZqELqA2vU1uTxyNKB86zSiZbY19aIhGOoIPewJqG8Amc8aDRwHjnsCYrbV+6Wg3D1rQUpXiFo4RGTS5vczQYY7w4ji/vlAyhNW7CjdlcPmfXm4csRRB8pREwtTYfjnED2fBa3olLGBY8amGTBzgTyJ0CqagooDPkqqclFKEJczcfpztoiFbK5+OcnghRAIf2FoADqzDbTXgWZvkZLKBr/KK9FxCA0izNqhndZki//6Ilw5NWFN37AVcAJDEzA917fGnZiQLxdWuthS58ftlTsLMvG/gIFFLGy42hqMq6D4B6gHLmVbAxRwBmgoqcqh/Gkfyi0ziZVOgXAJIsw7sIIDMbpPT9iTAzEFnAXeAMbnOp9U5CjQULY3lw27ffE3zQShEvZkUcLYhv7zU/Sdu20bwy3gFeDcfEWcBHnWV6LNht0+mas1FzK6p0YtrpyesMf7ogo4D7wEXF9INyVBlM4Rcc4EQAmo9A7JDDH4wzS9XwRtK0oIeBP4dDHfjSTItdCNWLVo9MxMUJmtSY/wLZuelgkz2hURoAN4Afh7Kds1QGf0Nnr6puXoDqXTrBGnGsOXw1x8eyw22hWJAk3AE0uBSFXkO8CM/RaR/FK3E0LfCRGdsuk9O8lQewiE3kRbdi/3vgHQD1wYuhiyjG2cRZqyaxpjGPk1zI/v3LSG2kM28AGGncuFIO2iM2CFaNS5wtqtHsfAigRthtpDdJ+asAa+n1ZW2PwLPAO0ANZKLLzpLdCKcHh7Y77yP+giOGgxcjlsxnoiGBtBuIThI+BrILyat7IAwk+JNS7+U4wCJ4Adq5k401DwAHuBAPAL8EcC6t6I/wGFuCDp5mqyAwAAAABJRU5ErkJggg=="

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAEdklEQVRIx82Wa2wUVRTH//fOY2dnd3baXVpooZRSKFq0Fk0BBYtSUENE/CCB+KBgDDGxEoUIxkQ/+EgMUcSg0ZiQYIRoRA0+EhLTiBhAC7TYUizvIq+yCwtpuzvbmbkPP7RsKRFaCCbeT3fm5vzOuf9zzz0X+A+HMsi6EQnpG4KGslJT6Z2eLxIAOm6V8+dqpozOrH9jtqxbWCmKhltdlqkdATBnKMbqIOvnXY+744tzjZJRNnlsRql14NgF69PNzV+eSaQPpzL+UwAO36ws7Rc7e56vKMuL5EdNQErE7CBmTSkODI+aBa3Hk4sUSmI+EzsAsBuFc4+J+l3NZxfOuHtUMGzqkEICAEbmW+The4uNVMavPB3vftZnoh5A4kbgAJDwmNjzy55T86ZVFhqRkA4pJSQASggqxg/TCvPCdvPhxEyfiY9vFA4p0e56LL51Z/uc+bPLFEII0OdAACiIhdDYlghc6nLbJHDwsh0dClzX6JNhU1+7cnGVGtAVEAIQSkAIQPvmtXPLLTOorruSOVjkViiobSwabr24btWDORXj84iU2d1AZOcStmWgrT1JE0mnXQKtg8Grw6a2fcFDZZWvL50atkKBK2Xq1V3KvjkghIQd1vWmg4kKzxfrrnXOiyMhfWN+1Jy4anFV7m0l0QGLlBJQQUAJAaUEREgQAvhMYEyBjbCpj0g5/hQADQMiNw315VBQ+6puwaRxK565x8zLNf89wehNppQAFxKuz+H6HJ7PIYXUT3R0wmfix2zklql9MXZUzry3X5hm5Vj9EgghsWPfGUyfNBKUkt7oCQFBr+CMCzAuwYUAFxKjCyyiKPT+rCxGQFk2YUx03nvLqy2F9h+gprY4PtjU5MRsQ7/vrkL1MpwQkgVzLsEYB2MCjAscOnGJQ6IlC1cVuvLVJVVZcMuR8/hkc3Nn69GkPbE0xle/VK2qKh2wG8YFfCbgMQG/L/qmtrisbzh5KeOyuixcoeTYZ9/tz9VUKhv2dwjO5dGutPd3SWGkZs3yGZau9afG8zg8xnsdMAHOBTxf4PeWs/Lb+iMXejw+FcB5ACB9NjaA2X2XTwOAkphtbP38rUcidrhf//hFByvWbHdrHy0PTJqQj1TGR2fKxdc/H3Ib2xIn0xl/JoDTV1+5nQC+uVyQYVPb/U7dtAHgxr/ieO2jHemApqB8bDTQ7Xhwenys3dTkJC6mf0pn/EUA3Ove55Rg/uQ7RtgTS4dlk7Z+S6u7ZdvRc4yLjtq55ZN7PA6nh+G3xlMynkw3dTv+giE1CzsceLxm8mgLAPYdTGD1ht1d3Y7/fcrx37TDgb2VZfk07fjoSKbxw/bjKaeHPT3kvqartDZmG11R2+jMsQKNAKb2Fpjy/hOzxvkfvvKAfHfZdDmuyE6pCll6PRa5xv8RALoBpK+o3uSqJVVRVaHYtueUv6vl7B9OhlXfTA89d9X37dGIoRIQ7D0Qlzv/PJPMuHzurXoF1JQW2emZVUUsGFDjAEpu5fsmJxzUfo2E9I0AcvF/GP8A+yv0jSEPByoAAAAASUVORK5CYII="

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

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAtCAYAAABbAsDYAAAFWklEQVRYw82Xv28cRRTHPzN7tu/OPjtB/pVESmILCBI9KUIPEhIUiAJEgUARgn8goqAChFIlSDR0KWhAkShpACFA/BDBKBGBJDgOdn6YxPY58TnJ+W7nPYqd2du72zU/ggQrjWY1Nzefee/73ptZ+I+eGvDYv7lgKWfsReDY4y9/9FZlZPyzqDT0zcmjjzTvBWJyxt6NBquvPH74pC0NVigNlF1psDpvo8E5Y6NTpYHyFzYamDtxZJfciyUz1doUJuBNFIE5ABwwNnpWVQEaLxxdPgN8JeK+tjb6+sSRXat/HWKiB6qj0xZjMMYmQ8aAMRgIYzXgkKoeQhUXb/H8Gxcvqco3Km7u7Jfv1U9/evwQ6GFAS33uU7e3MjqVejJYZHI923kUZlR1RlWfc/EWoAq8CrRsz9xpYKg6OoUxBmNtAjOh2Q6VsA54F6bP5tplMNE1oAXQC5kFGB6dzlhifTO+Zf5iTGIDmgBVURUa64uKyoUwrRcyA1AZ2+UXM5mdm75gVJU+KwAa9SUBnd8OotXaZGpFCkgtMYWqKErcuk3r7s0IuFgIGazulKg01BVZxtjgvJ51tbsHGutXwutCEWS2WpuyWT26hTf5cRXEV2VzfSn8UGCJiR6sjk4nHkktsR1rMqJrJrI0tUbZrF/eFjKAuslKbdL7n0zIFuvQ7T1lc/0KYG4Bt/Ige4GoOjrZlYjGvwSLspGVgjQRHWCzvgTwaxZue3OkOrbLl5GOHoV2pIJ3+kZ90YEWQvYDVLtKSlb4Hj00k4ReE3GOOxu/22xk9UJmMJGWhye6i6LXZLvapR54++ZVUDHAfBFkX3l4pxjbEdtk+77w1U5kpaIv9eVIH6RSm7Kh4qbh2gWkL/m6ala9P0e6ISaardQmjMlW2rQ42kIXpQVFhc31y/jKu5wHGUDdVGVk0u/a+qgyBRpIV0SpOFChsbYI2HlA8iB7AFupjWOs6TqkiiwJrlIR8DnTWLvkQH7pnRb+vQ+gXMtaYnNrVXBTEF1RRAXXbrF585oFLmwLqdYmUoFNeqaHE7JIdEkK462roM70ZnsfJGjSEb47CYPInSxXRFwSWWu/hSmFluwdLI9KVBrKnCHFhTFkvLjY6+LYXFv8U8i+8siEyeZFyI0+0dMSL6i6NNKSRDQbwEo+xET3V2oThowebGuJIOKSd3GoKo36kgLn8+Zbf9faUwmRhcmpXX5x8fnhxQ56JJosCui5IsgkMFgZmei4xzeTe0PRdOGknCSXh+btVZsXWQGyF6A8Mp45P7w11ua6SkV877weV8MtoxCShG9t0kuSBXVX31CjghWhpGyspJX9pyJIDaA0UM7kRP7tRCUGD8m2jdUFgDgvfAPkNMDq1TOIa/tFXGe3IWQluS12apWmgXBrdQGwC+HumweZAzt/5dwnKq6Nc1tI3Eqaa+HiLVzcwsXNdExUEBcnmxHHxsqCgPxYdHJ6/8jbGysXzcrSHOJixLURiXGunUDaTeJ2kzhuJsB2Exc3cXGbOxs3uNu47je7LYT3wS5f/OFDVYkRSUCuvYW4drJ4u9lZvH2X2L/fWPw+rPVlESTyvQO927y99sTw2G5q9+33OUOa1eJaCThOenExNxa/58xn74i4+Dzo672HVd6HaQnM3EC59vCjzxy3wzt2Y6MBrI3AWMS1UYkR56gvn2X+1Ae6snTKgP0Z5Mnec327r9+HwPw4Oj47dPCpN81QZQxjI1rNBvVrP7F65TTXF751dzaWIzA3QY8Cx4Ctv/vZ/TTQLg2OuB2TB3R4bLfzblDgDpiPgZdCfv3T73iAg8BrwDCw5jP5c+A7oM3/8fkDPNL/4zGdiZIAAAAASUVORK5CYII="

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFLklEQVRo3s2ay3LbNhSGvwNCN8uxYmfsOM00afMwXXfdme6666v0LTp9iG77DOk02bZNU8d2GsuWJVIiTheEJJCyaFKmFWMGQxIkgf/854IDkAJ8CfwA/Au8C44nwIz6pQccAcfAoa/HwAXwFvgD+KdGfx3ghcf5Anjpjy+A34CfgLEA3wC/3tCBGjhXeK/wpxfsb+ADYAKARwJPBZ4pHGkmSGkRuALeKPwOvPEVD/KlB/1S4CvNxsmVrpF014qeJc4KvFP4VoDvgF9+/PoRHSMMZ47h1DGcOS5nysXUcTlz7tPUuatUTaoYgEhw/UjcnjXyyJqob4VH1tC3Qt9k57vW0I+EvhWuU+UkTjlNHGdJyskk5UOczi5makOQLSEdtIzut40dWMOgZRhYw14rq49bhrYRAN5eTvn5ryuA761nlsOOYScyHBPdRKLxlbGXpBPJok21oEpWr/tWeGUNr/q5Z2zilI+JA2DQMnQjiW7rS/3JoGXmzbEF9ry6qjlAlD1XBXzZ9UIDRnjajaq9p/m22RJEbIEYIFUok6Uu8Lu0FcGvIyFd3phYYAwwdUqrIEkZ+HWd1wZ6C+tlfU2XF/FSEG2O9U3Aa4k5r3t3VhBkApCkCnZzW6+iMa3I+m19LQRxuqqRRIOIcE+sN9bXqo/EOR/Rmqw3aTKbmHExanmN6EaOWsdktAEthO1JIWqdA1wHetqWyWxkxsF48dJHLixwBjBKy01L79HW64APS5wlBA4YzQXRUepEt+SolfxGb9Jgfp5LUkVgpKAWSARG1zPd3TQ8NmHv68Ysgg+fiVURuFTA+rT6fJSyWxZlmjKZKpougl+HKc7c4YJF9gon1zO3NtPUG661wv2VfvyJzuvinuQqa/optvu57xNzjSicXDlNFaJtOWqZyVSdbyZOnV95Ml/UnI38fN+UozYFvOw6dqrAMCfI2GH0gbBeM0WJQ0FOU8UkQSrfFPhGg0eh0YqI3+xYagRgNFMGbXlQrKuu78uTnhPkFGDklEGDrG+Uomj1flqCAXZCQaZzm9MKM+o2WS+7tiII9DUQ5AlAz0gwJ9w9PDYNfEWQzLRyGnkiIvQiqWQ222S97NoaVjUioG0jct8m0xQxABGrzn7QNuJElptjGw2oDZJQgVBrQKGbM63QPz6HyVT2Qc07+4pGer71vljfKLW/ZX8tElBoEaTxR73IrE9Rtsx6ccx17yQOBMbheuSwG4beB8R6WVuSLayGGqTx+71IKkWZ+2K9fqYtJC6/HhGFfjvY92185+MOrJelRUm2F7cQxAAihZXeQ2G97Fm/HskJgkj9VKNp8HWzisSRWyFGmcPLVh21Kngt3WlUwhXiQiObTEp3BV8r8hVuTB0m1Iip5OR6l1C7Oevore+lBdPanq1X3e+67d1eJG6SfSIPNCIPg/U6c9dOJOY/eJb3kS04alXWq85dO5ERgee6LvxWBV4LfAOfs4ttvUgQ+EJDH+GG8Pu5TKbq3NWNBAf7gF0xrTuZzD2wXtbuf14Q4CgnSLiBzAMFnxNkmR8+W5jW+zilG03pR4YdK/Qisxa4Q4lTZexg4hzjFCapY+KUSZq1TVIYO6czhZZA1xhpG6FjoGOEjhHakT8aoe2Hm+90zpPYtoD42XrqlMTNj8pw+aH9eL5CnLz+eN19/ZE7F4GhZL9HnWr2S9QY6AscCBwA+wp7mv2H1VQ5Dp3hAHhO9kPXczInKvO1c1/PgvPz+UxboXT8GI993fXWsefvz8cfBNnHyGe7xXr6P+gDiXwOJAZ0AAAAAElFTkSuQmCC"

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAATCAYAAAATSBSOAAAC6UlEQVRIx+WWv4sUSRTHP6+q5/fsrO64u6z4A/ZkFVnl4NTjQEQRNBAzUQw0MRAuMBEM/UcMjU0EE/NdAzU48TgOVITjOI4LbnTdHzNdVc+gu2bbcVZXHBGxoajX1VD96fd931cN39k1BpwexUbJF4C7LnDz7I+Nh87zZ8/pb2nQBed5tPBs1X3KRjJisGmB33dOJO2LP7feeeC8srQWum+6vrPS1X9WnT7rOX2ael3spiw+fLm2nGd8EVgaNdxegbvGMHf5lxZTreGi+KD4AEHjDL000Fn17s7jZatwC7gKYEYAVQJuCDwpJzJ37qexDcFUFVVQyGbN1xDqFZvsmSoJcAXYBmA/A8oCZ4xwT+H83HTJnjs0xnRr4zJWBZ8DhRwyKHhVnIeSFV78lxrgKfBkM4aoA3OFsU/gALBPodysGE7N1/lhsvzBTSJQhCyuhZDFW+oGa1AfOALcHgY3C5wAjgscVdhdrM1KIky1LDPjCTu2JsxOlrDm46WrceTShlzWELJsxvuxqpHOSpgfbCUngZvAMYBGRXSyaWWqldBuWCaahnbDUit/epmqap6dImSM12GDQr0sdFaYLcIdAe43K5iDO6rs316m3UxG3Wb6JsjqLZPUhyhvBlm2QjREhLtkBblwuEWtbEis4INuSq7NXGEASAuSrpskM4aI9Lki3EyjKoIIzsdqFWBjQI1VXagpcqneKfpCb4v9zQUIQUk99LzivJL6zLGhsG+Ee760qqx0A5WSkASwRkmCkBjFiPRfGil0QK5hgDFrg403G4oLSs+By2Pns2eDcA8U+Ot/x/bxhMRmGbMmmyPghlD6vjPjevEkCEEzZ+ZwaQ7kfBb7QFSuVzy+KsDfW2rS3jVRQgwYEYyAEaiWTD+OL7aGTPKBTBVBtdjLdB02GiHty5lJ7ILy7yvHmuMPYH/xg38FQrElfaXxCrg27OCfAWoDawYYH+KJGlD9TCN3gWWgA7wG3gBr38Rf61szUdrcfhAs5gAAAABJRU5ErkJggg=="

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "dist/png/stairs.png?0656602253580fb1d7a445eef6a49625";

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var thing = __webpack_require__(69);
	
	function createThing(world, param) {
	    return thing.createThing(world, param);
	}
	
	// function join(world, thingA, thingB, param) {
	//     thing.join(world, thingA, thingB, param);
	// }
	
	module.exports = {
	    createFloor1: function(world, offx, offy) {
	        return [createThing(world, {
	            position: [offx, offy],
	            polygon: [[0, 0], [50, 0], [50, 50], [0, 50]],
	            image: 'floor1',
	            offset: [25, 25]
	        })];
	    },
	    createFloor4: function(world, offx, offy) {
	        return [createThing(world, {
	            position: [offx, offy],
	            polygon: [[0, 0], [200, 0], [200, 50], [0, 50]],
	            image: 'floor4',
	            offset: [100, 25]
	        })];
	    },
	    createFloor9: function(world, offx, offy) {
	        return [createThing(world, {
	            position: [offx, offy],
	            polygon: [[0, 0], [450, 0], [450, 50], [0, 50]],
	            image: 'floor9',
	            offset: [225, 25]
	        })];
	    },
	    createFloor15: function(world, offx, offy) {
	        return [createThing(world, {
	            position: [offx, offy],
	            polygon: [[0, 0], [750, 0], [750, 50], [0, 50]],
	            image: 'floor15',
	            offset: [375, 25]
	        })];
	    },
	    createWall5: function(world, offx, offy) {
	        return [createThing(world, {
	            position: [offx + 10, offy - 1],
	            polygon: [[0, 0], [26, 0], [26, 250], [0, 250]],
	            image: 'wall5',
	            offset: [13, 125]
	        })];
	    },
	    createWall3: function(world, offx, offy) {
	        return [createThing(world, {
	            position: [offx + 10, offy - 1],
	            polygon: [[0, 0], [26, 0], [26, 150], [0, 150]],
	            image: 'wall3',
	            offset: [13, 75]
	        })];
	    },
	    createStairs: function(world, offx, offy, flip) {
	        return [createThing(world, {
	            position: [offx, offy + -503],
	            polygon: [[0, 500], [50, 500], [50, 450], [100, 450], [100, 400], [150, 400], [150, 350], [200, 350], [200, 300], [250, 300], [250, 250], [300, 250],
	                [300, 200], [350, 200], [350, 150], [400, 150], [400, 100], [450, 100], [450, 50], [500, 50], [500, 0], [550, 0],
	                [550, 50], [50, 550], [0, 550]],
	            image: 'stairs',
	            offset: [280, 280],
	            flip: flip
	        })];
	    },
	    createBed: function(world, offx, offy, flip) {
	        return [createThing(world, {
	            //mass: 100,
	            position: [offx, offy],
	            polygon: [[0, 0], [0, -105], [13, -105], [13, -76], [283, -76], [283, -79], [292, -79], [292, 0], [283, 0], [283, -31], [9, -31], [9, 0]],
	            image: 'bed',
	            offset: [145, 50],
	            flip: flip
	        })];
	    },
	    createPillow: function(world, offx, offy, flip) {
	        return [createThing(world, {
	            mass: 1,
	            position: [offx, offy],
	            polygon: [[3, -15], [46, -15], [47, -8], [46, -4], [3, -4], [2, -8]],
	            image: 'pillow',
	            offset: [25, 8],
	            flip: flip
	        })];
	    },
	    createBall: function(world, offx, offy, flip) {
	        return [createThing(world, {
	            mass: 1,
	            material: thing.bouncyMaterial,
	            position: [offx, offy],
	            circle: [22],
	            image: 'ball',
	            offset: [25, 25],
	            flip: flip
	        })];
	    },
	    createRedBlock: function(world, offx, offy) {
	        return [createThing(world, {
	            position: [offx + 25, offy + 25],
	            polygon: [[-25, -25], [25, -25], [25, 25], [-25, 25]],
	            image: 'redblock',
	            offset: [25, 25]
	        })];
	    }
	};


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

	module.exports = "data:image/png;base64,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"

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAEkCAYAAABtx2KDAAAXOElEQVR42u1dzY8dV1b/nVPvo7ttt+3Eju1M23EyaBRCEBPGEho2I7HhHwCEWLBgBRLiD2AFGyTEHrFCYs0WELvZICHEJJpRMmRCJrGdiceJv7rdr93d76PuYXHvrbr31q336stVHYkndb/Xr9+ruuee8zvnd849dYtQ/iAAgmEfuwBGAC6Z5wsAtgBsA5gB+C93sACwA+CfCPiBAFcDaU5BWAA4JWAOYC7AoQieAXhuDmh/DgEcOBNgB7ALYALgnDnX1LyXEOEKAWP7GQG2RbAN/d6mxz8D+EMAamTe+HMAv/fu3nlcOjcGk/fhrcVKtlIluwCwUoL5UmG+VDhepOnpUsl8pbBYKVqmksTONk4oZSJsjVmIQNuTBEzg7XFCRMDWmEH6/2ACpmNGwoRJwkgSwiQhjBLCOGHzTPj80Ql++PGz3wfwYwB/YwV5+/w0Wf3Rb78+qqn6wsBPFmn2ejLSA4p9ru3jV66dw8HxEj++P/trAf6Nzfuz+UpRFyfYniTZT8L0UgH0u79+BaJN93esBj5ZppI8P17i4s641sFOFilWSrBcKcxXYkwvxTIVrFLB6VIhNea4SPXrk4V+XqwUFiuBEsGf/GCvtiDLNPNFj60g/wEAnz86wXu3i4L8588P8P7d5zhdKqxSM4BUIVXNZnI6ZoyYMB0xxsb+lRJwTQ0ezTMz/toK8hER9j97fHz5vdu7hS9sjRnb4wSXdsZIWIPSDmBrrE1oOiKMR3qA25McrBMz6K0xZ4Dt6nGcC5JpRIng3z9+cPQH6o4kTP7MvPfGLt57Yxdn7XF0urIvH7nT83CRCoVCnOWHMS0B8NgV5I1LOyPBN+jxYp6CCDMAC3Yi+O1Xzo2Tb5IgR6cpCHgMQx+0IITbl2q63rKHiJhjUvbaoz0l71s7IecZDt+h4PXsdClK8NAVZEsJXtndTqInkICYVbU/UeJ/yYykTIjwfCo4rwo+MztJFYBHriA3AdClnRHWnUNF6PFGwaTk9VqNAq7PEed9HyMrCQW5BQAXt8eVzmUPWN0zSOXsIFOcFC3B/YwSwclSkqggu9ujymqvD5zgRUQeKcFK7P/Hp6k9yuNQELmwPSKR+nPcTjBfy0SAkvy57FwOPfE0cmU6IpUwJVLDhuUlRB17TCUCAkFKpuyFQ09cQSYJU8GqBPpgsb+1DQs2+tAWDwUpdSiLVeZ6ZqEgJa5XgrFJtfFJN5oR+NrPX2cTzJ4gzOvPLUaSgmssnKB4nDDA1VWaO7/ZaxIvSx3lWSmTkoqzJJtOJiAib9BiZsD+z/27pbPwNZKQTy+6oineeUUyocgAei3G1tEKKjGtJCFSnmFuOHgFuwg5kgSva2Gs/AuBIMwsm+hERbrhaoOIvJmXDaSxtjcIBJmOqDuzCoUKFRw1KalH4hwIcvYLwNQm/lL2Izn/ib4u+VHmAMr5iX627Fzm5/7TE/ztv97F/acnZmLiGJkmDiWobLuyWfNE+eDcmayufD1say0iYjweiu6XgCknFDnBOoRXZ7G+5yoeyY1NocCuedr/K1mDEQ5AmZ+gqAKR/PU6zrXOX8iaOFSI7M4XpACkWGSPnNk1N6owgEo5a824J0EwVr738AQZMahgBuE4VCWn4ua0lNuSdzTZjKuACqmQJcQiu+h1igIdlIhWXCJXrhFZ4xlko/Lc2S+LzWUBkaJ2uSa4V/ZwVI0VyBotq1C4NabFiJhWbCyqbqqRuSqKIXZ90cFJ4AruF4iyXy/3iALOofHN4n+1b4Xm5AZGF/xl7FcjRDYke1KDSVQLN2sjlGdBjiTrTItK84ySZyr5H8XMpSSxitF8EDkFF4EY28oz1YJpFQVRJf5QiIKKjjlsJBquYzCqqm3FxlDdtNaw35rvh5Qj5q7rVmGUCrwWappWPWrnMwKK1OXKyp+he1wuFR4ezvHwYI6H+3M8mi08jExGbL/1rcBrUTloy2JBYD/rkjpluZktJ0XO9uhgjntPTvHLgzkezxaZZq9emOA3bl7AjUtTXN2dQCAYjwiXdkZycLz6viuIqKJ/rhaoaxSjsS5PB/CLZ3N8+OUM1y5OcefNXXzr8hZePTcuLJLaQ1y9MOGD49VvuTR+nio510WCWAigkWMWTM6M853Xz+PdvfMYj/zalJQUIC7ujADgVQBTq5GTVRoou6wQFdHGMlU4XqSYJIztSVJY39hYiDQjnYwZfjwLBhHM9HSULbhdsaTxaJGqCACDUwrh6HSFpy+WeHa0wP7REk+Olmp2mpIr5nTEamvM2Jkwb08Smo4ZW2PG1jjBzkQ/5++xE5vEKc0W+UYYW+d52XSZdT48O1p+56vnc7L1rcVK4cVC4XSR4mieYv/FUp4eLWWZCjvTdRfA+wB+AuDnAC4CuDZfqW/PV+rW8xOcB3AZukvoMuI9KbI11oJvjznZmiR6TT7SPLBSgsVKsEwV9l8s09lpmgD4AMAj++k/BfD3JaQX0O1MP4XuxPmJ+fkIwALArwH4LoD3zPNvAjgfjgGExxB8CWAfuh3qBEBqJmQE3fr0GgE3AFwR3RYVYmsOYCZ6PPeNEP/gCgLjj7/jzJoC8BWAewCOzXvfA/B9AN8F4Q4E78Dpq9q9dE5uvnmdbr51A6/ffA2nJwsc7B/i4MkMhwczPHs6w+H+TB0dHnO8xEMzEH4pSn4I4M/qOJm63QE/MsLgyvXLsvfGNdq7fR17t6/j1ls3sHv5PJgJzAwQ9LMXnRUgwHy+wOzgBfafHuL5sxn2n81wuH+Ig6czfPjBpzg9nr8P4E6dgdXtz8K111/FX/zVH2NnZ0rEDCKAST8TkS5em9dM+UKNjin67+l0gslrY1x6dTdzKqtUASL4u7/8Rzy4/3Vtt19bkNF4hO3taVZtJxCIyQgBkNVIpnLzOSatEWfBKEkYSmlRmUi764YdJLUF0bOtWR8TgY0QnAmjR8JaRV5k16/1Z5RSIBCYNSEk0gtt1FASbiAHrEkRUcZBiMhogzIhXOH0D2fass+ZZpnA1LwFqsE3HZMywiQJZ7iwUx8K4VYPbQcSJ1ao9h1JoyZfItInJ4uFfPzGXKhQ9tTmlCOE7SsmQAFJwkgl7REjgGcCduYzYLsacEAvSmXvZ003FiMAJI1Q5T7A7uHEmkdmUigC3XgoW0pWKudz1vyYm0K9qWnZ+JEFPg1ka3IhRmwtikxhwSpKa4YhoqIB9KUKQplJaSGShDPgJw54vVhCucu1HNdqUymlAyflcaY3r6Vn3fdSLi5sdM8+Y16zY47EudvONMjUGCcNBBFvlnVsoGxAGW7EumjSoKY8fmRmFzgK6hfsfvR2lOII5POvvARkuJf4SweaqiiQ9A52N1aQH+GZvGDpmg+JZr9gnSToxSWCONmp9CkI28FagYyNM3NGBnPt+d/TBTaCYgUooxkTECHSWCPc1Gt5AA/ou6s1l6J430H+P3YE79Fr5TSEE/Y8TkZPKCSLlHks+3mf2pAXg/oDO/vacOOF67lCL6T/1ghnMdyLEDXDXjDi2rxLwS3mmdkT1kZxZu2dbJS3K8kC0xbFPQuSGJOyVHydSYVCMLOmLCQ6O0wVmBjCohOsPsEukscMN5B5/IvIBvT8degQyNdqv6ZFRgsekK0L9k2Kgi4Eco8BY2ZkuitUYUmtH4zks+vnJWRn3/FSVhYTB7OmGP15yXq4koT7xYgljRrgjhcL3GmY4ooAbIK7Qk4qdRxRSNPmKuEmMYTcVJbIKyTk1ZNYzk7B53z3rZlBz6bFxKCAyboloDzoUZYFimhQ25VeZoZQXsBTqwFydhszvIDoZY4+NdGdpU4sAYGcJS03MeuHong5e86VshIPs0PpfWfgZ4zIHQO1y0ValIMcMFMe8PKYEBTfCJ47JsOAU1HaxIwmlJJ+BYmB2a3/omSWbXnUdCmC2fAtEa+k2h/7dfLunNmav41mCiXRQDtwgiln5VZuHN0baCSP4PDIK3lCWrxYsxOnfmWXSZX91QFGuIk2/OKDjsghdbdgd5/DArafceZY6TVnt8UHtkKwL4zrenO+lV+pkNF4IqSrNPNgA3gtctXjca1CpmedgMoBH5aX2l7r1Jw0hiUgV0jHFbuJlR/lxa8bQxchegM7kWtS5DHfvJKIaJqrEyqGKIFInnQRMxgKqtcCHfJ1EVuAsJ7Jj/jlNRgxmlRKfCrP1DiOtMtHXNbq/a2Fdc3Hcq2MXjHrgp35vhWq13JQkrA2LYdvWQrCTnxx0123WJ2dPGKePXstTSs44UwbOUmkvCLvo13jhAgsyJYQ3KSLmPpdnvaWDwr8y9FAVq2Av+DDhIQ4I4k2QKZpj+sj5JiQaxbu0oKtpJBbUXS6Idhb0mafw/XqtSifYVvjcrNE/X5ScAoi4lzyoGMKM5n4YSeG+sSIk0QFsSMvCRUgol2uIYpEBEoIohQUM6BSr4DRq/sNAc5eXkIlZBMQkkxz4uT4q5Xq0Ws5xFBEwMTRNLaMaxCJP/MOve/V/ZIX9CiiDT+eFFpwDR0RIqhUeQS093JQDOBhz0ls2SGPHZRXG7PPt+tJabWs4NEPIi8YxszEZopK2aYBU3Qw31ct6G+rrZU8s2mRFXG4BNenIGHnTx0NUnBdcGnjf18aCbt9qgpWdpV2m/oDNzer8vrVpquwvcTL9cQtCnTdbT/WUiNtt/VqjZHI5XTlOzV5FcWIcH0nVmXAdGte6zHlR9gutgPgLsyoVZWwo00NXgpG6rjuMOts6oM7wUidWFJG3kQcrtKXIG4P1ibcrPNoRAN7Lc2tSgZWg9a4guty0GCRvWyAUkmbbmZbpuWeSGOzgBg2EtS2zy4x0vrhmKcXVHsDe5XZroIRqxHJ8/9+NdLyqssMCwG1abOi2wnYwzgiUo392ry/K3NtDfbCFQi0flAF06Li+4O63yghrOIopBuzbRwQW4M9NhG9t8tGu0frf1ekO0fSnsbXFKigTfKbovsTJMzPUW+ntBhGBk2s8tbw5q6TOtyJsEWqKwWNNMpNIr2PvUb2mEbK6lxlx5Fgn8N+2a8z2OJeLFIf7MgL2cNSlA6YsxKJ7tjRK9i7oAX2EicR9F98aCOcv6zt7zHXL9cqOVlVN+oSTFvvFXf3yd4EcXIJQr1qfFbQs7gIrkccBiNEWYN+VfdboOtSyAsGwEjJgDdX46WQmElLt9UZRuoAnZy2v7CLbjCvRTVBn2+qSiV7XVO/YA9P2oQBRwt8g2gk2Gm5bqB0c3avvbZ3jGxY0KkmTaDNsxDZm5hZXusaoq5lmy4but9YYkUtG5gbm1a066GiAHnsgNNthAEje6w2VddrtXNW3aW6GYOtSPhiZtfFnbM6WdWFNMtPbOFaXPY7VED0NUONzXOQi8UKA6agoNDUNQ8B9rKBbF52C1qdaDObPpM5u+t6Lb68pbe+I3vrRgGcgWp8WzpS9BlDUZQOvEx+PaKbcGF4sBPVs+/wnj7AAB10FLnpSt3GMe+CZOfmQ70XH6J9WjXt3C1iD8N+ndzbI4ANZ1NJ+xah1mBvmt35zIaGrsZT9PKkat/zgT5o50Os96rqGklmTVy/aNFbzl4rjpyF5kw3ItdaNvRWvaQRQ3gpiVUTs7Ck0auHDdUwEJvNJk0Dbhl1cIzUAXt4SR9RuwJ2Jxhpq0liGq5hILSCcBuRyifnvHAxiPvt6g6uBQZ8VnL2quOgFgtFL4FrNR9A7FZOg8eRkAXX0QiXbJM4aEC0/EkaMOC2FZROiw9tZta9Pe0AiVWRN9XjW0E8GYqidNH9xh1R+EFpvLsKMVhkD3dVHkqjHVCU7m7rTEzDCbLOa9WmJ9KAGrzMyN5ES9Swc+Klgr1OHGnTkt6ZIF57bEPcSHBZ0iCpblkLeV0TswVrdyueXjGy7i6Ttcww3CUtv8tpfxrp0rQKHoRoWI20IY2ZYH1jxBWqaWIk4ucyvbdwUEkdy81LmuQyvVfjXYxIQ49VvFKOhmuqgbPTZdtK47CRfcMGFVW+38WydCdeq1VJJ9g9c7iGAXeDloYYOTOkMbuxdk0qH6vGD1oOIsQKEPXZ75lIrJr08YWbTQ62rOCvMtWfaVu9V0qy6N47+5UN7rdO8SJ2u4L+KQpRwbTqXppU2LljKNOqu0FYWcGCiTYG2t5y9jZFB+V6uz67g/z+k/qlHOpqyWto95tf0SO18dWL+601GG9n/4E04l+p5g+s8mQEW4kM0i4b9f11S6ZBMBzm0qSOaPzgplWMB/UxUmw4OEP9WrWueFPdeaz2NL7mjpkxlRSof/+b6VG7cwfNAoPtHVS2dU4TsJ+ZxdAmGuk6SRwO7M6KrgzZwNxV/t0F0DsRpE3dtrAz7VnQSOwKhmqOItDIkO63rlW4bU4SsuAh3W9TvIgMuIZYNuiqY8gGbbBla1wiAlFqmKve3Dyi6vlDRlC42xj1fNO6KE9q7TDOypWhbTLNIUljl8FwkOKDSHyb9SYP9w4Yg3Cttn3xcG6PMxhpLN1lvHGqTMPuZdpKk4HHG6QcFPYz1o/oUgiQZ6IcVLehJhzwgAW6dsC3RWylVFGr/Vbjy0HbpIrSOm9uo5HYrrJ1r6+KBtXeaXxBiGZud3iKEtNSxYaa2AWVg2mkC37URdGhnSDOtoZNhMkTK//u4f1niBXvyVP5cDZL7D1DjNwarXYciSwSEXP/myBRW9Nao5lB61pNInsX12d1Jkj9NlkpFOgGjSPSowZ7CYh1zcJlv0QUudljzxtOShDea4M+yENcJty71wqbzqqSRtf9ure2lSGK2Na+ChdFNnQWmUYGMS1phhGXolhB2lZTuBHKrWm18Vr2vryDlYPc7afaeNJCEXyIPeha5BBd9mi5j272aaywP2PjY/fitRr2/LoBMeYEegV7EN4bmxZ1VAPmrkyri+Ss38guzZljbE09WsgeIrI3iSHh7Tlc8thvQOzI0xTuJs48kEZautyuyqXtMUL1B75uu51+MUJhQlV9JssA3cVOte3vY1Vz689YN9EwHXTSDhNUuMtFNxshNTKttttKEQXZYgeaaaSRNo2Z7maTIXUfFOx1KTmtKbeeiV6UJqYV9mnJkD2NdTQSut8urj9sJUhTsIeruPZvkfa7y46agl0AkJjrCVF+/a37nO2KplS2+/IqTTNzayPLqKEdQczgctbKIIoXFNzgaYXIBDMXxKhUQSnVOEyNGigESgmYjFacW94LNuQUTjHOCgDYS13tklyPGslmMiGIEigoAAzmYqLkPttrc13zVGa5TSnVyms1E8QMnggQZoMVgZsbxczLToBSKtvQ2wW69IoRW0WH9TZ69ExcymbzCI4cByKZAFYbWkvSp2kBKtWgHY1Yz26qwAmvvS7RmpMYIZSSbN1QqXYXHTfGiIW5UgJm7T/D66b8raYJaWT5OVOWUkaYHr2Wu6+iNi+A2Hqu8hpWNvOAcbc+yPsFu8NclTLUgE18sBcTu88RFKtUeQNPjVBtbhLRyLSUUlllUEdoyko8buobDszFRkxTKrxjcB9gzwcAJCQebyqfALe5XzLBxLwvLYrhDTCiPY0CI0kc9yoU7C0XnwGLC19L7YpzLUgjjMfSJpamggS6lyRmTmF/lhckHXrSO0ayaz3sSqx1w1CeNqx23MBXxIuJIy1b1BuC3SxgknhX5SjlR/OHv3iML+4+xI29q7hx8yqSJIGIIDVey0neW5tYYxoPWMIIMAOPv9rHp/9zD//70X18+tN7+OSje+rF7DjjLcwkN26+hlvfvkF7t6/j1ls3sHf7Gm7sXcVoMvJMrB+wi+DJo318/smX+OxnX+Czj7/Azz68uzo6PHaP9RTA+wA+APAxgD2l5J0H979++8H9r38VwI57zFeuXkz33rye7N26hufPZs1qBjU//yMA3wtS3Cci8t/OwD8AcH/DOW8BeBvAO+b5bQDvAnjFfOZ9AHdepiD/AkCZwdqBP0B3jytGuF1zrv9/fGMf/wcFGOj8QJG8tQAAAABJRU5ErkJggg=="

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAADICAYAAACqNrLOAAAS3ElEQVR42u1dza8dyVX/narue+97tp89Y3sm43FmPIRMEAkiJiMNYROJDf8AIMQyK0CIPwHBBokdGxBb1qxB7LJBQiAGTUQgIJLMmDB28jy235v3cb+6zmFRXd3V1dV9u/ve19eRpqV2X993u7tOna/fOXWqCvj8+Pz4/Gg79BU8kwB8CcD7AG4BEACX+fXKDtry/hTAVwF8HcDD/PorAK4Hv8tAOIbgEYDHAD7Jz8cAfgzgSX6dj0XINwB8E8DXQfgGBF/NiQEA3Hr1hjz48pv0zrv3cf/BF3B5PsfJ88/w7PjUv/LZ6YWKNoboDITHwvIdAL9/lYT8a04MXrt3W97+0j1658v38c5X7uPnvnIfr965CVIEIoKIFFcAYMMQEZiMsV6v8eLTz/Ds+AQnz8/w7PgEpy/O8PzpKT78l//C/GLxAYD3+jQs6cvCe2+9hj/+iz/A4fUZKaWQJBpKKySpfZQiAqlq/4gArCwhSjGUVnj93m289sZtMDOM4YLQP/mjv8T//vBxb9HqTUg6SXD95iEIBJ1oJIkGKYLWVlq0VgCRLy4QEbAhMEtBqLACM4NM/hutYAwPVtqkv1IRFCnoREFrDa1VlSO5aIUHK0uIsAIZhjEGpAhKWYJMxlbQicYhBERI0lyctIZONHSioJQCEdU4UhBiuBAjIkswGwYrARlLPBsaSscAjhBs4z1u+LqinH74LRIBK4LJnKjlYkQE4lycCEVnjEQIIU0TKEVQuhQvS5zVE6U96yq2kcYwlKJCsZVSYJ0rumIott8P9W/JEM+jE205ozWSNCdElxwhpayp8g6lFNgwSDEMGWuec0V33FLKcnc0ZdfaikCSaiRpAkXWglkOxcXDGGOlzVgTzSIwZKBEYDKrI05/hhyDyHfODgCEudJwEWkVS3eWprmqf0OPQYTYxlTf7pS8TVkdkW3EDoV/amgPhG3p0sgqJ3YLhtU2N4vYf7o0KhS/kqjaUwexZStCKPfEXWx/O6eqOjQ6R6yyW45sYkq77mAwATsjhFR/ea+KmeVI+QwZj5Cw4duKVvVPI4pW2PDi/x0sVrwjasq+B6tVWKEOHo2oAwdpPKtV6dEipO1GeRMRFXNMI5rfUDyGODjaNoezC0J8mFI4uA7EtOmHiAxOfg1W9tB3bNO7PnShMQlxHPAbz1xirZiYUUTRfWOxF9EKOVJAiwCmb9IhH5rszWoRxWPz1t5tkL/KPTSyskspF5WGtJrXriIkI4pWlDAXNUYaHPY6oTtdo2GtSujb0DqnQ36PvzR+JIa1uiq7RIzHNnoygBBpbWir+e0uS2NYrboISYChGkFhiyxVsJaMKFpDY4+wv0PdkrGV3ffsncNU30wHRO8t1BURCEu/+DzyPe3IdG3vRwq4Iq25rWoM45I+VDMOo4NGP4tCLRirVUdazPX4WRTqpuCVxkq854mo8JV78+y9CKcOYHQsHfEhx67EYy+BlYjkyHdg5mV3wHcHVstzZuXZTaeoSbT2pewh6KumP/t1+zbiuROrZSsaVOi8u0PCeggwhtWSIDqst6l3zzaFzleNfrsmFxoRilRRwUsjWr2tFkU4sVfPHvEjXa0W9m+16joiImDmjVYrdz2xxNb+0W/Yhk1prUoMExkwGhFrUS8Fr/qaOmUhQUR70JHO4yLwBoP8Tihzrlvnf7fDWkHCgTYkFxp1ZAfWa5CyN9n8Xr5kGxu+S2WvRIkdMFPXkeARzW9JhDiTO4Azlfi+/nvag7J3Hy6jSD6rkhPegieDU6YVX7JFZ9S4N3bhWdizm4KqcOitUfxkREKKhgyw/2Fmce+g0XlkByvCwdGuEGePolUW8RfoF9WhuD6mu4EjI+e1PNgRS0gMy13RuCUcFWiOoSUcu6tt3On4SJ8ax27cGQFrVcBjLU6iTmWzAPbJkTji9SF928hueE9ztenIHKlBkA1j7U0jVOGjRg91UU2KdDK/MbHcQ4RIlV6NgcYmHaFdVghsS4hExtkJ/cdMQv0YXUcoFlN0EL9oHNKUJhqHI2WRWWGFusDziN/YZaH/AI7QxjrEro5ur6Ll60hbg/uFu3sAjV0VmzrVnVCU43vBWk1caSNu15NgdgpRtnGq/SqgdghRqhXlboS3EW500pE9KHuD+FB/mLErwLi1Q2z2F/0CKr9+GDSS1ZJIok0R2Yofb4i6Ty6rVmM/FkfCl3HPQGlXJR87gyhu2C0MlDbWCzjO7TNBR4FIKKWKavau/sGH/7XwmPZgtQCAma1oSb+siAObfngcmvFRrVZsxmfnWs3mF4xvtWLE9PHSoQXca3VQT2zysmAtxCFKD9B4FbH7DmpR6EqTClfMkS3ikZbk3TYit3Veqy3r3vqd5zIiRIxfLttHtMLaXwk9/RbB+5bpIDSWkm+avlRHCSNXPkgkjojPMew+9WLvyl7AC+Zec9yDqVb7N78FR7w1fzbO9nSeX+JZy71YrTDVWZQydZn5Rg3co71ZLa8mpWNpX0W0Av3a3yocHorcJB7RzOI+B0P9XnNL7XRJUDcNEFXulz0pe9Os0E4rcwRiODpEqeIjBCNY3cVlrw7R7zlmqdTC+6txSPd0406I6U+ItGRFOladdhk6uXpCKA65y9Uyu+jVVkTuVkeaPHkfjtAuhqp26RBrjdywTlAzehnbajXkeAsdaXGQlfn5nZZyu0pCOowbtgVc9VlAe5wZGq4fFGtpryGHKuG0d2Xvlg6Khb7bTQcf5kcCh9h3HbqXQ7QoxEfDVayi7PtIB21jaWrDCPue9dZlIDOWYXF+xP+bXdCYt+JIMkRH3JKGrmFueVsNBRYGM5AkGkKAXWi2nMcrbBcwZmPHVRwRzJVVCsazWiYzxZXZdjN7vWwM2+9Y7MLdRa/bjuB8zQjOTzdzbtRQ1+QcMIZr4sEixYrjfm/bxqLghCWCi3jfPWM00fIbrkjyteANoBUABQUGlMp7nYul1/115F3vi8eNLDO9aoa31xHYRYjttgxWFJweuEZpAKyUZXfZ4fni3qboeV+kSnHEeIQIC4QYDAVVyLaGGLu4PbNAgcHektLk+dLQShV6NHwsdCAhIjDMSIiseJCAiIt1r53qKXARSVUy71JV8GJhV2YMXSZ3kI4wM7TSMMyAsSvzs5ekM5mBKLLiFWxP4Kwc50bAZKY0DlssbzjIj5jMioFbXh0i+QrlVrSsUhOUACaTWtGyv5cCG4bJuWKMGU/ZBbk45KKgRQNJLjKJhjEZdGL3Z9HaEuH8gyPCNtpzjM4hcqHsNApHsnWGJE0gQuWi9YkGrzOoXG9IUb2izOMGF9wxBWEypvl1vQoy0Fogoqp+IhctEvLnFBfEGU+kSo5Ise/CqH6EmYHMNk4nuSywLd1glmLHC1bBmvJGCgvlE+B2u9gGaw3mCLNA67Jko1jBnw2Y7L4LxKhtMWAyY3seUoqUx5HxIApQbPKQSVZYLrs2it1PxJpShs6hig9PTK7QDto4HFZYLBnR/GZrA6UYOtEwOQYREYhSYGUdHillUQxV73UWyhctX9TGN78gICu36JC8kUTWCSowMmZQziGnK8WmQ8aUaNgjTkblSGagtRWbxMXtGvmOSQwIgY01V0pJFBlYv+GjXuQdNKL5ZYdS80REAiBjzhtOhXe3v6d6LBOKWO5cXTA2jkPMYbyIHXbLVhmQ2p2TbNmYgojVG6WoSogg8O6mtISZFTEIgYior64MNr8WxKp8uxoCseWGQPI5JgRhFLC+yA1zia0K55qLa2XxmDF0BOJMsN3SCfm2NMxue5oyU6042GEsh/EOqpQclnE9u8BiLXKOjoAk8fZIYLtDEuX6wpHycd9SAVJ6+FEhSu7UlIejMgBKSRl7mFzMlPImKVqrZrLc7LIpLFURHfKI5ne5WOHj//kEk2mK2cEM6UTj4HCG6WxiN+pSCkQCZipwl+PE/GyOi7MF5hdznJ8vsLiY4+J8gcuLBRaX9vrTT54OSxj2/H2x+17TMTuYSDpJkKQJHRxMcXm5lPnFAsvFquu7zgD8J4Bf3RUhsZV33wfwFoBr+XkdwE3v/0cAbuSfDwGc5OdpcI19dwrgRfC+o1xqbuXXGwBmAA5ygv85JOQQwN8Q8C0B7gbULEBYAVgQsASwFOAzETzPX37mnZ/ljXId4BpwBGDiETjNv9NEuEN2c8gjABMBDkRwAG/DyJbjbwH8DgB2OvKHAH7za/ev49a1FEG+YLbKZGZYjgAgY8FyzViuGZcrYxZrlmXGWGVMayPRPUhTTUYRYZYqIQIdTDQUQR2kmoiAWWqRwCxVUARMUwWtCBOtoDVhogmJJqRa5VfCj47n+M73n/8WgA8B/Jkj5BeuT3X2u792r6/y1xo+X5ni8ySxDcIVbLL6869fw8nlGh8+OvtTAf7eRT1ny4x3MuB9MNHFqdXVFjb/xi/dgVjR/XXHgf9eG9Gnl2vcPEx7PWy+MshYsM4Yy0xy0TNYG0FmBIs1w+TiuDL283xlr6uMscpsPuvb37rfm5C1KWzRU0fIPwLAj47nePigTsg//eAEH3x0isWakZm8AYYxNDKdpgqJIkwThTSXf9/ndD3Ol4UY/9QR8j0ivPjh08tXHj44qvuGVOEg1bh1mEIrq5SuAbPUitA0IaSJbeDBpFTWSd7oWaoKhd3VcVkSUnCERfAP3//k/Lf5PdEqGGx5+PYRHr59hJftOF9k7uOx3z1PVkZIvQQzD3qKlgB46hPy9q3DRPAzdFwsDYhwBmClPA/+4NVrqf5ZIuR8YUDA0wr6JcKDWz1N76bhuaY5IW1zRcQDebXFaIPPZ4u1sOCJT8iMBa8eHeh4IUwAzLrKn7BUbyJUpsK2BW9AOWpHwf/db87mhgEc+4R8EQDdOkxaAxtugM7SpVU9eqCWxPe+r+pIJiEhbwHAzYMUHXc668WZYNuU1jsLxkldEippWxHM16KjhBwdJJ3ZPihp4X+I0CMNuhL7++XCuKc8DQmRGwcJXeHGRq0P8MdSWMpr07s8eFLhyJ1pQqwVaekhw1cwL7J4JovNjzWlUC88eOITMtGqntxzybbY/60MCzba0C2OPFUe5coqYz/GrxDSYHolaFvHNLPshjOuaLUyjFdND6sKIUq1v9utLh4Z3wxeEFltNnBwfZkWrQMlqUSpSRmVKmLp2Euy6WXBXBJUy/38dR4HF5uVt1U5ojtuiNIXplTem1c2uGXVWTboWBusoAbR0pqIK4K54eEd5CLESBJ87qVjzTcEhCilZBOc6Ag3wopsDlZr3slCk+X9FUKmCV3N4kTFIhW+WY0qWT8Q50/zKv4BMC2SzU2n+Mt9Rj43nOzGU7wz+tumd+Xno2dz/PnffYRHz+Z5x8R1ZKo9SNBZdmUz591ENgm2DuzOfNvs2qZ4hLr5JWCqdGyThzYN745iq5ar/iTfN0lkr0SpFK45LjfoiAqUsnxBnQUi5ec2zNVmL6TFD9U8u3dDZA+yiGePvJmlPZIQ2cSSAaFl8BgJnDFXrUeFkESBamIQtoM7GRU/piV4G7ttdEAh3Kns2xuihJhnFztOUYODEuGKD+SaOSItlkE2Ms/v/Sbf3OQQKSqXLc69s4WjbqhAWrjMIXEtoqUQEa1YW7hvqFGYKoppbHvSwQvgWvYkraDfSuwRVTgPxg/z/12Xlw4YKFVsJl7fNIhWfPGiiiRIDyTRzd20eqiKBHmUtIkWNcYZDVdq+BvFxKUhsIrBfJT79FjYX1RySyE1gWjVCeEGeyhEQUZHyrnoLRv/yoYE38Zw0G9Dd9FqXzmjz/ch5IiZ675ZGDfNJDJFtpto9YN2VURAkbxcU/ozNI/rNePJZ0s8OVniyYsljs9WFR2ZJMrd9WZgtahZaZt8QSA/bUEdF7Xi1Gghj0+W+PjTBR6fLPH0bFVw9u6NCX75izfwxq0p7h5NIBCkCeHWYSInl9k3fUKE28q5ZVhCOrZGKbew/cfPl/j3/zvD6zeneO+dI7z5ygy3r6W1QVL3iLs3JurkMnvfh/FLw3JtFwFizYFGnlkTubydv3jvOr52/zrSRMUXeQ2k4OZhAgC3AUwdR+aZCZjdlIiKcGNtGJcrg4lWOJjo2vjGxkRk3tJJqlD1Z0Ejgp6eJsWA2x0HGs9XsZpbCV4phPNFhmcXazw/X+HF+Rqfnq/5bGH8TWZlmiiepQqHE6UOJpqmqcIsVZilGocTey2/U55vEi81W8cboW9dlmnTdVH58Px8/e5PTpfk8lurjHGxYixWBudLgxcXa3l2vpa1EeV110cAPgDwXQA/gC15em2Z8d1lxndO53idrFW5I8AriNekyCy1hB+kSs8m2o7JR4oHMhasMsHaMF5crM3ZwmgA/wbg2P369wD8FZrrt04B/AdsJc538/N7AC56qtBt2DKquwDuAPiC9/kOgDcIeCMnfBLRrSWAM7HteZQT8dc+Icjt8bterzGAnwD4GMAlXvLj/wEE65YSE2Dz/gAAAABJRU5ErkJggg=="

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

/***/ }
/******/ ]);
//# sourceMappingURL=dist.js.map