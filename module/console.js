// console.js
// gekky's console module
var reqreload = require('./reqreload.js');
const c = require('chalk');

module.exports = function (core) {
    var inp = process.openStdin();
    inp.addListener('data', (d) => {
        if (d.toString().startsWith('>')) {
            // sending messages here from console
        } else {
            var cmd = d.toString().toLowerCase().trim();
            if (cmd == 'close' || cmd == 'stop') {
                if (core.irc_online) {
                    reqreload('./osuirc.js').stop(core);
                    setTimeout(() => {
                        core.bot.destroy().then(() => {
                            process.exit(4);
                        });
                    }, 2000);
                } else {
                    core.bot.destroy().then(() => {
                        process.exit(4);
                    })
                }
            } else if (cmd == 'reload') {
                if (core.irc_online) {
                    reqreload('./osuirc.js').stop(core);
                    setTimeout(() => {
                        core.bot.destroy().then(() => {
                            process.exit(2);
                        });
                    }, 2000);
                } else {
                    core.bot.destroy().then(() => {
                        process.exit(2);
                    })
                }
            } else if (cmd == 'ircstart') {
                core.client = reqreload('./osuirc.js').start(core);
            } else if (cmd == 'ircstop') {
                core.client = reqreload('./osuirc.js').stop(core);
            } else if (cmd == 'ircreload') {
                if (core.irc_online) {
                    reqreload('./osuirc.js').stop(core);
                    reqreload('./osuirc.js').start(core);
                } else {
                    console.log(c.yellow('[IRC] ') + 'is not connected.');
                }
            } else if (cmd == 'core') {
                console.log(core);
            } else if (cmd == 'osu_top20list') {
                reqreload('./osutrack.js').top20list();
            } else if (cmd == 'osu_defaultscores') {
                reqreload('./osutrack.js').defaultScores();
            } else if (cmd == 'osu_checkscores') {
                reqreload('./osutrack.js').checkScores(core);
            } else if (cmd == 'osu_startchecker') {
                reqreload('./osutrack.js').startChecker(core);
            } else if (cmd == 'osu_stopchecker') {
                reqreload('./osutrack.js').stopChecker(core);
            } else if (cmd == 'teszt') {
                reqreload('./music.js').teszt(core);
            } else if (cmd == 'teszt2') {
                reqreload('./yrexia.js').teszt(core, '!getIp', 'holopad');
            }
            else if (cmd == '') {
                // no input
            } else {
                console.log('Ismeretlen parancs: ' + cmd);
            }
        }
    })
}
