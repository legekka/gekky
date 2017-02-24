// blacklist.js
// checking if message author or channel is blacklisted
// updating lists in realtime

var fs = require('fs');
var path1 = '../data/blacklist.txt';
var path2 = '../data/channel_blacklist.txt';

module.exports = {
    isBlacklisted: (message) => {
        var blacklisted = false;
        text = fs.readFileSync(path1).toString().split('\n');
        for (i in text) {
            if (message.author.id == text[i]) {
                blacklisted = true;
            }
        }
        input = fs.createReadStream(path2);
        text = fs.readFileSync(path2).toString().split('\n');
        for (i in text) {
            if (message.channel.id == text[i]) {
                console.log(message.channel.id + ' ' + text[i]);
                blacklisted = true;
            }
        }
        return blacklisted;
    },
    addUser: (id, callback) => {
        if (!isNaN(id)) {
            text = fs.readFileSync(path1).toString().split('\n');
            var contains = false;
            if (text.indexOf(id) < 0) {
                text.push(id);
                var msg = id + ' userid hozzáadva a blacklisthez.';
                var i = 0;
                var str = '';
                while (i < text.length - 1) {
                    str += text[i] + '\n';
                    i++;
                }
                str += text[text.length - 1];
                fs.writeFileSync(path1, str);
            } else {
                var msg = id + ' userid már szerepel a blacklistben.';
            }
        } else {
            var msg = 'Helytelen ID.'
        }
        return callback(msg);
        // help: text.indexOf(id) < 0
    },
    remUser: (id, callback) => {
        // TODO: remove user id from blacklist.txt
    },
    addChannel: (id, callback) => {
        // TODO: adding channel id to channel_blacklist.txt
    },
    remChannel: (id, callback) => {
        // TODO: removing channel id from channel_blacklist.txt
    }
}