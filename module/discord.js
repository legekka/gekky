// discord.js
// discord module
var Discord = require('discord.js');
var reqreload = require('./module/reqreload.js');
var fs = require('fs');
var c = require('chalk');

module.exports = {
    start: (core) => {
        core.discord.bot = new Discord.Client();
        core.discord.bot.login(core.token);
        core.discord.bot.on('ready', function () {
            if (!core.discord.ready) {
                core.discord.ready = true;
                if (core.autorun.irc) { core.client = require('./module/osuirc.js').start(core); }
                if (core.autorun.osutrack) { core.osutrack = require('./module/osutrack.js').startChecker(core); }
                if (core.autorun.heartbeat) { require('./module/heartbeat.js').start(core); }
                core.discord.bot.channels.get(core.ch.main).send('[online]');
                console.log(c.gray('[Discord]') + ' online');
            }
            core.discord.bot.user.setStatus("online");
            reqreload('./updater.js').ver((motd) => {
                core.discord.bot.user.setGame(motd);
            });
            require('./module/channelpicker.js').build(core);
        });
        
        core.discord.bot.on('message', (message) => {
            // tsundere messages
            reqreload('./talk.js').default(core, message);
            // commands with prefix
            var is_a_command = reqreload('./dcommand.js')(core, message);
            // message logger
            reqreload('./log.js').messageConsoleLog(core, message, is_a_command);
            // webp converter when image attachment
            reqreload('./webpconvert.js').message(core, message);
            // kill - message deleter
            reqreload('./kill.js').kill(core, message);
        
            // exit
            var prefix = core.gsettings.getCmdpref(message.guild ? message.guild.id : message.channel.id);
            if (message.author.id == '143399021740818432' && (message.content.toLowerCase() == `${prefix}stop` || message.content.toLowerCase() == `${prefix}close`)) {
                if (core.irc_online) {
                    reqreload('./osuirc.js').stop(core, message);
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
            if (message.author.id == '143399021740818432' && message.content.toLowerCase() == `${prefix}reload`) {
                if (core.irc_online) {
                    reqreload('./osuirc.js').stop(core, message);
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