// frame.js
// frame of the core.js

const fs = require('fs');
const Discord = require('discord.js');
var bot = new Discord.Client();
const clr = require('clear-require');

var isStarted = false;

var token = fs.readFileSync('../data/profile.txt').toString();

var main = '281188840084078594';

bot.login(token);

bot.on('ready', function () {
    if (!isStarted) {
        bot.channels.get(main).sendMessage('{Frame}[online]');
        console.log('{Frame}[online]');
        bot.user.setGame('{Frame}');
    }
});

bot.on('message', (message) => {
    if (message.channel.id == main && message.author.id == '143399021740818432') {
        var lower = message.content.toLowerCase();
        if (lower == '!start') {
            if (!isStarted) {
                isStarted = true;
                message.channel.sendMessage('{Frame} Starting...').then(() => {
                    bot.destroy().then(() => {
                        require('./core.js')(bot, token);
                        console.log(require.cache);
                    });
                });
            } else {
                message.channel.sendMessage('{Frame} Már fut gekky.');
            }
        }
        if (lower == '!stop') {
            if (isStarted) {
                isStarted = false;
                message.channel.sendMessage('{Frame} Stopping...');
                shutdownAll();
                console.log(require.cache);
                bot.user.setGame('{Frame}');
            } else {
                message.channel.sendMessage('{Frame} Nincs elindítva gekky.');
            }
        }
        if (lower == '!reload') {
            if (isStarted) {
                message.channel.sendMessage('{Frame} Reloading...').then(() => {
                    bot.destroy().then(() => {
                        shutdownAll();
                        require('./core.js')(bot, token);
                    });
                });
            } else {
                message.channel.sendMessage('{Frame} Nincs elindítva gekky.');
            }
        }
    }
})


function shutdownAll() {
    clr('./core.js');   
    clr('./module/command.js');
    clr('./module/talk.js');
    clr('./module/blacklist.js');
    clr('./module/console.js'); 
}