// core.js
// core of the bot


const Discord = require('discord.js');
var bot = new Discord.Client();
const fs = require('fs');
require('./module/console.js')(bot);

var tsun = true;    // tsundere mode
var cmdpref = '!';   // default command prefix

var token = fs.readFileSync('../profile.txt').toString();

var ch = {
    'main': '281188840084078594',
    'gekkylog': '281189261355515915',
    'current': '281188840084078594',
}

bot.login(token);

bot.on('ready', function () {
    bot.channels.get(ch.main).sendMessage('[online]');
    console.log('[online]');
    bot.user.setGame('Re:Born [Alpha]');
});

bot.on('message', (message) => {
    delete require.cache[require.resolve('./module/talk.js')];
    require('./module/talk.js')(bot, message, tsun, cmdpref);
    
    var is_a_command = false;

    delete require.cache[require.resolve('./module/command.js')];
    require('./module/command.js')(bot, message, cmdpref, (response) => {
        if (response.mode != undefined) {
            switch (response.mode) {
                case 'cmdpref': cmdpref = response.cmdpref;
                    break;
                case 'tsun': tsun = response.tsun;
            }
        } 
        is_a_command = response.is_a_command;
    });

    delete require.cache[require.resolve('./module/log.js')];
    require('./module/log.js').messageConsoleLog(bot, message, ch, is_a_command);

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
    bot.channels.get(ch.gekkylog).sendMessage('<@143399021740818432>').then(() => {
        bot.channels.get(ch.gekkylog).sendMessage('```' + error.stack + '```').then(() => {
            process.exit(3);
        })
    });
})
