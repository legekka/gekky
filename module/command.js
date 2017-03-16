// command.js
// specified commands

const reqreload = require('./reqreload.js');
const fs = require('fs');

var ownerid = '143399021740818432';

module.exports = (bot, message, globs, callback) => {
    var cmdpref = globs.cmdpref;
    var tsun = globs.tsun;
    delete require.cache[require.resolve('./blacklist.js')];
    if (!require('./blacklist.js').isBlacklisted(message)) {
        var lower = message.content.toLowerCase();
        var is_a_command = false;
        var mode;
        if (lower.startsWith(cmdpref + 'lenny')) {
            // !lenny|Beszúr egy lenny fejet.
            message.channel.sendMessage('`' + message.author.username + '` ( ͡° ͜ʖ ͡°)');
            message.delete();
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'weather')) {
            // !weather|Időjárás információ. !weather <város>
            delete require.cache[require.resolve('./weather.js')];
            require('./weather.js')(message.content.substr(cmdpref.length + 8), (response) => {
                message.channel.sendEmbed(response);
            });
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'help')) {
            // !help|Lista a parancsokról, leírással.
            reqreload('./help.js').list(message, (list) => {
                var str = '';
                for (i in list) {
                    str += '**' + list[i].cmd + '**\n    *' + list[i].desc + '*\n\n';
                }
                while (str.replace('!', cmdpref) != str) {
                    str = str.replace('!', cmdpref);
                }
                message.channel.sendEmbed({
                    'title': 'Parancsok',
                    'description': str
                })
            });
        } else if (lower.startsWith(cmdpref + 'git')) {
            // !git|Kiírja gekky githubját.
            message.channel.sendEmbed({
                'title': 'GitHub',
                'description': 'Teljes nyílt forráskód',
                'url': 'http://github.com/legekka/gekky'
            })
        } else if (lower.startsWith(cmdpref + 'ver')) {
            // !ver|Kiírja a jelenlegi verziót.
            reqreload('./updater.js').fullver((resp) => {
                message.channel.sendEmbed({
                    'title': resp.ver,
                    'description': resp.desc
                })
            });
        } else if (message.author.id == ownerid) {
            // legekka-only commands
            if (lower.startsWith(cmdpref + 'nhentai')) {
                // !nhentai|Nhentai doujin kereső. !nhentai <tagek>
                reqreload('./sankaku.js').nhentaiSearch(bot, message, lower.substr(cmdpref.length + 'nhentai'.length + 1));
            } else if (lower.startsWith(cmdpref + 'del')) {
                // !del|Üzenet törlő. !del <üzenetszám>
                var number = lower.split(' ')[1];
                if (!isNaN(number)) {
                    var number = parseInt(number);
                    if (number > 50) {
                        message.channel.sendMessage('Maximum 50 üzenet törölhető.');
                    } else {
                        message.channel.bulkDelete(number + 1).then(() => {
                            message.channel.sendMessage(number + ' üzenet törölve.').then((message) => {
                                var msg = message;
                                setTimeout(() => {
                                    msg.delete();
                                }, 2000);
                            })
                        });
                    }
                } else {
                    message.channel.sendMessage('Helytelen paraméter: ' + number);
                }
                is_a_command = true;
            } else if ((lower.startsWith(cmdpref + 'workdayinfo'))) {
                // !workdayinfo|Munkanappal kapcsolatos információk.
                delete require.cache[require.resolve('./workdayinfo.js')];
                require('./workdayinfo.js')((response) => {
                    message.channel.sendEmbed(response);
                });
                is_a_command = true;
            } else if ((lower.indexOf("reggel") >= 0 || lower.indexOf("ohio") >= 0) && (lower.indexOf("momi") >= 0 || lower.indexOf("gekk") >= 0)) {
                delete require.cache[require.resolve('./assistant.js')];
                require('./assistant.js').ohio(message);
                is_a_command = true;
            } else if (message.content.startsWith(cmdpref + 'motd')) {
                // !motd|'playing <game>' megváltoztatására. !motd <szó>
                motd = message.content.substr(cmdpref.length + 'motd'.length + 1);
                bot.user.setGame(motd);
                is_a_command = true;
            } else if (lower == cmdpref + 'inv') {
                // !inv|Gekky invite linkje.
                message.channel.sendMessage('https://discordapp.com/oauth2/authorize?&client_id=267741038230110210&scope=bot');
                is_a_command = true;
            } else if (lower.startsWith(cmdpref + 'cmdpref')) {
                // !cmdpref|Parancs prefix megváltoztatása. !cmdpref <karakter>
                cmdpref = message.content.substr(cmdpref.length + 'cmdpref'.length + 1);
                if (cmdpref == '') {
                    cmdpref = '!';
                }
                message.channel.sendMessage('New prefix: `' + cmdpref + '`');
                var mode = 'cmdpref';
                fs.writeFileSync('./data/pref.txt', cmdpref);
                is_a_command = true;
            } else if (lower == cmdpref + 'tsun') {
                // !tsun|Tsundere mód kapcsoló
                tsun = !tsun;
                if (tsun) {
                    message.channel.sendMessage('Nah.');
                } else {
                    message.channel.sendMessage('O-okay.');
                }
                var mode = 'tsun';
                is_a_command = true;
            } // blacklist commands 
            else if (lower.startsWith(cmdpref + 'addbluser')) {
                // !addbluser|UserID hozzáadása blacklisthez
                delete require.cache[require.resolve('./blacklist.js')];
                require('./blacklist.js').addUser(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                    message.channel.sendMessage(msg);
                });
                is_a_command = true;
            } else if (lower.startsWith(cmdpref + 'rembluser')) {
                // !rembluser|UserID eltávolítása a blacklistből
                delete require.cache[require.resolve('./blacklist.js')];
                require('./blacklist.js').remUser(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                    message.channel.sendMessage(msg);
                });
                is_a_command = true;
            } else if (lower.startsWith(cmdpref + 'addblchannel')) {
                // !addblchannel|ChannelID hozzáadása a blacklisthez
                delete require.cache[require.resolve('./blacklist.js')];
                require('./blacklist.js').addChannel(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                    message.channel.sendMessage(msg);
                });
                is_a_command = true;
            } else if (lower.startsWith(cmdpref + 'remblchannel')) {
                // !remblchannel|ChannelID eltávolítása a blacklistből
                delete require.cache[require.resolve('./blacklist.js')];
                require('./blacklist.js').remChannel(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                    message.channel.sendMessage(msg);
                });
                is_a_command = true;
            }
            // osu irc rész
            else if (lower.startsWith(cmdpref + 'ircteszt')) {
                globs.client = reqreload('./osuirc.js').teszt(bot, globs);
            } else if (lower.startsWith(cmdpref + 'ircreload')) {
                // !ircreload|osu irc újraindítása
                if (globs.irc_online) {
                    reqreload('./osuirc.js').stop(bot, globs, message);
                    reqreload('./osuirc.js').start(bot, globs, message);
                } else {
                    message.channel.sendMessage('**[IRC] is not connected.**');
                }
            } else if (lower.startsWith(cmdpref + 'ircstart')) {
                // !ircstart|osu irc elindítása
                globs.client = reqreload('./osuirc.js').start(bot, globs, message);
            } else if (lower.startsWith(cmdpref + 'ircstop')) {
                // !ircstop|osu irc leállítása
                globs.client = reqreload('./osuirc.js').stop(bot, globs, message);
            }
            // üzenetküldés
            else if (globs.client != undefined && message.channel.id == globs.ch.osuirc) {
                if (lower.startsWith(cmdpref + 'to')) {
                    // !to|osu irc címzett váltás
                    message.delete();
                    globs.irc_channel = message.content.substr(cmdpref.length + 3);
                    message.channel.sendMessage('[IRC] Címzett: `' + globs.irc_channel + '`');
                } else {
                    message.delete();
                    var text = message.content;
                    reqreload('./osuirc.js').say(bot, globs, globs.irc_channel, text);
                }
            }
        } else if (lower.startsWith(cmdpref)){
            reqreload('./talk.js').wrongcommand(message);
        }


        if (mode != undefined) {
            switch (mode) {
                case 'cmdpref':
                    return callback({
                        'mode': 'cmdpref',
                        'cmdpref': cmdpref,
                        'is_a_command': is_a_command
                    });
                    break;
                case 'tsun':
                    return callback({
                        'mode': 'tsun',
                        'tsun': tsun,
                        'is_a_command': is_a_command
                    });
            }
        } else {
            return callback({
                'is_a_command': is_a_command
            });
        }
    }
}