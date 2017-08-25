// command.js
// commands

var reqreload = require('./reqreload.js');

module.exports = {
    lenny: {
        level: 0,
        help: "!lenny|Beszúr egy lenny fejet.",
        run: (core, message) => {
            message.channel.send('`' + message.author.username + '` ( ͡° ͜ʖ ͡°)');
            message.delete();
        }
    },
    weather: {
        level: 0,
        help: "!weather|Időjárás információ. !weather <város>",
        run: (core, message) => {
            reqreload('./weather.js')(message.content.substr(cmdpref.length + 8), (response) => {
                message.channel.send({ embed: response });
            });
        }
    },
    help: {
        level: 0,
        help: "!help|Lista a parancsokról, leírással.",
        run: (core, message) => {
            reqreload('./help.js').list(message, (list) => {
                var str = '';
                for (i in list) {
                    str += '**' + list[i].cmd + '**\n    *' + list[i].desc + '*\n';
                }
                while (str.replace('!', cmdpref) != str) {
                    str = str.replace('!', cmdpref);
                }
                message.channel.send({
                    embed: {
                        'title': 'Parancsok',
                        'description': str
                    }
                })
            });
        }
    },
    git: {
        level: 0,
        help: "!git|Kiírja gekky githubját.",
        run: (message) => {
            message.channel.send('http://github.com/legekka/gekky');
        }
    },
    ver: {
        level: 0,
        help: "!ver|Kiírja a jelenlegi verziót.",
        run: (message) => {
            reqreload('./updater.js').fullver((resp) => {
                message.channel.send({
                    embed: {
                        'title': resp.ver,
                        'description': resp.desc
                    }
                })
            });
        }
    },
    nhentai: {
        level: 0,
        help: "!nhentai|Nhentai doujin kereső. !nhentai <tagek>",
        run: (core, message) => {
            var tags = message.content.toLowerCase().split(' ');
            tags.splice(0, 1);
            reqreload('./sankaku.js').search(core, message, tags, "nhentai");
        }
    },
    sankaku: {
        level: 0,
        help: "!sankaku|Sankaku kép kereső. !sankaku <tagek>",
        run: (core, message) => {
            var tags = message.content.toLowerCase().split(' ');
            tags.splice(0, 1);
            reqreload('./sankaku.js').search(core, message, tags, "sankaku");
        }
    },
    waifu2x: {
        level: 0,
        help: "!waifu2x|Waifu2x-caffe imageupconvert. !waifu2x <image-url> [BETA]",
        run: (core, message) => {
            require('./yrexia.js').waifu2x(core, message, message.content.split(' ')[1].trim());
        }
    },
    waifucloud: {
        level: 0,
        help: "!waifucloud|WaifuCloud kép kereső. !waifucloud <tagek> vagy !waifu <tagek>",
        run: (core, message) => {
            var tags = message.content.toLowerCase().split(' ');
            tags.splice(0, 1);
            reqreload('./sankaku.js').search(core, message, tags, "waifucloud", "random");
        }
    },
    waifustats: {
        level: 0,
        help: "!waifustats|WaifuCloud adatbázis adatok.",
        run: (core, message) => {
            reqreload('./waifucloud.js').stats(core, message);
        }
    },
    stats: {
        level: 0,
        help: "!stats|Gekky adatai.",
        run: (core, message) => {
            reqreload('./memwatch.js').stats(core, message);
        }
    },
    kill: {
        level: 1,
        help: "!kill|Megöli gekky az alanyt. !kill @user#1234",
        run: (core, message) => {
            reqreload('./kill.js').adddeadlist(core, message);
        }
    },
    unkill: {
        level: 1,
        help: "!kill|Meggondolja magát.",
        run: (core, message) => {
            reqreload('./kill.js').remdeadlist(core, message);
        }
    },
    del: {
        level: 1,
        help: "!del|Üzenet törlő. !del <üzenetszám>",
        run: (core, message) => {
            var number = message.content.split(' ')[1];
            if (!isNaN(number)) {
                var number = parseInt(number);
                if (number > 50) {
                    message.channel.send('Maximum 50 üzenet törölhető.');
                } else {
                    message.channel.bulkDelete(number + 1).then(() => {
                        message.channel.send(number + ' üzenet törölve.').then((message) => {
                            var msg = message;
                            setTimeout(() => {
                                msg.delete();
                            }, 2000);
                        })
                    });
                }
            } else {
                message.channel.send('Helytelen paraméter: ' + number);
            }
        }
    },
    workdayinfo: {
        level: 3,
        help: "!workdayinfo|Munkanappal kapcsolatos információk.",
        run: (core, message) => {
            reqreload('./workdayinfo.js')((response) => {
                message.channel.send({ embed: response });
            });
        }
    },
    ohio: {
        level: 3,
        help: "ohayo owo",
        run: (core, message) => {
            reqreload('./assistant.js').ohio(message);
        }
    },
    motd: {
        level: 2,
        help: "!motd|'playing <game>' megváltoztatására. !motd <szó>",
        run: (core, message) => {
            motd = message.content.substr(cmdpref.length + 'motd'.length + 1);
            core.discord.bot.user.setGame(motd);
        }
    },
    inv: {
        level: 1,
        help: "!inv|Gekky invite linkje.",
        run: (message) => {
            message.channel.send('https://discordapp.com/oauth2/authorize?&client_id=267741038230110210&scope=bot');
        }
    },
    cmdpref: {
        level: 1,
        help: "!cmdpref|Parancs prefix megváltoztatása. !cmdpref <karakter>",
        run: (core, message) => {
            var cmdpref = message.content.split(' ')[1];
            if (cmdpref == '') {
                cmdpref = '!';
            }
            message.channel.send('New prefix: `' + cmdpref + '`');
            core.gsettings.setCmdpref(message.guild ? message.guild.id : message.channel.id, cmdpref);
        }
    },
    tsun: {
        level: 1,
        help: "!tsun|Tsundere mód kapcsoló.",
        run: (core, message) => {
            var tsun = core.gsettings.getTsun(message.guild ? message.guild.id : message.channel.id);;
            if (tsun) {
                message.channel.send('Nah.');
            } else {
                message.channel.send('O-okay.');
            }
            core.gsettings.setTsun(message.guild ? message.guild.id : message.channel.id, resp.tsun);
        }
    },
    checkcache: {
        level: 2,
        help: "!checkcache|Cache méret ellenőrzése.",
        run: (core, message) => {
            reqreload('./cachemanager.js').check(core, message);
        }
    },
    delcache: {
        level: 2,
        help: "!delcache|Cache mappa ürítése.",
        run: (message) => {
            reqreload('./cachemanager.js').del(message);
        }
    },
    addbluser: {
        level: 1,
        help: "!addbluser|Felhasználó hozzáadása a blacklisthez.",
        run: (message) => {
            reqreload('./blacklist.js').addUser(message.content.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                message.channel.send(msg);
            });
        }
    },
    rembluser: {
        level: 1,
        help: "!rembluser|UserID eltávolítása a blacklistből",
        run: (message) => {
            reqreload('./blacklist.js').remUser(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                message.channel.send(msg);
            });
        }
    },
    addblchannel: {
        level: 1,
        help: "!addblchannel|ChannelID hozzáadása a blacklisthez",
        run: (message) => {
            reqreload('./blacklist.js').addChannel(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                message.channel.send(msg);
            });
        }
    },
    remblchannel: {
        level: 1,
        help: "!remblchannel|ChannelID eltávolítása a blacklistből",
        run: (message) => {
            reqreload('./blacklist.js').remChannel(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                message.channel.send(msg);
            });
        }
    },
    ircreload: {
        level: 2,
        help: "!irc:reload|osu irc újraindítása",
        run: (core, message) => {
            if (core.irc_online) {
                reqreload('./osuirc.js').stop(core, message);
                reqreload('./osuirc.js').start(core, message);
            } else {
                message.channel.send('**[IRC] is not connected.**');
            }
        }
    },
    ircstart: {
        level: 2,
        help: "!irc:start|osu irc elindítása",
        run: (core, message) => {
            core.client = reqreload('./osuirc.js').start(core, message);
        }
    },
    ircstop: {
        level: 2,
        help: "!irc:stop|osu irc leállítása",
        run: (core, message) => {
            core.client = reqreload('./osuirc.js').stop(core, message);
        }
    },
    waifuwrap: {
        level: 2,
        help: "!waifu:wrap|WaifuCloud oldalwrapper. !waifu:wrap <mode> <tags>",
        run: (core, message) => {
            var mode = message.content.toLowerCase().split(' ')[1];
            var tag = message.content.toLowerCase().split(' ')[2];
            reqreload('./wrapper.js').wrap(core, mode, tag);
        }
    },
    waifusync: {
        level: 2,
        help: "!waifu:sync|WaifuCloud wrapper szinkronizálás.",
        run: (core, message) => {
            reqreload('./wrapper.js').sync(core, message);
        }
    },
    ircto: {
        level: 2,
        help: "!to|osu!irc címzett váltása.",
        run: (core, message) => {
            message.delete();
            core.osuirc.irc_channel = message.content.substr(cmdpref.length + 3);
            message.channel.send('[IRC] Címzett: `' + core.osuirc.irc_channel + '`');
        }
    },
    ircsay: {
        level: 2,
        help: "ircsay|osu!irc discord channelben automata üzenetküldés",
        run: (core, message) => {
            message.delete();
            var text = message.content;
            reqreload('./osuirc.js').say(core, text);
        }
    }
}