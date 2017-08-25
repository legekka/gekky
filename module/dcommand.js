// dcommand.js
// specified commands

const reqreload = require('./reqreload.js');
const fs = require('fs');
/*
module.exports = (core, message) => {
    var cmdpref = core.discord.dsettings.getCmdpref(message.guild ? message.guild.id : message.channel.id);
    var tsun = core.discord.dsettings.getTsun(message.guild ? message.guild.id : message.channel.id);
    var lower = message.content.toLowerCase();
    //if (!require('./blacklist.js').isBlacklisted(message)) {
    var command = reqreload('./command.js');
    var is_a_command = false;
    if (lower.startsWith(cmdpref + 'lenny')) {
        command.lenny.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'weather')) {
        command.weather.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'help')) {
        command.help.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'git')) {
        command.git.run(message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'ver')) {
        command.ver.run(message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'nhentai')) {
        command.nhentai.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + "sankaku")) {
        command.sankaku.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'waifu2x')) {
        command.waifu2x.run(core, message);
        is_a_command = true;
    } else if (lower.startsWith(cmdpref + 'waifucloud') || lower.split(' ')[0] == cmdpref + 'waifu') {
        command.waifucloud.run(core, message);
        is_a_command = true;
    } else if (lower == cmdpref + 'waifustats') {
        command.waifustats.run(core, message);
        is_a_command = true;
    } else if (lower == cmdpref + 'stats') {
        command.stats.run(core, message);
        is_a_command = true;
    } else if (core.discord.creatorID == message.author.id) {
        // legekka-only commands
        if (lower.split(' ')[0] == cmdpref + 'kill') {
            command.kill.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'unkill') {
            command.unkill.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'del') {
            command.del.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'workdayinfo') {
            command.workdayinfo.run(core, message);
            is_a_command = true;
        } else if ((lower.indexOf("reggel") >= 0 || lower.indexOf("ohio") >= 0) && (lower.indexOf("momi") >= 0 || lower.indexOf("gekk") >= 0)) {
            command.ohio.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'motd') {
            command.motd.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'inv') {
            command.inv.run(message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'cmdpref') {
            command.cmdpref.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'tsun') {
            command.tsun.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'checkcache') {
            command.checkcache.run(core, message);
            is_a_command = true;
        } else if (lower.split(' ')[0] == cmdpref + 'clearcache') {
            command.delcache.run(message);
            is_a_command = true;
        }
        // blacklist commands 
        else if (lower.startsWith(cmdpref + 'addbluser')) {
            command.addbluser.run(message);
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'rembluser')) {
            command.rembluser.run(message);
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'addblchannel')) {
            command.addblchannel.run(message);
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'remblchannel')) {
            command.remblchannel.run(message)
            is_a_command = true;
        }
        // osu irc rész
        else if (lower.startsWith(cmdpref + 'irc:reload')) {
            command.ircreload.run(core, message);
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'irc:start')) {
            command.ircstart.run(core, message);
            core.client = reqreload('./osuirc.js').start(core, message);
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'irc:stop')) {
            command.ircstop.run(core, message);
            is_a_command = true;
        }
        // WaifuCloud sitewrap
        else if (lower.startsWith(cmdpref + 'waifu:wrap')) {
            command.waifuwrap.run(core, message);
            is_a_command = true;
        } else if (lower.startsWith(cmdpref + 'waifu:sync')) {
            command.waifusync.run(core, message);
            is_a_command = true;
        }

        // osu!irc üzenetküldés és channelváltás
        else if (core.osuirc.client != undefined && message.channel.id == core.discord.ch.osuirc) {
            if (lower.startsWith(cmdpref + 'to')) {
                command.ircto.run(core, message);
            } else {
                command.ircsay.run(core, message);
            }
        }
    } else if (lower.startsWith(cmdpref)) {
        reqreload('./talk.js').wrongcommand(message);
    }
    return is_a_command;
    //}
}
*/
module.exports = (core, message) => {
    if (message.channel.type != "text")
        return;
    var cmdpref = core.discord.dsettings.getCmdpref(message.guild.id);
    var tsun = core.discord.dsettings.getTsun(message.guild.id);
    var lower = message.content.toLowerCase();

    var commandModule = reqreload('./command.js');
    var is_a_command = false;
    var cmd = lower.split(' ')[0].substr(cmdpref.length).replace(':', '_');

    if (core.osuirc.client != undefined && message.channel.id == core.discord.ch.osuirc && message.author.id == core.discord.ownerID) {
        if (lower.startsWith(cmdpref + 'to')) {
            commandModule.ircto.run(core, message);
        } else {
            commandModule.ircsay.run(core, message);
        }
    } else if (message.content.startsWith(cmdpref)) {

        var command = commandModule[cmd];

        if (command) {
            if (core.discord.dsettings.level(core, message.author.id, message.guild.id) >= command.level) {
                command.run(core, message);
                is_a_command = true;
            }
            else{
                reqreload('./talk.js').wrongcommand(message);
            }
        } else if (message.author.id != core.discord.creatorID) {
            reqreload('./talk.js').wrongcommand(message);
        }
    }
    return is_a_command;
}