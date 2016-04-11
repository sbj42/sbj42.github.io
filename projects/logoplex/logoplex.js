var ww = 0, wh = 0;
var lw = 0, lh = 0;
var phase = '';
var idx = 0, logo = null;
var timer = null, timer_end = null, timer_last = 0;
var qscore = 0;
var scores = [];
var categories = {};

var debug = false;

var qcount = debug ? 1 : 10;
var time_3 = debug ? 3 : 12;
var time_1 = time_3 * 1 / 3;
var time_2 = time_3 * 2 / 3;

jQuery.Color.hook('fill stroke');

function onresize() {
    var w = $(this);
    ww = w.width();
    wh = w.height();
    $('#attempts, #input').css('width', ww / 2 - 50);
}

function set_phase(p) {
    phase = p;
}

function start() {
    if (phase != 'intro')
        return;
    set_phase('');
    var j, x, i;
    for (i = logos.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = logos[i - 1];
        logos[i - 1] = logos[j];
        logos[j] = x;
    }
    idx = 0;
    scores = [];
    categories = {};
    logo = null;
    $('#title').animate({
        marginTop: 0,
        fontSize: 25,
        opacity: 0
    }, 1500, 'swing', function() {
        $('#title').hide();
    });
    $('#begin').animate({
        right: -150,
        opacity: 0
    }, 700, 'swing', function() {
        $('#begin').hide();
    });
    $('#explain').animate({
        left: -150,
        opacity: 0
    }, 700, 'swing', function() {
        $('#explain').hide();
    });
    var ct = debug ? 200 : 1000;
    $('#starttimer').show().css({
        top: (wh - $('#starttimer').height()) / 2
    }).text('3').animate({
        top: wh / 2 - $('#starttimer').height()
    }, ct*3, 'linear');
    setTimeout(function() {
        $('#starttimer').text('2');
        setTimeout(function() {
            $('#starttimer').text('1');
            setTimeout(function() {
                $('#starttimer').hide();
                $('#inputbox').css({
                    right: -300
                });
                $('#progress').show().animate({
                    opacity: 1,
                    right: 50
                }, 400, 'swing');
                set_phase('answer');
                question();
            }, ct);
        }, ct);
    }, ct);
}

function question() {
    if (phase != 'answer')
        return;
    if (idx == qcount) {
        done();
        return;
    }
    set_phase('');
    logo = logos[idx++ % logos.length];
    $('#progress').text(idx + ' / ' + qcount);
    $('#attempts').empty();
    $('#input').val('');
    $('body').animate({
        backgroundColor: logo.background,
        color: logo.foreground
    }, 700, 'swing');
    $('#input').animate({
        borderColor: logo.foreground
    }, 700, 'swing');
    $('#timerpts').animate({
        fill: logo.foreground
    }, 400, 'swing');
    $('#timerarc').animate({
        stroke: logo.foreground,
        opacity: 0
    }, 400, 'swing');
    $('#next, #skip').animate({
        right: -150,
        opacity: 0
    }, 700, 'swing', function() {
        $('#next, #skip').hide();
    });
    $('#inputbox').show().animate({
        right: 50,
        opacity: 1
    }, 500, 'swing');
    $('#answerbox').animate({
        right: -300,
        opacity: 0
    }, 500, 'swing');
    $('#logo2').show().animate({
        left: (ww - lw) / 2 - 60,
        opacity: 0
    }, 400);
    $('#logo1').show().animate({
        left: ww / 2,
        opacity: 0
    }, 400, 'easeInBack', function() {
        $.ajax({
            url: 'data/' + logo.id + '/1.svg',
            dataType: 'text',
        }).done(function(svg) {
            $('#input').focus().on('blur', function() {
                $('#input').focus();
            });
            set_phase('question');
            $('#timer').show().animate({
                right: 50,
                opacity: 1
            }, 300, 'swing');
            $('#timerpts').text(qscore = 3);
            $('#timerarc').animate({
                opacity: 1
            }, 200, 'swing');
            timer_end = new Date();
            timer_last = time_3;
            timer_end.setSeconds(timer_end.getSeconds() + timer_last);
            timer = setInterval(update_timer, 50);
            var mw = (ww / 2) * 0.9;
            var mh = (wh * 2 / 3) * 0.9;
            if (logo.width / logo.height > mw/mh) {
                lw = mw;
                lh = mw * logo.height / logo.width;
            } else {
                lh = mh;
                lw = mh * logo.width / logo.height;
            }
            $('#logo2').html(svg).css({
                top: (wh - lh) / 2,
                left: (ww - lw) / 2 + 60,
                width: lw * 2,
                height: lh * 2,
                opacity: 0
            });
            if (!logo.nobgimage) {
                $('#logo2').animate({
                    left: (ww - lw) / 2,
                    opacity: 0.15
                }, 400);
            }
            $('#logo2 > svg').first().attr({
                width: null,
                height: null
            });
            $('#logo1').html(svg).css({
                top: wh / 2 - lh * 2 / 3,
                left: - lw / 2,
                width: lw,
                height: lh,
                opacity: 0
            }).animate({
                left: (ww / 2 - lw) / 2,
                opacity: 1
            }, 400, 'easeOutBack');
            $('#logo1 > svg').first().attr({
                width: null,
                height: null
            });
        });
    });
}

function levenshtein(str1, str2) {
    var m = str1.length,
    n = str2.length,
    d = [],
    i, j;
    if (!m) return n;
    if (!n) return m;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (j = 1; j <= n; j++) {
        for (i = 1; i <= m; i++) {
            if (str1[i-1] == str2[j-1]) d[i][j] = d[i - 1][j - 1];
            else d[i][j] = Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]) + 1;
        }
    }
    return d[m][n];
}

function submit(text_) {
    if (phase != 'question' && phase != 'timeout')
        return;
    text = text_.replace(/\s*/, '');
    if (text == '')
        return;
    text.toLowerCase();
    var accepted = false;
    $.each(logo.accept, function(index, accept) {
        if (text.indexOf(accept) >= 0
            || (text.length > 3 && levenshtein(text, accept) < 3))
            accepted = true;
    });
    $('#input').val('');
    if (accepted) {
        answer();
    } else {
        $('#attempts').prepend('<div></div>');
        $($('#attempts').children()[0]).text('not ' + text_);
    }
}

function update_timer() {
    if (phase != 'question') {
        clearTimeout(timer);
        return;
    }
    var t = (timer_end - new Date()) / 1000;
    if (timer_last >= time_2 && t < time_2)
        $('#timerpts').text(qscore = 2);
    if (timer_last >= time_1 && t < time_1)
        $('#timerpts').text(qscore = 1);
    if (t <= 0) {
        timeout();
        return
    }
    $('#timerarc').show();
    var a = 360 * t / time_3;
    var x = 25 - 23 * Math.sin(a * Math.PI / 180);
    var y = 25 - 23 * Math.cos(a * Math.PI / 180);
    $('#timerarc').attr('d', 'M25,2 A23,23 0 ' + (a >= 180 ? '1' : '0') + ' 0 ' + x + ',' + y);
    timer_last = t;
}

function timeout() {
    if (phase != 'question')
        return;
    qscore = 0;
    $('#timerpts').text('0');
    $('#timerarc').hide();
    clearInterval(timer);
    set_phase('timeout');
    $('#skip').show().animate({
        right: 50,
        opacity: 1
    }, 700, 'swing');
}

function skip() {
    if (phase != 'timeout')
        return;
    answer();
}

function answer() {
    scores.push(qscore);
    if (!(logo.category in categories))
        categories[logo.category] = [];
    categories[logo.category].push(qscore);
    set_phase('answer');
    clearInterval(timer);
    $('#attempts').empty();
    $.ajax({
        url: 'data/' + logo.id + '/2.svg',
        dataType: 'text',
    }).done(function(svg) {
        if (phase == 'answer') {
            $('#logo1').html(svg);
            $('#logo1 > svg').first().attr({
                width: null,
                height: null
            });
        }
    });
    $('#next').show().animate({
        right: 50,
        opacity: 1
    }, 700, 'swing');
    $('#skip').animate({
        right: -150,
        opacity: 0
    }, 700, 'swing', function() {
        $('#skip').hide();
    });
    $('#inputbox').animate({
        right: -300,
        opacity: 0
    }, 500, 'swing', function() {
        if (phase == 'answer')
            $('#inputbox').hide();
    });
    $('#answerbox').html('<a target="_blank" href="' + logo.link_url + '">' + logo.answer + '</a><br/>Category: ' + logo.category);
    $('#answerbox').delay(200).show().animate({
        right: -300,
        right: 50,
        opacity: 1
    }, 500, 'swing');
}

function done() {
    if (phase != 'answer')
        return;
    phase = 'done';
    $('body').animate({
        backgroundColor: '#297f9b',
        color: '#fff'
    }, 700, 'swing');
    $('#logo2').animate({
        left: (ww - lw) / 2 - 60,
        opacity: 0
    }, 400, function() {
        $('logo2').hide();
    });
    $('#logo1').animate({
        left: ww / 2,
        opacity: 0
    }, 400, 'easeInBack', function() {
        $('logo1').hide();
    });
    $('#progress').show().animate({
        opacity: 0,
        right: -150
    }, 400, 'swing', function() {
        $('progress').hide();
    });
    $('#next, #skip, #begin, #timer').animate({
        right: -150,
        opacity: 0
    }, 700, 'swing', function() {
        $('#next, #skip, #begin, #timer').hide();
    });
    $('#answerbox, #inputbox').animate({
        right: -300,
        opacity: 0
    }, 700, 'swing', function() {
        $('#answerbox, #inputbox').hide();
    });
    $('#title').show().animate({
        marginTop: 50,
        fontSize: 45,
        opacity: 1
    }, 1000, 'swing');
    $('#scorebox, #credit').show().animate({
        opacity: 1,
        left: 50
    }, 700, 'swing');
    $('#catbox').show().animate({
        opacity: 1,
        right: 50
    }, 700, 'swing');
    setTimeout(function() {
        if (phase != 'done')
            return;
        $('#again').show().animate({
            right: 50,
            opacity: 1
        }, 700, 'swing');
    }, 1000);
    var total = 0;
    var possible = 0;
    var b = [0,0,0,0];
    $('#bd0, #bd1, #bd2, #bd3').empty();
    $.each(scores, function(i, s) {
        b[s]++;
        $('#bd' + s).append('<div class="bdx"></div>');
        total += s; possible += 3;
    });
    $('#score').text(total);
    $('#maxscore').text(possible);
    $('#cats').empty();
    var cats = [];
    $.each(categories, function(c) {
        cats.push(c);
    });
    cats.sort();
    $.each(cats, function(i, c) {
        var ctotal = 0;
        var cpossible = 0;
        $.each(categories[c], function(i, s) {
            ctotal += s; cpossible += 3;
        });
        $('#cats').append('<tr><td class="cat">' + c + '</td><td class="cpts">' + ctotal + '</td><td>/</td><td class="cpts">' + cpossible +'</td></tr>');
    });
}

function again() {
    if (phase != 'done')
        return;
    phase = 'intro';
    $('#scorebox, #credit').animate({
        opacity: 0,
        left: -150
    }, 700, 'swing', function() {
        $('#scorebox, #credit').hide();
    });
    $('#catbox, #again').show().animate({
        opacity: 0,
        right: -150
    }, 700, 'swing', function() {
        $('#catbox, #again').hide();
    });
    start();
}

$(document).ready(function() {
    onresize();
    $(window).on('resize', onresize);

    set_phase('intro');
    setTimeout(function() {
        if (phase != 'intro')
            return;
        $('#begin').show().animate({
            opacity: 1,
            right: 50
        }, 700, 'swing');
        $('#explain').show().animate({
            opacity: 1,
            left: 50
        }, 700, 'swing');
    }, 500);
    $('#begin').click(start);
    $('#next').click(question);
    $('#skip').click(answer);
    $('#again').click(again);
    $('#input').keyup(function(event) {
        if (event.keyCode == 13)
            submit($('#input').val());
    });
    $(window).keyup(function(event) {
        if (event.keyCode == 27)
            skip();
        if (event.keyCode == 32) {
            again();
            question();
            start();
        }
    });
});
