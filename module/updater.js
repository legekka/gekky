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