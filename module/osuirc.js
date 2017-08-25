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
        if (!core.osuirc.ready) {
            var ch = core.discord.ch;
            var userlist = [];

            core.osuirc.client = new irc.Client('irc.ppy.sh', 'legekka', {
                password: core.osuirc.pw,
                channels: [/*'#osu',*/'#hungarian']
            });
            core.osuirc.client.addListener('registered', (message) => {
                core.osuirc.ready = true;
                if (message.rawCommand == '001') {
                    console.log(c.yellow('[IRC]') + ' is connected.');
                    if (messag != undefined) {
                        messag.channel.send('**[IRC] is connected**');
                    }
                    core.discord.bot.channels.get(ch.osuirc).send('**[IRC] is connected**').then((message) => {
                        core.osuirc.pin = message.id;
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
                        core.discord.bot.channels.get(ch.osuirc).send(`<@${core.discord.dsettings.ownerID}>`).then((message) => {
                            message.delete();
                        });
                    }
                    console.log(c.yellow('[IRC] ') + msg);
                    core.discord.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `' + to + '` `' + from + ':` ' + message);
                }
            });


            core.osuirc.client.addListener('pm', (from, text, message) => {
                console.log(c.yellow('[IRC] ') + c.cyan(from) + ': ' + text);
                if (core.discord.bot.users.get(core.discord.dsettings.ownerID).presence.status != 'online' || (
                    core.discord.bot.users.get(core.discord.dsettings.ownerID).presence.status == 'online' &&
                    core.discord.bot.users.get(core.discord.dsettings.ownerID).presence.game != 'osu!')) {
                    core.discord.bot.channels.get(ch.osuirc).send(`<@${core.discord.dsettings.ownerID}>`).then((message) => {
                        message.delete();
                    });
                }
                if (core.discord.bot.users.get(core.discord.dsettings.ownerID).presence.status == 'offline' && userlist.indexOf('legekka') < 0) {
                    core.osuirc.client.say(from, afkmessage());
                    console.log(c.yellow('[IRC] ') + from + ' ' + c.green('gekky: ') + '[afk message]');
                    core.discord.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `PM ' + from + '` `gekky:` [AFK MESSAGE]');
                }
                core.discord.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `' + from + ':` ' + text);
            });

            core.osuirc.client.addListener('action', (from, to, text, message) => {
                if (to != 'legekka') {
                    console.log(c.yellow('[IRC] ') + timeStamp() + ' ' + to + ' ' + from + ' ' + text);
                    core.discord.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `' + to + '` `' + from + '` *' + text + '*');
                } else {
                    console.log(c.yellow('[IRC] ') + timeStamp() + ' PM' + from + ' ' + text);
                    core.discord.bot.channels.get(ch.osuirc).send('`' + timeStamp() + '` `PM' + from + '` *' + text + '*');
                    core.discord.bot.channels.get(ch.osuirc).send(`<@${core.discord.dsettings.ownerID}>`).then((message) => {
                        message.delete();
                    });
                }
            })

            core.osuirc.ready_users = setInterval(() => {
                if (core.osuirc.ready) {
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
                    core.discord.bot.channels.get(ch.osuirc).messages.get(core.osuirc.pin).edit('Online: ' + (userlist.length - 1) + '\nChannel: `' + core.osuirc.channel + '`\n```' + str + '```');
                    core.discord.bot.channels.get(ch.osuirc).setTopic("Current channel: " + core.osuirc.channel);
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
        if (core.osuirc.ready) {
            core.osuirc.ready = false;
            var ch = core.discord.ch;
            core.discord.bot.channels.get(ch.osuirc).messages.get(core.osuirc.pin).delete();
            clearInterval(core.osuirc.ready_users);
            core.osuirc.client.disconnect();
            console.log(c.yellow('[IRC]') + ' is disconnected.');
            if (messag != undefined) {
                messag.channel.send('**[IRC] is disconnected**');
            }
            core.discord.bot.channels.get(ch.osuirc).send('**[IRC] is disconnected**');
        } else {
            console.log(c.yellow('[IRC]') + ' is already disconnected.');
            if (messag != undefined) {
                messag.channel.send('[IRC] is already disconnected');
            }
        }
        return core.osuirc.client;
    },
    say: (core, text) => {
        core.osuirc.client.say(core.osuirc.channel, text);
        if (core.osuirc.channel[0] == '#') {
            var msg = timeStamp() + ' ' + core.osuirc.channel + c.magenta(' legekka: ') + text;
            var msg2 = '`' + timeStamp() + '` `' + core.osuirc.channel + '` `legekka:` ' + text;
        } else {
            var msg = timeStamp() + ' PM ' + core.osuirc.channel + c.magenta(' legekka: ') + text;
            var msg2 = '`' + timeStamp() + '` `PM ' + core.osuirc.channel + '` `legekka:` ' + text;
        }
        console.log(c.yellow('[IRC] ') + msg);
        core.discord.bot.channels.get(core.discord.ch.osuirc).send(msg2);
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