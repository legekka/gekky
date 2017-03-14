// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;
var resp = {
    'update': false,
    'full': false,
    'core': false
}

module.exports = (callback) => {
    statuscheck = exec('git pull origin master');
    statuscheck.stdout.on('data', (data) => {
        text = data.toString();
        if (text.indexOf('up-to-date') < 0) {
            resp.update = true;
            if (data.toString().indexOf('frame.js') >= 0) {
                resp.full = true;
            }
            if (data.toString().indexOf('core.js') >= 0 ||
                data.toString().indexOf('console.js') >= 0) {
                resp.core = true;
            }
        }
        return callback(resp)
    });
}