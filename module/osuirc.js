// osuirc.js
// osu chat discord integration
var irc = require('irc');
var fs = require('fs');
var c = require('chalk');

module.exports = {
    start: (bot, ch, client) => {
        var ircpw = fs.readFileSync('../ircpw.txt').toString();
        client = new irc.Client('irc.ppy.sh', 'legekka', {
            password: ircpw,
            channels: ['#osu', '#hungarian']
        });
        client.addListener('registered', (message) => {
            if (message.rawCommand == '001') {
                console.log(c.yellow('[IRC]') + ' is connected.');
                bot.channels.get(ch.osuirc).sendMessage('**[IRC] is connected**');
            }
        });
        client.addListener('message', (from, to, message) => {
            if (to[0] == '#') {
                var msg = to + ' ' + from + ': ' + message;
                if (to == '#osu') {
                    msg = c.grey(msg);
                }
                console.log(c.yellow('[IRC] ') + msg);
                bot.channels.get(ch.osuirc).sendMessage('`' + timeStamp() + '` `' + to + '` `' + from + ':` ' + message);
            }
        });
        client.addListener('pm', (from, text, message) => {
            console.log(c.yellow('[IRC] ') + c.cyan(from) + ': ' + text);
        });
        client.addListener('selfMessage', (to, text) => {
            if (to[0] == '#') {
                console.log(c.yellow('[IRC] ') + to + ' legekka: ' + text);
            } else {
                console.log(c.yellow('[IRC] ') + to + ': ' + text);
            }
        });
        client.addListener('error', function (message) {
            console.log(c.yellow('[IRC]') + ' Error: ', message);
        });

        return client;
    },
    stop: (bot, ch, client) => {
        client.disconnect();
        console.log(c.yellow('[IRC]') + ' is disconnected.');
        bot.channels.get(ch.osuirc).sendMessage('**[IRC] is disconnected**');
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