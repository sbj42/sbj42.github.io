const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const stringify = require('json-stable-stringify');

const app = express();

var db = {
    things: {},
    places: {}
};

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/load', function(req, res) {
    console.log('Loading...');
    console.log('  Done');
    res.json(db);
});

app.post('/save', function(req, res) {
    console.log('Saving...');
    for (var x in req.body.things) {
        if (!req.body.things[x]) {
            if (db.things[x]) {
                console.log('  Deleting thing ' + x);
                delete db.things[x];
            }
        } else {
            console.log('  Updating thing ' + x);
            db.things[x] = req.body.things[x];
        }
    }
    for (var x in req.body.places) {
        if (!req.body.places[x]) {
            if (db.places[x]) {
                console.log('  Deleting place ' + x);
                delete db.places[x];
            }
        } else {
            console.log('  Updating place ' + x);
            db.places[x] = req.body.places[x];
        }
    }
    fs.writeFile('data/db.json', stringify(db, {space: '  '}), 'utf8', function(err) {
        if (err)
            console.error(err);
        else
            console.log('  Done');
        res.json({});
    });
});

fs.readFile('data/db.json', 'utf8', function(err, data) {
    if (err && err.code != 'ENOENT')
        return console.error(err);
    else if (!err)
        db = JSON.parse(data);
    app.listen(8101, function () {
        console.log('Listening on port 8101...');
    });
});
