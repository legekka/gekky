// jsconsole.js
// gekky's console module


var jsconsole = {
    start: (core) => {
        var inp = process.openStdin();
        inp.addListener('data', (d) => {
            if (core.discord.picker.server || core.discord.picker.channel) {
                channelpicker.go(core, d);
            } else if (d.toString().startsWith('>')) {
                core.discord.bot.channels.get(core.discord.ch.current).send(d.toString().substr(1));
            } else {
                var cmd = d.toString().toLowerCase().trim();
                if (cmd == 'close' || cmd == 'stop') {
                    if (core.osuirc.ready) {
                        osuirc.stop(core);
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
                    if (core.osuirc.ready) {
                        osuirc.stop(core);
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
                    core.osuirc.client = osuirc.start(core);
                } else if (cmd == 'ircstop') {
                    core.osuirc.client = osuirc.stop(core);
                } else if (cmd == 'ircreload') {
                    if (core.osuirc.ready) {
                        osuirc.stop(core);
                        osuirc.start(core);
                    } else {
                        console.log(c.yellow('[IRC] ') + 'is not connected.');
                    }
                } else if (cmd == 'core') {
                    console.log(core);
                } else if (cmd == 'osu_top20list') {
                    osutrack.top20list();
                } else if (cmd == 'osu_defaultscores') {
                    osutrack.defaultScores();
                } else if (cmd == 'osu_checkscores') {
                    osutrack.checkScores(core);
                } else if (cmd == 'osu_startchecker') {
                    osutrack.startChecker(core);
                } else if (cmd == 'osu_stopchecker') {
                    osutrack.stopChecker(core);
                } else if (cmd == 'checkcache') {
                    cachemanager.check(core);
                } else if (cmd == 'delcache') {
                    cachemanager.del();
                } else if (cmd == 'channelbuilder') {
                    channelpicker.build(core);
                } else if (cmd == 'go') {
                    channelpicker.go(core);
                } else if (cmd == 'dnd') {
                    core.discord.bot.user.setStatus("dnd");
                    console.log('Presence: dnd');
                } else if (cmd == 'online') {
                    core.discord.bot.user.setStatus("online");
                    console.log('Presence: online');
                } else if (cmd == 'waifu:connect') {
                    waifucloud.connect(core);
                } else if (cmd == 'waifu:datacount') {
                    waifucloud.dataCount(core);
                } else if (cmd == 'waifu:teszt2') {
                    waifucloud.teszt2(core);
                } else if (cmd == 'waifu:save') {
                    waifucloud.save(core);
                } else if (cmd == 'waifu:safp') {
                    waifucloud.searchAllFilePath(core);
                } else if (cmd == 'waifu:stats') {
                    waifucloud.stats(core);
                } else if (cmd == 'waifu:sync') {
                    wrapper.sync(core);
                } else if (cmd == 'update') {
                    updater.ver((motd) => {
                        core.discord.bot.user.setGame(motd);
                    });
                } else if (cmd.startsWith('update-frame')) {
                    var data = cmd.substr(13);
                    updater.fullver((resp) => {
                        core.discord.bot.user.setGame(resp.ver);
                        core.discord.bot.channels.get(core.discord.ch.main).send('[UPDATING] => ' + resp.ver + '\n' + resp.desc + '\n```' + data + '```');
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
}