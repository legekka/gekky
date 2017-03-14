// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;
var resp = {
    'update': false,
    'full': false,
    'core': false,
    'data': ''
}

module.exports = {
    ver: (callback) => {
        lastcomm = exec('git log --name-status HEAD^..HEAD');
        lastcomm.stdout.on('data', (data) => {
            var title = data.toString().split('\n')[4].trim();
            return callback(title);
        });
    },
    update: (callback) => {
        statuscheck = exec('git pull origin master');
        statuscheck.stdout.on('data', (data) => {
            text = data.toString();
            resp.update = false;
            if (text.indexOf('up-to-date') < 0) {
                resp.update = true;
                if (text.indexOf('frame.js') >= 0) {
                    resp.full = true;
                }
                if (text.indexOf('core.js') >= 0 ||
                    text.indexOf('console.js') >= 0) {
                    resp.core = true;
                }
                resp.data = text;
                if (text.indexOf('Updating') < 0) {
                    return callback(resp);
                } else {
                    return callback({ 'update': false });
                }
            } else {
                return callback(resp);
            }
        });
    }
}