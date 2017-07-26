// webpconvert.js
// auto image conversion in few channels

const webp = require('webp-converter');
const reqreload = require('./reqreload.js');
const fs = require('fs');
const https = require('https');
const http = require('http');

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

function httpGet(url, filename, callback) {
    var downloadedfile = fs.createWriteStream(path + filename);
    done = false;
    var request = http.get(url, function (response) {
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

module.exports = {
    file: (filePath, callback) => {
        var fpwe = filePath.substr(0, filePath.length - 3);
        webp.cwebp(filePath, fpwe + 'webp', '-q 100', () => {
            return callback(fpwe + 'webp');
        });
    },

    message: (core, message) => {
        if (message.channel.id != core.ch.gekkylog && message.channel.id != core.ch.hun_scores && message.channel.name != "general") {
            if (message.channel.name.indexOf("nsfw") >= 0 || message.channel.name == "weeb") {
                var qual = "-q 100";
            } else {
                var qual = "-q 80";
            }
            if (message.attachments.first() != undefined) {
                var fname = message.attachments.first().filename;
                var ext = fname.substr(fname.length - 3, 3);
                if (extensions.indexOf(ext) >= 0) {
                    httpsGet(message.attachments.first().url, message.id + '.' + ext, () => {
                        webp.cwebp(path + message.id + '.' + ext, path + message.id + '.webp', qual, () => {
                            core.bot.channels.get(core.ch.gekkylog).sendFile(path + message.id + '.' + ext).then((fileoriginalmsg) => {
                                core.bot.channels.get(core.ch.gekkylog).sendFile(path + message.id + '.webp').then((filemsg) => {
                                    if (message.channel.type != 'dm') {
                                        if (message.channel.permissionsFor(core.bot.user).hasPermission("MANAGE_MESSAGES")) {
                                            message.delete();
                                            var str = '';
                                            if (message.content != '<attachment>') { str = message.content; }
                                            //message.channel.sendMessage('`' + (message.member != null ? message.member.displayName : message.author.username) + '` ' + str, { file: filemsg.attachments.first().url });
                                            message.channel.sendEmbed({
                                                "title": "Original Image",
                                                "description": (message.member != null ? '`' + message.member.displayName + '`' : '`' + message.author.username + '`') + (str != '' ? " " + str : ""),
                                                "image": filemsg.attachments.first(),
                                                "url": fileoriginalmsg.attachments.first().url,
                                                "color": message.member.highestRole.color
                                            });
                                        } else {
                                            core.bot.channels.get(core.ch.webps).sendMessage('`' + message.guild.name + ' #' + message.channel.name + ' ' + message.author.username + '`', { file: filemsg.attachments.first().url });
                                        }
                                    }
                                });
                            })
                        });
                    });
                }
            } else if (message.content.indexOf('http') >= 0) {
                var url = message.content.substr(message.content.indexOf('http')).split(' ')[0];
                var ext = url.substr(url.length - 3, 3);
                if (extensions.indexOf(ext) >= 0) {
                    if (url.indexOf('https') >= 0) {
                        httpsGet(url, message.id + '.' + ext, () => {
                            webp.cwebp(path + message.id + '.' + ext, path + message.id + '.webp', '-q 80', () => {
                                core.bot.channels.get(core.ch.gekkylog).sendFile(path + message.id + '.webp').then((filemsg) => {
                                    core.bot.channels.get(core.ch.webps).sendMessage('`' + message.guild.name + ' #' + message.channel.name + ' ' + message.author.username + '`', { file: filemsg.attachments.first().url });
                                });
                            });
                        });
                    } else {
                        httpGet(url, message.id + '.' + ext, () => {
                            webp.cwebp(path + message.id + '.' + ext, path + message.id + '.webp', '-q 80', () => {
                                core.bot.channels.get(core.ch.gekkylog).sendFile(path + message.id + '.webp').then((filemsg) => {
                                    core.bot.channels.get(core.ch.webps).sendMessage('`' + message.guild.name + ' #' + message.channel.name + ' ' + message.author.username + '`', { file: filemsg.attachments.first().url });
                                });
                            });
                        });
                    }
                }

            }
        }
    }
}