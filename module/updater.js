// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;

module.exports = () => {
    var checker = setInterval(() => {
        statuscheck = exec('git pull origin master');
        statuscheck.stdout.on('data', (data) => {
            console.log('data: ' + data);
            text = data.toString();
            if (text.indexOf('up-to-date') < 0) {
                clearInterval(checker);
                var need_full_reload = false;
                var need_gekky_reload = false;
                console.log('ANYÁDATMÁR.');
                if (data.toString().indexOf('updater.js') >= 0 || data.toString().indexOf('frame.js') >= 0) {
                    console.log(data.toString());
                    need_full_reload = true;
                    console.log('full reload needed');
                }
                if (data.toString().indexOf('core.js') >= 0) {
                    console.log(data.toString());
                    need_gekky_reload = true;
                    console.log('core reload needed.');
                }
                if (!need_full_reload) {
                    if (need_gekky_reload) {
                        console.log('Gekky reload needed.');
                    }
                } else {
                    console.log('Full reload needed.');
                }
            } else {
                console.log('uptodate');
            }
        });
    }, 5000);
}