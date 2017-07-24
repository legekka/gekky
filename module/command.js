// command.js
// specified commands

const reqreload = require('./reqreload.js');
const fs = require('fs');

var ownerid = '143399021740818432';

module.exports = (core, message, callback) => {
    var cmdpref = core.cmdpref;
    var tsun = core.tsun;
    var lower = message.content.toLowerCase();
    //if (!require('./blacklist.js').isBlacklisted(message)) {
    var is_a_command = false;
    if (lower.startsWith(cmdpref + 'lenny')) {
        // !lenny|Beszúr egy lenny fejet.
        message.channel.sendMessage('`' + message.author.username + '` ( ͡° ͜ʖ ͡°)');
        message.delete();
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'weather')) {
        // !weather|Időjárás információ. !weather <város>
        reqreload('./weather.js')(message.content.substr(cmdpref.length + 8), (response) => {
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
        message.channel.sendMessage('http://github.com/legekka/gekky');
    } else if (lower.startsWith(cmdpref + 'ver')) {
        // !ver|Kiírja a jelenlegi verziót.
        reqreload('./updater.js').fullver((resp) => {
            message.channel.sendEmbed({
                'title': resp.ver,
                'description': resp.desc
            })
        });
    } else if (lower.startsWith(cmdpref + 'nhentai')) {
        // !nhentai|Nhentai doujin kereső. !nhentai <tagek>
        reqreload('./sankaku.js').search(core, message, lower.substr(cmdpref.length + 'nhentai'.length + 1), "nhentai");
    } else if (message.author.id == ownerid) {
        // legekka-only commands
        if (lower.startsWith(cmdpref + 'kill')) {
            reqreload('./kill.js').adddeadlist(core, message.content.split(' ')[1]);
        } else if (lower.startsWith(cmdpref + 'unkill')) {
            reqreload('./kill.js').remdeadlist(core, message.content.split(' ')[1]);
        }
        else if (lower.startsWith(cmdpref + 'del')) {
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
            core.bot.user.setGame(motd);
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
            core.client = reqreload('./osuirc.js').teszt(core);
        } else if (lower.startsWith(cmdpref + 'ircreload')) {
            // !ircreload|osu irc újraindítása
            if (core.irc_online) {
                reqreload('./osuirc.js').stop(core, message);
                reqreload('./osuirc.js').start(core, message);
            } else {
                message.channel.sendMessage('**[IRC] is not connected.**');
            }
        } else if (lower.startsWith(cmdpref + 'ircstart')) {
            // !ircstart|osu irc elindítása
            core.client = reqreload('./osuirc.js').start(core, message);
        } else if (lower.startsWith(cmdpref + 'ircstop')) {
            // !ircstop|osu irc leállítása
            core.client = reqreload('./osuirc.js').stop(core, message);
        }
        // üzenetküldés
        else if (core.client != undefined && message.channel.id == core.ch.osuirc) {
            if (lower.startsWith(cmdpref + 'to')) {
                // !to|osu irc címzett váltás
                message.delete();
                core.irc_channel = message.content.substr(cmdpref.length + 3);
                message.channel.sendMessage('[IRC] Címzett: `' + core.irc_channel + '`');
            } else {
                message.delete();
                var text = message.content;
                reqreload('./osuirc.js').say(core, text);
            }
        }
    } else if (lower.startsWith(cmdpref)) {
        reqreload('./talk.js').wrongcommand(message);
    }
    return callback({
        'tsun': core.tsun,
        'cmdpref': core.cmdpref,
        'is_a_command': is_a_command
    });
    //}
}