// console.js
// gekky's console module
var reqreload = require('./reqreload.js');
const c = require('chalk');

module.exports = function (core) {
    var inp = process.openStdin();
    inp.addListener('data', (d) => {
        if (core.discord.picker.server || core.discord.picker.channel) {
            reqreload('./channelpicker.js').go(core, d);
        } else if (d.toString().startsWith('>')) {
            core.discord.bot.channels.get(core.ch.current).send(d.toString().substr(1));
        } else {
            var cmd = d.toString().toLowerCase().trim();
            if (cmd == 'close' || cmd == 'stop') {
                if (core.irc_online) {
                    reqreload('./osuirc.js').stop(core);
                    setTimeout(() => {
                        core.discord.bot.destroy().then(() => {
                            process.exit(4);
                        });
                    }, 2000);
                } else {
                    core.discord.bot.destroy().then(() => {
                        process.exit(4);
                    })
                }
            } else if (cmd == 'reload') {
                if (core.irc_online) {
                    reqreload('./osuirc.js').stop(core);
                    setTimeout(() => {
                        core.discord.bot.destroy().then(() => {
                            process.exit(2);
                        });
                    }, 2000);
                } else {
                    core.discord.bot.destroy().then(() => {
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
                core.discord.bot.user.setStatus("dnd");
                console.log('Presence: dnd');
            } else if (cmd == 'online') {
                core.discord.bot.user.setStatus("online");
                console.log('Presence: online');
            } else if (cmd == 'waifu:connect') {
                reqreload('./waifucloud.js').connect(core);
            } else if (cmd == 'waifu:datacount') {
                reqreload('./waifucloud.js').dataCount(core);
            } else if (cmd == 'waifu:teszt2') {
                reqreload('./waifucloud.js').teszt2(core);
            } else if (cmd == 'waifu:save') {
                reqreload('./waifucloud.js').save(core);
            } else if (cmd == 'waifu:safp') {
                reqreload('./waifucloud.js').searchAllFilePath(core);
            } else if (cmd == 'waifu:stats') {
                reqreload('./waifucloud.js').stats(core);
            } else if (cmd == 'waifu:sync') {
                reqreload('./wrapper.js').sync(core);
            } else if (cmd == 'update') {
                reqreload('./updater.js').ver((motd) => {
                    core.discord.bot.user.setGame(motd);
                });
            } else if (cmd.startsWith('update-frame')) {
                var data = cmd.substr(13);
                reqreload('./updater.js').fullver((resp) => {
                    core.discord.bot.user.setGame(resp.ver);
                    core.discord.bot.channels.get(core.ch.main).send('[UPDATING] => ' + resp.ver + '\n' + resp.desc + '\n```' + data + '```');
                });
            }
            /* else if (cmd == 'teszt2') {
                require('./yrexia.js').teszt(core, '!location', 'HoloPadQHD');
            }*/

            // HAGYD UTOLSÓNAK!!!
            // Miért?
            // Idk.
            else if (cmd.startsWith('motd')) {
                core.discord.bot.user.setGame(d.toString().trim().substr(5));
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
