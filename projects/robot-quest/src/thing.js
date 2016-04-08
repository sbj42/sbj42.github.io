'use strict';
define(['lib/underscore'], function(_) {

    function getDirection(direction) {
        if (_.isString(direction)) {
            if (direction == 'up')
                direction = {
                    dx: 0,
                    dy: -1
                };
            else if (direction == 'down')
                direction = {
                    dx: 0,
                    dy: 1
                };
            else if (direction == 'left')
                direction = {
                    dx: -1,
                    dy: 0
                };
            else if (direction == 'right')
                direction = {
                    dx: 1,
                    dy: 0
                };
        }
        return direction;
    }

    function getDirections(directions) {
        if (!_.isArray(directions))
            directions = [directions];
        return _.map(directions, getDirection);
    }

    var thingmod = null;
    thingmod = {

        DEFAULT_MOVE_DURATION: 0.1,
        DEFAULT_BUMP_DURATION: 0.2,
        DEFAULT_ZOOM_DURATION: 0.1,
        DEFAULT_SPEECH_DURATION: 0.05,

        create: function(thingSpec, x, y, level) {
            if (!thingSpec)
                return null;
            if (_.isString(thingSpec)) {
                if (thingSpec.substr(0, 5) == 'item:') {
                    var item = thingSpec.substr(5);
                    thingSpec = {
                        id: item,
                        image: 'items/' + item
                    };
                } else if (thingSpec.substr(0, 10) == 'character:') {
                    var character = thingSpec.substr(10);
                    thingSpec = {
                        id: character,
                        image: 'characters/' + character
                    };
                } else if (thingSpec.substr(0, 8) == 'trigger:') {
                    var trigger = thingSpec.substr(8);
                    thingSpec = {
                        id: trigger,
                        image: 'trigger'
                    };
                } else if (thingSpec == 'player') {
                    thingSpec = {
                        id: 'player',
                        image: 'players/' + level.world.game.playerImageBase,
                        layer: 3
                    };
                } else if (thingSpec == 'exit') {
                    thingSpec = {
                        id: 'exit',
                        image: 'door'
                    };
                } else if (thingSpec == 'none') {
                    return null;
                } else {
                    thingSpec = {
                        id: thingSpec,
                        image: thingSpec
                    };
                }
            }
            var thing = {
                level: level,
                x: x,
                y: y,

                spec: thingSpec,

                id: thingSpec.id || _.uniqueId('_'),
                state: 'default',
                image: thingSpec.image || 'unknown',
                layer: thingSpec.layer || 2,
                pushable: thingSpec.pushable || false,
                moveDuration: thingmod.DEFAULT_MOVE_DURATION / (thingSpec.speed || 1),
                bumpDuration: thingmod.DEFAULT_BUMP_DURATION / (thingSpec.speed || 1),
                zoomDuration: thingmod.DEFAULT_ZOOM_DURATION / (thingSpec.speed || 1),
                speechDuration: thingmod.DEFAULT_SPEECH_DURATION / (thingSpec.speed || 1),

                getNode: function() {
                    return document.getElementById('thing_' + this.id);
                },

                render: function() {
                    var thingNode = this.getNode();
                    if (!thingNode) {
                        thingNode = document.createElement('div');
                        thingNode.id = 'thing_' + this.id;
                        thingNode.className = 'thing';
                    }
                    if (this.owner) {
                        var ownerNode = this.owner.getNode();
                        if (!ownerNode)
                            return;
                        ownerNode.appendChild(thingNode);
                        thingNode.style.left = '8px';
                        thingNode.style.top = '8px';
                        thingNode.style.transform = 'scale(0.6)';
                    } else {
                        thingNode.style.left = this.x * this.level.tileSize + 'px';
                        thingNode.style.top = this.y * this.level.tileSize + 'px';
                        thingNode.style.transform = '';
                    }
                    thingNode.style.width = this.level.tileSize + 'px';
                    thingNode.style.height = this.level.tileSize + 'px';
                    thingNode.style.backgroundImage = 'url(' + this.level.imageUrl(this.image) + ')';
                    thingNode.style.zIndex = this.layer;
                    if (!thingNode.parentNode)
                        document.getElementById('level').appendChild(thingNode);
                },

                destroy: function() {
                    var thingNode = this.getNode();
                    if (thingNode)
                        thingNode.parentNode.removeChild(thingNode);
                    if (this.owner)
                        this.owner.carrying = null;
                    delete this.level.things[this.id];
                },

                bump: function(directions, speed) {
                    var self = this;
                    directions = getDirections(directions);
                    var ret = Promise.resolve();
                    if (this.owner)
                        return ret;
                    _.each(directions, function(direction) {
                        ret = ret.then(function() {
                            return new Promise(function(resolve) {
                                if (!self.level.checkScreen())
                                    return resolve();
                                var thingNode = self.getNode();
                                if (!thingNode)
                                    return resolve();
                                direction = getDirection(direction);
                                var x = thingNode.offsetLeft;
                                var y = thingNode.offsetTop;
                                thingNode.style.transition = 'all ' + (self.bumpDuration / 2) + 's linear';
                                thingNode.style.left = (x + direction.dx * 5) + 'px';
                                thingNode.style.top = (y + direction.dy * 5) + 'px';
                                _.delay(function() {
                                    if (!self.level.checkScreen())
                                        return resolve();
                                    self.render();
                                    _.delay(function() {
                                        if (!self.level.checkScreen())
                                            return resolve();
                                        thingNode.style.transition = '';
                                        resolve();
                                    }, (self.bumpDuration / 2) * 1000);
                                }, (self.bumpDuration / 2) * 1000);
                            });
                        });
                    });
                    return ret;
                },

                lead: function(target) {
                    if (target && target.follows)
                        target.follows.leads = null;
                    if (!target && this.leads)
                        this.leads.follows = null;
                    this.leads = target;
                    if (target)
                        target.follows = this;
                },

                move: function(directions, speed) {
                    var self = this;
                    directions = getDirections(directions);
                    var ret = Promise.resolve();
                    if (this.owner)
                        return ret;
                    _.each(directions, function(direction) {
                        ret = ret.then(function() {
                            return new Promise(function(resolve) {
                                if (!self.level.checkScreen())
                                    return resolve();
                                var duration = self.moveDuration *
                                        Math.sqrt(direction.dx * direction.dx + direction.dy * direction.dy) /
                                        (speed || 1);
                                var thingNode = self.getNode();
                                if (!thingNode)
                                    return resolve();
                                var leading;
                                if (self.leads)
                                    leading = self.leads.move(self.leads.toward(self), speed);
                                else
                                    leading = Promise.resolve();
                                self.x += direction.dx;
                                self.y += direction.dy;
                                thingNode.style.transition = 'all ' + duration + 's linear';
                                self.render();
                                _.delay(function() {
                                    if (!self.level.checkScreen())
                                        return resolve();
                                    thingNode.style.transition = '';
                                    leading.then(resolve);
                                }, duration * 1000);
                            });
                        });
                    });
                    _.each(['up', 'down', 'left', 'right'], function(direction) {
                        ret = ret.then(function() {
                            if (!self.level.checkScreen())
                                return;
                            direction = getDirection(direction);
                            var x = self.x + direction.dx;
                            var y = self.y + direction.dy;
                            var thing = self.level.getThingAt(x, y);
                            if (thing && self.leads != thing && thing.leads != self) {
                                var actions = self.level.getScript(self.id + ' is near ' + thing.id);
                                if (actions)
                                    return self.level.run(actions);
                            }
                        });
                    });
                    ret = ret.then(function() {
                        if (!self.level.checkScreen())
                            return;
                        var things = self.level.getThingsAt(self.x, self.y);
                        var actions = null;
                        _.each(things, function(thing) {
                            actions = actions || self.level.getScript(self.id + ' is at ' + thing.id);
                        });
                        if (actions)
                            return self.level.run(actions);
                    });
                    return ret;
                },

                toward: function(target) {
                    var dx = target.x - this.x;
                    var dy = target.y - this.y;
                    var direction = {
                        dx: 0,
                        dy: 0
                    };
                    if (Math.abs(dx) > Math.abs(dy))
                        direction.dx = dx > 0 ? 1 : -1;
                    else
                        direction.dy = dy > 0 ? 1 : -1;
                    return direction;
                },

                walk: function(directions, speed) {
                    var self = this;
                    directions = getDirections(directions);
                    var ret = Promise.resolve();
                    if (this.owner)
                        return ret;
                    _.each(directions, function(direction) {
                        function moveSlideBump() {
                            if (!self.level.checkScreen())
                                return resolve();
                            var x = self.x + direction.dx;
                            var y = self.y + direction.dy;
                            var thing = self.level.getThingAt(x, y);
                            if (thing)
                                return self.bump(direction, speed);
                            var floor = self.level.getFloor(x, y);
                            if (floor && (floor.slippery)) {
                                return self.move(direction, speed).then(moveSlideBump);
                            } else if (floor && (_.isUndefined(floor.walkable) || floor.walkable))
                                return self.move(direction, speed);
                            else
                                return self.bump(direction, speed);
                        }

                        ret = ret.then(function() {
                            if (!self.level.checkScreen())
                                return resolve();
                            var x = self.x + direction.dx;
                            var y = self.y + direction.dy;
                            var thing = self.level.getThingAt(x, y);
                            if (thing && thing.pushable) {
                                var x2 = x + direction.dx;
                                var y2 = y + direction.dy;
                                var thing2 = self.level.getThingAt(x2, y2);
                                var floor2 = self.level.getFloor(x2, y2);
                                if (!(floor2 && (_.isUndefined(floor2.walkable) || floor2.walkable)) || thing2) {
                                    thing.bump(direction);
                                    return self.bump(direction);
                                }
                                thing.walk(direction);
                                var floor = self.level.getFloor(x, y);
                                if (floor && (floor.slippery)) {
                                    return self.move(direction, speed).then(moveSlideBump);
                                } else if (floor && (_.isUndefined(floor.walkable) || floor.walkable))
                                    return self.move(direction, speed);
                                else
                                    return self.bump(direction, speed);
                            } else if (thing) {
                                var actions = self.level.getScript(self.id + ' meets ' + thing.id);
                                if (actions)
                                    return self.level.run(actions);
                            }
                            return moveSlideBump();
                        });
                    });
                    return ret;
                },

                say: function(messages) {
                    var self = this;
                    if (!_.isArray(messages))
                        messages = [messages];
                    var ret = Promise.resolve();
                    if (this.owner)
                        return ret;
                    ret = ret.then(function() {
                        return new Promise(function(resolve) {
                            if (!self.level.checkScreen())
                                return resolve();
                            var floor = self.level.getFloor(self.x, self.y);
                            var floorNode = floor && floor.getNode();
                            var thingNode = self.getNode();
                            if (!thingNode)
                                return resolve();
                            if (floorNode) {
                                floorNode.style.transform = 'scale(1.5)';
                                floorNode.style.transition = 'all ' + self.zoomDuration + 's linear';
                                floorNode.style.zIndex = 100;
                            }
                            thingNode.style.transform = 'scale(1.5)';
                            thingNode.style.transition = 'all ' + self.zoomDuration + 's linear';
                            thingNode.style.zIndex = 100 + self.layer;
                            _.delay(function() {
                                if (!self.level.checkScreen())
                                    return resolve();
                                var levelNode = self.level.getNode();
                                if (floorNode)
                                    floorNode.style.transition = '';
                                thingNode.style.transition = '';
                                var speechNode = document.createElement('div');
                                speechNode.id = 'speech';
                                var speechBubble1Node = document.createElement('div');
                                speechBubble1Node.id = 'speech-bubble-1';
                                var speechBubble2Node = document.createElement('div');
                                speechBubble2Node.id = 'speech-bubble-2';
                                if (thingNode.offsetTop < levelNode.offsetHeight / 2) {
                                    var t = thingNode.offsetTop + thingNode.offsetHeight;
                                    speechNode.style.top = (t + 20) + 'px';
                                    speechBubble1Node.style.top = (t - 3) + 'px';
                                    speechBubble2Node.style.top = (t + 5) + 'px';
                                } else {
                                    var b = levelNode.offsetHeight - thingNode.offsetTop;
                                    speechNode.style.bottom = (b + 20) + 'px';
                                    speechBubble1Node.style.bottom = (b - 3) + 'px';
                                    speechBubble2Node.style.bottom = (b + 5) + 'px';
                                }
                                if (thingNode.offsetLeft < levelNode.offsetWidth / 2) {
                                    var l = thingNode.offsetLeft + thingNode.offsetWidth;
                                    speechNode.style.left = (l + 20) + 'px';
                                    speechBubble1Node.style.left = (l - 3) + 'px';
                                    speechBubble2Node.style.left = (l + 5) + 'px';
                                } else {
                                    var r = levelNode.offsetWidth - thingNode.offsetLeft;
                                    speechNode.style.right = (r + 20) + 'px';
                                    speechBubble1Node.style.right = (r - 3) + 'px';
                                    speechBubble2Node.style.right = (r + 5) + 'px';
                                }
                                levelNode.appendChild(speechBubble1Node);
                                _.delay(function() {
                                    if (!self.level.checkScreen())
                                        return resolve();
                                    levelNode.appendChild(speechBubble2Node);
                                    _.delay(function() {
                                        if (!self.level.checkScreen())
                                            return resolve();
                                        levelNode.appendChild(speechNode);
                                        resolve();
                                    }, self.speechDuration / 2 * 1000);
                                }, self.speechDuration / 2 * 1000);
                            }, self.zoomDuration * 1000);
                        });
                    });
                    _.each(messages, function(message) {
                        ret = ret.then(function() {
                            return new Promise(function(resolve) {
                                if (!self.level.checkScreen())
                                    return resolve();
                                var speechNode = document.getElementById('speech');
                                if (!speechNode)
                                    return resolve();
                                speechNode.innerHTML = message + '<div class="pressspace">[press SPACE]</div>';
                                self.level.setSpaceCallback(resolve);
                            });
                        });
                    });
                    ret = ret.then(function() {
                        return new Promise(function(resolve) {
                            if (!self.level.checkScreen())
                                return resolve();
                            var speechNode = document.getElementById('speech');
                            if (speechNode)
                                speechNode.parentNode.removeChild(speechNode);
                            _.delay(function() {
                                if (!self.level.checkScreen())
                                    return resolve();
                                var speechBubble2Node = document.getElementById('speech-bubble-2');
                                if (speechBubble2Node)
                                    speechBubble2Node.parentNode.removeChild(speechBubble2Node);
                                _.delay(function() {
                                    if (!self.level.checkScreen())
                                        return resolve();
                                    var speechBubble1Node = document.getElementById('speech-bubble-1');
                                    if (speechBubble1Node)
                                        speechBubble1Node.parentNode.removeChild(speechBubble1Node);
                                    var floor = self.level.getFloor(self.x, self.y);
                                    var floorNode = floor && floor.getNode();
                                    var thingNode = self.getNode();
                                    if (!thingNode)
                                        return resolve();
                                    if (floorNode) {
                                        floorNode.style.transform = '';
                                        floorNode.style.transition = 'all ' + self.zoomDuration + 's linear';
                                        floorNode.style.zIndex = 100;
                                    }
                                    thingNode.style.transform = '';
                                    thingNode.style.transition = 'all ' + self.zoomDuration + 's linear';
                                    thingNode.style.zIndex = 100 + self.layer;
                                    _.delay(function() {
                                        if (!self.level.checkScreen())
                                            return resolve();
                                        if (floorNode) {
                                            floorNode.style.transition = '';
                                            floorNode.style.zIndex = '';
                                        }
                                        thingNode.style.transition = '';
                                        thingNode.style.zIndex = self.layer;
                                        resolve();
                                    }, self.zoomDuration * 1000);
                                }, self.speechDuration / 2 * 1000);
                            }, self.speechDuration / 2 * 1000);
                        });
                    });
                    return ret;
                },

                take: function(target) {
                    var self = this;
                    function lift(node) {
                        if (!node)
                            return;
                        var levelNode = self.level.getNode();
                        if (node.parentNode != levelNode) {
                            var left = 0;
                            var top = 0;
                            var n = node;
                            while (n && n != levelNode) {
                                left += n.offsetLeft;
                                top += n.offsetTop;
                                n = n.offsetParent;
                                if (n == null)
                                    return resolve();
                            }
                            node.style.transition = '';
                            node.style.left = left + 'px';
                            node.style.top = top + 'px';
                            levelNode.appendChild(node);
                        }
                        node.style.zIndex = '200';
                    }
                    return new Promise(function(resolve) {
                        if (!self.level.checkScreen())
                            return resolve();
                        var thingNode = self.getNode();
                        var targetNode = target.getNode();
                        var otherTarget = self.carrying;
                        var otherTargetNode = otherTarget && otherTarget.getNode();
                        var otherThingNode = target.owner && target.owner.getNode();
                        if (!thingNode || !targetNode)
                            return resolve();
                        lift(targetNode);
                        lift(otherTargetNode);
                        _.defer(function() {
                            if (!self.level.checkScreen())
                                return resolve();
                            if (otherTargetNode) {
                                otherTarget.owner = target.owner;
                                otherTarget.x = target.x;
                                otherTarget.y = target.y;
                                if (otherThingNode) {
                                    target.owner.carrying = otherTarget;
                                    otherTargetNode.style.transition = 'all 0.15s linear';
                                    otherTargetNode.style.left = (otherThingNode.offsetLeft + 8) + 'px';
                                    otherTargetNode.style.top = (otherThingNode.offsetTop + 8) + 'px';
                                    otherTargetNode.style.transform = 'scale(0.6)';
                                } else {
                                    otherTargetNode.style.transition = 'all 0.15s linear';
                                    otherTarget.render();
                                }
                            } else {
                                if (target.owner)
                                    target.owner.carrying = null;
                            }
                            target.owner = self;
                            target.x = target.y = -1;
                            self.carrying = target;
                            targetNode.style.transition = 'all 0.15s linear';
                            targetNode.style.left = (thingNode.offsetLeft + 8) + 'px';
                            targetNode.style.top = (thingNode.offsetTop + 8) + 'px';
                            targetNode.style.transform = 'scale(0.6)';
                            _.delay(function() {
                                if (!self.level.checkScreen())
                                    return resolve();
                                targetNode.style.transition = '';
                                if (otherTargetNode)
                                    otherTargetNode.style.transition = '';
                                target.render();
                                resolve();
                            }, 150);
                        });
                    });
                }
            };
            thing.render();
            return thing;
        }
    };
    return thingmod;
});
