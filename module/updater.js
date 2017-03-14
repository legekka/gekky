// updater.js
// checking and updating from github if needed

var exec = require('child_process').exec;

module.exports = () => {
    setInterval(() => {
        console.log('checking git status.');
        statuscheck = exec('git status -s');
        statuscheck.stdout.on('data', (data) => {console.log(data)});
    }, 1000);
}