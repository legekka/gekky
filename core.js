// core.js
// core of the bot


const Discord = require('discord.js');
var reqreload = require('./module/reqreload.js');
var bot = new Discord.Client();
const fs = require('fs');


var globs = {
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
    if (bot.channels.get(globs.ch.gekkylog) != undefined) {
        bot.channels.get(globs.ch.gekkylog).sendMessage('<@143399021740818432>').then(() => {
            bot.channels.get(globs.ch.gekkylog).sendMessage('```' + error.stack + '```').then(() => {
                if (globs.irc_online) {
                    reqreload('./osuirc.js').stop(bot, globs);
                    setTimeout(() => {
                        bot.destroy().then(() => {
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

require('./module/console.js')(bot, globs);

bot.login(globs.token);

bot.on('ready', function () {
    if (!globs.ready) {
        globs.ready = true;
        globs.client = require('./module/osuirc.js').start(bot, globs);
        globs.osutrack = require('./module/osutrack.js').startChecker(bot, globs);
        bot.channels.get(globs.ch.main).sendMessage('[online]');
        console.log('[online]');
    }
    bot.user.setPresence({
        "status": "online",
    });
    reqreload('./updater.js').ver((motd) => {
        bot.user.setGame(motd);
    });
});

bot.on('message', (message) => {
    // talking messages
    reqreload('./talk.js').default(bot, globs, message);

    var is_a_command = false;

    // commands with prefix
    reqreload('./command.js')(bot, message, globs, (response) => {
        if (response.mode != undefined) {
            switch (response.mode) {
                case 'cmdpref': globs.cmdpref = response.cmdpref;
                    break;
                case 'tsun': globs.tsun = response.tsun;
            }
        }
        is_a_command = response.is_a_command;
    });

    // message logger
    reqreload('./log.js').messageConsoleLog(bot, message, globs, is_a_command);

    // webp converter when image attachment
    reqreload('./webpconvert.js').message(bot, message, globs);

    // kilépés
    if (message.author.id == '143399021740818432' && (message.content.toLowerCase() == '!stop' || message.content.toLowerCase() == '!close')) {
        if (globs.irc_online) {
            reqreload('./osuirc.js').stop(bot, globs, message);
            setTimeout(() => {
                bot.destroy().then(() => {
                    process.exit(4);
                });
            }, 2000);
        } else {
            bot.destroy().then(() => {
                process.exit(4);
            });
        }
    }
    if (message.author.id == '143399021740818432' && message.content.toLowerCase() == '!reload') {
        if (globs.irc_online) {
            reqreload('./osuirc.js').stop(bot, globs, message);
            setTimeout(() => {
                bot.destroy().then(() => {
                    process.exit(2);
                });
            }, 2000);

        } else {
            bot.destroy().then(() => {
                process.exit(2);
            })
        }
    }
})


