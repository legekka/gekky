// channelpicker.js
// builds guild specified channel list for core

module.exports = {
    build: (core) => {
        core.discord.servers = [];
        var guilds = core.discord.bot.guilds.array();
        for (i in guilds) {
            var server = {
                name: '',
                channels: []
            }
            server.name = guilds[i].name;
            var channels = guilds[i].channels.array();
            for (j in channels) {
                if (channels[j].type == 'text') {
                    var channel = {
                        'name': channels[j].name,
                        'id': channels[j].id
                    }
                    server.channels.push(channel);
                }
            }
            core.discord.servers.push(server);
        }
        return core;
    },
    go: (core, d) => {
        if (!core.discord.picker.server && !core.discord.picker.channel) {
            console.log('Pick a server:');
            for (i in core.discord.servers) {
                console.log(i + ' - ' + core.discord.servers[i].name);
            }
            core.discord.picker.server = true;
            return core;
        } else if (core.discord.picker.server) {
            core.discord.picker.server = false;
            var cmd = d.toString().trim();
            if (core.discord.servers[cmd] == undefined) {
                console.log('Wrong parameter.')
                return core;
            } else {
                console.log('Pick a channel:');
                for (i in core.discord.servers[cmd].channels) {
                    console.log(i + ' - #' + core.discord.servers[cmd].channels[i].name)
                }
                core.discord.picker.id = cmd;
                core.discord.picker.channel = true;
                return core;
            }
        } else if (core.discord.picker.channel) {
            core.discord.picker.channel = false;
            var cmd = d.toString().trim();
            if (core.discord.servers[core.discord.picker.id].channels[cmd] == undefined) {
                console.log('Wrong parameter.')
                return core;
            } else {
                core.discord.ch.current = core.discord.servers[core.discord.picker.id].channels[cmd].id;
                console.log('Gekky went to #' + core.discord.servers[core.discord.picker.id].channels[cmd].name + '@' + core.discord.servers[core.discord.picker.id].name);
                core.discord.picker.id = '';
            }
        }
    },
    come: (core, message) => {
        core.discord.ch.current = message.channel.id;
        console.log('Gekky went to #' + message.channel.name + '@' + message.channel.guild.name);
    }
}
