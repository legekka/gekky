// cachemanager.js
// managing cache folder and keeping size under the limit

var fs = require('fs');
var getSize = require('get-folder-size');

var path = '../cache/';

module.exports = {
    start: (core) => {
        setInterval(() => { manageSize(core.cachelimit) }, 1800000);
    },
    check: (core, message) => {
        checkSize(core.cachelimit, (size) => {
            if (message != undefined) {
                message.channel.sendMessage('Cache folder size: ' + size + '/' + core.cachelimit + ' Mb')
            }
            console.log('Cache folder size: ' + size + '/' + core.cachelimit + ' Mb')
        })
    },
    del: (message) => {
        if (message != undefined) {
            message.channel.sendMessage('Clearing...');
        }
        delCache();
        if (message != undefined) {
            message.channel.sendMessage('Cache deleted.');
        }
        console.log('Cache deleted.');
    }
}

function delCache() {
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

function checkSize(limit, callback) {
    getSize(path, (err, size) => {
        if (err) { throw err; }
        var mb = size / 1024 / 1024;
        var mbtext = mb.toFixed(2);
        console.log('Cache folder size: ' + mbtext + '/' + limit + ' Mb');
        return callback(mbtext);
    });
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