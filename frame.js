// frame.js
// frame of the core.js

const fs = require('fs');
const Discord = require('discord.js');
var exec = require('child_process').exec;
var bot = new Discord.Client();

var isStarted = false;  // events
var Reloading = false;
var Starting = false;

var token = fs.readFileSync('../data/profile.txt').toString();

var main = '281188840084078594';

var gekky;  // The child process

bot.login(token);

bot.on('ready', function () {
    if (!isStarted) {
        bot.channels.get(main).sendMessage('{Frame}[online]');
        console.log('{Frame}[online]');
        bot.user.setGame('{Frame}');
    }
});

bot.on('message', (message) => {
    if (message.channel.id == main && (message.author.id == '143399021740818432' || message.author.id == bot.user.id)) {
        var lower = message.content.toLowerCase();
        if (lower == '!start') {
            if (!isStarted) {
                bot.channels.get(main).sendMessage('{Frame} Starting gekky...');
                Starting = true;
            } else {
                bot.channels.get(main).sendMessage('{Frame} Gekky is already running...');
            }
        }
    }
})

function frame() {
    isStarted = true;
    gekky = exec('node ./core.js');
    gekky.stdout.on('data', function (data) {
        console.log(data.substr(0, data.length - 1));
    });
    gekky.on('exit', (code) => {
        if (code == 1) {
            isStarted = false;
            bot.channels.get(main).sendMessage('{Frame} Stopping gekky...');
            bot.user.setGame('{Frame}');
        }
        if (code == 2) {
            Reloading = true;
            bot.channels.get(main).sendMessage('{Frame} Reloading gekky...');
        }
    });
}

setInterval(() => {
    if (Starting) {
        Starting = false;
        frame();
    }
    if (Reloading) {
        Reloading = false;
        frame();
    }
},1000);