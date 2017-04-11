// cachemanager.js
// managing cache folder and keeping size under the limit

var fs = require('fs');
var getSize = require('get-folder-size');

var path = '../cache/';

module.exports = (core) => {
    setInterval(manageSize(core.limit), 10000);
}

function manageSize(limit) {
    getSize(path, (err, size) => {
        if (err) { throw err; }
        var mb = size / 1024 / 1024;
        var mbtext = mb.toFixed(2);
        console.log('Cache folder size: ' + mbtext + '/' + limit + ' Mb');
        if (mb > limit) {
            console.log('Clearing...');
            fs.readdir(path, (err, files) => {
                if (err) { throw err; }
                for (const file of files) {
                    fs.unlink(path + file, err => {
                        if (err) { throw err; }
                    });
                }
            });
        }
    });
}