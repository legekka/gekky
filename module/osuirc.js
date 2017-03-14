// osuirc.js
// osu chat discord integration
var irc = require('irc');
var fs = require('fs');
var c = require('chalk');

module.exports = {
    start: (bot, globs, messag) => {
        if (!globs.irc_online) {
            var ch = globs.ch;
            var ircpw = fs.readFileSync('../ircpw.txt').toString();
            globs.client = new irc.Client('irc.ppy.sh', 'legekka', {
                password: ircpw,
                channels: [/*'#osu',*/'#hungarian']
            });
            globs.client.addListener('registered', (message) => {
                globs.irc_online = true;
                if (message.rawCommand == '001') {
                    console.log(c.yellow('[IRC]') + ' is connected.');
                    if (messag != undefined) {
                        messag.channel.sendMessage('**[IRC] is connected.**');
                    }
                    bot.channels.get(ch.osuirc).sendMessage('**[IRC] is connected**').then((message) => {
                        globs.irc_pin = message.id;
                        message.pin();
                    });
                }
            });
            globs.client.addListener('message', (from, to, message) => {
                if (to[0] == '#') {
                    var msg = timeStamp() + ' ' + to + ' ' + from + ': ' + message;
                    if (to == '#osu') {
                        msg = c.grey(msg);
                    }
                    if (message.indexOf('gekka') >= 0 && from != 'legekka') {
                        bot.channels.get(ch.osuirc).sendMessage('<@143399021740818432>').then((message) => {
                            message.delete();
                        });
                    }
                    console.log(c.yellow('[IRC] ') + msg);
                    bot.channels.get(ch.osuirc).sendMessage('`' + timeStamp() + '` `' + to + '` `' + from + ':` ' + message);
                }
            });


            globs.client.addListener('pm', (from, text, message) => {
                console.log(c.yellow('[IRC] ') + c.cyan(from) + ': ' + text);
                if (bot.users.get('143399021740818432').presence.status != 'online' || (
                    bot.users.get('143399021740818432').presence.status == 'online' &&
                    bot.users.get('143399021740818432').presence.game != 'osu!')) {
                    bot.channels.get(ch.osuirc).sendMessage('<@143399021740818432>').then((message) => {
                        message.delete();
                    });
                }
                bot.channels.get(ch.osuirc).sendMessage('`' + timeStamp() + '` `' + from + ':` ' + text);
            });

            globs.irc_online_users = setInterval(() => {
                if (globs.irc_online) {
                    var nicks = globs.client.chans['#hungarian'].users;
                    var str = JSON.stringify(nicks);
                    while (str.indexOf('"') >= 0) {
                        str = str.replace('"', '');
                    }
                    while (str.indexOf("'") >= 0) {
                        str = str.replace("'", '');
                    }
                    while (str.indexOf(':') >= 0) {
                        str = str.replace(':', '');
                    }
                    str = str.replace('{', '');
                    str = str.replace('}', '');
                    var array = str.split(',').sort(function (a, b) {
                        return a.toLowerCase().localeCompare(b.toLowerCase());
                    });
                    var str = '';
                    for (i in array) {
                        str += array[i] + '\n';
                    }
                    bot.channels.get(ch.osuirc).messages.get(globs.irc_pin).edit('Online: ' + (array.length - 1) + '\nChannel: `' + globs.irc_channel + '`\n```' + str + '```');
                }
            }, 10000);

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
            if (messag != undefined) {
                messag.channel.sendMessage('[IRC] is already running');
            }
        }
        return globs.client;
    },
    stop: (bot, globs, messag) => {
        if (globs.irc_online) {
            globs.irc_online = false;
            var ch = globs.ch;
            bot.channels.get(ch.osuirc).messages.get(globs.irc_pin).delete();
            clearInterval(globs.irc_online_users);
            globs.client.disconnect();
            console.log(c.yellow('[IRC]') + ' is disconnected.');
            if (messag != undefined) {
                messag.channel.sendMessage('**[IRC] is disconnected**');
            }
            bot.channels.get(ch.osuirc).sendMessage('**[IRC] is disconnected**');
        } else {
            console.log(c.yellow('[IRC]') + ' is already disconnected.');
            if (messag != undefined) {
                messag.channel.sendMessage('[IRC] is already disconnected');
            }
        }
        return globs.client;
    },
    say: (bot, globs, to, text) => {
        globs.client.say(to, text);
        if (to[0] == '#') {
            var msg = timeStamp() + ' ' + to + c.magenta(' legekka: ') + text;
            var msg2 = '`' + timeStamp() + '` `' + to + '` `legekka:` ' + text;
        } else {
            var msg = timeStamp() + ' PM ' + to + c.magenta(' legekka: ') + text;
            var msg2 = '`' + timeStamp() + '` `PM ' + to + '` `legekka:` ' + text;
        }
        console.log(c.yellow('[IRC] ') + msg);
        bot.channels.get(globs.ch.osuirc).sendMessage(msg2);
        return globs.client;
    },
    teszt: (bot, globs) => {
        console.log(globs.client.chans['#hungarian'].users);
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