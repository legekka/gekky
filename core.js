// core.js
// core of the bot


var Discord = require('discord.js');
var reqreload = require('./module/reqreload.js');
var fs = require('fs');
var c = require('chalk');

var core = {
    'autorun': {
        'irc': true,
        'osutrack': true,
        'heartbeat': true,
        'cachemanager': true,
        'yrexia': true,
        'waifucloud': true,
        'memwatch': true
    },
    'bot': new Discord.Client(),
    'ready': false,
    'cachelimit': 50,
    'tsun': true,       // tsundere mode
    'cmdpref': fs.readFileSync('../pref.txt').toString(),     // default command prefix
    'token': fs.readFileSync('../profile.txt').toString(),
    'ch': {
        'main': '281188840084078594',
        'gekkylog': '281189261355515915',
        'gekkyerrorlog': '303610093226819584',
        'osuirc': '289509321446916096',
        'webps': '299862573078151178',
        'hun_scores': '261144312387993610',
        'hun_scorespam': '319115815783759872',
        'current': '281188840084078594',
        'osuscores': '347807562202218498'
    },
    'servers': [],
    'picker': {
        'server': false,
        'id': '',
        'channel': false
    },
    'deadlist': [],
    // osu!irc part
    'osuirc': {
        'client': undefined,
        'irc_online': false,
        'irc_channel': 'legekka',
        'irc_pin': '',
        'irc_online_users': '',  // online user interval-timer
    },
    // osu!track part
    'osutrack_running': false,
    'osutrack': undefined,
    // yrexia part
    'holopadip': '',
    // waifucloud client
    'waifucloud': {
        "client": undefined,
        "connection": undefined,
        "waifuEmitter": undefined,
        "sync": undefined,
        "autoconnect": undefined,
        //"speed": undefined
    },
    // heartbeat interval
    'heartbeat': {
        'interval': undefined,
        'state': undefined
    }
}

process.on('uncaughtException', function (error) {
    console.log(error.stack);
    if (core.bot.channels.get(core.ch.gekkyerrorlog) != undefined) {
        if (error.message.startsWith('Heartbeat missed.')) {
            core.bot.channels.get(core.ch.gekkyerrorlog).send('```' + error.stack + '```').then(() => {
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
        } else {
            core.bot.channels.get(core.ch.gekkyerrorlog).send('<@143399021740818432>').then(() => {
                core.bot.channels.get(core.ch.gekkyerrorlog).send('```' + error.stack + '```').then(() => {
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
        }
    } else {
        process.exit(3);
    }
})

//starting default tasks

require('./module/console.js')(core);

if (core.autorun.cachemanager) {
    require('./module/cachemanager.js').start(core);
}
if (core.autorun.yrexia) {
    require('./module/yrexia.js').start(core);
}
if (core.autorun.waifucloud) {
    require('./module/waifucloud.js').start(core);
}
if (core.autorun.memwatch) {
    require('./module/memwatch.js').start(core);
}
core.bot.login(core.token);

core.bot.on('ready', function () {
    if (!core.ready) {
        core.ready = true;
        if (core.autorun.irc) { core.client = require('./module/osuirc.js').start(core); }
        if (core.autorun.osutrack) { core.osutrack = require('./module/osutrack.js').startChecker(core); }
        if (core.autorun.heartbeat) { require('./module/heartbeat.js').start(core); }
        core.bot.channels.get(core.ch.main).send('[online]');
        console.log(c.gray('[Discord]') + ' online');
    }
    core.bot.user.setStatus("online");
    reqreload('./updater.js').ver((motd) => {
        core.bot.user.setGame(motd);
    });
    require('./module/channelpicker.js').build(core);
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

    reqreload('./kill.js').kill(core, message);

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
