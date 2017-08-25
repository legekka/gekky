// memwatch.js
// memory-leak watcher

var limit = 500;

module.exports = {
    start: (core) => {
        setInterval(() => {
            var memrss = process.memoryUsage().rss;
            if (memrss / 1024 / 1024 > limit) {
                console.log('Memory overload: ' + (memrss / 1024 / 1024).toFixed(2) + ' MB / ' + limit.toFixed(2) + " MB");
                if (core.discord.ready) {
                    core.discord.bot.channels.get(core.discord.ch.gekkyerrorlog).send('Memory overload: ' + (memrss / 1024 / 1024).toFixed(2) + ' MB / ' + limit.toFixed(2) + " MB");
                    if (core.osuirc.ready) {
                        reqreload('./osuirc.js').stop(core, message);
                        setTimeout(() => {
                            core.discord.bot.destroy().then(() => {
                                process.exit(2);
                            });
                        }, 2000);
                    } else {
                        core.discord.bot.destroy().then(() => {
                            process.exit(2);
                        })
                    }
                } else {
                    if (core.osuirc.ready) {
                        reqreload('./osuirc.js').stop(core, message);
                        setTimeout(() => {
                            process.exit(2);
                        }, 2000);

                    } else {
                        process.exit(2);
                    }
                }
            }
            memrss = null;
        }, 1000);
    },
    stats: (core, message) => {
        var memrss = process.memoryUsage().rss;
        memrss = (memrss / 1024 / 1024).toFixed(2);
        if (message != undefined) {
            message.channel.send({embed:
                {
                    'title': 'Gekky-Status',
                    'description': 'Uptime: ' + format(process.uptime()) +'\nRam usage: ' + memrss + ' MB'
                }
            })
        }
    }
}

function format(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}
