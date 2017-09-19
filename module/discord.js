// discord.js
// discord module


var discord = {
    start: (core) => {
        core.discord.bot = new require('discord.js').Client();
        core.discord.bot.login(core.discord.token);
        core.discord.bot.on('ready', function () {
            if (!core.discord.ready) {
                core.discord.ready = true;
                if (core.autorun.irc) { core.client = require('./osuirc.js').start(core); }
                if (core.autorun.osutrack) { core.osutrack.client = require('./osutrack.js').startChecker(core); }
                if (core.autorun.heartbeat) { require('./heartbeat.js').start(core); }
                core.discord.bot.channels.get(core.discord.ch.main).send('[online]');
                console.log(c.gray('[Discord]') + ' online');
            }
            core.discord.bot.user.setStatus("online");
            updater.ver((motd) => {
                core.discord.bot.user.setGame(motd);
            });
            channelpicker.build(core);
        });
        core.discord.bot.on('message', (message) => {
            // tsundere messages
            talk.default(core, message);
            // commands with prefix
            var is_a_command = dcommand(core, message);
            // message logger
            log.messageConsoleLog(core, message, is_a_command);
            // webp converter when image attachment
            webpconvert.message(core, message);
            // kill - message deleter
            kill.kill(core, message);
            // exit
            var prefix = core.discord.dsettings.getCmdpref(message.guild.id);
            if (core.discord.ownerID == message.author.id && (message.content.toLowerCase() == `${prefix}stop` || message.content.toLowerCase() == `${prefix}close`)) {
                if (core.osuirc.ready) {
                    osuirc.stop(core, message);
                    setTimeout(() => {
                        core.discord.bot.destroy().then(() => {
                            process.exit(4);
                        });
                    }, 2000);
                } else {
                    core.discord.bot.destroy().then(() => {
                        process.exit(4);
                    });
                }
            }
            if (core.discord.ownerID == message.author.id && message.content.toLowerCase() == `${prefix}reload`) {
                if (core.osuirc.ready) {
                    osuirc.stop(core, message);
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
            }
        })
    }
}