// console.js
// gekky's console module
var reqreload = require('./reqreload.js');

module.exports = function (bot, globs) {
    var inp = process.openStdin();
    inp.addListener('data', (d) => {
        if (d.toString().startsWith('>')) {
            // sending messages here from console
        } else {
            var cmd = d.toString().toLowerCase().trim();
            if (cmd == 'close' || cmd == 'stop') {
                bot.destroy().then(() => {
                    process.exit(1);
                })
            } else if (cmd == 'reload') {
                bot.destroy().then(() => {
                    process.exit(2);
                })
            } else if (cmd == 'ircstart') {
                globs.client = reqreload('./osuirc.js').start(bot, globs);
            } else if (cmd == 'ircstop') {
                globs.client = reqreload('./osuirc.js').stop(bot, globs);
            } else if (cmd.startsWith('<')) {
                globs.client = reqreload('./osuirc.js').say(bot, globs, cmd.split(' ')[0].substr(1), cmd.substr(cmd.split(' ')[0].length + 1));
            } else if (cmd == '') {
                // no input
            } else {
                console.log('Ismeretlen parancs: ' + cmd);
            }
        }
    })
}
