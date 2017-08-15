// heartbeat.js
// anti discord silent disconnect module
var c = require('chalk');

module.exports = {
    start: (core) => {
        var role = '347072149451833344';
        core.heartbeat.state = core.bot.guilds.get('281188840084078594').members.get('267741038230110210')._roles.indexOf(role) >= 0;
        core.heartbeat.interval = setInterval(() => {
            if (core.heartbeat.state) {
                core.bot.guilds.get('281188840084078594').members.get('267741038230110210').removeRole(role);
                setTimeout(() => {
                    if (core.heartbeat.state == (core.bot.guilds.get('281188840084078594').members.get('267741038230110210')._roles.indexOf(role) >= 0)) {
                        throw Error('Heartbeat missed.');
                    } else {
                        core.heartbeat.state = !core.heartbeat.state;
                    }
                }, 2000)
            } else {
                core.bot.guilds.get('281188840084078594').members.get('267741038230110210').addRole(role);
                setTimeout(() => {
                    if (core.heartbeat.state == (core.bot.guilds.get('281188840084078594').members.get('267741038230110210')._roles.indexOf(role) >= 0)) {
                        throw Error('Heartbeat missed.'); 
                    }
                    else {
                        core.heartbeat.state = !core.heartbeat.state;
                    }
                }, 2000)
            }
        }, 5000);
        console.log(c.magenta('[Heartbeat]') + ' started');
    }
}