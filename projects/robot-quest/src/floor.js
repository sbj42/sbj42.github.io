'use strict';
define(['lib/underscore'], function(_) {
    var floormod = null;
    floormod = {
        create: function(floorSpec, x, y, level) {
            if (!floorSpec)
                floorSpec = 'default';
            if (_.isString(floorSpec)) {
                if (floorSpec == 'ice') {
                    floorSpec = {
                        image: 'floors/ice',
                        slippery: true
                    };
                } else if (floorSpec == 'ladder') {
                    floorSpec = {
                        image: 'floors/ladder'
                    };
                } else if (floorSpec == 'default') {
                    if (level.defaultFloor)
                        floorSpec = level.defaultFloor;
                    else
                        floorSpec = {
                            image: './default-floor'
                        };
                } else if (floorSpec == 'none') {
                    return null;
                } else {
                    floorSpec = {
                        image: 'floors/' + floorSpec
                    };
                }
            }
            var floor = {
                level: level,
                x: x,
                y: y,
                nodeId: 'floor_' + x + '_' + y,

                spec: floorSpec,
                image: floorSpec.image || 'unknown',
                slippery: floorSpec.slippery || false,

                getNode: function() {
                    return document.getElementById(this.nodeId);
                },

                render: function() {
                    var floorNode = this.getNode();
                    if (!floorNode) {
                        floorNode = document.createElement('div');
                        floorNode.id = this.nodeId;
                        floorNode.className = 'floor';
                    }
                    floorNode.style.left = this.x * this.level.tileSize + 'px';
                    floorNode.style.top = this.y * this.level.tileSize + 'px';
                    floorNode.style.width = this.level.tileSize + 'px';
                    floorNode.style.height = this.level.tileSize + 'px';
                    floorNode.style.backgroundImage = 'url(' + this.level.imageUrl(this.image) + ')';
                    if (!floorNode.parentNode)
                        document.getElementById('level').appendChild(floorNode);
                },

                destroy: function() {
                    var floorNode = this.getNode();
                    if (floorNode)
                        floorNode.parentNode.removeChild(floorNode);
                }
            };
            floor.render();
            return floor;
        }
    };
    return floormod;
});