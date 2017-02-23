const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
require('./module/console.js')(bot);

var tsun = true; // tsundere mode


var token = fs.readFileSync('../data/profile.txt').toString();

var ch = {
    'main': '281188840084078594',
    'osotracklog': '281189324660408320'
}

bot.login(token);
bot.on('ready', function () {
    bot.channels.get(ch.main).sendMessage('[online]');
    console.log('[online]');
    bot.user.setGame('Re:Born [Alpha]');
});

bot.on('message', (message) => {
    delete require.cache[require.resolve('./module/talk.js')];
    require('./module/talk.js')(bot,message,tsun);
})