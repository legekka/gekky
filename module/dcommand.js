// dcommand.js
// specified commands


var dcommand = (core, message) => {
    if (message.channel.type != "text")
        return;
    var cmdpref = core.discord.dsettings.getCmdpref(message.guild.id);
    var tsun = core.discord.dsettings.getTsun(message.guild.id);
    var lower = message.content.toLowerCase();

    var commandModule = command;
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
                talk.wrongcommand(message);
            }
        } else if (message.author.id != core.discord.creatorID) {
            talk.wrongcommand(message);
        }
    }
    return is_a_command;
}