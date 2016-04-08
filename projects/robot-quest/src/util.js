'use strict';
define({
    getText: function(file) {
        return new Promise(function(resolve) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.responseText);
            };
            xhr.open('GET', file, true);
            xhr.send();
        });
    },

    getJson: function(file) {
        return this.getText(file).then(JSON.parse);
    }
});