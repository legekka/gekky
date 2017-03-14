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
        'current': '281188840084078594',
    },
    'client': undefined,
    'irc_online': false,
    'irc_channel': 'legekka',
}

require('./module/console.js')(bot, globs);

bot.login(globs.token);

bot.on('ready', function () {
    //globs.client = require('./module/osuirc.js').start(bot, globs);
    bot.channels.get(globs.ch.main).sendMessage('[online]');
    console.log('[online]');
    bot.user.setPresence({
        "status": "online",
    });
    reqreload('./updater.js').ver((motd) => {
        bot.user.setGame(motd);
    });  
});

bot.on('message', (message) => {
    reqreload('./talk.js')(bot, globs, message);

    var is_a_command = false;

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

    reqreload('./log.js').messageConsoleLog(bot, message, globs, is_a_command);

    // frame rész, egyenlőre nem tudtam másképp megoldani hogy működjön. Majd még gondolkozom rajta
    if (message.author.id == '143399021740818432' && (message.content.toLowerCase() == '!stop' || message.content.toLowerCase() == '!close')) {
        bot.destroy().then(() => {
            process.exit(1);
        })
    }
    if (message.author.id == '143399021740818432' && message.content.toLowerCase() == '!reload') {
        bot.destroy().then(() => {
            process.exit(2);
        })
    }
})

process.on('uncaughtException', function (error) {
    console.log(error.stack);
    bot.channels.get(globs.ch.gekkylog).sendMessage('<@143399021740818432>').then(() => {
        bot.channels.get(globs.ch.gekkylog).sendMessage('```' + error.stack + '```').then(() => {
            process.exit(3);
        })
    });
})
