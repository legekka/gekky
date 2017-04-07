// webpconvert.js
// auto image conversion in few channels

const webp = require('webp-converter');
const fs = require('fs');
const https = require('https');

const extensions = ['png', 'jpg', 'bmp'];

var path = '../cache/';

function httpsGet(url, filename, callback) {
    var downloadedfile = fs.createWriteStream(path + filename);
    done = false;
    var request = https.get(url, function (response) {
        response.pipe(downloadedfile, { end: false });
        response.on('end', () => {
            done = true;
        });
    });
    var waiter = setInterval(() => {
        if (done) {
            clearInterval(waiter);
            return callback();
        }
    }, 100);
}

module.exports = (bot, message, globs) => {
    if (message.attachments.first() != undefined) {
        var fname = message.attachments.first().filename;
        var ext = fname.substr(fname.length - 3, 3);
        if (extensions.indexOf(ext) >= 0) {
            httpsGet(message.attachments.first().url, message.id + '.' + ext, () => {
                webp.cwebp(path + message.id + '.' + ext, path + message.id + '.webp', '-q 80', () => {
                    bot.channels.get(globs.ch.gekkylog).sendFile(path + message.id + '.webp').then((filemsg) => {
                        if (message.channel.type != 'dm') {
                            if (message.channel.permissionsFor(bot.user).hasPermission("MANAGE_MESSAGES")) {
                                message.delete();
                                message.channel.sendMessage('`' + message.author.username + '`', { file: filemsg.attachments.first().url });
                            } else {
                                bot.channels.get(globs.ch.webps).sendMessage('`' + message.guild.name + ' #' + message.channel.name + ' ' + message.author.username + '`', { file: filemsg.attachments.first().url });
                            }
                        }
                    });
                });
            });
        }
    }
}