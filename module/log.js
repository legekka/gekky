// log.js
// logging messages, errors

const fs = require('fs');
const c = require('chalk');

var path = './data/log.txt';

module.exports = {
    messageConsoleLog: (bot, message, ch, is_a_command) => {
        delete require.cache[require.resolve('./blacklist.js')];
        if (!require('./blacklist.js').isBlacklisted(message)) {
            var chID = message.channel.id;
            if (chID == undefined) { chname = 'private#'; } else { chname = bot.channels.get(chID).name; }
            if (message.content == '') { message.content = '<attachment>'; }
            if (ch.current == chID) {
                var text = getTime('full') + c.yellow(' #' + chname) + ' ' + usercolor(message.author) + ': ' + c.grey(message.content);
                console.log(text);
                bot.channels.get(ch.gekkylog).sendMessage(rawtext(text));
                log(text + '\r\n');
            } else {
                if (is_a_command) {
                    var text = c.gray(getTime('full') + ' #' + chname + ' ' + message.author.username + ': ' + message.content);
                    console.log(text);
                    bot.channels.get(ch.gekkylog).sendMessage(rawtext(text));
                    log(text + '\r\n');
                }
                if (!is_a_command) {
                    log(getTime('full') + ' #' + chname + ' ' + message.author.username + ': ' + message.content + '\r\n');
                }
            }
        }
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

function getTime(format) {
    var da = new Date();
    switch (format) {
        case 'time': return da.getHours() + ':' + da.getMinutes() + ':' + da.getSeconds();
            break;
        case 'date': return da.getFullYear() + '-' + (da.getMonth() + 1) + '-' + da.getDate();
            break;
        case 'full': return da.getFullYear() + '-' + (da.getMonth() + 1) + '-' + da.getDate() + ' ' + da.getHours() + ':' + da.getMinutes() + ':' + da.getSeconds();
            break;
        default: return '<####>';
            break;
    }
}