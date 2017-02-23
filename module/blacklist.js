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
    addUser: (id,callback) => {
        // TODO: adding user id to blacklist.txt
        // help: text.indexOf(id) < 0
    },
    remUser: (id,callback) => {
        // TODO: remove user id from blacklist.txt
    },
    addChannel: (id,callback) => {
        // TODO: adding channel id to channel_blacklist.txt
    },
    remChannel: (id,callback) => {
        // TODO: removing channel id from channel_blacklist.txt
    }
}