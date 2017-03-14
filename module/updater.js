// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;

module.exports = () => {
    var checker = setInterval(() => {
        console.log('checking git status.');
        statuscheck = exec('git status');
        statuscheck.stdout.on('data', (data) => {
            text = data.toString();
            if (text.indexOf('up-to-date') < 0) {
                clearInterval(checker);
                var need_full_reload = false;
                var need_gekky_reload = false;
                console.log('What Changed:');
                whatchanged = exec('git log --name-status HEAD^..HEAD');
                whatchanged.stdout.on('data', (data) => {
                    var array = data.toString().split('\n');

                    for (i in array) {
                        if (array[i].indexOf('updater.js') >= 0 || array[i].indexOf('frame.js') >= 0) {
                            need_full_reload = true;
                        }
                        if (array[i].indexOf('core.js') >= 0) {
                            need_gekky_reload = true;
                        }
                    }
                    if (!need_full_reload) {
                        if (need_gekky_reload) {
                            console.log('Gekky reload needed.');
                        }
                    } else {
                        console.log('Full reload needed.');
                    }
                });
                console.log('Updating...');
                updateing = exec('git remote update');
                updateing.stdout.on('data', (data) => {
                    console.log('data: ' + data);
                })
                updateing.on('exit', (code) => {
                    console.log('exited: ' + code);
                })
            }
        });
    }, 1000);
}