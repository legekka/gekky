// blacklist.js
// checking if message author or channel is blacklisted
// updating lists in realtime

var blacklist = {
    path1: config.blacklist.path1,
    path2: config.blacklist.path2,
    isBlacklisted: (message) => {
        var text = fs.readFileSync(blacklist.path1).toString().split('\n');
        var i = 0;
        while (i < text.length && message.author.id != text[i]) {
            i++;
        }
        if (i < text.length) {
            return true;
        }
        var text = fs.readFileSync(path2).toString().split('\n');
        var i = 0;
        while (i < text.length && message.channel.id != text[i]) {
            i++;
        }
        if (i < text.length) {
            return true;
        } else {
            return false;
        }
    },
    addUser: (id, callback) => {
        if (!isNaN(id)) {
            var text = fs.readFileSync(blacklist.path1).toString().split('\n');
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
                fs.writeFileSync(blacklist.path1, str);
                return callback(msg);
            } else {
                var msg = id + ' userID már szerepel a blacklistben.';
                return callback(msg);
            }
        } else {
            var msg = 'Helytelen userID.';
            return callback(msg);
        }

    },
    remUser: (id, callback) => {
        if (!isNaN(id)) {
            text = fs.readFileSync(blacklist.path1).toString().split('\n');
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
                fs.writeFileSync(blacklist.path1, str);
                return callback(msg);
            } else {
                var msg = id + ' userID nem szerepel a blacklistben.';
                return callback(msg);
            }
        } else {
            var msg = 'Helytelen userID.';
            return callback(msg);
        }

    },
    addChannel: (id, callback) => {
        if (!isNaN(id)) {
            text = fs.readFileSync(blacklist.path2).toString().split('\n');
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
                fs.writeFileSync(blacklist.path2, str);
                return callback(msg);
            } else {
                var msg = id + ' channelID már szerepel a blacklistben.';
                return callback(msg);
            }
        } else {
            var msg = 'Helytelen channelID.';
            return callback(msg);
        }

    },
    remChannel: (id, callback) => {
        if (!isNaN(id)) {
            text = fs.readFileSync(blacklist.path2).toString().split('\n');
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
                fs.writeFileSync(blacklist.path2, str);
                return callback(msg);
            } else {
                var msg = id + ' channelID nem szerepel a blacklistben.';
                return callback(msg);
            }
        } else {
            var msg = 'Helytelen channelID.';
            return callback(msg);
        }

    }
}