// processhandler.js
// process error handling

var reqreload = require('./reqreload.js');

module.exports = {
    start: (core) => {
        process.on('uncaughtException', function (error) {
            console.log(error.stack);
            if (core.discord.bot.channels.get(core.discord.ch.gekkyerrorlog) != undefined) {
                if (error.message.startsWith('Heartbeat missed.')) {
                    core.discord.bot.channels.get(core.discord.ch.gekkyerrorlog).send('```' + error.stack + '```').then(() => {
                        if (core.osuirc.ready) {
                            reqreload('./osuirc.js').stop(core);
                            setTimeout(() => {
                                core.discord.bot.destroy().then(() => {
                                    process.exit(3);
                                });
                            }, 2000);
                        } else {
                            process.exit(3);
                        }
                    })
                } else {
                    core.discord.bot.channels.get(core.discord.ch.gekkyerrorlog).send(`<@${core.discord.ownerID}>`).then(() => {
                        core.discord.bot.channels.get(core.discord.ch.gekkyerrorlog).send('```' + error.stack + '```').then(() => {
                            if (core.osuirc.ready) {
                                reqreload('./osuirc.js').stop(core);
                                setTimeout(() => {
                                    core.discord.bot.destroy().then(() => {
                                        process.exit(3);
                                    });
                                }, 2000);
                            } else {
                                process.exit(3);
                            }
                        })
                    });
                }
            } else {
                process.exit(3);
            }
        });
    }
}