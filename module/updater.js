// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
const c = require('chalk');
const githook = require('github-webhook-handler');
var handler = githook({
    path: '/webhook',
    secret: 'kutya'
});
const http = require('http');

var resp = {
    'update': false,
    'full': false,
    'core': false,
    'irc': false,
    'data': ''
}

module.exports = {
    isRegistered: false,
    ver: (callback) => {
        lastcomm = exec('git log -n 1');
        lastcomm.stdout.on('data', (data) => {
            var title = data.toString().split('\n')[4].trim();
            return callback(title);
        });
    },

    fullver: (callback) => {
        lastcomm = exec('git log -n 1');
        lastcomm.stdout.on('data', (data) => {
            var text = data.toString().split('\n');
            var title = data.toString().split('\n')[4].trim();
            var str = '';
            var i = 5;
            while (i < text.length && text[i] != '') {
                str += text[i].trim() + '\n';
                i++;
            }
            return callback({
                'ver': title,
                'desc': str
            });
        });
    },

    registerUpdate: (callback) => {
        http.createServer((request, result) => {
            handler(request, result, function (error) {
                result.statusCode = 404;
                result.end("It's forbidden to do this!");
            });
        }).listen(4242);

        handler.on('error', (error) => {
            console.log(c.green('[UPDATER] ') + 'ERROR: ' + error.message);
            return callback(resp);
        });

        handler.on('push', (pushData) => {
            var output = execSync('git pull origin master');
            resp.update = true;
            if (output.indexOf('frame.js') >= 0) {
                resp.full = true;
            }
            if (output.indexOf('core.js') >= 0 ||
                output.indexOf('console.js') >= 0 ||
                output.indexOf('cachemanager.js') >= 0 || 
                output.indexOf('osutrack.js') >= 0) {
                resp.core = true;
            }
            if (output.indexOf('osuirc.js') >= 0) {
                resp.irc = true;
            }
            resp.data = output;

            return callback(resp);
        });
    }
}