// nyugi csak egy vicc
var reqreload = require('./reqreload.js');

function getID(message) {
    var id = message.content.split('@')[1].split('>')[0];
    if (id.indexOf('!') >= 0) {
        id = id.substr(1);
    }
    return id;
}


module.exports = {
    kill: (core, message) => {
        if (core.discord.gsettings.deadContains(message.guild ? message.guild.id : message.channel.id, message.author.id)) {
            message.delete();
        }
    },
    adddeadlist: (core, message) => {
        core.discord.gsettings.addDead(message.guild ? message.guild.id : message.channel.id, getID(message));
        return core;
    },
    remdeadlist: (core, message) => {
        core.discord.gsettings.removeDead(message.guild ? message.guild.id : message.channel.id, getID(message));
        return core;
    }
}