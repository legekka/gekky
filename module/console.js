// console.js
// gekky's console module
var reqreload = require('./reqreload.js');

module.exports = function (bot, ch, client) {
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
                client = reqreload('./osuirc.js').start(bot, ch, client);
            } else if (cmd == 'ircstop') {
                client = reqreload('./osuirc.js').stop(bot, ch, client);
            } else {
                console.log('Ismeretlen parancs: ' + cmd);
            }
        }
    })
}
