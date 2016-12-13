function intro() {
    load_images([
        'title-main',
        'title-notes1',
        'title-notes2',
        'title-notes3',
        'title-notes4'
    ], function() {
        new_sprite('title-main').place(0, 0).anchor(0, 0);
        new_sprite('title-notes1').place(294, 80).wiggle(0.55);
        new_sprite('title-notes2').place(584, 136).wiggle(0.65);
        new_sprite('title-notes3').place(234, 310).wiggle(0.75);
        new_sprite('title-notes4').place(398, 384).wiggle(0.6);
        load_images([
            'ground',
            'lala1',
            'lala2',
            'lala3',
            'lala4',
            'lala-walk',
            'lala-back',
            'lala-crawl',
            'sing-walk',
            'sing-back',
            'sing1',
            'sing2',
            'sing3',
            'sing4',
            'words1',
            'words2',
            'words3',
            'words4',
            'words5',
            'words6',
            'words7',
            'words8',
            'words9',
            'words10',
            'words11',
            'words12',
            'words13',
            'words14',
            'words15',
            'words16',
            'words17',
            'words18',
            'words19',
            'words20',
            'words21',
            'words22',
            'words23',
            'words24',
            'words25',
            'words26',
            'words27',
            'words28',
            'words29',
            'words30',
            'words31',
            'words32',
            'let',
            'crazy1',
            'crazy2',
            'crazy3',
            'crazy4',
            'crazy5',
            'curtains',
            'jail'
        ], function() {
            load_audio([
                'hi-hello',
                'i-am-lala',
                'dont-listen',
                'welcome',
                'lets-sing',
                'let-it-go',
                'you-dont-care',
                'crazy',
                'cut',
                'get-in-there',
                'argument',
                'sorry',
                'the-end',
                'bye'
            ], ready);
        });
    });
}

intro();

function start() {
    clear();
    new_sprite('ground').place(0, 0).anchor(0, 0);
    var lala = new_sprite('lala1');
    var sing = new_sprite('sing-walk');

    lala.place(0, 524).anchor(0.5, 1).slide(1, 412, 524, sayhello);
    
    function sayhello() {
        play_sound('hi-hello', function() {
            sing.place(0, 524).anchor(0.5, 1).slide(2, 304, 524, function() {
                sing.setImage('sing1');
            });
            wait(0.5, sayiamlala);
        });
        lala.talk('lala2', [0.05, 0.7, 1.35, 1.45, 1.5, 2.05]);
    }

    function sayiamlala() {
        play_sound('i-am-lala', function() {
            wait(0.8, saydontlisten);
        });
        lala.talk('lala2', [0, 0.15, 0.2, 0.35, 0.45, 0.65, 0.73, 0.95]);
    }

    function saydontlisten() {
        play_sound('dont-listen', function() { 
            wait(0.6, function() {
                sing.setImage('sing3');
                lala.setImage('lala1');
                wait(0.8, saywelcome);
            });
        });
        sing.talk('sing2', [0.05, 0.25, 0.3, 0.5, 0.72, 1, 1.05, 1.22, 1.26, 1.45, 1.55, 2.05, 2.12, 2.45, 2.77, 2.9, 2.95, 3.13, 3.16, 3.4, 3.43, 3.6]);
        wait(3, function() {
            lala.setImage('lala3');
            lala.talk('lala4', [0.74, 0.92, 1.12, 1.34, 1.39, 1.55]);
        });
    }

    function saywelcome() {
        play_sound('welcome', function() { 
            wait(0.6, sayletssing);
        });
        sing.talk('sing4', [0, 0.25, 0.3, 0.45, 0.5, 0.61, 0.66, 0.93, 1.07, 1.25]);
        lala.talk('lala2', [1.9, 2.1, 2.15, 2.3]);
    }

    function sayletssing() {
        play_sound('lets-sing', function() {
            wait(0.5, letitgo);
        });
        sing.talk('sing4', [0.02, 0.25, 0.42, 0.6, 1.15, 1.25, 1.57, 1.8]);
        lala.setImage('lala-walk').slide(2, 800, 524, function() {
            lala.hide();
        });
        sing.slide(2, 410, 540);
    }

    function letitgo() {
        play_sound('let-it-go', function() {
            for (var i = 0; i < word_sprites.length; i ++) {
                word_sprites[i].slide(0.5, '-=800', '+=0');
            }
            lala.setImage('lala-walk').flip(0, -1).place(800, 524).slide(1, 600, 524, youdontcare);
            wait(0.5, function() {
                for (var i = 0; i < word_sprites.length; i ++) {
                    word_sprites[i].hide();
                }
            });
        });
        var word_sprites = [];
        var word_delays = [0.08, 0.26, 0.5, 1.62, 1.8, 2.02, 3.1, 3.54, 3.78, 3.96, 4.42, 5.02, 6.21, 6.4, 6.62, 7.8, 7.96, 8.2,
            9.45, 9.7, 10.6, 11.02, 11.65, 12.13, 13.85, 14.57, 15.2, 16.42, 16.9, 17.3, 18.04, 18.77];
        for (var i = 0; i < word_delays.length; i ++) {
            wait(word_delays[i], (function(i) {
                return function() {
                    word_sprites.push(new_sprite('words'+(i+1)).place(0, 0).anchor(0, 0));
                };
            })(i));
        }
        sing.talk('sing4', [0.08, 0.22, 0.26, 0.38, 0.5, 1.58, 1.62, 1.75, 1.8, 1.9, 2.02, 2.7, 3.1, 3.5, 3.54, 3.75, 3.78, 3.9, 3.96, 4.35, 4.40, 4.9, 5.02, 6, 6.21, 6.35, 6.4, 6.5, 6.62, 7.45, 7.8, 7.94, 7.96, 8.08, 8.2, 9.1,
            9.45, 9.65, 9.7, 10, 10.05, 10.55, 10.6, 10.85, 11.02, 11.60, 11.65, 11.95, 12.13, 13.35, 13.85, 14.47, 14.57, 15.1, 15.2, 16.35, 16.42, 16.8, 16.9, 17.15, 17.3, 17.9, 18.04, 18.65, 18.77, 20.2]);
    }

    function youdontcare() {
        play_sound('you-dont-care', function() {
            crazy();
        });
        var letword = new_sprite('let').place(175, 80).anchor(0.5, 1);
        lala.setImage('lala1');
        wait(0.5, function() {
            letword.slide(2, '-=300', '+=0', function() {
                letword.hide();
            });
        });
        sing.talk('sing4', [0.15, 0.55]);
        lala.talk('lala2', [1.55, 1.70, 1.78, 2, 2.18, 2.80, 3.40, 4.05]);
        wait(2, function() {
            sing.setImage('sing1');
        });
    }

    function crazy() {
        play_sound('crazy', function() {
            for (var i = 0; i < word_sprites.length; i ++) {
                word_sprites[i].slide(0.5, '-=800', '+=0');
            }
            wait(0.5, function() {
                for (var i = 0; i < word_sprites.length; i ++) {
                    word_sprites[i].hide();
                }
                sing.setImage('sing3');
                wait(0.8, cut);
            });
        });
        var word_sprites = [];
        var word_delays = [0.08, 0.3, 0.85, 1.02, 2.55];
        for (var i = 0; i < word_delays.length; i ++) {
            wait(word_delays[i], (function(i) {
                return function() {
                    word_sprites.push(new_sprite('crazy'+(i+1)).place(0, 0).anchor(0, 0));
                };
            })(i));
        }
        lala.talk('lala2', [0.08, 0.2, 0.3, 045, 0.62, 0.8, 0.85, 0.9, 1.02, 1.45, 1.62, 2.2, 2.55, 3.03, 3.23, 4.55]);
        wait(2.5, function() {
            lala.slide(1.5, 500, 524);
            sing.slide(1.5, 310, 540);
        });
    }

    var curtains; 
    function cut() {
        play_sound('cut', function() {
            curtains = new_sprite('curtains');
            curtains.place(400, 0).bottom().anchor(0.5, 0).flip(0, 0, function() {
                curtains.flip(3, 1, function() {
                    getinthere();
                });
            });
        });
        sing.talk('sing4', [0.05, 0.5]);
    }

    function getinthere() {
        play_sound('get-in-there', function() {
            lala.setImage('lala-walk');
            lala.slide(1, 400, 524, function() {
                lala.setImage('lala-back');
                wait(0.5, function() {
                    lala.flip(0, 1).setImage('lala-walk');
                    lala.bottom().slide(1, 600, 524, function() {
                        sing.setImage('sing-walk');
                        sing.slide(1, 400, 540, function() {
                            sing.setImage('sing-back');
                            wait(0.5, function() {
                                sing.setImage('sing-walk');
                                sing.bottom().slide(1, 600, 540, function() {
                                    argument();
                                });
                            });
                        });
                    });
                });
            });
        });
        sing.talk('sing4', [0.05, 0.35, 0.75, 0.9, 0.94, 1.2, 1.25, 1.6]);
    }

    function argument() {
        play_sound('argument', sorry);
    }

    function sorry() {
        sing.setImage('sing1').rotate(0, -30).slide(1, 500, 524, function() {
            play_sound('sorry', function() {
                sing.rotate(1, 0).slide(1, 391, 536, function() {
                    sing.setImage('sing3');
                    lala.setImage('lala3').rotate(0, -30).slide(1, 549, 524, theend);
                });
            });
            sing.talk('sing2', [0.13, 0.35, 0.39, 0.7]);
        });
    }

    function theend() {
        play_sound('the-end', function() {
            wait(0.8, bye);
        });
        sing.talk('sing4', [0.05, 0.23, 0.25, 0.5]);
    }

    function bye() {
        curtains.hide();
        new_sprite('jail').place(0, 0).bottom().anchor(0, 1).slide(0.5, 0, 600, function() {
            lala.hide();
            new_sprite('lala-crawl').place(546, 562).anchor(0.5, 1);
            play_sound('bye');
            sing.talk('sing4', [0.05, 0.7]);
            done();
        });
    }
}

function reset() {
    clear();
    intro();
}