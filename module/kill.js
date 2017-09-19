// kill.js
// just a joke


var kill = {
    kill: (core, message) => {
        if (core.discord.dsettings.deadContains(message.guild.id, message.author.id)) {
            message.delete();
        }
    },
    adddeadlist: (core, message) => {
        core.discord.dsettings.addDead(message.guild.id, kill.getID(message));
        return core;
    },
    remdeadlist: (core, message) => {
        core.discord.dsettings.removeDead(message.guild.id, kill.getID(message));
        return core;
    },
    getID: (message) => {
        var id = message.content.split('@')[1].split('>')[0];
        if (id.indexOf('!') >= 0) {
            id = id.substr(1);
        }
        return id;
    }
}