function intro() {
    load_images([
        'title-main',
        'title-bat',
        'title-ball',
        'title-base1',
        'title-base2',
        'title-base3',
        'title-base4'
    ], function() {
        new_sprite('title-main').place(0, 0).anchor(0, 0);
        new_sprite('title-bat').place(234, 476).wiggle(0.85, 10);
        new_sprite('title-ball').place(313, 454).wiggle(0.75);
        new_sprite('title-base1').place(507, 516).wiggle(0.65);
        new_sprite('title-base2').place(663, 478).wiggle(0.80);
        new_sprite('title-base3').place(633, 363).wiggle(0.70);
        new_sprite('title-base4').place(538, 367).wiggle(0.9);
        load_images([
            'field',
            'dino1',
            'dino2',
            'baby1',
            'baby-squeek',
            'baby2',
            'baby3',
            'baby4',
            'dino3',
            'dino4',
            'dino5',
            'dino6',
            'dino7',
            'dino8',
            'bat',
            'ball',
            'curtain',
            'director1',
            'director2',
            'comet',
            'i-win',
            'baby5'
        ], function() {
            load_audio([
                'hi',
                'squeek',
                'what-cut',
                'waa',
                'its-right',
                'but',
                'you-are-not-gonna',
                'what',
                'oh-no',
                'oh',
                'i-win'
            ], ready);
        });
    });
}

intro();

function start() {
    clear();
    var field = new_sprite('field').place(250, 0).anchor(0, 0);
    var dino = new_sprite('dino1').place(900, 525).anchor(0.5, 1);
    var baby = new_sprite('baby1').place(915, 328).anchor(0.5, 1);
    var ball = new_sprite('ball').place(879, 255);
    dino.slideX(3, 480, function() {
        wait(0.6, hi);
    });
    dino.jumpY(1, 3, 50);

    var bat;
    function hi() {
        play_sound('hi', function() {
            dino.slide(2, 230, 525);
            baby.slide(2, 665, 328);
            ball.slide(2, 629, 255);
            field.slide(2, 0, 0, function() {
                dino.hide();
                dino = new_sprite('dino3').place(0, 0).anchor(0, 0);
                bat = new_sprite('bat').place(311, 484).anchor(0, 1);
                wait(1.2, squeek);
            });
        });
        dino.talk('dino2', [0.05, 0.45]);
    }

    function squeek() {
        play_sound('squeek', function() {
            wait(1, whatcut);
        });
        baby.talk('baby-squeek', [0, 0.5]);
    }

    function whatcut() {
        play_sound('what-cut', function() {
            wait(0.3, waa);
        });
        dino.talk('dino4', [0.08, 0.4, 1.26, 1.55]);
        wait(1.3, function() {
            bat.slide(0.5, 311, 550).rotate(0.5, 15);
        });
    }

    var curtain;
    function waa() {
        baby.setImage('baby2');
        play_sound('waa', function() {
            wait(0.5, function() {
                curtain = new_sprite('curtain');
                baby.hide();
                baby = new_sprite('baby4').place(665, 328).anchor(0.5, 1).slide(2, 665, 488);
                curtain.place(530, 0).bottom().anchor(0.5, 0).flip(0, 0, function() {
                    curtain.flip(2, 1, itsright);
                });
            });
        });
        ball.slide(0.5, 629, 336).rotate(0.5, -90);
        baby.talk('baby3', [0.15, 0.65]);
    }

    var director;
    function itsright() {
        director = new_sprite('director1').place(670, 460).anchor(0.5, 1);
        director.bottom().slide(1, 490, 460, function() {
            play_sound('its-right', function() {
                wait(0.5, but);
            });
            director.talk('director2', [0.1, 0.3, 0.4, 0.7]);
        });
    }

    function but() {
        play_sound('but');
        dino.talk('dino4', [0.05, 0.35]);
        director.slide(1, 670, 460, function() {
            director.hide();
            curtain.flip(1, 0, function() {
                curtain.hide();
            });
            baby.slide(2, 665, 328, function() {
                baby.hide();
                baby = new_sprite('baby1').place(665, 328).anchor(0.5, 1);
                ball.slide(0.3, 629, 255).rotate(0.3, 0);
                bat.slide(0.6, 311, 484).rotate(0.6, 0, function() {
                    wait(0.5, function() {
                        ball.slide(0.8, 599, 215, youarenotgonna);
                    })
                });
            });
        });
    }

    function youarenotgonna() {
        play_sound('you-are-not-gonna', function() {
            wait(0.5, function() {
                dino.setImage('dino5');
            });
        });
        dino.talk('dino4', [0.15, 0.3, 0.4, 0.55, 0.73, 0.92, 1.15, 1.35, 1.44, 1.67]);
        ball.scale(3, 1.5).slide(3, 299, 355, what);
    }

    function what() {
        play_sound('what');
        dino.talk('dino6', [0.1, 0.4]);
        ball.slide(2, 180, 415, ohno);
    }

    function ohno() {
        play_sound('oh-no');
        dino.talk('dino6', [0.03, 0.29, 0.55, 1.15]);
        ball.slide(0.7, 89, 455, function() {
            ball.slide(0.7, 79, 495, function() {
                ball.slide(0.7, 99, 525, function() {
                    ball.slide(0.9, 159, 535, function() {
                        oh();
                    });
                });
            });
        });
    }

    var comet;
    function oh() {
        comet = new_sprite('comet').place(800, 0).anchor(0, 1).scale(0, 0.6);
        comet.scale(7, 1.1).slide(7, 400, 250, function() {
            iwin();
        });
        wait(2, function() {
            dino.setImage('dino7');
            wait(2, function() {
                play_sound('oh');
                dino.talk('dino8', [0.04, 0.2]);
            })
        });
    }

    function iwin() {
        clear();
        new_sprite('i-win').place(0, 0).anchor(0, 0);
        new_sprite('baby5').place(377, 376).anchor(0.471, 0.626).wiggle(0.6, 2);
        wait(0.8, function() {
            play_sound('i-win');
            done();
        });
    }
}

function reset() {
    clear();
    intro();
}