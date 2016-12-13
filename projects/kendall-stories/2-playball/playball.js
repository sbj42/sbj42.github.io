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
            'dino3',
            'dino4',
            'bat',
            'ball'
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

    function waa() {
        baby.setImage('baby2');
        play_sound('waa', function() {

        });
        ball.slide(0.5, 629, 336).rotate(0.5, -90);
        baby.talk('baby3', [0.15, 0.65]);
    }
}

function reset() {
    clear();
    intro();
}