// dcommand.js
// specified commands

const reqreload = require('./reqreload.js');
const fs = require('fs');

var ownerid = '143399021740818432';

module.exports = (core, message, callback) => {
    var cmdpref = core.gsettings.getCmdpref(message.guild ? message.guild.id : message.channel.id);
    var tsun = core.gsettings.getTsun(message.guild ? message.guild.id : message.channel.id);
    var lower = message.content.toLowerCase();
    //if (!require('./blacklist.js').isBlacklisted(message)) {
    var is_a_command = false;
    if (lower.startsWith(cmdpref + 'lenny')) {
        reqreload('./command.js').lenny.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'weather')) {
        reqreload('./command.js').weather.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'help')) {
        reqreload('./command.js').help.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'git')) {
        reqreload('./command.js').help.run(message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'ver')) {
        reqreload('./command.js').help.run(message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'nhentai')) {
        reqreload('./command.js').nhentai.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + "sankaku")) {
        reqreload('./command.js').sankaku.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'waifu2x')) {
        reqreload('./command.js').waifu2x.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'waifucloud') || lower.split(' ')[0] == cmdpref + 'waifu') {
        reqreload('./command.js').waifucloud.run(core, message);
        is_a_command = true;
    } else if (lower == cmdpref + 'waifustats') {
        reqreload('./command.js').waifustats.run(core, message);
        is_a_command = true;
    } else if (lower == cmdpref + 'stats') {
        reqreload('./command.js').stats.run(core, message);
        is_a_command = true;
    } else if (message.author.id == ownerid) {
        // legekka-only commands
        if (lower.split(' ')[0] == cmdpref + 'kill') {
            reqreload('./command.js').kill.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'unkill') {
            reqreload('./command.js').unkill.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'del') {
            reqreload('./command.js').del.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'workdayinfo') {
            reqreload('./command.js').workdayinfo.run(core, message);
            is_a_command = true;
        } else if ((lower.indexOf("reggel") >= 0 || lower.indexOf("ohio") >= 0) && (lower.indexOf("momi") >= 0 || lower.indexOf("gekk") >= 0)) {
            reqreload('./command.js').ohio.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'motd') {
            reqreload('./command.js').motd.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'inv') {
            reqreload('./command.js').inv.run(message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'cmdpref') {
            reqreload('./command.js').cmdpref.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'tsun') {
            reqreload('./command.js').tsun.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'checkcache') {
            reqreload('./command.js').checkcache.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'clearcache') {
            reqreload('./command.js').delcache.run(message);
            is_a_command = true;
        }
        // blacklist commands 
        else if (lower.startsWith(cmdpref + 'addbluser')) {
            reqreload('./command.js').addbluser.run(core, message);
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'rembluser')) {
            // !rembluser|UserID eltávolítása a blacklistből
            delete require.cache[require.resolve('./blacklist.js')];
            require('./blacklist.js').remUser(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                message.channel.send(msg);
            });
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'addblchannel')) {
            // !addblchannel|ChannelID hozzáadása a blacklisthez
            delete require.cache[require.resolve('./blacklist.js')];
            require('./blacklist.js').addChannel(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                message.channel.send(msg);
            });
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'remblchannel')) {
            // !remblchannel|ChannelID eltávolítása a blacklistből
            delete require.cache[require.resolve('./blacklist.js')];
            require('./blacklist.js').remChannel(lower.split(' ')[1].substr(2).replace('>', ''), (msg) => {
                message.channel.send(msg);
            });
            is_a_command = true;
        }
        // osu irc rész
        else if (lower.startsWith(cmdpref + 'ircreload')) {
            // !ircreload|osu irc újraindítása
            if (core.irc_online) {
                reqreload('./osuirc.js').stop(core, message);
                reqreload('./osuirc.js').start(core, message);
            } else {
                message.channel.send('**[IRC] is not connected.**');
            }
        } else if (lower.startsWith(cmdpref + 'ircstart')) {
            // !ircstart|osu irc elindítása
            core.client = reqreload('./osuirc.js').start(core, message);
        } else if (lower.startsWith(cmdpref + 'ircstop')) {
            // !ircstop|osu irc leállítása
            core.client = reqreload('./osuirc.js').stop(core, message);
        }
        // WaifuCloud sitewrap
        else if (lower.startsWith(cmdpref + 'waifuwrap')) {
            var mode = lower.split(' ')[1];
            var tag = lower.split(' ')[2];
            reqreload('./wrapper.js').wrap(core, mode, tag);
        } else if (lower.startsWith(cmdpref + 'waifusync')) {
            reqreload('./wrapper.js').sync(core, message);
        }

        // üzenetküldés
        else if (core.client != undefined && message.channel.id == core.ch.osuirc) {
            if (lower.startsWith(cmdpref + 'to')) {
                // !to|osu irc címzett váltás
                message.delete();
                core.osuirc.irc_channel = message.content.substr(cmdpref.length + 3);
                message.channel.send('[IRC] Címzett: `' + core.osuirc.irc_channel + '`');
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
        'tsun': tsun,
        'cmdpref': cmdpref,
        'is_a_command': is_a_command
    });
    //}
}