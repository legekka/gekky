// osuirc.js
// osu chat discord integration
var irc = require('irc');
var fs = require('fs');
var c = require('chalk');

function afkmessage() {
    var da = new Date();
    var str = "Oy. I'm gekky. legekka is currently offline. ";
    if (da.getHours() > 23 || da.getHours() < 9) {
        str += "He's probably sleeping so... I don't think he'll answer. ";
    } else {
        str += "He's probably at work. Idk. Maybe he'll answer in a few hours. ";
    }
    str += "Anyways I notified him.";
    return str;
}


module.exports = {
    start: (core, messag) => {
        if (!core.osuirc.irc_online) {
            var ch = core.ch;
            var ircpw = fs.readFileSync('../ircpw.txt').toString();
            var userlist = [];

            core.osuirc.client = new irc.Client('irc.ppy.sh', 'legekka', {
                password: ircpw,
                channels: [/*'#osu',*/'#hungarian']
            });
            core.osuirc.client.addListener('registered', (message) => {
                core.osuirc.irc_online = true;
                if (message.rawCommand == '001') {
                    console.log(c.yellow('[IRC]') + ' is connected.');
                    if (messag != undefined) {
                        messag.channel.send('**[IRC] is connected**');
                    }
                    core.bot.channels.get(ch.osuirc).send('**[IRC] is connected**').then((message) => {
                        core.osuirc.irc_pin = message.id;
                        message.pin();
                    });
                }
            });
            core.osuirc.client.addListener('message', (from, to, message) => {
                if (to[0] == '#') {
                    var msg = timeStamp() + ' ' + to + ' ' + from + ': ' + message;
                    if (to == '#osu') {
                        msg = c.grey(msg);
                    }
                    if (message.indexOf('gekka') >= 0 && from != 'legekka') {
                        core.bot.channels.get(ch.osuirc).send('<@143399021740818432>').then((message) => {
                            message.delete();
                        });
                    }
                    console.log(c.yellow('[IRC] ') + msg);
                    core.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `' + to + '` `' + from + ':` ' + message);
                }
            });


            core.osuirc.client.addListener('pm', (from, text, message) => {
                console.log(c.yellow('[IRC] ') + c.cyan(from) + ': ' + text);
                if (core.bot.users.get('143399021740818432').presence.status != 'online' || (
                    core.bot.users.get('143399021740818432').presence.status == 'online' &&
                    core.bot.users.get('143399021740818432').presence.game != 'osu!')) {
                    core.bot.channels.get(ch.osuirc).send('<@143399021740818432>').then((message) => {
                        message.delete();
                    });
                }
                if (core.bot.users.get('143399021740818432').presence.status == 'offline' && userlist.indexOf('legekka') < 0) {
                    core.osuirc.client.say(from, afkmessage());
                    console.log(c.yellow('[IRC] ') + from + ' ' + c.green('gekky: ') + '[afk message]');
                    core.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `PM ' + from + '` `gekky:` [AFK MESSAGE]');
                }
                core.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `' + from + ':` ' + text);
            });

            core.osuirc.client.addListener('action', (from, to, text, message) => {
                if (to != 'legekka') {
                    console.log(c.yellow('[IRC] ') + timeStamp() + ' ' + to + ' ' + from + ' ' + text);
                    core.osuirc.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `' + to + '` `' + from + '` *' + text + '*');
                } else {
                    console.log(c.yellow('[IRC] ') + timeStamp() + ' PM' + from + ' ' + text);
                    core.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `PM' + from + '` *' + text + '*');
                    core.bot.channels.get(ch.osuirc).send('<@143399021740818432>').then((message) => {
                        message.delete();
                    });
                }
            })

            core.osuirc.irc_online_users = setInterval(() => {
                if (core.osuirc.irc_online) {
                    var nicks = core.osuirc.client.chans['#hungarian'].users;
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
                    userlist = str.split(',').sort(function (a, b) {
                        return a.toLowerCase().localeCompare(b.toLowerCase());
                    });
                    var str = '';
                    for (i in userlist) {
                        str += userlist[i] + '\n';
                    }
                    core.bot.channels.get(ch.osuirc).messages.get(core.osuirc.irc_pin).edit('Online: ' + (userlist.length - 1) + '\nChannel: `' + core.osuirc.irc_channel + '`\n```' + str + '```');
                }
            }, 10000);

            // core.osuirc.client.addListener('selfMessage', (to, text) => {
            //     if (to[0] == '#') {
            //         console.log(c.yellow('[IRC] ') + to + ' legekka: ' + text);
            //     } else {
            //         console.log(c.yellow('[IRC] ') + to + ': ' + text);
            //     }
            // });
            core.osuirc.client.addListener('error', function (message) {
                console.log(c.yellow('[IRC]') + ' Error: ', message);
            });
        } else {
            console.log(c.yellow('[IRC]') + ' is already running');
            if (messag != undefined) {
                messag.channel.send('[IRC] is already running');
            }
        }
        return core.osuirc.client;
    },
    stop: (core, messag) => {
        if (core.osuirc.irc_online) {
            core.osuirc.irc_online = false;
            var ch = core.ch;
            core.bot.channels.get(ch.osuirc).messages.get(core.osuirc.irc_pin).delete();
            clearInterval(core.osuirc.irc_online_users);
            core.osuirc.client.disconnect();
            console.log(c.yellow('[IRC]') + ' is disconnected.');
            if (messag != undefined) {
                messag.channel.send('**[IRC] is disconnected**');
            }
            core.bot.channels.get(ch.osuirc).send('**[IRC] is disconnected**');
        } else {
            console.log(c.yellow('[IRC]') + ' is already disconnected.');
            if (messag != undefined) {
                messag.channel.send('[IRC] is already disconnected');
            }
        }
        return core.osuirc.client;
    },
    say: (core, text) => {
        core.osuirc.client.say(core.osuirc.irc_channel, text);
        if (core.osuirc.irc_channel[0] == '#') {
            var msg = timeStamp() + ' ' + core.osuirc.irc_channel + c.magenta(' legekka: ') + text;
            var msg2 = '`' + timeStamp() + '` `' + core.osuirc.irc_channel + '` `legekka:` ' + text;
        } else {
            var msg = timeStamp() + ' PM ' + core.osuirc.irc_channel + c.magenta(' legekka: ') + text;
            var msg2 = '`' + timeStamp() + '` `PM ' + core.osuirc.irc_channel + '` `legekka:` ' + text;
        }
        console.log(c.yellow('[IRC] ') + msg);
        core.bot.channels.get(core.ch.osuirc).send(msg2);
        return core.osuirc.client;
    },
    teszt: (core) => {
        console.log(core.osuirc.client.chans['#hungarian'].users);
        return core.osuirc.client;
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