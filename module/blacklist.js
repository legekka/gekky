// blacklist.js
// checking if message author or channel is blacklisted
// updating lists in realtime

var fs = require('fs');
var path1 = './data/blacklist.txt';
var path2 = './data/channel_blacklist.txt';

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
                blacklisted = true;
            }
        }
        return blacklisted;
    },
    addUser: (id, callback) => {
        if (!isNaN(id)) {
            text = fs.readFileSync(path1).toString().split('\n');
            if (text.indexOf(id) < 0) {
                text.push(id);
                var msg = id + ' userID hozzáadva a blacklisthez.';
                var i = 0;
                var str = '';
                while (i < text.length - 1) {
                    str += text[i] + '\n';
                    i++;
                }
                str += text[text.length - 1];
                fs.writeFileSync(path1, str);
            } else {
                var msg = id + ' userID már szerepel a blacklistben.';
            }
        } else {
            var msg = 'Helytelen userID.';
        }
        return callback(msg);
    },
    remUser: (id, callback) => {
        if (!isNaN(id)) {
            text = fs.readFileSync(path1).toString().split('\n');
            if (text.indexOf(id) >= 0) {
                text.splice(text.indexOf(id), 1);
                var msg = id + ' userID eltávolítva a blacklistből.';
                var i = 0;
                var str = '';
                while (i < text.length - 1) {
                    str += text[i] + '\n';
                    i++;
                }
                str += text[text.length - 1];
                fs.writeFileSync(path1, str);
            } else {
                var msg = id + ' userID nem szerepel a blacklistben.';
            }
        } else {
            var msg = 'Helytelen userID.';
        }
        return callback(msg);
    },
    addChannel: (id, callback) => {
        if (!isNaN(id)) {
            text = fs.readFileSync(path2).toString().split('\n');
            if (text.indexOf(id) < 0) {
                text.push(id);
                var msg = id + ' channelD hozzáadva a blacklisthez.';
                var i = 0;
                var str = '';
                while (i < text.length - 1) {
                    str += text[i] + '\n';
                    i++;
                }
                str += text[text.length - 1];
                fs.writeFileSync(path1, str);
            } else {
                var msg = id + ' channelID már szerepel a blacklistben.';
            }
        } else {
            var msg = 'Helytelen channelID.';
        }
        return callback(msg);
    },
    remChannel: (id, callback) => {
        if (!isNaN(id)) {
            text = fs.readFileSync(path1).toString().split('\n');
            if (text.indexOf(id) >= 0) {
                text.splice(text.indexOf(id), 1);
                var msg = id + ' channelID eltávolítva a blacklistből.';
                var i = 0;
                var str = '';
                while (i < text.length - 1) {
                    str += text[i] + '\n';
                    i++;
                }
                str += text[text.length - 1];
                fs.writeFileSync(path1, str);
            } else {
                var msg = id + ' channelID nem szerepel a blacklistben.';
            }
        } else {
            var msg = 'Helytelen channelID.';
        }
        return callback(msg);
    }
}