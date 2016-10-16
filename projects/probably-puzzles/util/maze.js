/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global window */
	var mg = __webpack_require__(1);
	 
	window.makeMaze = function(width, height) {
	    return mg.generate(width, height, {
	        generator: __webpack_require__(8)
	    });
	};
	window.makeMaze.dirs = __webpack_require__(3).directions;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	exports.generate = __webpack_require__(2);
	exports.GridMask = __webpack_require__(3).GridMask;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Maze = __webpack_require__(3).Maze;

	function generate(width, height, options) {
	    var noptions = {};
	    for (var x in options)
	        noptions[x] = options[x];

	    // Default random number generator: Math.random.
	    // Math.random isn't seedable, so if you want reproducible
	    // results you should pass a different RNG, for instance
	    // the following code using the random-js package would work:
	    //
	    //     var randomjs = require('random-js');
	    //     var engine = randomjs.engines.mt19937().seed(seed);
	    //     var real = randomjs.real(0, 1);
	    //     options.random = function() {
	    //         return real(engine);
	    //     };
	    if (!noptions.random)
	        options.random = Math.random;

	    // Default generator.  maze-generator-backtrack isn't included
	    // in this library, it needs to be installed separately.
	    if (!options.generator)
	        options.generator = '@sbj42/maze-generator-backtrack';

	    var maze = new Maze(width, height);

	    var generator;
	    if (typeof(options.generator) == 'string') {
	        try {
	            generator = __webpack_require__(7)(options.generator);
	        } catch (e) {
	            throw new Error('failed to load plugin ' + options.generator + ': ' + e.toString());
	        }
	    } else {
	        generator = options.generator;
	    }
	    generator(maze, options);

	    return maze;
	}

	module.exports = generate;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports.GridMask = __webpack_require__(4);
	exports.Maze = __webpack_require__(5);
	exports.directions = __webpack_require__(6);


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * @typedef {Object} GridMaskOptions
	 * @property {boolean} [interior] The value to intialize interior cells to
	 * @property {boolean} [exterior] The value to return for exterior cells
	 */

	/**
	 * A GridMask is a rectangular grid of boolean values.
	 *
	 * @constructor
	 * @param {integer} width
	 * @param {integer} height
	 * @param {GridMaskOptions} options
	 */
	function GridMask(width, height, options) {
	    if (width < 0 || height < 0)
	        throw new Error('invalid size: ' + width + 'x' + height);
	    options = options || {};
	    var interior = false;
	    if (options.interior != null)
	        interior = !!options.interior;
	    this._width = width;
	    this._height = height;
	    this._exterior = false;
	    if (options.exterior != null)
	        this._exterior = !!options.exterior;
	    this._blockWidth = (width+31) >> 5;
	    if (options._grid) {
	        this._grid = options._grid;
	        return;
	    }
	    this._grid = new Array(this._blockWidth * height);
	    var initBlock = interior ? ~0 : 0;
	    for (var i = 0; i < this._blockWidth * height; i ++) {
	        this._grid[i] = initBlock;
	    }
	}

	/**
	 * The width of the GridMask
	 *
	 * @return {integer}
	 */
	GridMask.prototype.width = function() {
	    return this._width;
	};

	/**
	 * The height of the GridMask
	 *
	 * @return {integer}
	 */
	GridMask.prototype.height = function() {
	    return this._height;
	};

	/**
	 * Returns a copy of the GridMask.
	 *
	 * @return {GridMask}
	 */
	GridMask.prototype.clone = function() {
	    return new GridMask(this.width(), this.height(), {
	        exterior: this._exterior,
	        _grid: this._grid.slice()
	    });
	};

	/**
	 * Returns the boolean value at the specified cell
	 *
	 * @param {integer} x
	 * @param {integer} y
	 */
	GridMask.prototype.get = function(x, y) {
	    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
	        return this._exterior;
	    }
	    var index = y * this._blockWidth + (x >> 5);
	    var mask = 1 << (x & 31);
	    return (this._grid[index] & mask) != 0;
	};

	/**
	 * Sets the boolean value at the specified cell.  Throws an
	 * error for coordinates that lie outside the grid.
	 *
	 * @param {integer} x
	 * @param {integer} y
	 * @param {boolean} [value=true]
	 */
	GridMask.prototype.set = function(x, y, value) {
	    if (value == null)
	        value = true;
	    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
	        throw new Error('cell out of bounds: ' + x + ',' + y);
	    }
	    var index = y * this._blockWidth + (x >> 5);
	    var mask = 1 << (x & 31);
	    if (value)
	        this._grid[index] |= mask;
	    else
	        this._grid[index] &= ~mask;
	    return this;
	};

	/**
	 * ...
	 *
	 * @param {integer} x
	 * @param {integer} y
	 * @param {boolean} [value=true]
	 */
	GridMask.prototype.testAndSet = function(x, y, value) {
	    if (value == null)
	        value = true;
	    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
	        if (this._exterior == value)
	            return false;
	        throw new Error('cell out of bounds: ' + x + ',' + y);
	    }
	    var index = y * this._blockWidth + (x >> 5);
	    var mask = 1 << (x & 31);
	    if (((this._grid[index] & mask) != 0) == value)
	        return false;
	    if (value)
	        this._grid[index] |= mask;
	    else
	        this._grid[index] &= ~mask;
	    return true;
	};

	module.exports = GridMask;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var dirs = __webpack_require__(6);

	/**
	 * A Cell is a wrapper object that makes it easier to
	 * ask for passage information by name.
	 *
	 * @constructor
	 * @private
	 * @param {integer} width
	 * @param {integer} height
	 */
	function Cell(north, east, south, west) {
	    this._north = north;
	    this._east = east;
	    this._south = south;
	    this._west = west;
	}

	Cell.prototype.north = function() {
	    return this._north;
	};

	Cell.prototype.west = function() {
	    return this._west;
	};

	Cell.prototype.south = function() {
	    return this._south;
	};

	Cell.prototype.east = function() {
	    return this._east;
	};

	/**
	 * A Maze is a rectangular grid of cells, where each cell
	 * may have passages in each of the cardinal directions.
	 * The maze is initialized with each cell having no passages.
	 *
	 * @constructor
	 * @param {integer} width
	 * @param {integer} height
	 */
	function Maze(width, height) {
	    if (width < 0 || height < 0)
	        throw new Error('invalid size: ' + width + 'x' + height);
	    this._width = width;
	    this._height = height;
	    this._blockWidth = ((width+1)+15) >> 4;
	    this._grid = new Array(this._blockWidth * (height + 1));
	    for (var i = 0; i < this._blockWidth * (height + 1); i ++)
	        this._grid[i] = 0;
	}

	/**
	 * The width of the Maze
	 *
	 * @return {integer}
	 */
	Maze.prototype.width = function() {
	    return this._width;
	};

	/**
	 * The height of the Maze
	 *
	 * @return {integer}
	 */
	Maze.prototype.height = function() {
	    return this._height;
	};

	// function cellData(grid, blockWidth, x, y) {
	//     var index = y * blockWidth + (x >> 3);
	//     var shift = ((x & 7) * 4);
	//     return (grid[index] >> shift) & 15;
	// }
	//
	// function setCellPassage(grid, blockWidth, x, y, dir, value) {
	//     var index = y * blockWidth + (x >> 3);
	//     var shift = ((x & 7) * 4);
	//     var mask = dirs.bitmask(dir) << shift;
	//     if (value)
	//         grid[index] |= mask;
	//     else
	//         grid[index] &= ~mask;
	// }

	/**
	 * Returns the cell at the given position.
	 *
	 * @param {integer} x
	 * @param {integer} y
	 * @return {Cell}
	 */
	Maze.prototype.cell = function(x, y) {
	    if (x < 0 || y < 0 || x >= this._width || y >= this._height)
	        return new Cell(false, false, false, false);
	    var north, east, south, west;
	    var index = y * this._blockWidth + (x >> 4);
	    var mask = 1 << ((x & 15) * 2);
	    north = (this._grid[index] & mask) != 0;
	    west = (this._grid[index] & (mask << 1)) != 0;
	    south = (this._grid[index + this._blockWidth] & mask) != 0;
	    var x2 = x + 1;
	    var index2 = y * this._blockWidth + (x2 >> 4);
	    var mask2 = 1 << ((x2 & 15) * 2);
	    east = (this._grid[index2] & (mask2 << 1)) != 0;
	    return new Cell(north, east, south, west);
	};

	/**
	 * Returns whether there is a passage at the given position and
	 * direction
	 *
	 * @param {integer} x
	 * @param {integer} y
	 * @param {Direction} dir
	 */
	Maze.prototype.getPassage = function(x, y, dir) {
	    if (x < 0 || y < 0 || x >= this._width || y >= this._height)
	        return false;
	    var index, mask;
	    if (dir != dirs.EAST) {
	        index = y * this._blockWidth + (x >> 4);
	        mask = 1 << ((x & 15) * 2);
	        if (dir == dirs.NORTH)
	            /* pass through */;
	        else if (dir == dirs.WEST)
	            mask <<= 1;
	        else
	            index += this._blockWidth;
	    } else {
	        index = y * this._blockWidth + ((x + 1) >> 4);
	        mask = 1 << (((x + 1) & 15) * 2 + 1);
	    }
	    return (this._grid[index] & mask) != 0;
	};

	/**
	 * Creates or removes a passage at the given position and
	 * direction.  Note that this also creates the corresponding
	 * passage in the neighboring cell.
	 *
	 * @param {integer} x
	 * @param {integer} y
	 * @param {Direction} dir
	 * @param {boolean} value
	 */
	Maze.prototype.setPassage = function(x, y, dir, value) {
	    if (value == null)
	        value = true;
	    var index, mask;
	    if (dir != dirs.EAST) {
	        index = y * this._blockWidth + (x >> 4);
	        mask = 1 << ((x & 15) * 2);
	        if (dir == dirs.NORTH) {
	            if (x < 0 || y < 1 || x >= this._width || y >= this._height)
	                throw new Error('passage out of bounds: ' + x + ',' + y + ' dir=' + dir);
	        } else if (dir == dirs.WEST) {
	            if (x < 1 || y < 0 || x >= this._width || y >= this._height)
	                throw new Error('passage out of bounds: ' + x + ',' + y + ' dir=' + dir);
	            mask <<= 1;
	        } else {
	            if (x < 0 || y < 0 || x >= this._width || y >= this._height - 1)
	                throw new Error('passage out of bounds: ' + x + ',' + y + ' dir=' + dir);
	            index += this._blockWidth;
	        }
	    } else {
	        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height)
	            throw new Error('passage out of bounds: ' + x + ',' + y + ' dir=' + dir);
	        index = y * this._blockWidth + ((x + 1) >> 4);
	        mask = 1 << (((x + 1) & 15) * 2 + 1);
	    }
	    if (value)
	        this._grid[index] |= mask;
	    else
	        this._grid[index] &= ~mask;
	};

	module.exports = Maze;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var dirs = {};

	/**
	 * @typedef {integer} Direction
	 */

	dirs.NORTH = 0;
	dirs.EAST =  1;
	dirs.SOUTH = 2;
	dirs.WEST =  3;

	dirs.ALL = [dirs.NORTH, dirs.EAST, dirs.SOUTH, dirs.WEST];

	/**
	 * Returns the opposite direction
	 *
	 * @param {Direction} dir
	 * @return {Direction}
	 */
	dirs.opposite = function(dir) {
	    switch (dir) {
	        case 0/*dirs.NORTH*/: return 2;
	        case 1/*dirs.EAST*/: return 3;
	        case 2/*dirs.SOUTH*/: return 0;
	        case 3/*dirs.WEST*/: return 1;
	        default: throw new Error('bad direction: ' + dir);
	    }
	};

	/**
	 * Returns the x component of the direction vector
	 *
	 * @param {Direction} dir
	 * @return {integer}
	 */
	dirs.dx = function(dir) {
	    switch (dir) {
	        case 0/*dirs.NORTH*/: return 0;
	        case 1/*dirs.EAST*/: return 1;
	        case 2/*dirs.SOUTH*/: return 0;
	        case 3/*dirs.WEST*/: return -1;
	        default: throw new Error('bad direction: ' + dir);
	    }
	};

	/**
	 * Returns the y component of the direction vector
	 *
	 * @param {Direction} dir
	 * @return {integer}
	 */
	dirs.dy = function(dir) {
	    switch (dir) {
	        case 0/*dirs.NORTH*/: return -1;
	        case 1/*dirs.EAST*/: return 0;
	        case 2/*dirs.SOUTH*/: return 1;
	        case 3/*dirs.WEST*/: return 0;
	        default: throw new Error('bad direction: ' + dir);
	    }
	};

	/**
	 * Moves the coordinate in the given direction
	 *
	 * @param {integer} x
	 * @param {integer} y
	 * @param {Direction} dir
	 * @return {integer[]}
	 */
	dirs.move = function(x, y, dir) {
	    switch (dir) {
	        case 0/*dirs.NORTH*/: return [x, y-1];
	        case 1/*dirs.EAST*/: return [x+1, y];
	        case 2/*dirs.SOUTH*/: return [x, y+1];
	        case 3/*dirs.WEST*/: return [x-1, y];
	        default: throw new Error('bad direction: ' + dir);
	    }
	};

	/**
	 * Returns a bitmask for the direction, useful for
	 * storing a bunch of direction boolean values in
	 * a single integer.
	 *
	 * @param {Direction} dir
	 * @return {integer}
	 */
	dirs.bitmask = function(dir) {
	    return 1 << dir;
	};

	module.exports = dirs;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./generate": 2,
		"./generate.js": 2,
		"./index": 1,
		"./index.js": 1
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
	webpackContext.id = 7;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var core = __webpack_require__(3);
	var GridMask = core.GridMask;
	var dirs = core.directions;

	/**
	 * @typedef {Object} MGOptions
	 * @property {Function} random Returns a random float between 0 (inclusive) and 1 (exclusive)
	 */

	/**
	 * Chooses a random integer between 0 (inclusive) and max (exclusive)
	 *
	 * @param {MGOptions} options
	 * @param {integer} max
	 */
	function randomInt(options, max) {
	    return Math.floor(options.random() * max);
	}

	/**
	 * Chooses a random element from an array
	 *
	 * @param {MGOptions} options
	 * @param {Array} array
	 */
	function randomChoice(options, array) {
	    if (array.length == 1)
	        return array[0];
	    return array[randomInt(options, array.length)];
	}

	/**
	 * Returns an array of directions toward neighboring
	 * cells that have not been visited (i.e. cells for
	 * which visited.get returns false).
	 *
	 * @param {MGOptions} options
	 * @param {GridMask} visited
	 * @param {integer[]} pos
	 */
	function getUnvisitedDirections(options, visited, pos) {
	    var ret = [];
	    if (!visited.get(pos[0], pos[1] - 1) && (!options.mask || options.mask.get(pos[0], pos[1] - 1)))
	        ret.push(dirs.NORTH);
	    if (!visited.get(pos[0] + 1, pos[1]) && (!options.mask || options.mask.get(pos[0] + 1, pos[1])))
	        ret.push(dirs.EAST);
	    if (!visited.get(pos[0], pos[1] + 1) && (!options.mask || options.mask.get(pos[0], pos[1] + 1)))
	        ret.push(dirs.SOUTH);
	    if (!visited.get(pos[0] - 1, pos[1]) && (!options.mask || options.mask.get(pos[0] - 1, pos[1])))
	        ret.push(dirs.WEST);
	    return ret;
	}

	/**
	 * Recursive-backtracking maze generator.
	 *
	 * @param {Maze} maze
	 * @param {MGOptions} options
	 */
	function backtrack(maze, options) {
	    var width = maze.width();
	    var height = maze.height();

	    // The 'visited' mask marks cells that have been added to the maze
	    // We use this to see which neighbors are available for connecting
	    // with a passage.  To avoid making a passage to the outside of
	    // the grid, we mark the exterior cells as if they were already
	    // included.
	    var visited = new GridMask(width, height, {exterior: true});

	    var cur;
	    // Start with a random cell in the grid
	    do {
	        cur = [randomInt(options, width), randomInt(options, height)];
	    } while (options.mask && !options.mask.get(cur[0], cur[1]));
	    // Mark the first cell as visited
	    visited.set(cur[0], cur[1], true);
	    // This array will hold the cells that we've moved through,
	    // to which we may return later to create a new branch
	    var stack = [];

	    // Loop until the maze is complete
	    for (;;) {

	        // Which directions can we go from this cell,
	        // that lead to cells that aren't yet in the maze?
	        var neighbors = getUnvisitedDirections(options, visited, cur);

	        if (neighbors.length) {
	            // If there is at least one such direction, pick
	            // one at random
	            var dir = randomChoice(options, neighbors);
	            // If there were other choices, then push the
	            // current cell onto the stack.
	            if (neighbors.length > 1)
	                stack.push(cur);
	            // Dig a passage from the curent cell to the next cell
	            maze.setPassage(cur[0], cur[1], dir, true);
	            // Move on to the next cell
	            cur = dirs.move(cur[0], cur[1], dir);
	            // Which is now in the maze
	            visited.set(cur[0], cur[1], true);
	        } else if (stack.length) {
	            // If there are no available directions here, but
	            // there are still cells in the stack, then pop
	            // the last cell off the stack ("backtracking"),
	            // and continue from there ("recusrive")
	            cur = stack.pop();
	        } else {
	            // If there are no available directions and the
	            // stack is empty, then the maze is complete
	            break;
	        }
	    }
	}

	backtrack.id = 'backtrack';
	backtrack.name = 'recursive-backtracking';
	backtrack.features = {
	    mask: true
	};

	module.exports = backtrack;


/***/ }
/******/ ]);