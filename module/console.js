// console.js
// gekky's console module
var reqreload = require('./reqreload.js');
const c = require('chalk');

module.exports = function (bot, globs) {
    var inp = process.openStdin();
    inp.addListener('data', (d) => {
        if (d.toString().startsWith('>')) {
            // sending messages here from console
        } else {
            var cmd = d.toString().toLowerCase().trim();
            if (cmd == 'close' || cmd == 'stop') {
                if (globs.irc_online) {
                    reqreload('./osuirc.js').stop(bot, globs, message)
                }
                bot.destroy().then(() => {
                    process.exit(1);
                })
            } else if (cmd == 'reload') {
                if (globs.irc_online) {
                    reqreload('./osuirc.js').stop(bot, globs, message)
                }
                bot.destroy().then(() => {
                    process.exit(2);
                })
            } else if (cmd == 'ircstart') {
                globs.client = reqreload('./osuirc.js').start(bot, globs);
            } else if (cmd == 'ircstop') {
                globs.client = reqreload('./osuirc.js').stop(bot, globs);
            } else if (cmd == 'ircreload') {
                if (globs.irc_online) {
                    reqreload('./osuirc.js').stop(bot, globs);
                    reqreload('./osuirc.js').start(bot, globs);
                } else {
                    console.log(c.yellow('[IRC] ') + 'is not connected.');
                }
            } else if (cmd == '') {
                // no input
            } else {
                console.log('Ismeretlen parancs: ' + cmd);
            }
        }
    })
}
