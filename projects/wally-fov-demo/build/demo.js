/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(10));
__export(__webpack_require__(9));
__export(__webpack_require__(13));
__export(__webpack_require__(15));
__export(__webpack_require__(14));
__export(__webpack_require__(12));
__export(__webpack_require__(11));
//# sourceMappingURL=index.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
*   EasyStar.js
*   github.com/prettymuchbryce/EasyStarJS
*   Licensed under the MIT license.
*
*   Implementation By Bryce Neal (@prettymuchbryce)
**/

var EasyStar = {}
var Instance = __webpack_require__(3);
var Node = __webpack_require__(4);
var Heap = __webpack_require__(5);

const CLOSED_LIST = 0;
const OPEN_LIST = 1;

module.exports = EasyStar;

var nextInstanceId = 1;

EasyStar.js = function() {
    var STRAIGHT_COST = 1.0;
    var DIAGONAL_COST = 1.4;
    var syncEnabled = false;
    var pointsToAvoid = {};
    var collisionGrid;
    var costMap = {};
    var pointsToCost = {};
    var directionalConditions = {};
    var allowCornerCutting = true;
    var iterationsSoFar;
    var instances = {};
    var instanceQueue = [];
    var iterationsPerCalculation = Number.MAX_VALUE;
    var acceptableTiles;
    var diagonalsEnabled = false;

    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array|Number} tiles An array of numbers that represent
    * which tiles in your grid should be considered
    * acceptable, or "walkable".
    **/
    this.setAcceptableTiles = function(tiles) {
        if (tiles instanceof Array) {
            // Array
            acceptableTiles = tiles;
        } else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
            // Number
            acceptableTiles = [tiles];
        }
    };

    /**
    * Enables sync mode for this EasyStar instance..
    * if you're into that sort of thing.
    **/
    this.enableSync = function() {
        syncEnabled = true;
    };

    /**
    * Disables sync mode for this EasyStar instance.
    **/
    this.disableSync = function() {
        syncEnabled = false;
    };

    /**
     * Enable diagonal pathfinding.
     */
    this.enableDiagonals = function() {
        diagonalsEnabled = true;
    }

    /**
     * Disable diagonal pathfinding.
     */
    this.disableDiagonals = function() {
        diagonalsEnabled = false;
    }

    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array} grid The collision grid that this EasyStar instance will read from.
    * This should be a 2D Array of Numbers.
    **/
    this.setGrid = function(grid) {
        collisionGrid = grid;

        //Setup cost map
        for (var y = 0; y < collisionGrid.length; y++) {
            for (var x = 0; x < collisionGrid[0].length; x++) {
                if (!costMap[collisionGrid[y][x]]) {
                    costMap[collisionGrid[y][x]] = 1
                }
            }
        }
    };

    /**
    * Sets the tile cost for a particular tile type.
    *
    * @param {Number} The tile type to set the cost for.
    * @param {Number} The multiplicative cost associated with the given tile.
    **/
    this.setTileCost = function(tileType, cost) {
        costMap[tileType] = cost;
    };

    /**
    * Sets the an additional cost for a particular point.
    * Overrides the cost from setTileCost.
    *
    * @param {Number} x The x value of the point to cost.
    * @param {Number} y The y value of the point to cost.
    * @param {Number} The multiplicative cost associated with the given point.
    **/
    this.setAdditionalPointCost = function(x, y, cost) {
        if (pointsToCost[y] === undefined) {
            pointsToCost[y] = {};
        }
        pointsToCost[y][x] = cost;
    };

    /**
    * Remove the additional cost for a particular point.
    *
    * @param {Number} x The x value of the point to stop costing.
    * @param {Number} y The y value of the point to stop costing.
    **/
    this.removeAdditionalPointCost = function(x, y) {
        if (pointsToCost[y] !== undefined) {
            delete pointsToCost[y][x];
        }
    }

    /**
    * Remove all additional point costs.
    **/
    this.removeAllAdditionalPointCosts = function() {
        pointsToCost = {};
    }

    /**
    * Sets a directional condition on a tile
    *
    * @param {Number} x The x value of the point.
    * @param {Number} y The y value of the point.
    * @param {Array.<String>} allowedDirections A list of all the allowed directions that can access
    * the tile.
    **/
    this.setDirectionalCondition = function(x, y, allowedDirections) {
        if (directionalConditions[y] === undefined) {
            directionalConditions[y] = {};
        }
        directionalConditions[y][x] = allowedDirections;
    };

    /**
    * Remove all directional conditions
    **/
    this.removeAllDirectionalConditions = function() {
        directionalConditions = {};
    };

    /**
    * Sets the number of search iterations per calculation.
    * A lower number provides a slower result, but more practical if you
    * have a large tile-map and don't want to block your thread while
    * finding a path.
    *
    * @param {Number} iterations The number of searches to prefrom per calculate() call.
    **/
    this.setIterationsPerCalculation = function(iterations) {
        iterationsPerCalculation = iterations;
    };

    /**
    * Avoid a particular point on the grid,
    * regardless of whether or not it is an acceptable tile.
    *
    * @param {Number} x The x value of the point to avoid.
    * @param {Number} y The y value of the point to avoid.
    **/
    this.avoidAdditionalPoint = function(x, y) {
        if (pointsToAvoid[y] === undefined) {
            pointsToAvoid[y] = {};
        }
        pointsToAvoid[y][x] = 1;
    };

    /**
    * Stop avoiding a particular point on the grid.
    *
    * @param {Number} x The x value of the point to stop avoiding.
    * @param {Number} y The y value of the point to stop avoiding.
    **/
    this.stopAvoidingAdditionalPoint = function(x, y) {
        if (pointsToAvoid[y] !== undefined) {
            delete pointsToAvoid[y][x];
        }
    };

    /**
    * Enables corner cutting in diagonal movement.
    **/
    this.enableCornerCutting = function() {
        allowCornerCutting = true;
    };

    /**
    * Disables corner cutting in diagonal movement.
    **/
    this.disableCornerCutting = function() {
        allowCornerCutting = false;
    };

    /**
    * Stop avoiding all additional points on the grid.
    **/
    this.stopAvoidingAllAdditionalPoints = function() {
        pointsToAvoid = {};
    };

    /**
    * Find a path.
    *
    * @param {Number} startX The X position of the starting point.
    * @param {Number} startY The Y position of the starting point.
    * @param {Number} endX The X position of the ending point.
    * @param {Number} endY The Y position of the ending point.
    * @param {Function} callback A function that is called when your path
    * is found, or no path is found.
    * @return {Number} A numeric, non-zero value which identifies the created instance. This value can be passed to cancelPath to cancel the path calculation.
    *
    **/
    this.findPath = function(startX, startY, endX, endY, callback) {
        // Wraps the callback for sync vs async logic
        var callbackWrapper = function(result) {
            if (syncEnabled) {
                callback(result);
            } else {
                setTimeout(function() {
                    callback(result);
                });
            }
        }

        // No acceptable tiles were set
        if (acceptableTiles === undefined) {
            throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
        }
        // No grid was set
        if (collisionGrid === undefined) {
            throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
        }

        // Start or endpoint outside of scope.
        if (startX < 0 || startY < 0 || endX < 0 || endY < 0 ||
        startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 ||
        endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
            throw new Error("Your start or end point is outside the scope of your grid.");
        }

        // Start and end are the same tile.
        if (startX===endX && startY===endY) {
            callbackWrapper([]);
            return;
        }

        // End point is not an acceptable tile.
        var endTile = collisionGrid[endY][endX];
        var isAcceptable = false;
        for (var i = 0; i < acceptableTiles.length; i++) {
            if (endTile === acceptableTiles[i]) {
                isAcceptable = true;
                break;
            }
        }

        if (isAcceptable === false) {
            callbackWrapper(null);
            return;
        }

        // Create the instance
        var instance = new Instance();
        instance.openList = new Heap(function(nodeA, nodeB) {
            return nodeA.bestGuessDistance() - nodeB.bestGuessDistance();
        });
        instance.isDoneCalculating = false;
        instance.nodeHash = {};
        instance.startX = startX;
        instance.startY = startY;
        instance.endX = endX;
        instance.endY = endY;
        instance.callback = callbackWrapper;

        instance.openList.push(coordinateToNode(instance, instance.startX,
            instance.startY, null, STRAIGHT_COST));

        var instanceId = nextInstanceId ++;
        instances[instanceId] = instance;
        instanceQueue.push(instanceId);
        return instanceId;
    };

    /**
     * Cancel a path calculation.
     *
     * @param {Number} instanceId The instance ID of the path being calculated
     * @return {Boolean} True if an instance was found and cancelled.
     *
     **/
    this.cancelPath = function(instanceId) {
        if (instanceId in instances) {
            delete instances[instanceId];
            // No need to remove it from instanceQueue
            return true;
        }
        return false;
    };

    /**
    * This method steps through the A* Algorithm in an attempt to
    * find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
    * You can change the number of calculations done in a call by using
    * easystar.setIteratonsPerCalculation().
    **/
    this.calculate = function() {
        if (instanceQueue.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
            return;
        }
        for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
            if (instanceQueue.length === 0) {
                return;
            }

            if (syncEnabled) {
                // If this is a sync instance, we want to make sure that it calculates synchronously.
                iterationsSoFar = 0;
            }

            var instanceId = instanceQueue[0];
            var instance = instances[instanceId];
            if (typeof instance == 'undefined') {
                // This instance was cancelled
                instanceQueue.shift();
                continue;
            }

            // Couldn't find a path.
            if (instance.openList.size() === 0) {
                instance.callback(null);
                delete instances[instanceId];
                instanceQueue.shift();
                continue;
            }

            var searchNode = instance.openList.pop();

            // Handles the case where we have found the destination
            if (instance.endX === searchNode.x && instance.endY === searchNode.y) {
                var path = [];
                path.push({x: searchNode.x, y: searchNode.y});
                var parent = searchNode.parent;
                while (parent!=null) {
                    path.push({x: parent.x, y:parent.y});
                    parent = parent.parent;
                }
                path.reverse();
                var ip = path;
                instance.callback(ip);
                delete instances[instanceId];
                instanceQueue.shift();
                continue;
            }

            searchNode.list = CLOSED_LIST;

            if (searchNode.y > 0) {
                checkAdjacentNode(instance, searchNode,
                    0, -1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y-1));
            }
            if (searchNode.x < collisionGrid[0].length-1) {
                checkAdjacentNode(instance, searchNode,
                    1, 0, STRAIGHT_COST * getTileCost(searchNode.x+1, searchNode.y));
            }
            if (searchNode.y < collisionGrid.length-1) {
                checkAdjacentNode(instance, searchNode,
                    0, 1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y+1));
            }
            if (searchNode.x > 0) {
                checkAdjacentNode(instance, searchNode,
                    -1, 0, STRAIGHT_COST * getTileCost(searchNode.x-1, searchNode.y));
            }
            if (diagonalsEnabled) {
                if (searchNode.x > 0 && searchNode.y > 0) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y))) {

                        checkAdjacentNode(instance, searchNode,
                            -1, -1, DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y-1));
                    }
                }
                if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y))) {

                        checkAdjacentNode(instance, searchNode,
                            1, 1, DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y+1));
                    }
                }
                if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y))) {

                        checkAdjacentNode(instance, searchNode,
                            1, -1, DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y-1));
                    }
                }
                if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y))) {

                        checkAdjacentNode(instance, searchNode,
                            -1, 1, DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y+1));
                    }
                }
            }

        }
    };

    // Private methods follow
    var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
        var adjacentCoordinateX = searchNode.x+x;
        var adjacentCoordinateY = searchNode.y+y;

        if ((pointsToAvoid[adjacentCoordinateY] === undefined ||
             pointsToAvoid[adjacentCoordinateY][adjacentCoordinateX] === undefined) &&
            isTileWalkable(collisionGrid, acceptableTiles, adjacentCoordinateX, adjacentCoordinateY, searchNode)) {
            var node = coordinateToNode(instance, adjacentCoordinateX,
                adjacentCoordinateY, searchNode, cost);

            if (node.list === undefined) {
                node.list = OPEN_LIST;
                instance.openList.push(node);
            } else if (searchNode.costSoFar + cost < node.costSoFar) {
                node.costSoFar = searchNode.costSoFar + cost;
                node.parent = searchNode;
                instance.openList.updateItem(node);
            }
        }
    };

    // Helpers
    var isTileWalkable = function(collisionGrid, acceptableTiles, x, y, sourceNode) {
        var directionalCondition = directionalConditions[y] && directionalConditions[y][x];
        if (directionalCondition) {
            var direction = calculateDirection(sourceNode.x - x, sourceNode.y - y)
            var directionIncluded = function () {
                for (var i = 0; i < directionalCondition.length; i++) {
                    if (directionalCondition[i] === direction) return true
                }
                return false
            }
            if (!directionIncluded()) return false
        }
        for (var i = 0; i < acceptableTiles.length; i++) {
            if (collisionGrid[y][x] === acceptableTiles[i]) {
                return true;
            }
        }

        return false;
    };

    /**
     * -1, -1 | 0, -1  | 1, -1
     * -1,  0 | SOURCE | 1,  0
     * -1,  1 | 0,  1  | 1,  1
     */
    var calculateDirection = function (diffX, diffY) {
        if (diffX === 0 && diffY === -1) return EasyStar.TOP
        else if (diffX === 1 && diffY === -1) return EasyStar.TOP_RIGHT
        else if (diffX === 1 && diffY === 0) return EasyStar.RIGHT
        else if (diffX === 1 && diffY === 1) return EasyStar.BOTTOM_RIGHT
        else if (diffX === 0 && diffY === 1) return EasyStar.BOTTOM
        else if (diffX === -1 && diffY === 1) return EasyStar.BOTTOM_LEFT
        else if (diffX === -1 && diffY === 0) return EasyStar.LEFT
        else if (diffX === -1 && diffY === -1) return EasyStar.TOP_LEFT
        throw new Error('These differences are not valid: ' + diffX + ', ' + diffY)
    };

    var getTileCost = function(x, y) {
        return (pointsToCost[y] && pointsToCost[y][x]) || costMap[collisionGrid[y][x]]
    };

    var coordinateToNode = function(instance, x, y, parent, cost) {
        if (instance.nodeHash[y] !== undefined) {
            if (instance.nodeHash[y][x] !== undefined) {
                return instance.nodeHash[y][x];
            }
        } else {
            instance.nodeHash[y] = {};
        }
        var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
        if (parent!==null) {
            var costSoFar = parent.costSoFar + cost;
        } else {
            costSoFar = 0;
        }
        var node = new Node(parent,x,y,costSoFar,simpleDistanceToTarget);
        instance.nodeHash[y][x] = node;
        return node;
    };

    var getDistance = function(x1,y1,x2,y2) {
        if (diagonalsEnabled) {
            // Octile distance
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            if (dx < dy) {
                return DIAGONAL_COST * dx + dy;
            } else {
                return DIAGONAL_COST * dy + dx;
            }
        } else {
            // Manhattan distance
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            return (dx + dy);
        }
    };
}

EasyStar.TOP = 'TOP'
EasyStar.TOP_RIGHT = 'TOP_RIGHT'
EasyStar.RIGHT = 'RIGHT'
EasyStar.BOTTOM_RIGHT = 'BOTTOM_RIGHT'
EasyStar.BOTTOM = 'BOTTOM'
EasyStar.BOTTOM_LEFT = 'BOTTOM_LEFT'
EasyStar.LEFT = 'LEFT'
EasyStar.TOP_LEFT = 'TOP_LEFT'


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 *  WallyFOV
 *  github.com/sbj42/WallyFOV
 *  James Clark
 *  Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var field_of_view_1 = __webpack_require__(8);
exports.FieldOfViewMap = field_of_view_1.FieldOfViewMap;
var geom_1 = __webpack_require__(0);
exports.Direction = geom_1.Direction;
exports.DirectionFlags = geom_1.DirectionFlags;
exports.MaskRect = geom_1.MaskRect;
//# sourceMappingURL=index.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
module.exports = function() {
    this.pointsToAvoid = {};
    this.startX;
    this.callback;
    this.startY;
    this.endX;
    this.endY;
    this.nodeHash = {};
    this.openList;
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
module.exports = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.costSoFar = costSoFar;
    this.simpleDistanceToTarget = simpleDistanceToTarget;

    /**
    * @return {Number} Best guess distance of a cost using this node.
    **/
    this.bestGuessDistance = function() {
        return this.costSoFar + this.simpleDistanceToTarget;
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (true) {
      return !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.Heap = factory();
    }
  })(this, function() {
    return Heap;
  });

}).call(this);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WallyFOV = __webpack_require__(2);
var EasyStar = __webpack_require__(1);
var demo = document.getElementById('canvas');
var context = demo.getContext('2d');
var width = 37;
var height = 19;
var tileImages = new Array(width * height);
function index(x, y) {
    return y * width + x;
}
var map;
var easystar;
function generateMap() {
    map = new WallyFOV.FieldOfViewMap(width, height);
    easystar = new EasyStar.js();
    var grid = new Array();
    for (var y = 0; y < height; y++) {
        grid.push(new Array(width).fill(0));
    }
    easystar.enableDiagonals();
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0]);
    easystar.enableSync();
    var turnChance = 0.1;
    for (var i = 0; i < 50; i++) {
        var x = Math.floor(Math.random() * (width - 2) + 1);
        var y = Math.floor(Math.random() * (height - 2) + 1);
        if (map.getWalls(x, y)) {
            continue;
        }
        var dir = Math.floor(Math.random() * 4);
        var len = Math.floor(Math.random() * 7 + 2);
        for (var j = 0; j < len; j++) {
            if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1)
                break;
            map.addWall(x, y, dir);
            var turn = Math.random();
            switch (dir) {
                case WallyFOV.Direction.NORTH:
                    if (turn < turnChance) {
                        dir = WallyFOV.Direction.WEST;
                        x++;
                        y--;
                    }
                    else if (turn > 1 - turnChance) {
                        dir = WallyFOV.Direction.EAST;
                    }
                    else {
                        x++;
                    }
                    break;
                case WallyFOV.Direction.EAST:
                    if (turn < turnChance) {
                        dir = WallyFOV.Direction.NORTH;
                        x++;
                        y++;
                    }
                    else if (turn > 1 - turnChance) {
                        dir = WallyFOV.Direction.SOUTH;
                    }
                    else {
                        y++;
                    }
                    break;
                case WallyFOV.Direction.SOUTH:
                    if (turn < turnChance) {
                        dir = WallyFOV.Direction.EAST;
                        x--;
                        y++;
                    }
                    else if (turn > 1 - turnChance) {
                        dir = WallyFOV.Direction.WEST;
                    }
                    else {
                        x--;
                    }
                    break;
                case WallyFOV.Direction.WEST:
                    if (turn < turnChance) {
                        dir = WallyFOV.Direction.SOUTH;
                        x--;
                        y--;
                    }
                    else if (turn > 1 - turnChance) {
                        dir = WallyFOV.Direction.NORTH;
                    }
                    else {
                        y--;
                    }
                    break;
            }
        }
    }
    var bodyChance = 0.08;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var walls = map.getWalls(x, y);
            if (walls === 0 && Math.random() < bodyChance) {
                map.addBody(x, y);
                grid[y][x] = 1;
            }
            else {
                var ok = [];
                if ((walls & WallyFOV.DirectionFlags.NORTH) === 0) {
                    ok.push(EasyStar.TOP);
                }
                if ((walls & WallyFOV.DirectionFlags.EAST) === 0) {
                    ok.push(EasyStar.RIGHT);
                }
                if ((walls & WallyFOV.DirectionFlags.SOUTH) === 0) {
                    ok.push(EasyStar.BOTTOM);
                }
                if ((walls & WallyFOV.DirectionFlags.WEST) === 0) {
                    ok.push(EasyStar.LEFT);
                }
                easystar.setDirectionalCondition(x, y, ok);
            }
        }
    }
}
function randomPlace() {
    var x;
    var y;
    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
    } while (map.getWalls(x, y) || map.getBody(x, y));
    return [x, y];
}
var px;
var py;
function start() {
    generateMap();
    _a = randomPlace(), px = _a[0], py = _a[1];
    tileImages.fill([]);
    var _loop_1 = function (y) {
        var _loop_2 = function (x) {
            var walls = map.getWalls(x, y);
            var images = tileImages[index(x, y)] = [];
            if (Math.random() > 0.3) {
                images.push('grass' + Math.floor(1 + Math.random() * 3));
            }
            if ((walls & WallyFOV.DirectionFlags.NORTH) !== 0) {
                images.push('north');
            }
            if ((walls & WallyFOV.DirectionFlags.EAST) !== 0) {
                images.push('east');
            }
            if ((walls & WallyFOV.DirectionFlags.SOUTH) !== 0) {
                images.push('south');
            }
            if ((walls & WallyFOV.DirectionFlags.WEST) !== 0) {
                images.push('west');
            }
            if (map.getBody(x, y)) {
                images.push('box');
            }
            images.forEach(function (image) {
                context.drawImage(tiles, imageOff[image] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            });
        };
        for (var x = 0; x < width; x++) {
            _loop_2(x);
        }
    };
    for (var y = 0; y < height; y++) {
        _loop_1(y);
    }
    var _a;
}
function render() {
    context.fillStyle = '#ddc';
    context.fillRect(0, 0, width * 32, height * 32);
    var _loop_3 = function (y) {
        var _loop_4 = function (x) {
            var images = tileImages[index(x, y)];
            images.forEach(function (image) {
                context.drawImage(tiles, imageOff[image] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            });
            if (x === px && y === py) {
                context.drawImage(tiles, imageOff['player'] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            }
        };
        for (var x = 0; x < width; x++) {
            _loop_4(x);
        }
    };
    for (var y = 0; y < height; y++) {
        _loop_3(y);
    }
    var fov = map.getFieldOfView(px, py, 15);
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            if (!fov.get(x, y)) {
                context.drawImage(tiles, imageOff['shadow'] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            }
        }
    }
}
var imageOff = {
    'grass1': 0,
    'grass2': 1,
    'grass3': 2,
    'north': 3,
    'east': 4,
    'south': 5,
    'west': 6,
    'player': 7,
    'box': 8,
    'shadow': 9,
};
var tiles = new Image();
tiles.src = './tiles.png';
tiles.onload = function () {
    start();
    var working = false;
    var path = null;
    function step() {
        if (path == null) {
            if (working) {
                easystar.calculate();
            }
            else {
                var _a = randomPlace(), nx = _a[0], ny = _a[1];
                working = true;
                easystar.findPath(px, py, nx, ny, function (p) {
                    path = p;
                    working = false;
                    requestAnimationFrame(step);
                });
                easystar.calculate();
                return;
            }
        }
        else if (path.length > 0) {
            var _b = path.shift(), nx = _b.x, ny = _b.y;
            px = nx;
            py = ny;
        }
        else {
            path = undefined;
        }
        render();
        setTimeout(function () { return requestAnimationFrame(step); }, 120);
    }
    requestAnimationFrame(step);
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom = __webpack_require__(0);
// tslint:disable:no-bitwise
var TileFlag;
(function (TileFlag) {
    TileFlag[TileFlag["WALL_NORTH"] = 1] = "WALL_NORTH";
    TileFlag[TileFlag["WALL_EAST"] = 2] = "WALL_EAST";
    TileFlag[TileFlag["WALL_WEST"] = 8] = "WALL_WEST";
    TileFlag[TileFlag["WALL_SOUTH"] = 4] = "WALL_SOUTH";
    TileFlag[TileFlag["BODY"] = 1 << geom.DIRECTIONS.length] = "BODY";
})(TileFlag || (TileFlag = {}));
var WEDGE_LOW = 0;
var WEDGE_HIGH = 1;
var WEDGE_COUNT = 2;
var BODY_EPSILON = 0.00001;
var WALL_EPSILON = BODY_EPSILON / 10;
function cutWedge(wedges, wedgeIndex, low, high) {
    for (;;) {
        if (wedgeIndex === wedges.length) {
            return wedgeIndex;
        }
        if (low <= wedges[wedgeIndex + WEDGE_HIGH]) {
            break;
        }
        wedgeIndex += WEDGE_COUNT;
    }
    if (low <= wedges[wedgeIndex + WEDGE_LOW]) {
        if (high >= wedges[wedgeIndex + WEDGE_HIGH]) {
            // wedge is entirely occluded, remove it
            wedges.splice(wedgeIndex, WEDGE_COUNT);
            // now looking at the next wedge (or past the end)
            return cutWedge(wedges, wedgeIndex, low, high);
        }
        else if (high >= wedges[wedgeIndex + WEDGE_LOW]) {
            // low part of wedge is occluded, trim it
            wedges[wedgeIndex + WEDGE_LOW] = high;
            // still looking at the same wedge
        }
        else {
            // this cut doesn't reach the current wedge
        }
    }
    else if (high >= wedges[wedgeIndex + WEDGE_HIGH]) {
        // high part of wedge is occluded, trim it
        wedges[wedgeIndex + WEDGE_HIGH] = low;
        // move on to the next wedge
        wedgeIndex += WEDGE_COUNT;
        return cutWedge(wedges, wedgeIndex, low, high);
    }
    else {
        // middle part of wedge is occluded, split it
        wedges.splice(wedgeIndex, 0, wedges[wedgeIndex + WEDGE_LOW], low);
        wedgeIndex += WEDGE_COUNT;
        wedges[wedgeIndex + WEDGE_LOW] = high;
        // now looking at the second wedge of the split
    }
    return wedgeIndex;
}
var LOCAL_OFF = new geom.Offset();
var FieldOfViewMap = (function () {
    function FieldOfViewMap(width, height) {
        this._size = new geom.Size();
        this._size.set(width, height);
        this._tileFlags = new Array(this._size.area).fill(0);
    }
    FieldOfViewMap.prototype._addFlag = function (off, flag) {
        var index = this._size.index(off);
        this._tileFlags[index] |= flag;
    };
    FieldOfViewMap.prototype._removeFlag = function (off, flag) {
        var index = this._size.index(off);
        this._tileFlags[index] &= ~flag;
    };
    // setup and maintenance
    FieldOfViewMap.prototype.addWall = function (x, y, dir) {
        LOCAL_OFF.set(x, y).addCardinalDirection(dir);
        if (this._size.containsOffset(LOCAL_OFF)) {
            this._addFlag(LOCAL_OFF, 1 << geom.directionOpposite(dir));
            LOCAL_OFF.set(x, y);
            this._addFlag(LOCAL_OFF, 1 << dir);
        }
    };
    FieldOfViewMap.prototype.removeWall = function (x, y, dir) {
        LOCAL_OFF.set(x, y).addCardinalDirection(dir);
        if (this._size.containsOffset(LOCAL_OFF)) {
            this._removeFlag(LOCAL_OFF, 1 << geom.directionOpposite(dir));
            LOCAL_OFF.set(x, y);
            this._removeFlag(LOCAL_OFF, 1 << dir);
        }
    };
    FieldOfViewMap.prototype.getWalls = function (x, y) {
        LOCAL_OFF.set(x, y);
        var index = this._size.index(LOCAL_OFF);
        return this._tileFlags[index] & geom.DirectionFlags.ALL;
    };
    FieldOfViewMap.prototype.addBody = function (x, y) {
        LOCAL_OFF.set(x, y);
        this._addFlag(LOCAL_OFF, TileFlag.BODY);
    };
    FieldOfViewMap.prototype.removeBody = function (x, y) {
        LOCAL_OFF.set(x, y);
        this._removeFlag(LOCAL_OFF, TileFlag.BODY);
    };
    FieldOfViewMap.prototype.getBody = function (x, y) {
        LOCAL_OFF.set(x, y);
        var index = this._size.index(LOCAL_OFF);
        return this._tileFlags[index] & TileFlag.BODY;
    };
    // execution
    FieldOfViewMap.prototype.getFieldOfView = function (x, y, chebyshevRadius) {
        var origin = new geom.Offset(x, y);
        var boundRect = new geom.Rectangle(origin.x - chebyshevRadius, origin.y - chebyshevRadius, chebyshevRadius * 2 + 1, chebyshevRadius * 2 + 1);
        var mask = new geom.MaskRect(boundRect);
        mask.set(origin, true);
        this._quadrant(mask, origin, chebyshevRadius, -1, -1);
        this._quadrant(mask, origin, chebyshevRadius, 1, -1);
        this._quadrant(mask, origin, chebyshevRadius, -1, 1);
        this._quadrant(mask, origin, chebyshevRadius, 1, 1);
        return mask;
    };
    FieldOfViewMap.prototype._quadrant = function (mask, origin, chebyshevRadius, xDir, yDir) {
        var startX = origin.x, startY = origin.y;
        var endDX = (Math.min(Math.max(startX + xDir * (chebyshevRadius + 1), -1), this._size.width) - startX) * xDir;
        var endDY = (Math.min(Math.max(startY + yDir * (chebyshevRadius + 1), -1), this._size.height) - startY) * yDir;
        var farYFlag = yDir === 1 ? TileFlag.WALL_SOUTH : TileFlag.WALL_NORTH;
        var farXFlag = xDir === 1 ? TileFlag.WALL_EAST : TileFlag.WALL_WEST;
        var startMapIndex = this._size.index(origin);
        var startMaskIndex = mask.index(origin);
        // Initial wedge is from slope zero to slope infinity (i.e. the whole quadrant)
        var wedges = [0, Number.POSITIVE_INFINITY];
        // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
        // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
        for (var dy = 0, yMapIndex = startMapIndex, yMaskIndex = startMaskIndex; dy !== endDY && wedges.length > 0; dy++, yMapIndex = yMapIndex + yDir * this._size.width, yMaskIndex = yMaskIndex + yDir * mask.width) {
            var divYpos = 1 / (dy + 0.5);
            var divYneg = dy === 0 ? Number.POSITIVE_INFINITY : 1 / (dy - 0.5);
            var wedgeIndex = 0;
            // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
            // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
            for (var dx = 0, mapIndex = yMapIndex, maskIndex = yMaskIndex, slopeY = -0.5 * divYpos, slopeX = 0.5 * divYneg; dx !== endDX && wedgeIndex !== wedges.length; dx++, mapIndex = mapIndex + xDir, maskIndex = maskIndex + xDir,
                slopeY = slopeY + divYpos, slopeX = slopeX + divYneg) {
                // the slopes of the four corners of this tile
                // these are named as follows:
                //   slopeY is the slope closest to the Y axis
                //   slopeFar is the slope to the farthest corner
                //   slopeX is the slope closest to the X axis
                // this is always true:
                //   slopeY < slopeFar < slopeX
                //
                // O = origin, C = current
                // +---+---+---+
                // | O |   |   |
                // +---+---+---X
                // |   |   | C |
                // +---+---Y---F
                // advance the wedge index until this tile is not after the current wedge
                while (slopeY >= wedges[wedgeIndex + WEDGE_HIGH]) {
                    // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
                    // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
                    wedgeIndex = wedgeIndex + WEDGE_COUNT;
                    if (wedgeIndex >= wedges.length) {
                        break;
                    }
                }
                if (wedgeIndex >= wedges.length) {
                    break;
                }
                // if the current wedge is after this tile, move on
                if (slopeX <= wedges[wedgeIndex + WEDGE_LOW]) {
                    continue;
                }
                // we can see this tile
                mask.setAt(maskIndex, true);
                // the walls of this tile
                // these are named as follows:
                //   wallY is the farthest horizontal wall (slopeY to slopeFar)
                //   wallX is the farthest vertical wall (slopeFar to slopeX)
                //
                // O = origin, C = current
                // +---+---+---+
                // | O |   |   |
                // +---+---+---+
                // |   |   | C X
                // +---+---+-Y-+
                // const/let must be at the top of a block, in order not to trigger deoptimization due to
                // https://github.com/nodejs/node/issues/9729
                {
                    var wallY = (this._tileFlags[mapIndex] & farYFlag) !== 0;
                    var wallX = (this._tileFlags[mapIndex] & farXFlag) !== 0;
                    if (wallX && wallY) {
                        // this tile has both far walls
                        // so we can't see beyond it and the whole range should be cut out of the wedge(s)
                        wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY - WALL_EPSILON, slopeX + WALL_EPSILON);
                    }
                    else {
                        var body = (dx !== 0 || dy !== 0) && (this._tileFlags[mapIndex] & TileFlag.BODY) !== 0;
                        if (body) {
                            // there is something in this tile
                            // so we can't see beyond it and most of the range should be cut out of the wedge(s)
                            // not the whole range, we leave a smidge on either side, so we can see between
                            // two somethings in situations like this "corner" case:
                            //
                            // O = origin, X = something in the tile, Y = want to see this tile
                            // +---+---+---+
                            // | O |   |   |
                            // +---+---+---+
                            // |   |   | X |
                            // +---+---+---+
                            // |   | X | Y |
                            // +---+---+---+
                            if (wallX) {
                                wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY + BODY_EPSILON, slopeX + WALL_EPSILON);
                            }
                            else if (wallY) {
                                wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY - WALL_EPSILON, slopeX - BODY_EPSILON);
                            }
                            else {
                                wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY + BODY_EPSILON, slopeX - BODY_EPSILON);
                            }
                        }
                        else if (wallX) {
                            var slopeFar = slopeY + divYpos;
                            wedgeIndex = cutWedge(wedges, wedgeIndex, slopeFar - WALL_EPSILON, slopeX + WALL_EPSILON);
                        }
                        else if (wallY) {
                            var slopeFar = slopeY + divYpos;
                            wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY - WALL_EPSILON, slopeFar + WALL_EPSILON);
                        }
                    }
                }
            }
        }
    };
    return FieldOfViewMap;
}());
exports.FieldOfViewMap = FieldOfViewMap;
//# sourceMappingURL=field-of-view.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-bitwise
var DirectionFlags;
(function (DirectionFlags) {
    DirectionFlags[DirectionFlags["NONE"] = 0] = "NONE";
    DirectionFlags[DirectionFlags["NORTH"] = 1] = "NORTH";
    DirectionFlags[DirectionFlags["EAST"] = 2] = "EAST";
    DirectionFlags[DirectionFlags["SOUTH"] = 4] = "SOUTH";
    DirectionFlags[DirectionFlags["WEST"] = 8] = "WEST";
    DirectionFlags[DirectionFlags["ALL"] = 15] = "ALL";
})(DirectionFlags = exports.DirectionFlags || (exports.DirectionFlags = {}));
function directionFlagsToString(flags) {
    var ret = '[';
    if ((flags & DirectionFlags.NORTH) !== 0) {
        ret += 'N';
    }
    if ((flags & DirectionFlags.EAST) !== 0) {
        ret += 'E';
    }
    if ((flags & DirectionFlags.SOUTH) !== 0) {
        ret += 'S';
    }
    if ((flags & DirectionFlags.WEST) !== 0) {
        ret += 'W';
    }
    return ret + ']';
}
exports.directionFlagsToString = directionFlagsToString;
// conversion
function directionFlagsFromDirection(dir) {
    return (1 << dir);
}
exports.directionFlagsFromDirection = directionFlagsFromDirection;
//# sourceMappingURL=direction-flags.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// tslint:disable:no-bitwise
Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 0] = "NORTH";
    Direction[Direction["EAST"] = 1] = "EAST";
    Direction[Direction["SOUTH"] = 2] = "SOUTH";
    Direction[Direction["WEST"] = 3] = "WEST";
})(Direction = exports.Direction || (exports.Direction = {}));
exports.DIRECTIONS = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST,
];
function directionOpposite(dir) {
    return ((dir + 2) & 3);
}
exports.directionOpposite = directionOpposite;
//# sourceMappingURL=direction.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom = __webpack_require__(0);
var LOCAL_OFF = new geom.Offset();
var MaskRect = (function () {
    function MaskRect(rect, initialValue, outsideValue) {
        if (initialValue === void 0) { initialValue = false; }
        if (outsideValue === void 0) { outsideValue = false; }
        this._rectangle = new geom.Rectangle();
        this._rectangle.copyFrom(rect);
        this._mask = new geom.Mask(rect, initialValue);
        this._outsideValue = outsideValue;
    }
    // accessors
    MaskRect.prototype.toString = function () {
        return this._rectangle.northWest + "/" + this._outsideValue + "\n" + this._mask;
    };
    Object.defineProperty(MaskRect.prototype, "westX", {
        get: function () {
            return this._rectangle.westX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaskRect.prototype, "northY", {
        get: function () {
            return this._rectangle.northY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaskRect.prototype, "width", {
        get: function () {
            return this._rectangle.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaskRect.prototype, "height", {
        get: function () {
            return this._rectangle.height;
        },
        enumerable: true,
        configurable: true
    });
    MaskRect.prototype.index = function (off) {
        return this._mask.index(LOCAL_OFF.copyFrom(off).subtractOffset(this._rectangle.northWest));
    };
    MaskRect.prototype.getAt = function (index) {
        return this._mask.getAt(index);
    };
    MaskRect.prototype.get = function (x, y) {
        LOCAL_OFF.set(x, y);
        if (!this._rectangle.containsOffset(LOCAL_OFF)) {
            return this._outsideValue;
        }
        return this._mask.get(LOCAL_OFF.subtractOffset(this._rectangle.northWest));
    };
    // mutators
    MaskRect.prototype.setAt = function (index, value) {
        this._mask.setAt(index, value);
        return this;
    };
    MaskRect.prototype.set = function (off, value) {
        this._mask.set(LOCAL_OFF.copyFrom(off).subtractOffset(this._rectangle.northWest), value);
        return this;
    };
    // utilities
    MaskRect.prototype.forEach = function (cursor, callback) {
        var _this = this;
        this._mask.forEach(cursor, function (off, value) {
            callback(off.addOffset(_this._rectangle.northWest), value);
        });
    };
    return MaskRect;
}());
exports.MaskRect = MaskRect;
//# sourceMappingURL=mask-rect.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom = __webpack_require__(0);
var Mask = (function () {
    // TODO consider Uint8Array for bits
    function Mask(size, initialValue) {
        if (initialValue === void 0) { initialValue = false; }
        this._size = new geom.Size();
        this._size.copyFrom(size);
        this._bits = new Array(this._size.area).fill(initialValue);
    }
    // accessors
    Mask.prototype.toString = function () {
        var ret = '';
        var off = new geom.Offset();
        for (var y = 0; y < this._size.height; y++) {
            for (var x = 0; x < this._size.width; x++) {
                off.set(x, y);
                ret += this.get(off.set(x, y)) ? '☑' : '☐';
            }
            ret += '\n';
        }
        return ret;
    };
    Object.defineProperty(Mask.prototype, "width", {
        get: function () {
            return this._size.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mask.prototype, "height", {
        get: function () {
            return this._size.height;
        },
        enumerable: true,
        configurable: true
    });
    Mask.prototype.index = function (off) {
        return this._size.index(off);
    };
    Mask.prototype.getAt = function (index) {
        return this._bits[index];
    };
    Mask.prototype.get = function (off) {
        return this.getAt(this.index(off));
    };
    // mutators
    Mask.prototype.setAt = function (index, value) {
        this._bits[index] = value;
        return this;
    };
    Mask.prototype.set = function (off, value) {
        return this.setAt(this.index(off), value);
    };
    // utilities
    Mask.prototype.forEach = function (cursor, callback) {
        var _this = this;
        var index = 0;
        this._size.forEach(cursor, function (off) {
            callback(off, _this._bits[index]);
            index++;
        });
    };
    return Mask;
}());
exports.Mask = Mask;
//# sourceMappingURL=mask.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var X_FROM_CARDINAL_DIRECTION = [0, 1, 0, -1];
var Y_FROM_CARDINAL_DIRECTION = [-1, 0, 1, 0];
var Offset = (function () {
    function Offset(x, y) {
        if (typeof x === 'undefined') {
            x = 0;
        }
        if (typeof y === 'undefined') {
            y = 0;
        }
        this.x = x;
        this.y = y;
    }
    Offset.prototype.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };
    // mutators
    Offset.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Offset.prototype.copyFrom = function (other) {
        this.x = other.x;
        this.y = other.y;
        return this;
    };
    Offset.prototype.addOffset = function (off) {
        this.x += off.x;
        this.y += off.y;
        return this;
    };
    Offset.prototype.addCardinalDirection = function (dir) {
        this.x += X_FROM_CARDINAL_DIRECTION[dir];
        this.y += Y_FROM_CARDINAL_DIRECTION[dir];
        return this;
    };
    Offset.prototype.subtractOffset = function (off) {
        this.x -= off.x;
        this.y -= off.y;
        return this;
    };
    return Offset;
}());
exports.Offset = Offset;
//# sourceMappingURL=offset.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom = __webpack_require__(0);
var LOCAL_OFF = new geom.Offset();
var Rectangle = (function () {
    function Rectangle(westX, northY, width, height) {
        if (typeof westX === 'undefined') {
            westX = 0;
        }
        if (typeof northY === 'undefined') {
            northY = 0;
        }
        if (typeof width === 'undefined') {
            width = 0;
        }
        if (typeof height === 'undefined') {
            height = 0;
        }
        this.northWest = new geom.Offset(westX, northY);
        this.size = new geom.Size(width, height);
    }
    // accessors
    Rectangle.prototype.toString = function () {
        return "(" + this.westX + "," + this.northY + " " + this.width + "x" + this.height + ")";
    };
    Object.defineProperty(Rectangle.prototype, "northY", {
        get: function () {
            return this.northWest.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "southY", {
        get: function () {
            return this.northWest.y + this.size.height - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "westX", {
        get: function () {
            return this.northWest.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "eastX", {
        get: function () {
            return this.northWest.x + this.size.width - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () {
            return this.size.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () {
            return this.size.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "empty", {
        get: function () {
            return this.size.empty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "area", {
        get: function () {
            return this.size.area;
        },
        enumerable: true,
        configurable: true
    });
    // mutators
    Rectangle.prototype.copyFrom = function (other) {
        this.northWest.set(other.westX, other.northY);
        this.size.set(other.width, other.height);
        return this;
    };
    // utilities
    Rectangle.prototype.containsOffset = function (off) {
        return this.size.containsOffset(LOCAL_OFF.copyFrom(off).subtractOffset(this.northWest));
    };
    Rectangle.prototype.index = function (off) {
        return this.size.index(LOCAL_OFF.copyFrom(off).subtractOffset(this.northWest));
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
//# sourceMappingURL=rectangle.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Size = (function () {
    function Size(width, height) {
        if (typeof width === 'undefined') {
            width = 0;
        }
        if (typeof height === 'undefined') {
            height = 0;
        }
        this.width = width;
        this.height = height;
    }
    // accessors
    Size.prototype.toString = function () {
        return "(" + this.width + "x" + this.height + ")";
    };
    Object.defineProperty(Size.prototype, "empty", {
        get: function () {
            return this.width === 0 || this.height === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Size.prototype, "area", {
        get: function () {
            return this.width * this.height;
        },
        enumerable: true,
        configurable: true
    });
    // mutators
    Size.prototype.set = function (width, height) {
        this.width = width;
        this.height = height;
        return this;
    };
    Size.prototype.copyFrom = function (other) {
        this.width = other.width;
        this.height = other.height;
        return this;
    };
    // utilities
    Size.prototype.containsOffset = function (off) {
        return off.x >= 0 && off.y >= 0 && off.x < this.width && off.y < this.height;
    };
    Size.prototype.index = function (off) {
        return off.y * this.width + off.x;
    };
    Size.prototype.forEach = function (cursor, callback) {
        for (var dy = 0; dy < this.height; dy++) {
            for (var dx = 0; dx < this.width; dx++) {
                cursor.x = dx;
                cursor.y = dy;
                callback(cursor);
            }
        }
    };
    return Size;
}());
exports.Size = Size;
//# sourceMappingURL=size.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=demo.js.map