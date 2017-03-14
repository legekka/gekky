// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;

module.exports = () => {
    setInterval(() => {
        console.log('checking git status.');
        statuscheck = exec('git status');
        statuscheck.stdout.on('data', (data) => {
            text = data.toString();
            if (text.indexOf('up-to-date') >= 0) {
                console.log('up-to-date');
            } else {
                console.log('not up-to-date');
            }
        });
    }, 1000);
}