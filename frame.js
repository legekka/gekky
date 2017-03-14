// frame.js
// frame of the core.js

const fs = require('fs');
const Discord = require('discord.js');
const c = require('chalk');
var exec = require('child_process').exec;
var bot = new Discord.Client();

var a = require('./module/updater.js')();

var motd = '[Frame]';

var isStarted = false;  // events
var Reloading = false;
var Starting = false;

var token = fs.readFileSync('../profile.txt').toString();

var main = '281188840084078594';

var gekky;  // The child process

var inp = process.openStdin();  // for the child process inputs

bot.login(token);

bot.on('ready', function () {
    if (!isStarted) {
        bot.channels.get(main).sendMessage('[Frame] online');
        console.log(c.red('[Frame]') + ' online');
        bot.user.setPresence({
            "status": "dnd",
        });
        bot.user.setGame(motd);
    }
});

bot.on('message', (message) => {
    if (message.channel.id == main && (message.author.id == '143399021740818432' || message.author.id == bot.user.id)) {
        var lower = message.content.toLowerCase();
        if (lower == '!start') {
            if (!isStarted) {
                console.log(c.red('[Frame]') + ' Starting gekky...');
                bot.channels.get(main).sendMessage('[Frame] Starting gekky...');
                Starting = true;
            } else {
                console.log(c.red('[Frame]') + ' Gekky is already running...');
                bot.channels.get(main).sendMessage('[Frame] Gekky is already running...');
            }
        } else if ((lower == '!reload' || lower == '!close' || lower == '!stop') && !isStarted) {
            console.log(c.red('[Frame]') + ' Gekky is not running...');
            bot.channels.get(main).sendMessage('[Frame] Gekky is not running...');
        }
        if (lower == '!isstarted') {
            isStarted = !isStarted;
            bot.channels.get(main).sendMessage('[Frame] isStarted = ' + isStarted);
        }
    }
})

function frame() {
    isStarted = true;
    gekky = exec('node ./core.js --color');
    gekky.stdout.on('data', function (data) {
        console.log(data.substr(0, data.length - 1));
    });
    gekky.on('exit', (code) => {
        if (code == 1) {
            isStarted = false;
            console.log(c.red('[Frame]') + ' Gekky has been stopped...');
            bot.channels.get(main).sendMessage('[Frame] Gekky has been stopped...');
            bot.user.setPresence({
                "status": "dnd",
            });
            bot.user.setGame(motd);
        }
        if (code == 2) {
            isStarted = false;
            Reloading = true;
            console.log(c.red('[Frame]') + ' Reloading Gekky...');
            bot.channels.get(main).sendMessage('[Frame] Reloading Gekky...');
        }
        if (code == 3) {
            isStarted = false;
            Reloading = true;
            console.log(c.red('[Frame]') + ' Fatal error, restarting Gekky...');
            bot.channels.get(main).sendMessage('[Frame] Fatal error, restarting Gekky...')
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
}, 1000);

inp.addListener('data', (d) => {
    var cmd = d.toString().toLowerCase().trim();
    if (!cmd.startsWith('!')) {
        if (isStarted) {
            gekky.stdin.write(d);
        } else {
            console.log(c.red('[Frame]') + ' Gekky is not started...');
        }
    } else {
        // frame commands goes here
        if (cmd == '!start') {
            if (!isStarted) {
                console.log(c.red('[Frame]') + ' Starting gekky...');
                bot.channels.get(main).sendMessage('[Frame] Starting gekky...');
                Starting = true;
            } else {
                console.log(c.red('[Frame]') + ' Gekky is already running...');
            }
        } else if (cmd == '!isstarted') {
            isStarted = !isStarted;
            console.log(c.red('[Frame]') + ' isStarted = ' + isStarted);
        } else if (cmd == '!close') {
            if (isStarted) {
                gekky.stdin.write('close');
            }
            bot.channels.get(main).sendMessage('[Frame] Stopping frame...').then(() => {
                bot.destroy().then(() => {
                    console.log(c.red('[Frame]') + ' Stopping frame...');
                    process.exit(0);
                });
            });
        }
        else {
            console.log("[Frame] Undefined command: '" + cmd + "'");
        }
    }
})