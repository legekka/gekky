// channelpicker.js
// builds guild specified channel list for core

module.exports = {
    build: (core) => {
        core.servers = [];
        var guilds = core.bot.guilds.array();
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
            core.servers.push(server);
        }
        return core;
    },
    go: (core, d) => {
        if (!core.picker.server && !core.picker.channel) {
            console.log('Pick a server:');
            for (i in core.servers) {
                console.log(i + ' - ' + core.servers[i].name);
            }
            core.picker.server = true;
            return core;
        } else if (core.picker.server) {
            core.picker.server = false;
            var cmd = d.toString().trim();
            if (core.servers[cmd] == undefined) {
                console.log('Wrong parameter.')
                return core;
            } else {
                console.log('Pick a channel:');
                for (i in core.servers[cmd].channels) {
                    console.log(i + ' - #' + core.servers[cmd].channels[i].name)
                }
                core.picker.id = cmd;
                core.picker.channel = true;
                return core;
            }
        } else if (core.picker.channel) {
            core.picker.channel = false;
            var cmd = d.toString().trim();
            if (core.servers[core.picker.id].channels[cmd] == undefined) {
                console.log('Wrong parameter.')
                return core;
            } else {
                core.ch.current = core.servers[core.picker.id].channels[cmd].id;
                console.log('Gekky went to #' + core.servers[core.picker.id].channels[cmd].name + '@' + core.servers[core.picker.id].name);
                core.picker.id = '';
            }
        }
    },
    come: (core, message) => {
        core.ch.current = message.channel.id;
        console.log('Gekky went to #' + message.channel.name + '@' + message.channel.guild.name);
    }
}
