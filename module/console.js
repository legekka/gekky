// console.js
// gekky's console module
var reqreload = require('./reqreload.js');
const c = require('chalk');

module.exports = function (core) {
    var inp = process.openStdin();
    inp.addListener('data', (d) => {
        if (core.picker.server || core.picker.channel) {
            reqreload('./channelpicker.js').go(core, d);
        } else if (d.toString().startsWith('>')) {
            core.bot.channels.get(core.ch.current).send(d.toString().substr(1));
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
            } else if (cmd == 'checkcache') {
                require('./cachemanager.js').check(core);
            } else if (cmd == 'delcache') {
                require('./cachemanager.js').del();
            } else if (cmd == 'channelbuilder') {
                reqreload('./channelpicker.js').build(core);
            } else if (cmd == 'go') {
                reqreload('./channelpicker.js').go(core);
            } else if (cmd == 'dnd') {
                core.bot.user.setPresence({
                    "status": "dnd",
                });
                console.log('Presence: dnd');
            } else if (cmd == 'online') {
                core.bot.user.setPresence({
                    "status": "online",
                });
                console.log('Presence: online');
            } else if (cmd == 'waifuconnect') {
                reqreload('./waifucloud.js').connect(core);
            } else if (cmd == 'teszt') {
                reqreload('./waifucloud.js').teszt(core);
            } else if (cmd == 'teszt2') {
                reqreload('./waifucloud.js').teszt2(core);
            } else if (cmd == 'teszt3') {
                reqreload('./waifucloud.js').teszt3(core);
            } else if (cmd == 'teszt4') {
                reqreload('./waifucloud.js').teszt4(core);
            }
            /* else if (cmd == 'teszt2') {
                require('./yrexia.js').teszt(core, '!location', 'HoloPadQHD');
            }*/

            // HAGYD UTOLSÓNAK!!!
            else if (cmd.startsWith('motd')) {
                core.bot.user.setGame(d.toString().trim().substr(5));
                console.log('New motd: ' + d.toString().trim().substr(5));
            }
            else if (cmd == '') {
                // no input
            } else {
                console.log('Ismeretlen parancs: ' + cmd);
            }
        }
    })
}
