// osuirc.js
// osu chat discord integration
var irc = require('irc');
var fs = require('fs');
var c = require('chalk');
module.exports = (bot) => {
    var ircpw = fs.readFileSync('../ircpw.txt').toString();
    var client = new irc.Client('irc.ppy.sh', 'legekka', {
        password: ircpw,
        channels: ['#osu', '#hungarian']
    });
    client.addListener('registered', (message) => {
        if (message.rawCommand == '001') {
            console.log(c.yellow('[IRC]') + ' is connected.');
        }
    });
    client.addListener('message', (from, to, message) => {
        if (to[0] == '#') {
            var msg = to + ' ' + from + ': ' + message;
            if (to == '#osu') {
                msg = c.grey(msg);
            }
            console.log(c.yellow('[IRC] ') + msg);
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
}