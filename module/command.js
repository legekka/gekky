// command.js
// specified commands

var ownerid = '143399021740818432';

module.exports = (bot, message, cmdpref, callback) => {
    var lower = message.content.toLowerCase();


    // legekka-only commands
    if (message.author.id == ownerid) {
        /* TODO: these modules
        if (lower.startsWith(cmdpref + 'secret')) {
            giveSecret(lower.split(' ')[1], lower.split(' ')[2], (response) => {
                message.channel.sendMessage(response);
            });
        }

        if (lower.startsWith(cmdpref + 'remlist')) {
            reminderLister(lower.substr(cmdpref.length + 'remlist'.length + 1), (response) => {
                message.channel.sendEmbed(response);
            });
        }

        if ((lower.startsWith(cmdpref + 'workdayinfo'))) {
            workdayinfo((response) => {
                message.channel.sendEmbed(response);
            });
        }
        if ((lower.indexOf("reggel") >= 0 || lower.indexOf("ohio") >= 0) && (lower.indexOf("momi") >= 0 || lower.indexOf("gekk") >= 0)) {
            ohio(message);
        }
        */
        if (message.content.startsWith(cmdpref + 'motd')) {
            motd = message.content.substr(cmdpref.length + 'motd'.length + 1);
            bot.user.setGame(motd);
        }
        if (lower == cmdpref + 'inv') {
            message.channel.sendMessage('https://discordapp.com/oauth2/authorize?&client_id=267741038230110210&scope=bot');
        }
        /* TODO: Sankaku cache folder deleting
        if (lower == cmdpref + 'delcache') {
            code = execSync('rm -f ' + SankakuPath + '*');
            message.channel.sendMessage('Cache deleted.');
        }
        */

        /* TODO: DELETE THIS
        if (message.content.startsWith(cmdpref + 'send')) {
            sendFile(message, message.content.substr(6));
        }
        */
        if (lower.startsWith(cmdpref + 'cmdpref')) {
            cmdpref = message.content.substr(cmdpref.length + 'cmdpref'.length + 1);
            if (cmdpref == '') {
                cmdpref = '!';
            }
            message.channel.sendMessage('New prefix: `' + cmdpref + '`');
            return callback({
                'mode': 'cmdpref',
                'cmdpref': cmdpref
            });
        }
        if (lower == cmdpref + 'tsun') {
            tsun = !tsun;
            if (tsun) {
                message.channel.sendMessage('Nah.');
            } else {
                message.channel.sendMessage('O-okay.');
            }
            return callback({
                'mode': 'tsun',
                'tsun': tsun
            });
        }
        // blacklist commands
        if (lower.startsWith(cmdpref + 'bluser') ) {
            delete require.cache[require.resolve('./blacklist.js')];
            require('./blacklist.js').addUser(lower.split(' ')[1].substr(2).replace('>',''),(msg) => {
                message.channel.sendMessage(msg);
            });
            
        }
        /* TODO: We have time for this part
        if (lower == cmdpref + 'cache') {
            checkCache(SankakuPath, 50, message);
        }
        */

        /* Updater and frame part
        if (lower == cmdpref + 'reload') {
            exit(3);
        }
        if (lower == cmdpref + 'close') {
            exit(2);
        }
        */
    }
}