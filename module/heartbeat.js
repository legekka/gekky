// heartbeat.js
// anti discord silent disconnect module
var c = require('chalk');

module.exports = {
    start: (core) => {
        var role = '347072149451833344';
        core.discord.heartbeat.state = core.discord.bot.guilds.get('281188840084078594').members.get('267741038230110210')._roles.indexOf(role) >= 0;
        core.discord.heartbeat.interval = setInterval(() => {
            if (core.discord.heartbeat.state) {
                core.discord.bot.guilds.get('281188840084078594').members.get('267741038230110210').removeRole(role);
                setTimeout(() => {
                    if (core.discord.heartbeat.state == (core.discord.bot.guilds.get('281188840084078594').members.get('267741038230110210')._roles.indexOf(role) >= 0)) {
                        throw Error('Heartbeat missed. ' + require('./getTime.js')());
                    } else {
                        core.discord.heartbeat.state = !core.discord.heartbeat.state;
                    }
                }, 15000)
            } else {
                core.discord.bot.guilds.get('281188840084078594').members.get('267741038230110210').addRole(role);
                setTimeout(() => {
                    if (core.discord.heartbeat.state == (core.discord.bot.guilds.get('281188840084078594').members.get('267741038230110210')._roles.indexOf(role) >= 0)) {
                        throw Error('Heartbeat missed. ' + require('./getTime.js')()); 
                    }
                    else {
                        core.discord.heartbeat.state = !core.discord.heartbeat.state;
                    }
                }, 15000)
            }
        }, 20000);
        console.log(c.magenta('[Heartbeat]') + ' started');
    }
}