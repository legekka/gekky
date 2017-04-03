// log.js
// logging messages, errors

const fs = require('fs');
const c = require('chalk');
var reqreload = require('./reqreload.js');

var path = '../log.txt';

module.exports = {
    messageConsoleLog: (bot, message, globs, is_a_command) => {
        var ch = globs.ch;
        if (!reqreload('./blacklist.js').isBlacklisted(message)) {
            var chID = message.channel.id;
            if (chID == undefined) { chname = 'private#'; } else { chname = bot.channels.get(chID).name; }
            if (message.content == '') { message.content = '<attachment>'; }
            if (ch.current == chID) {
                var text = reqreload('./getTime.js')('full') + c.yellow(' #' + chname) + ' ' + usercolor(message.author) + ': ' + c.grey(message.content);
                console.log(text);
                bot.channels.get(ch.gekkylog).sendMessage(rawtext(text));
                log(text + '\r\n');
            } else {
                if (is_a_command) {
                    var text = c.gray(reqreload('./getTime.js')('full') + ' #' + chname + ' ' + message.author.username + ': ' + message.content);
                    console.log(text);
                    bot.channels.get(ch.gekkylog).sendMessage(rawtext(text));
                    log(text + '\r\n');
                }
                if (!is_a_command) {
                    log(reqreload('./getTime.js')('full') + ' #' + chname + ' ' + message.author.username + ': ' + message.content + '\r\n');
                }
            }
        }
    },
    consoleLog: (bot, text) => {
        console.log(text);
        bot.channels.get('281189261355515915').sendMessage(rawtext(text));
        log(text + '\r\n');
    }
}

function log(text) {
    if (rawtext(text).indexOf('gekkylog') < 0) {
        fs.appendFile(path, rawtext(text));
    }
}

function rawtext(text) {
    return text.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

function usercolor(user) {
    switch (user.username) {
        case 'Nesze': return c.bgYellow.magenta(user.username);
            break;
        case 'legekka': return c.bgWhite.blue(user.username);
            break;
        case 'gekky': return c.bgWhite.green(user.username);
        default:
            if (is_a_friend(user.id)) {
                return c.green(user.username);
            } else {
                return c.cyan(user.username);
            }
            break;
    }
}
