// osuirc.js
// osu chat discord integration
var irc = require('irc');
var fs = require('fs');
var c = require('chalk');

module.exports = {
    start: (bot, globs) => {
        if (!globs.irc_online) {
            globs.irc_online = true;
            var ch = globs.ch;
            var ircpw = fs.readFileSync('../ircpw.txt').toString();
            globs.client = new irc.Client('irc.ppy.sh', 'legekka', {
                password: ircpw,
                channels: [/*'#osu',*/'#hungarian']
            });
            globs.client.addListener('registered', (message) => {
                if (message.rawCommand == '001') {
                    console.log(c.yellow('[IRC]') + ' is connected.');
                    bot.channels.get(ch.osuirc).sendMessage('**[IRC] is connected**');
                }
            });
            globs.client.addListener('message', (from, to, message) => {
                if (to[0] == '#') {
                    var msg = timeStamp() + ' ' + to + ' ' + from + ': ' + message;
                    if (to == '#osu') {
                        msg = c.grey(msg);
                    }
                    console.log(c.yellow('[IRC] ') + msg);
                    bot.channels.get(ch.osuirc).sendMessage('`' + timeStamp() + '` `' + to + '` `' + from + ':` ' + message);
                }
            });


            globs.client.addListener('pm', (from, text, message) => {
                console.log(c.yellow('[IRC] ') + c.cyan(from) + ': ' + text);
                bot.channels.get(ch.osuirc).sendMessage('`' + timeStamp() + '` `' + from + ':` ' + text);
            });


            // globs.client.addListener('selfMessage', (to, text) => {
            //     if (to[0] == '#') {
            //         console.log(c.yellow('[IRC] ') + to + ' legekka: ' + text);
            //     } else {
            //         console.log(c.yellow('[IRC] ') + to + ': ' + text);
            //     }
            // });
            globs.client.addListener('error', function (message) {
                console.log(c.yellow('[IRC]') + ' Error: ', message);
            });
        } else {
            console.log(c.yellow('[IRC]') + ' is already running');
        }
        return globs.client;
    },
    stop: (bot, globs) => {
        if (globs.irc_online) {
            globs.irc_online = false;
            var ch = globs.ch;
            globs.client.disconnect();
            console.log(c.yellow('[IRC]') + ' is disconnected.');
            bot.channels.get(ch.osuirc).sendMessage('**[IRC] is disconnected**');
        } else {
            console.log(c.yellow('[IRC]') + ' is already disconnected.');
        }
        return globs.client;
    },
    say: (bot, globs, to, text) => {
        globs.client.say(to, text);
        if (to[0] == '#') {
            var msg = timeStamp() + ' ' + to + c.magenta(' legekka: ') + text;
        } else {
            var msg = timeStamp() + ' PM' + to + c.magenta(' legekka: ') + text;
        }
        console.log(c.yellow('[IRC] ') + msg);
        return globs.client;
    }
}

function timeStamp() {
    var da = new Date();
    var h = da.getHours();
    var m = da.getMinutes();
    var s = da.getSeconds();
    if (h < 10) { h = '0' + h }
    if (m < 10) { m = '0' + m }
    if (s < 10) { s = '0' + s }
    return h + ':' + m + ':' + s;
}