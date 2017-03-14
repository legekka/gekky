// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;
var need_update = false;
var need_full_reload = false;
var need_core_reload = false;

module.exports = (callback) => {
    statuscheck = exec('git pull origin master');
    statuscheck.stdout.on('data', (data) => {
        text = data.toString();
        if (text.indexOf('up-to-date') < 0) {
            need_update = true;
            if (data.toString().indexOf('frame.js') >= 0) {
                need_full_reload = true;
            }
            if (data.toString().indexOf('core.js') >= 0 ||
                data.toString().indexOf('console.js') >= 0) {
                need_core_reload = true;
            }
        }
        return callback({
            'update': need_update,
            'full': need_full_reload,
            'core': need_core_reload
        })
    });
}