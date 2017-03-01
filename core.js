// core.js
// core of the bot


const Discord = require('discord.js');
var bot = new Discord.Client();
const fs = require('fs');
require('./module/console.js')(bot);

var tsun = true;    // tsundere mode
var cmdpref = '!';   // default command prefix

var token = fs.readFileSync('../data/profile.txt').toString();

var ch = {
    'main': '281188840084078594',
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
    delete require.cache[require.resolve('./module/command.js')];
    require('./module/command.js')(bot, message, cmdpref, (response) => {
        if (response != undefined) {
            switch (response.mode) {
                case 'cmdpref': cmdpref = response.cmdpref;
                    break;
                case 'tsun': tsun = response.tsun;
            }
        }
    });
    // frame rész, egyenlőre nem tudtam másképp megoldani hogy működjön. Majd még gondolkozom rajta
    if (message.author.id == '143399021740818432' && (message.content.toLowerCase() == '!stop' || message.content.toLowerCase() == '!close')) {
        process.exit(1);
    }
    if (message.author.id == '143399021740818432' && message.content.toLowerCase() == '!reload') {
        process.exit(2);
    }
})