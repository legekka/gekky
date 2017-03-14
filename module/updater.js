// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;
var need_update = false;
var need_full_reload = false;
var need_core_reload = false;

module.exports = (callback) => {
    statuscheck = exec('git pull origin master');
    statuscheck.stdout.on('data', (data) => {
        console.log('data: ' + data);
        text = data.toString();
        if (text.indexOf('up-to-date') < 0) {
             need_update = true;
            if (data.toString().indexOf('updater.js') >= 0 || data.toString().indexOf('frame.js') >= 0) {
                console.log(data.toString());
                need_full_reload = true;
                console.log('full reload needed');
            }
            if (data.toString().indexOf('core.js') >= 0) {
                console.log(data.toString());
                need_core_reload = true;

                console.log('core reload needed.');
            }
        } else {
            console.log('uptodate');
        }
    });
    return callback({
        'update': need_update,
        'full': need_full_reload,
        'core': need_core_reload
    })
}