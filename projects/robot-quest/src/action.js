'use strict';
define(['lib/underscore'], function(_) {

    var actionmod = null;
    actionmod = {

        testCondition: function(level, condition) {
            var result;
            condition = condition.trim();
            if ((result = /^(\S+)\s+state\s+is\s+(.*)$/i.exec(condition))) {
                var thing = result[1];
                var state = result[2];
                thing = level.getThing(thing);
                if (!thing)
                    return false;
                return thing.state == state;
            } else if ((result = /^(\S+)\s+is\s+carrying\s+nothing$/i.exec(condition))) {
                var thing = result[1];
                thing = level.getThing(thing);
                if (!thing)
                    return false;
                return !thing.carrying;
            } else if ((result = /^(\S+)\s+is\s+carrying\s+(\S+)$/i.exec(condition))) {
                var thing = result[1];
                var item = result[2];
                thing = level.getThing(thing);
                item = level.getThing(item);
                if (!thing || !item)
                    return false;
                return thing.carrying == item;
            } else if ((result = /^(\S+)\s+is\s+leading\s+(.*)$/i.exec(condition))) {
                var thing = result[1];
                var target = result[2];
                thing = level.getThing(thing);
                target = level.getThing(target);
                if (!thing || !target)
                    return false;
                return thing.leads === target;
            } else if ((result = /^variable\s+(\S+)\s+equals\s+(.*)$/i.exec(condition))) {
                var variable = result[1];
                var value = result[2];
                var curValue = level.variables[variable] || 0;
                return value == curValue;
            } else if (condition == 'otherwise') {
                return false;
            } else {
                console.error('condition string doesn\'t match any expected patterns: ' + condition);
                return false;
            }
        },

        run: function(level, actions) {
            var ret = Promise.resolve();
            if (!actions)
                return ret;
            if (!_.isArray(actions))
                actions = [actions];
            _.every(actions, function(action) {
                console.info(action);
                if (_.isString(action)) {
                    var result;
                    action = action.trim();
                    if ((result = /^(\S+)\s+walks((?:\s+(?:up|down|left|right))+)$/i.exec(action))) {
                        action = {
                            type: 'thing walks directions',
                            thing: result[1],
                            directions: result[2].trim().split(/\s+/)
                        };
                    } else if ((result = /^(\S+)\s+walks\s+toward\s+(\S+)$/i.exec(action))) {
                        action = {
                            type: 'thing walks toward target',
                            thing: result[1],
                            target: result[2]
                        };
                    } else if ((result = /^(\S+)\s+moves((?:\s+(?:up|down|left|right))+)$/i.exec(action))) {
                        action = {
                            type: 'thing moves directions',
                            thing: result[1],
                            directions: result[2].trim().split(/\s+/)
                        };
                    } else if ((result = /^(\S+)\s+moves\s+toward\s+(\S+)$/i.exec(action))) {
                        action = {
                            type: 'thing moves toward target',
                            thing: result[1],
                            target: result[2]
                        };
                    } else if ((result = /^(\S+)\s+bumps((?:\s+(?:up|down|left|right))+)$/i.exec(action))) {
                        action = {
                            type: 'thing bumps direction',
                            thing: result[1],
                            directions: result[2].trim().split(/\s+/)
                        };
                    } else if ((result = /^(\S+)\s+bumps\s+toward\s+(\S+)$/i.exec(action))) {
                        action = {
                            type: 'thing bumps toward target',
                            thing: result[1],
                            target: result[2]
                        };
                    } else if ((result = /^(\S+)\s+takes\s+(\S+)$/i.exec(action))) {
                        action = {
                            type: 'thing takes target',
                            thing: result[1],
                            target: result[2]
                        };
                    } else if ((result = /^(\S+)\s+says\s+(.*)$/i.exec(action))) {
                        action = {
                            type: 'thing says messages',
                            thing: result[1],
                            messages: result[2].trim().split(/\s+\/\s+/)
                        };
                    } else if ((result = /^(\S+)\s+is\s+destroyed$/i.exec(action))) {
                        action = {
                            type: 'thing is destroyed',
                            thing: result[1]
                        };
                    } else if ((result = /^next\s+level$/i.exec(action))) {
                        action = {
                            type: 'next level'
                        };
                    } else if ((result = /^wait\s+(\S+)\s+seconds$/i.exec(action))) {
                        action = {
                            type: 'wait number seconds',
                            number: result[1]
                        };
                    } else if ((result = /^(\S+)\s+state\s+becomes\s+(.*)$/i.exec(action))) {
                        action = {
                            type: 'thing state becomes string',
                            thing: result[1],
                            string: result[2]
                        };
                    } else if ((result = /^(\S+)\s+image\s+becomes\s+(.*)$/i.exec(action))) {
                        action = {
                            type: 'thing image becomes string',
                            thing: result[1],
                            string: result[2]
                        };
                    } else if ((result = /^(\S+)\s+sets\s+floor\s+to\s+(.*)$/i.exec(action))) {
                        action = {
                            type: 'thing sets floor to spec',
                            thing: result[1],
                            spec: result[2]
                        };
                    } else if ((result = /^set\s+variable\s+(\S+)\s+to\s+(.*)$/i.exec(action))) {
                        action = {
                            type: 'set variable to value',
                            variable: result[1],
                            value: result[2]
                        };
                    } else if ((result = /^increment\s+variable\s+(\S+)$/i.exec(action))) {
                        action = {
                            type: 'increment variable',
                            variable: result[1]
                        };
                    } else if ((result = /^(\S+)\s+leads\s+(\S+)$/i.exec(action))) {
                        action = {
                            type: 'thing leads target',
                            thing: result[1],
                            target: result[2]
                        };
                    } else if ((result = /^(\S+)\s+stops\s+leading$/i.exec(action))) {
                        action = {
                            type: 'thing stops leading',
                            thing: result[1]
                        };
                    } else {
                        console.error('action string doesn\'t match any expected patterns: ' + action);
                        return true;
                    }
                }
                if (action.type == 'thing walks directions' || action.type == 'thing walks direction')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        return thing.walk(action.directions || action.direction);
                    });
                else if (action.type == 'thing walks toward target')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        var target = level.getThing(action.target);
                        if (!thing || !target)
                            return;
                        return thing.walk(thing.toward(target));
                    });
                else if (action.type == 'thing moves directions' || action.type == 'thing moves direction')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        return thing.move(action.directions || action.direction);
                    });
                else if (action.type == 'thing moves toward target')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        var target = level.getThing(action.target);
                        if (!thing || !target)
                            return;
                        return thing.move(thing.toward(target));
                    });
                else if (action.type == 'thing bumps direction')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        return thing.bump(action.directions || action.direction);
                    });
                else if (action.type == 'thing bumps toward target')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        var target = level.getThing(action.target);
                        if (!thing || !target)
                            return;
                        return thing.bump(thing.toward(target));
                    });
                else if (action.type == 'thing takes target')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        var target = level.getThing(action.target);
                        if (!thing || !target)
                            return;
                        return thing.take(target);
                    });
                else if (action.type == 'thing state becomes string')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        thing.state = action.string;
                    });
                else if (action.type == 'thing image becomes string')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        thing.image = action.string.replace('<player>', level.world.game.playerImageBase);
                        thing.render();
                    });
                else if (action.type == 'thing sets floor to spec')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        level.setFloor(thing.x, thing.y, action.spec);
                    });
                else if (action.type == 'thing says messages' || action.type == 'thing says message')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        return thing.say(action.messages || action.message);
                    });
                else if (action.type == 'thing is destroyed')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        thing.destroy();
                    });
                else if (action.type == 'next level') {
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        level.world.game.nextLevel();
                    });
                    return false; // no more actions
                } else if (action.type == 'wait number seconds')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        return new Promise(function(resolve) {
                            _.delay(resolve, action.number * 1000);
                        });
                    });
                else if (action.type == 'set variable to value')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        level.variables[action.variable] = action.value;
                    });
                else if (action.type == 'increment variable')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var value = level.variables[action.variable] || 0;
                        level.variables[action.variable] = value + 1;
                    });
                else if (action.type == 'thing leads target')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        var target = level.getThing(action.target);
                        if (!thing || !target)
                            return;
                        return thing.lead(target);
                    });
                else if (action.type == 'thing stops leading')
                    ret = ret.then(function() {
                        if (!level.checkScreen())
                            return;
                        var thing = level.getThing(action.thing);
                        if (!thing)
                            return;
                        return thing.lead(null);
                    });
                else
                    console.error('unexpected action type: ' + action.type);
                return true; // continue
            });
            return ret;
        }
    };
    return actionmod;
});