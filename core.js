// core.js
// core of the bot


const Discord = require('discord.js');
var reqreload = require('./module/reqreload.js');
const fs = require('fs');

var core = {
    'bot': new Discord.Client(),
    'tsun': true,       // tsundere mode
    'cmdpref': fs.readFileSync('../pref.txt').toString(),     // default command prefix
    'token': fs.readFileSync('../profile.txt').toString(),
    'ch': {
        'main': '281188840084078594',
        'gekkylog': '281189261355515915',
        'osuirc': '289509321446916096',
        'webps': '299862573078151178',
        'hun_scores': '261144312387993610',
        'current': '281188840084078594',
    },
    'client': undefined,
    'irc_online': false,
    'irc_channel': 'legekka',
    'irc_pin': '',
    'irc_online_users': '',  // online user interval-timer
    'ready': false,
    'osutrack_running': false,
    'osutrack': undefined
}

process.on('uncaughtException', function (error) {
    console.log(error.stack);
    if (core.bot.channels.get(core.ch.gekkylog) != undefined) {
        core.bot.channels.get(core.ch.gekkylog).sendMessage('<@143399021740818432>').then(() => {
            core.bot.channels.get(core.ch.gekkylog).sendMessage('```' + error.stack + '```').then(() => {
                if (core.irc_online) {
                    reqreload('./osuirc.js').stop(core);
                    setTimeout(() => {
                        core.bot.destroy().then(() => {
                            process.exit(3);
                        });
                    }, 2000);
                } else {
                    process.exit(3);
                }
            })
        });
    } else {
        process.exit(3);
    }
})

require('./module/console.js')(core);

core.bot.login(core.token);

core.bot.on('ready', function () {
    if (!core.ready) {
        core.ready = true;
        core.client = require('./module/osuirc.js').start(core);
        core.osutrack = require('./module/osutrack.js').startChecker(core);
        core.bot.channels.get(core.ch.main).sendMessage('[online]');
        console.log('[online]');
    }
    core.bot.user.setPresence({
        "status": "online",
    });
    reqreload('./updater.js').ver((motd) => {
        core.bot.user.setGame(motd);
    });
});

core.bot.on('message', (message) => {
    // talking messages
    reqreload('./talk.js').default(core, message);

    var is_a_command = false;

    // commands with prefix
    reqreload('./command.js')(core, message, resp => {
        is_a_command = resp.is_a_command;
        core.tsun = resp.tsun;
        core.cmdpref = resp.cmdpref;
    });

    // message logger
    reqreload('./log.js').messageConsoleLog(core, message, is_a_command);

    // webp converter when image attachment
    reqreload('./webpconvert.js').message(core, message);

    // kilépés
    if (message.author.id == '143399021740818432' && (message.content.toLowerCase() == '!stop' || message.content.toLowerCase() == '!close')) {
        if (core.irc_online) {
            reqreload('./osuirc.js').stop(core, message);
            setTimeout(() => {
                core.bot.destroy().then(() => {
                    process.exit(4);
                });
            }, 2000);
        } else {
            core.bot.destroy().then(() => {
                process.exit(4);
            });
        }
    }
    if (message.author.id == '143399021740818432' && message.content.toLowerCase() == '!reload') {
        if (core.irc_online) {
            reqreload('./osuirc.js').stop(core, message);
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
    }
})


