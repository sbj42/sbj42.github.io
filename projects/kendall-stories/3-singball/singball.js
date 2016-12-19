function intro() {
    load_images([
        'title-main',
        'title-1',
        'title-2',
        'title-3',
        'title-4'
    ], function() {
        new_sprite('title-main').place(0, 0).anchor(0, 0);
        new_sprite('title-1').place(177, 78).wiggle(0.85, 10);
        new_sprite('title-2').place(626, 63).wiggle(0.75);
        new_sprite('title-3').place(196, 450).wiggle(0.65);
        new_sprite('title-4').place(552, 434).wiggle(0.80);
        load_images([
            'dino1',
            'dino2',
            'baby1',
            'baby2',
            'girls',
            'girls2',
            'ball1',
            'ball2',
            'ground',
            'ptera1',
            'ptera2',
            'sing1',
            'sing2',
            'lala1',
            'lala2',
            'comet',
            'dino3',
            'ohno',
            'oh',
            'no',
            'wing1',
            'wing2',
            'the-end'
        ], function() {
            load_audio([
                'eek',
                'waa',
                'what',
                'what2',
                'a-flying-singball',
                'a-what',
                'dino1',
                'dino2',
                'oh-no'
            ], ready);
        });
    });
}

intro();

function start() {
    clear();
    var ground = new_sprite('ground').place(0, 0).anchor(0, 0);
    var dino = new_sprite('dino1').place(0, 0).anchor(0, 0);
    var baby = new_sprite('baby1').place(0, 0).anchor(0, 0);
    var ball = new_sprite('ball1').place(0, 0).anchor(0, 0);
    var girls = new_sprite('girls').place(0, 0).anchor(0, 0);
    wait(1.5, function() {
        var ball2 = new_sprite('ball2').place(0, 0).anchor(0, 0).scale(0, 0.5).bottom()
            .scale(2, 1, function() {
                ball.hide();
                ball = ball2;
                ball.slide(4, 40, -576, lookup);
                dino.talk('dino2', [0.05, 0.9]);
                play_sound('eek', function() {
                    girls.talk('girls2', [0.1, 0.55]);
                    play_sound('what', function() {
                        baby.talk('baby2', [0.2, 1.6]);
                        play_sound('waa');
                    });
                });
            });
    });

    var ptera;
    function lookup() {
        ball.hide();
        ground.slide(3, 0, 550);
        dino.slide(3, 0, 550);
        baby.slide(3, 0, 550);
        girls.slide(3, 0, 550);
        ptera = new_sprite('ptera1').place(0, -550).anchor(0, 0);
        wait(1, function() {
            ptera.slide(2, 0, 0, function() {
                play_sound('what2', function() {
                    wait(1.5, aflyingsingball);
                });
                ptera.talk('ptera2', [0.2, 0.6]);
            }); 
        });
    }

    var sing;
    var lala;
    function aflyingsingball() {
        clear();
        sing = new_sprite('sing1').place(-200, 0).anchor(0, 0);
        lala = new_sprite('lala1').place(0, 0).anchor(0, 0);
        baby = new_sprite('baby1').place(0, 0).anchor(0, 0);
        wait(1.5, function() {
            play_sound('a-flying-singball', function() {
                wait(0.8, function() {
                    play_sound('a-what', function() {
                        wait(1, function() {
                            dino1();
                        });
                    });
                    lala.talk('lala2', [0.06, 0.3, 0.59, 0.9]);
                });
            });
            sing.talk('sing2', [0.04, 0.12, 0.35, 0.55, 0.58, 0.65, 1.55, 1.75, 1.98, 2.35]);
        });
    }

    var comet
    function dino1() {
        sing.slide(2, 200, 0);
        lala.slide(2, 400, 0);

        baby.slide(2, 400, 0, function() {
            comet = new_sprite('comet').place(1000, 0);
            comet.slide(4.5, -100, 250);
            wait(2, function() {
                play_sound('dino1', dino2);
                baby.talk('baby2', [0.05, 0.45, 0.5, 1.45]);
            });
        });
    }

    function dino2() {
        dino = new_sprite('dino3').place(-600, 0).anchor(0, 0);
        baby.slide(2, 1000, 0);
        dino.slide(2, 0, 0, function() {
            comet.hide();
            comet = new_sprite('ball1').place(0, -500).anchor(0, 0);
            comet.slide(3, 0, 0, splat);
            play_sound('dino2');
        });
    }

    var oh, no;
    function splat() {
        clear();
        comet = new_sprite('ohno').place(0, 40).anchor(0, 0);
        wait(0.8, function() {
            play_sound('oh-no', function() {
                wait(0.8, theend);
            });
            wait(0.05, function() {
                oh = new_sprite('oh').place(0, 40).anchor(0, 0);
            });
            wait(1.02, function() {
                no = new_sprite('no').place(0, 40).anchor(0, 0);
            });
        });
    }

    function theend() {
        comet.slide(3, 0, 600);
        oh.slide(3, 0, 600);
        no.slide(3, 0, 600);
        new_sprite('wing1').place(393, 263-600).anchor(154/200, 73/100).wiggle(0.6, 15)
            .slide(3, 393, 263);
        new_sprite('wing2').place(435, 256-600).anchor(6/200, 79/100).wiggle(0.6, -15)
            .slide(3, 435, 256);
        new_sprite('the-end').place(0, -600).anchor(0, 0)
            .slide(3, 0, 0, function() {
            done();
        });
    }
}

function reset() {
    clear();
    intro();
}