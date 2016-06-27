// ideas:
//   a food you don't have to kill, that restores 1 hp, so free move but only once
//   a space you can't shock from
//   a space that costs extra hp to pass through
//   a food that moves away from you
//   tunnels
//   pushable boulders/whatever
//   a food that when you eat it you get longer

// todo:
//   url fragments so back button works
//   more levels
//   music

// issues:
//   no tutorial for plants yet

var svgNS = 'http://www.w3.org/2000/svg';

var TR = 42; // tile center-to-corner

var GLG = 4; // gridline gap
var GLWA = 0.4; // gridline wiggle amplitude
var GLWI = 0.2; // gridline wiggle inset

var MR = 6; // map center-to-corner

var FOODHP = 4;
var MOVEHP = 1;
var SHOCKHP = 3;
var MAXHP = 20;

var DEBUG = true;

var STARTTIME = new Date().getTime();

$.cookie.json = true;

function time() {
    return ((new Date()).getTime() - STARTTIME)/1000;
}

var perlin1 = (function() { // 1d perlin noise
    var N = 0x1000;
    var BM = 0xff;
    var B = 0x100;

    var p = [];
    var g1 = [];

    function init() {
        var i, j, k;
        for (i = 0; i < B; i ++) {
            p.push(i);
            g1.push(Math.random() * 2 - 1);
        }
        while (i--) {
            k = p[i];
            j = Math.floor(Math.random() * B);
            p[i] = p[j];
            p[j] = k;
        }
        for (i = 0; i < B + 2; i ++) {
            p.push(p[i]);
            g1.push(g1[i]);
        }
    }

    function s_curve(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    function lerp(t, a, b) {
        return a + t * (b - a);
    }

    function noise1(x) {
        var t = x + N;
        var b0 = Math.floor(t) & BM;
        var b1 = (b0 + 1) & BM;
        var r0 = t - Math.floor(t);
        var r1 = r0 - 1.0;
        var sx = s_curve(r0);
        var u = r0 * g1[ p[ b0 ] ];
        var v = r1 * g1[ p[ b1 ] ];
        return lerp(sx, u, v);
    }

    init();
    return noise1;
})();

function preloadsvg(images, callback) {
    var loaded = 0;
    function onload() {
        if (++loaded == images.length && callback)
            callback();
    }
    $.each(images, function(i, image) {
        var img = new Image();
        img.onload = onload;
        img.onerror = onload;
        img.onabort = onload;
        img.src = 'svg/' + image + '.svg';
    });
}

var LEVELS = [
    {
        "id": "T1",
        "name": "Eel-22",
        "map": [
            "*************",
            "*************",
            "*************",
            "*******  p***",
            "*****p    ***",
            "****p  1  ***",
            "****     ****",
            "***     p****",
            "***    p*****",
            "***p  *******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-1,1,-1,2,0,2],
        "hp": 1000
        // wsw*s (7)
    },
    {
        "id": "T2",
        "name": "The Eel in the Rye",
        "map": [
            "*************",
            "*************",
            "*******p ****",
            "*******  ****",
            "******  p  **",
            "******    p**",
            "****     ****",
            "**p  2 ******",
            "**  p  ******",
            "****  *******",
            "**** p*******",
            "*************",
            "*************"
        ],
        "eel": [1,-1,1,-2,0,-2],
        "hp": 12
        // qaqqa*s (9)
    },
    {
        "id": "T3",
        "name": "Gone With the Eel",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "*****  p*****",
            "****    p****",
            "****  3  ****",
            "****p    ****",
            "*****p  *****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-2,0,-2,-1,-1,-1,-1,-2,0,-2],
        "hp": 9
        // sassw*q (9)
    },
    {
        "id": "T4",
        "name": "Of Eels and Men",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "*****1  p****",
            "****   2 ****",
            "***  2   ****",
            "**   pp1 ****",
            "*****  p*****",
            "*****  ******",
            "***** *******",
            "*************",
            "*************"
        ],
        "eel": [-2,0,-3,0,-3,1,-4,1],
        "hp": 9
        // wssas*wwqqaassa (9)
    },
    {
        "id": "T5",
        "name": "The Eels of Wrath",
        "map": [
            "*************",
            "*************",
            "*************",
            "***** 0******",
            "*****  ******",
            "***     1****",
            "***     1****",
            "*****  ******",
            "***** 0******",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-2,0,-3,0,-3,-1,-2,-1],
        "hp": 19
        // ssaaqwwwwwsaasa*sw (19)
    },

    {
        "id": "G brave",
        "name": "Brave New Eel",
        "map": [
            "*************",
            "*************",
            "*************",
            "******   ****",
            "*****0 p  ***",
            "*****     ***",
            "***  p p  ***",
            "***  2  *****",
            "***  p 0*****",
            "****   ******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [0,0,0,-1,-1,-1],
        "hp": 20
        // as*aqw*q (12*)
        // a*a*swqwwwqasaaq (20**)
    },
    {
        "id": "G rises",
        "name": "The Eel Also Rises",
        "map": [
            "*************",
            "*************",
            "*************",
            "********* ***",
            "*****p  0 ***",
            "*****   1 ***",
            "***     0p***",
            "*** p11 *****",
            "***     *****",
            "*** *********",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-3,0,-3,1,-3,2],
        "hp": 11
        // sss*aqwssw*s (8)
        // sss*aqwwswss*a (10*)
        // ssssw*wsaaqqa*q (11**)
    },
    {
        "id": "G call",
        "name": "The Call of the Eel",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "****   0p****",
            "****  1 p****",
            "**** 14 p****",
            "****0   p****",
            "****ppppp****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-1,-2,-2,-2,-2,-1],
        "hp": 14
        // aq*asws*sa*q (10
        // ssaaaqq*qwsw*s*a (14**)
    },
    {
        "id": "G farm",
        "name": "Eel Farm",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****   p****",
            "**** 1   p***",
            "*** 11 p  ***",
            "***       ***",
            "***0 p 11 ***",
            "***p   1 ****",
            "****p0  *****",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [2,-2,2,-1,3,-1,3,0,3,1],
        "hp": 11
        // qqaaqq*wswsaaaa*ss*wwqa (10)
        // qqaass*aqqwqq*wwsasaaaqassw (11*)
        // qqaass*aqqwqw*wqaqaasasasws (11**)
    },
    {
        "id": "G wonderland",
        "name": "Eel in Wonderland",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****   *****",
            "***** 1 0****",
            "*****   2**p*",
            "**p**3   ****",
            "*****0 1 ****",
            "******   ****",
            "*************",
            "***p*********",
            "*************",
            "*************"
        ],
        "eel": [-1,-3,0,-3,1,-3],
        "hp": 14
        // aas*a*qwwssaas*wqaa (14)
        // aasa*s*aqqwwwsasws*a (14**)
    },
    {
        "id": "G fury",
        "name": "The Eel and the Fury",
        "map": [
            "*************",
            "*************",
            "******pp*****",
            "******  p****",
            "****** 1 p***",
            "****** 21 p**",
            "**       0p**",
            "**  12 ******",
            "***  1 ******",
            "****  0******",
            "*****  ******",
            "*************",
            "*************"
        ],
        "eel": [-4,0,-4,1,-3,1,-3,2,-2,2,-2,3,-1,3,-1,4,0,4],
        "hp": 13
        // ssssaa*qqqwsswsww*s*a*s (11)
        // ssssaa*aqwqwswsss*swq*q*w (13**)
    },
    {
        "id": "G galaxy",
        "name": "The Eel's Guide to the Galaxy",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "****0 1*  0**",
            "**** p   p **",
            "***  1 p1  **",
            "*** pp p ****",
            "***  1 1 ****",
            "*****p ******",
            "*****  ******",
            "*************",
            "*************"
        ],
        "eel": [0,3,0,4,-1,4],
        "hp": 20
        // www*wss*aaaqqqqqwwsssww (13)
        // www*wss*wssaaqqaaqqwwqqwwssaaaaq (20**)
    },
    {
        "id": "G nest",
        "name": "One Flew over the Eel's Nest",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****   p ***",
            "*****  10p***",
            "***   1   ***",
            "*** 312   ***",
            "***   11  ***",
            "***p0   *****",
            "*** p   *****",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-1,2,-1,3,0,3,1,3,1,2],
        "hp": 9
        // ss*wqq*w*s*ww*saaqqq (6)
        // qws*ww*qaass*www*ssaqaa (9**)
    },

    {
        "id": "C clockwork",
        "name": "A Clockwork Eel",
        "map": [
            "*************",
            "*******p*****",
            "*************",
            "*************",
            "****p   p****",
            "****  3  **p*",
            "**** 4p2 ****",
            "*p**0 1  ****",
            "****p0  p****",
            "*****p ******",
            "*****  ******",
            "****  *******",
            "*************"
        ],
        "eel": [0,2,0,3,0,4,-1,4,-1,5,-2,5],
        "hp": 20
        // swswwqw*q*aqqa*sa*ssw (19)
        // qwqw*swwssasaa*q*qqwwssa (20**)
    },
    {
        "id": "C cristo",
        "name": "The Eel of Monte Cristo",
        "map": [
            "*************",
            "*************",
            "******pp**p**",
            "******pp*****",
            "****    *****",
            "**** 3 2  ***",
            "**       0***",
            "**   2 4 ****",
            "*****    ****",
            "***** 0******",
            "**p**********",
            "*************",
            "*************"
        ],
        "eel": [-2,0,-3,0,-4,0,-4,1,-3,1,-2,1],
        "hp": 18
        // sss*s*wq*qq*aass (14)
        // sss*s*s*wqq*qqaaaaswws (18**)
    },
    {
        "id": "C red",
        "name": "The Hunt for Red Eel",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****   *****",
            "***** p *****",
            "*** 1 4 1 ***",
            "***03 4 30***",
            "*** 1 4 1 ***",
            "*************",
            "*************",
            "******p******",
            "*************",
            "*************"
        ],
        "eel": [1,-2,1,-3,0,-3],
        "hp": 11
        // aa*a*s*wwqa*qqa*q*wsws*aaqqww (11)
        // aa*a*s*wswqqa*qqa*swwqaaq*qws*w (13**)
    },
    {
        "id": "C midsummer",
        "name": "A Midsummer Night's Eel",
        "map": [
            "*************",
            "*************",
            "******ppp****",
            "*************",
            "*************",
            "*****2130****",
            "**p**131 ****",
            "**p**312 ****",
            "**p**0   ****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [2,1,2,2,1,2],
        "hp": 8
        // w*q*a*q*w*q*asww*qasws (5)
        // w*q*a*q*w*q*aaswww*qassswq (8**)
    },
    {
        "id": "C interview",
        "name": "Interview With the Eel",
        "map": [
            "*************",
            "*************",
            "*************",
            "******pp*****",
            "*****1  0****",
            "****12   ****",
            "****31  *****",
            "****12   ****",
            "*****1  0****",
            "******pp*****",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [0,0,0,1,1,1,1,0,1,-1,0,-1,0,-2],
        "hp": 11
        // *q*w*wssaqaqa*q*wwssaqaa (7)
        // *q*w*wsssaqaaqqwswqq*aassssaqqq (11**)
    },
    {
        "id": "C strange",
        "name": "Eel in a Strange Land",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****11******",
            "***** 2 4 0**",
            "***0 1 313 **",
            "*** 13  11***",
            "****   1 ****",
            "*****p ******",
            "*****  ******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [0,2,0,3,-1,3],
        "hp": 9
        // www*q*a*qwsws*wqass*a*s*a*s*wqwqaaa (7)
        // www*q*a*qqwssws*wqass*a*s*a*s*wswqqqaaa (9**)
    },
    {
        "id": "C 451",
        "name": "Eel 451",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "****     ****",
            "****  0 0****",
            "****  2  ****",
            "****3 1 2****",
            "****2   1****",
            "******4******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-2,-2,-1,-2,0,-2,1,-2,2,-2],
        "hp": 15
        // aasaas*w*wqqaassswws*aaqq*a (12)
        // aasaas*s*wq*wqqaassss*wwwqqaaaa (15**)
    },
    {
        "id": "C narnia",
        "name": "The Eels of Narnia",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "****    0****",
            "****  2p ****",
            "****21 32****",
            "***  p1 3****",
            "***0  2 1****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-2,-1,-2,-2,-1,-2,0,-2],
        "hp": 14
        // s*as*asa*qqqwwwssa*sa*as*ww (10)
        // s*as*asa*q*qqqwswsssa*as*wwwwqqa (14**)
    },

    {
        "id": "P kings",
        "name": "All the King's Eels",
        "map": [
            "*************",
            "*************",
            "****** 0 ****",
            "****** p2 ***",
            "**** 2 1 2 **",
            "****2p p p **",
            "**   2 2 2 **",
            "**1p2p p2****",
            "**   2 2 ****",
            "***0 p ******",
            "****   ******",
            "*************",
            "*************"
        ],
        "eel": [0,2,0,3,0,4,-1,4,-2,4,-2,3,-2,2],
        "hp": 18
        // wwww*ss*aaqqq*qqq*aassssssww*ssww*qwqaqqqq*aaa (15)
        // wwww*ss*aaqqq*qqq*aassssssww*ssww*qqwwqqaaqq*aaa (16*)
        // wwww*ss*aaqqq*qqq*aasaswssssww*ssww*qwqaqqqq*aaa (17*)
        // wwww*ss*aaqqq*qqq*aasaswssssww*ssww*qqwwqqaaqq*aaa (18**)
    },
    {
        "id": "P darkness",
        "name": "Eel of Darkness",
        "map": [
            "*************",
            "*************",
            "*******220***",
            "*****1    ***",
            "****    1 2**",
            "***1 p p  2**",
            "***1  0pp ***",
            "**2  ppp  ***",
            "**21 1   ****",
            "***1    *****",
            "****22*******",
            "*************",
            "*************"
        ],
        "eel": [2,2,1,2,1,3,0,3,-1,3,-2,3,-2,2,-2,1,-2,0],
        "hp": 17
        //*wswww*qqqqqaaqaaas*a*swswqqqqwswwswswssssa*s*aqqwqwws (15)
        //*wswww*qqqaaqqqaasssaq*a*qwqwqwswwsws*wssssa*s*aqqwqwws (16*)
        //*wswww*qqqqqa*qaaasssaq*a*qwqwqwswssswwqwsssaasswq*w*wqq (17**)
    },
    {
        "id": "P war",
        "name": "The War of the Eels",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****0 31****",
            "***** 24  ***",
            "*****1122 ***",
            "**p**     ***",
            "*p***1 1p****",
            "*p***2 p*****",
            "**p**0 ******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [2,0,3,0,3,-1,3,-2,2,-2],
        "hp": 11
        // qqq*assws*wqq*aaa*qwwwwsas*ws*w*q (7)
        // qqq*assws*wqq*aaa*aqwwwwwwsaas*ws*w*q (11**)
    },
    {
        "id": "P call",
        "name": "The Call of the Eel",
        "map": [
            "*************",
            "*******p*****",
            "******* *****",
            "******* *****",
            "****p    ****",
            "***p133    p*",
            "*** 3 13 ****",
            "***03  3 ****",
            "*** 1331p****",
            "***p 0 p*****",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [0,1,-1,1,-1,0],
        "hp": 12
        // *w*qas*aqww*qaaswwsa*a*swwqq*q*wss (12)
        // *w*qas*aaqwww*qqasaswwsa*a*swwqq*q*wss (16**)
    },
    {
        "id": "P midnight",
        "name": "Midnight's Eels",
        "map": [
            "*************",
            "*************",
            "******  *****",
            "******1 *****",
            "*****p2 *****",
            "****p1    0**",
            "** 123 321 **",
            "**     1p****",
            "***** 2p*****",
            "***** 1******",
            "*****0 ******",
            "*************",
            "*************"
        ],
        "eel": [0,0,0,1,-1,1],
        "hp": 15
        // *ws*aaqqaa*swqwqq*w*sswssww*qasass*a*q (11)
        // *ws*aaqqaa*aswwqwqq*w*sswsss*s*aswqqaqwwq*w (15**)
    },
    {
        "id": "S thousand",
        "name": "Twenty Thousand Eels Under the Sea",
        "map": [
            "*************",
            "*************",
            "*************",
            "******ppp****",
            "****0 1  p***",
            "**** 23  p***",
            "***p13 31p***",
            "***p  42 ****",
            "***p  1 0****",
            "****ppp******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-1,1,-1,2,-2,2],
        "hp": 14
        // q*w*sa*as*wwq*w*sss*a*q*aqwww (11)
        // q*w*sa*as*wwq*w*sss*aa*aqwwqqqwwss (14**)
    },
    {
        "id": "P scarlet",
        "name": "The Scarlet Eel",
        "map": [
            "*************",
            "*************",
            "*************",
            "******12*****",
            "*****0 1 ****",
            "****21  0p***",
            "*** 1  1 p***",
            "***   12 ****",
            "****    *****",
            "*****pp******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-2,1,-3,1,-3,0],
        "hp": 11
        // sws*wqaq*wsss*aqa*swwwq*w*s (9)
        // *wss*ws*aqa*swswqwq*w*saqqa*q (11**)
    },
    {
        "id": "P machine",
        "name": "The Eel Machine",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****0    ***",
            "*****  21 ***",
            "****p 312 ***",
            "****p213  ***",
            "****pp2  0***",
            "*****ppp*****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [3,-3,3,-2,3,-1,3,0],
        "hp": 13
        // qqqa*s*a*q*a*s*swwqqqaas*a (9)
        // qqqa*s*a*q*a*sa*sswqwwqqwqaaasa (13**)
    },

    {
        "id": "S lord",
        "name": "Lord of the Eels",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "****p     ***",
            "****0414 p***",
            "***  1 1  ***",
            "***  414 ****",
            "***    0p****",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-3,0,-3,1,-3,2,-2,2],
        "hp": 17
        // saass*ww*ss*a*qqqqwssww*q*aasws (15)
        // saass*ww*ss*a*qaqqwwsww*q*aqassws (17**)
    },
    {
        "id": "S punishment",
        "name": "Eel and Punishment",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "******0   ***",
            "***    33 ***",
            "*** 33 33 ***",
            "*** 33  0 ***",
            "***    ******",
            "*************",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-3,0,-3,1,-3,2,-2,2],
        "hp": 20
        // wss*sa*q*q*qa*sswssw*ws*saq*a (17)
        // wss*sa*q*q*qa*sswwswsaa*as*ws*wq (20**)
    },
    {
        "id": "S masters",
        "name": "The Eel Masters",
        "map": [
            "*************",
            "*******p*****",
            "*************",
            "*************",
            "***** 10  ***",
            "****  4   ***",
            "*** 141410***",
            "***   4  ****",
            "***   1 *****",
            "*************",
            "*************",
            "*****p*******",
            "*************"
        ],
        "eel": [-2,2,-3,2,-3,1,-2,1],
        "hp": 16
        // swq*w*w*saaas*wwqw*w*sass*a*q (14)
        // swq*wwsw*s*s*aq*aq*a*sasww*wssaq (16**)
    },
    {
        "id": "S bonfire",
        "name": "Bonfire of the Eels",
        "map": [
            "*************",
            "*************",
            "*************",
            "*************",
            "***** 3 p****",
            "****0313 ****",
            "**** 1 1 ****",
            "**** 313 ****",
            "****     ****",
            "*****0 ******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [-2,2,-1,2,0,2,1,2,2,2,2,1],
        "hp": 10
        // ww*s*asw*s*aaqqwwwsas*ww*q (6)
        // ww*s*asw*s*aaqaqwqwwwssas*ww*q (10**)
    },
    {
        "id": "S kill",
        "name": "To Kill an Eel",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****0 p p***",
            "****2  13 ***",
            "***0 3 1  ***",
            "***      ****",
            "***p11 pp****",
            "*** 3  p ****",
            "***p  *******",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [0,1,0,2,-1,2,-1,3,-2,3],
        "hp": 12
        // *wqaa*qwwssww*sassw*qqqqaq*w (10)
        // *qwswwq*aaaa*qwwqws*wswsasassw*q (14**)
    },
    {
        "id": "S prejudice",
        "name": "Eel and Prejudice",
        "map": [
            "*************",
            "*************",
            "*************",
            "*****p   ****",
            "****0  41 ***",
            "***p   3  ***",
            "*** 3412  ***",
            "*** 2    p***",
            "*** 1    ****",
            "**** 0 p*****",
            "*************",
            "*************",
            "*************"
        ],
        "eel": [0,2,1,2,2,2,2,1,2,0],
        "hp": 14
        // qws*wwq*aa*q*aqwwssss*ws*wwq*a (12)
        // qws*wwq*aa*aaqwwswss*ws*wwq*aqqaqa (14**)
    },
    {
        "id": "S memoirs",
        "name": "Memoirs of an Eel",
        "map": [
            "*************",
            "*************",
            "******* p****",
            "*****0   ****",
            "*****32 23 **",
            "***  12 12 **",
            "***0      ***",
            "**   23  p***",
            "**p  12 *****",
            "****    *****",
            "****  *******",
            "*************",
            "*************"
        ],
        "eel": [-1,3,-1,4,-2,5,-2,3,-2,2],
        "hp": 16
        // swssw*qqqwwssss*w*qqq*aa*swwwwss*aassw*qqqqq (12)
        // swssw*qqqwqwsssss*w*qqq*aa*swwwwss*aassw*qqqqwqa (16**)
    }
];

var curlevel = null;

var ROCKMAP = {
    '0011.*': ['a', 0],
    '1001.*': ['a', 1],
    '1100.*': ['a', 2],
    '0110.*': ['a', 3],
    '11110111': ['b', 0],
    '11111011': ['b', 1],
    '11111101': ['b', 2],
    '11111110': ['b', 3],
    '0111.11.': ['c', 0],
    '1011..11': ['c', 1],
    '11011..1': ['c', 2],
    '111011..': ['c', 3],
    '11111111': ['d', -1],
    '11110110': ['e', 0],
    '11110011': ['e', 1],
    '11111001': ['e', 2],
    '11111100': ['e', 3],
    '0010.*': ['f', 0],
    '0001.*': ['f', 1],
    '1000.*': ['f', 2],
    '0100.*': ['f', 3]
};

var FOODMAP = {
    '0': {type: 'starfish1', hp: 0, star: true},
    '1': {type: 'guppy1', hp: 1},
    '2': {type: 'catfish1', hp: 2},
    '3': {type: 'piranha1', hp: 3},
    '4': {type: 'stingray1', hp: 4}
};

function countstars(level) {
    var stars = 0;
    for (var x = -MR; x <= MR; x ++) {
        for (var y = -MR; y <= MR; y ++) {
            var p = level.map[MR+y][MR+x];
            var f = FOODMAP[p];
            if (f && f.star)
                stars ++;
        }
    }
    return stars;
}

function describe_level(level, num) {
    return (level.id ? level.id[0] : '') + (num+1) + (level.name ? (': "' + level.name + '"') : '');
}

function start() {
    var level = LEVELS[curlevel];
    var game = {
        map: level.map.slice(),
        eel: level.eel.slice(),
        leveldesc: describe_level(level, curlevel),
        hp: level.hp,
        charge: true,
        over: false,
        hasstars: 0,
        stars: 0,
        food: [],
        foodhp: [],
        nonstars: 0,
        foodcount: 0,
        atstart: true
    };
    for (var x = -MR; x <= MR; x ++) {
        for (var y = -MR; y <= MR; y ++) {
            var p = level.map[MR+y][MR+x];
            var f = FOODMAP[p];
            if (f) {
                var flip = Math.random() > 0.5;
                game.food.push({
                    x: x,
                    y: y,
                    type: f.type,
                    flip: flip,
                    star: f.star
                });
                game.foodhp.push(f.hp);
                if (f.star)
                    game.hasstars ++;
                else
                    game.nonstars ++;
                game.foodcount ++;
            }
        }
    }
    return game;
}

function game_clone(game) {
    return {
        map: game.map,
        eel: game.eel.slice(),
        leveldesc: game.leveldesc,
        hp: game.hp,
        charge: game.charge,
        over: game.over,
        hasstars: game.hasstars,
        stars: game.stars,
        food: game.food,
        foodhp: game.foodhp.slice(),
        nonstars: game.nonstars,
        foodcount: game.foodcount,
        atstart: game.atstart
    };
}

function game_over(game) {
    if (game.hp <= 0)
        return true;
    return game.nonstars == 0;
}

function game_canmove(game, dx, dy) {
    if (game.over)
        return false;
    var eel = game.eel;
    var nx = eel[0] + dx;
    var ny = eel[1] + dy;
    for (var i = 2; i < eel.length; i += 4) {
        if (eel[i] == nx && eel[i+1] == ny)
            return false;
    }
    var what = game.map[MR+ny][MR+nx];
    if (what == '*' || what == 'p')
        return false;
    for (var i = 0; i < game.food.length; i ++) {
        var food = game.food[i];
        if (food.x == nx && food.y == ny) {
            if (game.foodhp[i] > 0)
                return false;
        }
    }
    return true;
}

function game_canshock(game) {
    return !game.over && game.charge && game.hp > SHOCKHP;
}

function game_move(game, dx, dy, oneat) {
    var eel = game.eel;
    var nx = eel[0] + dx;
    var ny = eel[1] + dy;
    game.hp -= MOVEHP;
    for (var i = 0; i < game.food.length; i ++) {
        var food = game.food[i];
        if (food.x == nx && food.y == ny && game.foodhp[i] == 0) {
            if (food.star) {
                game.stars ++;
            } else {
                game.nonstars --;
                game.hp = Math.min(MAXHP, game.hp + FOODHP);
            }
            game.foodcount --;
            if (oneat) oneat(food);
            game.foodhp[i] = -1;
        }
    }
    eel.splice(eel.length - 2, 2);
    eel.splice(0, 0, nx, ny);
    game.charge = true;
}

function game_shock1(game, i, onshock, onharm) {
    var eel = game.eel;
    var x = eel[i];
    var y = eel[i+1];
    
    function addshock(rot, sx, sy) {
        if (onshock) onshock(rot, x, y);
        $.each(game.food, function(i, food) {
            if (food.x == sx && food.y == sy && game.foodhp[i] > 0) {
                game.foodhp[i] --;
                if (onharm) onharm(food, i);
            }
        });
    }

    var px = i > 0 && (eel[i-2] - x);
    var py = i > 0 && (eel[i-1] - y);
    var nx = i < eel.length - 2 && (eel[i+2] - x);
    var ny = i < eel.length - 2 && (eel[i+3] - y);
    var nw = px == -1 || nx == -1;
    var ne = py == -1 || ny == -1;
    var se = px == 1 || nx == 1;
    var sw = py == 1 || ny == 1;
    if (i == 0 || i == eel.length - 2) {
        if (!nw && !se) {
            addshock(-1, x - 1, y);
            addshock(1, x + 1, y);
        } else {
            addshock(0, x, y - 1);
            addshock(2, x, y + 1);
        }
    } else {
        if (!nw)
            addshock(-1, x - 1, y);
        if (!ne)
            addshock(0, x, y - 1);
        if (!se)
            addshock(1, x + 1, y);
        if (!sw)
            addshock(2, x, y + 1);
    }
}

function game_shock(game) {
    if (!game.charge)
        return false;
    var harm = false;
    var eel = game.eel;
    game.charge = false;
    game.hp -= SHOCKHP;
    for (var i = 0; i < eel.length; i += 2) {
        game_shock1(game, i, null, function() { harm = true; });
    }
    return harm;
}

var solvertimer;
function cancel_solver() {
    clearTimeout(solvertimer);
}
function solver(game, callback1, callback2) {
    var PROGDUR = 2;
    var YIELDDUR = 0.5;
    var progt, yieldt;
    var solutions = [];
    var failures = [];
    var todo = [];
    var hp = 1;
    var startt = time();
    game = game_clone(game);
    game.hp = hp;

    function starthp() {
        console.info('trying hp ' + hp);
        progt = time() + PROGDUR;
        loop();
    }

    function loop() {
        while (true) {
            step();
            if (todo.length) {
                var t = time();
                if (t > yieldt) {
                    solvertimer = setTimeout(loop, 0);
                    yieldt = t + YIELDDUR;
                    return;
                }
            } else {
                nexthp();
                return;
            }
        }
    }

    function nexthp() {
        if (solutions.length) {
            console.info('done (hp ' + hp + ') in ' + (time() - startt).toFixed(3) + 's :');
            var shortest = null;
            var length = 0;
            $.each(solutions, function(i, sol) {
                console.info('  '+ sol);
                if (shortest == null || sol.length < length) {
                    length = sol.length;
                    shortest = sol;
                }
            });
            callback2(shortest, hp);
        } else if (hp >= MAXHP || failures.length == 0) {
            console.info('no solution');
            callback2();
        } else {
            hp ++;
            todo = failures;
            failures = []
            $.each(todo, function(i, t) {
                t[1].hp ++;
            });
            starthp();
        }
    }
    function step() {
        var sofar = todo[0][0];
        var game = todo[0][1];
        todo.shift();
        if (game.hp <= 0) {
            failures.push([sofar, game]);
        } else {
            var t = time();
            if (t > progt) {
                console.info('thinking: ' + sofar + ' (' + todo.length + ') (' + solutions.length + '/' + failures.length + ')');
                callback1(sofar);
                progt = time() + PROGDUR;
            }
            if (game.charge) {
                var game2 = game_clone(game);
                if (game_shock(game2)) {
                    if (!game_over(game2))
                        todo.push([sofar + '*', game2]);
                    else if (game2.hp <= 0 && hp - game2.hp < MAXHP)
                        failures.push([sofar + '*', game2]);
                }
            }
            if (game_canmove(game, -1, 0)) {
                var game2 = game_clone(game);
                game_move(game2, -1, 0);
                if (game2.foodcount == 0)
                    solutions.push(sofar + 'q');
                else if (!game_over(game2))
                    todo.push([sofar + 'q', game2]);
                else if (game2.hp <= 0 && hp - game2.hp < MAXHP)
                    failures.push([sofar + 'q', game2]);
            }
            if (game_canmove(game, 0, -1)) {
                var game2 = game_clone(game);
                game_move(game2, 0, -1);
                if (game2.foodcount == 0)
                    solutions.push(sofar + 'w');
                else if (!game_over(game2))
                    todo.push([sofar + 'w', game2]);
                else if (game2.hp <= 0 && hp - game2.hp < MAXHP)
                    failures.push([sofar + 'w', game2]);
            }
            if (game_canmove(game, 1, 0)) {
                var game2 = game_clone(game);
                game_move(game2, 1, 0);
                if (game2.foodcount == 0)
                    solutions.push(sofar + 's');
                else if (!game_over(game2))
                    todo.push([sofar + 's', game2]);
                else if (game2.hp <= 0 && hp - game2.hp < MAXHP)
                    failures.push([sofar + 's', game2]);
            }
            if (game_canmove(game, 0, 1)) {
                var game2 = game_clone(game);
                game_move(game2, 0, 1);
                if (game2.foodcount == 0)
                    solutions.push(sofar + 'a');
                else if (!game_over(game2))
                    todo.push([sofar + 'a', game2]);
                else if (game2.hp <= 0 && hp - game2.hp < MAXHP)
                    failures.push([sofar + 'a', game2]);
            }
        }
    }
    yieldt = time() + YIELDDUR;
    todo.push(['', game]);
    starthp();
}

var game, save;
$(document).ready(function() {
    var page = 'intro';
    var busy = false;
    var hackk = 0;
    var hack = false;
    var fadecallback = null;
    var audio_on = true;
    game = null;
    save = $.cookie('save') || null;
    if (!save || save._v != '1')
        save = {_v: '1', l: {}};
    $.each(LEVELS, function(i, level) {
        if (!(level.id in save))
            save.l[level.id] = {
                locked: i != 0,
                finished: false,
                stars: 0
            };
        if (DEBUG)
            save.l[level.id].locked = false;
    });
    $('#fadecircle')
        .attr('cx', $(window).width()/2)
        .attr('cy', $(window).height()/2);

    var bw = TR * 18 + 12;
    var bh = TR * 12 + 12;
    var svg = $('#svg');
    svg.css({
        width: bw,
        height: bh + 110
    });

    function play(audio) {
        if (!audio_on)
            return;
        var a = $('#audio_'+audio)[0];
        a.currentTime = 0;
        a.play();
    }

    var defs = $(document.createElementNS(svgNS, 'defs'));
    svg.append(defs);
    var borderclip = $(document.createElementNS(svgNS, 'clipPath'))
        .attr('id', 'borderclip');
    defs.append(borderclip);
    var bordercliprect = $(document.createElementNS(svgNS, 'rect'))
        .attr('x', (bw/2 - TR*9 - 1))
        .attr('y', (bh/2 - TR*6 - 1))
        .attr('width', TR * 18 + 2)
        .attr('height', TR * 12 + 2);
    borderclip.append(bordercliprect);
    var borderclipg = $(document.createElementNS(svgNS, 'g'))
        .attr('clip-path', 'url(#borderclip)');
    svg.append(borderclipg);
    var bg = $(document.createElementNS(svgNS, 'rect'))
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', bw)
        .attr('height', bh)
        .attr('id', 'bg');
    borderclipg.append(bg);

    var board = $(document.createElementNS(svgNS, 'g'));
    borderclipg.append(board);

    var border = $(document.createElementNS(svgNS, 'image'))
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', bw)
        .attr('height', bh)
        .attr('href', 'svg/border1.svg');
    svg.append(border);

    var leveldesc = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'gametext')
        .attr('x', bw - TR - 520 + 6)
        .attr('y', bh + 23)
        .attr('text-anchor', 'start')
        .attr('font-size', 20)
        .text('...');
    svg.append(leveldesc);

    var hungert = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'hunger gametext')
        .attr('x', bw - TR - 520)
        .attr('y', bh + 58)
        .attr('text-anchor', 'end')
        .attr('font-size', 20)
        .text('Hunger:');
    svg.append(hungert);
    var hunger1 = $(document.createElementNS(svgNS, 'image'))
        .attr('class', 'hunger')
        .attr('x', bw - TR - 520)
        .attr('y', bh + 30)
        .attr('width', 530)
        .attr('height', 45)
        .attr('href', 'svg/hunger1.svg');
    svg.append(hunger1);
    var hungerbar = $(document.createElementNS(svgNS, 'rect'))
        .attr('class', 'hunger hungerbar')
        .attr('x', bw - TR - 520 + 5)
        .attr('y', bh + 30 + 14)
        .attr('height', 17);
    svg.append(hungerbar);
    var hunger2 = $(document.createElementNS(svgNS, 'image'))
        .attr('class', 'hunger')
        .attr('x', bw - TR - 520)
        .attr('y', bh + 30)
        .attr('width', 530)
        .attr('height', 45)
        .attr('href', 'svg/hunger2.svg');
    svg.append(hunger2);

    var charget = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'charge gametext')
        .attr('x', bw - TR - 520)
        .attr('y', bh + 93)
        .attr('text-anchor', 'end')
        .attr('font-size', 20)
        .text('Charge:');
    svg.append(charget);
    var charge1 = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'charge gametext')
        .attr('x', bw - TR - 520 + 6)
        .attr('y', bh + 93)
        .attr('text-anchor', 'start')
        .attr('font-size', 20)
        .text('Ready');
    svg.append(charge1);

    var quitb = $(document.createElementNS(svgNS, 'image'))
        .attr('class', 'gameoption key')
        .attr('x', bw - 180 - 43)
        .attr('y', bh + 2)
        .attr('width', 40)
        .attr('height', 30)
        .attr('href', 'svg/console-esc.svg')
        .click(gameback);
    svg.append(quitb);
    var quitt = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'gameoption key gametext')
        .attr('x', bw - 180)
        .attr('y', bh + 23)
        .attr('text-anchor', 'start')
        .attr('font-size', 20)
        .text('Quit')
        .click(gameback);
    svg.append(quitt);

    var restartb = $(document.createElementNS(svgNS, 'image'))
        .attr('class', 'gameoption nokey')
        .attr('x', bw - 100 - 33)
        .attr('y', bh + 2)
        .attr('width', 30)
        .attr('height', 30)
        .attr('href', 'svg/console-r1.svg')
        .click(do_restart);
    svg.append(restartb);
    var restartt = $(document.createElementNS(svgNS, 'text'))
        .attr('class', 'gameoption nokey gametext')
        .attr('x', bw - 100)
        .attr('y', bh + 23)
        .attr('text-anchor', 'start')
        .attr('font-size', 20)
        .text('Restart')
        .click(do_restart);
    svg.append(restartt);

    var audiob = $(document.createElementNS(svgNS, 'image'))
        .attr('class', 'gameoption key')
        .attr('x', bw - TR - 30 - 33)
        .attr('y', bh + 75)
        .attr('width', 30)
        .attr('height', 30)
        .attr('href', 'svg/console-m.svg')
        .click(do_audio);
    svg.append(audiob);
    var audioi = $(document.createElementNS(svgNS, 'image'))
        .attr('class', 'gameoption')
        .attr('x', bw - TR - 30)
        .attr('y', bh + 75)
        .attr('width', 30)
        .attr('height', 30)
        .attr('href', 'svg/audio-on.svg')
        .click(do_audio);
    svg.append(audioi);

    var star1 = $(document.createElementNS(svgNS, 'image'))
        .attr('x', bw - TR - 145)
        .attr('y', bh + 65)
        .attr('width', 50)
        .attr('height', 50)
        .attr('href', 'svg/starfish1b.svg');
    svg.append(star1);
    var star2 = $(document.createElementNS(svgNS, 'image'))
        .attr('x', bw - TR - 190)
        .attr('y', bh + 65)
        .attr('width', 50)
        .attr('height', 50)
        .attr('href', 'svg/starfish1b.svg');
    svg.append(star2);
    var star3 = $(document.createElementNS(svgNS, 'image'))
        .attr('x', bw - TR - 235)
        .attr('y', bh + 65)
        .attr('width', 50)
        .attr('height', 50)
        .attr('href', 'svg/starfish1b.svg');
    svg.append(star3);

    function fadeto(x, y, r, msg, callback) {
        busy = true;
        fadecallback = null;
        var pageOffset = $('#'+page+' .page').offset();
        $('#fadeouter').removeClass('passevents');
        $('#fadebg')
            .css('opacity', 1);
        $('#fadecircle')
            .attr('cx', pageOffset.left + x)
            .attr('cy', pageOffset.top + y)
            .attr('r', r);
        $('#fademsgbox').hide();
        setTimeout(function() {
            $('#fademsg').html(msg);
            $('#fademsgbox')
                .css('left', x < bw/2 ? (pageOffset.left + x + r + 10) : (pageOffset.left + x - r - 10 - $('#fademsgbox').outerWidth()))
                .css('top', pageOffset.top + y - $('#fademsgbox').outerHeight()/2)
                .show();
            fadecallback = callback;
        }, 1000);
    }

    function unfade(callback) {
        busy = true;
        fadecallback = null;
        $('#fadebg')
            .css('opacity', 0);
        $('#fadecircle')
            .attr('cx', $(window).width()/2)
            .attr('cy', $(window).height()/2)
            .attr('r', 1200);
        $('#fademsgbox').hide();
        setTimeout(function() {
            $('#fadeouter').addClass('passevents');
            busy = false;
            if (callback)
                callback();
        }, 1000);
    }

    function updatelevelbuttons() {
        $.each(LEVELS, function(i, level) {
            var container = $('#menu' + 'TGCPS'.indexOf(level.id[0]) + 'levels');
            container.empty();
        });
        $.each(LEVELS, function(i, level) {
            var stars = countstars(level);
            var container = $('#menu' + 'TGCPS'.indexOf(level.id[0]) + 'levels');
            var button = $(document.createElement('span'))
                .attr('class', 'levelbutton')
                .html((i + 1) + '<br />');
            var levelsave = level.id in save.l ? save.l[level.id] : {locked: true};
            button.addClass(levelsave.locked ? 'l' : levelsave.finished ? 'f' : 'o');
            if (!levelsave.locked) {
                button.click(function() {
                    //var needs_reset = curlevel != i;
                    curlevel = i;
                    $('#menu').addClass('left');
                    $('#game').removeClass('left right');
                    page = 'game';
                    //if (needs_reset)
                    reset(true);
                });
                button.mouseenter(function() {
                    $('#menuselect').text(describe_level(level, i));
                });
            } else {
                button.mouseenter(function() {
                    $('#menuselect').text('(locked)');
                });
            }
            button.mouseleave(function() {
                $('#menuselect').text('');
            });
            if (stars == 0)
                button.html(button.html()+'&nbsp;');
            for (var j = 0; j < stars; j ++) {
                var star = $(document.createElement('div'))
                    .attr('class', 'levelbuttonstar')
                    .html('&nbsp;');
                if (j < levelsave.stars)
                    star.addClass('got');
                button.append(star);
            }
            container.append(button);
        });
    }

    function addkey(k, x, y, w, h) {
        var key = $(document.createElementNS(svgNS, 'image'))
            .attr('class', 'key')
            .attr('x', TR + x)
            .attr('y', bh + y)
            .attr('width', w)
            .attr('height', h)
            .attr('href', 'svg/console-' + k + '.svg');
        svg.append(key);
        return key;
    }

    var qkey = addkey('q1', 10,  0, 35, 35);
    var wkey = addkey('w1', 45,  0, 35, 35);
    var skey = addkey('s1', 45, 35, 35, 35);
    var akey = addkey('a1', 10, 35, 35, 35);
    var spkey = addkey('sp1', 0, 70, 90, 35);

    function updateconsole() {
        var eel = game.eel;
        var nomoves = true;
        function setkey(k, l, b) {
            k.attr('href', 'svg/console-' + l + (b ? '2' : '1') + '.svg');
            k.toggleClass('key', b);
            k.toggleClass('nokey', !b);
            if (b)
                nomoves = false;
        }
        restartb.attr('href', 'svg/console-r' + (canrestart() ? '2' : '1') + '.svg');
        restartb.toggleClass('key', canrestart());
        restartb.toggleClass('nokey', !canrestart());
        restartt.toggleClass('key', canrestart());
        restartt.toggleClass('nokey', !canrestart());
        setkey(qkey, 'q', canmoveeel(-1, 0));
        setkey(wkey, 'w', canmoveeel(0, -1));
        setkey(skey, 's', canmoveeel(1, 0));
        setkey(akey, 'a', canmoveeel(0, 1));
        setkey(spkey, 'sp', canshock());
        charge1.text(game.charge ? (game.hp <= SHOCKHP ? 'Too hungry' : 'Ready') : 'Not ready');
        hungerbar.attr('width', Math.max(0, 25 * (MAXHP - game.hp) - 1))
            .toggleClass('red', game.hp <= SHOCKHP)
            .toggleClass('yellow', game.hp > SHOCKHP && game.hp <= SHOCKHP + MOVEHP);
        star1.attr('href', 'svg/starfish1' + (game.stars > 0 ? 'a' : 'b') + '.svg')
            .toggle(game.hasstars > 0);
        star2.attr('href', 'svg/starfish1' + (game.stars > 1 ? 'a' : 'b') + '.svg')
            .toggle(game.hasstars > 1);
        star3.attr('href', 'svg/starfish1' + (game.stars > 2 ? 'a' : 'b') + '.svg')
            .toggle(game.hasstars > 2);
        
        if (!busy && !game.over && nomoves)
            defeat();
    }

    function tx(x, y) {
        return bw/2 + TR * (x - y);
    }

    function ty(x, y) {
        return bh/2 + TR * (x + y);
    }

    function gridline_create(x, y, nw) {
        var path = $(document.createElementNS(svgNS, 'path'))
            .attr('transform', 'translate(' + tx(x, y) + ',' + ty(x, y) + ')')
            .attr('class', 'gridline');
        path.gridline_nw = nw;
        path.gridline_seed = (x * 2 * MR + y) * 2 + (nw ? 1 : 0);
        board.append(path);
        return path;
    }

    function gridline_update(path) {
        var d = [];
        function curve(x1, y1, x2, y2, p1, p2) {
            d.push('M', x1, y1);
            d.push('C');
            d.push((1-GLWI)*x1 + GLWI*x2 + (y2 - y1) * p1, (1-GLWI)*y1 + GLWI*y2 - (x2 - x1) * p1);
            d.push((1-GLWI)*x2 + GLWI*x1 + (y2 - y1) * p2, (1-GLWI)*y2 + GLWI*y1 - (x2 - x1) * p2);
            d.push(x2, y2);
        }
        var z = 0;
        function roff() {
            z ++;
            return GLWA * perlin1(path.gridline_seed * 33.7 + z * 7.7 + time());
        }
        if (path.gridline_nw)
            curve(-TR + GLG, -GLG, -GLG, -TR + GLG, roff(), roff());
        else
            curve(-TR + GLG, GLG, -GLG, TR - GLG, roff(), roff());
        path.attr('d', d.join(' '));
        //.css('opacity', roff() * 2 + 0.5);
    }

    var gridlines = [];

    function putthing(x, y, thing, rot, flip) {
        rot = rot || 0;
        var flipscale = flip ? ' scale(-1,1)' : '';
        var thing = $(document.createElementNS(svgNS, 'image'))
            .attr('x', -TR)
            .attr('y', -TR)
            .attr('width', TR*2)
            .attr('height', TR*2)
            .attr('transform', 'translate(' + tx(x, y) + ',' + ty(x, y) + ')' + flipscale + ' rotate(' + (rot * 90) + ')')
            .attr('href', 'svg/' + thing + '.svg');
        board.append(thing);
        return thing;
    }

    function puteel() {
        var eel = game.eel;
        var state = game.eelstate;
        $('.eel').remove();
        var eeltype = 'eel1';
        for (var i = 0; i < eel.length; i += 2) {
            var x = eel[i];
            var y = eel[i+1];
            var px = i > 0 && (eel[i-2] - x);
            var py = i > 0 && (eel[i-1] - y);
            var nx = i < eel.length - 2 && (eel[i+2] - x);
            var ny = i < eel.length - 2 && (eel[i+3] - y);
            var nw = px == -1 || nx == -1;
            var ne = py == -1 || ny == -1;
            var se = px == 1 || nx == 1;
            var sw = py == 1 || ny == 1;
            var spec;
            if (i == 0) {
                if (nw)
                    spec = ['a', 1, false];
                else if (se)
                    spec = ['a', 0, true];
                else if (ne)
                    spec = ['a', 1, true];
                else
                    spec = ['a', 0, false];
            } else if (i == eel.length - 2) {
                if (nw)
                    spec = ['f', 0, false];
                else if (se)
                    spec = ['f', -1, true];
                else if (ne)
                    spec = ['f', 0, true];
                else
                    spec = ['f', -1, false];
            } else {
                if (nw && se)
                    spec = ['b', 0, true];
                else if (nw && ne)
                    spec = ['c', 0, false];
                else if (nw && sw)
                    spec = ['e', 0, true];
                else if (ne && se)
                    spec = ['e', 0, false];
                else if (ne && sw)
                    spec = ['b', 0, false];
                else if (se && sw)
                    spec = ['d', 0, false];
            }
            if (state == 'happy' && spec[0] == 'a')
                spec[0] = 'g';
            if (state == 'sad' && spec[0] == 'a')
                spec[0] = 'h';
            var thing = putthing(x, y, eeltype + spec[0], spec[1], spec[2]);
            thing.addClass('eel');
        }
    }

    function tutorial1() {
        if (save.t1)
            return;
        function s1() {
            var ex = game.eel[0];
            var ey = game.eel[1];
            fadeto(tx(ex, ey), ty(ex, ey), TR, 'You\'re an eel, and you\'re hungry.<br />You\'re going to have to eat all the fish.', s2);
        }
        function s2() {
            fadeto(TR + 45, bh + 35, TR, 'Use the Q, W, A and S keys to move,<br />or click on the next place you want to go.', s3);
        }
        function s3() {
            fadeto(tx(1,-1), ty(1,-1), TR, 'You have to kill the fish before you eat it.', s4);
        }
        function s4() {
            fadeto(TR + 45, bh + 87, TR, 'Your electric shock attack can kill fish.<br />Press space to use it, or click on your head.', d);
        }
        function d() {
            save.t1 = true;
            $.cookie('save', save);
            unfade();
        }
        s1();
    }

    function tutorial2() {
        if (save.t2)
            return;
        function s1() {
            fadeto(tx(-1, 1), ty(-1, 1), TR, 'It takes 2 shocks to kill this fish.', s2);
        }
        function s2() {
            fadeto(bw - TR - 520 + 6 + 25, bh + 93 - 5, 36, 'You can shock multiple times on a level,<br />but not twice in the same place;<br />you have to move to recharge.', s3);
        }
        function s3() {
            fadeto(bw - TR - 520 + 5 + 25 * (MAXHP - game.hp) + 3, bh + 30 + 14 + 10, 25, 'This is how hungry you are.<br />Each move adds ' + MOVEHP + ' hunger,<br />and the electric shock adds ' + SHOCKHP + '.', s4);
        }
        function s4() {
            fadeto(bw - TR - 520 + 5 + 25 * MAXHP + 3, bh + 30 + 14 + 10, 25, 'If you get too hungry, you\'ll starve.', d);
        }
        function d() {
            save.t2 = true;
            $.cookie('save', save);
            unfade();
        }
        s1();
    }

    function tutorial3() {
        if (save.t3)
            return;
        function s1() {
            fadeto(tx(0, 0), ty(0, 0), TR, 'This fish will take 3 shocks to kill,<br />but you\'re too hungry for that.', s2);
        }
        function s2() {
            fadeto(tx(0, 0), ty(0, 0), TR*3, 'Kill it with just one shock<br />by surrounding it on three sides.', d);
        }
        function d() {
            save.t3 = true;
            $.cookie('save', save);
            unfade();
        }
        s1();
    }

    function tutorial4() {
        if (save.t4)
            return;
        function s1() {
            fadeto(tx(0, -0.5), ty(0, -0.5), TR*3.5, 'Don\'t waste time picking off individual fish.<br />Use your length to kill all four of these at once.', d);
        }
        function d() {
            save.t4 = true;
            $.cookie('save', save);
            unfade();
        }
        s1();
    }

    function tutorial5() {
        if (save.t5)
            return;
        function s1() {
            fadeto(tx(2, -0.5), ty(2, -0.5), TR*2, 'To beat the level, you just need to eat the fish.<br />If you feel that the bare minimum is enough, then okay.', s2);
        }
        function s2() {
            fadeto(tx(0, 2), ty(0, 2), TR, 'But some eels want an extra challenge, and they<br />try to collect the starfish along the way.', d);
        }
        function d() {
            save.t5 = true;
            $.cookie('save', save);
            unfade();
        }
        s1();
    }

    function reset(first) {
        cancel_solver();
        play('drop');
        $('#overmessage').hide();
        $('.overoption').remove();
        $('.gameoption').show();
        if (game && game.over) {
            var x = game.eel[0];
            var y = game.eel[1];
            var x1 = bw / 2 + TR * (x - y);
            var y1 = bh / 2 + TR * (x + y);
            var t = time();
            function zoomout() {
                var f = 1-Math.min(1, (time() - t));
                var x2 = x1*(1-f) + (bw/2) * (f);
                var y2 = y1*(1-f) + (bh/2) * (f);
                board.attr('transform', 'translate(' + x2 + ',' + y2 +') scale(' + (1 + f*f*f*5) + ') translate(' + (-x1) + ',' + (-y1) + ')');
                if (f > 0)
                    setTimeout(zoomout, 50);
                else {
                    game.over = false;
                    updateconsole();
                }
            }
            zoomout();
        }
        $('.hunger, .charge').toggle(curlevel > 0);
        game = start();
        leveldesc.text(game.leveldesc);
        board.empty();
        gridlines = [];
        for (var x = -MR; x <= MR; x ++) {
            for (var y = -MR; y <= MR; y ++) {
                function passable(p) { return p != '*' && p != 'p'; }
                var p = game.map[MR+y][MR+x];
                var p0 = passable(p);
                var pnw = x > -MR && passable(game.map[MR+y][MR+x-1]);
                var psw = y < MR && passable(game.map[MR+y+1][MR+x]);
                if (p0 || pnw)
                    gridlines.push(gridline_create(x, y, true));
                if (p0 || psw)
                    gridlines.push(gridline_create(x, y, false));
                if (p == 'p') {
                    putthing(x, y, 'plant' + (1 + Math.floor(Math.random()*1)), Math.floor(Math.random()*4), Math.random() < 0.5);
                }
            }
        }
        $.each(game.food, function(i, f) {
            if (game.foodhp[i] < 0)
                return;
            f.creature = putthing(f.x, f.y, f.type + 'a', 0, f.flip);
            if (game.foodhp[i] > 0)
                f.number = putthing(f.x, f.y, 'number' + game.foodhp[i]);
        });
 
        var rocktype = 'rock1';
        for (var x = -MR-1; x <= MR+1; x ++) {
            for (var y = -MR-1; y <= MR+1; y ++) {
                if (x < -MR || x > MR || y < -MR || y > MR) {
                    putthing(x, y, rocktype + 'd', Math.floor(Math.random()*4));
                    continue;
                }
                var p = game.map[MR+y][MR+x];
                if (p == '*') {
                    var neighbors = [];
                    neighbors.push(
                        (x <= -MR || game.map[MR+y][MR+x-1] == '*') ? '1' : '0',
                        (y <= -MR || game.map[MR+y-1][MR+x] == '*') ? '1' : '0',
                        (x >= MR || game.map[MR+y][MR+x+1] == '*') ? '1' : '0',
                        (y >= MR || game.map[MR+y+1][MR+x] == '*') ? '1' : '0',
                        (x <= -MR || y <= -MR || game.map[MR+y-1][MR+x-1] == '*') ? '1' : '0',
                        (x >= MR || y <= -MR || game.map[MR+y-1][MR+x+1] == '*') ? '1' : '0',
                        (x >= MR || y >= MR || game.map[MR+y+1][MR+x+1] == '*') ? '1' : '0',
                        (x <= -MR || y >= MR || game.map[MR+y+1][MR+x-1] == '*') ? '1' : '0');
                    neighbors = neighbors.join('');
                    var nomatch = true;
                    $.each(ROCKMAP, function(pattern, rock) {
                        if ((new RegExp('^' + pattern + '$')).test(neighbors)) {
                            var ang = rock[1];
                            if (ang == -1)
                                ang = Math.floor(Math.random()*4);
                            putthing(x, y, rocktype + rock[0], ang);
                            nomatch = false;
                        }
                    });
                    if (nomatch)
                        putthing(x, y, 'nomatch');
                }
            }
        }

        puteel();
        updateconsole();

        if (first) {
            busy = true;
            setTimeout(function() {
                busy = false;
                if (curlevel == 0)
                    tutorial1();
                if (curlevel == 1)
                    tutorial2();
                if (curlevel == 2)
                    tutorial3();
                if (curlevel == 3)
                    tutorial4();
                if (curlevel == 4)
                    tutorial5();
            }, 800);
        }
    }

    var imgs = [];
    imgs.push('border1', 'hunger1', 'hunger2', 'plant1', 'shock1', 'console-esc', 'console-n', 'console-m', 'audio-on', 'audio-off');
    $.each(['starfish1', 'guppy1', 'catfish1', 'piranha1', 'stingray1'], function(i, food) {
        imgs.push(food + 'a', food + 'b');
    });
    $.each(['q', 'w', 'a', 's', 'sp', 'r'], function(i, key) {
        imgs.push('console-' + key + '1', 'console-' + key + '2');
    });
    $.each(['eel1'], function(i, eel) {
        $.each(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], function(i, l) {
            imgs.push(eel + l);
        });
    });
    $.each(['rock1'], function(i, rock) {
        $.each(['a', 'b', 'c', 'd', 'e', 'f'], function(i, l) {
            imgs.push(rock + l);
        });
    });
    $.each(['1', '2', '3', '4'], function(i, n) {
        imgs.push('number' + n);
    });
    preloadsvg(imgs, function() {

    var introfish = [];
        $('#introplay').show();
        setTimeout(function() {
            $('#introplay').css('opacity', 1);
        }, 100);
        setInterval(function() {
            if (page == 'game') {
                $.each(gridlines, function(i, gl) {
                    gridline_update(gl);
                });
            }
        }, 100);
        setInterval(function() {
            if (page == 'intro') {
                for (var i = 0; i < introfish.length; i ++) {
                    var fish = introfish[i];
                    fish.y += fish.dy;
                    var o = 1;
                    if (fish.y + TR > 668)
                        o = Math.max(0, (768 - (fish.y + TR)) / 100);
                    if (fish.y < 100)
                        o = Math.max(0, fish.y / 100);
                    fish.img.css({
                        top: fish.x,
                        left: fish.y,
                        opacity: o
                    });
                    if (fish.y + TR > 778 || fish.y < -10) {
                        fish.img.remove();
                        introfish.splice(i, 1);
                        i --;
                    }
                }
                while (introfish.length < 3) {
                    var type = ['guppy1', 'catfish1', 'piranha1', 'stingray1'][Math.floor(Math.random()*4)];
                    var x = 100 + Math.random() * (300 - TR);
                    $.each(introfish, function(i, fish) {
                        if (Math.abs(fish.x-x) < TR)
                            type = null;
                    });
                    if (type == null)
                        continue;
                    var dy = 25 + Math.random() * 65;
                    if (Math.random() > 0.5)
                        dy = -dy;
                    var y = dy > 0 ? 0 : (768 - TR);
                    var img = $(document.createElement('img'))
                        .attr('class', 'introfish')
                        .attr('src', 'svg/' + type + 'a.svg')
                        .css({
                            transform: dy > 0 ? '' : 'scaleX(-1)',
                            opacity: 0
                        });
                    introfish.push({
                        x: x,
                        y: y,
                        dy: dy,
                        img: img
                    });
                    img.css({
                        top: x,
                        left: y
                    });
                    $('#intro .page').append(img);
                }
            }
        }, 1000);
    });

    function gokey(k, txt, y, w, fn) {
        svg.append($(document.createElementNS(svgNS, 'image'))
                   .attr('class', 'overoption key')
                   .attr('x', y - w - 3)
                   .attr('y', 110)
                   .attr('width', w)
                   .attr('height', 30)
                   .attr('href', 'svg/console-' + k + '.svg')
                   .click(fn));
        svg.append($(document.createElementNS(svgNS, 'text'))
                   .attr('class', 'overoption key gametext')
                   .attr('x', y)
                   .attr('y', 110 + 22)
                   .attr('text-anchor', 'start')
                   .attr('font-size', 20)
                   .text(txt)
                   .click(fn));
    }

    function victory() {
        var eel = game.eel;
        busy = true;
        game.over = true;
        var x = eel[0];
        var y = eel[1];
        var x1 = bw / 2 + TR * (x - y);
        var y1 = bh / 2 + TR * (x + y);
        var t = time();
        function happy() {
            game.eelstate = 'happy';
            puteel();
            var savel = save.l[LEVELS[curlevel].id];
            savel.finished = true;
            savel.stars = Math.max(savel.stars, game.stars);
            if (curlevel + 1 < LEVELS.length) {
                savel = save.l[LEVELS[curlevel + 1].id];
                savel.locked = false;
            }
            $.cookie('save', save);
            busy = false;
            $('#overmessage').show()
                .text('EEL WINS!');
            $('.gameoption').hide();
            if (game.hasstars) {
                if (cannext()) {
                    gokey('n', 'Next', bw/2 - 100, 30, do_next);
                    gokey('r2', 'Restart', bw/2 - 15, 30, function() { reset(true); });
                    gokey('esc', 'Quit', bw/2 + 100, 40, gameback);
                } else {
                    gokey('r2', 'Restart', bw/2 - 80, 30, function() { reset(true); });
                    gokey('esc', 'Quit', bw/2 + 80, 40, gameback);
                }
            } else {
                if (cannext()) {
                    gokey('n', 'Next', bw/2 - 80, 30, do_next);
                    gokey('esc', 'Quit', bw/2 + 80, 40, gameback);
                } else {
                    gokey('esc', 'Quit', bw/2, 40, gameback);
                }
            }
        }
        function zoomin() {
            var f = Math.min(1, (time() - t));
            var x2 = x1*(1-f) + (bw/2) * (f);
            var y2 = y1*(1-f) + (bh/2) * (f);
            board.attr('transform', 'translate(' + x2 + ',' + y2 +') scale(' + (1 + f*f*f*5) + ') translate(' + (-x1) + ',' + (-y1) + ')');
            if (f < 1)
                setTimeout(zoomin, 50);
            else
                happy();
        }
        play('victory');
        zoomin();
    }

    function defeat() {
        var eel = game.eel;
        busy = true;
        game.over = true;
        var x = eel[0];
        var y = eel[1];
        var x1 = bw / 2 + TR * (x - y);
        var y1 = bh / 2 + TR * (x + y);
        var t = time();
        function sad() {
            game.eelstate = 'sad';
            puteel();
            busy = false;
            updateconsole();
            $('#overmessage').show()
                .text('EEL LOSES!');
            $('.gameoption').hide();
            gokey('r2', 'Restart', bw/2 - 80, 30, function() { reset(true); });
            gokey('esc', 'Quit', bw/2 + 80, 40, gameback);
        }
        function zoomin() {
            var f = Math.min(1, (time() - t)/1.5);
            var x2 = x1*(1-f) + (bw/2) * f;
            var y2 = y1*(1-f) + (bh/2) * f;
            board.attr('transform', 'translate(' + x2 + ',' + y2 +') scale(' + (1 + f*f*f*5) + ') translate(' + (-x1) + ',' + (-y1) + ')');
            if (f < 1)
                setTimeout(zoomin, 50);
            else
                sad();
        }
        play('defeat');
        zoomin();
    }

    function gameback() {
        if (page == 'game') {
            cancel_solver();
            $('#game').addClass('right');
            $('#menu').removeClass('left right');
            page = 'menu';
            updatelevelbuttons();
            busy = true;
            setTimeout(function() { busy = false; }, 800);
        }
    }

    function canmoveeel(dx, dy) {
        return !busy && game_canmove(game, dx, dy);
    }

    function canshock() {
        return !busy && game_canshock(game);
    }

    function canrestart() {
        return !(busy || game.atstart);
    }

    function cannext() {
        return game.eelstate == 'happy' && !busy && curlevel < LEVELS.length - 1;
    }

    function moveeel(dx, dy) {
        if (!canmoveeel(dx, dy))
            return false;
        cancel_solver();
        game.atstart = false;
        var ate = false;
        var star = false;
        game_move(game, dx, dy, function(food) {
            if (food.star)
                star = true;
            food.creature.remove();
            ate = true;
        });
        if (star)
            play('star');
        else if (ate)
            play('eat');
        else
            play('move');
        if (game.nonstars == 0)
            victory();
        if (game.hp == 0)
            defeat();
        puteel();
        updateconsole();
        return true;
    }

    function shock() {
        if (!canshock())
            return;
        cancel_solver();
        game.atstart = false;
        var eel = game.eel;
        busy = true;
        if (curlevel > 0)
            game.charge = false;
        game.hp = Math.max(0, game.hp - SHOCKHP);
        if (game.hp == 0)
            defeat();
        var i = 0;
        function next() {
            var shocks = [];
            game_shock1(game, i, function(rot, x, y) {
                play('shock');
                var thing = $(document.createElementNS(svgNS, 'image'))
                    .attr('x', -TR*2)
                    .attr('y', -TR*2)
                    .attr('width', TR*4)
                    .attr('height', TR*4)
                    .attr('transform', 'translate(' + tx(x, y) + ',' + ty(x, y) + ') rotate(' + (rot * 90) + ')')
                    .attr('href', 'svg/shock1.svg');
                board.append(thing);
                shocks.push(thing);
            }, function(food, i) {
                var hp = game.foodhp[i];
                food.number.remove();
                if (hp == 0) {
                    food.creature.remove();
                    food.creature = putthing(food.x, food.y, food.type + 'b', 0, food.flip);
                } else if (hp > 0) {
                    food.number = putthing(food.x, food.y, 'number' + hp);
                }
            });
            updateconsole();
            setTimeout(function() {
                $.each(shocks, function(i, thing) {
                    thing.remove();
                });
            }, 250);
            setTimeout(function() {
                i += 2;
                if (i >= eel.length) {
                    busy = false;
                    updateconsole();
                    return;
                }
                next();
            }, 200);
        }
        next();
    }

    function do_q(event) {
        moveeel(-1, 0);
    }
    function do_w(event) {
        moveeel(0, -1);
    }
    function do_s(event) {
        moveeel(1, 0);
    }
    function do_a(event) {
        moveeel(0, 1);
    }
    function do_sp(event) {
        shock();
    }
    function do_restart(event) {
        if (canrestart())
            reset();
    }
    function do_next(event) {
        if (cannext()) {
            curlevel ++;
            reset(true);
        }
    }
    function do_audio() {
        audio_on = !audio_on;
        audioi.attr('href', 'svg/audio-' + (audio_on ? 'on' : 'off') + '.svg');
    }

    function drawsol(sol) {
        $(".sol").remove();
        if (!sol) return;
        var ex = game.eel[0];
        var ey = game.eel[1];
        var x = tx(ex, ey);
        var y = ty(ex, ey) - 20;
        for (var i = 0; i < sol.length; i ++) {
            var col = Math.floor(i * 255 / sol.length);
            col = 'rgb('+col+','+col+','+col+')';
            var nx = x, ny = y;
            if (sol[i] == 'q') {
                nx -= TR; ny -= TR;
            } else if (sol[i] == 'w') {
                nx += TR; ny -= TR;
            } else if (sol[i] == 's') {
                nx += TR; ny += TR;
            } else if (sol[i] == 'a') {
                nx -= TR; ny += TR;
            } else if (sol[i] == '*') {
                var c = $(document.createElementNS(svgNS, 'circle'))
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 15)
                    .attr('class', 'sol')
                    .css('stroke', col);
                board.append(c);
                continue;
            }
            ny += 40/sol.length;
            var l = $(document.createElementNS(svgNS, 'line'))
                .attr('x1', x)
                .attr('y1', y)
                .attr('x2', nx)
                .attr('y2', ny)
                .attr('class', 'sol')
                .css('stroke', col);
            board.append(l);
            x = nx;
            y = ny;
        }
    }

    var mouseX, mouseY;
    $(document).mousemove(function(event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    });
    $(document).keypress(function(event) {
        if (busy)
            return;
        if (page == 'game') {
            var eel = game.eel;
            if (DEBUG && '[][]'[hackk].charCodeAt(0) == event.keyCode) {
                hackk ++
                if (hackk == 4) {
                    hack = !hack;
                    $('body').css('background', hack ? 'brown' : '');
                    hackk = 0;
                    if (!hack) {
                        console.info(JSON.stringify(LEVELS[curlevel], 0, 2));
                    }
                }
            } else 
                hackk = 0;
            if (hack) {
                var boardOffset = svg.offset();
                var mx = (mouseX - boardOffset.left - bw/2) / TR;
                var my = (mouseY - boardOffset.top - bh/2) / TR;
                var x = Math.round(mx/2 + my/2);
                var y = Math.round(my/2 - mx/2);
                if (x >= -MR && x <= MR && y >= -MR && y <= MR) {
                    var tile = LEVELS[curlevel].map[MR+y][MR+x];
                    function settile(c) {
                        var s = LEVELS[curlevel].map[MR+y];
                        LEVELS[curlevel].map[MR+y] = s.substr(0, MR+x) + c + s.substr(MR+x+1);
                    }
                    if (event.keyCode == 32) {
                        settile(' ');
                    } else if (event.keyCode == 49) {
                        settile('1');
                    } else if (event.keyCode == 50) {
                        settile('2');
                    } else if (event.keyCode == 51) {
                        settile('3');
                    } else if (event.keyCode == 52) {
                        settile('4');
                    } else if (event.keyCode == 112) {
                        settile('p');
                    } else if (event.keyCode == 48) {
                        settile('0');
                    } else if (event.keyCode == 114) {
                        settile('*');
                    } else if (event.keyCode == 101) {
                        LEVELS[curlevel].eel = [x, y];
                    } else if (event.keyCode == 108) {
                        var lx = Math.abs(x - eel[eel.length-2]);
                        var ly = Math.abs(y - eel[eel.length-1]);
                        if (lx + ly == 1)
                            LEVELS[curlevel].eel.push(x, y);
                        else if (lx + ly == 0)
                            LEVELS[curlevel].eel.splice(eel.length-2, 2);
                    } else if (event.keyCode == 42) {
                        solver(start(), drawsol, function(sol, hp) {
                            if (sol == null)
                                return;
                            LEVELS[curlevel].hp = hp;
                            reset();
                            drawsol(sol);
                        });
                        return;
                    }
                    reset();
                }
            } else {
                if (event.keyCode == 113 || event.keyCode == 81)
                    do_q();
                else if (event.keyCode == 119 || event.keyCode == 87)
                    do_w();
                else if (event.keyCode == 115 || event.keyCode == 83)
                    do_s();
                else if (event.keyCode == 97 || event.keyCode == 65)
                    do_a();
                else if (event.keyCode == 32)
                    do_sp();
                else if (DEBUG && event.keyCode == 43) {
                    curlevel ++; reset();
                } else if (DEBUG && event.keyCode == 45) {
                    curlevel --; reset();
                } else if (DEBUG && event.keyCode == 42) {
                    solver(game, drawsol, drawsol);
                }
            }
            updateconsole();
        } else if (page == 'intro') {
            if (event.keyCode == 32 || event.keyCode == 13) {
                introplay();
            }
        } else if (page == 'menu') {
        }
    });
    svg.click(function(event) {
        if (busy)
            return;
        if (page == 'game') {
            if (hack)
                return;
            var eel = game.eel;
            var boardOffset = svg.offset();
            var mx = (mouseX - boardOffset.left - bw/2) / TR;
            var my = (mouseY - boardOffset.top - bh/2) / TR;
            var x = Math.round(mx/2 + my/2);
            var y = Math.round(my/2 - mx/2);
            if (x >= -MR && x <= MR && y >= -MR && y <= MR) {
                var lx = x - eel[0];
                var ly = y - eel[1];
                if (Math.abs(lx) + Math.abs(ly) == 1) {
                    if (lx == -1)
                        do_q();
                    else if (ly == -1)
                        do_w();
                    else if (lx == 1)
                        do_s();
                    else if (ly == 1)
                        do_a();
                } else if (lx == 0 && ly == 0)
                    do_sp();
            }
        }
    });
    $(document).keyup(function(event) {
        if (fadecallback)
            fadecallback();
        if (busy)
            return;
        if (page == 'game') {
            if (event.keyCode == 114 || event.keyCode == 82)
                do_restart();
            else if (event.keyCode == 109 || event.keyCode == 77)
                do_audio();
            else if (event.keyCode == 110 || event.keyCode == 78)
                do_next();
            else if (event.keyCode == 27)
                gameback();
        } else if (page == 'menu') {
            if (event.keyCode == 27)
                menuback();
        }
    });
    $(document).click(function(event) {
        if (fadecallback)
            fadecallback();
    });
    hunger2.click(function(event) {
        if (hack) {
            var offset = hunger2.offset();
            var x = Math.round((event.pageX - offset.left - 5) / 25);
            LEVELS[curlevel].hp = MAXHP - x;
            reset();
        }
    });
    qkey.click(do_q);
    wkey.click(do_w);
    skey.click(do_s);
    akey.click(do_a);
    spkey.click(do_sp);

    window.introplay = function() {
        if (page == 'intro') {
            $('#intro').addClass('left');
            $('#menu').removeClass('left right');
            page = 'menu';
            updatelevelbuttons();
            busy = true;
            setTimeout(function() { busy = false; }, 800);
        }
    };
    window.menuback = function() {
        if (page == 'menu') {
            $('#menu').addClass('right');
            $('#intro').removeClass('left right');
            page = 'intro';
            busy = true;
            setTimeout(function() { busy = false; }, 800);
        }
    };
    window.fadeto = fadeto;
    window.unfade = unfade;
    window.solverhp = function(starthp) {
        solver(game, drawsol, drawsol, starthp);
    };
});
