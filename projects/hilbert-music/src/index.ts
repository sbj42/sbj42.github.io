import './resolution';
import './chords';
import './vis1d';
import './vis2d';

if (!('AudioContext' in window)) {
    document.getElementById('desc').innerHTML += '<br/><br/><b>Your browser doesn\'t support the Web Audio API.';
}